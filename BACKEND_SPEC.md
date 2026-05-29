# Spec backend Supabase — CETé

> Généré le : 2026-05-29 · Consolide : `ENTITIES_MAP.md` + `IMPLICIT_BUSINESS_LOGIC.md` + `PROJECT_RECON.md` + décisions produit Etienne.
> Étape 00.03 (`prompts/00-audit-logique-metier/03-spec-backend-complete`). **Document de spec — PAS de SQL exécutable** (généré en B2). Markdown structuré, traduit ensuite en migrations + Server Actions + RPCs.
> Conventions : tables `snake_case` pluriel · RLS sur toutes les tables · Supabase-natif (vues/RPC/triggers) prioritaire. Email **hors scope** (contact V2 ; conflit convention Brevo vs décision Resend à trancher en V2).

---

## 1. Synthèse exécutive

- **Tables : 13** · **FK réelles : 12** (+ 3 `uuid[]` non-FK pour les assignations) · **Triggers/fonctions : 7** · **Vues : 4** (dont `v_certificate_public`) · **RPC : 2** · **Buckets Storage : 3** · **Server Actions principales : ~16** · **Realtime : 0 requis**.
- **Stack** : Next.js 16 (App Router, RSC + Server Actions) · Supabase Postgres + Auth + RLS + Storage · `@supabase/ssr`. Hosting VPS OVH (Coolify).
- **Verticale** : agence de notation/certification du risque électrique (B2B audit-inspection + portail client + vérification publique de certificat).
- **Décisions produit intégrées** : (A1) certificats `valide` lisibles anon · (B1) `profiles.client_id` **UNIQUE** (1 client = 1 compte), pages client filtrent par `client_id` · admin+client uniquement · (B6) `founders` & `settings` en DB lecture anon · auditeur = **founder** · certificat **déposé par l'admin** (upload PDF + champs) pour download client (**pas d'auto-émission**).
- **RLS** : posture **simple et fonctionnelle** (admin = tout · client = ses données · anon = lectures publiques). **Sécurité minimale actée** : `WITH CHECK` sur toutes les écritures + trigger anti-escalade `profiles` + lecture anon des certificats via **vue** (jamais la table) — cf. §7.
- **Durci post-vérification (2026-05-29)** : intègre les correctifs de la vérification adversariale (3 bloquants + 18 majeurs). Décisions complémentaires Etienne : i18n `founders`/`settings` en `jsonb {fr,en}` · `organizations` reste statique (pas de table) · liens certificats démo manquants → `NULL` au seed · suppression client = **RESTRICT** (soft-archive). Détails : §13 (mapping/seed) + §11.

---

## 2. Schéma de base de données

> Conventions communes : `id uuid PK default gen_random_uuid()` (sauf `profiles`/`settings`) · `created_at timestamptz not null default now()` · `updated_at timestamptz not null default now()` (+ trigger `set_updated_at`) · toutes les tables : `alter table … enable row level security`.
> Ordre de création (FK) : `clients → profiles → founders → settings → contract_documents → certificates → evaluations → client_documents → notifications → notification_reads → resources → articles` (+ `client_contacts` après `clients`).
> **i18n** : champs **traduits** (`founders.role/bio/specialties`, `settings.business_hours`) en `jsonb {fr,en}` ; champs neutres en `text`. Les autres entités app (resources/documents/articles) restent **mono-langue (FR)** en Phase 1 — l'UI reste i18n via next-intl ; bilinguisme des **données** app = hors scope.
> **`organizations`** : **PAS de table** (décision Etienne). Logos d'accueil = **JSON statique** ; page `/admin/organizations` en **lecture seule** (hors scope migration).

### clients
| Colonne | Type PG | Contraintes |
|---|---|---|
| id | uuid | PK default gen_random_uuid() |
| slug | text | NOT NULL UNIQUE |
| company_name | text | NOT NULL |
| legal_form | text | NOT NULL CHECK (cf. §3) |
| siret | text | NOT NULL UNIQUE |
| vat_number | text | |
| sector | text | NOT NULL CHECK (cf. §3) |
| headcount | text | |
| address_street | text | NOT NULL |
| address_postal_code | text | NOT NULL |
| address_city | text | NOT NULL |
| address_country | text | NOT NULL DEFAULT 'France' |
| status | text | NOT NULL CHECK DEFAULT 'onboarding' |
| contract_start_date | date | |
| contract_end_date | date | |
| internal_notes | text | NOT NULL DEFAULT '' |
| created_at / updated_at | timestamptz | NOT NULL DEFAULT now() |

PK `id`. Indexes : `slug`(unique), `siret`(unique), `status`, `sector`, `address_city`, trigram sur `company_name` (recherche). RLS : admin all ; client SELECT sa propre ligne (`id = current_client_id()`). `address_*` inline (et non JSONB) car la recherche admin filtre par ville.

