# CETé — Plan de fin de projet

> **Pour un agent exécutant :** ce plan se déroule tâche par tâche. Chaque étape est
> une case à cocher (`- [ ]`). Ne jamais enchaîner deux tâches sans avoir passé la
> vérification de la première.

## ⭐ État d'avancement — point du 25/08/2026

### Décisions du grill du 25/08 (nuit) — elles PRIMENT sur l'ordre écrit plus bas

1. **Go-live unique, APRÈS toutes les fonctionnalités.** La Phase 4 est déplacée
   après les Phases 7, 8, 9 et 10. Le chemin critique inclut donc les réponses
   clients (règles Vigi-Score comprises). Avantage : les migrations de données se
   font sans trafic réel.
2. **Phase 5 remplacée par un audit maison ÉTENDU PRODUIT** : sécurité d'abord
   (RLS 14 tables, escalade, service-role, storage, cookies, CSP complète,
   anti-rafale), puis performance (intègre les tâches 11.1/11.2), SEO, accessibilité.
   Découpé en sous-lots vérifiables, AVANT le go-live.
3. **Vigi-Score : moule paramétrique dès maintenant** — fonction pure + seuils/
   pondérations en configuration + branchement dialog, avec un barème D'EXEMPLE
   marqué « non définitif » et un garde-fou de build tant que les règles ne sont
   pas validées client.
4. **Mesure d'audience : Umami auto-hébergé sur Coolify** (décision prise, ce point
   n'est plus une dépendance client). Sentry côté erreurs acquis.
5. **Tests E2E : Supabase LOCAL via Docker** (CLI Supabase, `db reset` rejoue les
   migrations existantes). Prérequis machine : Docker Desktop actif + `seed.sql`
   pour les comptes de démo. Aucun projet cloud staging.
6. **Plausible abandonné** — remplacé par Umami (ligne retirée des demandes client).

### Ordre d'exécution consolidé (issu du grill)

| # | Chantier | Dépendance |
|---|---|---|
| 0 | Vérif navigateur écran Demandes (étape 7, tâche 1.2) | toi, 10 min |
| 1 | Phase 7 — Notifications (repo → cloche → admin → déclencheurs) | aucune |
| 2 | Phase 9 — Moule paramétrique Vigi-Score en TDD | aucune |
| 3 | Audit maison étendu — lot sécurité | aucune |
| 4 | Docker Supabase local + seed + Playwright (6.2) | Docker Desktop installé |
| 5 | Audit maison étendu — lots perf (=11.1/11.2), SEO, a11y | lot sécurité vert |
| 6 | Tâche 1.3 Brevo + Phase 8 newsletter | compte Brevo (client) |
| 7 | Versage légal + témoignage + chiffres | réponses client |
| 8 | Remplissage barème Vigi-Score validé + tests | règles client |
| 9 | **Phase 4 — Go-live unique** (+ Umami + Sentry le jour même) | tout ce qui précède |

### En attente client (mis à jour)
| Demande | Débloque |
|---|---|
| Compte Brevo + SPF/DKIM + clé API | Tâche 1.3 puis Phase 8 (newsletter) |
| Informations légales (doc joint) | Versage contenu pages légales (+ levée marqueurs) |
| Décision témoignage accueil (3 options) | Tâche 3.1 |
| Sources ou accord de reformulation des chiffres | Tâche 3.2 (« 200+ », « 80 ans », « 20 ans ») |
| Accès DNS cete-notation.fr | Phase 4.2 |
| Règles de calcul Vigi-Score (6 questions fermées, Tâche 9.1) | Remplissage du moule (chantier 8) |
| Durée de conservation RGPD (défaut proposé : 3 ans) | Tâche 11.3 |

### Terminé (committé sur `master`)
| Tâche | Commit | Note |
|---|---|---|
| 0.1 Captation de leads committée | `b16b555`+`e132212` | |
| 0.2 Lignes de test purgées | — | sonde : 0 ligne en base |
| 0.3 Sondes réparées (`.env`) | `b201720` | |
| 1.1 Repo et types demandes | `6c286e5` | |
| 1.2 Écran back-office Demandes | `14538e7` | étape 7 (vérif navigateur) restante |
| 2.1 Liste infos légales client | `2b11d8a` | à joindre au message client |
| 2.2 Pages `/legal` + `/privacy` | `e33a0f4` | 200 ×4 URLs, hreflang OK, garde-fou testé |
| 6.1 Socle Vitest + tests captation | `8f68d1a` | 7/7 verts (test gabarit email : après 1.3) |
| 11.6 Migration proxy.ts | `b4ab585` | avertissement Next 16 éliminé |

Build vert : **82 routes**.

---

**Objectif :** amener CETé de « site quasi complet mais non commercialisable » à
« produit fini, en ligne, mesuré et testé ».

**Architecture :** on ne change ni la stack ni les fondations. Le socle Supabase,
l'auth, les portails et le design system sont en place et ne sont pas retouchés. Tout
le travail consiste à (a) fermer les circuits ouverts — un lead qui arrive et que
personne ne voit, des liens de pied de page en 404 —, (b) mettre en ligne avec de la
mesure, puis (c) construire les quatre fonctionnalités produit jamais implémentées.

**Stack :** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict ·
Supabase (auth, Postgres, storage) · next-intl · Tailwind v4 (PostCSS-first) ·
zod 4 · react-hook-form · sonner · Lucide.

**Spec :** `HANDOFF.md` §5 (les huit trous) et §6 (ordre de travail). Ce plan les
remplace comme document d'exécution ; le HANDOFF reste la référence de contexte.

**Périmètre décidé le 24/08/2026 :** le produit entier, y compris les fonctionnalités
métier. Sans l'audit go-live (147 constats), qui n'existe sur aucune machine
accessible — un jalon lui est réservé (Phase 5).

---

## Contraintes globales

Elles s'appliquent à **chaque tâche**, sans être répétées.

- **TypeScript strict, aucun `any`.** Utiliser `unknown` puis narrower.
- **250 lignes maximum** par page et par section (`npm run prebuild` bloque au-delà,
  avertit à 150). Au-delà : extraire dans `src/components/sections/<page>/` ou
  `src/components/features/<domaine>/`.
- **Imports par alias `@/`** uniquement. Aucun `../../`.
- **Navigation i18n** : `Link`, `useRouter`, `redirect`, `getPathname` viennent de
  `@/i18n/navigation`, **jamais** de `next/*`. Sinon la locale retombe sur `/fr`.
- **`getPathname` inclut déjà `/{locale}`** — ne jamais re-préfixer.
- **Toute route publique nouvelle doit être ajoutée à `routing.pathnames`**
  (`src/i18n/routing.ts`), sinon elle est inatteignable en anglais et absente du
  sitemap.
