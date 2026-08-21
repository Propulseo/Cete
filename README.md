# CETé — site public + portails admin et client

Application Next.js de **CETé (Consortium Experts Techniques Électricité)**, agence
indépendante de notation du risque électrique. Un seul déploiement sert trois choses :

| Périmètre | Routes | Nature |
|---|---|---|
| Site public bilingue FR/EN | `/{locale}/…` | vitrine, blog, glossaire, observatoire, vérification publique de certificat |
| Portail client | `/{locale}/client/**` | notation, documents, ressources, profil |
| Back-office admin | `/{locale}/admin/**` | clients, évaluations, certificats, blog, ressources, utilisateurs |

**Nouveau sur le projet ? Lisez [HANDOFF.md](HANDOFF.md)** — architecture réelle,
pièges connus, état fonctionnel et travail restant. Ce README ne couvre que le démarrage.

## Démarrage

Prérequis : **Node 22**, npm, et un accès au projet Supabase.

```bash
npm ci
cp .env.example .env.local   # puis renseigner les 4 variables
npm run dev                  # http://localhost:3000 → redirige vers /fr
```

`.env.local` (aucune valeur par défaut ne fonctionne, il faut les vraies clés) :

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | base des canonicals, du sitemap et des liens de réinitialisation |
| `NEXT_PUBLIC_SUPABASE_URL` | projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé publique, soumise au RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | **serveur uniquement** — administration des comptes. Ne jamais l'exposer côté client ni la préfixer `NEXT_PUBLIC_`. |

> Les variables `NEXT_PUBLIC_*` sont **inlinées à la compilation**. Les changer impose
> un rebuild complet, pas un simple redémarrage du conteneur.

## Commandes

```bash
npm run dev          # serveur de développement
npm run build        # build de production (lance lint:lines en prebuild)
npm run start        # sert le build
npm run lint         # ESLint
npm run lint:lines   # 250 lignes max par page/section (avertissement à 150)
```

Aucun framework de test n'est configuré. La vérification se fait par `npm run build`
(vert = 76 routes) et par les scripts `scripts/verify-*.mjs` qui sondent Supabase
(RLS, écritures admin, visibilité client, stockage).

## Base de données

Schéma et migrations dans `supabase/migrations/`. **Ne pas utiliser `supabase db push`** :
la base a été construite à la main via le SQL Editor du dashboard, et le projet n'a jamais
été lié à la CLI. La procédure exacte est dans [supabase/migrations/README.md](supabase/migrations/README.md).

## Déploiement

Coolify, depuis la branche `master`, build Nixpacks sur Node 22. Les variables
d'environnement doivent exister **au moment du build**. Détails et bascule vers le
domaine de production : voir [HANDOFF.md](HANDOFF.md).

## Conventions

Elles sont dans [CLAUDE.md](CLAUDE.md) — c'est aussi le fichier lu par Claude Code.
Les trois qui cassent le plus vite si on les ignore :

1. **Toujours** importer `Link`, `useRouter`, `redirect` depuis `@/i18n/navigation`.
   Un `next/link` renvoie l'utilisateur en `/fr` et perd sa locale.
2. Pages et sections plafonnées à 250 lignes — le `prebuild` échoue au-delà.
3. Composants serveur par défaut ; `"use client"` seulement si hooks, événements ou API navigateur.
