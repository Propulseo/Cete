# Admin Clients — Document de Conception (Phase 0)

## 1. Arborescence admin actuelle

```
src/app/[locale]/admin/
  layout.tsx            # Sidebar + auth guard (AuthProvider + useAuth)
  page.tsx              # Redirect ou page index admin
  dashboard/page.tsx    # Dashboard KPIs + activite recente + actions rapides
  blog/page.tsx         # Gestion articles blog
  documents/page.tsx    # Gestion documents client (newsletters, capsules, guides, carnets)
  ressources/page.tsx   # Gestion ressources pedagogiques
  organizations/page.tsx # Gestion organisations
  team/page.tsx         # Gestion equipe (fondateurs)
  users/page.tsx        # Gestion utilisateurs (profils)
  settings/page.tsx     # Parametres
```

### Sidebar admin (`layout.tsx`)

8 entrees, ordre actuel :
1. Dashboard (`/admin/dashboard`, `LayoutDashboard`)
2. Blog (`/admin/blog`, `FileText`)
3. Documents (`/admin/documents`, `FolderOpen`)
4. Ressources (`/admin/ressources`, `Library`)
5. Organisations (`/admin/organizations`, `Building2`)
6. Equipe (`/admin/team`, `UserCircle`)
7. Utilisateurs (`/admin/users`, `Users`)
8. Parametres (`/admin/settings`, `Settings`)

Detection route active : `pathname === item.href` (match exact).
Pour les sous-routes `/admin/clients/[id]/*`, il faudra passer a `pathname.startsWith(item.href)`.

### Composants admin existants (`src/components/features/admin/`)

- `AdminStatsGrid` — grille de cartes KPI
- `AdminRecentActivity` — activite recente (docs + articles)
- `AdminQuickActions` — boutons d'actions rapides
- `AdminDocumentTable` / `AdminDocumentFilters` — tableau + filtres documents
- `AdminResourceTable` / `AdminResourceFilters` — tableau + filtres ressources
- `DocumentFormDialog` / `ResourceFormDialog` — dialogs creation/edition
- `ArticleFormDialog` / `FounderFormDialog` / `UserFormDialog` — dialogs entites

### Repos existants (`src/lib/repo/`)

9 repos : articles, users, notifications, stats, settings, founders, certificates, resources, documents.

Pattern de reference (`documents.repo.ts`) :
- Import `getItem/setItem` depuis `@/lib/store/storage`
- Cle localStorage namespacee (`cete_documents`)
- `seedIfEmpty()` avec version checking (`SEED_VERSION`)
- Fonctions async : `list*`, `get*`, `create*`, `update*`, `delete*`
- Throws `RepoError` avec entity + operation
- Seed depuis JSON : `import seedData from "@/data/mocks/..."`

### i18n

- `next-intl` v4 avec `[locale]` segment, `localePrefix: "always"`
- Messages dans `messages/fr.json` et `messages/en.json`
- Aucune cle `admin.*` existante — tout est hardcode en francais
- Navigation i18n : `src/i18n/navigation.ts` exporte `Link, redirect, usePathname, useRouter`
- Routes admin declarees dans `src/i18n/routing.ts` (pathnames)

---

## 2. Modeles de donnees TypeScript

> Fichier : `src/types/client.ts`

### Conflit de nommage

Le type `ClientDocument` existe deja dans `src/types/document.ts` (documents educatifs : newsletters, capsules, guides, carnets). Pour eviter toute collision, les documents business du module client admin sont nommes `ContractDocument`.

### 2.1 Client

```typescript
export type ClientLegalForm = "SAS" | "SARL" | "SA" | "EURL" | "SCI" | "autre";

export type ClientSector =
  | "industrie"
  | "tertiaire"
  | "logistique"
  | "medical"
  | "erp_collectif"
  | "immobilier"
  | "autre";

export type ClientStatus = "active" | "onboarding" | "paused" | "archived";

export interface ClientAddress {
  street: string;
  postalCode: string;
  city: string;
  country: string; // defaut "FR"
}

export interface ClientContact {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface Client {
  id: string;
  slug: string; // kebab-case derive du nom, unique
  companyName: string;
  legalForm: ClientLegalForm;
  siret: string; // 14 chiffres
  vatNumber?: string;
  sector: ClientSector;
  headcount?: string; // range : "1-10", "11-50", "51-200", "201-500", "500+"
  address: ClientAddress;
  contacts: ClientContact[];
  status: ClientStatus;
  contractStartDate: string; // ISO date
  contractEndDate?: string; // optionnel si tacite reconduction
  internalNotes: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}
```

### 2.2 ContractDocument

