# Cartographie des entités métier

> Généré le : 2026-05-29 · Repo : `c:\Users\etien\Desktop\CETé` · Domaine détecté : **Agence de notation / certification technique du risque électrique** (audit-inspection B2B, avec back-office admin + portail client + vérification publique de certificat)
>
> Étape 00 du workflow migration (`prompts/00-audit-logique-metier/01-cartographie-entites`). Lecture seule — aucune modification de code. Base : `PROJECT_RECON.md` §4-5 + lecture directe de `src/types/*`.

---

## Résumé exécutif

- **Entités métier : 13** (à persister en DB) · **Relations : 14** · **Énumérations : 19**
- **+ 2 value objects embarqués** (`ThreeCScore`, `ClientAddress`) et **1 contrat/mixin** (`ClientScoped` → pivot N-N)
- **+ 2 entités dérivées NON persistées** (`Stat`/`AdminStats` calculés, `ClientData` view-model) → relèvent de l'**étape 2**
- **+ 5 entités vitrine statiques HORS périmètre** (`Service`, `Pillar`, `Value`, `Navigation`, `BlogPost`) → intouchables, non migrées
- **Entités les plus centrales (par relations entrantes)** : **`Client`** (hub, 7 entrantes) · **`Profile`** · **`Evaluation`** (4 FK sortantes) · **`Certificate`** (public-facing) · **`ContractDocument`**
- **Mapping cible** : les 13 entités ⇒ ~12-13 tables Supabase (dont pivot `document_assignments`). Voir `## Périmètre & mapping tables`.

---

## Périmètre & mapping tables

| Entité | Table cible | Scope migration | Note |
|---|---|---|---|
| Profile | `profiles` | ✅ cœur | extension `auth.users`, FK `client_id` UNIQUE (décision B1) |
| Client | `clients` | ✅ cœur | hub central |
| ClientContact | `client_contacts` | ✅ cœur | 1-N depuis Client (embarqué dans le mock) |
| ContractDocument | `contract_documents` | ✅ cœur | fichiers → Storage bucket |
| Evaluation | `evaluations` | ✅ cœur | `omtScore` (ThreeCScore) embarqué |
| Certificate | `certificates` | ✅ cœur | **lecture publique anon** WHERE status actif (décision A1) |
| ClientDocument | `client_documents` (+ `document_assignments`) | ✅ cœur | ClientScoped → pivot N-N |
| Notification | `notifications` | ✅ cœur | ClientScoped (à arbitrer, voir Suspects) |
| Resource | `resources` | ✅ cœur | ClientScoped |
| Article | `articles` | ✅ cœur | blog admin |
| Settings (ContactInfo) | `settings` | 🟡 frontière | décision #6 : source DB pour footer/contact public |
| Founder | `founders` | 🟡 frontière | décision #6 : source DB. **Absent de la liste 11 tables A3** → arbitrage A3 |
| ClientAddress | *(colonnes inline ou JSONB de `clients`)* | ✅ cœur | value object embarqué |
| ThreeCScore | *(colonnes inline ou JSONB)* | ✅ cœur | value object embarqué (evaluations + certificates) |
| Stat / AdminStats | *(aucune — vue/RPC)* | ⚙️ dérivé | calculé par `stats.repo` → étape 2 |
| ClientData | *(aucune — agrégat front)* | ⚙️ dérivé | view-model (clientName + documents + notifications) |
| Service / Pillar / Value / Navigation / BlogPost | *(aucune — JSON statique)* | ⛔ hors scope | vitrine `(public)`, intouchable |

---

## Entités détectées

### Profile
**Source** : `src/types/auth.ts` · seed `src/lib/repo/users.repo.ts` (`SEED_USERS`) + `src/lib/auth.ts` (credentials).
**Description supposée** : compte utilisateur authentifié, extension de `auth.users`, portant le rôle et le rattachement client.

**Attributs**
| Attribut | Type TS | Obligatoire | Source | UI |
|---|---|---|---|---|
| id | string (uuid cible) | oui | auth.ts | interne (= `auth.users.id`) |
| email | string | oui | auth.ts | oui (login, profil) |
| name | string | oui | auth.ts | oui (sidebar, profil) |
| role | `"admin" \| "client"` | oui | auth.ts | dérive la navigation/garde |
| clientId | string? | (oui si role=client) | auth.ts | filtre data client |
| company | string? | non | auth.ts | profil client |
| phone | string? | non | auth.ts | profil client |
| is_active | boolean | oui | auth.ts | admin/users (toggle actif) |
| created_at / updated_at | string? | non | auth.ts | interne |