- **`openGraph` d'une page REMPLACE celui du layout** (fusion superficielle) : une page
  qui définit `openGraph` redéclare son image.
- **`NEXT_PUBLIC_*` est inliné au build** : tout changement de variable exige un
  rebuild complet, pas un simple redéploiement de config.
- **Migrations** : écrites idempotentes, appliquées **à la main** dans le SQL Editor du
  dashboard Supabase. `supabase db push` échouerait (lire
  `supabase/migrations/README.md`).
- **Le dépôt est public.** Aucune clé, aucun mot de passe, aucun identifiant réel dans
  le code ou un document versionné. `SUPABASE_SERVICE_ROLE_KEY` et `BREVO_API_KEY` ne
  sortent jamais du serveur.
- **La vitrine ne casse jamais** : toute lecture serveur de la vitrine garde son repli
  sur le JSON statique (`src/lib/vitrine-data.ts`).
- **Brevo** pour l'email transactionnel — décision actée. Ne pas réintroduire Resend.
- **CETé ADN® et Vigi-Score®** sont des marques déposées : le ® est du contenu, pas
  de la décoration.
- **Admin en français**, vitrine et portail client bilingues via `messages/{fr,en}.json`.
- **Icônes Lucide exclusivement.**
- Vérification de fin de tâche, sauf mention contraire :
  `npx tsc --noEmit && npm run build`.

### Dépendances externes — à lancer maintenant, elles conditionnent des phases entières

| Dépendance | Bloque | Qui |
|---|---|---|
| Compte Brevo + domaine d'envoi validé (SPF/DKIM) | Phase 1.3, Phase 8 | Toi / le client |
| Informations légales de l'entité (raison sociale, SIREN, siège, directeur de publication, hébergeur, DPO) | Phase 2 | Le client seul |
| Autorisation écrite du témoignage client, ou décision de le retirer | Phase 3 | Le client seul |
| Accès DNS de `cete-notation.fr` | Phase 4 | Le client |
| Règles de calcul du Vigi-Score | Phase 9 | Le client seul — **rien n'existe nulle part** |

---

## Phase 0 — Assainir le terrain

Le dépôt contient du travail non commité et la base contient deux lignes de test.
Rien ne commence tant que ce n'est pas propre.

### Tâche 0.1 : Commiter la captation de leads

**Fichiers :**
- Modifier : `messages/fr.json`, `messages/en.json`
- Modifier : `src/components/sections/ContactForm.tsx`,
  `src/components/sections/EvaluationForm.tsx`,
  `src/components/sections/EvaluationFormFields.tsx`,
  `src/components/sections/contact/ContactFormFields.tsx`
- Créer : `src/app/actions/contact.ts` (déjà écrit, non commité)
- Créer : `scripts/verify-contact-requests.mjs`, `supabase/checks/contact_requests_check.sql`

- [ ] **Étape 1 : Scanner le diff pour des secrets**

```bash
git diff | grep -nE "API_KEY=|SECRET=|SERVICE_ROLE_KEY *=|BEGIN PRIVATE KEY|eyJ"
```
Attendu : aucune sortie.

- [ ] **Étape 2 : Vérifier que tout compile**

```bash
npx tsc --noEmit && npm run build
```
Attendu : exit 0.

- [ ] **Étape 3 : Commiter la fonctionnalité**

```bash
git add src/app/actions/contact.ts src/components/sections/ContactForm.tsx \
  src/components/sections/EvaluationForm.tsx src/components/sections/EvaluationFormFields.tsx \
  src/components/sections/contact/ContactFormFields.tsx messages/fr.json messages/en.json
git commit -m "feat(leads): branche les deux formulaires publics sur contact_requests"
```

- [ ] **Étape 4 : Commiter l'outillage de vérification, séparément**

```bash
git add scripts/verify-contact-requests.mjs supabase/checks/contact_requests_check.sql
git commit -m "chore(verif): sondes lecture seule pour contact_requests"
```

### Tâche 0.2 : Purger les lignes de test

**Fichiers :** aucun (opération en base).

- [ ] **Étape 1 : Supprimer les deux lignes, dans le SQL Editor Supabase**

```sql
delete from public.contact_requests
where email in ('test-claude@example.invalid', 'test-claude-contact@example.invalid');
```

- [ ] **Étape 2 : Confirmer**

```bash
node scripts/verify-contact-requests.mjs
```
Attendu : `0 demande(s) enregistrée(s)`.

### Tâche 0.3 : Réparer les sondes périmées

Les cinq `scripts/verify-*.mjs` existants lisent `../.env.local`, qui n'existe plus :
le projet utilise `.env`. Elles échouent toutes au démarrage.

**Fichiers :** Modifier `scripts/verify-admin-writes.mjs`, `verify-auth-rls.mjs`,
`verify-client-visibility.mjs`, `verify-publish-to-client.mjs`, `verify-storage.mjs`

- [ ] **Étape 1 : Confirmer la panne**

```bash
node scripts/verify-storage.mjs
```
Attendu : erreur `ENOENT ... .env.local`.

- [ ] **Étape 2 : Pointer les cinq scripts sur `.env`**

Dans chaque fichier, remplacer :
```js
readFileSync(new URL("../.env.local", import.meta.url), "utf8")
```
par :
```js
readFileSync(new URL("../.env", import.meta.url), "utf8")
```

- [ ] **Étape 3 : Vérifier que les cinq démarrent**

```bash
for f in scripts/verify-*.mjs; do echo "== $f"; node "$f" || echo "ECHEC $f"; done
```
Attendu : plus aucune erreur `ENOENT`. Un échec fonctionnel (RLS, identifiants de
démo absents) est une information à noter, pas un blocage de cette tâche.

- [ ] **Étape 4 : Commiter**

```bash
git add scripts/verify-*.mjs
git commit -m "fix(verif): les sondes lisent .env et non .env.local disparu"
```

---

## Phase 1 — Fermer le canal commercial

Aujourd'hui une demande est enregistrée, mais **personne n'est prévenu et personne ne
peut la lire**. Cette phase transforme une table invisible en canal commercial réel.

### Tâche 1.1 : Repo et types pour les demandes

**Fichiers :**
- Créer : `src/types/contact-request.ts`
- Créer : `src/lib/repo/contact-requests.repo.ts`
- Modifier : `src/types/index.ts` (barrel)

**Interfaces :**
- Consomme : `Tables<"contact_requests">` de `@/lib/supabase/database.types`
- Produit : `listContactRequests()`, `updateContactRequestStatus(id, status)`,
  `countNewContactRequests()`, types `ContactRequest`, `ContactRequestStatus`,
  `ContactRequestKind`, `EvaluationPayload`

