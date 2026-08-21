# Passation — projet CETé

> **Objet** : tout ce qu'il faut savoir pour reprendre ce projet sans avoir à
> interroger son auteur. Écrit le 21 août 2026, sur le commit de tête de `master`.
>
> **Ce document est versionné dans un dépôt public.** Il ne contient donc ni accès,
> ni identifiant, ni détail de faille ouverte. Ces éléments sont dans un second
> document, `docs/passation-confidentiel.md`, **transmis hors dépôt** — s'il ne vous
> a pas été remis, la passation est incomplète : réclamez-le.

---

## 1. Prise en main — comptez 30 minutes

1. `npm ci` puis `cp .env.example .env.local`, et renseignez les quatre variables
   (les valeurs sont dans le document confidentiel).
2. `npm run dev` → `http://localhost:3000` redirige vers `/fr`.
3. `npm run build` doit sortir **vert, 76 routes**. C'est le seul contrôle
   automatisé du projet : s'il passe, votre environnement est bon.
4. Lisez [CLAUDE.md](CLAUDE.md) — architecture, conventions et les six pièges qui
   ont chacun déjà coûté une session de travail.
5. Ouvrez `/fr`, `/fr/expertise`, `/fr/observatoire`, puis connectez-vous et
   parcourez `/fr/admin/clients` et `/fr/client/notation`. En vingt minutes vous
   aurez vu 80 % du produit.

---

## 2. Ce que fait le produit

CETé est une **agence indépendante de notation du risque électrique**. Le produit
vendu n'est pas un audit : c'est une **note** (le Vigi-Score) et le certificat qui
l'atteste, vérifiable publiquement.

Une seule application Next.js sert trois publics :

- **Le site public** (FR/EN) : positionnement, méthode ADN, offres, blog, glossaire
  métier, observatoire O-M-T, et la page `/verifier/{id}` qui permet à un tiers de
  contrôler l'authenticité d'un certificat via son QR code.
- **Le portail client** : sa notation, ses documents contractuels, la bibliothèque de
  ressources, son profil.
- **Le back-office admin** : clients, évaluations, certificats (génération PDF réelle),
  blog éditorial, ressources, utilisateurs, paramètres.

Le vocabulaire métier (Vigi-Score, ADN, DPS, tertiles, CTST, TST) est défini dans
`src/data/glossary.ts` — c'est la référence la plus rapide pour comprendre le domaine.

---

## 3. Carte du code

