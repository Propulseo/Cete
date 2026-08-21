# CLAUDE.md

Guide de travail pour Claude Code (claude.ai/code) sur ce dépôt.
Contexte complet, état fonctionnel et travail restant : **[HANDOFF.md](HANDOFF.md)**.

## Le produit

CETé — agence indépendante de notation du risque électrique. Une application Next.js
qui sert le site public bilingue FR/EN, le portail client et le back-office admin.
Les données sont **réelles** (Supabase : auth, base, stockage) ; seul le contenu
éditorial figé de la vitrine reste en JSON.

## Commandes

```bash
npm run dev          # serveur de développement
npm run build        # build de production (prebuild = lint:lines)
npm run lint         # ESLint
npm run lint:lines   # 250 lignes max par page/section (avertissement à 150)
```

Pas de framework de test. La preuve d'une modification, c'est `npm run build` vert
plus une vérification au navigateur. `scripts/verify-*.mjs` sondent Supabase
(RLS, écritures admin, visibilité client, stockage).

## Architecture

### Routage — tout est sous `[locale]`

`src/i18n/routing.ts` déclare les locales `fr` / `en` en `localePrefix: "always"` et
**mappe chaque chemin traduit** (`/a-propos` ↔ `/about`, `/glossaire` ↔ `/glossary`).
Toute nouvelle route publique doit être ajoutée à `pathnames`, sinon elle est
inatteignable en anglais et absente du sitemap.

- `src/app/[locale]/(public)/` — vitrine, blog, glossaire, observatoire, CGU, vérification de certificat
- `src/app/[locale]/admin/` — back-office
- `src/app/[locale]/client/` — portail client
- `src/app/[locale]/connexion`, `reset-password`, `viewer` — authentification et visionneuse
- `src/middleware.ts` — i18n, rafraîchissement de session Supabase, CSP `frame-ancestors`

### Données — trois sources, dans cet ordre

1. **Supabase** (`src/lib/repo/*.repo.ts`) — clients, évaluations, certificats, articles,
   ressources, documents, utilisateurs, paramètres. Un repo par entité, jamais de requête
   Supabase dispersée dans un composant.
2. **`src/lib/vitrine-data.ts`** — lectures serveur de la vitrine (fondateurs, coordonnées,
   articles) avec **repli automatique sur le JSON statique** si la base est injoignable.
   Règle intangible : *la vitrine ne casse jamais*.
3. **`src/data/mocks/{fr,en}/*.json`** via `src/lib/data-loader.ts` — contenu éditorial figé
   (services, piliers, valeurs, navigation).

Clients Supabase : `src/lib/supabase/client.ts` (navigateur), `server.ts` (composants serveur),
`admin.ts` (**service-role, serveur uniquement**), `middleware.ts` (session), `storage.ts`
(buckets `certificates`, `contract-documents`, `client-documents` ; le bucket public
`blog-images` est géré à part par `src/lib/repo/blog-media.repo.ts`).

### Auth

`src/lib/auth.ts` s'appuie sur Supabase Auth (`signInWithPassword`) puis charge le profil.
Un compte **sans profil ou avec `is_active = false` est immédiatement déconnecté** — c'est
volontaire et cette garde existe aussi côté réinitialisation de mot de passe.
`src/lib/auth-context.tsx` expose `AuthProvider` / `useAuth()`.
Les opérations privilégiées (création de compte, réinitialisation) passent par des Server
Actions dans `src/app/actions/`, jamais par le client.

### SEO

`src/lib/seo.ts` est la source unique des URLs : `buildAlternates()` produit le canonical
auto-référent et les hreflang depuis `routing.pathnames`. `src/lib/schema.ts` produit le
JSON-LD (Organization, BreadcrumbList, Article, FAQPage, DefinedTermSet).
**Le layout ne pose aucun `alternates`** — chaque page construit le sien.

### Base de données

Migrations dans `supabase/migrations/`, appliquées **à la main via le SQL Editor** du
dashboard Supabase. `supabase db push` échouerait : lire `supabase/migrations/README.md`
avant toute migration. Toute nouvelle migration s'écrit idempotente.

## Pièges connus — ils ont tous déjà coûté une session

1. **Navigation i18n** : importer `Link`, `useRouter`, `redirect`, `getPathname` depuis
   `@/i18n/navigation`, jamais depuis `next/*`. Sinon la locale retombe sur `/fr`.
2. **`getPathname` inclut déjà `/{locale}`** — ne pas le préfixer une seconde fois.
3. **`openGraph` d'une page REMPLACE celui du layout** (fusion superficielle) : une page qui
   définit `openGraph` doit redéclarer son image.
4. **`NEXT_PUBLIC_*` est inliné au build** : changer une variable impose un rebuild.
5. **`profiles.client_id`** relie un compte à sa fiche client. S'il est nul, le portail
   client se vide silencieusement — sans erreur.
6. **Routes metadata sans extension** (`opengraph-image`) : à exclure du matcher du
   middleware, sinon elles sont redirigées en 307 et deviennent inaccessibles.

## Conventions

- **Langue** : toute l'interface publique et client est bilingue via `messages/{fr,en}.json`.
  L'admin interne reste en français.
- **Taille de fichier** : 250 lignes maximum par page et par section (`prebuild` bloquant).
  Au-delà, extraire dans `src/components/sections/<page>/`.
- **Composants serveur par défaut** ; `"use client"` seulement pour hooks, événements
  ou API navigateur.
- **Styles** : Tailwind v4 en PostCSS-first, aucun `tailwind.config`. Les variables de
  marque et les thèmes (`.admin-theme`, `.client-theme`, mode nuit) sont dans
  `src/app/globals.css`.
- **Composants** : `ui/` (shadcn), `common/` (Header, Footer), `shared/` (design system des
  portails : `data-table`, `kpi-tile`, `status-badge`, `rating-seal`…), `sections/<page>/`,
  `features/`, `seo/`.
- **Icônes** : Lucide exclusivement. Les noms d'icônes dans les JSON sont des identifiants Lucide.
- **Imports** : alias `@/` partout.
- **TypeScript strict, aucun `any`.** Les types sont dans `src/types/` avec un barrel `index.ts`.
- **Polices** : Inter (texte) et Merriweather (titres) via `next/font`.

### Couleurs de marque (`globals.css`)

- Primaire : `#4DA6D9` (bleu ciel), `#1A7AB5` (profond), `#0D5A8A` (ultra)
- Accent : `#E8630A` (orange TST), `#F59542` (clair), `#B84D08` (foncé)
- Texte : `#1A2940` (principal), `#4A6580` (secondaire), `#8AA5BE` (atténué)
- Fonds : `#FFFFFF`, `#F4F9FD` (doux), `#DAEEF8` (départ de dégradé) — pied de page `#1A2940`
- **Motif** : bulles bleues translucides (`rgba(77,166,217,0.08–0.15)`) en décor de hero.
  Jamais de bulle orange, jamais de texte dans une bulle.

## Sécurité — non négociable

Le dépôt est **public**. Avant tout commit :

- aucune clé, aucun mot de passe, aucun identifiant réel dans le code ni dans un document versionné ;
- `SUPABASE_SERVICE_ROLE_KEY` ne sort jamais du serveur ;
- les documents d'audit qui décrivent des failles encore ouvertes restent hors dépôt
  (voir la fin du `.gitignore`).
