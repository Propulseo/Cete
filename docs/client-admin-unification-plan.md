# Plan d'unification data + design — Espace client ↔ Admin refondu

> **Phase 0 — Audit comparatif & plan.** Document de cadrage uniquement. **Aucune ligne de code écrite.**
> Date : 2026-05-29.
> Objectif : aligner l'espace `/client/*` sur le design system produit par le redesign `/admin/*`,
> et unifier les modèles de données (un seul schéma partagé admin↔client) pour préparer Supabase.
>
> **Ce chantier vit EN PARALLÈLE du redesign admin.** Il s'appuie sur ses livrables (tokens, composants
> partagés) sans les redéfinir. Source de vérité visuelle : [`docs/admin-redesign-brief.md`](admin-redesign-brief.md).
> Les arbitrages A→F du brief sont **verrouillés (2026-05-29)** et sont la base de ce plan.

---

## 0. Résumé exécutif — écarts entre le prompt et la réalité du code

L'audit lecture seule (4 explorations parallèles : design system, types+mocks, repos+auth+constants, espace client) révèle un état **plus avancé et différent** de ce que le prompt suppose. Six corrections structurent ce plan :

| # | Hypothèse du prompt | Réalité constatée | Conséquence pour le plan |
|---|---|---|---|
| C0-1 | Le redesign admin n'a produit que le brief (Phase 0), à attendre | Le brief est **périmé** (dernière ligne « STOP Phase 0 »), mais l'admin a déjà livré **tokens `.admin-theme`** (globals.css L186-274), **Source Serif 4** chargé, et **8 composants partagés** dans `src/components/features/admin/ui/` + `AdminSidebar`, `VigiDistribution`. | On peut démarrer : les composants à mutualiser existent. `src/components/shared/` n'existe pas encore (cible vierge). |
| C0-2 | « Deux JSON séparés (un admin, un client) à fusionner » | **Faux pour le portail.** `documents`, `resources`, `notifications`, `articles` sont **déjà des fichiers JSON uniques** consommés par un **repo unique** côté admin ET client. Il n'y a pas de split admin/client à fusionner. | La vraie dette de duplication est **root vs `fr/` vs `en/`** : les repos seedent depuis `root` (ou `fr/`), les copies `en/` sont **données mortes**. Phase 1 = traiter cette duplication, pas un merge admin/client. |
| C0-3 | Newsletter, Capsule, Guide, Carnet = entités distinctes | **Faux.** Ce sont toutes des lignes `ClientDocument` discriminées par `category` (`newsletters`/`capsules`/`guides`/`carnets`) dans le **même** `client_documents.json`. | Le schéma unifié traite une seule entité `ClientDocument` + discriminant `category`. Les 4 pages client sont des quasi-duplicatas (candidat dédup fort). |
| C0-4 | L'assignation client se fait via `clientId` | **Incohérence d'identité bloquante.** Le client démo connecté a `id = "cli-12345"`, mais les données relationnelles (`clients.json`, `evaluations.json`, `contract_documents.json`) utilisent `cli-001..005`. Donc `listEvaluationsByClientId("cli-12345")` → `[]`, idem contract-docs. Les documents ne « marchent » que parce qu'ils sont **tous `visibility:"global"`**. Les certificats ne « marchent » que via un **match sur `companyName`** (`"Electricité Pro SA"`), pas par id. | **Blocker n°1.** Phase 1 doit canoniser un `clientId` démo unique présent dans `clients.json` et y rattacher éval/cert/docs/contrat. |
| C0-5 | `ClientDocument.visibility` = `'global' \| 'assigned'` à introduire | Le type a **déjà** `visibility: 'global' \| 'client'` + `clientId?` + `accessRights?` (inutilisé), mais **jamais exercé** (les 12 docs sont `global`, aucun `clientId`). | On **remplace** le couple `'global'\|'client'` + `clientId` unique par le contrat `visibility: 'global'\|'assigned'` + `assignedClientIds: string[]` (multi). On supprime `accessRights`. |
| C0-6 | `RatingBadge`/`KPITile` à mutualiser depuis l'admin | Les composants existent sous d'autres noms : `RatingSeal`+`CompositeRating` (`rating-seal.tsx`), `KpiTile` (`kpi-tile.tsx`), `AdminCard`, `AdminTable`, `StatusBadge`, `AdminPageHeader`, `AdminEmptyState`, `AdminQuickAction`. | L'inventaire §4 mappe chaque composant cible du prompt sur son équivalent réel. **Le certificat client utilise aujourd'hui des couleurs ad-hoc** (vert/jaune/`#4DA6D9`) et une note style S&P — c'est le plus gros réalignement. |

### 0.1 Décisions verrouillées (2026-05-29)

