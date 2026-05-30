# Admin Clients — Rapport de livraison

## Modeles crees

| Modele | Fichier | Champs principaux |
|--------|---------|-------------------|
| `Client` | `src/types/client.ts` | id, slug, companyName, legalForm, siret, sector, address, contacts[], status, contractDates, internalNotes |
| `ContractDocument` | `src/types/client.ts` | id, clientId, type (7 valeurs), title, version, fileName, fileSize, status (4 valeurs) |
| `Evaluation` | `src/types/client.ts` | id, clientId, siteName, visitDate, vigiScore, omtScore, compositeRating, auditorId, status, certificateId |

## Repos crees

| Repo | Fichier | Methodes |
|------|---------|----------|
| Clients | `src/lib/repo/clients.repo.ts` | list, getById, getBySlug, create, update, softArchive, delete, reset |
| ContractDocuments | `src/lib/repo/contract-documents.repo.ts` | list, listByClientId, get, create, update, delete, reset |
| Evaluations | `src/lib/repo/evaluations.repo.ts` | list, listByClientId, get, create, update, delete, reset |

## Routes creees

```
/admin/clients                          Liste clients + KPIs + filtres + creation
/admin/clients/[id]                     Vue d'ensemble fiche client
/admin/clients/[id]/societe             Infos legales + contacts + notes
/admin/clients/[id]/documents           Documents contractuels CRUD
/admin/clients/[id]/evaluations         Evaluations Vigi-Score CRUD
```

## Composants principaux crees

```
src/components/features/admin/clients/
  ClientKpiCards.tsx          4 cartes KPI (clients actifs, evals programmees/en cours/completees)
  ClientsFilters.tsx          Recherche + filtres statut/secteur
  ClientsTable.tsx            Tableau clients avec actions kebab
  ClientFormDialog.tsx        Dialog creation client avec validation
  ClientDeleteDialog.tsx      Dialog confirmation suppression
  ClientContext.tsx           React Context pour fiche client
  ClientBanner.tsx            Bandeau client avec infos + actions rapides
  ClientTabNav.tsx            Navigation tabs 4 sous-pages
```

## Donnees seed

| Fichier | Contenu |
|---------|---------|
| `clients.json` (FR + EN) | 5 clients : ENEDIS, CHU Lyon-Sud, Carrefour SC, Nexity, Mairie Villeurbanne |
| `contract_documents.json` (FR + EN) | 18 documents (offres, devis, contrats, rapports, avenants) |
| `evaluations.json` (FR + EN) | 5 evaluations (3 completed, 1 scheduled, 1 in_progress) |

## Modifications sur l'existant

- **Sidebar admin** : ajout entree "Clients" avec icone Briefcase, detection active via `pathname.includes()`
- **Routing i18n** : ajout `/admin/clients` et `/admin/clients/[id]` dans `routing.ts`
- **Types barrel** : ajout `export * from "./client"` dans `types/index.ts`
- **Messages i18n** : ajout section `admin.clients` dans `fr.json` et `en.json`

## Verifications

- `npx tsc --noEmit` : zero erreur
- `npm run lint` : zero nouvelle erreur (warnings pre-existants uniquement)
- `npm run build` : succes, toutes les routes generees
- Tous les fichiers < 250 lignes (societe 231, evaluations 227 — sous le seuil de 250)
- Toutes les refs croisees seeds coherentes (clientId, auditorId, reportDocumentId)

## Dettes techniques (Phase 2 Supabase)

| Sujet | Action |
|-------|--------|
| Generation PDF | Boutons mock pour l'instant, a brancher sur jsPDF ou service externe |
| Upload fichiers | Simule via metadata (fileName, fileSize), a migrer vers Supabase Storage |
| Certificats | certificateId genere aleatoirement, a lier au systeme de certificats existant |
| Repos → Supabase | Chaque repo a des TODO Supabase avec les requetes cibles |
| RLS attendues | clients: admin-only, contract_documents: admin + client owner, evaluations: admin-only |
| Indexes | clients(slug unique), contract_documents(client_id), evaluations(client_id, visit_date) |
| Temps reel | Supabase Realtime pour notifier les mutations entre onglets |
