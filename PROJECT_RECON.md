# Reconnaissance projet CETé

> Date : 2026-05-29
> Repo : CETé (Consortium Experts Techniques Électricité) — repertoire de travail courant
> Derniere modif majeure detectee : commit `0660190` « feat: add full i18n support with next-intl (FR/EN) » (bascule complete vers `src/app/[locale]/`). Dernier commit en date : `d8f8c16` du 2026-05-22 (fix re-seed localStorage).

## 1. Synthese executive

- **CETé** est un site vitrine francophone (+ EN) pour une agence independante de notation du risque electrique. Phase 1 = site statique a donnees mockees ; Phase 2 (a venir) = integration Supabase pour auth + base de donnees reelle.
- **Stack moderne et epinglee** : Next.js 16.1.6 (App Router, structure `src/app/[locale]/`), React 19.2.3, TypeScript ^5 strict, Tailwind CSS v4 (CSS-first, sans `tailwind.config`), shadcn/ui (new-york) + Radix unifie. Formulaires react-hook-form + Zod v4.
- **i18n complet via next-intl ^4.12.0** : locales `fr` (defaut) + `en`, `localePrefix: "always"`, pathnames traduits (`/a-propos`↔`/about`, `/connexion`↔`/login`, `/verifier`↔`/verify`). Toute l'app vit sous le segment `[locale]`.
- **Trois zones fonctionnelles** : vitrine `(public)` = 9 pages ; espace client protege = 8 pages ; espace admin protege = ~14 pages (dont le sous-arbre recent `clients/[id]` avec onglets societe/documents/evaluations).
- **Aucun backend reel** : pas de dependance Supabase / next-auth / Stripe / email / upload / IA / analytics / monitoring. Toutes les mentions « supabase » dans le code sont des commentaires `// TODO Supabase:` documentant la migration future.
- **Auth 100% mockee** en localStorage (`cete_auth_user`), credentials hardcodes en clair (`demo@cete.fr` / `admin@cete.fr`) et meme affiches dans l'UI de connexion. Protection uniquement cote client par layout ; le middleware ne fait que l'i18n.
- **Double chemin de donnees** : import statique (`data-loader.ts`, contenu vitrine, ~8 getters) vs 12 repos localStorage CRUD (`src/lib/repo/*.repo.ts`), tous deja annotes `// TODO Supabase:` et structures facon table (FK `clientId`, timestamps, enums, re-seed versionne).
- **Couche de types metier mature** centralisee dans `src/types/` (barrel), sans `any`. Les entites cle (Client, Evaluation, ContractDocument, CertificateData, Profile) sont deja modelisees facon Supabase.
- **Site vitrine globalement DECOUPLE de la couche app** : pages SEO + sections marketing + chrome Header/Footer restent intouchables, a 3 frontieres a arbitrer (`verifier/[id]`, `ContactForm`, source des founders/settings).
- **AUDIT.md (mars 2026) largement PERIME** : il decrit l'arbo d'avant i18n et la majorite de ses problemes (AuthUser/AppUser, auth sync, casse PDF/pdf, profil client statique, notifications immuables) sont corriges. Drifts residuels : code mort (5-6 composants legacy + 6 JSON racine orphelins), bug latent `user.id` vs `user.clientId`, seed toujours en `fr/`, IDs via `Date.now()`.

## 2. Stack et infrastructure

Stack verifiee contre le code actuel (package.json, lockfile, configs). Toutes les versions ci-dessous proviennent des dependances declarees dans `package.json` et confirmees par `package-lock.json` (lockfileVersion 3).

### Framework et langage

| Element | Valeur | Source / verification |
|---|---|---|
| Next.js | **16.1.6** (version exacte epinglee, sans `^`) | `package.json` dep `next`, `eslint-config-next` 16.1.6 |
| Routeur | **App Router** | `src/app/[locale]/...` present, aucun dossier `pages/` (verifie via glob) |
| Internationalisation des routes | App Router segmente par locale `src/app/[locale]/` | structure confirmee |
| React | **19.2.3** (epingle) + react-dom 19.2.3 | `package.json` |
| TypeScript | **^5** | `package.json` devDep `typescript` |
| Strict mode TS | **Active** (`"strict": true`) | `tsconfig.json` ligne 7 ; egalement `noEmit`, `moduleResolution: bundler`, target ES2017, alias `@/*` -> `./src/*` |

### Styling et UI

| Element | Valeur | Source / verification |
|---|---|---|
| Tailwind CSS | **v4** (CSS-first) | dep `tailwindcss: ^4` + `@tailwindcss/postcss: ^4` ; PAS de `tailwind.config.*` (glob negatif) ; config via PostCSS uniquement |
| PostCSS | `postcss.config.mjs` -> plugin `@tailwindcss/postcss` | `postcss.config.mjs` |
| Animations | `tw-animate-css ^1.4.0` (devDep) | `package.json` |
| shadcn/ui | **Present** — style `new-york`, RSC active, baseColor `neutral`, CSS variables | `components.json` |
| Composants UI | **14 fichiers** dans `src/components/ui/` | glob : badge, button, card, dialog, form, input, label, navigation-menu, separator, sheet, sonner, textarea + 2 non-shadcn (`brand-name.tsx`, `video-embed.tsx`) |
| Primitives Radix | **Package unifie `radix-ui ^1.4.3`** (pas les packages `@radix-ui/*` separes) | `package.json` + imports `from "radix-ui"` dans les composants ui |
| Icones | `lucide-react ^0.563.0` | `package.json` |
| Theme | `next-themes ^0.4.6` | `package.json` |
| Toasts | `sonner ^2.0.7` | `package.json` |
| Utilitaires CSS | `clsx`, `tailwind-merge ^3.4.0`, `class-variance-authority ^0.7.1` | `package.json` |

### Formulaires et validation

| Element | Valeur | Verification |
|---|---|---|
| Formulaires | `react-hook-form ^7.71.1` | `package.json` |
| Validation | `zod ^4.3.6` (Zod **v4**) | `package.json` |
| Bridge | `@hookform/resolvers ^5.2.2` (`zodResolver`) | usage confirme dans `src/components/sections/ContactForm.tsx` et `EvaluationForm.tsx` |

### i18n

| Element | Valeur | Verification |
|---|---|---|
| Librairie | **next-intl ^4.12.0** | `package.json` |
| Plugin build | `createNextIntlPlugin("./src/i18n/request.ts")` | `next.config.ts` |
| Middleware | `src/middleware.ts` via `createMiddleware(routing)` | matcher exclut `_next`, `api`, fichiers statiques |
| Locales | **fr (defaut) + en**, `localePrefix: "always"` | `src/i18n/routing.ts` ; pathnames traduits (a-propos/about, cgu/terms, connexion/login, verifier/verify) |
| Messages | `messages/fr.json` + `messages/en.json` | typage global via `global.d.ts` (IntlMessages = typeof fr.json) |

### Outillage, tests et auth

| Element | Valeur | Verification |
|---|---|---|
| Linter | **ESLint 9** (flat config) via `eslint-config-next` 16.1.6 (core-web-vitals + typescript) | `eslint.config.mjs` ; pas de Biome |
| Lint custom | `scripts/lint-lines.js` (limite 250 lignes) lance en `prebuild` | `package.json` scripts |
| Tests | **AUCUN framework** (ni Vitest, ni Jest, ni Playwright) | aucune dep de test ; aucun `*.test`/`*.spec` ni config hors `node_modules` |
| Auth / backend | **Aucune dependance backend** (pas de @supabase, better-auth, next-auth) — auth mock localStorage (cf. CLAUDE.md) | grep negatif sur package.json |
| API routes / server actions | **Aucune** route `app/api` ni `route.ts` | glob negatif |
| Autres deps notables | `jspdf ^4.2.1`, `qrcode ^1.5.4` (QR code verification), `leaflet ^1.9.4` + `react-leaflet ^5.0.0` (carte) | `package.json` |