| Réf | Décision | Verrouillé |
|---|---|---|
| **Chantier admin** | Le redesign `/admin/*` est **terminé** → plus de travail parallèle, plus de risque de conflit. Les composants `admin/ui/*` peuvent être **déplacés + renommés** vers `shared/` avec adaptation des imports admin (sans casser l'admin). | ✅ |
| **STY-1** | Scope tokens client = **dupliquer** le bloc nécessaire dans un `.client-theme` (globals.css) + charger Source Serif 4 côté client. Zéro fichier admin touché côté tokens. | ✅ |
| **SCH-6** | Types unifiés restent dans **`src/types/`** (pas de migration vers `src/lib/types/`). | ✅ |
| **SCH-4** | Copies `en/` mortes du portail/CRM : **conservées sans câbler** (statu quo, aucune suppression). Note : leur schéma divergera des mocks root/fr enrichis — documenté comme données mortes non lues. | ✅ |
| **SCH-1** | Assignation **multi** : `assignedClientIds: string[]`. | ✅ (sans objection) |
| **SCH-2** | Clés 3C alignées sur `THREE_C_CRITERIA` (`autoEvaluation`/`recommandation`/`gestesMetiers`). | ✅ (sans objection) |
| **SCH-3 / ID-1** | Identité client canonique : ajouter le client démo **« Electricité Pro SA » (Jean Dupont)** dans `clients.json`, `Profile.clientId` = son id, rattacher éval/cert/docs/contrat. | ✅ (sans objection) |

> Les tables §3.4 et §4.1 ci-dessous conservent les options pour traçabilité ; les lignes verrouillées ci-dessus priment.

---

## 1. État du redesign admin (as-built)

### 1.1 Tokens `.admin-theme` (globals.css L186-274)

Les overrides admin **redéfinissent les tokens sémantiques shadcn** (`--background`, `--card`, `--primary`, `--border`…) dans le sélecteur `.admin-theme` **plus** des tokens additifs `--admin-*` / `--vigi-*`. Le bloc `@theme inline` (L9-93) expose certains en utilitaires Tailwind (`bg-admin-pos`, `bg-vigi-a-fill`…) avec **fallbacks portables**.

| Token | Valeur | Rôle | Fallback global ? |
|---|---|---|---|
| `--background` | `#F8F9FB` | Canvas cool-paper | non (admin scope) |
| `--card` | `#FFFFFF` | Vraie surface (lève par luminance) | — |
| `--primary` | `#1A7AB5` | Bleu INK : ledge actif, bouton/action primaire, filet | overrides `:root #4DA6D9` |
| `--border` / `--input` | `#E6ECF1` | Hairline par défaut | — |
| `--muted` / `--muted-foreground` | `#EEF2F6` / `#4A6580` | Surface/texte muté | — |
| `--secondary` | `#F1F4F8` | Pilule badge, avatar, thead | — |
| `--accent` | `#EAF1F6` | Wash de hover | — |
| `--admin-sidebar` | `#FCFCFD` | Fond du rail (clair, **pas** sky-blue) | exposé `--color-admin-sidebar` |
| `--admin-sidebar-hover` | `#EAF1F6` | Hover nav / ligne table | **non** (scope only) |
| `--admin-line` | `#E6ECF1` | Hairline rail/cartes/dividers | exposé `--color-admin-line` |
| `--admin-blue-ink/-fill/-link` | `#1A7AB5` / `#4DA6D9` / `#0D5A8A` | Accents bleus | — |
| `--admin-pos/-neg/-stable/-urgent` | `#15803D` / `#B91C1C` / `#8AA5BE` / `#E8630A` | Tendances + sémantique | `text-admin-*` ont fallback |
| `--vigi-{a,b,c,d}-fill` | `#15803D` / `#A16207` / `#C2410C` / `#B91C1C` | Sceau plein (texte blanc, AA) | `bg-vigi-*-fill` ont fallback |
| `--vigi-{a..d}-raw` | `#22C55E` / `#A3E635` / `#F97316` / `#EF4444` | Pastilles légende / filets **jamais sous texte** | **non** |
| `--vigi-{a..d}-tint` | `rgba(...,0.12)` | Sceaux inline-sm | **non** |
| `--vigi-fg` | `#FFFFFF` | Texte sur sceau plein | **non** |
| `--radius` | `0.625rem` (=10px) | Hérité `:root` (les composants codent `rounded-[10px]` en dur, **non lié** au token) | global |

Un bloc dark-mode anticipé existe (L251-274), aucun toggle câblé.

### 1.2 Fonts

- **Source Serif 4** (`next/font/google`, `variable: "--font-source-serif"`, styles normal+italic) chargé **dans le layout admin** `src/app/[locale]/admin/layout.tsx` (pas dans le layout racine, qui ne charge qu'Inter + Merriweather).
- Scopé : `const adminScope = \`admin-theme ${sourceSerif.variable}\`` appliqué au wrapper in-flow, à l'état loading, **et** au `SheetContent` mobile (portail hors arbre).
- `.admin-theme` déclare `--font-serif-display: var(--font-source-serif), Georgia, serif` ; l'utilitaire `.font-serif-display` (globals.css L378-381) l'applique. Utilisé par `AdminPageHeader h1`, `VigiDistribution h2`, `RatingSeal` taille hero.
- **Conséquence pour le client** : l'utilitaire `.font-serif-display` retombe sur Georgia **sans** la variable de font en scope. Adopter la serif côté client **impose de charger Source Serif 4 dans le layout client** (ou un layout partagé) et de déclarer les tokens dans le scope client. → voir §4.1.

### 1.3 Composants partagés admin produits (`src/components/features/admin/ui/`)

Tous : pilotés par tokens (pas de couleurs en dur, sauf l'ombre `rgba(26,41,64,0.04)`), `cn` de `@/lib/utils`, icônes Lucide.

| Composant | Exports / API clés | Variantes | Réutilisable client tel quel ? |
|---|---|---|---|
| **rating-seal** | `RatingSeal{value,size,showGlyph,serif}`, `CompositeRating{value,labels}`, type `VigiGrade='A'\|'B'\|'C'\|'D'` | tailles `inline-sm/md/lg/hero` (const map, pas CVA) | **Oui** (Vigi-Score est un concept CETé partagé). Couplé à `THREE_C_CRITERIA`. Requiert tokens `--vigi-*` en scope. |
| **admin-card** | `AdminCard/Header/Title/Content` (props = `ComponentProps<div>`) | aucune | Oui → **renommer `SurfaceCard`** en `shared/`. Requiert `--admin-line`. |
| **kpi-tile** | `KpiTile{label,value,trend,icon}` (infère ↑/↓/= du `trend`) | aucune | **Oui** (fallbacks `text-admin-*` valides hors scope). |
| **admin-table** | `AdminTable/Thead/Th/Tbody/Tr/Td` (primitives `<table>` maison) | aucune | Oui. Requiert `--admin-line` + `--admin-sidebar-hover` (sans fallback). |
| **status-badge** | `StatusBadge{status?,tone?,children}`, `statusTone()`, `StatusTone='pos'\|'warn'\|'info'\|'neutral'` | mapping ~16 statuts → ton, pastille colorée only | **Oui** (vocabulaire générique). |
| **admin-page-header** | `AdminPageHeader{title,subtitle,actions}` (`h1.font-serif-display`) | aucune | Oui → **renommer `PageHeader`**. Requiert la font serif en scope. |
| **admin-empty-state** | `AdminEmptyState{icon,title,description,action}` | aucune | Oui → **renommer `EmptyState`**. Requiert `--admin-line`. |
| **admin-quick-action** | `AdminQuickAction{href,icon,title,description,primary}` | `primary` | Oui (admin-spécifique mais lift possible). |

**Blockers de lift (tokens sans fallback global) :** `--admin-line`, `--admin-sidebar-hover`, `--vigi-*-tint`, `--vigi-*-raw`, `--vigi-fg`, et la font `--font-source-serif`/`--font-serif-display`. → résolus par la stratégie de scope §4.1.

### 1.4 Synthèse du brief (l'identité que le client doit adopter)

1. Canvas **cool-paper `#F8F9FB`** + vraies surfaces blanches qui « lèvent » par luminance (1px hairline `#E6ECF1` + ombre 4%). **La carte est l'exception, le filet la règle.**
2. **Rail clair récessif `#FCFCFD`** (`w-64` fixe), hairline droit `#E6ECF1`, **jamais** de panneau sky-blue ; logo réel `logo-cete-adn.png` `h-8` sur masthead `h-16`.
3. **Bleu INK `#1A7AB5` = aiguille de précision** : ledge actif 3px + wash 7%, boutons primaires, le filet `h-[3px]` du hero de notation. Orange `#E8630A` = seulement « urgent/en retard ».
4. **Source Serif 4** pour titres de page et titres de section ; Inter partout ailleurs ; `tabular-nums` sur métriques/notes.
5. **La grammaire Vigi-Score A/B/C/D est le cœur visuel** : sceaux `-fill` AA + glyphe redondant, via `RatingSeal`/`CompositeRating`.
6. Sémantique tokenisée (jamais de palette Tailwind brute), pastilles de statut, eyebrows majuscules — sobre, documentaire, institutionnel.

---

## 2. Audit du modèle de données

### 2.1 Cartographie des entités

| Entité | Type | Mock(s) | Nature | Repo | Lecture client | Scoping aujourd'hui |
|---|---|---|---|---|---|---|
| **ClientDocument** | `types/document.ts` | `client_documents.json` (+fr/+en) | umbrella, discriminé par `category` | `documents.repo` | `listDocumentsForClient(id)` | `visibility==='global' \|\| clientId===id` (jamais exercé : 12 docs tous `global`) |
| Newsletter/Capsule/Guide/Carnet | — | idem (`documents[]`) | **= `ClientDocument` + category** | — | filtre `.category` côté page | hérité de ClientDocument |
| **Resource** | `types/resource.ts` | `resources.json` (+fr/+en) | distinct, discriminé par `category` | `resources.repo` | `listResources()` (pas de filtre client) | **aucun** (implicitement global) |
| **Notification** | `types/document.ts` | dans `client_documents.json` (`notifications[]`) | propre | `notifications.repo` | `listNotifications()` / `getUnreadCount()` | **aucun** (global, pas de `clientId`) |
| **Certificate** | `types/certificate.ts` | **aucun JSON** (`MOCK_CERTIFICATES` en dur dans le repo) | propre | `certificates.repo` | `listCertificatesForClient(companyName)` | **match `companyName`** (pas `clientId`) |
| **Evaluation** | `types/client.ts` | `fr/evaluations.json` (+en) | propre | `evaluations.repo` | `listEvaluationsByClientId(id)` | `clientId` réel `cli-001..005` ✓ |
| **Client** | `types/client.ts` | `fr/clients.json` (+en) | propre, ancre | `clients.repo` | `getClientById/Slug` | ancre de scoping |
| **ContractDocument** | `types/client.ts` | `fr/contract_documents.json` (+en) | propre | `contract-documents.repo` | `listContractDocumentsByClientId(id)` | `clientId` réel ✓ |
| **Organization** | **aucun** (`string[]`) | `organizations.json` (+fr/+en) | liste d'affichage | — (data-loader) | — | aucun (pas lié à `Client`) |
| **Article** | `types/article.ts` | `admin_articles.json` (+fr/+en) | propre | `articles.repo` | — (blog public) | aucun |
| **Profile** (auth) | `types/auth.ts` | hardcodé `auth.ts` + seed `users.repo` | session | `users.repo` | `useAuth()` | `id` = clientId utilisé par les pages |

### 2.2 Points clés par entité (divergences notables)

- **ClientDocument** : `visibility:'global'\|'client'`, `clientId?`, `accessRights?` (inutilisé), `accessType:'view-only'\|'download'`, `type:'pdf'\|'video'`. Toutes les capsules ont `youtubeId:""` vide. Le conteneur porte `clientId:"cli-12345"` (orphelin, absent de `clients.json`).
- **Resource** : `category` (normes/reglementation/guides/rapports/veille — seul `guides` recoupe ClientDocument), `type:'pdf'\|'lien'\|'video'`, **`accessMode:'lecture'\|'telechargement'`** (même concept que `accessType` mais nom + valeurs + langue différents), pas de scoping. Gap d'id (`res-008` manquant).
- **Certificate** : pas de `clientId` ; `rating` libre (`"BBB"`), `vigiScore` libre (`"B"`, alors que `VigiScoreGrade` existe et n'est pas réutilisé) ; **les ids cert (`cete-cert-2026-0042-a7f3`) ne correspondent PAS aux `evaluation.certificateId`** (`cete-cert-2025-0051-c3d2`…) → store cert et store éval **déconnectés**.
- **Evaluation** : correctement scopée `clientId`, lie `reportDocumentId`→contract-docs et `certificateId`→(certs inexistants). `compositeRating` triple-lettre (`"BAB"`,`"AAA"`,`"CCB"`). `auditorId` = `"1"/"2"/"3"` (espace d'id incohérent avec `uploadedBy:"adm-001"`).
- **`CertificateSubCriteria` vs `OmtScore`** : deux interfaces quasi-identiques (mêmes 3 champs `autoEvaluation/maitriseExigences/maitriseOperationnelle`). **Mais** les `id` de `THREE_C_CRITERIA` sont `autoEvaluation/recommandation/gestesMetiers` → seule la 1ʳᵉ clé matche. À réconcilier.
- **fileSize** : `string` (« 1.2 MB ») sur ClientDocument/Resource, **`number` (octets)** sur ContractDocument. Même nom, type différent.

### 2.3 Modèle d'assignation/visibilité actuel — synthèse

Deux régimes **déconnectés** coexistent :
1. **Contenu portail (Document, Notification, Resource, Certificate)** : aucun scoping réel. ClientDocument a la machinerie mais ne l'exerce pas ; Notification/Resource n'ont aucun champ ; Certificate se rattache par `companyName`.
2. **CRM (Client, Evaluation, ContractDocument)** : relationnel correct via `clientId` (`cli-001..005`), mais **isolé du contenu portail** (aucun document/cert ne porte `cli-001..005`).

« Global vs assigné » n'existe donc que comme concept typé sur `ClientDocument`. En pratique tout le portail est global, tout le CRM est par-client mais coupé du portail.

### 2.4 Problèmes transverses (à corriger en Phase 1-2)

- **B-1 — Identité client** : `cli-12345` (session) vs `cli-001..005` (CRM) vs `companyName` (cert). **Blocker n°1.**
- **B-2 — Cert ↔ Éval déconnectés** : ids croisés inexistants ; cert filtré par nom. Standardiser sur `clientId`.
- **B-3 — Pas de contrat de visibilité partagé** : seul ClientDocument l'a. Cible : `visibility:'global'\|'assigned'` + `assignedClientIds[]` uniforme.
- **B-4 — Données mortes `en/`** : repos seedent root/fr ; toutes les copies `en/` (client_documents, resources, clients, evaluations, contract_documents, admin_articles, admin_stats) **ne sont jamais lues**. `en/admin_articles.json` introduit même une catégorie invalide `"Training"` (hors union `ArticleCategory`).
- **B-5 — Typage** : `rating`/`vigiScore`/`compositeRating`/`headcount`/`Stat.trend`/`BlogPost.category` en `string` libre ; `accessType` vs `accessMode` ; timestamps mixtes `created_at?` vs `createdAt`.
- **B-6 — 2 repos legacy** (`founders`, `certificates`) n'utilisent pas `storage.ts`, pas de try/catch, pas de `RepoError`.

---

## 3. Schéma unifié proposé

### 3.1 Principes

1. **Un contrat de visibilité partagé** pour le **contenu publié** (documents, ressources, notifications) :
   ```ts
   type Visibility = 'global' | 'assigned';
   interface ClientScoped {
     visibility: Visibility;          // 'global' = tous les clients ; 'assigned' = seulement assignedClientIds
     assignedClientIds: string[];     // ids de Client ; [] quand global
   }
   ```
   Règle de filtre client unique : `visibility === 'global' || assignedClientIds.includes(clientId)`.
2. **Les records CRM mono-client** (Client, Evaluation, ContractDocument, **Certificate**) **ne portent pas** `assignedClientIds[]` : ils appartiennent à **un seul** `clientId` (toujours « assigned » par nature). On les rattache par `clientId`.
3. **Assignation multi** (`assignedClientIds: string[]`) retenue plutôt que mono, pour : (a) publier une newsletter à un sous-ensemble de clients, (b) coller à la cible Supabase `assigned_client_ids uuid[]` / table de jointure. *(Décision SCH-1, §3.4.)*
4. **Réutiliser le système de notation canonique** : `VigiScoreGrade = 'A'\|'B'\|'C'\|'D'` (`constants.ts` / `client.ts`), `THREE_C_CRITERIA` pour les libellés. Ne **jamais** réintroduire l'échelle S&P (`ADN_LEVELS` est `@deprecated`).

### 3.2 Schéma par entité (types canoniques cibles, dans `src/lib/types/`)

```ts
// ── Contrat partagé ───────────────────────────────────────────
type Visibility = 'global' | 'assigned';
interface ClientScoped { visibility: Visibility; assignedClientIds: string[]; }
type AccessType = 'view-only' | 'download';   // unifie ClientDocument.accessType ET Resource.accessMode

// ── ClientDocument (newsletters/capsules/guides/carnets) ──────
type DocumentCategory = 'newsletters' | 'capsules' | 'guides' | 'carnets';
type DocumentType = 'pdf' | 'video';
interface ClientDocument extends ClientScoped {
  id; title; category: DocumentCategory; type: DocumentType; description;
  fileSize?: string; duration?: string; uploadDate; url?; youtubeId?;
  accessType: AccessType; createdAt; updatedAt;
}
// SUPPRIMÉ : ancien visibility:'global'|'client', clientId unique, accessRights.

// ── Resource ──────────────────────────────────────────────────
type ResourceCategory = 'normes' | 'reglementation' | 'guides' | 'rapports' | 'veille';
type ResourceType = 'pdf' | 'lien' | 'video';
interface Resource extends ClientScoped {
  id; title; description; category: ResourceCategory; type: ResourceType;
  accessType: AccessType;            // ex-accessMode 'lecture'|'telechargement' → unifié
  url; youtubeId?; fileSize?: string; source?; publishedDate; createdAt; updatedAt;
}
// Seed actuel → tout en visibility:'global', assignedClientIds:[].

// ── Notification ──────────────────────────────────────────────
type NotificationType = 'veille' | 'document' | 'info';
interface Notification extends ClientScoped {
  id; type: NotificationType; message; date; read: boolean;
}
// Seed actuel → tout global ; permet plus tard des notifs assignées.

// ── Certificate (réconcilié A/B/C/D + clientId) ───────────────
type CertificateStatus = 'valide' | 'expire' | 'revoque';
interface ThreeCScore { autoEvaluation: string; recommandation: string; gestesMetiers: string; }  // clés alignées THREE_C_CRITERIA
interface Certificate {
  id; certificateNumber; clientId;                 // NEW : remplace le match companyName
  companyName; siren; address;
  compositeRating: string;                         // triple-lettre (ex "BBB") — ex-`rating`
  vigiScore: VigiScoreGrade;                       // 'A'|'B'|'C'|'D' (réutilise le type)
  vigiScoreTendance: '+' | '-' | '';
  subCriteria: ThreeCScore;                        // ex-CertificateSubCriteria, clés THREE_C
  evaluationDate; validityDate; expertName; status: CertificateStatus; createdAt;
}

// ── Evaluation (OmtScore → ThreeCScore partagé) ───────────────
interface Evaluation {
  id; clientId; siteName; siteAddress; visitDate;
  vigiScore?: VigiScoreGrade; omtScore?: ThreeCScore; compositeRating?: string;
  certificateId?; auditorId; status; reportDocumentId?; nextEvaluationDue?; notes?; createdAt; updatedAt;
}
// OmtScore et CertificateSubCriteria fusionnés en ThreeCScore.

// ── Profile (lien explicite vers le Client) ───────────────────
interface Profile {
  id; email; name; role: 'admin' | 'client';
  clientId?: string;                               // NEW : FK vers Client (≠ id auth) ; requis pour role==='client'
  company?; phone?; is_active; created_at?; updated_at?;
}
```

Client, ContractDocument, Organization : voir §3.4 (Organization → type réel optionnel ; ContractDocument inchangé hormis cohérence `fileSize`).

### 3.3 Identité client canonique (fix B-1)

Cible : **un seul `clientId` démo** qui existe dans `clients.json` ET correspond à `Profile.clientId`, avec éval + cert + docs + contrat rattachés. Le scénario Phase 6 du prompt impose « Jean Dupont / Electricité Pro SA ».

- Option recommandée **(ID-1)** : ajouter une entrée `Client` « Electricité Pro SA » (contact principal Jean Dupont) dans `clients.json`, lui donner un id canonique (réutiliser **`cli-12345`** ou un `cli-006`), et :
  - `Profile.clientId` (compte démo client) = cet id ;
  - rattacher `MOCK_CERTIFICATES` (déjà « Electricité Pro SA ») via `clientId` ;
  - ajouter ≥1 évaluation + ≥1 contract-doc pour ce client ;
  - ajouter quelques `ClientDocument` `visibility:'assigned'` pour ce client + garder des `global`.
- Option alternative **(ID-2)** : repointer `Profile` démo sur `cli-001` et renommer ce client en « Electricité Pro SA ». Plus destructif des données existantes.

### 3.4 Décisions de schéma à valider (avant Phase 1)

| Réf | Décision | Reco |
|---|---|---|
| **SCH-1** | Assignation **multi** (`assignedClientIds: string[]`) vs **mono** (`assignedClientId: string`) | **Multi** (flexibilité + cible Supabase `uuid[]`). |
| **SCH-2** | Réconcilier les clés 3C : aligner les données stockées (`maitriseExigences/maitriseOperationnelle`) sur les `id` de `THREE_C_CRITERIA` (`recommandation/gestesMetiers`) | **Aligner sur THREE_C_CRITERIA** (migration mocks + mapping `CompositeRating`). |
| **SCH-3** | Identité client démo : **ID-1** (ajouter le client) vs **ID-2** (repointer cli-001) | **ID-1.** |
| **SCH-4** | Données mortes `en/` du portail/CRM : (a) les supprimer (repos restent FR-only en Phase 1), (b) les câbler (repos locale-aware) | **(a) Supprimer** en Phase 1 — la localisation des données mutables relève de Supabase (Phase 2 future), hors périmètre. À confirmer. |
| **SCH-5** | `Organization` : créer un vrai type `{id,name,logo?}` lié à `Client`, ou garder `string[]` d'affichage | **Garder `string[]`** (hors périmètre client/admin unif. ; c'est un bandeau public). |
| **SCH-6** | Où vivent les types : le prompt dit `src/lib/types/` ; le repo utilise `src/types/` (barrel `index.ts`) | **Garder `src/types/`** (cohérence repo existant) — sauf si tu préfères migrer. À confirmer. |

> ⚠️ **SCH-6 est un écart prompt↔repo** : le prompt cible `src/lib/types/`, mais tout le code (16 types + barrel) vit dans `src/types/`. Je recommande de **rester sur `src/types/`** pour ne pas casser ~40 imports et le redesign admin. Je m'arrête là-dessus : confirme la localisation.

---

## 4. Inventaire des composants partagés (`src/components/shared/`)

### 4.1 Stratégie de scope des tokens (décision STY-1 — bloquante)

Pour que les composants partagés rendent correctement côté client, le scope client doit fournir les mêmes tokens (`--admin-line`, `--admin-sidebar-hover`, `--vigi-*`, `--vigi-fg`, et la font serif). Trois options :

| Opt | Approche | Touche l'admin ? | Reco |
|---|---|---|---|
| **A** | Scope partagé neutre (ex `.cete-theme`) ; `.admin-theme` et `.client-theme` en héritent | **Oui** (renomme/refactore globals.css admin + `adminScope`) | ❌ viole « ne pas toucher l'admin » |
| **B** | **Dupliquer** le bloc de tokens nécessaires dans un `.client-theme` (globals.css) + charger Source Serif 4 dans le layout client | **Non** | ✅ **Recommandé** : zéro fichier admin modifié, non-conflictuel |
| **C** | Appliquer `.admin-theme` directement au wrapper client | Non (mais couplage de nom) | ❌ sémantiquement faux, fragile si l'admin renomme |

**Reco : Option B.** Inconvénient : duplication des valeurs hex (à dédupliquer plus tard en coordination avec l'admin → option A en nettoyage futur, hors périmètre). Les composants `shared/` lisent des tokens (`var(--admin-line)`…) ; sous B, le `.client-theme` **déclare ces mêmes noms de variables** avec les mêmes valeurs → les composants fonctionnent sans réécriture. *(Si tu préfères A pour éviter la duplication, c'est un point à synchroniser avec le chantier admin — je m'arrête et j'attends.)*

### 4.2 Composants à livrer dans `shared/`

| Cible (prompt) | Source réelle | Action | Variante admin | Variante client | Props communes / spécifiques |
|---|---|---|---|---|---|
| **RatingBadge** | `admin/ui/rating-seal.tsx` | **Lift** `RatingSeal`+`CompositeRating` tels quels | sceau (édition n/a) | sceau (lecture) | communes : `value,size,showGlyph,serif` / aucune spécifique |
| **KPITile** | `admin/ui/kpi-tile.tsx` | **Lift** `KpiTile` | idem | idem | `label,value,trend,icon` |
| **SurfaceCard** | `admin/ui/admin-card.tsx` | **Renommer** `AdminCard`→`SurfaceCard` (+Header/Title/Content) | slot `actions` (édition) | lecture | `children` / `mode?` ou slot `actions` |
| **StatusBadge** | `admin/ui/status-badge.tsx` | **Lift** | idem | idem | `status?/tone?,children` |
| **PageHeader** | `admin/ui/admin-page-header.tsx` | **Renommer** `AdminPageHeader`→`PageHeader` | actions = CTAs admin | actions = télécharger | `title,subtitle,actions` |
| **EmptyState** | `admin/ui/admin-empty-state.tsx` | **Renommer** `AdminEmptyState`→`EmptyState` | action | action | `icon,title,description,action` |
| **DataTable** (primitives) | `admin/ui/admin-table.tsx` | **Lift** (base de `DocumentRow`) | — | — | natives |
| **DocumentRow** | _néant_ (client `DocumentsList`) | **Créer** sur les primitives DataTable | actions modifier/archiver | action voir/télécharger | `document,locale` / `mode:'admin'\|'client'`, `onAction` |
| **VigiScoreCard / CertificateCard** | client `CertificateCard.tsx` (ad-hoc) | **Reconstruire** avec `RatingSeal`+`CompositeRating`+tokens | cert éditable | cert lecture + QR + download | `certificate` / `mode`, `onDownload` |
| **EvaluationSummary** | _néant_ | **Créer** depuis `Evaluation` | détail admin | synthèse lecture | `evaluation` / `mode` |

**Règle de variantes** (du prompt) : divergence faible → prop `mode:'admin'\|'client'` ou slot `actions` ; divergence forte (ex CertificateCard édition vs lecture+QR) → deux composants spécialisés sur une base commune. `DocumentRow` et `VigiScoreCard` justifient le `mode`/wrapper ; les lifts purs (RatingBadge, KPITile, StatusBadge, EmptyState, PageHeader, SurfaceCard) restent identiques aux deux.

**Migration admin (Phase 3)** : déplacer `admin/ui/*` → `shared/` impose d'**adapter les imports admin** (le prompt l'autorise). C'est un **hotspot de conflit** avec le chantier admin → voir §7 (option re-export shim).

---

## 5. Plan d'alignement visuel de l'espace client

Cible : miroir du shell admin (`src/app/[locale]/admin/layout.tsx` + `AdminSidebar.tsx`), sous `.client-theme` (opt. B §4.1).

### 5.1 Layout (`src/app/[locale]/client/layout.tsx`)
- Wrapper sous `.client-theme` + variable Source Serif (comme `adminScope`) → applique canvas `#F8F9FB`, radius 10px, serif. Remplacer `<main className="... bg-secondary">` par le canvas tokenisé.
- Topbar mobile : aligner sur l'admin (`bg-card`, hairline `--admin-line`, logo `h-7`).
- Garde auth conservée dans le layout ; **déconnexion → `/` (accueil public)** : déjà fait (`router.replace("/")`) — à préserver.

### 5.2 Sidebar (`ClientSidebar.tsx`) — refonte en miroir d'`AdminSidebar`
- Fond rail `#FCFCFD` + hairline droit `#E6ECF1` (remplace `bg-white border-r`).
- **Masthead** : `logo-cete-adn.png` `h-8` sur `h-16` (remplace le carré `bg-primary` + `Zap` + texte « Espace Client »).
- **Nav** : état actif = **ledge bleu ink 3px + wash 7%** + icône `text-primary` (remplace les pilules pleines `bg-primary text-white`). Inactif = `text-muted-foreground hover:bg-accent`. Icônes `size-[18px] strokeWidth={1.75}`. Eyebrows de groupe possibles.
- **Bloc compte** (bas) : avatar initiales `bg-secondary` (comme admin) + nom + société, bouton ghost « Déconnexion » + `LogOut`.
- **Notifications** : conserver le compteur non-lus, restyler en cohérence tokenisée.

### 5.3 Pages
- En-tête : `<PageHeader>` partagé (titre serif). **Supprimer les chips d'icône colorés par page** (`bg-purple-100`, `bg-orange-100`, `bg-green-100`, `bg-blue-100` — hors palette de marque).
- Cartes : surfaces hairline-first (`SurfaceCard`), remplacer les `Card` shadcn par défaut.
- Container : `p-4 lg:p-8` + `space-y-6` (rythme admin).
- **i18n** : remplacer la pluralisation anglaise hardcodée (`"capsule" + (count>1?"s":"")` etc. sur les 5 pages) par des pluriels ICU next-intl.

### 5.4 Réalignements spécifiques
- **CertificateCard** (le plus gros) : remplacer vert/jaune/`#4DA6D9` en dur par `RatingSeal` (Vigi A/B/C/D) + `CompositeRating` (triple-lettre) + tokens ; réconcilier le champ `rating` « BBB » avec l'échelle A/B/C/D ; QR placeholder conservé (pas de dépendance nouvelle).
- **DocumentCard** : assume toujours une vidéo (thumbnail + durée même pour non-vidéo) → corriger via le `type`.
- **DashboardSummary** : bouton « voir tout » hardcodé `/client/newsletters` → rendre catégorie-aware.
- **CertificateCard** prop `userName` déclarée mais inutilisée → nettoyer.

---

## 6. Logique de propagation admin → client

### 6.1 Côté mock (Phase 2)

Chaque repo de contenu expose la même API :
```ts
getAll(): Promise<T[]>                                   // admin : tout
getVisibleForClient(clientId): Promise<T[]>              // client : visibility==='global' || assignedClientIds.includes(clientId)
getById(id): Promise<T | null>
create(input): Promise<T>                                // admin
update(id, patch): Promise<T>                            // admin
remove(id): Promise<void>                                // admin
// métier optionnel : assignClient(id, clientId), unassignClient(id, clientId), setVisibility(id, v)
```
- Certificats/évals/contract-docs : `getForClient(clientId)` par `clientId` (cert migré de `companyName`→`clientId`).
- Notifications : ajouter `listNotificationsForClient(clientId)` (même règle).
- **Insulation Supabase** : le wrapper `getVisibleForClient(clientId)` protège les 6 sites d'appel client (dashboard, profile, 4 pages catégorie) de la future bascule RLS (où `clientId` disparaît de la signature, cf. `// TODO Supabase:` dans `documents.repo.ts`).
- **Re-seed** : bumper `SEED_VERSION` (les repos versionnés purgent localStorage) pour réécrire les seeds au nouveau schéma + données scopées de démo (cf. §3.3).

Flux : admin `create({visibility:'assigned', assignedClientIds:[demoId]})` → écrit dans le repo partagé → au prochain chargement client, `getVisibleForClient(demoId)` le retourne.

### 6.2 Côté Supabase futur (ébauche, non livrée en Phase 1)

```sql
-- Enum partagé
create type visibility as enum ('global', 'assigned');

-- Exemple : table documents
create table documents (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('newsletters','capsules','guides','carnets')),
  type text not null check (type in ('pdf','video')),
  title text not null, description text, url text, youtube_id text,
  file_size text, duration text, access_type text not null default 'download',
  visibility visibility not null default 'global',
  assigned_client_ids uuid[] not null default '{}',   -- OU table de jointure document_client_assignments
  upload_date date, created_at timestamptz default now(), updated_at timestamptz default now()
);

-- profiles.client_id = FK vers clients(id) ; helper
create or replace function current_client_id() returns uuid language sql stable as $$
  select client_id from profiles where id = auth.uid()
$$;

-- RLS : client lit global OU assigné
create policy doc_select_client on documents for select to authenticated using (
  visibility = 'global' or current_client_id() = any(assigned_client_ids)
);
-- RLS : admin tout
create policy doc_admin_all on documents for all to authenticated using (
  (select role from profiles where id = auth.uid()) = 'admin'
) with check ( (select role from profiles where id = auth.uid()) = 'admin' );

-- certificats / évaluations / contract_documents : scoping par client_id (pas de tableau)
create policy cert_select_client on certificates for select to authenticated using ( client_id = current_client_id() );
```
Table de jointure alternative `document_client_assignments(document_id, client_id)` si l'on préfère éviter `uuid[]` (meilleurs index/contraintes FK). Détail à trancher en Phase 2 Supabase. Le rapport final (Phase 7) détaillera colonnes + RLS par entité.

---

## 7. Conflits & risques de coordination avec le redesign admin

> **Mise à jour 2026-05-29 : le chantier de refonte admin est TERMINÉ.** Les risques R-1/R-3/R-4 ci-dessous (conflits de merge avec un chantier parallèle) **tombent**. Conservés pour traçabilité, avec la résolution retenue.

| # | Risque | Détail | Résolution |
|---|---|---|---|
| **R-1** | **Déplacement `admin/ui/*` → `shared/`** (Phase 3) | (Initialement) conflits avec le chantier admin parallèle. | **Levé** : chantier admin fini. On **déplace + renomme** proprement et on adapte les imports admin, en vérifiant que l'admin ne casse pas (build/lint/typecheck + revue des pages admin). |
| **R-2** | **Stratégie de scope tokens** (STY-1) | L'option A (scope partagé) toucherait `globals.css` admin. | **Verrouillé : option B** — duplication dans `.client-theme`. |
| **R-3** | **Brief admin périmé** | Le brief dit « STOP Phase 0 » alors que le code a avancé/fini. | Traiter le **code** comme source de vérité (pas le brief). |
| **R-4** | **Renommage `AdminCard`/`AdminPageHeader`/`AdminEmptyState`** → `SurfaceCard`/`PageHeader`/`EmptyState` | Casse les imports admin. | **Levé** : chantier admin fini. Renommage + adaptation des imports admin assumés (Phase 3). |
| **R-5** | **Localisation des types** (SCH-6) | Le prompt cible `src/lib/types/` ; le repo est en `src/types/`. | **Verrouillé : rester `src/types/`**. |

> **Tous les arbitrages sont tranchés (voir §0.1).** Seul garde-fou maintenu : ne **casser aucune fonctionnalité** admin ni client lors des déplacements/renommages (vérif build/lint/typecheck + revue à chaque phase).

---

## 8. Découpage des phases (récapitulatif)

| Phase | Objet | Sortie | Dépend de |
|---|---|---|---|
| **0** (cette doc) | Audit + plan | `client-admin-unification-plan.md` | brief admin |
| **1** | Types unifiés (`src/types/`) + mocks fusionnés/enrichis (visibility/assignedClientIds, identité client canonique, réconciliation cert↔éval, purge `en/` morts) | types + JSON ; build/lint/typecheck clean | SCH-1..6, ID-1 |
| **2** | Repos unifiés (`getAll`/`getVisibleForClient`/CRUD), bump `SEED_VERSION`, adaptation appels admin+client | repos ; propagation testable | Phase 1 |
| **3** | Composants `shared/` (lifts + renommages + créations) + adaptation imports admin | `shared/*` ; pages admin intactes | STY-1, R-1/R-4 |
| **4** | Refonte layout + sidebar client (miroir admin) | layout/sidebar alignés | Phase 3 |
| **5** | Refonte des 7 pages client par lots (dashboard, newsletters, capsules, guides, carnets, ressources, profil) | pages refondues | Phases 2-4 |
| **6** | Validation propagation bout-en-bout (doc assigné, newsletter global, newsletter assignée) | scénario validé | Phase 5 |
| **7** | Rapport Supabase prep + vérifs finales | `client-admin-unification-report.md` ; build/lint/typecheck clean | toutes |

---

## Checklist Phase 0

- [x] Redesign admin lu et synthétisé (tokens, fonts, composants partagés, brief — §1)
- [x] Audit data complet admin & client par entité (§2)
- [x] Schémas unifiés proposés pour toutes les entités (§3) + décisions à valider (§3.4)
- [x] Composants partagés inventoriés avec variantes admin/client + props communes/spécifiques (§4)
- [x] Plan d'alignement visuel client documenté (§5)
- [x] Logique de propagation décrite — mock + Supabase futur (§6)
- [x] Conflits/risques de coordination avec le redesign admin explicités (§7)
- [x] Document livré — **aucune ligne de code écrite**

> **STOP Phase 0 — arbitrages tranchés (§0.1).** En attente de ton **feu vert pour démarrer la Phase 1** (types unifiés `src/types/` + mocks enrichis : `visibility`/`assignedClientIds`, client démo canonique, réconciliation cert↔éval). Dès « go » → Phase 1, puis arrêt en fin de phase pour validation.