**Relations sortantes** : → `Client` (`clientId`, **1-1**, UNIQUE par décision B1 ; optionnelle pour `role=admin`). ON DELETE : à décider (SET NULL recommandé — ne pas supprimer le compte si le client part).
**Relations entrantes** : ← `Evaluation` (`auditorId`, N-1, l'auditeur est un Profile admin) ; ← `ContractDocument` (`uploadedBy`, N-1).
**Notes** : ⚠️ bug latent acté (décision B1) — les pages client filtrent par `user.id` au lieu de `user.clientId`. Marche en démo car seed `id === clientId === "cli-12345"`.

---

### Client
**Source** : `src/types/client.ts` · `src/data/mocks/fr/clients.json` (6) · `src/lib/repo/clients.repo.ts`.
**Description supposée** : entreprise cliente notée par l'agence. Entité pivot du portail et du back-office.

**Attributs**
| Attribut | Type TS | Obligatoire | Source | UI |
|---|---|---|---|---|
| id | string | oui | client.ts | interne |
| slug | string | oui | client.ts | URL `/admin/clients/[id]` (dérivé NFD) |
| companyName | string | oui | client.ts | oui |
| legalForm | `ClientLegalForm` | oui | client.ts | oui (form) |
| siret | string | oui | client.ts | oui |
| vatNumber | string? | non | client.ts | form (société) |
| sector | `ClientSector` | oui | client.ts | oui (filtre) |
| headcount | string? | non | client.ts | form |
| address | `ClientAddress` | oui | client.ts | oui (objet embarqué) |
| contacts | `ClientContact[]` | oui | client.ts | oui (onglet société) |
| status | `ClientStatus` | oui | client.ts | oui (filtre, KPI) |
| contractStartDate | string | oui | client.ts | oui |
| contractEndDate | string? | non | client.ts | form |
| internalNotes | string | oui | client.ts | admin only |
| createdAt / updatedAt | string | oui | client.ts | interne |

**Relations sortantes** : → `ClientAddress` (1-1 embarqué) ; → `ClientContact[]` (**1-N**, ON DELETE cascade).
**Relations entrantes** : ← `Profile` (1-1 via `client_id` UNIQUE) ; ← `ContractDocument` (1-N) ; ← `Evaluation` (1-N) ; ← `Certificate` (1-N) ; ← `ClientDocument` (**N-N** via `document_assignments`) ; ← `Notification` (N-N via assigned) ; ← `Resource` (N-N via assigned).
**Notes** : 7 relations entrantes ⇒ **entité la plus connectée**. ON DELETE d'un client : cascade sur contacts/évaluations/contrats/certificats à arbitrer (probable soft-archive via `status='archived'` plutôt que delete dur — déjà présent : `softArchiveClient`).

---

### ClientContact
**Source** : `src/types/client.ts` (embarqué dans `Client.contacts[]`).
**Description supposée** : interlocuteur d'un client (un marqué `isPrimary`).

**Attributs**
| Attribut | Type TS | Obligatoire | Source | UI |
|---|---|---|---|---|
| id | string | oui | client.ts | interne |
| firstName / lastName | string | oui | client.ts | oui |
| role | string | oui | client.ts | oui (texte libre) |
| email | string | oui | client.ts | oui |
| phone | string | oui | client.ts | oui |
| isPrimary | boolean | oui | client.ts | oui (badge contact principal) |

**Relations sortantes** : → `Client` (`client_id` implicite une fois extrait en table, **N-1**, ON DELETE cascade).
**Relations entrantes** : aucune.
**Notes** : embarqué dans le mock (tableau imbriqué) → à normaliser en table `client_contacts`. `role` texte libre (pas d'enum).

---

### ContractDocument
**Source** : `src/types/client.ts` · `src/data/mocks/fr/contract_documents.json` (18) · `src/lib/repo/contract-documents.repo.ts`.
**Description supposée** : document contractuel/administratif interne rattaché à un client (offre, devis, contrat, rapport…). **Distinct** de `ClientDocument` (portail).

**Attributs**
| Attribut | Type TS | Obligatoire | Source | UI |
|---|---|---|---|---|
| id | string | oui | client.ts | interne |
| clientId | string | oui | client.ts | filtre (onglet documents) |
| type | `ContractDocumentType` | oui | client.ts | oui |
| title | string | oui | client.ts | oui |
| version | number | oui | client.ts | oui |
| fileName / fileSize / mimeType | string / number / string | oui | client.ts | oui → **Storage** |
| uploadedAt | string | oui | client.ts | oui |
| uploadedBy | string | oui | client.ts | (id Profile) |
| status | `ContractDocumentStatus` | oui | client.ts | oui |
| notes | string? | non | client.ts | admin |

**Relations sortantes** : → `Client` (`clientId`, N-1, cascade) ; → `Profile` (`uploadedBy`, N-1, SET NULL/RESTRICT).
**Relations entrantes** : ← `Evaluation` (`reportDocumentId`, 1-1 optionnelle).
**Notes** : porte un vrai fichier (fileName/mimeType/fileSize) ⇒ **bucket Storage** + RLS. `uploadedBy` = FK Profile non typée comme telle.

---

### Evaluation
**Source** : `src/types/client.ts` · `src/data/mocks/fr/evaluations.json` (6) · `src/lib/repo/evaluations.repo.ts`.
**Description supposée** : visite/audit d'un site client aboutissant à une note Vigi-Score et potentiellement un certificat.

**Attributs**
| Attribut | Type TS | Obligatoire | Source | UI |
|---|---|---|---|---|
| id | string | oui | client.ts | interne |
| clientId | string | oui | client.ts | filtre |
| siteName / siteAddress | string | oui | client.ts | oui |
| visitDate | string | oui | client.ts | oui |
| vigiScore | `VigiScoreGrade`? | non | client.ts | oui (badge) |
| omtScore | `ThreeCScore`? | non | client.ts | oui (3C) |
| compositeRating | string? | non | client.ts | oui (ex "BBB") |
| certificateId | string? | non | client.ts | lien certificat |
| auditorId | string | oui | client.ts | (id Profile) |
| status | `EvaluationStatus` | oui | client.ts | oui (KPI) |
| reportDocumentId | string? | non | client.ts | lien rapport |
| nextEvaluationDue | string? | non | client.ts | oui |
| notes | string? | non | client.ts | admin |
| createdAt / updatedAt | string | oui | client.ts | interne |

**Relations sortantes** : → `Client` (`clientId`, N-1, cascade) ; → `Certificate` (`certificateId`, 1-1 opt, SET NULL) ; → `Profile` (`auditorId`, N-1, RESTRICT) ; → `ContractDocument` (`reportDocumentId`, 1-1 opt, SET NULL). `omtScore` = `ThreeCScore` embarqué.
**Relations entrantes** : aucune (référencée par Certificate côté logique métier, voir Notes).
**Notes** : **4 FK sortantes ⇒ entité-carrefour** des écritures. `compositeRating` string non contraint (voir Suspects). Lien Evaluation↔Certificate : ici porté par `evaluation.certificateId` (et inversement `certificate` n'a pas d'`evaluationId`) → relation à clarifier en étape 2/3.

---

### Certificate
**Source** : `src/types/certificate.ts` (`CertificateData`) · seed `src/lib/repo/certificates.repo.ts` (`MOCK_CERTIFICATES`, 2) · consommé par `(public)/verifier/[id]`.
**Description supposée** : certificat de notation émis pour un client, **vérifiable publiquement** par numéro.

**Attributs**
| Attribut | Type TS | Obligatoire | Source | UI |
|---|---|---|---|---|
| id | string | oui | certificate.ts | interne |
| certificateNumber | string | oui | certificate.ts | oui (clé de vérif) |
| clientId | string | oui | certificate.ts | FK |
| companyName | string | oui | certificate.ts | oui (public) |
| siren | string | oui | certificate.ts | oui (public) |
| address | string | oui | certificate.ts | oui |
| compositeRating | string | oui | certificate.ts | oui (ex "BBB") |
| vigiScore | `VigiScoreGrade` | oui | certificate.ts | oui |
| vigiScoreTendance | `"+" \| "-" \| ""` | oui | certificate.ts | oui |
| subCriteria | `ThreeCScore` | oui | certificate.ts | oui (3C) |
| evaluationDate / validityDate | string | oui | certificate.ts | oui |
| expertName | string | oui | certificate.ts | oui |
| status | `CertificateStatus` | oui | certificate.ts | filtre RLS public |
| createdAt | string | oui | certificate.ts | interne |

**Relations sortantes** : → `Client` (`clientId`, N-1, cascade).
**Relations entrantes** : ← `Evaluation` (`certificateId`, 1-1 opt).
**Notes** : 🔓 **seule entité à exposition publique anon** (décision A1 : RLS `SELECT` anon WHERE status actif). ⚠️ valeurs de `status` = `valide/expire/revoque` (FR) ≠ `status='active'` cité dans la décision (voir Suspects #1). `compositeRating`/`subCriteria` dupliquent l'info de l'évaluation source → décider source de vérité (étape 2/3).

---

### ClientDocument
**Source** : `src/types/document.ts` · `src/data/mocks/client_documents.json` (12 docs) · `src/lib/repo/documents.repo.ts`.
**Description supposée** : contenu publié au **portail client** (newsletters, capsules vidéo, guides, carnets).

**Attributs**
| Attribut | Type TS | Obligatoire | Source | UI |
|---|---|---|---|---|
| id | string | oui | document.ts | interne |
| title | string | oui | document.ts | oui |
| category | `DocumentCategory` | oui | document.ts | oui (route client) |
| type | `DocumentType` (`pdf\|video`) | oui | document.ts | oui |
| description | string | oui | document.ts | oui |
| fileSize | string? | non | document.ts | oui |
| duration | string? | non | document.ts | vidéo |
| uploadDate | string | oui | document.ts | oui |
| url | string? | non | document.ts | lien fichier |
| youtubeId | string? | non | document.ts | vidéo embed |
| accessType | `AccessType`? | non | document.ts | view-only/download |
| visibility / assignedClientIds | `ClientScoped` | oui | shared.ts | filtre client |
| created_at / updated_at | string? | non | document.ts | interne |

**Relations sortantes** : → `Client` (**N-N** via `document_assignments`, quand `visibility='assigned'`).
**Relations entrantes** : aucune.
**Notes** : porte `ClientScoped`. Cible : table `client_documents` + pivot `document_assignments` (ou `assigned_client_ids uuid[]`). ⚠️ ne pas confondre avec `ContractDocument`.

---

### Notification
**Source** : `src/types/document.ts` · `src/data/mocks/client_documents.json` (clé `notifications`, 4) · `src/lib/repo/notifications.repo.ts`.
**Description supposée** : alerte affichée au portail client (ticker), marquable comme lue.

**Attributs**
| Attribut | Type TS | Obligatoire | Source | UI |
|---|---|---|---|---|
| id | string | oui | document.ts | interne |
| type | `NotificationType` (`veille\|document\|info`) | oui | document.ts | oui (icône) |
| message | string | oui | document.ts | oui |
| date | string | oui | document.ts | oui |
| read | boolean | oui | document.ts | oui (markAsRead) |
| visibility / assignedClientIds | `ClientScoped` | oui | shared.ts | filtre client |

**Relations sortantes** : → `Client` (N-N via assigned, si `visibility='assigned'`).
**Relations entrantes** : aucune.
**Notes** : ⚠️ `read` est un booléen **global** sur la notif, pas par destinataire ⇒ avec `visibility='global'`, « marquer lu » affecterait tous les clients. Modèle à arbitrer (voir Suspects #5). Side effect `markAsRead`/`markAllAsRead` → étape 2.

---

### Resource
**Source** : `src/types/resource.ts` · `src/data/mocks/resources.json` (9) · `src/lib/repo/resources.repo.ts`.
**Description supposée** : ressource documentaire (normes, réglementation, guides, rapports, veille) accessible admin + client.

**Attributs**
| Attribut | Type TS | Obligatoire | Source | UI |
|---|---|---|---|---|
| id | string | oui | resource.ts | interne |
| title / description | string | oui | resource.ts | oui |
| category | `ResourceCategory` | oui | resource.ts | oui (filtre) |
| type | `ResourceType` (`pdf\|lien\|video`) | oui | resource.ts | oui |
| accessType | `AccessType` | oui | resource.ts | oui |
| url | string | oui | resource.ts | oui |
| youtubeId / fileSize / source | string? | non | resource.ts | oui |
| publishedDate | string | oui | resource.ts | oui |
| createdAt | string | oui | resource.ts | interne |
| created_at / updated_at | string? | non | resource.ts | interne (doublon, voir Suspects #4) |
| visibility / assignedClientIds | `ClientScoped` | oui | shared.ts | filtre client |

**Relations sortantes** : → `Client` (N-N via assigned).
**Relations entrantes** : aucune.
**Notes** : double convention de timestamp (`createdAt` **et** `created_at`/`updated_at`) → harmoniser.

---

### Article
**Source** : `src/types/article.ts` · `src/data/mocks/fr/admin_articles.json` (4) · `src/lib/repo/articles.repo.ts`.
**Description supposée** : article de blog géré au back-office (publication, vues, mise en avant).

**Attributs**
| Attribut | Type TS | Obligatoire | Source | UI |
|---|---|---|---|---|
| id | string | oui | article.ts | interne |
| title / excerpt | string | oui | article.ts | oui |
| author | string | oui | article.ts | oui (**texte libre**, pas de FK) |
| category | `ArticleCategory` | oui | article.ts | oui |
| status | `"published" \| "draft"` | oui | article.ts | oui |
| publishedDate | string \| null | non | article.ts | oui |
| views | number | oui | article.ts | oui (compteur) |
| featured | boolean | oui | article.ts | oui |
| videoUrl | string? | non | article.ts | oui |
| created_at / updated_at | string? | non | article.ts | interne |

**Relations sortantes** : aucune typée (`author` est du texte libre — candidat FK `author_id → Profile`, voir Suspects #7).
**Relations entrantes** : aucune.
**Notes** : `views` est un compteur incrémenté → side effect (étape 2). Distinct de `BlogPost` (vitrine publique, hors scope, clé `slug`).

---

### Settings (ContactInfo) 🟡 frontière
**Source** : `src/types/contact.ts` · `src/data/mocks/fr/contact_info.json` · `src/lib/repo/settings.repo.ts` (admin) **ET** `data-loader.getContactInfo()` (public).
**Description supposée** : configuration globale de l'agence (coordonnées, horaires, carte) — **singleton**.

**Attributs**
| Attribut | Type TS | Obligatoire | Source | UI |
|---|---|---|---|---|
| company / address / city / country | string | oui | contact.ts | oui (footer, contact) |
| phone / email / website | string | oui | contact.ts | oui |
| businessHours | `BusinessHours` (7 jours) | oui | contact.ts | oui |
| maps | `MapCoordinates` (lat/lng) | oui | contact.ts | carte |

**Relations** : aucune.
**Notes** : **double source connue** (admin `settings.repo` localStorage vs public `data-loader` JSON statique). Décision #6 : unifier sur **DB** (table `settings`, 1 ligne) pour que footer/contact public ne lisent plus localStorage. Lecture publique anon nécessaire.

---

### Founder 🟡 frontière
**Source** : `src/types/founder.ts` · `src/data/mocks/fr/founders.json` (4) · `src/lib/repo/founders.repo.ts` + `data-loader.getFounders()` (lit aussi `localStorage`).
**Description supposée** : membre fondateur affiché sur la vitrine (home, à-propos), éditable en admin.

**Attributs**
| Attribut | Type TS | Obligatoire | Source | UI |
|---|---|---|---|---|
| id | string | oui | founder.ts | interne |
| name / role / bio | string | oui | founder.ts | oui (`role` texte libre) |
| imageUrl | string | oui | founder.ts | oui |
| imagePosition | string? | non | founder.ts | cadrage photo |
| specialties | string[] | oui | founder.ts | oui (tags) |
| visible | boolean? | non | founder.ts | toggle affichage |
| formerOrg / currentEntity | string? | non | founder.ts | oui |

**Relations** : aucune.
**Notes** : ⚠️ **absente de la liste des 11 tables A3** alors que décision #6 la met en scope DB. À trancher en A3 : table `founders` + lecture publique anon (la vitrine l'affiche). `getFounders()` lit `localStorage` ⇒ lecture publique de localStorage = anti-pattern à supprimer (frontière zone grise §9.C).

---

## Value objects & contrats (embarqués, pas de table propre)

### ThreeCScore (value object)
`src/types/shared.ts`. Notation Règle des 3C : `autoEvaluation`, `recommandation`, `gestesMetiers` — **tous `string`** (format lettre+modificateur ex "A-", "B+"). Embarqué dans `Evaluation.omtScore` et `Certificate.subCriteria`. Cible : colonnes inline `omt_*` / `sub_*` ou JSONB. Voir Suspects #3.

### ClientAddress (value object)
`src/types/client.ts`. `street/postalCode/city/country`. Embarqué dans `Client.address`. Cible : colonnes inline ou JSONB de `clients`.

### ClientScoped (contrat/mixin)
`src/types/shared.ts`. `visibility: "global"|"assigned"` + `assignedClientIds: string[]`. Appliqué à **ClientDocument, Notification, Resource**. Règle : `visibility==='global' || assignedClientIds.includes(clientId)`. Cible : `assigned_client_ids uuid[]` **ou** pivot(s) `document_assignments`. **Point AMBIGU majeur pour A3** (voir Suspects #8).

---

## Relations consolidées

| # | De | Vers | Type | Optionnelle | ON DELETE (supposé) | Via |
|---|---|---|---|---|---|---|
| 1 | Profile | Client | 1-1 (UNIQUE) | oui (admin n'en a pas) | SET NULL | `clientId` |
| 2 | Client | ClientContact | 1-N | non | CASCADE | `client_id` |
| 3 | Client | ClientAddress | 1-1 | non | (embarqué) | inline |
| 4 | ContractDocument | Client | N-1 | non | CASCADE | `clientId` |
| 5 | ContractDocument | Profile | N-1 | non | SET NULL | `uploadedBy` |
| 6 | Evaluation | Client | N-1 | non | CASCADE | `clientId` |
| 7 | Evaluation | Certificate | 1-1 | oui | SET NULL | `certificateId` |
| 8 | Evaluation | Profile | N-1 | non | RESTRICT | `auditorId` |
| 9 | Evaluation | ContractDocument | 1-1 | oui | SET NULL | `reportDocumentId` |
| 10 | Certificate | Client | N-1 | non | CASCADE | `clientId` |
| 11 | ClientDocument | Client | N-N | oui | CASCADE pivot | `document_assignments` |
| 12 | Notification | Client | N-N | oui | CASCADE pivot | assigned (à arbitrer) |
| 13 | Resource | Client | N-N | oui | CASCADE pivot | assigned (à arbitrer) |
| 14 | Article | Profile | N-1 | (candidate) | SET NULL | `author` → `author_id` ? (Suspect #7) |

---

## Énumérations détectées

| Enum | Valeurs | Entité(s) |
|---|---|---|
| Role | `admin` · `client` | Profile |
| ClientLegalForm | `SAS` `SARL` `SA` `EURL` `SCI` `autre` | Client |
| ClientSector | `industrie` `tertiaire` `logistique` `medical` `erp_collectif` `immobilier` `autre` | Client |
| ClientStatus | `active` `onboarding` `paused` `archived` | Client |
| ContractDocumentType | `offer` `quote` `contract` `addendum` `resource` `report` `other` | ContractDocument |
| ContractDocumentStatus | `draft` `sent` `signed` `archived` | ContractDocument |
| EvaluationStatus | `scheduled` `in_progress` `completed` `cancelled` | Evaluation |
| VigiScoreGrade | `A` `B` `C` `D` | Evaluation, Certificate |
| CertificateStatus | `valide` `expire` `revoque` | Certificate |
| DocumentCategory | `newsletters` `capsules` `guides` `carnets` | ClientDocument |
| DocumentType | `pdf` `video` | ClientDocument |
| NotificationType | `veille` `document` `info` | Notification |
| ResourceCategory | `normes` `reglementation` `guides` `rapports` `veille` | Resource |
| ResourceType | `pdf` `lien` `video` | Resource |
| AccessType | `view-only` `download` | ClientDocument, Resource |
| Visibility | `global` `assigned` | ClientScoped (3 entités) |
| ArticleCategory | `Expertise` `Formation` `Réglementation` `Sécurité` `Innovation` | Article |
| ArticleStatus | `published` `draft` | Article |
| VigiScoreTendance | `+` `-` `""` | Certificate |

---

## Suspects et incohérences

1. **`CertificateStatus` FR vs décision EN** — type = `valide`/`expire`/`revoque`, mais décision A1 parle de RLS `status='active'`. À réconcilier (garder FR `valide` et adapter la RLS, ou migrer vers `active`/`expired`/`revoked`). **Impacte directement la RLS publique.**
2. **`compositeRating: string` non contraint** (Evaluation + Certificate) — note triple-lettre libre (ex "BBB"). Devrait être un type contraint (template literal de `VigiScoreGrade`³ ou enum). Risque d'incohérence de données.
3. **`ThreeCScore` 3 champs `string` libres** — format "lettre+modificateur" documenté en commentaire mais non imposé. Candidat enum/CHECK.
4. **`Resource` double timestamp** — `createdAt` ET `created_at`/`updated_at`. Harmoniser sur une seule convention (cible Supabase = `created_at`/`updated_at`).
5. **`Notification` + `ClientScoped` + `read` global** — le booléen `read` est porté par la notif elle-même, pas par (notif × destinataire). En `visibility='global'`, « marquer lu » serait partagé entre tous les clients. **Modèle à revoir** (table `notification_reads` par user ? ou notif strictement per-client ?). Side effect critique pour l'étape 2.
6. **`Founder` hors liste des 11 tables A3** — mais décision #6 la met en scope DB (source vitrine). Ajouter `founders` au schéma + lecture anon, OU statuer qu'elle reste en JSON statique. **Arbitrage A3.**
7. **`Article.author` texte libre** — pas de FK vers `Profile`. Décider : garder texte libre (auteur invité) ou `author_id → profiles`.
8. **`ClientScoped` : pivot unique vs colonnes vs pivots multiples** — appliqué à 3 entités (ClientDocument, Notification, Resource). La liste A3 ne mentionne que `document_assignments`. Choisir : (a) `assigned_client_ids uuid[]` + RLS `@>`, ou (b) un pivot par entité, ou (c) un pivot polymorphe. **Point AMBIGU majeur pour A3** (impacte RLS multi-tenant).
9. **`ClientDocument` vs `ContractDocument`** — deux entités « document » aux noms proches mais sémantiques opposées (portail client publié vs contractuel interne). Bien séparer tables + RLS (l'une visible client, l'autre admin-only).
10. **Lien Evaluation ↔ Certificate non bidirectionnel clair** — `evaluation.certificateId` existe, mais `certificate` n'a pas d'`evaluationId` ; `compositeRating`/`subCriteria` sont dupliqués des deux côtés. Définir la source de vérité.
11. **`Stat`/`AdminStats`** — pas une table : `stats.repo` calcule les KPI dynamiquement. ⇒ relève des **vues/RPC d'agrégation** (étape 2/3), à ne pas matérialiser naïvement.
12. **`ClientData`** — agrégat front (view-model), pas une entité persistée. Ne pas créer de table.
13. **Seed `fr/` only** — `clients`/`evaluations`/`contract_documents` seedés uniquement en `fr/` ; copies `en/` jamais lues. Données métier réelles → non localisées (cf. décision implicite). Nettoyer les mocks `en/` au cleanup.
14. **IDs `Date.now()`** — tous les repos génèrent `prefixe-<timestamp>` → remplacer par UUID Supabase.

---

## Recommandations pour l'étape 2 (détection des effets de bord)

À cibler en priorité lors de `02-detection-effets-bord` :

- **KPI/agrégations** : dashboard admin (`stats.repo` — clients actifs, évaluations par statut, distribution Vigi-Score `VigiDistribution`), `ClientKpiCards` (activeCount, scheduled/inProgress/completed evals), compteurs `evalCounts` par client, dashboard client, compteur de notifs non lues, `Article.views`.
- **États dérivés** : `Client.status` (active/onboarding/paused/archived) ; certificat expiré (comparaison `validityDate` vs maintenant) ; évaluation « en cours » ; `nextEvaluationDue` ; cohérence `evaluation.compositeRating` ↔ `certificate.compositeRating`.
- **Side effects sur écriture** : `markAsRead`/`markAllAsRead` (notifs) ; création d'évaluation → génération/lien certificat → génération PDF (`generate-certificate-pdf.ts` + QR code) ; assignation document/ressource à un client (`ClientScoped`) ; `softArchiveClient` (statut au lieu de delete) ; incrément `Article.views` ; dérivation du `slug` client (NFD).
- **Multi-tenant / RLS** : matérialiser la règle `ClientScoped` (point #8) ; lecture publique anon `Certificate` (#1) + `Settings`/`Founders` (#6) ; séparation `client_documents` (visible client) vs `contract_documents` (admin-only).
- **Storage** : `ContractDocument` (fichiers réels mimeType/fileSize) et PDF certificats ⇒ buckets + politiques.

---

> **Prochaine étape** : `02-detection-effets-bord` → `IMPLICIT_BUSINESS_LOGIC.md`. **EN ATTENTE DE TON GO** (relecture de cette carte). Je ne lance pas l'étape 2.