### Package manager et hosting

| Element | Valeur | Verification |
|---|---|---|
| Package manager | **npm** | seul lockfile racine = `package-lock.json` (lockfileVersion 3) ; pas de pnpm-lock/yarn.lock/bun.lockb |
| Hosting | **Non configure explicitement — Vercel deductible** 🟡 | AUCUN `vercel.json`, `render.yaml`, `coolify*`, `Dockerfile`, `docker-compose` (glob negatif) ; README mentionne deploiement Vercel (boilerplate create-next-app, non probant) ; `.env.example` = `NEXT_PUBLIC_SITE_URL=https://cete-notation.fr` ; `next.config.ts` autorise images distantes `images.unsplash.com` |

### Remarques

- Le `README.md` est le boilerplate `create-next-app` non personnalise (mentionne Geist/Vercel/yarn/pnpm/bun) : il ne reflete PAS l'etat reel du projet (police reelle = Inter + Merriweather selon CLAUDE.md ; PM reel = npm). Ne pas s'y fier pour le hosting.
- Versions de `next` et `react`/`react-dom` epinglees exactement (sans `^`), ce qui fige ces versions critiques.
- Aucune trace de la future integration Supabase mentionnee dans CLAUDE.md (Phase 2) : aucune dependance ni client installe a ce jour.

## 3. Structure du projet

### Arbre du projet (3 niveaux, hors node_modules/.next/.git)

```
CETé/
├── AUDIT.md                      # Audit de mars 2026 (point de depart, a verifier)
├── CLAUDE.md
├── README.md
├── package.json / package-lock.json
├── next.config.ts / tsconfig.json / components.json
├── eslint.config.mjs / postcss.config.mjs
├── global.d.ts / next-env.d.ts
├── messages/                     # Traductions next-intl (i18n)
│   ├── fr.json
│   └── en.json
├── public/
│   ├── assets/                   # brand/, founders/ (logos, photos fondateurs)
│   └── *.svg                     # icones Next par defaut (file, globe, next, window, vercel)
├── docs/                         # Briefs/plans de chantiers (non commités)
│   ├── admin-redesign-brief.md
│   ├── client-admin-unification-plan.md
│   ├── admin-clients-design.md / admin-clients-report.md
│   └── tablet-audit.md / tablet-report.md
├── .planning/                    # PROJECT.md, ROADMAP.md, REQUIREMENTS.md, config.json
└── src/
    ├── middleware.ts             # Middleware next-intl (routing locales)
    ├── app/
    │   ├── layout.tsx            # Root layout minimal (html/body delegues a [locale])
    │   └── [locale]/             # Segment dynamique locale (fr/en) — RACINE i18n
    │       ├── layout.tsx        # Layout localise (<html lang>), NextIntlClientProvider
    │       ├── (public)/         # Groupe de routes VITRINE (+ layout Header/Footer)
    │       ├── client/           # Espace CLIENT protege (+ layout auth)
    │       ├── admin/            # Espace ADMIN protege (+ layout auth)
    │       └── connexion/        # Page de connexion (login, hors groupe public)
    ├── components/
    │   ├── ui/                   # Primitives shadcn/ui (~19 fichiers)
    │   ├── common/               # Header, Footer, LanguageSwitcher
    │   ├── sections/             # Sections vitrine, organisees par page
    │   │   ├── home/ about/ expertise/ services/ contact/ blog/
    │   │   ├── resources/ verifier/
    │   │   └── (+ composants partages: HeroSection, ContactForm, EvaluationForm…)
    │   └── features/             # Composants metier espaces proteges
    │       ├── admin/            # + admin/ui/ (primitives admin), admin/clients/
    │       └── client/           # Sidebar, cartes documents/certificats, notifications
    ├── data/
    │   └── mocks/                # Donnees JSON typees
    │       ├── *.json            # Mocks legacy mono-langue (founders, services…)
    │       ├── fr/               # Mocks localises FR
    │       └── en/               # Mocks localises EN
    ├── lib/
    │   ├── auth.ts / auth-context.tsx   # Auth mock (localStorage)
    │   ├── data-loader.ts / constants.ts / utils.ts
    │   ├── generate-certificate-pdf.ts
    │   ├── hooks/ store/                 # useCountUp, storage
    │   └── repo/                         # Couche d'acces donnees (12 repos)
    ├── i18n/                     # routing.ts, request.ts, navigation.ts (config next-intl)
    └── types/                    # Interfaces TS + barrel index.ts (~17 fichiers)
```

### Internationalisation et groupes de routes

- **Segment dynamique `[locale]`** : toute l'application vit sous `src/app/[locale]/`. next-intl est configure dans `src/i18n/routing.ts` avec `locales: ["fr", "en"]`, `defaultLocale: "fr"`, `localePrefix: "always"` (URL toujours prefixee `/fr/...` ou `/en/...`). Le `src/middleware.ts` gere la negociation de locale.
- **Pathnames traduits** : certaines routes ont des slugs localises (ex. `/a-propos` → `/about`, `/cgu` → `/terms`, `/connexion` → `/login`, `/verifier/[id]` → `/verify/[id]`).
- **Groupe de routes `(public)`** : seul groupe entre parentheses. Il porte le layout Header + Footer pour la vitrine.
- **Layout racine minimal** : `src/app/layout.tsx` renvoie juste `children` ; `<html>`/`<body>` et l'attribut `lang` sont rendus par `[locale]/layout.tsx`.
- **Segments dynamiques additionnels** : `(public)/verifier/[id]`, `(public)/blog/[slug]`, et la sous-arbre `admin/clients/[id]` (avec son propre `layout.tsx` + onglets societe/documents/evaluations).

### Zones fonctionnelles (sous `src/app/[locale]/`)

| Zone | Routes / pages | Perimetre |
|------|----------------|-----------|
| `(public)/` | 9 pages : `/` (accueil), `/a-propos`, `/expertise`, `/services`, `/contact`, `/blog`, `/blog/[slug]`, `/cgu`, `/verifier/[id]` | Vitrine publique (layout Header/Footer). Inclut blog + verification de certificat. |
| `connexion/` | 1 page (`/connexion`) | Page de login (auth mock, hors groupe public). |
| `client/` | 8 pages : `client` (index), `dashboard`, `ressources`, `capsules`, `newsletters`, `guides`, `carnets`, `profile` | Espace client protege (layout auth + redirection). Documents, ressources, abonnements. |
| `admin/` | ~14 pages : `admin` (index), `dashboard`, `clients` (+ `[id]` avec societe/documents/evaluations), `documents`, `ressources`, `blog`, `organizations`, `team`, `users`, `settings` | Espace admin protege (layout auth). Sous-arbre `clients/[id]` = chantier en cours (non commité). |

### Etat recent du repo

- **Dernier commit** : `d8f8c16` du **2026-05-22**, « fix: forcer re-seed localStorage pour purger donnees obsoletes (video Rick Roll) ». Les 3 derniers commits sont des correctifs de donnees (suppression de contenus fictifs / videos).
- **Derniere modif majeure (feature)** : `0660190` « feat: add full i18n support with next-intl (FR/EN) » — bascule complete vers `[locale]` et next-intl, qui structure tout `src/app`.
- **Travail en cours non commité** : nombreux fichiers modifies (M) lies a la migration i18n des pages/sections, **plus** un chantier admin/clients entierement non suivi (`??`) : `src/app/[locale]/admin/clients/`, `src/components/features/admin/clients/`, `src/components/features/admin/ui/`, repos `clients/contract-documents/evaluations`, types `client.ts`/`shared.ts`, et mocks `fr/`+`en/` (clients, contract_documents, evaluations). 🟡 Ce chantier « Client↔Admin unification » est avance mais pas encore versionne.

## 4. Mock data identifiee

