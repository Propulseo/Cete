# Brief de refonte — Interface admin CETé

> **Phase 0 — Audit & brief design.** Document de cadrage uniquement, aucun code écrit.
> Objectif : faire passer l'admin d'un look « template SaaS / shadcn par défaut » à
> l'identité d'une **agence de notation institutionnelle moderne** — Moody's / S&P Global
> rencontre Linear / Mercury. Sobre, expert, autorité métier perçue dès l'ouverture.
>
> Méthode : audit du code réel (tokens, composants, données) + génération de **3 directions
> visuelles distinctes** + **critique adversariale** (conformité tokens, accessibilité AA,
> fidélité au vrai système de notation, risque de généricité). Le présent brief en est la synthèse.
>
> **Périmètre : `/admin/*` uniquement.** Le site public et l'espace `/client/*` ne sont pas touchés.

---

## 1. Inventaire des assets disponibles

### 1.1 Logo CETé — ⚠️ écart vs hypothèse du prompt

| Attendu (prompt) | Réalité du repo |
|---|---|
| Logo SVG dans `/public`, variantes compacte/horizontale/monogramme | **Aucun SVG CETé.** Un seul asset : `public/assets/brand/logo-cete-adn.png` (PNG horizontal). |

- Les SVG présents dans `/public` (`file.svg`, `vercel.svg`, `globe.svg`, `next.svg`, `window.svg`)
  sont les **défauts d'échafaudage Next.js**, sans rapport avec la marque.
- Le **site public** affiche ce PNG dans le Header (`src/components/common/Header.tsx`) via
  `<Image src="/assets/brand/logo-cete-adn.png" height={48} width={200}>` (rendu `h-16`/`h-20`).
- La **sidebar admin n'utilise PAS de logo** aujourd'hui : juste une icône Lucide `Zap` dans un
  carré `bg-white/10` + le texte « CETé Admin » (composant `BrandName`).

→ **Conséquence :** « intégrer le logo SVG dans la sidebar » n'est pas réalisable tel quel.
Voir l'**Arbitrage E** (lockup SVG inline reconstruit vs PNG existant).

### 1.2 Couleurs déjà définies (`src/app/globals.css`)

Tailwind v4, déclarations dans `@theme inline` + `:root` (pas de `tailwind.config`).

| Rôle | Token / valeur |
|---|---|
| Primaire (sky blue) | `#4DA6D9` · deep `#1A7AB5` · ultra `#0D5A8A` · light `#87C4E8` |
| Accent (orange TST) | `#E8630A` · light `#F59542` · dark `#B84D08` |
| Texte | `#1A2940` (primaire) · `#4A6580` (secondaire) · `#8AA5BE` (muted) |
| Surfaces | bg `#FFFFFF` · soft `#F4F9FD` · gradient-start `#DAEEF8` |
| Bordure / input | `#DAEEF8` |
| **Vigi-Score (existants)** | `--color-vigi-a #22C55E` · `-b #A3E635` · `-c #F97316` · `-d #EF4444` |
| Sidebar (tokens) | `--sidebar #1A2940` (navy) … **mais voir audit § 2.1 : tokens morts** |
| Radius | `--radius 0.625rem` |
| Dark mode | bloc `.dark` complet déjà présent (jamais activé en admin) |

### 1.3 Fonts chargées

- **Inter** (sans, `--font-inter`) et **Merriweather** (display serif, `--font-merriweather`),
  via `next/font/google` dans `src/app/[locale]/layout.tsx`.
- Merriweather est la serif du **site public**. L'admin pourra introduire une serif display
  différente, **scopée admin uniquement**, pour ne pas alourdir le site public ni toucher Merriweather.
- `next-themes` est installé (aucun toggle dark admin câblé).

### 1.4 Composants shadcn présents (`src/components/ui/`)

`badge` · `button` · `card` · `dialog` · `form` · `input` · `label` · `navigation-menu` ·
`separator` · `sheet` · `sonner` · `textarea` · `brand-name` · `video-embed`.