- [ ] **Étape 1 : Créer le type métier**

`src/types/contact-request.ts` :
```ts
export type ContactRequestKind = "contact" | "evaluation";
export type ContactRequestStatus = "new" | "handled" | "archived";

/** Champs propres au formulaire d'évaluation, stockés en jsonb côté base. */
export interface EvaluationPayload {
  contactRole: string;
  siren: string | null;
  sector: string;
  employees: string;
  evaluationType: string;
  sites: string | null;
  details: string | null;
}

export interface ContactRequest {
  id: string;
  kind: ContactRequestKind;
  name: string;
  email: string;
  company: string;
  phone: string | null;
  subject: string | null;
  message: string | null;
  payload: EvaluationPayload | null;
  locale: string;
  status: ContactRequestStatus;
  emailSent: boolean;
  emailError: string | null;
  createdAt: string;
}
```

- [ ] **Étape 2 : Exporter depuis le barrel**

Ajouter dans `src/types/index.ts` :
```ts
export type {
  ContactRequest,
  ContactRequestKind,
  ContactRequestStatus,
  EvaluationPayload,
} from "./contact-request";
```

- [ ] **Étape 3 : Écrire le repo**

`src/lib/repo/contact-requests.repo.ts`. Il suit exactement le patron de
`resources.repo.ts` : client navigateur, mappage snake_case → camelCase, `RepoError`.
La RLS `contact_requests_admin_all` fait la serrure — inutile de refiltrer ici.

```ts
import { createClient } from "@/lib/supabase/client";
import { RepoError } from "@/types/repo-error";
import type { Tables } from "@/lib/supabase/database.types";
import type {
  ContactRequest,
  ContactRequestKind,
  ContactRequestStatus,
  EvaluationPayload,
} from "@/types/contact-request";

type Row = Tables<"contact_requests">;

/** Le jsonb est `unknown` côté types générés : on le narrow, jamais de `any`. */
function toPayload(raw: Row["payload"]): EvaluationPayload | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  const str = (v: unknown): string => (typeof v === "string" ? v : "");
  const nullable = (v: unknown): string | null => (typeof v === "string" && v ? v : null);
  return {
    contactRole: str(o.contactRole),
    siren: nullable(o.siren),
    sector: str(o.sector),
    employees: str(o.employees),
    evaluationType: str(o.evaluationType),
    sites: nullable(o.sites),
    details: nullable(o.details),
  };
}

function rowToRequest(r: Row): ContactRequest {
  return {
    id: r.id,
    kind: r.kind as ContactRequestKind,
    name: r.name,
    email: r.email,
    company: r.company,
    phone: r.phone,
    subject: r.subject,
    message: r.message,
    payload: r.kind === "evaluation" ? toPayload(r.payload) : null,
    locale: r.locale,
    status: r.status as ContactRequestStatus,
    emailSent: r.email_sent,
    emailError: r.email_error,
    createdAt: r.created_at,
  };
}

export async function listContactRequests(): Promise<ContactRequest[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new RepoError("Impossible de charger les demandes", "contact_requests", "list");
  return (data ?? []).map(rowToRequest);
}

export async function updateContactRequestStatus(
  id: string,
  status: ContactRequestStatus,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("contact_requests").update({ status }).eq("id", id);
  if (error) throw new RepoError("Impossible de changer le statut", "contact_requests", "update");
}

/** Pastille du menu et tuile du dashboard. */
export async function countNewContactRequests(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("contact_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");
  if (error) throw new RepoError("Impossible de compter les demandes", "contact_requests", "count");
  return count ?? 0;
}
```

- [ ] **Étape 4 : Vérifier**

```bash
npx tsc --noEmit
```
Attendu : exit 0. Si `r.payload` n'est pas typé comme attendu, corriger `toPayload`
plutôt que d'introduire un `any`.

- [ ] **Étape 5 : Commiter**

```bash
git add src/types/contact-request.ts src/types/index.ts src/lib/repo/contact-requests.repo.ts
git commit -m "feat(leads): repo et types pour contact_requests"
```

### Tâche 1.2 : Écran back-office « Demandes »

**Fichiers :**
- Créer : `src/app/[locale]/admin/demandes/page.tsx`
- Créer : `src/components/features/admin/demandes/ContactRequestTable.tsx`
- Créer : `src/components/features/admin/demandes/ContactRequestDetail.tsx`
- Modifier : `src/i18n/routing.ts` (ajouter `"/admin/demandes": "/admin/demandes"`)
- Modifier : `src/components/features/admin/AdminSidebar.tsx`

**Interfaces :**
- Consomme : `listContactRequests`, `updateContactRequestStatus` (Tâche 1.1)
- Produit : `<ContactRequestTable requests onSelect />`,
  `<ContactRequestDetail request open onOpenChange onStatusChange />`

- [ ] **Étape 1 : Déclarer la route**

Dans `src/i18n/routing.ts`, à la suite des autres entrées `/admin/*` :
```ts
    "/admin/demandes": "/admin/demandes",
```

- [ ] **Étape 2 : Ajouter l'entrée de menu**

Dans `src/components/features/admin/AdminSidebar.tsx`, importer `Inbox` depuis
`lucide-react`, puis dans le groupe `Opérationnel`, **en première position** (une
demande commerciale se traite avant tout le reste) :
```ts
      { label: "Demandes", href: "/admin/demandes", icon: Inbox },
```

- [ ] **Étape 3 : Écrire le tableau**

`ContactRequestTable.tsx` — composant de présentation pur, aucune requête. Utilise
`DataTable`/`DataThead`/`DataTh`/`DataTbody`/`DataTr`/`DataTd` de
`@/components/shared/data-table` et `StatusBadge` de `@/components/shared/status-badge`.
Colonnes : Date · Type · Société · Contact · Statut. La ligne entière est cliquable et
appelle `onSelect(request)`. Une demande `new` est mise en évidence par un point
`bg-admin-urgent` en tête de ligne.

- [ ] **Étape 4 : Écrire le détail**

`ContactRequestDetail.tsx` — `Dialog` de `@/components/ui/dialog`. Affiche tous les
champs ; pour une demande `evaluation`, déplie le `payload` (fonction, SIREN, secteur,
effectif, type, sites, précisions). Deux actions : « Marquer traitée » et « Archiver »,
qui appellent `onStatusChange(id, status)`. Un lien `mailto:` sur l'email du prospect,
pré-rempli avec l'objet `Votre demande auprès de CETé`.