Le projet fonctionne entierement sur de la **mock data** : aucun client Supabase reel n'est instancie (toutes les occurrences `supabase` dans `src/` sont des commentaires `// TODO Supabase:` documentant la future requete). Deux chemins d'acces coexistent : **import statique** (`data-loader.ts`, contenu vitrine) et **repos localStorage** (`src/lib/repo/*.repo.ts`, CRUD admin + lecture client).

### Sources JSON (`src/data/mocks/`)

Les fichiers existent en variantes i18n `fr/` et `en/`. Certains fichiers a la racine subsistent et servent encore de seed aux repos (voir colonne consommateur).

| Fichier JSON | Entites (~) | Format | Consommateur |
|---|---|---|---|
| `fr\|en/founders.json` | 4 | array d'objets | `data-loader.getFounders()` + seed `founders.repo` (racine `founders.json`) |
| `fr\|en/services.json` | 9 | array d'objets | `data-loader.getServices/Expertise/Conseil/Pillar` |
| `fr\|en/pillars.json` | 3 | array d'objets | `data-loader.getPillars()` |
| `fr\|en/values.json` | 4 | array d'objets | `data-loader.getValues()` |
| `fr\|en/navigation.json` | mainNav 6 / footerNav 4 / ctaButtons 2 | objet de config | `data-loader.getNavigation()` |
| `fr\|en/contact_info.json` | objet (9 champs + businessHours/maps) | objet de config | `data-loader.getContactInfo()` + seed `settings.repo` (racine `contact_info.json`) |
| `fr\|en/organizations.json` | 12 | array de strings | `data-loader.getOrganizations()` |
| racine `admin_articles.json` | articles: 4 | objet { articles[] } | seed `articles.repo` |
| racine `client_documents.json` | documents: 12 / notifications: 4 | objet { documents[], notifications[] } | seed `documents.repo` + `notifications.repo` |
| racine `resources.json` | resources: 9 | objet { resources[] } | seed `resources.repo` |
| `fr/clients.json` | clients: 6 | objet { clients[] } | seed `clients.repo` |
| `fr/evaluations.json` | evaluations: 6 | objet { evaluations[] } | seed `evaluations.repo` |
| `fr/contract_documents.json` | contractDocuments: 18 | objet { contractDocuments[] } | seed `contract-documents.repo` |
| `admin_stats.json` (racine + fr/en) | stats: 4 | objet { timestamp, stats[] } | 🟡 **ORPHELIN** — aucun import dans le code actuel ; `stats.repo` calcule les KPI dynamiquement |

### Donnees en dur dans le code TS (constantes)