### profiles  *(extension de auth.users)*
| Colonne | Type PG | Contraintes |
|---|---|---|
| id | uuid | PK references auth.users(id) ON DELETE CASCADE |
| email | text | NOT NULL |
| name | text | NOT NULL DEFAULT '' |
| role | text | NOT NULL CHECK (role in ('admin','client')) DEFAULT 'client' |
| client_id | uuid | **UNIQUE** references clients(id) ON DELETE SET NULL |
| company | text | |
| phone | text | |
| is_active | boolean | NOT NULL DEFAULT true |
| created_at / updated_at | timestamptz | NOT NULL DEFAULT now() |

PK `id`. `client_id` **UNIQUE** (décision B1 : 1-1 ; NULLs multiples autorisés pour les admins). Index `role`, `client_id`. RLS : SELECT/UPDATE own (`id = auth.uid()`) ; admin all. Création via trigger `handle_new_user` (§6).

### client_contacts
| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| client_id | uuid | NOT NULL references clients(id) ON DELETE CASCADE |
| first_name / last_name / role | text | NOT NULL |
| email / phone | text | |
| is_primary | boolean | NOT NULL DEFAULT false |

Index `client_id`. **Unique partiel** : `unique (client_id) where is_primary` (un seul contact principal/client — *à valider, cf. §11*). RLS : admin all ; client SELECT where `client_id = current_client_id()`.

### founders  *(lecture publique — décision B6)*
| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| name | text | NOT NULL  *(neutre)* |
| role | jsonb | NOT NULL  *({fr, en} — traduit)* |
| bio | jsonb | NOT NULL  *({fr, en} — traduit)* |
| specialties | jsonb | NOT NULL DEFAULT '{"fr":[],"en":[]}'  *({fr:[], en:[]})* |
| image_url | text | NOT NULL DEFAULT '' |
| image_position | text | |
| visible | boolean | NOT NULL DEFAULT true |
| former_org / current_entity | text | *(neutre)* |
| created_at / updated_at | timestamptz | NOT NULL DEFAULT now() |

RLS : **anon SELECT where `visible = true`** (vitrine) ; admin all (USING+WITH CHECK `is_admin()`). Référencée par `evaluations.auditor_id` (auditeur = founder). **Seed bilingue** : fusionner `fr/founders.json` + `en/founders.json` → `role`/`bio`/`specialties` en `{fr,en}` ; remap `id` mock (`"1"`…) → uuid (§13) ; `visible` absent → `true`.

### settings  *(singleton — lecture publique, décision B6)*
| Colonne | Type | Contraintes |
|---|---|---|
| id | int | PK DEFAULT 1 CHECK (id = 1) |
| company / address / city / country / phone / email / website | text | NOT NULL  *(neutre)* |
| business_hours | jsonb | NOT NULL  *({fr, en} — 7 jours, libellés traduits)* |
| map_latitude / map_longitude | numeric | |
| updated_at | timestamptz | NOT NULL DEFAULT now() |

Singleton (1 ligne). RLS : **anon SELECT** (footer/contact publics) ; admin UPDATE (WITH CHECK `is_admin()`). **Seed bilingue** : fusionner `fr/contact_info.json` + `en/contact_info.json` → `business_hours` en `{fr,en}` ; aplatir `maps.{latitude,longitude}` → `map_latitude/longitude` ; `id=1`. Unifie `getContactInfo()` public ↔ `settings.repo` admin.

### contract_documents  *(documents contractuels internes — admin only)*
| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| client_id | uuid | NOT NULL references clients(id) ON DELETE CASCADE |
| type | text | NOT NULL CHECK (cf. §3) |
| title | text | NOT NULL |
| version | int | NOT NULL DEFAULT 1 |
| file_name | text | NOT NULL |
| file_size | bigint | NOT NULL DEFAULT 0 |
| mime_type | text | NOT NULL DEFAULT 'application/pdf' |
| storage_path | text | *(chemin bucket `contract-documents`)* |
| uploaded_at | timestamptz | NOT NULL DEFAULT now() |
| uploaded_by | uuid | references profiles(id) ON DELETE SET NULL |
| status | text | NOT NULL CHECK DEFAULT 'draft' |
| notes | text | |

Index `client_id`, `type`, `status`. RLS : **admin only** (interne, USING+WITH CHECK `is_admin()`). Référencé par `evaluations.report_document_id`. `storage_path` nullable **uniquement** pour les lignes historiques seedées (fichiers fictifs) ; tout nouvel upload via Server Action le renseigne. Pas de `created_at/updated_at` (le `uploaded_at` fait foi → pas de trigger `set_updated_at` ici).