- [ ] **Étape 5 : Écrire la page**

`page.tsx` — `"use client"`. Reprend le patron de
`src/app/[locale]/admin/organizations/page.tsx` : `useState` + `useCallback` + `useEffect`,
`AdminPageHeader`, `AdminEmptyState` si la liste est vide, `toast` sur erreur. Ajoute un
filtre par statut (`Toutes` / `Nouvelles` / `Traitées` / `Archivées`) en `useState` local.

- [ ] **Étape 6 : Vérifier la taille des fichiers**

```bash
npm run lint:lines
```
Attendu : aucun fichier au-dessus de 250 lignes. Si la page dépasse, sortir le filtre
dans `ContactRequestFilters.tsx`.

- [ ] **Étape 7 : Vérifier au navigateur**

```bash
npm run build && npm run start
```
Se connecter en admin, ouvrir `/fr/admin/demandes`. Envoyer une demande de test depuis
`/fr/contact` dans un autre onglet, recharger : elle apparaît. La marquer traitée, puis
`node scripts/verify-contact-requests.mjs` — le statut doit être `handled`.

- [ ] **Étape 8 : Purger la demande de test et commiter**

```sql
delete from public.contact_requests where email like '%@example.invalid';
```
```bash
git add src/app/\[locale\]/admin/demandes src/components/features/admin/demandes \
  src/i18n/routing.ts src/components/features/admin/AdminSidebar.tsx
git commit -m "feat(admin): ecran de suivi des demandes entrantes"
```

### Tâche 1.3 : Notification email via Brevo

**Prérequis externe :** compte Brevo créé, domaine d'envoi validé (SPF + DKIM), clé API
disponible. **Ne pas commencer sans.**

**Fichiers :**
- Créer : `src/lib/email/brevo.ts`
- Créer : `src/lib/email/contact-notification.ts`
- Modifier : `src/app/actions/contact.ts`
- Modifier : `.env.example`

**Interfaces :**
- Produit : `sendTransactionalEmail({to, subject, htmlContent, replyTo})` →
  `Promise<{ok: true} | {ok: false; error: string}>`
- Produit : `buildContactNotification(request)` → `{subject, htmlContent}`

- [ ] **Étape 1 : Déclarer les variables d'environnement**

Dans `.env.example` (versionné, donc **valeurs vides**) :
```
# Brevo — email transactionnel (serveur uniquement, ne jamais préfixer NEXT_PUBLIC_)
BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=
CONTACT_NOTIFICATION_TO=
```
Renseigner les vraies valeurs dans `.env` local, **non versionné**.

- [ ] **Étape 2 : Écrire le client Brevo**

`src/lib/email/brevo.ts`. API REST directe, aucune dépendance npm ajoutée (décision du
HANDOFF). Ne lève jamais : renvoie un résultat, car un email raté ne doit pas faire
échouer une demande déjà enregistrée.

Le paquet `server-only` n'est pas installé et n'est utilisé nulle part dans le projet :
la convention maison est un commentaire d'en-tête, comme dans `src/lib/vitrine-data.ts:19`.
Ne pas ajouter la dépendance pour ce seul fichier.

```ts
// Serveur uniquement : lit BREVO_API_KEY, qui ne doit jamais atteindre le navigateur.
// Importé exclusivement depuis des Server Actions (src/app/actions/).

interface SendArgs {
  to: string;
  subject: string;
  htmlContent: string;
  /** Adresse du prospect : permet de répondre directement depuis la boîte mail. */
  replyTo?: { email: string; name?: string };
}

export type SendResult = { ok: true } | { ok: false; error: string };

/**
 * Envoi transactionnel Brevo. Ne lève jamais d'exception : l'appelant décide quoi
 * faire de l'échec. La demande est déjà en base — l'email est un confort, pas la
 * source de vérité.
 */
export async function sendTransactionalEmail(args: SendArgs): Promise<SendResult> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!apiKey || !senderEmail) return { ok: false, error: "Brevo non configuré" };

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: process.env.BREVO_SENDER_NAME || "CETé" },
        to: [{ email: args.to }],
        subject: args.subject,
        htmlContent: args.htmlContent,
        ...(args.replyTo ? { replyTo: args.replyTo } : {}),
      }),
      // Un Brevo lent ne doit pas faire traîner la réponse au prospect.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `HTTP ${res.status} ${body.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "échec réseau" };
  }
}
```

- [ ] **Étape 3 : Écrire le gabarit**

`src/lib/email/contact-notification.ts` — fonction pure, sans I/O, qui prend les champs
déjà validés par zod et rend un HTML simple (tableau de définitions). Elle échappe le
contenu utilisateur avant interpolation :

```ts
const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
```

Sujet : `[CETé] Nouvelle demande d'évaluation — {company}` ou
`[CETé] Nouveau message — {company}`.

- [ ] **Étape 4 : Brancher dans la Server Action**

Dans `src/app/actions/contact.ts`, après l'insertion réussie. Points d'attention :
- récupérer l'`id` inséré (`.insert(row).select("id").single()`) pour pouvoir
  mettre à jour `email_sent` / `email_error` ;
- **ne jamais** faire échouer l'action si l'email échoue : on écrit l'erreur dans
  `email_error` et on renvoie quand même `{ ok: true }` ;
- `replyTo` = l'email du prospect.

```ts
const notif = buildContactNotification(data);
const sent = await sendTransactionalEmail({
  to: process.env.CONTACT_NOTIFICATION_TO ?? "",
  subject: notif.subject,
  htmlContent: notif.htmlContent,
  replyTo: { email: data.email, name: data.name },
});
// L'email est un confort ; la ligne en base est la preuve. Un échec se trace,
// il ne se propage pas jusqu'au prospect.
await supabase
  .from("contact_requests")
  .update(sent.ok ? { email_sent: true } : { email_error: sent.error.slice(0, 2000) })
  .eq("id", inserted.id);
```

- [ ] **Étape 5 : Tester l'envoi réel**

```bash
npm run build && npm run start
```
Envoyer une demande depuis `/fr/contact`. Vérifier : (a) l'email arrive à
`CONTACT_NOTIFICATION_TO`, (b) `node scripts/verify-contact-requests.mjs` montre la
ligne, (c) dans le SQL Editor, `email_sent = true` et `email_error is null`.

- [ ] **Étape 6 : Tester le chemin d'échec**

Mettre temporairement `BREVO_API_KEY` à une valeur invalide, relancer, renvoyer une
demande. Attendu : le prospect voit toujours le toast de succès, la ligne est en base,
`email_sent = false` et `email_error` est renseigné. **C'est le comportement voulu :
une panne d'email ne perd jamais un lead.** Restaurer la clé.