```typescript
export type ContractDocumentType =
  | "offer"
  | "quote"
  | "contract"
  | "addendum"
  | "resource"
  | "report"
  | "other";

export type ContractDocumentStatus = "draft" | "sent" | "signed" | "archived";

export interface ContractDocument {
  id: string;
  clientId: string;
  type: ContractDocumentType;
  title: string;
  version: number;
  fileName: string;
  fileSize: number; // bytes
  mimeType: string;
  uploadedAt: string; // ISO datetime
  uploadedBy: string; // admin user id
  status: ContractDocumentStatus;
  notes?: string;
}
```

### 2.3 Evaluation

```typescript
export type EvaluationStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export type VigiScoreGrade = "A" | "B" | "C" | "D";

export interface OmtScore {
  autoEvaluation: string; // ex: "A-", "B+", "B"
  maitriseExigences: string;
  maitriseOperationnelle: string;
}

export interface Evaluation {
  id: string;
  clientId: string;
  siteName: string;
  siteAddress: string;
  visitDate: string; // ISO date
  vigiScore?: VigiScoreGrade; // attribue a la completion
  omtScore?: OmtScore; // attribue a la completion
  compositeRating?: string; // ex: "ABB", "AAA" — combinaison 3C
  certificateId?: string; // reference au certificat emis
  auditorId: string; // reference a un fondateur/expert
  status: EvaluationStatus;
  reportDocumentId?: string; // lien vers le ContractDocument rapport
  nextEvaluationDue?: string; // ISO date
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 3. Sous-pages de la fiche client (4 sous-pages)

### 3.1 Vue d'ensemble (`/admin/clients/[id]`)

Route index, page d'atterrissage. Grille de cards en lecture seule :
- **Statut contrat** : badge statut + dates debut/fin, duree restante
- **Prochaine evaluation** : date, site, auditeur — lien direct vers sous-page evaluations
- **Derniere evaluation** : Vigi-Score affiche en gros (badge couleur), date, site
- **Infos societe** : resume SIRET, secteur, effectif, contact primaire
- **3 derniers documents** : titre, type, date — lien vers sous-page documents

Composants : `Card`, `Badge`, `Separator`

### 3.2 Societe (`/admin/clients/[id]/societe`)

Affiche et edite les infos legales et contacts.

**Section 1 — Infos societe** : lecture par defaut, bouton "Modifier" ouvre Dialog d'edition. Champs : nom, forme juridique, SIRET, TVA, secteur, effectif. Validation Zod.

**Section 2 — Adresse** : affichage + edition via Dialog.

**Section 3 — Contacts** : liste en cards. Bouton "Ajouter un contact". Edition/suppression par contact via menu kebab. Designation contact primaire (un seul a la fois). Validation Zod sur chaque contact.

Composants : `Card`, `Dialog`, `Form`, `Input`, `Select`, `Button`, `DropdownMenu`

### 3.3 Documents (`/admin/clients/[id]/documents`)

Tableau des documents du client, groupes par type.

- Filtres par type (`ContractDocumentType`) et statut (`ContractDocumentStatus`)
- Bouton "Uploader un document" → Dialog : fichier (mock, on stocke nom + taille), type, titre, version auto-incrementee, statut initial
- Colonnes tableau : titre, type (badge), version, statut (badge), date upload, taille, actions
- Actions par ligne : modifier metadonnees (Dialog), changer statut (draft → sent → signed), archiver, supprimer
- Empty state dedie si aucun document

Composants : `Table`, `Dialog`, `Form`, `Select`, `Badge`, `DropdownMenu`, `Button`

### 3.4 Evaluations (`/admin/clients/[id]/evaluations`)

Coeur metier CETe.

- Liste/timeline des evaluations passees et programmees, triees par date
- Bouton "Planifier une evaluation" → Dialog : site (libre ou copie siege), date prevue, auditeur (select parmi fondateurs), notes
- Pour chaque evaluation, card detaillee : statut, date visite, scores Vigi-Score et OMT si completee, lien rapport, auditeur
- Bouton "Completer" si `in_progress` → Dialog saisie des scores (vigiScore A/B/C/D, 3 sous-criteres OMT, rating composite auto-calcule)
- A la completion : creation d'un `ContractDocument` type `report`, generation `certificateId`, statut → `completed`
- Affichage date prochaine evaluation due

Composants : `Card`, `Dialog`, `Form`, `Select`, `Badge`, `Button`, `Separator`

---

## 4. Nouvelles routes a creer

```
src/app/[locale]/admin/clients/
  page.tsx                          # Liste clients + KPIs + filtres + creation
  [id]/
    layout.tsx                      # Layout fiche client (bandeau + nav tabs + context)
    page.tsx                        # Vue d'ensemble (route index)
    societe/page.tsx                # Infos societe + contacts
    documents/page.tsx              # Documents contractuels
    evaluations/page.tsx            # Evaluations Vigi-Score