| Vous cherchez… | C'est ici |
|---|---|
| une page publique | `src/app/[locale]/(public)/` |
| le back-office | `src/app/[locale]/admin/` |
| le portail client | `src/app/[locale]/client/` |
| l'accès aux données | `src/lib/repo/*.repo.ts` — un fichier par entité |
| les lectures vitrine avec repli | `src/lib/vitrine-data.ts` |
| le contenu éditorial figé | `src/data/mocks/{fr,en}/*.json` via `src/lib/data-loader.ts` |
| les traductions d'interface | `messages/fr.json`, `messages/en.json` |
| les chemins traduits et les locales | `src/i18n/routing.ts` |
| l'authentification | `src/lib/auth.ts`, `src/lib/auth-context.tsx`, `src/app/actions/` |
| les URLs, canonicals, hreflang | `src/lib/seo.ts` |
| les données structurées | `src/lib/schema.ts` |
| le schéma de base | `supabase/migrations/` (+ son README, à lire avant d'y toucher) |
| le design system des portails | `src/components/shared/` |
| les thèmes et couleurs | `src/app/globals.css` |

Ordre de lecture conseillé : `src/i18n/routing.ts` → `src/middleware.ts` →
`src/lib/vitrine-data.ts` → un repo au hasard → `src/lib/seo.ts`.

---

## 4. Comment ça tourne

**Hébergement** : Coolify, application `cete`, build Nixpacks sur Node 22, déploiement
depuis `master`. L'aperçu tourne sur un sous-domaine de l'agence ; le domaine de
production visé est `cete-notation.fr`.

**Deux règles qui expliquent la moitié des incidents de déploiement :**

1. Les variables `NEXT_PUBLIC_*` sont **inlinées à la compilation**. Les modifier
   dans Coolify sans relancer un build complet ne change rien à ce qui est servi.
   C'est notamment vrai pour `NEXT_PUBLIC_SITE_URL` au moment de la bascule sur le
   domaine de production : sans rebuild, les canonicals et le sitemap continuent de
   pointer sur l'ancien domaine.
2. Le dépôt embarque un `override` npm sur `@swc/helpers` (voir `package.json`).
   Il n'est pas décoratif — le retirer casse le build sur l'image Nixpacks.

**Base de données** : Supabase. Les migrations s'appliquent **manuellement via le SQL
Editor** du dashboard, jamais par `supabase db push` — la base a été construite à la
main et n'a jamais été liée à la CLI. La procédure complète, y compris ce qu'il
faudrait faire pour brancher un jour la CLI, est dans `supabase/migrations/README.md`.
**Au 21 août 2026, toutes les migrations du dossier sont appliquées** (vérifié en base).

---

## 5. État réel — ce qui marche, ce qui n'a jamais été écrit

Le projet est **très avancé**. Ce n'est pas un prototype : l'essentiel du produit
fonctionne pour de bon. Mais il reste huit trous, et aucun n'est visible à l'écran —
d'où cette section.

### Ce qui est réellement implémenté

- **Socle Supabase complet** : 14 tables, RLS active sur les 14, policies dédiées sur
  les 4 buckets de stockage, 20 migrations, triggers anti-escalade de privilèges.
- **Authentification réelle** (cookies SSR rafraîchis par le middleware), réinitialisation
  de mot de passe, garde `is_active` au login **et** au reset.
- **Back-office** : clients, évaluations, certificats (**PDF + QR code réels**, avec la
  page publique de vérification), documents contractuels, ressources, blog bilingue avec
  éditeur Markdown, utilisateurs, réglages.
- **Espace client** : notation, certificats, quatre catégories de publications,
  bibliothèque de ressources, visionneuse PDF sécurisée.
- **Vitrine FR/EN** : 10 pages, i18n complet, SEO/GEO soigné — canonicals, hreflang,
  sitemap en ISR, 8 types de JSON-LD, `llms.txt`, `robots.txt` ouvert aux crawlers d'IA.
- **Build vert**, exit 0.

### Les huit trous — ce qui n'a jamais été implémenté

| Manque | État exact, vérifié dans le code |
|---|---|
| **Captation de leads** | `src/components/sections/ContactForm.tsx` : `setTimeout(1000)` puis toast de succès. Pas de table, pas d'email, pas de route API. **100 % des leads sont perdus**, et le prospect croit avoir été reçu. |
| **Mentions légales / confidentialité** | `/legal` et `/privacy` sont liés dans le pied de page (`src/data/mocks/{fr,en}/navigation.json:11-12`) sur **toutes** les pages, et les deux routes → 404. |
| **Analytics** | Zéro. Ni Plausible, ni GA, ni PostHog, ni Sentry. Aucune conversion mesurée, aucune erreur de production remontée. |
| **Notifications** | Tables `notifications` et `notification_reads` créées et protégées par RLS en base. Côté code : rien d'autre que les types générés. Aucun repo, aucune UI, aucun déclencheur. |
| **Newsletter** | `src/components/sections/blog/BlogCTA.tsx` : le bouton « S'inscrire à la newsletter » est un `Link` vers `/contact`. Aucun champ email n'existe nulle part. |
| **Benchmark sectoriel** | Promis dans l'offre Vigi-Score, non implémenté. |
| **Calcul de la note** | **Il n'y en a pas.** Dans `CompleteEvaluationDialog`, les trois lettres O-M-T sont des champs de saisie libres et le Vigi-Score global est choisi à la main parmi A/B/C/D. La seule mécanique existante est `CertificateFormDialog.tsx:75`, qui concatène l'initiale des trois sous-critères. |
| **Tests** | Aucun framework, aucun script. `npm run build` et `scripts/verify-*.mjs` (RLS, écritures admin, visibilité client, stockage) sont les seuls filets. |

À quoi s'ajoutent deux points de contenu :

- **La page d'accueil affiche un témoignage client non sourcé** — nom, entreprise et
  chiffres qui n'apparaissent dans aucune donnée du projet, sous un badge « Témoignage
  client ». À remplacer par un témoignage réel autorisé par écrit, ou à retirer.
- **Blog** : 4 articles publiés. Des brouillons attendent en base, dont deux articles de
  fond rédigés fin juillet, jamais relus ni publiés.

Le service d'emailing conditionne les deux premières lignes du tableau : **aucun n'est
intégré**. La décision est actée — Brevo, via son API REST transactionnelle, donc sans
dépendance npm à ajouter. Rien n'est écrit.

### Passeport de prévention — terrain entièrement neuf

Si la question se pose : **rien n'a été fait ici**. Zéro occurrence de « passeport »,
« Caisse des Dépôts », « net-entreprises » ou « CACES » dans tout le dépôt (vérifié le
21 août 2026 sur `src/`, `messages/` et `supabase/`). Hors socle technique — auth,
RLS, portails, design system — il n'y a rien à réutiliser pour ce chantier.

---

## 6. Ce qui reste à faire, dans l'ordre

Un audit go-live complet (147 constats : 8 bloquants, 58 majeurs, 81 mineurs) et un
plan de correction phase par phase existent — **hors dépôt**, transmis avec le document
confidentiel. Voici la trame.

1. **Sécurité et accès** — traité en premier, détaillé dans le document confidentiel.
   Ne rien mettre en ligne avant.
2. **Rebrancher le canal commercial** : formulaire de contact → Brevo, avec écriture
   d'une trace en base. Sans cela, tout trafic gagné est perdu à l'arrivée.
3. **Conformité légale** : créer `/legal` et `/privacy` — les deux liens existent déjà
   sur toutes les pages. Bloqué par des informations que seul le client peut fournir
   (elles sont listées dans le document confidentiel : c'est le vrai chemin critique,
   pas le code).
4. **Assainir les contenus non sourcés** : témoignage, références d'entreprises,
   volumétrie affichée.
5. **Mise en ligne** sur `cete-notation.fr` : DNS, variables d'environnement,
   **rebuild complet**, vérification du sitemap et des canonicals sur le domaine réel.
6. **Analytics, le jour même de la mise en ligne.** Sans mesure, le travail SEO/GEO
   déjà fait ne produit aucune information exploitable — et on ne saura pas si le
   formulaire remis en service convertit.
7. **Ensuite seulement**, par ordre de valeur décroissante : les 58 majeurs de l'audit,
   la performance (ISR sur les pages publiques, réduction du `"use client"`), l'interface
   des notifications (la base est prête, tout le code reste à écrire), le benchmark
   sectoriel promis dans l'offre, un vrai calcul du Vigi-Score à la place de la saisie
   manuelle, et les premiers tests automatisés.

Les trois derniers points du 7 sont des **fonctionnalités produit**, pas de la dette :
ils demandent un arbitrage métier avec le client avant d'être chiffrés. Le calcul de la
note en particulier touche au cœur de la promesse commerciale — aujourd'hui, un expert
saisit la note qu'il a établie hors application.

---

## 7. Décisions déjà prises — ne pas les rejouer

- **Aucun horaire d'ouverture n'est affiché** nulle part (décision du 28 juillet 2026,
  la structure n'a pas d'accueil physique). La colonne `settings.business_hours` existe
  encore en base mais n'est pas utilisée.
- **Brevo** pour l'email transactionnel. Un audit antérieur recommandait Resend : cette
  recommandation est caduque, ne pas l'appliquer.
- **`localePrefix: "always"`** : la locale est toujours visible dans l'URL. C'est un
  choix SEO (une URL canonique distincte par langue), pas un défaut.
- **Repli systématique de la vitrine sur le JSON statique** si Supabase est injoignable.
  La vitrine ne doit jamais tomber parce que la base tousse.
- **CETé ADN® et Vigi-Score®** sont des marques déposées : le symbole ® fait partie du
  contenu, il n'est pas décoratif.
- **Le dépôt est public.** Tant qu'il l'est, aucun document décrivant une faille non
  corrigée n'y entre (voir la fin du `.gitignore`).

---

## 8. Documents transmis hors dépôt

Cinq documents ne sont pas dans le dépôt, volontairement, parce qu'ils décrivent des
défauts encore ouverts ou des accès :

| Document | Contenu |
|---|---|
| `docs/passation-confidentiel.md` | accès, comptes, actions de sécurité, arbitrages en attente |
| `docs/go-live-audit.md` | audit go-live du 16/07/2026 — 147 constats vérifiés |
| `docs/go-live-plan.md` | plan de correction phase par phase du précédent |
| `docs/seo-geo-audit-2026-07-29*.md` | audit SEO/GEO et son annexe de constats |
| `AUDIT-CETE-POUR-PLATEFORME.md` | inventaire exhaustif du contenu et de l'architecture |

Le jour où le dépôt passe en privé, ces exclusions peuvent être levées : les lignes
correspondantes du `.gitignore` sont commentées en ce sens.

---

## 9. Retrouver ce qui a été retiré

Vingt-cinq documents de chantier (audits de migration, rapports de refonte, plans de
phase) ont été supprimés du dépôt le 21 août 2026 : ils décrivaient des états
antérieurs et contredisaient le code actuel. Ils restent dans l'historique git.

```bash
git log --diff-filter=D --name-only -1 -- "*.md"   # la liste
git show <commit>^:BACKEND_SPEC.md                 # relire l'un d'eux
git checkout <commit>^ -- docs/i18n-audit.md       # le restaurer
```

Quelques commentaires d'en-tête pointent encore vers ces documents : les cinq
premières migrations de `supabase/migrations/` citent `BACKEND_SPEC.md` comme source,
et `src/app/globals.css:304` renvoie à `docs/dark-mode-audit.md` pour la validation
WCAG de la palette sombre. Ces renvois restent valables — les fichiers sont dans
l'historique, récupérables par les commandes ci-dessus.

Seul `docs/PRD.md` a été conservé : c'est la spécification produit validée avec le
client en février 2026. Elle décrit l'**intention**, pas l'état actuel du code.