- [ ] **Étape 7 : Afficher l'échec dans le back-office**

Dans `ContactRequestTable.tsx`, si `emailSent === false && emailError !== null`,
afficher une icône `MailWarning` avec un `title` portant l'erreur. Sans ça, l'échec
reste invisible.

- [ ] **Étape 8 : Purger et commiter**

```bash
git add src/lib/email src/app/actions/contact.ts .env.example \
  src/components/features/admin/demandes/ContactRequestTable.tsx
git commit -m "feat(leads): notification Brevo a chaque demande, echec trace sans perte"
```

---

## Phase 2 — Conformité légale

`/legal` et `/privacy` sont liés dans le pied de page de **toutes** les pages
(`src/data/mocks/{fr,en}/navigation.json:11-12`) et renvoient **404**. C'est le défaut
le plus visible du site et un manquement réglementaire (mentions légales obligatoires,
information RGPD).

Le contenu dépend du client. On code la structure maintenant ; il ne restera qu'à
verser le texte.

### Tâche 2.1 : Réclamer les informations manquantes

**Fichiers :** Créer `docs/informations-legales-a-fournir.md`

- [ ] **Étape 1 : Écrire la demande, précise et fermée**

Le document liste exactement, sans jargon : raison sociale et forme juridique ·
capital social · SIREN/SIRET · numéro de TVA intracommunautaire · adresse du siège ·
téléphone · directeur de la publication (nom, qualité) · hébergeur (nom, adresse,
téléphone) · éventuel numéro RCS et ville d'immatriculation · assurance RC
professionnelle · pour le RGPD : responsable de traitement, DPO ou contact
« données personnelles », durée de conservation des demandes de contact, sous-traitants
(Supabase, Brevo, hébergeur, outil de mesure) et pays d'hébergement.

- [ ] **Étape 2 : Trancher la durée de conservation**

La migration `20260821000002_contact_requests.sql` le note explicitement : aucune purge
automatique n'est posée, **c'est une décision métier**. Obtenir une durée (proposition
par défaut : 3 ans après le dernier contact, usage commercial courant).

- [ ] **Étape 3 : Commiter**

```bash
git add docs/informations-legales-a-fournir.md
git commit -m "docs(legal): liste fermee des informations a obtenir du client"
```

### Tâche 2.2 : Les deux pages

**Fichiers :**
- Créer : `src/app/[locale]/(public)/legal/page.tsx`
- Créer : `src/app/[locale]/(public)/privacy/page.tsx`
- Modifier : `src/i18n/routing.ts`
- Modifier : `src/app/sitemap.ts`

- [ ] **Étape 1 : Déclarer les routes traduites**

Dans `src/i18n/routing.ts`, à côté de `/cgu` :
```ts
    "/legal": {
      fr: "/mentions-legales",
      en: "/legal-notice",
    },
    "/privacy": {
      fr: "/politique-de-confidentialite",
      en: "/privacy-policy",
    },
```

- [ ] **Étape 2 : Corriger les liens du pied de page**

Dans `src/data/mocks/fr/navigation.json` et `src/data/mocks/en/navigation.json`, les
`href` restent `/legal` et `/privacy` : ce sont les clés internes, et `Link` de
`@/i18n/navigation` les traduit. **Vérifier** qu'aucun lien n'écrit l'URL traduite en
dur.

- [ ] **Étape 3 : Écrire les pages**

Calquer `src/app/[locale]/(public)/cgu/page.tsx` : `generateMetadata` avec
`buildAlternates(locale, "/legal")` et `buildOpenGraph(locale, "/legal")`, puis le
corps en `prose`. Structure des mentions légales : Éditeur · Directeur de la
publication · Hébergeur · Propriété intellectuelle (le référentiel CETé ADN® et le
Vigi-Score® sont des marques déposées) · Limitation de responsabilité · Droit
applicable. Structure de la politique de confidentialité : Responsable de traitement ·
Données collectées (**le formulaire de contact : nom, email, société, téléphone, IP,
user-agent** — cohérent avec ce que `contact_requests` stocke réellement) · Finalité ·
Base légale · Destinataires et sous-traitants · Durée de conservation · Droits (accès,
rectification, effacement, opposition) et comment les exercer · Cookies.

> Tant que le client n'a pas répondu, écrire les titres et les paragraphes de structure,
> et marquer chaque valeur manquante par `[[À FOURNIR : raison sociale]]`. Ces marqueurs
> sont volontairement laids pour être impossibles à publier par inadvertance —
> l'étape 5 les interdit en production.

- [ ] **Étape 4 : Ajouter au sitemap**

Dans `src/app/sitemap.ts`, ajouter `"/legal"` et `"/privacy"` à la liste des chemins
statiques, après `"/cgu"`.

- [ ] **Étape 5 : Poser un garde-fou de publication**

Ajouter à `scripts/lint-lines.js`, ou dans un nouveau `scripts/lint-placeholders.js`
appelé par `prebuild`, un contrôle qui échoue si `[[À FOURNIR` apparaît dans `src/`
**et** que `NODE_ENV === "production"` avec `NEXT_PUBLIC_SITE_URL` pointant sur le
domaine réel. Objectif : impossible de mettre en ligne des mentions légales à trous.

- [ ] **Étape 6 : Vérifier les quatre URLs**

```bash
npm run build && npm run start
```
Vérifier `200` sur `/fr/mentions-legales`, `/en/legal-notice`,
`/fr/politique-de-confidentialite`, `/en/privacy-policy`, et que le pied de page ne
produit plus de 404 sur aucune page. Vérifier le `hreflang` dans le HTML des quatre.

- [ ] **Étape 7 : Commiter**

```bash
git add src/app/\[locale\]/\(public\)/legal src/app/\[locale\]/\(public\)/privacy \
  src/i18n/routing.ts src/app/sitemap.ts scripts/
git commit -m "feat(legal): pages mentions legales et confidentialite, bilingues"
```

---

## Phase 3 — Assainir les contenus non sourcés

Le site affiche aujourd'hui, comme des faits, des éléments qui n'existent nulle part
dans les données du projet. C'est un risque juridique (pratique commerciale trompeuse)
autant qu'un risque de réputation.

### Tâche 3.1 : Le témoignage client

`messages/fr.json:117-135` et son équivalent anglais portent, sous un badge
« Témoignage client » : **Marie Dubois**, **Directrice QSE**, **Électricité
Industrielle SA**, un passage **BBB → AAA** en **14 mois** et une **réduction de 40 %
des incidents électriques**. Rendu par
`src/components/sections/home/HomeTestimonials.tsx`, monté en page d'accueil
(`src/app/[locale]/(public)/page.tsx:55`).