```

## 5. Nouveaux composants a creer

```
src/components/features/admin/clients/
  ClientKpiCards.tsx                 # 4 cartes KPI pour la liste
  ClientsTable.tsx                  # Tableau clients avec tri/filtre
  ClientsFilters.tsx                # Barre filtres + recherche
  ClientFormDialog.tsx              # Dialog creation/edition client
  ClientDeleteDialog.tsx            # Dialog confirmation suppression
  ClientBanner.tsx                  # Bandeau haut fiche client
  ClientTabNav.tsx                  # Navigation tabs sous-pages
  ClientOverviewGrid.tsx            # Grille cards vue d'ensemble
  ClientCompanySection.tsx          # Section infos societe
  ClientAddressSection.tsx          # Section adresse
  ClientContactsList.tsx            # Liste contacts avec CRUD
  ContactFormDialog.tsx             # Dialog creation/edition contact
  ClientDocumentsTable.tsx          # Tableau documents client
  ClientDocumentFilters.tsx         # Filtres documents
  ClientDocumentFormDialog.tsx      # Dialog upload/edition document
  EvaluationsList.tsx               # Liste/cards evaluations
  EvaluationFormDialog.tsx          # Dialog planification evaluation
  EvaluationCompleteDialog.tsx      # Dialog completion avec scores
```

## 6. Nouveaux repos a creer

```
src/lib/repo/clients.repo.ts           # CRUD Client
src/lib/repo/contract-documents.repo.ts # CRUD ContractDocument
src/lib/repo/evaluations.repo.ts       # CRUD Evaluation
```

Chaque repo suit le pattern `documents.repo.ts` : getItem/setItem, seedIfEmpty avec SEED_VERSION, async, RepoError, seed depuis JSON.

Methodes additionnelles :
- `clients.repo.ts` : `getBySlug(slug)`, `softArchive(id)` (status → archived)
- `contract-documents.repo.ts` : `getByClientId(clientId)`
- `evaluations.repo.ts` : `getByClientId(clientId)`

## 7. Seed data a creer

```
src/data/mocks/fr/clients.json             # 5 clients
src/data/mocks/fr/contract_documents.json   # 15-20 documents
src/data/mocks/fr/evaluations.json          # 5-8 evaluations
src/data/mocks/en/clients.json              # Mirrors avec [EN]
src/data/mocks/en/contract_documents.json
src/data/mocks/en/evaluations.json
```

### Profils des 5 clients seed

| # | Nom | Secteur | Statut | Contacts | Evals |
|---|-----|---------|--------|----------|-------|
| 1 | ENEDIS Rhone-Alpes | industrie | active | 3 | 2 (1 completed, 1 scheduled) |
| 2 | Centre Hospitalier Lyon-Sud | medical | active | 2 | 1 (completed) |
| 3 | Carrefour Logistique Venissieux | logistique | active | 2 | 1 (in_progress) |
| 4 | Nexity Immobilier Grand Lyon | immobilier | onboarding | 2 | 0 |
| 5 | Mairie de Villeurbanne | erp_collectif | paused | 2 | 1 (completed) |

## 8. i18n

Nouvelles cles dans `messages/fr.json` et `messages/en.json` sous `admin.clients` :
- `admin.clients.list.*` — page liste
- `admin.clients.detail.*` — layout fiche + bandeau
- `admin.clients.overview.*` — vue d'ensemble
- `admin.clients.company.*` — societe
- `admin.clients.documents.*` — documents
- `admin.clients.evaluations.*` — evaluations
- `admin.clients.form.*` — formulaires partages
- `admin.clients.status.*` — labels statuts
- `admin.clients.sectors.*` — labels secteurs

## 9. Modifications sur l'existant

1. **Sidebar** (`src/app/[locale]/admin/layout.tsx`) :
   - Ajouter entree "Clients" avec icone `Briefcase` entre Dashboard et Blog
   - Changer detection active de `===` a `startsWith` pour supporter les sous-routes

2. **Routing** (`src/i18n/routing.ts`) :
   - Ajouter pathnames `/admin/clients` et `/admin/clients/[id]`

3. **Types barrel** (`src/types/index.ts`) :
   - Ajouter `export * from "./client"`

---

## 10. Architecture des donnees croisees

```
Client.id ←── ContractDocument.clientId
Client.id ←── Evaluation.clientId
Evaluation.auditorId ──→ Founder.id (fondateurs existants)
Evaluation.reportDocumentId ──→ ContractDocument.id
Evaluation.certificateId ──→ CertificateData.id (certificats existants)
```

Toutes les references croisees dans les seeds doivent pointer sur des enregistrements existants.
