# Audit des données — Espaces Admin & Client

> Audit lecture seule avant migration Supabase. Aucun code modifié.
> Date : 2026-03-03

---

## Table des matières

1. [Inventaire des sources de données](#1-inventaire-des-sources-de-données)
2. [Inventaire des types TypeScript](#2-inventaire-des-types-typescript)
3. [Inventaire des fonctions d'authentification](#3-inventaire-des-fonctions-dauthentification)
4. [Inventaire des actions/mutations](#4-inventaire-des-actionsmutations)
5. [État des composants](#5-état-des-composants)
6. [Problèmes identifiés](#6-problèmes-identifiés)
7. [Liste des fichiers à modifier](#7-liste-des-fichiers-à-modifier)
8. [Plan d'action priorisé](#8-plan-daction-priorisé)

---

## 1. Inventaire des sources de données

### 1.1 Architecture des couches de données

```
JSON mocks (src/data/mocks/*.json)
    │
    ├─► data-loader.ts ── import statique, cast `as Type` ── pages publiques + quelques pages client
    │
    └─► repo/*.repo.ts ── seed localStorage au 1er accès ── CRUD admin + lecture client
            │
            └─► store/storage.ts ── wrapper localStorage avec SSR guard
```

**Deux chemins parallèles** vers les mêmes données JSON, jamais synchronisés.

### 1.2 Pages Admin

| Page | Fichier | Source de données | Import | Couche intermédiaire | Composants consommateurs |
|------|---------|-------------------|--------|---------------------|--------------------------|
| Layout | `src/app/admin/layout.tsx` | Navigation sidebar hardcodée inline (L19-26) | Aucun JSON | `useAuth()` pour état auth | `AdminLayoutContent` (interne), `Button` |
| Redirect | `src/app/admin/page.tsx` | Aucune | — | `redirect("/admin/dashboard")` | Aucun |
| Dashboard | `src/app/admin/dashboard/page.tsx` | **3 sources mixtes :** `getAdminStats()` (data-loader), `listDocuments()` (repo), `listArticles()` (repo) | `@/lib/data-loader` + `@/lib/repo/*.repo` | data-loader (stats) + repo (docs, articles) | `Card`, `Badge`, `Button`, `Link` |
| Blog | `src/app/admin/blog/page.tsx` | `listArticles()`, `createArticle()`, `updateArticle()`, `deleteArticle()` | `@/lib/repo/articles.repo` | Repo → localStorage | `ArticleFormDialog` |
| Documents | `src/app/admin/documents/page.tsx` | `listDocuments()`, `createDocument()`, `updateDocument()`, `deleteDocument()` | `@/lib/repo/documents.repo` | Repo → localStorage | `DocumentFormDialog` |
| Ressources | `src/app/admin/ressources/page.tsx` | `listResources()`, `createResource()`, `updateResource()`, `deleteResource()` | `@/lib/repo/resources.repo` | Repo → localStorage | `ResourceFormDialog` |
| Paramètres | `src/app/admin/settings/page.tsx` | `getSettings()`, `updateSettings()`, `resetSettings()` | `@/lib/repo/settings.repo` | Repo → localStorage | `Card`, `Input`, `Label` |
| Utilisateurs | `src/app/admin/users/page.tsx` | `listUsers()`, `createUser()`, `updateUser()`, `deleteUser()` | `@/lib/repo/users.repo` | Repo → localStorage | `UserFormDialog` |

### 1.3 Pages Client

| Page | Fichier | Source de données | Import | Couche intermédiaire | Composants consommateurs |
|------|---------|-------------------|--------|---------------------|--------------------------|
| Layout | `src/app/client/layout.tsx` | `getClientDocuments()` (data-loader, pour notifs) | `@/lib/data-loader` | data-loader (statique) | `ClientSidebar` |
| Redirect | `src/app/client/page.tsx` | Aucune | — | `redirect("/client/dashboard")` | Aucun |
| Dashboard | `src/app/client/dashboard/page.tsx` | **2 sources mixtes :** `getClientDocuments()` (data-loader, notifs) + `listDocumentsForClient()` (repo, docs) | `@/lib/data-loader` + `@/lib/repo/documents.repo` | Dual-track | `DashboardSummary`, `NotificationsTicker` |
| Profil | `src/app/client/profile/page.tsx` | `getClientDocuments()` (data-loader) | `@/lib/data-loader` | data-loader (statique) | Inline JSX |
| Capsules | `src/app/client/capsules/page.tsx` | `listDocumentsForClient()` | `@/lib/repo/documents.repo` | Repo → localStorage | `DocumentCard` |
| Carnets | `src/app/client/carnets/page.tsx` | `listDocumentsForClient()` | `@/lib/repo/documents.repo` | Repo → localStorage | `DocumentsList` |
| Guides | `src/app/client/guides/page.tsx` | `listDocumentsForClient()` | `@/lib/repo/documents.repo` | Repo → localStorage | `DocumentsList` |
| Newsletters | `src/app/client/newsletters/page.tsx` | `listDocumentsForClient()` | `@/lib/repo/documents.repo` | Repo → localStorage | `DocumentsList` |
| Ressources | `src/app/client/ressources/page.tsx` | `listResources()` | `@/lib/repo/resources.repo` | Repo → localStorage | `ResourceCard` (inline) |

### 1.4 Couche Repo (localStorage)

| Repo | Fichier | Clé localStorage | Source seed | Type seed |
|------|---------|------------------|-------------|-----------|
| Articles | `src/lib/repo/articles.repo.ts` | `cete_articles` | `admin_articles.json` | JSON |
| Documents | `src/lib/repo/documents.repo.ts` | `cete_documents` | `client_documents.json` | JSON |
| Ressources | `src/lib/repo/resources.repo.ts` | `cete_resources` | `resources.json` | JSON |
| Paramètres | `src/lib/repo/settings.repo.ts` | `cete_settings` | `contact_info.json` | JSON |
| Utilisateurs | `src/lib/repo/users.repo.ts` | `cete_users` | **Hardcodé dans le .ts** | Constante TS |

**Stratégie d'ID :** Tous utilisent `"prefix-" + Date.now()` — collision possible si 2 créations dans la même milliseconde.

### 1.5 Data Loader (import statique)

| Fonction | JSON source | Type retourné |
|----------|-------------|---------------|
| `getFounders()` | `founders.json` | `Founder[]` |
| `getServices()` | `services.json` | `Service[]` |
| `getExpertiseServices()` | `services.json` (filtré) | `Service[]` |
| `getConseilServices()` | `services.json` (filtré) | `Service[]` |
| `getPillars()` | `pillars.json` | `Pillar[]` |
| `getValues()` | `values.json` | `Value[]` |
| `getNavigation()` | `navigation.json` | `Navigation` |
| `getContactInfo()` | `contact_info.json` | `ContactInfo` |
| `getClientDocuments()` | `client_documents.json` | `ClientData` |
| `getAdminArticles()` | `admin_articles.json` | `ArticlesData` |
| `getAdminStats()` | `admin_stats.json` | `AdminStats` |
| `getResources()` | `resources.json` | `Resource[]` |

Toutes les fonctions sont **synchrones**, sans validation runtime (cast `as Type` uniquement).

---

## 2. Inventaire des types TypeScript

### 2.1 Types admin/client

| Type | Fichier | Champs | Utilisé par |
|------|---------|--------|-------------|
| `AuthUser` | `src/types/auth.ts` | `email, name, role, company?, clientId?` | auth.ts, auth-context.tsx, ClientSidebar |
| `AuthCredentials` | `src/types/auth.ts` | `email, password` | auth.ts |
| `AppUser` | `src/types/user.ts` | `id, name, email, role, company?, clientId?, createdAt` | users.repo, admin/users, UserFormDialog |
| `ClientDocument` | `src/types/document.ts` | `id, title, category, type, description, fileSize?, duration?, uploadDate, url?, youtubeId?, visibility, clientId?` | documents.repo, admin/documents, client/*, DocumentCard, DocumentsList |
| `Notification` | `src/types/document.ts` | `id, type, message, date, read` | NotificationsTicker, data-loader |
| `ClientData` | `src/types/document.ts` | `clientName, clientId, documents, notifications` | data-loader, client/layout, client/dashboard, client/profile |
| `Article` | `src/types/article.ts` | `id, title, excerpt, author, category, status, publishedDate, views, featured` | articles.repo, admin/blog, ArticleFormDialog |
| `Resource` | `src/types/resource.ts` | `id, title, description, category, type, url, youtubeId?, fileSize?, source?, publishedDate, createdAt` | resources.repo, admin/ressources, client/ressources |
| `ContactInfo` | `src/types/contact.ts` | `company, address, city, country, phone, email, website, businessHours, maps` | settings.repo, admin/settings, data-loader |
| `AdminStats` | `src/types/stats.ts` | `timestamp, stats: Stat[]` | data-loader, admin/dashboard |
| `ResourceCategory` | `src/types/resource.ts` | `"normes" \| "reglementation" \| "guides" \| "rapports" \| "veille"` | admin/ressources, client/ressources |
| `ResourceType` | `src/types/resource.ts` | `"pdf" \| "lien" \| "video"` | admin/ressources, client/ressources |

### 2.2 Problèmes de typage

| Problème | Localisation | Impact |
|----------|-------------|--------|
| `AuthUser` n'a pas de champ `id` | `src/types/auth.ts` | Pas de lien entre session et enregistrement DB |
| `AuthUser` vs `AppUser` dupliqués | `auth.ts` vs `user.ts` | Deux types quasi-identiques sans conversion |
| `Notification.type` est `string` | `src/types/document.ts` | Devrait être un union literal (`"info" \| "warning"`) |
| `Article.category` est `string` | `src/types/article.ts` | Devrait être un union literal |
| `Founder.role` est `string` | `src/types/founder.ts` | Devrait être un union literal |
| `ClientDocument.type` = `"PDF"` (majuscule) vs `ResourceType` = `"pdf"` (minuscule) | `document.ts` vs `resource.ts` | Incohérence de casse |
| **Pas de `any`** | Tous les fichiers | Conforme aux conventions |

---

## 3. Inventaire des fonctions d'authentification

### 3.1 Fichiers auth

| Fichier | Rôle |
|---------|------|
| `src/lib/auth.ts` | Fonctions pures (login, logout, getUser, etc.) |
| `src/lib/auth-context.tsx` | React Context + Provider + hook `useAuth()` |
| `src/types/auth.ts` | Types + credentials hardcodés |

### 3.2 Fonctions exportées

| Fonction | Fichier | Signature | Sync/Async | Description |
|----------|---------|-----------|-----------|-------------|
| `login` | `auth.ts:5` | `(email: string, password: string) => AuthUser \| null` | **Sync** | Compare credentials hardcodés, écrit dans localStorage |
| `logout` | `auth.ts:35` | `() => void` | **Sync** | `localStorage.removeItem("cete_auth_user")` |
| `getUser` | `auth.ts:41` | `() => AuthUser \| null` | **Sync** | Parse localStorage, retourne null si SSR/absent/erreur |
| `isAuthenticated` | `auth.ts:52` | `() => boolean` | **Sync** | Délègue à `getUser() !== null` |
| `isAdmin` | `auth.ts:56` | `() => boolean` | **Sync** | `user?.role === "admin"` |
| `isClient` | `auth.ts:61` | `() => boolean` | **Sync** | `user?.role === "client"` |
| `useAuth` | `auth-context.tsx:50` | `() => AuthContextType` | Hook | Retourne `{ user, isLoading, login, logout }` |
| `AuthProvider` | `auth-context.tsx:22` | `({ children }) => JSX.Element` | Component | Hydrate depuis localStorage au mount |

### 3.3 Vérification auth par page

| Zone | Page | Mécanisme de garde | userId utilisé |
|------|------|--------------------|----------------|
| Admin | Layout | `useEffect` redirect + `if (!user \|\| role !== "admin") return null` | `user.name`/`user.email` (affichage sidebar) |
| Admin | dashboard | Aucun (dépend du layout) | Non |
| Admin | blog | Aucun (dépend du layout) | Non |
| Admin | documents | Aucun (dépend du layout) | Non |
| Admin | ressources | Aucun (dépend du layout) | Non |
| Admin | settings | Aucun (dépend du layout) | Non |
| Admin | users | Aucun (dépend du layout) | Non |
| Client | Layout | `useEffect` redirect + `if (!user) return null` | `user` passé à `ClientSidebar` |
| Client | dashboard | `if (!user) return null` | `user.clientId` (dynamique) |
| Client | profile | `if (!user) return null` | `clientData.clientId` (statique JSON !) |
| Client | capsules | Aucun (`user?.clientId ?? ""`) | `user?.clientId` (optional chaining) |
| Client | carnets | Aucun (`user?.clientId ?? ""`) | `user?.clientId` (optional chaining) |
| Client | guides | Aucun (`user?.clientId ?? ""`) | `user?.clientId` (optional chaining) |
| Client | newsletters | Aucun (`user?.clientId ?? ""`) | `user?.clientId` (optional chaining) |
| Client | ressources | **Aucune ref auth du tout** | Non utilisé |

### 3.4 Problèmes auth

- **Tout est synchrone** — migration vers Supabase Auth nécessitera des appels async
- **Pas de token/session** — juste un objet JSON en localStorage
- **Credentials hardcodés** dans `src/types/auth.ts` (L14-22) : `demo@cete.fr / Cete2026`, `admin@cete.fr / Admin2026`
- **`auth.ts` n'utilise pas `storage.ts`** — appels `localStorage` directs, incohérent avec les repos
- **Pas de `userId` généré** — `AuthUser` n'a pas de champ `id`
- **`clientId` hardcodé** : `"cli-12345"` dans le login mock
- **Profile affiche `clientData.clientId`** (JSON statique) au lieu de `user.clientId` (auth context)

---

## 4. Inventaire des actions/mutations

### 4.1 Actions d'écriture (admin)

| Action | Page | Fonction repo | Implémentation | Gestion erreurs |
|--------|------|---------------|----------------|-----------------|
| Créer article | admin/blog | `createArticle(data)` | localStorage via repo | Aucune (pas de try/catch) |
| Modifier article | admin/blog | `updateArticle(id, data)` | localStorage via repo | Aucune |
| Supprimer article | admin/blog | `deleteArticle(id)` | localStorage via repo | Aucune |
| Créer document | admin/documents | `createDocument(data)` | localStorage via repo | Aucune |
| Modifier document | admin/documents | `updateDocument(id, data)` | localStorage via repo | Aucune |
| Supprimer document | admin/documents | `deleteDocument(id)` | localStorage via repo | Aucune |
| Créer ressource | admin/ressources | `createResource(data)` | localStorage via repo | Aucune |
| Modifier ressource | admin/ressources | `updateResource(id, data)` | localStorage via repo | Aucune |
| Supprimer ressource | admin/ressources | `deleteResource(id)` | localStorage via repo | Aucune |
| Modifier paramètres | admin/settings | `updateSettings(data)` | localStorage via repo | Aucune |
| Réinitialiser paramètres | admin/settings | `resetSettings()` | localStorage via repo | Aucune |
| Créer utilisateur | admin/users | `createUser(data)` | localStorage via repo | Aucune |
| Modifier utilisateur | admin/users | `updateUser(id, data)` | localStorage via repo | Aucune |
| Supprimer utilisateur | admin/users | `deleteUser(id)` | localStorage via repo | Aucune |

**Pattern commun :** `repoFunction(data) → refresh() → toast.success("message")`
Aucune page n'encapsule l'appel repo dans un try/catch. Si le localStorage échoue silencieusement (quota dépassé), le toast de succès s'affiche quand même.

### 4.2 Actions d'écriture (client)

| Action | Page | Implémentation |
|--------|------|----------------|
| Logout | client/layout | `logout()` → `router.push("/connexion")` |

**L'espace client est entièrement en lecture seule.** Aucun formulaire, aucune mutation de données. Les boutons "Voir" sur `DocumentCard` et les icônes "download/play" dans `DashboardSummary` sont rendus **sans handler `onClick`** — ils ne font rien.

### 4.3 Centralisation

Les mutations sont **centralisées dans la couche repo** (`src/lib/repo/*.repo.ts`). Les pages admin consomment les fonctions CRUD exportées et ne manipulent jamais localStorage directement. Seule exception : `DocumentFormDialog` appelle `listUsers()` directement pour peupler le sélecteur de client.

---

## 5. État des composants

### 5.1 Loading states

| Composant | Loading state | Implémentation |
|-----------|--------------|----------------|
| `admin/layout.tsx` | Oui | Spinner "Chargement..." pendant `isLoading` |
| `client/layout.tsx` | Oui | Spinner pendant `isLoading` |
| Admin pages (blog, docs, etc.) | **Non** | Données synchrones, pas de loading |
| Client pages (dashboard, capsules, etc.) | **Non** | Données synchrones, pas de loading |

### 5.2 Error states

| Composant | Gestion d'erreur |
|-----------|-----------------|
| **Tous les composants** | **Aucune gestion d'erreur** |

Aucune page ni composant n'implémente de gestion d'erreur. Pas de try/catch, pas de error boundary, pas d'état d'erreur.

### 5.3 Empty states

| Composant | Empty state |
|-----------|-------------|
| admin/blog | `{articles.length === 0 && <div>Aucun article</div>}` |
| admin/documents | `{filtered.length === 0 && <div>Aucun document trouvé</div>}` |
| admin/ressources | `{filtered.length === 0 && <div>}` |
| admin/users | `{users.length === 0 && <div>Aucun utilisateur</div>}` |
| client/capsules | Placeholder avec icône Video |
| client/carnets, guides, newsletters | Via `DocumentsList` : "Aucun document disponible" |
| client/ressources | Div placeholder |
| `DashboardSummary` | Non |
| `NotificationsTicker` | Retourne `null` si vide |

### 5.4 userId — hardcodé vs dynamique

| Composant | userId | Source | Problème |
|-----------|--------|--------|----------|
| client/dashboard | `user.clientId` | Auth context (dynamique) | Fallback `?? ""` |
| client/profile | `clientData.clientId` | JSON statique | **Hardcodé `"cli-12345"`** |
| client/capsules | `user?.clientId` | Auth context (dynamique) | Optional chaining sans garde |
| client/carnets | `user?.clientId` | Auth context (dynamique) | Optional chaining sans garde |
| client/guides | `user?.clientId` | Auth context (dynamique) | Optional chaining sans garde |
| client/newsletters | `user?.clientId` | Auth context (dynamique) | Optional chaining sans garde |
| client/ressources | Non utilisé | — | Pas de filtre par client |
| admin/blog | Non utilisé | — | `Article.author` est un champ texte libre |
| `DocumentFormDialog` | `listUsers()` | Repo (dynamique) | Appelé à chaque render sans memo |

---

## 6. Problèmes identifiés

### P1 — Critiques pour la migration

| # | Problème | Localisation | Impact |
|---|----------|-------------|--------|
| 1 | **Double source de données** : `data-loader.ts` (statique) et `repo/*.ts` (localStorage) accèdent aux mêmes JSON sans synchronisation | client/layout, client/dashboard, client/profile, admin/dashboard | Les stats admin sont toujours périmées. Le compteur docs du profil client ne reflète pas les ajouts admin. Les notifications sont immuables. |
| 2 | **Auth 100% synchrone et localStorage** : toutes les fonctions auth sont sync | `src/lib/auth.ts` | Supabase Auth est async — chaque `getUser()`, `login()`, `logout()` devra retourner des Promises |
| 3 | **Pas d'`id` sur `AuthUser`** | `src/types/auth.ts` | Impossible de lier un user auth à un enregistrement Supabase. `AppUser` a un `id` mais n'est pas utilisé dans le contexte auth |
| 4 | **`AuthUser` vs `AppUser` non unifiés** | `auth.ts` vs `user.ts` | Deux types quasi-identiques. Migration nécessite un type unique aligné sur `auth.users` de Supabase + table `profiles` |
| 5 | **Credentials hardcodés dans les types** | `src/types/auth.ts:14-22` | `DEMO_CREDENTIALS` et `ADMIN_CREDENTIALS` exportés — à supprimer pour Supabase Auth |

### P2 — Importants

| # | Problème | Localisation | Impact |
|---|----------|-------------|--------|
| 6 | **`auth.ts` n'utilise pas `storage.ts`** | `src/lib/auth.ts` | Incohérence d'abstraction — les repos passent par `storage.ts`, l'auth non |
| 7 | **ID générés avec `Date.now()`** | Tous les repos | Collision possible, non-compatible UUID Supabase |
| 8 | **Settings admin divergent du site public** | `settings.repo.ts` vs `data-loader.ts` | `getContactInfo()` (public) lit le JSON statique, `getSettings()` (admin) lit localStorage. Les modifs admin ne se reflètent pas sur le site public |
| 9 | **Aucune gestion d'erreur sur les mutations** | Toutes les pages admin | Pas de try/catch, `toast.success` affiché même en cas d'échec silencieux |
| 10 | **`DocumentFormDialog` appelle `listUsers()` à chaque render** | `src/components/features/admin/DocumentFormDialog.tsx:58` | Lecture localStorage non mémorisée, performance |

### P3 — À traiter

| # | Problème | Localisation | Impact |
|---|----------|-------------|--------|
| 11 | **Pages client sans garde auth propre** | capsules, carnets, guides, newsletters, ressources | Dépendent du layout. Si le layout est bypassé, les données sont accessibles |
| 12 | **Boutons "Voir" sans handler** | `DocumentCard.tsx`, `DashboardSummary.tsx` | UI non fonctionnelle — boutons rendus sans onClick |
| 13 | **`Notification.type` et `Article.category` sont `string`** | `src/types/document.ts`, `src/types/article.ts` | Devrait être des union literals pour la validation |
| 14 | **Casse incohérente : `"PDF"` vs `"pdf"`** | `ClientDocument.type` vs `ResourceType` | À harmoniser avant migration |
| 15 | **Profil client affiche `clientData.clientId` (JSON)** au lieu de `user.clientId` (auth) | `client/profile/page.tsx` | Valeur hardcodée `"cli-12345"` affichée |
| 16 | **Notifications immuables** — pas de "marquer comme lu" | `NotificationsTicker.tsx` | Fonctionnalité manquante |
| 17 | **Seed users hardcodé dans le .ts** (pas en JSON) | `users.repo.ts:6-23` | Incohérent avec les autres repos |
| 18 | **`users.repo.ts` pas de JSON mock** | `src/lib/repo/users.repo.ts` | Tous les autres repos seedent depuis un JSON |

---

## 7. Liste des fichiers à modifier

### Couche Auth (réécriture complète)

| Fichier | Action |
|---------|--------|
| `src/types/auth.ts` | Unifier `AuthUser`/`AppUser`, ajouter `id`, supprimer credentials hardcodés |
| `src/types/user.ts` | Fusionner avec auth ou créer un type `Profile` aligné Supabase |
| `src/lib/auth.ts` | Remplacer par Supabase Auth (async login/logout/getUser) |
| `src/lib/auth-context.tsx` | Adapter au client Supabase (onAuthStateChange, session async) |
| `src/app/connexion/page.tsx` | Adapter au login async |

### Couche Données (migration localStorage → Supabase)

| Fichier | Action |
|---------|--------|
| `src/lib/store/storage.ts` | Supprimer (remplacé par client Supabase) |
| `src/lib/repo/articles.repo.ts` | Réécrire en appels Supabase async |
| `src/lib/repo/documents.repo.ts` | Réécrire en appels Supabase async |
| `src/lib/repo/resources.repo.ts` | Réécrire en appels Supabase async |
| `src/lib/repo/settings.repo.ts` | Réécrire en appels Supabase async |
| `src/lib/repo/users.repo.ts` | Réécrire en appels Supabase async |
| `src/lib/data-loader.ts` | Éliminer les fonctions qui doublonnent les repos (getAdminStats, getClientDocuments, etc.) |

### Pages Admin (adapter aux données async)

| Fichier | Action |
|---------|--------|
| `src/app/admin/layout.tsx` | Adapter garde auth à Supabase (async) |
| `src/app/admin/dashboard/page.tsx` | Unifier sources de données, ajouter loading/error states |
| `src/app/admin/blog/page.tsx` | Ajouter loading/error states, try/catch sur mutations |
| `src/app/admin/documents/page.tsx` | Idem |
| `src/app/admin/ressources/page.tsx` | Idem |
| `src/app/admin/settings/page.tsx` | Idem, unifier avec données publiques |
| `src/app/admin/users/page.tsx` | Idem |

### Pages Client (adapter aux données async)

| Fichier | Action |
|---------|--------|
| `src/app/client/layout.tsx` | Adapter garde auth, unifier source notifications |
| `src/app/client/dashboard/page.tsx` | Unifier sources, ajouter loading states |
| `src/app/client/profile/page.tsx` | Utiliser `user.clientId` au lieu du JSON statique |
| `src/app/client/capsules/page.tsx` | Ajouter garde auth, loading state |
| `src/app/client/carnets/page.tsx` | Idem |
| `src/app/client/guides/page.tsx` | Idem |
| `src/app/client/newsletters/page.tsx` | Idem |
| `src/app/client/ressources/page.tsx` | Ajouter ref auth, loading state |

### Composants features

| Fichier | Action |
|---------|--------|
| `src/components/features/admin/ArticleFormDialog.tsx` | Adapter au type unifié, async submit |
| `src/components/features/admin/DocumentFormDialog.tsx` | Supprimer appel direct `listUsers()`, async submit |
| `src/components/features/admin/ResourceFormDialog.tsx` | Async submit |
| `src/components/features/admin/UserFormDialog.tsx` | Adapter au type unifié |
| `src/components/features/client/DocumentCard.tsx` | Implémenter onClick "Voir" |
| `src/components/features/client/DashboardSummary.tsx` | Implémenter boutons download/play |

### Types

| Fichier | Action |
|---------|--------|
| `src/types/document.ts` | Typer `Notification.type` en union literal |
| `src/types/article.ts` | Typer `Article.category` en union literal |
| `src/types/resource.ts` | Vérifier cohérence avec schéma DB |

---

## 8. Plan d'action priorisé

### Phase 1 — Fondations (pré-requis)

1. **Créer le projet Supabase** et définir le schéma DB (tables `profiles`, `articles`, `documents`, `resources`, `settings`, `notifications`)
2. **Unifier les types** : fusionner `AuthUser`/`AppUser` en un type `Profile` avec `id: string` (UUID Supabase), supprimer `DEMO_CREDENTIALS`/`ADMIN_CREDENTIALS`
3. **Harmoniser les types** : `Notification.type` → union literal, `Article.category` → union literal, `"PDF"` → `"pdf"` partout
4. **Créer le client Supabase** (`src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`)

### Phase 2 — Auth

5. **Réécrire `auth.ts`** : remplacer par Supabase Auth (signInWithPassword, signOut, getSession — tout async)
6. **Réécrire `auth-context.tsx`** : utiliser `onAuthStateChange`, gérer session async, ajouter le `Profile` depuis la table `profiles`
7. **Adapter les layouts** admin et client : garde auth async, middleware Supabase pour la redirection côté serveur
8. **Adapter la page connexion** : login async avec gestion d'erreur

### Phase 3 — Couche données

9. **Réécrire les repos** en clients Supabase async (select, insert, update, delete)
10. **Supprimer `storage.ts`** et les seeds localStorage
11. **Éliminer `data-loader.ts`** pour les données mutables (garder uniquement pour les données statiques du site public : founders, pillars, values, navigation)
12. **Unifier la source de données** : settings admin = settings publiques (même table, même query)

### Phase 4 — Adaptation des pages

13. **Ajouter loading states** à toutes les pages admin et client (skeleton ou spinner)
14. **Ajouter error states** et try/catch sur toutes les mutations
15. **Ajouter des gardes auth** aux pages client qui en manquent (capsules, carnets, guides, newsletters, ressources)
16. **Corriger le profil client** : utiliser `user.id` pour charger le profil depuis Supabase, pas le JSON statique
17. **Implémenter les boutons non-fonctionnels** (DocumentCard "Voir", DashboardSummary download/play)
18. **Implémenter "marquer comme lu"** pour les notifications

### Phase 5 — Nettoyage

19. **Supprimer les JSON mocks** pour les données migrées (garder uniquement les données statiques publiques)
20. **Supprimer `src/lib/store/`** (plus nécessaire)
21. **Ajouter les RLS policies** sur Supabase (Row Level Security)
22. **Mémoiser `DocumentFormDialog`** : remplacer l'appel `listUsers()` inline par un `useEffect` ou `useMemo`
23. **Générer les types TypeScript** depuis le schéma Supabase (`supabase gen types`)
