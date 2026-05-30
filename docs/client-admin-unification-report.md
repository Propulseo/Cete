# Rapport d'unification data + design — Espace client ↔ Admin

> Livrable final (Phase 7) du chantier d'unification. Fait suite à
> [`client-admin-unification-plan.md`](client-admin-unification-plan.md) (Phase 0).
> Date : 2026-05-29. Toutes les phases (0→7) exécutées.

## Résultat des vérifications

| Vérification | Résultat |
|---|---|
| `npx tsc --noEmit` | **clean** (0 erreur) |
| `npm run build` | **✓ Compiled successfully** — 59/59 pages statiques générées (toutes les routes `/client/*` et `/admin/*`) |
| `npm run lint` | 14 erreurs / 13 warnings — **toutes pré-existantes**, dans des fichiers hors périmètre (`global.d.ts`, `scripts/lint-lines.js`, `react-hooks/set-state-in-effect` dans `useCountUp`/`AboutWorldMap`/…). **0 introduite par le chantier.** |
| Propagation (script d'invariants) | **13/13 pass**, aucune fuite de visibilité |

---

## 1. Schéma de données final & cible Supabase

Contrat partagé (`src/types/shared.ts`) : `Visibility = 'global' | 'assigned'`, `AccessType = 'view-only' | 'download'`,
`ClientScoped { visibility, assignedClientIds: string[] }`, `ThreeCScore { autoEvaluation, recommandation, gestesMetiers }`.

### 1.1 `documents` (ClientDocument — newsletters/capsules/guides/carnets)

| Champ TS | Colonne SQL | Type | Contraintes / index |
|---|---|---|---|
| id | id | `uuid` | PK `default gen_random_uuid()` |
| title | title | `text` | not null |
| category | category | `text` | check in (`newsletters,capsules,guides,carnets`) ; index |
| type | type | `text` | check in (`pdf,video`) |
| description | description | `text` | |
| fileSize | file_size | `text` | nullable (libellé « 1.2 MB ») |
| duration | duration | `text` | nullable |
| uploadDate | upload_date | `date` | index (tri desc) |
| url | url | `text` | nullable |
| youtubeId | youtube_id | `text` | nullable |
| accessType | access_type | `text` | default `'download'` |
| visibility | visibility | `visibility` (enum) | not null default `'global'` ; index |
| assignedClientIds | assigned_client_ids | `uuid[]` | default `'{}'` ; **GIN index** (filtre `cs`) |
| created_at / updated_at | created_at / updated_at | `timestamptz` | default `now()` |

> Alternative à `uuid[]` : table de jointure `document_client_assignments(document_id uuid, client_id uuid, primary key(document_id, client_id))` — meilleurs FK/contraintes, à trancher en migration.

### 1.2 `resources`

Mêmes colonnes de visibilité que `documents`. `category` check in (`normes,reglementation,guides,rapports,veille`) ;
`type` check in (`pdf,lien,video`) ; `access_type`, `source text`, `published_date date`. `visibility`/`assigned_client_ids` idem.

### 1.3 `notifications`

`id uuid`, `type text` check in (`veille,document,info`), `message text`, `date date`, `read boolean default false`,
`visibility visibility default 'global'`, `assigned_client_ids uuid[] default '{}'`.
*(Cible RLS plus stricte possible : `recipient_id uuid` par notification — voir dettes §5.)*

### 1.4 `certificates`

`id uuid`, `certificate_number text unique`, **`client_id uuid` FK → clients(id)** (remplace le rattachement par `companyName`),
`company_name text`, `siren text`, `address text`, `composite_rating text` (triple-lettre, ex « BBB »),
`vigi_score text` check in (`A,B,C,D`), `vigi_score_tendance text` check in (`+,-,''`),
`sub_criteria jsonb` (`{autoEvaluation,recommandation,gestesMetiers}`), `evaluation_date date`, `validity_date date`,
`expert_name text`, `status text` check in (`valide,expire,revoque`), `created_at timestamptz`.

### 1.5 `evaluations`

`id uuid`, `client_id uuid` FK, `site_name`, `site_address`, `visit_date date`,
`vigi_score text` check in (`A,B,C,D`) null, `omt_score jsonb` (`ThreeCScore`), `composite_rating text` null,
`certificate_id uuid` FK → certificates null, `auditor_id`, `status text` check in (`scheduled,in_progress,completed,cancelled`),
`report_document_id`, `next_evaluation_due date`, `notes`, `created_at`, `updated_at`.

### 1.6 `clients`, `contract_documents`, `profiles`

- `clients` : `id uuid`, `slug text unique`, `company_name`, `legal_form`, `siret`, `sector`, `headcount text`, `address jsonb`, `contacts jsonb[]`, `status`, dates, `internal_notes`.
- `contract_documents` : `id uuid`, `client_id uuid` FK, `type`, `title`, `version int`, `file_name`, `file_size bigint` (octets), `mime_type`, `uploaded_at`, `uploaded_by`, `status`, `notes`.
- `profiles` (extension `auth.users`) : `id uuid` PK = `auth.users.id`, `email`, `name`, `role text` check in (`admin,client`), **`client_id uuid` FK → clients(id)** (null pour admin), `company`, `phone`, `is_active`, dates.

---

## 2. RLS recommandées (pseudo-SQL)

```sql
create type visibility as enum ('global', 'assigned');

-- Helpers
create or replace function current_client_id() returns uuid language sql stable as $$
  select client_id from profiles where id = auth.uid() $$;
create or replace function is_admin() returns boolean language sql stable as $$
  select exists(select 1 from profiles where id = auth.uid() and role = 'admin') $$;

-- Contenu publié (documents, resources, notifications) : global OU assigné
create policy content_select_client on documents for select to authenticated
  using ( visibility = 'global' or current_client_id() = any(assigned_client_ids) );
create policy content_admin_all on documents for all to authenticated
  using ( is_admin() ) with check ( is_admin() );
-- (mêmes deux policies sur resources et notifications)

-- CRM mono-client (certificates, evaluations, contract_documents) : par client_id
create policy crm_select_client on certificates for select to authenticated
  using ( client_id = current_client_id() );
create policy crm_admin_all on certificates for all to authenticated
  using ( is_admin() ) with check ( is_admin() );
-- (idem evaluations, contract_documents ; clients : select admin-only + son propre client)
```

Le filtre applicatif actuel `getVisibleForClient(clientId)` = `visibility==='global' || assignedClientIds.includes(clientId)` **est l'exact équivalent de la policy SELECT** ci-dessus : la migration consiste à supprimer le paramètre `clientId` (fourni par `auth.uid()`/`current_client_id()`).

---

## 3. Composants partagés livrés (`src/components/shared/`)

Tous pilotés par tokens (résolus dans `.admin-theme` ET `.client-theme`). Les anciens chemins `features/admin/ui/*`
sont devenus des **shims de ré-export** (noms `Admin*` conservés) → l'admin fonctionne sans modification.

| Fichier | Exports | Variantes | Consommé par |
|---|---|---|---|
| `rating-seal.tsx` | `RatingSeal`, `CompositeRating`, `VigiGrade` | tailles `inline-sm/md/lg/hero` | admin (clients, éval) + client (CertificateCard) |
| `surface-card.tsx` | `SurfaceCard` (+Header/Title/Content) | — | admin (`AdminCard` shim) + client (dashboard, notifs, profil, cert) |
| `kpi-tile.tsx` | `KpiTile` | trend +/−/= tokenisé | admin (dashboard) + client (DashboardSummary) |
| `data-table.tsx` | `DataTable/Thead/Th/Tbody/Tr/Td` | — | admin (`AdminTable` shim) + client (DocumentsList) |
| `status-badge.tsx` | `StatusBadge`, `statusTone`, `StatusTone` | tons pos/warn/info/neutral (+ valide/expire/revoque) | admin + client (cert) |
| `page-header.tsx` | `PageHeader` | titre serif | admin (`AdminPageHeader` shim) + 7 pages client |
| `empty-state.tsx` | `EmptyState` | — | admin (`AdminEmptyState` shim) + client (docs, capsules, ressources) |
| `quick-action.tsx` | `QuickAction` | `primary` | admin (`AdminQuickAction` shim) |

> **`EvaluationSummary` non livré** : aucune page client n'affiche d'évaluations aujourd'hui (le client voit certificats + documents). Composant volontairement non créé pour éviter du code mort ; à introduire si une vue « historique d'évaluations » côté client est ajoutée.
> **`VigiScoreCard`** : matérialisé sous forme du `CertificateCard` client reconstruit (RatingSeal + CompositeRating), pas comme composant séparé — le seul consommateur est le client.

---

## 4. Pages client refondues (rendu)

Toutes sous `.client-theme` (canvas cool-paper `#F8F9FB`, Source Serif 4, radius 10px), `p-4 lg:p-8`, en-tête `PageHeader` serif.

| Page | Rendu |
|---|---|
| **layout + sidebar** | Rail clair récessif `#FCFCFD` + hairline `#E6ECF1`, logo `logo-cete-adn.png` `h-8`, nav avec **ledge bleu ink 3px + wash 7%** sur l'actif (plus de pilule sky-blue pleine), bloc compte à initiales, déconnexion → accueil public `/`. Topbar mobile tokenisée. |
| **dashboard** | `PageHeader` « Bienvenue, … » ; `CertificateCard` (sceaux Vigi-Score) ; `DashboardSummary` = 4 `KpiTile` catégories + registre « publications récentes » (SurfaceCard, lignes monochromes) ; `NotificationsTicker` (SurfaceCard). |
| **newsletters / guides / carnets** | `PageHeader` + `DocumentsList` (DataTable partagée, accès download/view-only en `text-admin-pos`/`-urgent`). |
| **capsules** | `PageHeader` + grille de `DocumentCard` (SurfaceCard, thumbnail tokenisé, badge durée) ; `EmptyState` partagé. |
| **ressources** | `PageHeader` + filtres + grille `ResourceCard` ; `EmptyState`. Données via `getVisibleForClient`. |
| **profil** | `PageHeader` + 2 `SurfaceCard` (identité à avatar-initiales + abonnement), tokens, `clientId` = `user.clientId`. |

Chips d'icône hors-marque supprimés (`bg-blue-100`/`bg-purple-100`/`bg-green-100`/`bg-orange-100`), couleurs ad-hoc du certificat (vert/jaune/`#4DA6D9`) remplacées par la grammaire Vigi-Score.

---

## 5. Dettes & points de vigilance pour la migration Supabase

1. **Session → `auth.users.id`** : aujourd'hui `Profile.id` = id mock (`cli-12345`/`adm-001`) ET `Profile.clientId` pointe vers `clients.id`. En Supabase, `profiles.id = auth.uid()` (UUID auth) et `profiles.client_id` = FK distincte. Les pages client utilisent déjà `user.clientId ?? user.id` → migration = garantir `clientId` peuplé pour les clients.
2. **localStorage → tables** : repos versionnés (`SEED_VERSION`) ; à la migration, remplacer le seed localStorage par des `insert` Supabase. Le filtre `getVisibleForClient(clientId)` devient une policy RLS (le paramètre disparaît, cf. `// TODO Supabase:`).
3. **Clé localStorage globale par entité** : `cete_documents` etc. sont partagées (pas partitionnées par client) — c'est volontaire (l'admin écrit, le client lit filtré). En SQL, la partition est assurée par la RLS, pas par la clé.
4. **`assigned_client_ids uuid[]` vs table de jointure** : trancher à la migration (GIN index sur le tableau, ou jointure normalisée).
5. **Notifications** : aujourd'hui `visibility/assignedClientIds` (broadcast/ciblé). Si l'on veut un vrai « par destinataire + état lu par utilisateur », prévoir `notification_reads(notification_id, user_id)` au lieu d'un `read` global.
6. **Certificats ↔ évaluations** : réconciliés pour le client démo (`eval-006` → `cete-cert-2026-0042-a7f3`). Les évaluations `cli-001/002/005` référencent encore des `certificateId` absents du store certificats (données mock historiques, non résolues à l'exécution) — à nettoyer ou à compléter lors du peuplement Supabase.
7. **Mocks `en/` morts** (décision SCH-4) : `en/client_documents.json`, `en/resources.json`, `en/clients.json`, `en/evaluations.json`, `en/contract_documents.json`, `en/admin_*.json` ne sont lus par aucun repo et conservent l'**ancien schéma** (pas de `assignedClientIds`, `accessMode`, clés 3C `maitriseExigences`…). Sans impact build/runtime (non importés). À supprimer ou régénérer lors de la localisation des données mutables (Supabase + i18n DB).
8. **`fileSize`** : `text` (documents/resources, libellé) vs `bigint` (contract_documents, octets) — incohérence assumée, à harmoniser si besoin.
9. **Lint pré-existant** : 14 erreurs hors périmètre (`react-hooks/set-state-in-effect`, `no-require-imports`, `no-empty-object-type`) — à traiter dans une passe dédiée ; n'affectent pas le build.

---

## 6. Incohérences avec le redesign admin & résolutions

| Constat | Résolution |
|---|---|
| Brief `admin-redesign-brief.md` **périmé** (« STOP Phase 0 ») alors que le code admin était fini | Code traité comme source de vérité ; chantier mené sur l'état réel. |
| Le **chantier admin était terminé** (annoncé en cours d'exécution) | Risque de conflit levé : composants déplacés en `shared/` avec shims de ré-export → admin intact (vérifié build + lint inchangé). |
| Tokens admin nécessaires côté client mais scopés `.admin-theme` | `.client-theme` créé (duplication, décision STY-1) ; mêmes noms de variables (`--admin-line`, `--vigi-*`) → composants partagés résolvent identiquement dans les deux scopes. Nettoyage futur possible (scope neutre commun) en coordination. |
| Le prompt ciblait `src/lib/types/` | Conservé `src/types/` (SCH-6) pour ne pas casser ~40 imports. |
| Pluralisation « anglaise » hardcodée signalée | Produit en réalité des pluriels corrects en FR et EN pour ces mots ; remplacée par les libellés de catégorie traduits sur les 4 pages documents (source unique), conservée telle quelle sur ressources. |

---

## 7. Récapitulatif des fichiers livrés

**Types** : `src/types/shared.ts` (nouveau) ; `document.ts`, `resource.ts`, `certificate.ts`, `client.ts`, `auth.ts`, `index.ts` (modifiés).
**Repos** : `documents`, `resources`, `notifications`, `certificates` (méthodes `getVisibleForClient`/`getCertificatesForClient`, version bumps) ; `clients`, `evaluations` (version bumps).
**Composants partagés** : `src/components/shared/{rating-seal,surface-card,kpi-tile,data-table,status-badge,page-header,empty-state,quick-action}.tsx` (+ 8 shims `features/admin/ui/*`).
**Client** : `layout.tsx`, `ClientSidebar.tsx`, `CertificateCard.tsx`, `DocumentsList.tsx`, `DocumentCard.tsx`, `NotificationsTicker.tsx`, `DashboardSummary.tsx` ; 7 pages (`dashboard/profile/newsletters/capsules/guides/carnets/ressources`).
**Mocks** : `client_documents.json`, `resources.json` (root) ; `fr/clients.json`, `fr/evaluations.json` ; `certificates.repo.ts` (MOCK_CERTIFICATES).
**Styles** : `src/app/globals.css` (`.client-theme`).
**Docs** : `client-admin-unification-plan.md`, `client-admin-unification-report.md`.