- [ ] **Étape 1 : Obtenir la décision du client** — l'une des trois :
  1. témoignage réel, avec autorisation écrite → remplacer les valeurs ;
  2. anonymiser (« un exploitant industriel de 400 salariés ») → retirer nom, société
     et le badge « Témoignage client », qui devient trompeur sur une anonymisation ;
  3. retirer la section.

- [ ] **Étape 2 : Appliquer**

Si retrait : supprimer `<HomeTestimonials />` de
`src/app/[locale]/(public)/page.tsx:55`, l'import ligne 10, le fichier
`HomeTestimonials.tsx`, et le bloc `testimonials` des deux fichiers de messages.
**Ne pas laisser de composant orphelin** : un code à moitié retiré finit par être
remonté par erreur.

- [ ] **Étape 3 : Vérifier et commiter**

```bash
npx tsc --noEmit && npm run build
git commit -am "fix(contenu): retire le temoignage client non source de la page d'accueil"
```

### Tâche 3.2 : Les chiffres invérifiables

- [ ] **Étape 1 : Recenser**

```bash
grep -rnE "[0-9]+ ?(\+|%|ans|organisations|clients|sites)" messages/fr.json src/data/mocks/fr | head -40
```
Attendu : au minimum `messages/fr.json` → `founders.bullet4` (« 200+ organisations
évaluées en 20 ans ») et `founders.heading` (« 80 ans d'expertise cumulée »).

- [ ] **Étape 2 : Pour chaque chiffre, une source ou une reformulation**

Soit le client fournit la source, soit la formulation devient non chiffrée
(« plusieurs décennies d'expérience cumulée »). Appliquer aux **deux** fichiers de
messages : un chiffre corrigé en français et laissé en anglais est le pire des cas.

- [ ] **Étape 3 : Vérifier la symétrie FR/EN**

```bash
node -e "const fr=require('./messages/fr.json'),en=require('./messages/en.json');const walk=(a,b,p='')=>{for(const k of Object.keys(a)){const q=p?p+'.'+k:k;if(!(k in b))console.log('manque en EN:',q);else if(typeof a[k]==='object')walk(a[k],b[k],q)}};walk(fr,en)"
```
Attendu : aucune sortie.

- [ ] **Étape 4 : Commiter**

```bash
git commit -am "fix(contenu): chiffres sources ou reformules, FR et EN"
```

---

## Phase 4 — Mise en ligne

### Tâche 4.1 : Mesure d'audience et supervision d'erreurs

**Faire cette tâche AVANT la mise en ligne**, pas après : le premier jour de trafic est
le seul qu'on ne peut pas rejouer.

**Fichiers :**
- Modifier : `src/app/[locale]/layout.tsx`
- Créer : `src/instrumentation.ts` (Sentry serveur)
- Modifier : `.env.example`, `package.json`

- [ ] **Étape 1 : Choisir Plausible plutôt que Google Analytics**

Raison : sans cookie, il n'exige **pas** de bandeau de consentement. Une bannière de
cookies dégrade la conversion et alourdit la Phase 2. Décision à valider par le client
(Plausible est payant, ~9 €/mois) — sinon repli sur Umami auto-hébergé.

- [ ] **Étape 2 : Poser le script**

Dans `src/app/[locale]/layout.tsx`, avec `next/script` et `strategy="afterInteractive"`,
conditionné à `process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — pour qu'aucune mesure ne
parte en développement.

- [ ] **Étape 3 : Poser un objectif de conversion**

Dans `src/components/sections/ContactForm.tsx` et `EvaluationForm.tsx`, après un
`result.ok` confirmé **uniquement**, déclencher l'événement Plausible
`Demande envoyée` avec la propriété `kind`. Mesurer l'intention plutôt que le succès
réel fausserait le taux de conversion.

- [ ] **Étape 4 : Installer Sentry**

```bash
npm install @sentry/nextjs
```
Configurer avec `tracesSampleRate: 0.1` et surtout `sendDefaultPii: false` — le site
traite des données de prospects, elles n'ont rien à faire dans un outil de supervision.

- [ ] **Étape 5 : Vérifier**

Build, démarrer, envoyer une demande : l'événement apparaît dans Plausible. Provoquer
une erreur serveur volontaire sur une route de test : elle apparaît dans Sentry.
Retirer la route de test.

- [ ] **Étape 6 : Commiter**

```bash
git add -A && git commit -m "feat(mesure): Plausible sans cookie et Sentry cote serveur"
```

### Tâche 4.2 : Déploiement

- [ ] **Étape 1 : Renseigner les variables sur l'hébergeur**

`NEXT_PUBLIC_SITE_URL=https://cete-notation.fr`, `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `BREVO_API_KEY`,
`BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`, `CONTACT_NOTIFICATION_TO`,
`NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, les clés Sentry.

- [ ] **Étape 2 : DNS**

Pointer `cete-notation.fr` et `www` vers l'hébergeur. Vérifier que **l'un redirige vers
l'autre** en 301 : deux domaines qui répondent en 200 dupliquent tout le SEO.

- [ ] **Étape 3 : Rebuild complet**

`NEXT_PUBLIC_*` est inliné au build. Un simple redéploiement sans rebuild laisserait
les canonicals sur l'ancien domaine. **Forcer un build neuf, cache vidé.**

- [ ] **Étape 4 : Vérifier le SEO sur le domaine réel**

```bash
curl -s https://cete-notation.fr/sitemap.xml | head -40
curl -s https://cete-notation.fr/fr | grep -oE '<link rel="(canonical|alternate)"[^>]*>'
curl -s https://cete-notation.fr/robots.txt
```
Attendu : toutes les URLs en `https://cete-notation.fr`, aucune trace de
`localhost` ni de l'URL de préproduction, hreflang complet FR/EN/x-default, et
`/legal` + `/privacy` présents au sitemap.

- [ ] **Étape 5 : Vérifier le canal commercial en production**

Envoyer une vraie demande depuis le site en ligne. Vérifier l'email reçu, la ligne en
base, `email_sent = true`, l'apparition dans `/admin/demandes` et l'événement dans
Plausible. **Puis supprimer la ligne de test.**

- [ ] **Étape 6 : Marquer le jalon**

```bash
git tag -a v1.0-go-live -m "Mise en ligne cete-notation.fr"
```

---

## Phase 5 — Jalon : intégrer l'audit go-live

L'audit (147 constats : 8 bloquants, 58 majeurs, 81 mineurs) et son plan de correction
existent hors dépôt. Ils ne sont sur aucune machine accessible aujourd'hui —
`docs/go-live-audit.md` et `docs/go-live-plan.md` sont listés dans `.gitignore` mais
absents du disque.

- [ ] **Étape 1 : Récupérer le document** auprès de qui le détient.
- [ ] **Étape 2 : Traiter les 8 bloquants avant tout le reste.** S'ils touchent la
  sécurité, ils passent **devant la Phase 4** — dans ce cas, ne pas mettre en ligne
  tant qu'ils ne sont pas corrigés.
- [ ] **Étape 3 : Convertir les 58 majeurs en tâches** dans ce fichier, à la suite.
- [ ] **Étape 4 : Arbitrer les 81 mineurs** — probablement à ne pas traiter tous.

---

## Phase 6 — Socle de tests

Aucun test n'existe. Les phases 7 à 10 construisent des fonctionnalités métier, dont un
**calcul de notation** : écrire un algorithme de notation sans tests serait une faute.
Cette phase est donc un prérequis, pas une finition.

### Tâche 6.1 : Vitest pour la logique pure

- [ ] **Étape 1 : Installer**

```bash
npm install -D vitest @vitejs/plugin-react vite-tsconfig-paths
```

- [ ] **Étape 2 : Configurer**

`vitest.config.ts` avec `vite-tsconfig-paths` pour que l'alias `@/` fonctionne, et
`environment: "node"` par défaut.

- [ ] **Étape 3 : Ajouter les scripts**

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Étape 4 : Écrire le premier test — sur du code existant et à risque**

`src/lib/email/contact-notification.test.ts` : vérifier que l'échappement HTML
neutralise bien une injection. C'est un test qui a une vraie valeur, pas un test de
démonstration.

```ts
import { describe, expect, it } from "vitest";
import { buildContactNotification } from "./contact-notification";

describe("buildContactNotification", () => {
  it("échappe le HTML injecté dans un champ libre", () => {
    const { htmlContent } = buildContactNotification({
      kind: "contact",
      name: '<img src=x onerror="alert(1)">',
      email: "a@b.fr",
      company: "ACME",
      subject: "autre",
      message: "bonjour",
      locale: "fr",
    });
    expect(htmlContent).not.toContain("<img");
    expect(htmlContent).toContain("&lt;img");
  });
});
```

- [ ] **Étape 5 : Vérifier qu'il échoue puis passe**

```bash
npm test
```
S'il passe du premier coup, retirer temporairement l'échappement pour vérifier que le
test le détecte — un test qui ne peut pas échouer ne teste rien.

- [ ] **Étape 6 : Couvrir le schéma zod de la Server Action**

`src/app/actions/contact.test.ts` : le pot de miel rempli n'écrit rien ; un email
invalide est refusé ; une locale inventée (`"de"`) retombe sur `fr` ; un message de
6 000 caractères est refusé.

- [ ] **Étape 7 : Commiter**

```bash
git add -A && git commit -m "test: socle Vitest et premiers tests sur la captation de leads"
```

### Tâche 6.2 : Playwright pour les trois parcours critiques

- [ ] **Étape 1 : Installer** `npm install -D @playwright/test && npx playwright install chromium`
- [ ] **Étape 2 : Écrire trois tests de bout en bout** : (a) envoyer une demande
  d'évaluation → toast de succès, (b) se connecter en admin → la demande apparaît dans
  `/admin/demandes`, (c) le pied de page → `/legal` et `/privacy` répondent en 200.
- [ ] **Étape 3 : Isoler la base de test.** Ces tests écrivent. Utiliser un projet
  Supabase de préproduction, **jamais la base de production**. Si aucun projet de
  préproduction n'existe, le créer est un prérequis de cette tâche.
- [ ] **Étape 4 : Commiter.**

---

## Phase 7 — Notifications

Les tables `notifications` et `notification_reads` existent, RLS comprise
(`supabase/migrations/20260529000001_init_schema.sql:193-213`,
`20260529000002_rls_policies.sql:77-93`). Côté code : rien, sauf les types générés.

Schéma existant : `type` ∈ (`veille`, `document`, `info`) · `message` · `date` ·
`visibility` ∈ (`global`, `assigned`) · `assigned_client_ids uuid[]`.
`notification_reads` porte la paire (notification, utilisateur) avec `read_at`.

### Tâche 7.1 : Repo

**Fichiers :** Créer `src/lib/repo/notifications.repo.ts`, `src/types/notification.ts`

- [ ] `listNotificationsForCurrentUser()` — la RLS filtre déjà global/assigné ; jointure
  avec `notification_reads` pour calculer `isRead`.
- [ ] `markAsRead(notificationId)` — insert dans `notification_reads`, idempotent via
  `upsert` (la clé primaire est la paire).
- [ ] `markAllAsRead()`.
- [ ] `listAllNotifications()` / `createNotification()` / `deleteNotification()` — côté admin.
- [ ] Tests Vitest sur le mappage `isRead`.

### Tâche 7.2 : Cloche dans le portail client

- [ ] Composant `src/components/features/client/NotificationBell.tsx` : icône `Bell`,
  pastille de compte non lus, `Popover` listant les 10 dernières.
- [ ] Marquer lu à l'ouverture d'une notification, pas à l'ouverture du popover.
- [ ] Bilingue via `messages/{fr,en}.json`, clé `client.notifications`.

### Tâche 7.3 : Écran admin de diffusion

- [ ] `src/app/[locale]/admin/notifications/page.tsx` + route dans `routing.ts` + entrée
  de menu. Créer une notification, choisir `global` ou une sélection de clients,
  historique des envois.

### Tâche 7.4 : Déclencheurs automatiques

- [ ] À la publication d'un document vers un client (`documents.repo.ts`) et à
  l'émission d'un certificat, créer une notification `document` assignée à ce client.
  C'est ce qui rend la fonctionnalité vivante plutôt que décorative.

---

## Phase 8 — Newsletter

Aujourd'hui `src/components/sections/blog/BlogCTA.tsx` affiche « S'inscrire à la
newsletter » sur un bouton qui **renvoie vers `/contact`**. Aucun champ email n'existe.

- [ ] **Tâche 8.1** — Créer la liste de contacts dans Brevo et récupérer son ID.
- [ ] **Tâche 8.2** — Server Action `src/app/actions/newsletter.ts` : zod (email +
  consentement explicite + pot de miel), écriture dans une table
  `newsletter_subscribers` (migration idempotente, même politique RLS que
  `contact_requests` : écriture service-role uniquement), puis appel Brevo
  `POST /v3/contacts`. **La base d'abord, Brevo ensuite** — même principe qu'en
  Phase 1 : un abonné n'est jamais perdu par une panne d'API.
- [ ] **Tâche 8.3** — Remplacer le bouton par un vrai champ email inline dans
  `BlogCTA.tsx`, avec case de consentement et lien vers `/privacy`. Le RGPD exige un
  consentement spécifique : pas de case pré-cochée, pas de consentement implicite.
- [ ] **Tâche 8.4** — Lien de désinscription. Obligatoire. Brevo le gère nativement,
  **vérifier qu'il est bien présent dans les envois.**
- [ ] **Tâche 8.5** — Tests Vitest sur le schéma, test Playwright sur l'inscription.

---

## Phase 9 — Calcul du Vigi-Score

**C'est le cœur de la promesse commerciale, et il n'existe pas.**

État vérifié : dans `src/components/features/admin/clients/CompleteEvaluationDialog.tsx`,
`vigiScore` est un choix manuel parmi A/B/C/D (ligne 33) et les trois sous-notes O-M-T
sont des champs libres. La seule mécanique existante est
`CertificateFormDialog.tsx:75`, qui concatène l'initiale des trois sous-critères pour
former la note composite. Aujourd'hui, **un expert saisit une note qu'il a établie hors
application.**

Aucune règle de calcul n'existe dans le dépôt : ni dans `docs/PRD.md`, ni dans les
migrations, ni dans les messages.

### Tâche 9.1 : Obtenir la méthode — bloquant absolu

- [ ] **Étape 1 : Poser au client les questions fermées suivantes**, et n'écrire
  aucune ligne de code avant d'avoir les réponses :
  1. Quels critères entrent dans chacune des trois notes O, M et T ?
  2. Chaque critère est-il noté sur une échelle (0-100 ? A-D ?) et avec quelle
     pondération ?
  3. Comment les trois sous-notes produisent-elles le Vigi-Score global — moyenne
     pondérée, plus mauvaise des trois, matrice ?
  4. Existe-t-il des critères éliminatoires (un manquement qui plafonne la note quelle
     que soit la moyenne) ?
  5. Où sont les seuils entre AAA, AA, A, BBB… DDD ?
  6. Une note se périme-t-elle, et au bout de combien de temps ?

- [ ] **Étape 2 : Écrire la méthode dans `docs/methode-vigi-score.md`**, validée par
  écrit par le client. Ce document devient la spec de la tâche 9.2. **Sans lui, la
  Phase 9 s'arrête ici** — et c'est un arrêt légitime, pas un échec : inventer un
  barème de notation à la place d'une agence de notation serait la pire issue possible.

### Tâche 9.2 : Implémenter, en TDD strict

- [ ] `src/lib/rating/vigi-score.ts` — **fonction pure**, sans I/O, sans Supabase.
- [ ] Écrire les tests **avant** le code, un par règle de `docs/methode-vigi-score.md`,
  y compris les cas limites : critère éliminatoire, note exactement sur un seuil,
  critère non renseigné.
- [ ] Brancher dans `CompleteEvaluationDialog` : les sous-notes deviennent des saisies
  structurées, le Vigi-Score devient **calculé et non modifiable**, affiché en direct.
- [ ] Conserver la possibilité d'une **surcharge manuelle documentée** (champ
  « justification de la dérogation », obligatoire si la note affichée diffère du
  calcul). Un expert doit pouvoir corriger la machine ; il doit dire pourquoi.
- [ ] Migration : colonnes `score_details jsonb`, `score_computed text`,
  `score_override_reason text` sur `evaluations`. Idempotente.

---

## Phase 10 — Benchmark sectoriel

Promis dans l'offre Vigi-Score, jamais implémenté.

- [ ] **Tâche 10.1 — Trancher le seuil d'anonymat.** Publier « votre secteur : moyenne
  BBB » sur un secteur qui ne compte que deux clients revient à divulguer la note du
  concurrent. Fixer un minimum (proposition : pas de statistique sous 5 organisations
  évaluées dans le secteur) et le documenter.
- [ ] **Tâche 10.2** — Vue SQL agrégée `sector_benchmarks` (moyenne, médiane,
  répartition), respectant le seuil, exposée en lecture aux clients concernés.
- [ ] **Tâche 10.3** — Section dans le portail client : position du client dans son
  secteur, sans jamais nommer une autre organisation.
- [ ] **Tâche 10.4** — Tests sur la fonction d'agrégation, dont le cas « sous le seuil ».

---

## Phase 11 — Dette et performance

À traiter une fois le produit complet, par valeur décroissante.

- [ ] **Tâche 11.1** — Réduire le `"use client"` : plusieurs pages admin sont
  entièrement clientes alors que la lecture initiale pourrait être servie au serveur.
- [ ] **Tâche 11.2** — ISR sur les pages publiques (le sitemap est déjà en ISR).
- [ ] **Tâche 11.3** — Purge RGPD des `contact_requests` selon la durée décidée en
  Tâche 2.1, via `pg_cron`.
- [ ] **Tâche 11.4** — Publier les brouillons du blog qui attendent en base, dont deux
  articles de fond rédigés fin juillet 2026, jamais relus.
- [ ] **Tâche 11.5** — Remettre `next dev` en état sur la machine de développement :
  Turbopack échoue à lancer son processus compagnon PostCSS
  (`0xc0000142`, STATUS_DLL_INIT_FAILED). Piste : trop de processus node simultanés.
  Contournement actuel : travailler sur `npm run build && npm run start`.
- [ ] **Tâche 11.6** — Migrer `src/middleware.ts` vers la convention `proxy.ts`
  (Next 16 le signale comme déprécié à chaque démarrage).

---

## Ordre recommandé et jalons

```
Phase 0  ──▶ Phase 1  ──▶ Phase 2  ──▶ Phase 3  ──▶ Phase 4  ──▶ ★ GO-LIVE
(propre)     (leads)      (légal)      (contenu)    (en ligne)
                                                          │
        ┌─────────────────────────────────────────────────┘
        ▼
     Phase 5 ──▶ Phase 6 ──▶ Phase 7 ──▶ Phase 8 ──▶ Phase 9 ──▶ Phase 10 ──▶ Phase 11
     (audit)     (tests)     (notifs)    (newsltr)   (score)     (benchmark)   (dette)
```

**Le chemin critique n'est pas le code.** Les phases 2, 3 et 9 sont bloquées par des
informations que seul le client peut fournir. Réclamer les trois **maintenant**, en
parallèle de la Phase 1, sinon le développement rattrapera l'attente et s'arrêtera.

**Réordonnancement conditionnel :** si l'audit récupéré en Phase 5 contient des
bloquants de sécurité, la Phase 5 passe **avant** la Phase 4 et rien ne va en ligne
avant leur correction.