- **Aucun `table.tsx`** : les tableaux sont écrits à la main en `<table>` natif
  (ex. `ClientsTable.tsx`). Le futur `AdminTable` (Phase 3) sera donc du net-neuf.
- `Card` de base : `rounded-xl border py-6 shadow-sm gap-6` → **chaque carte a une bordure
  bleutée `#DAEEF8` visible + une ombre** : c'est le « card containers partout » que vous voulez casser.
- `Button` / `Badge` : variantes CVA standard, `primary` = sky blue.

### 1.5 Système de notation réel — ⚠️ écart vs hypothèse du prompt

Le prompt évoque une échelle « AAA vert → C rouge » et un « Rating moyen BB+ » (style S&P).
**Ce n'est pas le système CETé.** Source de vérité dans le code :

- **`src/lib/constants.ts` → `VIGI_SCORE_LEVELS`** : Vigi-Score = **4 niveaux A / B / C / D**.
  - **A** `#22C55E` — « Conforme - vigilance forte »
  - **B** `#A3E635` — « Des progrès sont attendus »
  - **C** `#F97316` — « Alerte »
  - **D** `#EF4444` — « Non conforme - risque critique »
  - (`ADN_LEVELS` à 7 crans AAA/BBB/CCC/DDD est **`@deprecated`** — ne pas s'en servir.)
- **`THREE_C_CRITERIA`** (les 3 C de la vigilance, libellés canoniques) :
  **Auto-évaluation** · **Recommandation & Amélioration** · **Gestes Métiers**.
- **`src/types/client.ts` + `evaluations.json`** : chaque évaluation porte
  - `vigiScore` : lettre **A/B/C/D**,
  - `omtScore` : 3 sous-dimensions notées avec modificateurs **+/-** (ex. `"B+"`, `"A-"`),
  - `compositeRating` : code **triple-lettre** (ex. **`"AAA"`**, **`"BAB"`**, **`"CCB"`**).
- Le **« Rating moyen : BB+ »** du dashboard est un **placeholder factice hardcodé**
  dans `src/lib/repo/stats.repo.ts:53` (`value: "BB+"`). Il ne correspond à aucune donnée réelle.

> ⚠️ Note de cohérence données : les clés de `omtScore`
> (`autoEvaluation` / `maitriseExigences` / `maitriseOperationnelle`) ne sont **pas alignées**
> avec les `id` de `THREE_C_CRITERIA` (`autoEvaluation` / `recommandation` / `gestesMetiers`).
> Le futur `RatingBadge`/composite devra mapper proprement les 3 cellules sur les libellés
> canoniques. (Détail d'implémentation Phase 3 — signalé ici, non corrigé en Phase 0.)

---

## 2. Audit du design admin actuel

### 2.1 Layout & sidebar (`src/app/[locale]/admin/layout.tsx`)

- Sidebar `fixed w-64`, **fond `bg-primary` = `#4DA6D9` (sky blue) + texte blanc**, `border-r`.
- ⚠️ **Écart vs hypothèse du prompt** : vous décrivez une sidebar « bleu marine ». En réalité
  elle est rendue en **sky blue** via `bg-primary`. Le token `--sidebar: #1A2940` (navy) **est
  défini mais jamais référencé** → token mort. Dans les deux cas le diagnostic tient : **toute la
  sidebar EST le bleu de marque**, donc le bleu ne peut plus servir d'accent distinctif et « se noie ».
- Marque : icône `Zap` dans un carré `bg-white/10` + « CETé Admin ». Pas de logo.
- Item actif : `bg-white/10 text-white` (à peine distinguable du champ bleu). Inactif :
  `text-white/70`, hover `bg-white/5`.
- Bas : nom + email + bouton ghost « Déconnexion ».
- Contenu : `<main className="ml-64 bg-secondary">` → fond **`#F4F9FD`** (teinte bleue douce).

### 2.2 Dashboard (`src/app/[locale]/admin/dashboard/page.tsx`)

- En-tête inline : `h1 text-3xl font-bold` + sous-titre muted. **Pas de composant partagé.**
- **KPI** (`AdminStatsGrid.tsx`) : 4 `Card` shadcn (bordure + `shadow-sm`). Label muted + petite
  icône Lucide dans `bg-primary/10`, valeur `text-2xl font-bold`, tendance avec
  **`text-green-500` / `text-red-500` hardcodés**. KPIs : Organisations notées · Documents publiés ·
  Articles publiés · **Rating moyen « BB+ » (placeholder)**.
- **Activité récente** (`AdminRecentActivity.tsx`) : 2 `Card`, titre + `Badge` compteur, lignes en
  `div` séparées par `border-b`. Statut article via **pilule hardcodée** `bg-green-100 text-green-700`
  / `bg-yellow-100`.
- **Actions rapides** (`AdminQuickActions.tsx`) : 3 `Card` `hover:shadow-md`, tuiles d'icône
  **hardcodées et hors-marque** : `bg-blue-100`, `bg-green-100`, **`bg-purple-100`** (violet).

### 2.3 Patterns récurrents & dette technique

- **Dette couleur généralisée** : les états sémantiques utilisent la palette Tailwind brute
  (`green-500`, `red-500`, `blue-100`, `purple-100`, `yellow-100`, et `emerald`/`amber`/`violet`/`gray`
  dans la feature Clients) **au lieu des tokens de marque**. Viole la convention projet « no hardcoded color ».
- **« Cards partout »** : tout bloc = carte bordée + ombrée. Manque d'air, manque de hiérarchie.
- **Bleu en surface dominante** (sidebar entière) → l'accent perd toute force.
- **Densité timide** : `p-8`, peu de respiration verticale entre blocs, pas de rythme typographique.
- La feature **Clients** (`src/components/features/admin/clients/`) existe déjà et affiche des
  notes/statuts → le futur `RatingBadge` devra **l'unifier** (et non créer un système parallèle).

---

## 3. Brief de la refonte

> Synthèse recommandée issue des 3 directions + critique. Les choix **structurants esthétiques**
> (température du fond, serif, hero de notation, logo) sont **laissés à votre arbitrage** au § 4.
> Les valeurs ci-dessous sont la **proposition par défaut** (direction « Rating Fintech Synthesis »),
> corrigée pour l'accessibilité AA.

### 3.1 Identité

Une **agence de notation indépendante du risque électrique**. À l'ouverture, le client doit
ressentir **rigueur, autorité, indépendance** — un instrument financier sérieux, pas une marketing
page. Le principe directeur : **la couleur ne se dépense que sur le sens, jamais sur le décor.**
L'objet le plus saturé de chaque écran est **toujours une note Vigi-Score réelle**. Le bleu
devient une **aiguille de précision** (état actif, action primaire, focus), jamais une tapisserie.

### 3.2 Palette finale proposée (scopée `.admin-theme`)

| Rôle | Valeur | Notes |
|---|---|---|
| **Canvas global** | `#F8F9FB` | « cool-paper » : dé-bleuit le `#F4F9FD` actuel, reste compatible surfaces blanches shadcn. *(Arbitrage A)* |
| **Sidebar (rail)** | `#FCFCFD` | rail clair récessif, 1px hairline `#E6ECF1` à droite. **On supprime le champ sky-blue.** |
| **Surface carte** | `#FFFFFF` | les cartes « lèvent » par luminance, pas par bordure épaisse. |
| **Hairline / well** | `#E6ECF1` | filets de séparation (remplace la bordure bleue `#DAEEF8` en admin). |
| **Texte** | `#1A2940` / `#4A6580` / `#8AA5BE` | inchangé (primaire / secondaire / muted). |
| **Accent bleu — INK** | `#1A7AB5` | tout ce qui est texte/indicateur/lien-large : ledge actif, focus, sort. |
| Accent bleu — fill | `#4DA6D9` | réservé aux **remplissages, hover, traits de sparkline, aires de chart**. |
| Lien taille corps | `#0D5A8A` | seul bleu qui passe AA en texte normal. |
| **Accent orange** | `#E8630A` | **banni du décor** ; uniquement « action requise / en retard » (éval. dépassée, contrat expirant, doc « brouillon »). Jamais une note Vigi. |
| Tendance + / − / = | `#15803D` / `#B91C1C` / `#8AA5BE` | remplace `text-green-500` / `text-red-500`. |

**Échelle Vigi-Score sémantique** (le système réutilisable partout) — deux jeux de tokens :

| Note | `-fill` (fond chip, **texte blanc**) | `-raw` (point de légende / filet, **jamais sous texte**) | Glyphe Lucide redondant |
|---|---|---|---|
| **A** | `#15803D` | `#22C55E` | `check-circle` |
| **B** | `#A16207` | `#A3E635` | `trending-up` |
| **C** | `#C2410C` | `#F97316` | `alert-triangle` |
| **D** | `#B91C1C` | `#EF4444` | `octagon-x` |

- **Pourquoi `-fill` assombri** : les tokens bruts existants échouent en contraste sous du texte
  blanc, et **B (lime `#A3E635`) est illisible et trop proche du vert A**. Les `-fill` sont
  hue-séparés (vert → ambre-or → orange → rouge) et lisent une rampe sémantique claire.
- **Redondance** : chaque sceau porte aussi un **glyphe Lucide** + une légende texte → la note
  survit au daltonisme **et à l'impression N&B** (pertinent pour une agence qui édite des rapports).
- *(Le choix exact du fond B et blanc-vs-encre fait l'objet de l'**Arbitrage D**.)*

### 3.3 Typographie

- **Sans (corps, dense)** : **Inter** (existant, inchangé) pour 100 % de l'UI dense — nav, tables,
  labels, boutons, formulaires. `font-feature-settings 'tnum' 1` sur **toutes** les valeurs
  chiffrées, SIRET, dates, cellules de note → colonnes alignées comme un grand livre.
- **Serif (display, rare)** : introduite **scopée admin** via `next/font/google`, exposée en
  `--font-serif-display`. Usage **chirurgical** : `h1` de page + **la lettre-hero de notation**
  (et tout « chiffre-titre » qui ancre un écran). **Pas** sur h2/h3, ni tables, ni corps.
  La rareté = ce qui fait lire « autorité éditoriale » plutôt que « thème ».
  - **Recommandation : Source Serif 4** (voix « rapport d'analyste / dépôt réglementaire »,
    sobre, axe optique, tient en hero 64px et h1 26px). **Fraunces** est excellent **si** le fond
    bascule en ivoire (cf. Arbitrage B, couplé à A). *(Arbitrage B.)*
- **Échelle institutionnelle resserrée** : h1 26–28px serif · valeur KPI 30px Inter 600 tabular ·
  eyebrows 11px majuscules `tracking` `#8AA5BE` · corps 14px · table 13px · lettre-hero note 64px serif.

### 3.4 Densité & espacement

- Cadence **« control room »** : `p-6` page (au lieu de `p-8`), gaps 16px entre tuiles KPI,
  lignes de table 12–14px. Dense là où ça compte (tables, composites), **respiration en marge** et
  **autour du hero de notation**. Confortable sur 13" sans virer « page marketing ».
- Rythme vertical entre blocs majeurs, eyebrows de section, alignement strict.

### 3.5 Traitement des cards

**Règle nouvelle : la carte est l'exception, pas la règle.**

- **Par défaut, sans carte** : KPI, derniers documents, articles récents et tables vivent
  **directement sur le canvas**, séparés par des **filets 1px `#E6ECF1`** et des eyebrows.
- **Vraies surfaces** (hero de notation, dialogs, popovers, `ClientBanner`, coque de table) :
  blanc `#FFFFFF` + 1px hairline + **ombre ultra-discrète** `0 1px 2px rgba(26,41,64,0.04)`.
  **Jamais bordure ET ombre lourde.** Radius standardisé **10px** scopé admin (au lieu de `rounded-xl`).

### 3.6 Système Vigi-Score — le cœur visuel

- **Un seul composant `RatingSeal`** (variantes CVA : `inline-sm` 22px · `md` 28px · `lg` 40px ·
  `hero` 64px), grammaire unique partout (tables, hero, breadcrumb, fiche client).
  - `md`/`lg`/`hero` : fond `-fill` plein + lettre **blanche** (Inter Bold, ou serif en hero) +
    léger inner-highlight + ring `-fill` assombri (effet « sceau frappé »).
  - `inline-sm` : **contrainte d'accessibilité** — à petite taille le blanc-sur-fill échoue ;
    la variante `sm` utilise donc **fond teinté (`-raw` ~12%) + lettre en `-fill` + ring 1px `-fill`**.
- **Composite triple-lettre** (ex. `BAB`) : **3 cellules-sceaux adjacentes connectées**
  (ambre|vert|ambre), chacune sa couleur, séparées par un filet blanc, radius extérieur 10px ;
  sous les cellules, les **3 libellés C canoniques** (Auto-évaluation / Recommandation & Amélioration /
  Gestes Métiers) ou en tooltip. Modificateurs `+/-` en exposant sur chaque cellule.
- **KPI « Rating moyen » refondu** *(décision C1 — distribution seule)* : on **supprime le faux
  « BB+ »** (`stats.repo.ts:53`). À la place, un **hero de distribution** = barre horizontale
  **A/B/C/D réelle**, segments dimensionnés au nombre d'évaluations complétées
  (`status: "completed"`), chaque segment en couleur `-fill` avec son **compte en tabular** et sa
  lettre ; sous-titre serif italique daté (« sur N sites notés · au 29 mai 2026 ») et lecture en clair
  (« X conformes A-B · Y en alerte C-D »). **Aucune lettre « moyenne » inventée.** Dégrade
  proprement quand peu d'évaluations sont notées.

### 3.7 Iconographie

- **Lucide React exclusivement**, **monochrome** dans la rampe neutre (`#8AA5BE` repos,
  `#4A6580` actif, `#1A7AB5` quand l'icône **est** l'accent), **stroke 1.75**.
  **Aucune tuile de fond colorée** (on retire `bg-primary/10`, `bg-blue-100`, `bg-green-100`,
  `bg-purple-100`). On **supprime l'icône `Zap`** de marque.
- **Glyphe métier dédié** : le sceau de note lui-même traité comme un objet taille-icône (22px),
  utilisable inline dans une cellule/prose comme une icône — la notation obtient son propre
  « glyphe » dans le slot d'icône. (À doser pour ne pas saturer le corps de texte.)
- Sparklines/distribution : **SVG/divs faits main** lisant les tokens — **aucune dépendance
  de chart** (contrainte no-new-deps).

### 3.8 Logo dans la sidebar

*(Décision E2 — PNG existant.)* En-tête du rail clair (`h-16`, hairline bas `#E6ECF1`) :
**`logo-cete-adn.png` à `h-7`/`h-8`**, largeur auto, padding latéral. Le rail étant clair `#FCFCFD`,
le PNG conçu pour le header public clair s'intègre nativement. **À valider en Phase 2** : ratio et
whitespace du PNG à petite échelle, alignement vertical, et — si le PNG inclut un baseline « ADN » —
vérifier qu'il reste lisible ; sinon ajouter un kicker texte « AGENCE DE NOTATION » 10px majuscules
`#8AA5BE` sous le logo. Le PNG sert aussi à l'écran de login / exports PDF.

---

## 4. Arbitrages — DÉCISIONS VERROUILLÉES (2026-05-29)

> Décisions prises par le client. Options conservées ci-dessous pour traçabilité.

| # | Sujet | ✅ Retenu |
|---|---|---|
| **A** | Température du fond | **Cool-paper `#F8F9FB`** (A1) |
| **B** | Serif display | **Source Serif 4** (B1) — couplé au fond cool-paper |
| **C** | KPI notation moyenne | **Distribution seule** (C1) — pas de lettre-hero « moyenne » |
| **D** | Fix accessibilité B | **B `#A16207` + texte blanc** (D1) — défaut appliqué |
| **E** | Logo sidebar | **PNG existant** à `h-7`/`h-8` sur le rail clair (E2) |
| **F** | Hover de nav | **Hover visible** `#EAF1F6`, icône → `#1A7AB5` (F1) — défaut appliqué |

**A. Température du fond** *(la plus identitaire — conditionne le re-skin de toutes les surfaces shadcn)*
- A1. **Cool-paper `#F8F9FB`** *(recommandé)* — dé-bleuit, compatible surfaces blanches & espace client, risque le plus faible.
- A2. Ivoire chaud `#FAF7F1` (direction « Le Registre ») — différenciation maximale « rapport imprimé », mais exige de re-skinner chaque surface blanche shadcn ; risque « cabinet ancien » vs « agence moderne ».
- A3. Hybride : canvas cool-paper + cartes/wells légèrement chaudes `#FCFBF8`.
- ✅ **Retenu : A1 (cool-paper `#F8F9FB`).**

**B. Serif display** *(à décider AVEC A — couplés)*
- B1. **Source Serif 4** *(recommandé sur fond cool-paper)* — voix institutionnelle sobre, neutre.
- B2. **Fraunces** — plus chaude/caractérielle ; **excellent si A bascule en ivoire**, légèrement « mode » sur cool-paper.
- B3. Newsreader — broadsheet ; personnalité la plus mince.
- ✅ **Retenu : B1 (Source Serif 4)** — cohérent avec le fond cool-paper. Chargée via `next/font/google`, scopée `.admin-theme`, var `--font-serif-display`. Merriweather reste la serif du site public.

**C. KPI de notation moyenne**
- C1. Distribution seule (comptes A/B/C/D réels), pas de lettre unique — le plus honnête (3 évals/5 notées dans les mocks).
- C2. **Distribution + lettre-hero = note dominante OU plus récente réelle, datée** *(recommandé)*.
- C3. Lettre « moyenne pondérée » calculée — visuellement fort mais statistiquement fabriqué sur données minces.
- ✅ **Retenu : C1 (distribution seule)** — le client a privilégié l'honnêteté statistique. **Pas de lettre-hero « moyenne ».** Le KPI devient une barre de distribution A/B/C/D réelle (comptes en tabular), légende datée. *(Ma reco était C2 ; C1 reste pleinement cohérent avec le brief et dégrade mieux quand peu d'évaluations existent.)*

**D. Fix accessibilité du B**
- D1. **B `#A16207` + texte blanc** *(recommandé)* — AA-large OK, grammaire blanche uniforme sur les 4 notes, franchement hors-lime.
- D2. B `#C9A227` + encre `#1A2940` — meilleur contraste brut (AA-normal) mais casse l'uniformité (B = seule note à texte sombre).
- ✅ **Retenu : D1 (B `#A16207` + texte blanc).** Dans tous les cas : **jamais** blanc-sur-lime, **jamais** `#CA8A04`+blanc (~2.6:1, échoue).

**E. Logo sidebar**
- E1. **Lockup SVG inline reconstruit** + PNG réservé login/PDF *(recommandé)* — net en rétina, renforce l'identité « agence ».
- E2. PNG `logo-cete-adn.png` à `h-7` sur plaque blanche — vrai asset, conçu pour header clair.
- ✅ **Retenu : E2 (PNG existant)** — `logo-cete-adn.png` à `h-7`/`h-8` dans l'en-tête du rail clair `#FCFCFD`. Le fond clair retenu (Arbitrage A) rend le PNG **cohérent** (le souci « PNG lourd sur fond sombre » ne concernait que la direction ivoire écartée). À vérifier en Phase 2 : ratio/whitespace du PNG à petite taille, padding, et lisibilité ; le PNG reste aussi l'asset de login/exports PDF.

**F. Hover de la nav (rail clair)**
- F1. Texte seul au repos + hover légèrement plus visible que Linear (`#EAF1F6`, icône → `#1A7AB5`) *(recommandé — les écrans de bureau non calibrés mangent les hovers trop subtils).*
- F2. Hover quasi invisible (restraint Linear pur).
- ✅ **Retenu : F1** (hover `#EAF1F6`, icône → `#1A7AB5`).

---

## 5. Trois mood references textuelles

Trois ambiances candidates (les arbitrages A/B choisissent laquelle on vise). La **n°3 est la recommandée**.

**Mood 1 — « Le Registre » (Institutional Classic, ivoire).**
On ouvre l'admin comme on pose un rapport de notation relié sur un bureau. Une page **ivoire chaud
`#FAF7F1`** remplit l'écran — du papier, pas une app bleue lumineuse. À gauche, une tranche
encre-navy `#161E2E` (le « dos relié ») porte un masthead serif « CETé » avec « AGENCE DE NOTATION »
dessous et un seul tiret orange ; la nav lit comme une table des matières, la page courante marquée
d'un mince filet bleu « marque-page ». La colonne principale s'ouvre sur un grand titre serif et une
barre d'actions filetée. En haut, quatre chiffres KPI forment **un seul tableau statistique réglé**
— gros numéraux serif frappés à l'encre, pas de boîtes. Domine un panneau blanc encadré façon
certificat : un **sceau frappé** vert-et-or de la note de portefeuille, une barre de distribution
A/B/C/D, et le dernier composite « AAA » en trois cellules-sceaux. Calme, chaud, carré, imprimé.
*Ça a l'air émis, pas généré.*

**Mood 2 — « Quiet Ledger » (Minimal Tech, quasi-monochrome).**
Un écran presque blanc, légèrement froid, qui évoque du papier de haute qualité. À gauche, une
sidebar `w-60` quasi invisible — pas de panneau bleu, juste « CETé | ADMIN » en Inter sombre, puis
des labels gris doux groupés sous de fins eyebrows ; **un seul item porte une aiguille bleue 2px**,
le seul bleu de toute l'image. Titre serif « Tableau de bord », un unique bouton bleu plein
« Nouveau client ». Quatre lectures KPI dans une bande-grand-livre sans bordures, séparées par des
filets — gros numéraux tabulaires, minuscules flèches de tendance, **zéro chrome de carte**. À
droite, le seul élément élevé : une **distribution Vigi-Score réelle** en quatre segments
vert/ambre/orange/rouge. Tout est petit, aligné, monochrome, sûr ; **les couleurs de note explosent
justement parce qu'elles sont entourées de retenue.** Un instrument de qualité financière, pas un template.

**Mood 3 — « Rating Fintech Synthesis » (DIRECTION RETENUE).**
Le regard tombe d'abord sur une **barre de distribution Vigi-Score** en haut à gauche — quatre
segments vert/ambre/orange/rouge dimensionnés au portefeuille réel, chacun avec son compte en chiffres
tabulaires, sous-titrée en italique serif fine « sur N sites notés · au 29 mai 2026 » : la note,
pas une moyenne inventée. Le canvas est un **cool-paper gris-blanc `#F8F9FB`**, pas bleu ; les
cartes blanches semblent flotter par luminance seule, ombres à peine perceptibles. Un rail clair
descend à gauche — presque la couleur de la page, marqué d'un filet et, face à la page courante,
d'**un seul ledge bleu profond 3px** + label assombri. En haut, une rangée de stats grand-livre en
Inter tabulaire, chacune avec une sparkline bleue filiforme. En dessous, un registre sans bordures
d'évaluations récentes : noms en encre nette, et au bout de chaque ligne **un chip composite à trois
segments** — ambre·vert·ambre pour « BAB », tel un code-barres du risque. Quasi pas d'orange, pas de
violet, pas de tuiles d'icône bonbon ; juste encre, ardoise, blanc, et quatre couleurs de note
assurées. **Un terminal financier qui aurait embauché un grand typographe** : sobre, dense,
« cher », et indubitablement la console d'une agence de notation.

---

## 6. Checklist anti-générique (à respecter en Phases 1-4)

- [ ] **Ne pas** garder la sidebar en bloc sky-blue plein (`bg-primary`) — cause racine du « bleu noyé ». Rail clair récessif, bleu = ledge actif 3px seulement.
- [ ] **Aucune** utilitaire Tailwind brute pour le sémantique (`bg-blue-100`, `bg-green-100`, `bg-purple-100`, `text-green-500`, `text-red-500`, `bg-yellow-100`). Tout passe par `--admin-*` / `--vigi-*`.
- [ ] **Ne pas** rendre la notation en échelle S&P. Tuer `value:"BB+"` dans `stats.repo.ts`. Construire sur le réel : A/B/C/D, `+/-`, composites (`BAB`, `AAA`, `CCB`).
- [ ] **Ne pas** inventer les libellés 3C. Utiliser `THREE_C_CRITERIA` (Auto-évaluation / Recommandation & Amélioration / Gestes Métiers).
- [ ] **Ne pas** emballer chaque bloc dans une carte. Filets par défaut ; vraies surfaces réservées (hero, dialogs, popovers, coque de table). Jamais bordure ET ombre lourde.
- [ ] **Ne pas** utiliser `#4DA6D9` en texte/lien/filet sur fond clair (échoue AA). `#1A7AB5` (indicateurs/liens larges), `#0D5A8A` (liens corps).
- [ ] **Ne pas** mettre du blanc sur lime / `#CA8A04` / `#22C55E` brut. Utiliser le jeu `-fill` assombri + variante lettre-teintée pour les petits sceaux.
- [ ] **Ne pas** reposer la note sur la couleur seule : glyphe Lucide redondant + légende texte.
- [ ] **Ne pas** importer les décorations du site public : pas de `.bg-bubbles-pattern`, pas de `glow-*`, pas de hero gradient. Admin sobre et plat.
- [ ] **Ne pas** laisser fuiter le thème : tous les tokens + var serif + radius 10px scopés `.admin-theme` (ou `[data-section=admin]`) sur le wrapper du layout admin, **jamais** sur `:root`. Vérifier site public (Merriweather/`#F4F9FD`/sidebar bleue) et espace client **inchangés**.
- [ ] **Ne pas** garder le stroke Lucide 2px ni les plaques d'icône colorées. Stroke 1.75, icônes monochromes, sans tuile. Retirer `Zap`.
- [ ] **Ne pas** ajouter de dépendance chart/anim pour sparklines/distributions — SVG/divs faits main lisant les tokens.
- [ ] **Ne pas** dépasser le cap 250 lignes/fichier : `RatingSeal` (CVA) et la sidebar = composants autonomes ; extraire hero-distribution et bande KPI dans `src/components/features/admin/`.
- [ ] **Ne pas** oublier `tnum` sur valeurs KPI, métriques de table, SIRET, dates, cellules de note.
- [ ] **Ne pas** réduire la serif à un seul `h1` : poser aussi la lettre-hero de notation en serif pour que la voix institutionnelle s'enregistre ≥ 2× par écran.

---

## 7. Checklist Phase 0

- [x] Inventaire des assets (logo, couleurs, fonts, composants shadcn, système de notation réel)
- [x] Audit du design admin actuel (layout/sidebar, dashboard, patterns, dette couleur)
- [x] Brief de refonte : palette (hex précis) + typo + densité + traitement cards + iconographie
- [x] Système Vigi-Score sémantique proposé (tokens `-fill`/`-raw`, AA, redondance daltonisme)
- [x] 3 mood references textuelles
- [x] Arbitrages structurants explicités avec recommandations (A → F)
- [x] Checklist anti-générique
- [x] Document `docs/admin-redesign-brief.md` livré — **aucune ligne de code écrite**

> **STOP Phase 0.** En attente de votre validation / ajustement des arbitrages A → F
> avant de toucher au code (Phase 1 — design tokens).