| Source | Entites | Format | Consommateur |
|---|---|---|---|
| `src/lib/repo/users.repo.ts` (`SEED_USERS`) | 2 (1 admin, 1 client) | constante TS array | seed `cete_users` |
| `src/lib/repo/certificates.repo.ts` (`MOCK_CERTIFICATES`) | 2 certificats | constante TS array | seed `cete_certificates` (pattern localStorage propre, n'utilise pas storage.ts) |
| `src/lib/auth.ts` (`DEMO_CREDENTIALS`, `ADMIN_CREDENTIALS`) | 2 credentials + 2 profils inline | constantes TS | `login()` mock |
| `src/lib/constants.ts` | `VIGI_SCORE_LEVELS`, `THREE_C_CRITERIA`, `ADN_LEVELS` (deprecated), stats site | constantes TS | composants vitrine |
| `src/components/sections/**` (~30 fichiers) | config inline (icones Lucide, couleurs, counts) | constantes locales | rendu UI ; le **texte** passe par next-intl (`useTranslations`), seules les structures non-textuelles restent en dur |

### Couche localStorage (`storage.ts`) et cles `cete_*`

`src/lib/store/storage.ts` = wrapper minimal `getItem/setItem/removeItem` avec garde SSR (`typeof window === "undefined"`). Cles utilisees :

| Cle | Repo | Cle de version | Version seed |
|---|---|---|---|
| `cete_auth_user` | `auth.ts` (acces direct, **pas via storage.ts**) | - | - |
| `cete_founders` | `founders.repo` **+ lecture directe dans `data-loader.getFounders()`** | - | - |
| `cete_articles` | `articles.repo` | - | - (seed si vide seulement) |
| `cete_documents` | `documents.repo` | `cete_documents_v` | 3 |
| `cete_notifications` | `notifications.repo` | `cete_notifications_v` | 2 |
| `cete_resources` | `resources.repo` | `cete_resources_v` | 3 |
| `cete_clients` | `clients.repo` | `cete_clients_v` | 2 |
| `cete_evaluations` | `evaluations.repo` | `cete_evaluations_v` | 2 |
| `cete_contract_documents` | `contract-documents.repo` | `cete_contract_documents_v` | 1 |
| `cete_certificates` | `certificates.repo` (acces direct) | `cete_certificates_v` | 2 |
| `cete_users` | `users.repo` | - | - (seed si vide seulement) |
| `cete_settings` | `settings.repo` | - | - (seed si vide seulement) |

**Double chemin confirme.** `data-loader.getFounders()` lit DIRECTEMENT `localStorage.getItem("cete_founders")` (collision avec `founders.repo` qui ecrit la meme cle) — c'est le seul getter du data-loader qui depend du localStorage, les autres sont 100% import statique. Les repos n'utilisent jamais le data-loader.

**Re-seed versionne.** Pattern `seedIfEmpty()` : si la cle est absente OU si `cete_xxx_v !== SEED_VERSION`, on ecrase avec le seed JSON et on bump la version. Permet de purger les donnees obsolètes (cf. commits recents "forcer re-seed", "purger Rick Roll"). `articles/users/settings/founders` n'ont PAS de cle de version (re-seed uniquement si la cle est absente).

**Strategie d'ID.** Tous les `create*` generent l'ID par prefixe + `Date.now()` (timestamp ms) : `art-`, `doc-`, `res-`, `cdoc-`, `cli-`, `eval-`, `usr-`. Risque de collision si deux creations dans la meme milliseconde. Commentaires `// TODO Supabase: UUID auto-genere` partout. `clients/evaluations` ajoutent `createdAt/updatedAt = new Date().toISOString()` ; `clients` derive aussi un `slug` (normalisation NFD).

**Gestion d'erreur.** Tous les repos (sauf `founders/certificates`) enveloppent les operations dans try/catch et lancent un `RepoError(message, entity, operation)` (`src/types/repo-error.ts`).

🟡 **AUDIT.md (mars 2026) partiellement perime** : il reference `getClientDocuments()` dans `data-loader.ts` (utilise par client/layout, dashboard, profile) — cette fonction **n'existe plus** dans le data-loader actuel (8 getters seulement). Il omet aussi les repos `clients`, `evaluations`, `contract-documents`, `certificates`, `notifications` et `stats`. A re-verifier cote pages consommatrices.

## 5. Types TypeScript metier

Le projet expose une couche de types metier mature, centralisee dans `src/types/` avec un barrel `index.ts`. Chaque entite est dans son propre fichier, sans aucun `any` (conforme aux conventions). Plusieurs types ont deja ete prepares pour la bascule Supabase (cles etrangeres `clientId`, timestamps `created_at`/`updated_at`, enums de statut, contrat partage `ClientScoped`).

Important : l'AUDIT.md (mars 2026) est PERIME sur la section types. Le code a depuis fusionne `AuthUser`/`AppUser` en un seul `Profile` (avec `id`), et a converti `Notification.type`, `Article.category` et la casse de `ClientDocument.type` en union literals. Les problemes listes dans l'audit sur ces points sont resolus dans le code actuel.

### Inventaire des types metier

| Chemin | Nom | Attributs principaux (max 10) | Mock correspondant |
|--------|-----|-------------------------------|--------------------|
| `src/types/auth.ts` | `Profile` | id, email, name, role(`admin`/`client`), clientId?, company?, phone?, is_active, created_at?, updated_at? | `users.repo.ts` (SEED_USERS en dur) |
| `src/types/auth.ts` | `AuthCredentials` | email, password | Non (utilitaire auth, a la limite du metier) |
| `src/types/client.ts` | `Client` | id, slug, companyName, legalForm, siret, sector, address, contacts[], status, contractStartDate | `fr\|en/clients.json` |
| `src/types/client.ts` | `ClientContact` | id, firstName, lastName, role, email, phone, isPrimary | imbrique dans `clients.json` |
| `src/types/client.ts` | `ClientAddress` | street, postalCode, city, country | imbrique dans `clients.json` |
| `src/types/client.ts` | `ContractDocument` | id, clientId, type, title, version, fileName, fileSize, mimeType, uploadedAt, status | `fr\|en/contract_documents.json` |
| `src/types/client.ts` | `Evaluation` | id, clientId, siteName, visitDate, vigiScore?, omtScore?(ThreeCScore), compositeRating?, certificateId?, auditorId, status | `fr\|en/evaluations.json` |
| `src/types/certificate.ts` | `CertificateData` | id, certificateNumber, clientId, companyName, siren, compositeRating, vigiScore, subCriteria(ThreeCScore), validityDate, status | `certificates.repo.ts` (MOCK_CERTIFICATES en dur) |
| `src/types/document.ts` | `ClientDocument` | id, title, category, type, description, fileSize?, duration?, uploadDate, url?, youtubeId? (+ ClientScoped) | `client_documents.json` (root + fr/en) |
| `src/types/document.ts` | `Notification` | id, type, message, date, read (+ ClientScoped) | `client_documents.json` (cle `notifications`) |
| `src/types/document.ts` | `ClientData` | clientName, clientId, documents[], notifications[] | `client_documents.json` (objet racine) |
| `src/types/resource.ts` | `Resource` | id, title, description, category, type, accessType, url, youtubeId?, fileSize?, publishedDate (+ ClientScoped) | `resources.json` (root) — voir probleme casse fr/en |
| `src/types/article.ts` | `Article` | id, title, excerpt, author, category, status, publishedDate, views, featured, videoUrl? | `fr\|en/admin_articles.json` |
| `src/types/blog.ts` | `BlogPost` | slug, title, excerpt, author, category, categoryColor, publishedDate, readTime, imageUrl, featured | Non detecte (pas de mock dedie) |
| `src/types/founder.ts` | `Founder` | id, name, role, bio, imageUrl, specialties[], visible?, formerOrg?, currentEntity? | `fr\|en/founders.json` |
| `src/types/service.ts` | `Service` | id, category, type, title, description, shortDescription, features[], icon, imageUrl, pillar? | `fr\|en/services.json` |
| `src/types/pillar.ts` | `Pillar` | id, title, icon, description, color(`blue`/`yellow`/`green`) | `fr\|en/pillars.json` |
| `src/types/value.ts` | `Value` | id, title, description, icon | `fr\|en/values.json` |
| `src/types/stats.ts` | `Stat` / `AdminStats` | Stat: id, label, value, trend, icon ; AdminStats: timestamp, stats[] | `fr\|en/admin_stats.json` |
| `src/types/contact.ts` | `ContactInfo` | company, address, city, country, phone, email, website, businessHours, maps | `fr\|en/contact_info.json` |
| `src/types/shared.ts` | `ThreeCScore` | autoEvaluation, recommandation, gestesMetiers (tous string) | imbrique (evaluations, certificats) |
| `src/types/shared.ts` | `ClientScoped` | visibility(`global`/`assigned`), assignedClientIds[] | contrat partage documents/ressources |

Types exclus (props composants / utilitaires) : `NavItem`/`Navigation` (`navigation.ts`), `BusinessHours`/`MapCoordinates` (`contact.ts`), `RepoError` (`repo-error.ts`, classe d'erreur), `AuthContextType` (`auth-context.tsx`), `Locale` (`data-loader.ts`).

### Problemes de typage

| Probleme | Localisation | Impact / commentaire |
|----------|--------------|----------------------|
| `compositeRating: string` (note composite triple-lettre, ex "BBB"/"BAB") devrait etre un type contraint | `client.ts` (Evaluation), `certificate.ts` (CertificateData) | Aucune garantie de format. Devrait au minimum etre un template literal ou une union derivee de `VigiScoreGrade`. |
| `ThreeCScore` : `autoEvaluation`, `recommandation`, `gestesMetiers` typés `string` | `src/types/shared.ts` | Valeurs metier contraintes (lettre A/B/C/D + modificateur `+`/`-`). Le commentaire le dit ("format lettre + modificateur") mais le type ne l'impose pas — devrait etre une union literal. 🟡 |
| Mocks `fr/` et `en/resources.json` utilisent `accessMode` ("telechargement"/"lecture") + omettent `visibility`/`assignedClientIds` | `src/data/mocks/fr\|en/resources.json` vs `src/types/resource.ts` | Decalage type/donnees. Non charge en pratique (resources.repo lit le root `resources.json`, lui conforme avec `accessType`+`visibility`), mais masque par `as Resource[]`. Casse `accessMode` vs `accessType` a nettoyer. |
| `Founder.role: string` | `src/types/founder.ts` | Pourrait etre un union literal (probleme deja signale par l'audit, toujours valide). Faible priorite (texte libre acceptable ici). 🟡 |
| `BlogPost.category: string` alors que `Article.category` est `ArticleCategory` (union) | `blog.ts` vs `article.ts` | Incoherence : deux types proches representant un contenu editorial avec un typage de categorie divergent. |
| Quasi-duplication `BlogPost` (public, cle `slug`, sans `id`) vs `Article` (admin, cle `id`) | `blog.ts` vs `article.ts` | Deux modeles d'article non unifies. `BlogPost` est la seule entite metier SANS champ `id` (utilise `slug`). |
| `Profile.clientId` optionnel mais "requis en pratique pour role client" | `src/types/auth.ts` | Contrainte non exprimable simplement ; documentee en commentaire seulement. 🟡 |
| Conforme : aucun `any` ; casse `pdf`/`video` desormais coherente entre `ClientDocument.type` et `ResourceType` (probleme PDF/pdf de l'audit RESOLU) | `document.ts`, `resource.ts` | — |

Points faux/perimes de l'AUDIT.md a ne pas reporter : `AuthUser` sans `id`, `AuthUser` vs `AppUser` dupliques (les deux fusionnes en `Profile`, qui possede `id`), `Notification.type`/`Article.category` en `string` (desormais unions), casse `"PDF"` vs `"pdf"` (resolue). Le fichier `src/types/user.ts` cite par l'audit n'existe plus.

## 6. Auth actuelle

### Mecanisme : mock localStorage (aucune lib d'auth)

L'authentification est **entierement simulee cote client via localStorage**. Aucune librairie d'auth n'est installee : `package.json` ne contient ni `@supabase/supabase-js`, ni `@supabase/ssr`, ni `next-auth`, `@clerk/*` ou `@auth0/*`. Toutes les references a Supabase dans le code sont uniquement des **commentaires `// TODO Supabase:`** marquant les points de bascule futurs — rien n'est cable.

### Fichiers concernes

| Fichier | Role |
|---|---|
| `src/lib/auth.ts` | Logique pure : `login`, `logout`, `getUser`, `isAuthenticated`, `isAdmin`, `isClient`. Compare aux credentials hardcodes et lit/ecrit la cle localStorage `cete_auth_user`. |
| `src/lib/auth-context.tsx` | React Context `AuthProvider` + hook `useAuth()` exposant `{ user, isLoading, login, logout, refresh }`. |
| `src/types/auth.ts` | Types `Profile` (table cible `profiles`) et `AuthCredentials`. |
| `src/middleware.ts` | **Ne fait PAS d'auth** — uniquement le middleware i18n `next-intl` (`createMiddleware(routing)`). Aucune protection de route serveur. |
| `src/app/[locale]/connexion/page.tsx` | Page de connexion (formulaire email/mot de passe). |
| `src/app/[locale]/admin/layout.tsx` | Garde du groupe admin. |
| `src/app/[locale]/client/layout.tsx` | Garde du groupe client. |
| `src/lib/repo/users.repo.ts` | Pseudo-table `profiles` (cle `cete_users`), CRUD localStorage avec seed des memes comptes. |
| `src/lib/store/storage.ts` | Wrapper `getItem`/`setItem`/`removeItem` sur localStorage avec garde SSR (`typeof window === "undefined"`). |

### Roles utilisateurs

Deux roles, typés `role: "admin" | "client"` dans l'interface `Profile` (`src/types/auth.ts`). Pas d'autre role. Les profils seed correspondants vivent aussi dans `src/lib/repo/users.repo.ts` (admin `adm-001`, client `cli-12345`).

### Credentials hardcodes

Definis en clair dans `src/lib/auth.ts` (constantes `DEMO_CREDENTIALS` L5-8 et `ADMIN_CREDENTIALS` L10-13) :
- Compte **client** : variable `DEMO_CREDENTIALS`, email `demo@cete.fr`.
- Compte **admin** : variable `ADMIN_CREDENTIALS`, email `admin@cete.fr`.

Aggravant : les mots de passe sont **aussi affiches en clair dans l'UI** sur la page de connexion (`src/app/[locale]/connexion/page.tsx` L105-117, boutons "Comptes de demonstration" qui pre-remplissent le formulaire). La comparaison `login()` est une simple egalite de chaines, sans hash ni token.

### Pages protegees et mecanisme de garde

La protection est **100% cote client, par layout** (aucune garde serveur, aucun cookie, le middleware ne bloque rien) :
- **Groupe admin** (`/[locale]/admin/*`) : `admin/layout.tsx` enveloppe le contenu dans `<AuthProvider>`. Dans `AdminLayoutContent`, un `useEffect` redirige vers `/connexion` si `!isLoading && (!user || user.role !== "admin")`, retourne `null` tant que non autorise, et affiche un ecran "Chargement..." pendant `isLoading`.
- **Groupe client** (`/[locale]/client/*`) : `client/layout.tsx`, meme schema, redirige vers `/connexion` si `!user` (sans verifier le role — un admin connecte passe). Garde un `useRef isLoggingOut` pour rediriger vers `/` au logout au lieu de `/connexion`.
- `admin/page.tsx` et `client/page.tsx` : simples `redirect()` serveur vers le dashboard (pas des gardes d'auth).
- `admin/clients/[id]/layout.tsx` : **aucune** verif d'auth propre, s'appuie uniquement sur le layout admin parent.
- Routes publiques `(public)/...` incluant `/verifier/[id]` (verification de notation) : volontairement non protegees.

### Sync vs async

Les fonctions de `auth.ts` sont **async** (toutes retournent des `Promise`, prefigurant les appels reseau Supabase). L'`AuthProvider` les `await` dans `refresh()`/`login()`/`logout()`. NB : c'est de l'async "factice" — la persistance sous-jacente reste localStorage synchrone.

### Ecart avec AUDIT.md (mars 2026) 🟡

L'`AUDIT.md` decrit les fonctions auth comme **Sync** et renvoyant `AuthUser`. Le code **actuel** les a migrees en **async** renvoyant `Profile`. L'audit est donc perime sur ce point precis.

## 7. Integrations externes

Le projet est en **Phase 1 (site vitrine statique + espaces client/admin mockes)**. Aucune integration SaaS tierce reelle (paiement, email transactionnel, upload cloud, IA, analytics, monitoring) n'est presente dans le code ou les dependances. Les seules « integrations » sont des ressources web embarquees sans cle d'API (cartographie Leaflet via CDN, images Unsplash, lien Google Maps).

### Tableau des integrations

| Service | Categorie | Statut | Fichiers concernes | Variables d'env requises |
|---|---|---|---|---|
| Stripe / paiement | Paiement | **Non detecte** (absent de package.json ; cite uniquement dans docs de planification Phase 2) | — | — |
| Brevo / Resend / SendGrid / Nodemailer / Mailgun | Email | **Non detecte** — le formulaire de contact n'a aucun backend ; seul un lien `mailto:` existe | `src/components/sections/contact/ContactSidebar.tsx` (ligne 101, `mailto:`) | — |
| Cloudinary / Uploadthing / AWS S3 | Upload / stockage | **Non detecte** | — | — |
| OpenAI / Anthropic | IA | **Non detecte** | — | — |
| Vercel Analytics / Plausible / GA / PostHog / Mixpanel / Hotjar | Analytics | **Non detecte** | — | — |
| Sentry / Datadog | Monitoring d'erreurs | **Non detecte** (aucun `instrumentation.ts`, aucun fichier sentry) | — | — |
| Supabase | Auth / DB | **Non detecte dans le code** — auth mockee via localStorage ; Supabase n'apparait que dans les docs de planification Phase 2 (`docs/`, `.planning/`) | `src/lib/auth.ts` (mock localStorage) | — |
| **Leaflet + react-leaflet** | Cartographie | **Detecte (actif)** — carte des zones d'intervention chargee dynamiquement cote client | `src/components/sections/about/AboutWorldMap.tsx` | Aucune cle. Charge des ressources externes sans token : tuiles CARTO `https://{s}.basemaps.cartocdn.com/dark_all/...` + CSS `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css` |
| **Google Maps (lien externe)** | Cartographie | **Detecte (lien uniquement)** — pas de SDK ni de cle, simple URL `maps/search` ouverte dans un onglet | `src/components/sections/contact/ContactMap.tsx` (lignes 10-12) | Aucune |
| **Unsplash (images distantes)** | CDN images | **Detecte (config)** — hostname autorise pour `next/image` | `next.config.ts` (`images.remotePatterns` → `images.unsplash.com`) | Aucune |
| **jsPDF + qrcode** | Generation PDF / QR (local) | **Detecte (librairies locales, pas un service externe)** — generation cote client, aucun appel reseau | `src/lib/generate-certificate-pdf.ts` | Aucune |

### Variables d'environnement
- `.env.example` ne contient qu'**une seule variable** : `NEXT_PUBLIC_SITE_URL` (defaut `https://cete-notation.fr`).
- Utilisee dans : `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/[locale]/layout.tsx` (metadata / SEO uniquement).
- Aucune cle secrete (cle API, token, secret de webhook) n'est requise ni referencee.

### Note de fiabilite
Verifie contre le code actuel (package.json, grep des imports SDK et de `process.env`, inspection des fichiers). Les occurrences de « Stripe » et « Supabase » trouvees par grep proviennent **exclusivement** de fichiers de documentation/planification (`docs/`, `.planning/`, `AUDIT.md`, `_bmad/`) et non du code applicatif.

## 8. Variables d'environnement

### Fichiers d'environnement présents

| Fichier | Présent | Suivi par git | Contenu |
|---|---|---|---|
| `.env.example` | Oui (46 octets) | Oui (commité) | 1 variable, valeur publique non sensible |
| `.env.local.example` | Non | — | — |
| `.env.sample` | Non | — | — |
| `.env` (réel) | Non | n/a | — |
| `.env.local` (réel) | Non | n/a | — |
| `.env.development` / `.env.production` (réels) | Non | n/a | — |

Aucun fichier `.env` réel n'existe dans le repo. Le `.gitignore` couvre `.env*` (lignes 33-34), donc tout futur fichier d'environnement réel sera exclu de git par défaut. Aucun secret n'a été détecté ; rien à masquer.

### Variables : documentées vs utilisées dans le code

| Variable | Documentée (`.env.example`) | Utilisée dans le code | Valeur / fallback | Préfixe |
|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Oui (`https://cete-notation.fr`) | Oui (3 occurrences) | Fallback codé en dur `"https://cete-notation.fr"` partout | `NEXT_PUBLIC_` (exposée client) |

### Occurrences de `process.env` dans le code

Une seule variable est lue, toujours avec le même fallback codé en dur :

- `src/app/robots.ts:3` — `process.env.NEXT_PUBLIC_SITE_URL || "https://cete-notation.fr"`
- `src/app/sitemap.ts:5` — `process.env.NEXT_PUBLIC_SITE_URL || "https://cete-notation.fr"`
- `src/app/[locale]/layout.tsx:33` — `process.env.NEXT_PUBLIC_SITE_URL || "https://cete-notation.fr"`

Aucune autre forme d'accès aux variables d'environnement n'a été trouvée : pas de `NODE_ENV`, pas de `import.meta.env`, pas de `loadEnv`/`dotenv`, et aucune référence à `SUPABASE_*`, `DATABASE_URL` ou à des clés d'authentification.

### Constats

- **Variables utilisées mais NON documentées** : aucune. La seule variable accédée (`NEXT_PUBLIC_SITE_URL`) est bien documentée dans `.env.example`.
- **Variables documentées mais NON utilisées** : aucune.
- **Cohérence Phase 1** : l'absence totale de variables Supabase / base de données / secrets confirme l'architecture mock-data actuelle (auth et données via localStorage et JSON). La Phase 2 (Supabase) nécessitera d'ajouter et documenter `NEXT_PUBLIC_SUPABASE_URL`, clé anon, et secrets serveur.
- **Robustesse** : grâce au fallback codé en dur dans les 3 fichiers, le projet build et tourne même sans `.env.local` ; `NEXT_PUBLIC_SITE_URL` ne sert qu'aux métadonnées SEO (robots, sitemap, métadonnées du layout).

### Recommandations (non bloquantes)

- Le fallback `https://cete-notation.fr` est dupliqué dans 3 fichiers ; le centraliser dans une constante éviterait toute divergence future. 🟡
- Anticiper la Phase 2 en préparant un `.env.example` enrichi (variables Supabase) dès que l'intégration démarrera.

## 9. Perimetre intouchable identifie

Objectif : distinguer ce qui NE DOIT PAS bouger lors d'une migration backend (site vitrine public, SEO, landing/marketing) de ce qui SERA impacte (espaces client/admin, auth, couche repo/localStorage). Verifie contre le code ACTUEL (l'`AUDIT.md` de mars 2026 est partiellement perime : il reference des routes `src/app/admin/...` sans le segment `[locale]`, et ignore les modules recents `clients/`, `evaluations`, `certificates`, `contract-documents`, `notifications`, `stats`).

Note structurelle : depuis l'audit, toutes les routes sont passees sous `src/app/[locale]/` (next-intl, locales `fr`/`en`, prefix `always`). Les chemins ci-dessous integrent ce segment.

### A. PERIMETRE INTOUCHABLE (site vitrine public / SEO / marketing)

Ces zones rendent du contenu statique issu des mocks via `data-loader.ts` (imports statiques, server components par defaut) et n'ont aucune dependance auth.

Pages publiques SEO (groupe `(public)`) :
- `src/app/[locale]/(public)/layout.tsx` (Header + Footer)
- `src/app/[locale]/(public)/page.tsx` (accueil)
- `src/app/[locale]/(public)/a-propos/page.tsx`
- `src/app/[locale]/(public)/expertise/page.tsx` (inclut la notation / Vigi-Score : il n'existe PAS de route `/notation` distincte, c'est integre ici)
- `src/app/[locale]/(public)/services/page.tsx`
- `src/app/[locale]/(public)/contact/page.tsx`
- `src/app/[locale]/(public)/cgu/page.tsx`
- `src/app/[locale]/(public)/blog/page.tsx` et `blog/[slug]/page.tsx` (le blog public utilise un tableau `blogPosts` mock **inline**, totalement decouple de la couche repo)

Composants de sections / landing / marketing (tous intouchables) :
- `src/components/sections/home/*` (HomeHero, HomeStats, HomePillars, HomeADN, HomeServices, HomeOrganizations, HomeTestimonials, HomeCTA, HomeFounders)
- `src/components/sections/about/*`, `sections/expertise/*` (ExpertiseVigiScore, ExpertiseTertiles, ExpertiseCertificate, etc.), `sections/services/*`, `sections/contact/*` (sauf le formulaire, voir zone grise), `sections/blog/*`
- Composants partages : `sections/FoundersGrid.tsx`, `HeroSection.tsx`, `PillarsSection.tsx`, `ServicesGrid.tsx`, `ValuesSection.tsx`, `ContactInfo.tsx`, `ADNTeaser.tsx`, `ProcessSection.tsx`
- Communs de chrome public : `src/components/common/Header.tsx`, `Footer.tsx`, `LanguageSwitcher.tsx` (consomment `getNavigation`/`getContactInfo` statiques, aucune dependance auth)

Donnees statiques de contenu (intouchables tant que purement editoriales) :
- `src/data/mocks/{fr,en}/founders.json`, `services.json`, `pillars.json`, `values.json`, `navigation.json`, `organizations.json`, `contact_info.json`
- `src/lib/data-loader.ts` : a CONSERVER pour les getters statiques (founders, services, pillars, values, navigation, organizations, contact). Voir reserve en zone grise.

### B. PERIMETRE IMPACTE (app : client / admin / auth / couche data)

Ces zones sont des client components reposant sur l'auth localStorage et/ou la couche repo (chaque repo porte deja des commentaires `// TODO Supabase:`).

Authentification (reecriture complete attendue, sync -> async) :
- `src/lib/auth.ts` (credentials hardcodes `demo@cete.fr`/`admin@cete.fr`, localStorage `cete_auth_user`)
- `src/lib/auth-context.tsx` (AuthProvider / useAuth)
- `src/types/auth.ts`, `src/types/shared.ts`, `src/types/client.ts` (types Profile/credentials)
- `src/app/[locale]/connexion/page.tsx`

Couche persistance (localStorage -> backend) :
- `src/lib/store/storage.ts` (wrapper localStorage, voue a disparaitre)
- Tous les repos `src/lib/repo/*.repo.ts` : `articles`, `documents`, `resources`, `settings`, `founders`, `users`, `clients`, `evaluations`, `contract-documents`, `certificates`, `notifications`, `stats`
- Seeds mutables : `src/data/mocks/**/{client_documents,resources,admin_articles,admin_stats,clients,evaluations,contract_documents}.json` (et le seed users hardcode dans `users.repo.ts`)

Espace ADMIN (tout le sous-arbre) :
- `src/app/[locale]/admin/**` : `layout.tsx` (garde auth role admin), `dashboard`, `blog`, `documents`, `ressources`, `organizations`, `team`, `users`, `settings`, et le module recent `clients/` (`clients/page.tsx`, `clients/[id]/{page,societe,documents,evaluations}.tsx`, `clients/[id]/layout.tsx`)
- `src/components/features/admin/**` (AdminSidebar, AdminStatsGrid, VigiDistribution, formulaires *FormDialog, tables, sous-dossiers `clients/` et `ui/`)

Espace CLIENT (tout le sous-arbre) :
- `src/app/[locale]/client/**` : `layout.tsx` (garde auth), `dashboard`, `profile`, `capsules`, `carnets`, `guides`, `newsletters`, `ressources`
- `src/components/features/client/**` (ClientSidebar, DashboardSummary, DocumentCard, CertificateCard, DocumentsList, NotificationsTicker)

### C. ZONE GRISE 🟡 (frontiere a arbitrer avant migration)

- 🟡 `src/app/[locale]/(public)/verifier/[id]/page.tsx` — page PUBLIQUE SEO de verification de certificat, MAIS client component qui consomme directement `getCertificateById` de `certificates.repo` (localStorage). C'est le seul point ou le site public touche la couche data impactee : elle devra etre rebranchee sur le backend (idealement en lecture serveur publique) tout en restant SEO-friendly.
- 🟡 `src/components/sections/ContactForm.tsx` + `contact/ContactFormFields.tsx` — formulaire de la page contact (intouchable visuellement) dont le `onSubmit` est un faux POST (`setTimeout` + toast). Devra etre branche sur un vrai envoi (email/backend) : impacte fonctionnellement, pas structurellement.
- 🟡 `getFounders()` dans `data-loader.ts` (L51-58) : contrairement aux autres getters statiques, il lit `localStorage.getItem("cete_founders")` si present (pour refleter les edits admin). Consomme par `HomeFounders`, `AboutFounders`, `FoundersGrid` — composants marketing « intouchables » mais dont la source de donnees migrera. La presentation reste intouchable, la source change.
- 🟡 `getContactInfo()` (Footer/ContactInfo public) lit le JSON statique alors que l'admin ecrit dans `settings.repo` (localStorage) : divergence connue (probleme #8 de l'AUDIT). A unifier sur une seule source lors de la migration.

### Synthese
Le site vitrine (pages SEO + sections marketing + chrome Header/Footer) est globalement DECOUPLE de la couche app et peut rester intact, a TROIS exceptions de frontiere a traiter (verifier/[id], ContactForm, source des founders/settings). L'integralite des sous-arbres `admin/` et `client/`, l'auth et tous les `repo/*` sont a migrer.

## 10. Drift et incoherences detectes

Analyse menee en lecture seule sur l'etat ACTUEL du code, confronte a `AUDIT.md` (date 2026-03-03). Constat majeur : **l'AUDIT.md est largement perime**. Il decrit l'arborescence d'avant la migration i18n (`src/app/admin/...`, `src/app/client/...`) alors que le code est aujourd'hui sous `src/app/[locale]/...`. La majorite des problemes qu'il listait ont ete corriges depuis. Les ecarts sont detailles ci-dessous.

### 10.1 Code mort (composants jamais importes)

Cinq composants de section "legacy" subsistent a la racine de `src/components/sections/`, jamais importes nulle part (verifie : aucune occurrence d'`import` les referencant) :

- `src/components/sections/FoundersGrid.tsx`
- `src/components/sections/HeroSection.tsx`
- `src/components/sections/PillarsSection.tsx`
- `src/components/sections/ServicesGrid.tsx`
- `src/components/sections/ValuesSection.tsx`
- `src/components/sections/ContactInfo.tsx` (le composant, distinct du type `ContactInfo`)

Ils ont ete remplaces par les versions specialisees dans `sections/home/`, `sections/about/`, `sections/contact/`, etc. A supprimer. 🟡 (verification par grep d'import; la confiance est haute mais une suppression devrait etre validee par un build.)

### 10.2 Mock data orpheline (JSON jamais consommes)

Les JSON a la **racine** de `src/data/mocks/` cohabitent avec des copies localisees dans `fr/` et `en/`. Or :

- `data-loader.ts` lit uniquement les versions `fr/` et `en/`.
- Les repos lisent un melange : certains la racine (`admin_articles.json`, `client_documents.json`, `resources.json`, `contact_info.json`, `founders.json`), d'autres `fr/` (`fr/clients.json`, `fr/contract_documents.json`, `fr/evaluations.json`).

Resultat : ces JSON racine ne sont **importes par aucun fichier** et sont morts : `admin_stats.json`, `navigation.json`, `organizations.json`, `pillars.json`, `values.json`, `services.json` (verifie par grep, "No matches found").

Incoherence de strategie de seed : les repos recents (`clients`, `contract-documents`, `evaluations`) seedent **toujours en `fr/`**, ignorant la locale. Les espaces admin afficheront donc des donnees FR meme en `/en/`. A noter aussi : `en/clients.json`, `en/contract_documents.json`, `en/evaluations.json` existent mais ne sont jamais lus.

### 10.3 Mock data datee / placeholder

- `src/data/mocks/resources.json:124` (+ `fr/` et `en/`) : `res-010` contient un placeholder non remplace : "decret 2026-XXX" / "Decree 2026-XXX". Numero de decret fictif laisse tel quel dans la donnee de demonstration.
- Les seeds de documents/notifications portent des dates 2026-01/02 coherentes avec la date courante simulee (2026-05). Pas de drift de date majeur ailleurs.

### 10.4 Routes vs pathnames i18n (drift de configuration)

`src/i18n/routing.ts` ne declare PAS les sous-routes client imbriquees qui existent pourtant comme pages :

- `src/app/[locale]/admin/clients/[id]/societe/page.tsx`
- `src/app/[locale]/admin/clients/[id]/evaluations/page.tsx`
- `src/app/[locale]/admin/clients/[id]/documents/page.tsx`

Seuls `/admin/clients` et `/admin/clients/[id]` figurent dans `pathnames`. Ces sous-pages sont atteintes par `router.push(...)` brut (dans `ClientTabNav`, `ClientBanner`) et non via le helper `Link` localise typé — elles echappent donc a la table de pathnames i18n. Aucune route n'est totalement orpheline (toutes sont liees via la sidebar ou des push), mais la cartographie i18n est incomplete.

### 10.5 Incoherence du modele de donnees (bug latent)

Le type `Profile` distingue volontairement `id` (id d'auth) de `clientId` (FK vers `Client`). Or **toutes les pages client passent `user.id`** a `listDocumentsForClient(clientId)` qui filtre sur `assignedClientIds.includes(clientId)` :

- `client/dashboard/page.tsx:30`, `client/capsules:24`, `client/carnets:24`, `client/guides:24`, `client/newsletters:24`, `client/profile:19`.

Cela ne fonctionne que par coincidence : le seed de demo donne `id === clientId === "cli-12345"` (`users.repo.ts` et `auth.ts`). Des qu'un client aura un `id` d'auth distinct de son `clientId`, le filtrage par client cassera. Devrait passer `user.clientId`.

### 10.6 TODO / FIXME dans le code

Aucun `FIXME / XXX / HACK`. Les `TODO` (~50 occurrences) sont **tous des marqueurs de migration Supabase intentionnels**, en commentaire au-dessus de chaque fonction repo/auth (ex. `auth.ts:15`, `articles.repo.ts:14`, `users.repo.ts:34`, `clients.repo.ts:26`...). Ce ne sont pas des dettes accidentelles mais une feuille de route assumee. Aucun TODO bloquant.

### 10.7 Dependances : RAS

Toutes les dependances de `package.json` sont importees : `jspdf` + `qrcode` dans `src/lib/generate-certificate-pdf.ts`, `leaflet` + `react-leaflet` en import dynamique dans `sections/about/AboutWorldMap.tsx` (+ `ContactMap`), `next-themes` via `ui/sonner.tsx`. Aucune dependance morte detectee.

### 10.8 Ecarts vs AUDIT.md (mars 2026) — ce qui a ete CORRIGE depuis

L'audit est obsolete sur de nombreux points, desormais resolus :

| Point audit | Etat actuel |
|---|---|
| Arborescence `src/app/admin/`, `src/app/client/` | Migre sous `src/app/[locale]/` (i18n next-intl) |
| `AuthUser` vs `AppUser` dupliques, pas d'`id` | Unifies en un seul type `Profile` (avec `id`) dans `types/auth.ts`; `types/user.ts` n'existe plus |
| Auth 100% synchrone | Reecrite en `async/Promise` (`auth.ts`) |
| Repos synchrones, sans try/catch | Tous `async`, avec `try/catch` + `RepoError` (`types/repo-error.ts`) |
| Casse `"PDF"` vs `"pdf"` | Harmonisee : `"pdf"` partout, `DocumentType`/`NotificationType` sont des union literals |
| `Notification.type`/`Article.category` en `string` | `NotificationType` est un union literal; notifications mutables via `markAsRead`/`markAllAsRead` (`notifications.repo.ts`) |
| Notifications immuables | `NotificationsTicker` appelle `markAsRead` |
| Profil client affiche `clientData.clientId` (JSON statique) | Corrige : utilise `useAuth().user.id` + `listDocumentsForClient` async avec loading/error |
| `getClientDocuments`/`getAdminStats`/`getResources` dans data-loader | Supprimes; deplaces vers les repos (`stats.repo`, `documents.repo`, etc.). Aucun import mort residuel |
| Credentials hardcodes EXPORTES | Toujours hardcodes mais desormais module-local (non exportes) dans `auth.ts:5-13` |

Ecarts NON resolus (toujours valables) : credentials de demo en clair (`auth.ts`), IDs generes via `Date.now()` (collision possible, ex. `documents.repo.ts:63`), seed users hardcode en TS (`users.repo.ts:7-26`), double source settings admin/public (`settings.repo` vs `data-loader.getContactInfo`).

**Recommandation** : marquer `AUDIT.md` comme historique/perime ou le regenerer — il induit en erreur sur l'etat reel du repo.

## 11. Recommandations pour le workflow de migration

### Perimetre suggere pour la migration Supabase

La migration backend (Phase 2) doit cibler EXACTEMENT le perimetre IMPACTE de la section 9, en laissant intact le site vitrine. Sequencage recommande :

1. **Schema de base de donnees** : les types de `src/types/` sont deja modelises facon table (FK `clientId`, `created_at`/`updated_at`, enums, `ClientScoped`). Tables cibles : `profiles`, `clients`, `client_contacts`, `contract_documents`, `evaluations`, `certificates`, `client_documents`, `notifications`, `resources`, `articles`, `settings`. Profiter de la migration pour figer les types contraints aujourd'hui en `string` (`compositeRating` triple-lettre, `ThreeCScore`).
2. **Auth** : remplacer `src/lib/auth.ts` + `auth-context.tsx` par Supabase Auth (les fonctions sont deja `async`, ce qui limite l'onde de choc). Supprimer les credentials hardcodes et les boutons de demo dans `connexion/page.tsx`. Ajouter une garde serveur (middleware/route handlers) en plus de la garde client actuelle — aujourd'hui la protection est 100% cote client.
3. **Couche repo** : chaque `src/lib/repo/*.repo.ts` porte deja un commentaire `// TODO Supabase: <requete>` au-dessus de chaque fonction. La migration consiste a remplacer l'acces `storage.ts` (localStorage) par des appels Supabase, en conservant la signature des repos (les pages consommatrices n'ont pas a changer). Supprimer `storage.ts` et le pattern de re-seed versionne en fin de chantier.
4. **Frontieres zone grise** (3 points) : rebrancher `verifier/[id]` sur une lecture serveur publique (RLS lecture seule), brancher `ContactForm` sur un vrai envoi (email/backend), et unifier la source `founders`/`settings` entre admin (`settings.repo`) et public (`data-loader.getContactInfo` / `getFounders`).

### Points d'attention specifiques au projet

- **AUDIT.md perime** : ne PAS l'utiliser comme reference d'etat. Le marquer historique / le regenerer. La presente reconnaissance est la source de verite a jour.
- **Bug latent `user.id` vs `user.clientId`** (section 10.5) : a corriger AVANT ou PENDANT la migration auth, sinon le filtrage des documents client cassera des que `id` ≠ `clientId` (ce qui sera le cas avec de vrais comptes Supabase).
- **i18n omnipresent** : toute route migree doit respecter le segment `[locale]` et la table `pathnames` de `routing.ts` (ajouter les sous-routes `clients/[id]/{societe,documents,evaluations}` manquantes — section 10.4).
- **Seed toujours en `fr/`** pour clients/evaluations/contract_documents : a corriger en migration (donnees reelles, non localisees) ou a expliciter.
- **IDs via `Date.now()`** : remplacer par UUID Supabase (deja anticipe dans les commentaires TODO).
- **Chantier admin/clients non commité** : avancer mais pas encore versionne. A committer / stabiliser avant d'attaquer la migration backend, sinon risque de conflit.
- **Code mort** (section 10.1 / 10.2) : nettoyer les 6 composants legacy et les 6 JSON racine orphelins pour reduire la surface de migration.
- **Double source de donnees `founders`** (data-loader lit localStorage + founders.repo ecrit la meme cle) : a unifier en migration.

### Complexite estimee : MOYENNE

Justification :
- **Facteurs qui reduisent la complexite** : architecture deja « Supabase-ready » (types facon table, FK, timestamps, enums, contrat `ClientScoped`) ; couche repo isolant l'acces donnees derriere des signatures stables et deja annotee `// TODO Supabase:` ligne par ligne ; auth deja `async` ; site vitrine totalement decouple (perimetre intouchable clair) ; aucune integration tierce a coordonner (pas de Stripe/email/upload deja en place) ; une seule variable d'env.
- **Facteurs qui augmentent la complexite** : 12 repos + 11 tables a migrer ; auth a securiser cote serveur (aujourd'hui 100% client, aucune garde serveur, aucun RLS) ; 3 frontieres zone grise non triviales (verification publique SEO-friendly, formulaire contact, unification des sources) ; bug latent `id`/`clientId` a corriger ; chantier admin/clients non commité ; aucun framework de test (pas de filet de securite — verification manuelle ou ajout de tests recommande) ; AUDIT.md trompeur.

### Workflow recommande : COMPLET

Le perimetre touche l'auth, la persistance et plusieurs sous-arbres applicatifs, sans aucun test automatise existant. Un workflow complet (planification par phases, RLS et securite, migration repo par repo avec verification, gestion explicite des 3 frontieres, et idealement ajout d'un socle de tests) est preferable a un workflow allege. La bonne preparation du code (types, repos annotes, decouplage vitrine) rend ce workflow complet fluide mais il reste necessaire vu la sensibilite auth/donnees.

## 12. Questions ouvertes pour le product owner

1. **Hosting cible** : le hosting n'est pas configure explicitement (Vercel seulement deductible via un README boilerplate non probant). Sur quelle plateforme la Phase 2 sera-t-elle deployee (Vercel, autre) ? Cela conditionne la configuration Supabase (SSR, edge, secrets serveur) et le branchement de l'envoi du formulaire de contact.

2. **Page de verification publique `/verifier/[id]`** : doit-elle rester strictement publique et SEO-indexable apres migration (lecture serveur via RLS lecture seule sur les certificats) ? C'est le seul point ou le site public touche la couche data — son comportement post-migration doit etre arbitre (quel niveau de detail certificat exposer publiquement, gestion des certificats expires/revoques).

3. **Formulaire de contact** : aujourd'hui un faux POST (setTimeout + toast), seul un lien `mailto:` existe. Quel canal reel cible-t-on en Phase 2 (email transactionnel type Brevo/Resend, table Supabase, CRM) ? Aucune integration email n'est presente, c'est une decision a part entiere.

4. **Modele de comptes et roles** : confirme-t-on les deux seuls roles `admin`/`client`, ou faut-il anticiper d'autres roles (auditeur, super-admin, lecture seule) ? Et confirme-t-on la separation `id` (auth) vs `clientId` (FK) — auquel cas le bug latent (toutes les pages client passent `user.id`) doit etre corrige et la relation `profiles ↔ clients` precisee (un client = un ou plusieurs comptes ?).

5. **Localisation des donnees metier** : les donnees clients/evaluations/documents contractuels sont aujourd'hui seedees uniquement en `fr/` (les copies `en/` ne sont jamais lues). En Phase 2, ces donnees metier reelles doivent-elles etre localisees (peu probable pour un SIRET/contrat) ou rester non traduites ? Cela determine le schema (champs traduits vs non) et le nettoyage des mocks `en/`.

6. **Chantier admin/clients non commité** : ce module (route, composants, repos, types, mocks) est avance mais pas versionne. Doit-il etre stabilise et commité comme prerequis avant la migration backend, ou fait-il partie integrante du chantier Supabase ?