### certificates  *(déposé par l'admin · vérification publique)*
| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| certificate_number | text | NOT NULL UNIQUE  *(ex CERT-2026-0042)* |
| client_id | uuid | NOT NULL references clients(id) ON DELETE **RESTRICT** |
| company_name / siren / address | text | NOT NULL  *(snapshot point-in-time)* |
| composite_rating | text | NOT NULL CHECK (composite_rating ~ '^[A-D]{3}$') |
| vigi_score | text | NOT NULL CHECK (A/B/C/D) |
| vigi_score_tendance | text | CHECK (in ('+','-','')) DEFAULT '' |
| sub_criteria | jsonb | NOT NULL  *(ThreeCScore)* |
| evaluation_date / validity_date | date | NOT NULL |
| expert_name | text | NOT NULL |
| status | text | NOT NULL CHECK (valide/expire/revoque) DEFAULT 'valide' |
| pdf_storage_path | text | *(PDF déposé par l'admin, bucket `certificates`)* |
| created_at | timestamptz | NOT NULL DEFAULT now() |

Index `client_id`, `certificate_number`(unique), `status`. **PK uuid**. `/verifier/[id]` utilisera l'uuid. **`ON DELETE RESTRICT`** : interdit de hard-delete un client ayant des certificats (valeur juridique + URL publiques) → soft-archive. RLS : **anon ne lit PAS la table** (fuite `client_id`/`pdf_storage_path`/`siren`) → lecture publique via la **vue `v_certificate_public`** (§4 : colonnes minimales, `status='valide' AND validity_date >= current_date`) ; client SELECT own (`client_id = current_client_id()`) ; admin all (WITH CHECK `is_admin()`). `pdf_storage_path` nullable (fallback jsPDF pour les certificats historiques sans fichier déposé).

### evaluations
| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| client_id | uuid | NOT NULL references clients(id) ON DELETE **RESTRICT**  *(préserve l'historique d'audit)* |
| site_name / site_address | text | NOT NULL |
| visit_date | date | NOT NULL |
| vigi_score | text | CHECK (A/B/C/D) |
| omt_score | jsonb | *(ThreeCScore, nullable tant que non complétée)* |
| composite_rating | text | CHECK (composite_rating ~ '^[A-D]{3}$' OR composite_rating IS NULL) |
| certificate_id | uuid | references certificates(id) ON DELETE SET NULL  *(NULL au seed pour les 3 certifs démo absents)* |
| auditor_id | uuid | NOT NULL references **founders(id)** ON DELETE RESTRICT |
| status | text | NOT NULL CHECK DEFAULT 'scheduled' |
| report_document_id | uuid | references contract_documents(id) ON DELETE SET NULL |
| next_evaluation_due | date | |
| notes | text | |
| created_at / updated_at | timestamptz | |

Index `client_id`, `status`, `auditor_id`, `visit_date`. RLS : admin all ; client SELECT own (`client_id = current_client_id()`). `auditor_id → founders` (décision).

### client_documents  *(portail client)*
| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| title | text | NOT NULL |
| category | text | NOT NULL CHECK (newsletters/capsules/guides/carnets) |
| type | text | NOT NULL CHECK (pdf/video) |
| description | text | NOT NULL DEFAULT '' |
| file_size | text | |
| duration | text | |
| upload_date | date | NOT NULL DEFAULT current_date |
| url | text | |
| youtube_id | text | |
| access_type | text | CHECK (in ('view-only','download')) |
| visibility | text | NOT NULL CHECK (global/assigned) DEFAULT 'global' |
| assigned_client_ids | uuid[] | NOT NULL DEFAULT '{}'  *(cf. §11 décision ClientScoped)* |
| created_at / updated_at | timestamptz | |

Index `category`, GIN sur `assigned_client_ids`. RLS : admin all ; client SELECT where `visibility='global' OR current_client_id() = ANY(assigned_client_ids)`.

### notifications
| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| type | text | NOT NULL CHECK (veille/document/info) |
| message | text | NOT NULL |
| date | date | NOT NULL DEFAULT current_date |
| visibility | text | NOT NULL CHECK (global/assigned) DEFAULT 'global' |
| assigned_client_ids | uuid[] | NOT NULL DEFAULT '{}' |
| created_at | timestamptz | NOT NULL DEFAULT now() |

GIN sur `assigned_client_ids`. RLS : admin all ; client SELECT where `visibility='global' OR current_client_id() = ANY(assigned_client_ids)`. **Pas de colonne `read`** : l'état lu est par-client → table `notification_reads`.

### notification_reads  *(état « lu » par client — modèle propre, décision #2)*
| Colonne | Type | Contraintes |
|---|---|---|
| notification_id | uuid | NOT NULL references notifications(id) ON DELETE CASCADE |
| user_id | uuid | NOT NULL references profiles(id) ON DELETE CASCADE |
| read_at | timestamptz | NOT NULL DEFAULT now() |

PK composite `(notification_id, user_id)`. Chaque client/utilisateur gère SON propre « lu ». RLS : INSERT/SELECT/DELETE own (`user_id = auth.uid()`) ; admin all. **Non lues (par client)** = notifs visibles SANS ligne `notification_reads` pour `(notif, auth.uid())`.

### resources
| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| title / description | text | NOT NULL |
| category | text | NOT NULL CHECK (normes/reglementation/guides/rapports/veille) |
| type | text | NOT NULL CHECK (pdf/lien/video) |
| access_type | text | NOT NULL CHECK (in ('view-only','download')) |
| url | text | NOT NULL |
| youtube_id / file_size / source | text | |
| published_date | date | |
| visibility | text | NOT NULL CHECK DEFAULT 'global' |
| assigned_client_ids | uuid[] | NOT NULL DEFAULT '{}' |
| created_at / updated_at | timestamptz | |

*(Le double timestamp `createdAt`+`created_at` du type est consolidé en `created_at`/`updated_at`.)* RLS : admin all ; client SELECT where `visibility='global' OR current_client_id() = ANY(assigned_client_ids)`.

### articles  *(blog admin)*
| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| title / excerpt | text | NOT NULL |
| author | text | NOT NULL  *(texte libre — pas de FK, cf. §11)* |
| category | text | NOT NULL CHECK (Expertise/Formation/Réglementation/Sécurité/Innovation) |
| status | text | NOT NULL CHECK (published/draft) DEFAULT 'draft' |
| published_date | date | |
| views | int | NOT NULL DEFAULT 0 |
| featured | boolean | NOT NULL DEFAULT false |
| video_url | text | |
| created_at / updated_at | timestamptz | |

Index `status`, `featured`. RLS : admin all ; **anon SELECT where `status='published'`** (forward-looking blog public ; sans impact tant que la vitrine lit `BlogPost` statique).

---

## 3. Énumérations (CHECK constraints)

| Enum (CHECK) | Valeurs | Table.colonne |
|---|---|---|
| role | admin, client | profiles.role |
| client_legal_form | SAS, SARL, SA, EURL, SCI, autre | clients.legal_form |
| client_sector | industrie, tertiaire, logistique, medical, erp_collectif, immobilier, autre | clients.sector |
| client_status | active, onboarding, paused, archived | clients.status |
| contract_document_type | offer, quote, contract, addendum, resource, report, other | contract_documents.type |
| contract_document_status | draft, sent, signed, archived | contract_documents.status |
| evaluation_status | scheduled, in_progress, completed, cancelled | evaluations.status |
| vigi_score_grade | A, B, C, D | evaluations.vigi_score, certificates.vigi_score |
| certificate_status | valide, expire, revoque | certificates.status |
| document_category | newsletters, capsules, guides, carnets | client_documents.category |
| document_type | pdf, video | client_documents.type |
| notification_type | veille, document, info | notifications.type |
| resource_category | normes, reglementation, guides, rapports, veille | resources.category |
| resource_type | pdf, lien, video | resources.type |
| access_type | view-only, download | client_documents.access_type, resources.access_type |
| visibility | global, assigned | client_documents/notifications/resources.visibility |
| article_category | Expertise, Formation, Réglementation, Sécurité, Innovation | articles.category |
| article_status | published, draft | articles.status |

> CHECK plutôt que `CREATE TYPE` (plus souple, conforme reco). `composite_rating` : `text` + CHECK `^[A-D]{3}$` (3 lettres A-D, ex "BAB"). Source de vérité = l'évaluation ; le certificat en reçoit une copie (snapshot).

---

## 4. Vues et agrégations (Type 1)

### v_admin_dashboard_stats *(vue simple)*
KPI « Organisations notées / Documents publiés / Articles publiés ». Ratio lecture>>écriture mais counts triviaux → **vue simple** (pas matérialisée).
```
select
  (select count(*) from profiles where role='client' and is_active) as active_clients, -- aligné stats.repo (comptes clients actifs, PAS clients.status)
  (select count(*) from client_documents)                            as published_documents,
  (select count(*) from articles where status='published')           as published_articles;
```
> ⚠️ Les *trends* `+12%/+8%/+5%` sont **factices** (cf. §11) → à retirer ou calculer vs N-1.

### v_vigi_distribution *(vue simple ou RPC)*
Répartition Vigi-Score des évaluations complétées (dashboard `VigiDistribution`).
```
select vigi_score, count(*) as n
from evaluations
where status='completed' and vigi_score is not null
group by vigi_score;
```
Front recompose A/B/C/D, conformes (A+B), alerte (C+D), total.

### v_client_evaluation_counts *(vue simple)*
`ClientKpiCards` + colonne `evalCounts` de la table clients.
```
select client_id, status, count(*) n from evaluations group by client_id, status;
```
Dérive activeCount (clients), scheduled/in_progress/completed (évals).

### v_certificate_public *(vue — vérification publique anon)*
Lecture anon SÛRE du certificat (jamais la table `certificates`, pour ne pas exposer `client_id`/`pdf_storage_path`).
```
create view v_certificate_public as
select id, certificate_number, company_name, siren, address, composite_rating,
       vigi_score, vigi_score_tendance, sub_criteria, evaluation_date, validity_date,
       expert_name, status
from certificates
where status = 'valide' and validity_date >= current_date;
-- GRANT SELECT to anon sur la VUE ; la table certificates n'est PAS lisible anon.
```
> `/verifier/[id]` lit cette vue (Server Component). Exclut `client_id` et `pdf_storage_path`. Le filtre `validity_date >= current_date` évite d'afficher « valide » un certificat périmé non re-basculé par l'admin.

**KPI calculés front (pas de vue)** : documents par catégorie, publications récentes (top 5), `totalDocs` profil, non-lus notifs — déjà sur des listes filtrées par RLS, calcul front suffisant (faible volume).

---

## 5. Logique d'état dérivé (Type 2)

| État | Solution | Condition / perf |
|---|---|---|
| Certificat « effectif » | **RLS + `status` stocké** (simple, choix Etienne) | anon voit `status='valide'`. Option future : dériver `validity_date < now()` via vue/cron. Lu à chaque vérif publique (faible volume). |
| Notif non lue | table `notification_reads` | notif visible SANS ligne `(notif, user)` = non lue ; compté par client. |
| Éval « complétable » | front | `status in ('scheduled','in_progress')` → bouton Compléter. |
| Statut client | champ direct + front | pilote KPI + filtres + badge. |
| Label Vigi-Score / couleur rating | front/i18n | mapping présentation, jamais DB. |
| next_evaluation_due | écriture (Server Action) | `visit_date + 1 an` calculé à la complétion, stocké. |
| Contact principal | champ `is_primary` + unique partiel | un seul/client. |

Aucune colonne `GENERATED` nécessaire en Phase 1 (tout est soit champ direct, soit calcul front léger, soit RLS).

---

## 6. Side effects et workflows (Type 3)

### Fonctions/triggers DB
- **`set_updated_at()`** : trigger `before update` sur toutes les tables à `updated_at`.
- **`handle_new_user()`** : trigger `after insert on auth.users` → `insert into profiles (id, email, ...)`. (rôle/`client_id` via metadata ou complété par l'admin).
- **`is_admin()`** `security definer` : `exists(select 1 from profiles where id=auth.uid() and role='admin')` — utilisé par toutes les policies admin.
- **`current_client_id()`** `security definer` : `select client_id from profiles where id=auth.uid()` — utilisé par les policies client.
- **`clients_set_slug()`** : trigger `before insert/update` → `slug = slugify(company_name)` (équivalent NFD du repo actuel).
- **`profiles_guard_self_edit()`** 🔒 : trigger `before update on profiles` → si l'appelant n'est PAS admin (`not is_admin()`) ET que `new.role <> old.role OR new.client_id is distinct from old.client_id` → `raise exception`. **Ferme l'escalade de privilège** (un client ne peut ni se promouvoir admin ni voler un tenant via UPDATE own — la RLS ne filtre pas par colonne).
- **`set_primary_contact()`** : à l'INSERT/UPDATE d'un `client_contacts` avec `is_primary=true`, passe les autres contacts du même client à `false` (sinon l'unique partiel ferait ÉCHOUER l'update au lieu de basculer).

### Server Action : Déposer un certificat *(admin)* — workflow clé
> Remplace le `certId` aléatoire pendant. **Pas d'auto-émission** ; action admin explicite.
```
deposit_certificate(input, pdfFile):
  1. upload pdfFile → bucket 'certificates' → storage_path
  2. insert into certificates (client_id, certificate_number, company_name/siren/address [snapshot client],
       composite_rating, vigi_score, sub_criteria, evaluation_date, validity_date, expert_name,
       status='valide', pdf_storage_path)
  3. (optionnel) update evaluations set certificate_id = new.id where id = input.evaluation_id
  4. revalidatePath('/admin/clients/[id]') + invalider query 'certificates', 'verifier'
```

### Server Action : Compléter une évaluation *(admin)*
> Ne crée PLUS de certificat (décision). Enchaîne éval + rapport.
```
complete_evaluation(evalId, scores):
  1. composite_rating = scores.auto[0]+scores.req[0]+scores.op[0]
  2. insert into contract_documents (type='report', client_id, file_name, status='signed', uploaded_by=auth.uid(), ...)
  3. update evaluations set status='completed', vigi_score, omt_score, composite_rating,
       report_document_id, next_evaluation_due = visit_date + interval '1 year' where id=evalId
  → idéalement RPC transactionnelle (2+3) pour atomicité
  → invalider 'evaluations', dashboard 'vigi_distribution', 'client_kpis'
```

### Autres Server Actions / effets
- **Notifications** : `mark_as_read(id)` → `insert into notification_reads (notification_id, user_id=auth.uid())` (idempotent) ; `mark_all_as_read()` → insert pour toutes les notifs visibles non encore lues → invalider compteur non-lus.
- **Clients** : `create_client` (slug via trigger) · `update_client` · `archive_client` (status='archived', **voie normale**) · `delete_client` = hard delete **bloqué par RESTRICT** si certificats/évaluations existent (→ « archivez plutôt ») ; si autorisé, désactive/supprime aussi le profil lié (sinon compte client zombie `client_id=NULL`).
- **Génération PDF certificat** : reste **client-side** (jsPDF) pour pré-visualisation/fallback, mais la **source de download = `pdf_storage_path`** déposé. ⚠️ URL QR centralisée sur `NEXT_PUBLIC_SITE_URL` (corriger `cete-adn.fr`).
- **Articles** : CRUD. `views` = **non incrémenté en Phase 1** (décision explicite ; valeur seed conservée, pas de compteur réel).
- **Documents/ressources** : CRUD + assignation (`visibility`/`assigned_client_ids`). À l'**archivage/suppression d'un client**, retirer son `client_id` des `assigned_client_ids` (pas de CASCADE possible sur élément de tableau).
- **Comptes (`users`/`profiles`)** 🆕 : `invite_client` = `auth.admin.createUser()` (service-role) → `handle_new_user` crée le profil → rattachement `client_id` (UNIQUE) + `role='client'` ; `toggle_active` (is_active) ; `delete_user` = `auth.admin.deleteUser()`. **Pas un simple insert** (la RLS interdit l'insert direct de `profiles`). Workflow d'onboarding client central.

---

## 7. RLS détaillée par table

> Helpers : `is_admin()`, `current_client_id()`. Toutes tables : RLS activée.
> 🔒 **WITH CHECK obligatoire** sur tout INSERT/UPDATE : admin → `is_admin()` en USING **et** WITH CHECK ; `notification_reads` → WITH CHECK `user_id = auth.uid()` ; `settings` UPDATE → WITH CHECK `is_admin()`. `profiles` UPDATE own : autorisé MAIS le trigger `profiles_guard_self_edit()` bloque toute modif de `role`/`client_id` par un non-admin.
> ⚠️ **Consigne migration** : les `// TODO Supabase` du code disent `auth.uid()` là où il faut `current_client_id()` (les `assigned_client_ids` contiennent des `client_id`, PAS des `auth.users.id` — `profiles.id ≠ profiles.client_id`). **IGNORER les `auth.uid()` des TODO repos** ; utiliser `current_client_id()`.

| Table | anon | client (authentifié) | admin |
|---|---|---|---|
| clients | — | SELECT `id = current_client_id()` | ALL |
| profiles | — | SELECT/UPDATE `id = auth.uid()` | ALL |
| client_contacts | — | SELECT `client_id = current_client_id()` | ALL |
| founders | **SELECT `visible`** | SELECT | ALL |
| settings | **SELECT** | SELECT | UPDATE |
| contract_documents | — | — *(interne)* | ALL |
| certificates | **❌ table non lisible anon** → vue `v_certificate_public` | SELECT `client_id = current_client_id()` | ALL |
| evaluations | — | SELECT `client_id = current_client_id()` | ALL |
| client_documents | — | SELECT `global OR current_client_id() = ANY(assigned_client_ids)` | ALL |
| notifications | — | SELECT idem *(visibilité)* | ALL |
| notification_reads | — | INSERT/SELECT/DELETE own (`user_id = auth.uid()`) | ALL |
| resources | — | SELECT idem | ALL |
| articles | **SELECT `status='published'`** | SELECT published | ALL |

Multi-tenant : chaque policy client passe par `current_client_id()` → **test de fuite obligatoire** (client A ≠ client B) en B6/QA.

**Policies Storage (`storage.objects` — la RLS des tables NE protège PAS les buckets) :**
- `certificates` : INSERT/UPDATE/DELETE `is_admin()` ; SELECT client si chemin préfixé par son `client_id` (`(storage.foldername(name))[1] = current_client_id()::text`) ; download via signed URL.
- `contract-documents` : toutes opérations `is_admin()` (jamais client).
- `client-documents` : SELECT adossé à la RLS métier (convention de chemin `client_id/…` ou `global/…`) ; write `is_admin()`.

---

## 8. Realtime subscriptions

**Aucune requise en Phase 1.** Le front recharge explicitement après mutation (`refreshKey`, `loadData`). Réévaluable plus tard pour : notifications (push temps réel) et dashboard admin (live KPI). Non spécifié ici.

---

## 9. Migrations SQL ordonnées (`supabase/migrations/`)

1. `…_init_schema.sql` — 13 tables (dont `notification_reads`) + FK + indexes + CHECK + `enable row level security`.
2. `…_rls_policies.sql` — helpers `is_admin()`/`current_client_id()` + policies (§7).
3. `…_triggers_and_functions.sql` — `set_updated_at`, `handle_new_user`, `clients_set_slug`, **`profiles_guard_self_edit`**, **`set_primary_contact`**, vues (§4 dont **`v_certificate_public`**).
4. `…_storage_buckets.sql` — buckets + policies (§ ci-dessous).
5. `…_seed_initial.sql` *(optionnel)* — `settings` (1 ligne), `founders` (4) ; remap `auditor_id`.

**Buckets Storage** :
- `certificates` (privé) — PDF déposés ; admin write, client read own (via signed URL liée au `client_id`), download.
- `contract-documents` (privé) — admin only.
- `client-documents` (privé) — médias portail uploadés (si non-URL externe) ; lecture selon `client_documents` RLS. *(optionnel si tout reste en URL externe/YouTube)*

---

## 10. Server Actions et hooks

```
app/actions/clients/{create,update,archive,delete}.ts
app/actions/evaluations/{schedule,complete}.ts        # complete = RPC transactionnelle
app/actions/certificates/{deposit,update-status,delete}.ts   # deposit = upload + insert
app/actions/contract-documents/{create,delete}.ts
app/actions/client-documents/{create,update,delete}.ts
app/actions/resources/{create,update,delete}.ts
app/actions/articles/{create,update,delete}.ts
app/actions/notifications/{mark-read,mark-all-read}.ts
app/actions/settings/update.ts
```
Hooks lecture (si TanStack Query introduit ; sinon RSC + `revalidatePath`) : `use-clients-list`, `use-client-detail`, `use-dashboard-stats`, `use-vigi-distribution`, `use-client-documents`, `use-notifications`. Phase 1 actuelle = client components + `loadData` ; la migration peut conserver ce pattern et n'ajouter Supabase qu'au niveau repo (cf. B3.5/B4).

---

## 11. Points d'attention, risques et décisions AMBIGU

### Décisions arbitrées (validées Etienne, 2026-05-29)
1. **Visibilité documents/ressources** = `visibility` (global/assigned) + `assigned_client_ids uuid[]` (pas de table pivot). **🔑 RÈGLE IMPORTANTE** : un contenu **assigné** n'est visible QUE par le(s) client(s) ciblé(s) — isolation stricte via RLS (`current_client_id() = ANY(assigned_client_ids)`). Ressources : admin choisit « tous » (global) / « certains » (assigned). Document assigné depuis la fiche client → ce client uniquement.
2. **Notifications = modèle propre `notification_reads`** : chaque client gère SON « lu » (table dédiée). Plus de `read` partagé. (+1 table → 13.)
3. **Statut certificat = géré à la main par l'admin** (valide/expire/revoque). Pas de dérivation auto de `validity_date`.
4. **`certificates.id` en uuid** (ids texte mock abandonnés, pas de prod). ✅
5. **Dépôt certificat = PDF uploadé + champs structurés** (alimente `/verifier` + carte). ✅
6. **`articles.author` = texte libre** (pas de FK `profiles`). ✅

> ✅ Toutes les décisions AMBIGU sont tranchées — plus aucun point produit bloquant pour le schéma.

### Risques majeurs (top 3)
1. **🔴 Fuite multi-tenant via RLS** : les policies client reposent sur `current_client_id()` + `= ANY(assigned_client_ids)`. Une policy trop permissive = client A voit client B. → test de fuite systématique (B6, `08-qa/02-test-multi-tenant-leak`).
2. **🔴 Workflows admin multi-étapes (déposer certificat / compléter évaluation)** : touchent Storage + plusieurs tables. Sans atomicité (RPC/transaction), risque d'état incohérent (rapport créé mais éval non mise à jour, PDF uploadé sans ligne, etc.).
3. **🟠 Sur-exposition anon** : `certificates` (siren/adresse), `founders`, `settings` lisibles anon. Vérifier que **seules** les lignes voulues (cert `valide`, founder `visible`) et colonnes nécessaires sont exposées ; pas de fuite de `internal_notes`/contacts via jointure.

### Résolus dans la passe de durcissement (2026-05-29)
- Escalade privilège `profiles` → trigger `profiles_guard_self_edit` · confusion `auth.uid()`/`current_client_id()` → consigne §7 · sur-exposition anon certificats → vue `v_certificate_public` (sans `client_id`/`pdf_storage_path`, + filtre validité) · policies Storage 3 buckets → §7 · Server Actions `users`/onboarding → §6 · KPI « Organisations notées » réaligné sur `profiles` → §4 · suppression client `RESTRICT` + zombie profil → §2/§6 · `composite_rating` CHECK `^[A-D]{3}$` · ON DELETE certificats/évaluations `RESTRICT` · `set_primary_contact` · mapping seed/ids/i18n → §13.

### Restent (mineurs / plus tard)
- Trends KPI factices (`+12/+8/+5%`) à retirer ou calculer · `views` non incrémenté (acté) · domaine QR `cete-adn.fr` → `NEXT_PUBLIC_SITE_URL` · `assigned_client_ids uuid[]` sans intégrité FK (nettoyage applicatif à l'archivage) · `address_country` format à normaliser.

---

## 12. Plan d'action (bridge vers 04-data-migration)

`BACKEND_SPEC.md` devient le **contexte primaire** du workflow `04-data-migration/` :
- **B1 (`01-audit-mock-data`)** → devient une **vérification de cohérence** mocks ↔ ce schéma (et non découverte).
- **B2 (`02-plan-schema-supabase`)** → traduit ce doc en **5 migrations SQL** + types TS (`supabase gen types`).
- **B3 (`03-migration-execution`)** → applique via MCP Supabase (`apply_migration`), vérifie counts.
- **B3.5 / B4 / B6 / B7** → branchement lectures → CRUD+auth → tests fonctionnels (multi-tenant) → vérification finale.

**Estimation dev backend** : ~**3-5 jours/homme** (schéma + RLS + helpers/triggers + 2 workflows transactionnels + buckets + branchement repos + tests fuite), cohérent avec la complexité « moyenne » du recon. Le détail du handoff est produit en A4 (`MIGRATION_BRIEF.md`).

---

## 13. Dictionnaire de mapping & seed (durci post-vérification)

**Source de vérité du seed par entité** (⚠️ « fr/ only » était FAUX — sources mixtes) :
| Entité | Source réelle | Note |
|---|---|---|
| clients, evaluations, contract_documents | `mocks/fr/*.json` | mono-langue (FR) |
| founders, settings | `mocks/fr/*` **+** `mocks/en/*` | **fusionnés en `jsonb {fr,en}`** |
| resources, client_documents, notifications, articles | `mocks/<racine>/*.json` | mono-langue (FR) — les repos seedent la RACINE (pas `fr/`) |
| profiles (users), certificates | seed en dur (`.repo.ts`) | `SEED_USERS`, `MOCK_CERTIFICATES` |

> Supprimer les `mocks/en/{clients,evaluations,contract_documents}.json` (jamais lus ET **structurellement divergents** : `en/evaluations` a des clés `omtScore` différentes → piège si seedé par erreur).

**Remap ids texte → uuid (dictionnaire STABLE, appliqué à TOUTES les FK + tableaux simultanément) :**
- PK : `cli-*`, `eval-*`, `cdoc-*`, `contact-*`, `doc-*`, `res-*`, `notif-*`, founder `"1".."4"`, cert `cete-cert-*` → uuid.
- `profiles.id` = **uuid auth réel** (Supabase Auth) — `adm-001`/`cli-12345` du mock NE sont PAS les ids finaux.
- **`contract_documents.uploaded_by="adm-001"`** (18 lignes) → uuid admin réel (sinon FK orphelines).
- **`evaluations.auditor_id`** (`"1"/"2"/"3"`) → uuid founder remappé.
- Propager aux **tableaux** `assigned_client_ids` (documents/notifications/resources) et FK croisées (`clientId`, `reportDocumentId`, `certificateId`).

**Transformations de seed :**
- **Certificats démo** : 3 des 4 `evaluations.certificate_id` pointent vers des certificats inexistants → **`NULL` au seed** (décision). Seul `cete-cert-2026-0042-a7f3` existe (client `cli-12345`).
- **`notifications.read`** : colonne supprimée → **DROP au seed** (état lu de démo perdu, acceptable ; pas de remplissage `notification_reads`).
- **view-models** : `client_documents.json` enveloppé `{clientName, clientId, documents[], notifications[]}` → n'extraire que `.documents`/`.notifications`.
- **`resources.createdAt`** (camelCase, seul timestamp) → `created_at` ; `updated_at = created_at` au seed.
- **`contact_info`** : aplatir `maps.{latitude,longitude}` → `map_latitude/longitude` ; `id=1`.
- **`clients.address.country`** : seed `"FR"` vs DEFAULT `'France'` → choisir UN format et aligner DEFAULT + seed.
- **`founders.visible`** absent (3/4) → `true` ; timestamps = `now()`.
- **`pdf_storage_path`/`storage_path`** : `NULL` pour les lignes historiques (aucun fichier réel ; fallback jsPDF conservé pour les certificats).

**Dictionnaire camelCase ↔ snake_case** : produit en B2 à partir de `src/types/*` (ex `companyName→company_name`, `vigiScore→vigi_score`, `assignedClientIds→assigned_client_ids`, `omtScore→omt_score`, `subCriteria→sub_criteria`).

---

> **Fin de l'étape A3 (durcie post-vérification).** Spec **GO** pour la Phase B. Prochaine étape : `MIGRATION_BRIEF.md` (mis à jour en conséquence), puis commit, puis **nouveau GO requis** avant la Phase B (création tables + refactor code).
