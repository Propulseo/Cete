# Audit & palette — Mode nuit admin + espace client

> **Phase 0 — Audit et proposition de palette dark. Aucune ligne de code écrite.**
> Périmètre : interfaces `/admin/*` et `/client/*` uniquement. Le **site public reste en
> mode clair** (hors périmètre, jamais touché).
>
> Méthode : lecture du code réel (`globals.css`, layouts admin/client, sidebars, composants
> partagés `src/components/shared/`, primitives `src/components/ui/`, features admin/client) +
> scan exhaustif des couleurs hardcodées sur toutes les surfaces admin/client + relevé des cas
> architecturaux (portails Radix, isolation du public). Ce document est la synthèse.
>
> **STOP en fin de document — j'attends ta validation de la palette + des arbitrages avant
> de toucher au code (Phase 1).**

---

## 0. Confirmation de la stack & état des lieux

| Vérification | Résultat |
|---|---|
| Next.js 16 App Router | ✅ `next@16.1.6` |
| Tailwind v4 (CSS variables, pas de `tailwind.config`) | ✅ `tailwindcss@^4`, tokens dans `@theme inline` + `:root` + scopes |
| shadcn/ui en place | ✅ `src/components/ui/*` (button, card, dialog, sheet, badge, input…) |
| **`next-themes` déjà installé** | ✅ `next-themes@^0.4.6` — **Phase 1 « install » déjà faite**, il reste à câbler le provider |
| Variant dark Tailwind v4 | ✅ déjà déclaré : `@custom-variant dark (&:is(.dark *))` (globals.css:7) |

### Découvertes structurantes (déjà présent dans le repo)

1. **Un bloc dark admin « anticipé » existe déjà** (`globals.css:251-274`, sélecteur
   `.dark .admin-theme, .admin-theme.dark`) — mais il est **incomplet** : il redéfinit les
   surfaces/texte/bordures/`--primary`/`--admin-sidebar` mais **PAS** la palette sémantique ni
   Vigi-Score (`--vigi-*-fill`, `--vigi-*-tint`, `--vigi-fg`, `--admin-pos/neg/stable/urgent`,
   `--admin-blue-ink/fill`, `--destructive`, charts). Conséquence : en dark, les sceaux Vigi et
   les indicateurs de tendance gardent leurs valeurs **claires** → illisibles (détail § 4 et § 6).
2. **Aucun bloc `.client-theme.dark`** (0 occurrence). L'espace client n'a **aucun** token dark →
   tous les composants partagés y retomberaient sur les valeurs claires (filets clairs sur fond
   sombre). C'est le **gap le plus large** à combler.
3. **Bloc `.dark { … }` générique non scopé** (`globals.css:152-184`) : palette dark verte-grisée
   héritée de shadcn, **différente** du dark admin (bleuté). Elle s'appliquerait à **n'importe
   quel** descendant de `.dark`, **y compris le site public** → **risque d'isolation** (§ 7).
4. **`h1…h6 { color: #1A2940 }`** en dur dans `@layer base` (`globals.css:343-346`) → en dark, tous
   les titres seraient navy sur fond sombre = **invisibles**. Correctif critique (§ 6).
5. **Logo = PNG, pas SVG** : `public/assets/brand/logo-cete-adn.png` (pas de SVG de marque). Le
   wordmark « CETé ADN » (bleu/orange) reste lisible sur sombre, mais la baseline « Consortium
   Experts Techniques Électricité » (texte navy foncé) **disparaît** sur un rail sombre (§ 5).

---

## 1. Inventaire des tokens clairs (scopes `.admin-theme` / `.client-theme`)

> Les deux scopes sont **identiques** (décision STY-1 : dupliqués, pas partagés). Tableau unique.
> Source : `globals.css:190-330`. Le site public (`:root`) a sa **propre** palette, non listée
> ici car **hors périmètre**.

### 1.1 Tokens shadcn sémantiques

| Token | Clair | Usage |
|---|---|---|
| `--background` | `#F8F9FB` | Canvas global « cool-paper » (pages admin/client) |
| `--foreground` | `#1A2940` | Texte primaire (ink navy) |
| `--card` | `#FFFFFF` | Surfaces réelles (SurfaceCard, KPI tile, table shell, dialogs) |
| `--card-foreground` | `#1A2940` | Texte sur carte |
| `--popover` | `#FFFFFF` | Fond popover / dialog / toast |
| `--popover-foreground` | `#1A2940` | Texte popover |
| `--muted` | `#EEF2F6` | Puits / chips neutres / icône-chip empty-state |
| `--muted-foreground` | `#4A6580` | Texte secondaire, eyebrows, labels |
| `--secondary` | `#F1F4F8` | Pilule StatusBadge, avatar initiales, en-tête de table (/60) |
| `--secondary-foreground` | `#1A2940` | Texte sur secondary |
| `--accent` | `#EAF1F6` | **Hover wash** de la nav et des lignes |
| `--accent-foreground` | `#1A2940` | Texte sur hover |
| `--primary` | `#1A7AB5` | Accent INK : ledge actif, bouton primaire, focus, icône-accent |
| `--primary-foreground` | `#FFFFFF` | Texte/glyphe sur fond primaire |
| `--border` / `--input` | `#E6ECF1` | Bordures inputs / filets |
| `--ring` | `#1A7AB5` | Anneau de focus |
| `--destructive` | `#B91C1C` | Action destructive (suppression) |

### 1.2 Tokens additifs `--admin-*` (réutilisés à l'identique dans `.client-theme`)

| Token | Clair | Usage |
|---|---|---|
| `--admin-sidebar` | `#FCFCFD` | Fond du rail (sidebar desktop + drawer mobile) |
| `--admin-sidebar-hover` | `#EAF1F6` | Hover des lignes de table & nav |
| `--admin-line` | `#E6ECF1` | **Filet hairline** omniprésent (séparateurs, shells, dividers) |
| `--admin-blue-ink` | `#1A7AB5` | Bleu encre (indicateurs, icônes-accent) |
| `--admin-blue-fill` | `#4DA6D9` | Bleu remplissage (hover, aires de sparkline) |
| `--admin-blue-link` | `#0D5A8A` | Bleu lien taille corps (seul AA en texte normal sur clair) |
| `--admin-pos` | `#15803D` | Tendance positive (+) |
| `--admin-neg` | `#B91C1C` | Tendance négative (−) |
| `--admin-stable` | `#8AA5BE` | Tendance stable (=) |
| `--admin-urgent` | `#E8630A` | « Action requise / en retard » (orange TST, hors décor) |

### 1.3 Tokens Vigi-Score (le cœur sémantique)

| Token | Clair | Usage |
|---|---|---|
| `--vigi-fg` | `#FFFFFF` | Lettre sur sceau plein (md+) |
| `--vigi-a-fill` … `-d-fill` | `#15803D` / `#A16207` / `#C2410C` / `#B91C1C` | Fond plein des sceaux (texte blanc) |
| `--vigi-a-raw` … `-d-raw` | `#22C55E` / `#A3E635` / `#F97316` / `#EF4444` | **Points de légende / filets fins** — jamais sous du texte |
| `--vigi-a-tint` … `-d-tint` | `rgba(<fill>, 0.12)` | Fond des **petits sceaux** `inline-sm` (lettre en `-fill` dessus) |

### 1.4 Charts & sidebar shadcn

- `--chart-1..5` (clair, hérité `:root`) : `#4DA6D9 / #1A7AB5 / #E8630A / #F59542 / #8AA5BE`.
  En admin/client, les distributions/sparklines sont **faites main en SVG** lisant `--admin-blue-*`
  et `--vigi-*` (pas de dépendance chart), donc `--chart-*` est peu sollicité — mais on les
  redéfinit quand même en dark par hygiène.
- Tokens shadcn `--sidebar*` : **morts** en admin/client (la sidebar lit `--admin-sidebar` /
  `--admin-line` en direct). On ne s'en occupe pas.

---

## 2. Principes de la palette dark

1. **Fond global non-noir-pur** : navy-noir profond `#0E141B` (bleuté, cohérent avec l'identité
   « agence », évite le saignement OLED et le contraste extrême).
2. **Hiérarchie de plans par luminance** : `background` (le plus sombre) < `sidebar` < `card`
   (le plus clair). Les cartes « lèvent » par luminance, comme en clair.
3. **Texte off-white, jamais blanc pur** : `#E7EDF3` (réduit la fatigue), muted `#9DB0C2`.
4. **Le bleu d'accent s'éclaircit** : `#1A7AB5` (ink, AA sur clair) → `#4DA6D9` en dark (AA en
   texte sur carte sombre, ce qu'il ne passait pas sur clair). Les liens corps passent à `#87C4E8`.
5. **Sémantique Vigi-Score : on garde le sens, on recalibre la lisibilité.** Les `-fill` plein
   restent assez sombres pour porter du texte blanc (AA) tout en se détachant de la carte sombre ;
   les **petits sceaux teintés** et les **points de tendance** passent à des hues **éclaircis**
   (sinon un vert/rouge foncé sur near-black est illisible).
6. **Aucune couleur hardcodée** : tout passe par les CSS variables ; les rares hardcodes restants
   sont migrés (§ 6) ou laissés s'ils appartiennent au site public partagé (§ 6.3).

---

## 3. Palette dark proposée — token par token

> À placer dans `globals.css` sous **`.dark .admin-theme, .dark .client-theme`** (sélecteur
> descendant : `.dark` est posé par `next-themes` sur `<html>`, les classes de scope sont sur le
> wrapper de layout — cf. § 7). Les valeurs claires **ne changent pas**.

### 3.1 Surfaces & texte

| Token | Clair | **Dark proposé** | Note |
|---|---|---|---|
| `--background` | `#F8F9FB` | **`#0E141B`** | Navy-noir profond (déjà dans le bloc anticipé) |
| `--foreground` | `#1A2940` | **`#E7EDF3`** | Off-white cool |
| `--card` | `#FFFFFF` | **`#131B24`** | +1 plan au-dessus du fond |
| `--card-foreground` | `#1A2940` | **`#E7EDF3`** | |
| `--popover` | `#FFFFFF` | **`#131B24`** | Dialogs/toasts (cf. portails § 7.2) |
| `--popover-foreground` | `#1A2940` | **`#E7EDF3`** | |
| `--muted` | `#EEF2F6` | **`#1A242E`** | |
| `--muted-foreground` | `#4A6580` | **`#9DB0C2`** | |
| `--secondary` | `#F1F4F8` | **`#1A242E`** | |
| `--secondary-foreground` | `#1A2940` | **`#E7EDF3`** | |
| `--accent` (hover) | `#EAF1F6` | **`#1C2A37`** | Wash de hover dark |
| `--accent-foreground` | `#1A2940` | **`#E7EDF3`** | |
| `--border` / `--input` | `#E6ECF1` | **`#243240`** | Filet perceptible mais discret |
| `--ring` | `#1A7AB5` | **`#4DA6D9`** | Focus éclairci |

### 3.2 Accent bleu & destructive

| Token | Clair | **Dark proposé** | Note |
|---|---|---|---|
| `--primary` | `#1A7AB5` | **`#4DA6D9`** | Éclairci pour la lisibilité sur sombre |
| `--primary-foreground` | `#FFFFFF` | **`#08111A`** | ⚠️ **encre, pas blanc** : blanc sur `#4DA6D9` échoue (2.7:1). Encre = 7:1 |
| `--destructive` | `#B91C1C` | **`#DC2626`** | Éclairci : meilleure séparation du fond + texte blanc AA (4.8:1) |

### 3.3 Tokens `--admin-*`

| Token | Clair | **Dark proposé** | Note |
|---|---|---|---|
| `--admin-sidebar` | `#FCFCFD` | **`#111921`** | Entre fond et carte (plan intermédiaire) |
| `--admin-sidebar-hover` | `#EAF1F6` | **`#1C2A37`** | = `--accent` dark |
| `--admin-line` | `#E6ECF1` | **`#243240`** | = `--border` dark |
| `--admin-blue-ink` | `#1A7AB5` | **`#4DA6D9`** | `#1A7AB5` en texte sur carte dark échoue (3.7:1) → éclairci |
| `--admin-blue-fill` | `#4DA6D9` | **`#4DA6D9`** | Inchangé (remplissages/aires) |
| `--admin-blue-link` | `#0D5A8A` | **`#87C4E8`** | Lien corps lisible sur dark (9.2:1) |
| `--admin-pos` (+) | `#15803D` | **`#4ADE80`** | Vert foncé illisible en texte sur dark → vert clair (10:1) |
| `--admin-neg` (−) | `#B91C1C` | **`#F87171`** | Rouge foncé illisible en texte → rouge clair (6.3:1) |
| `--admin-stable` (=) | `#8AA5BE` | **`#8AA5BE`** | Inchangé (slate, déjà 6.8:1 sur dark) |
| `--admin-urgent` | `#E8630A` | **`#F59542`** | Orange éclairci pour rester lisible en texte (7.7:1) et garder le sens |

### 3.4 Vigi-Score — recalibrage dark (le point le plus délicat)

**Sceaux pleins (`md`/`lg`/`hero`, texte blanc)** — on garde A/B/C, on **éclaircit D** :

| Note | Clair `-fill` | **Dark `-fill`** | Blanc dessus | Détache du fond carte |
|---|---|---|---|---|
| **A** | `#15803D` | **`#15803D`** | 5.0:1 ✓ | 3.5:1 ✓ |
| **B** | `#A16207` | **`#A16207`** | 4.9:1 ✓ | 3.5:1 ✓ |
| **C** | `#C2410C` | **`#C2410C`** | 5.2:1 ✓ | 3.4:1 ✓ |
| **D** | `#B91C1C` | **`#DC2626`** | 4.8:1 ✓ | 3.6:1 ✓ *(vs `#B91C1C` qui ne détachait qu'à 2.7:1)* |

- `--vigi-fg` : **`#FFFFFF`** (inchangé).
- `-raw` (points de légende / filets) : **inchangés** (`#22C55E / #A3E635 / #F97316 / #EF4444`) —
  hues vifs, parfaits comme pastilles sur fond sombre.

**Petits sceaux teintés `inline-sm` + glyphe redondant — NOUVEAU token `--vigi-*-ink` requis.**

Problème : le composant `RatingSeal` utilise `--vigi-*-fill` **à la fois** comme fond de sceau md+
(doit rester sombre pour le texte blanc) **et** comme couleur de lettre du petit sceau teinté
(doit être **clair** pour se lire sur la teinte sombre). Un seul token ne peut pas satisfaire les
deux en dark. → On introduit **`--vigi-{a,b,c,d}-ink`** (couleur lettre + ring + glyphe du petit
sceau) :

| Token | Clair (= `-fill`, rendu identique) | **Dark (éclairci)** |
|---|---|---|
| `--vigi-a-ink` | `#15803D` | **`#4ADE80`** |
| `--vigi-b-ink` | `#A16207` | **`#FBBF24`** |
| `--vigi-c-ink` | `#C2410C` | **`#FB923C`** |
| `--vigi-d-ink` | `#B91C1C` | **`#F87171`** |

Et les **teintes** `-tint` montent en opacité et se basent sur le hue clair (sinon invisibles sur
carte sombre) :

| Token | Clair | **Dark proposé** |
|---|---|---|
| `--vigi-a-tint` | `rgba(21,128,61,0.12)` | **`rgba(74,222,128,0.18)`** |
| `--vigi-b-tint` | `rgba(161,98,7,0.12)` | **`rgba(251,191,36,0.18)`** |
| `--vigi-c-tint` | `rgba(194,65,12,0.12)` | **`rgba(251,146,60,0.18)`** |
| `--vigi-d-tint` | `rgba(185,28,11,0.12)` | **`rgba(248,113,113,0.18)`** |

> **Conséquence code (Phase 4)** : édition ~3 lignes dans `src/components/shared/rating-seal.tsx`
> pour que la variante `inline-sm` **et le glyphe** lisent `var(--vigi-X-ink)` au lieu de
> `FILL[grade]`. En clair `-ink = -fill` → rendu strictement identique à aujourd'hui.

### 3.5 Charts (hygiène)

| Token | **Dark** |
|---|---|
| `--chart-1` | `#4DA6D9` |
| `--chart-2` | `#87C4E8` |
| `--chart-3` | `#F59542` |
| `--chart-4` | `#E8630A` |
| `--chart-5` | `#9DB0C2` |

### 3.6 Nouveau token d'élévation `--surface-shadow`

Les ombres `shadow-[0_1px_2px_rgba(26,41,64,0.04)]` (encre navy 4 %) de `SurfaceCard` et `KPITile`
sont **invisibles** sur fond sombre → les cartes perdent leur relief. On tokenise :

| Token | Clair | **Dark** |
|---|---|---|
| `--surface-shadow` | `0 1px 2px rgba(26,41,64,0.04)` | `0 1px 2px rgba(0,0,0,0.45)` |

> Édition Phase 4 : `shadow-[var(--surface-shadow)]` dans `surface-card.tsx:13` et `kpi-tile.tsx:27`.

---

## 4. Vérification contrastes WCAG (paires critiques, mode dark)

| Paire | Ratio | Seuil | Verdict |
|---|---|---|---|
| `foreground #E7EDF3` / `background #0E141B` | **15.7:1** | 4.5 (AAA 7) | ✅ AAA |
| `foreground #E7EDF3` / `card #131B24` | **14.8:1** | 4.5 | ✅ AAA |
| `muted-foreground #9DB0C2` / `card #131B24` | **7.8:1** | 4.5 | ✅ AAA |
| `primary #4DA6D9` (graphique/large) / `background` | **6.9:1** | 3.0 | ✅ |
| `primary #4DA6D9` (texte) / `card` | **6.4:1** | 4.5 | ✅ AA |
| `primary-foreground #08111A` / `primary #4DA6D9` (bouton) | **7.0:1** | 4.5 | ✅ AAA |
| `admin-blue-link #87C4E8` (lien corps) / `card` | **9.2:1** | 4.5 | ✅ AAA |
| Blanc / `vigi-a-fill #15803D` | **5.0:1** | 4.5 | ✅ AA |
| Blanc / `vigi-b-fill #A16207` | **4.9:1** | 4.5 | ✅ AA |
| Blanc / `vigi-c-fill #C2410C` | **5.2:1** | 4.5 | ✅ AA |
| Blanc / `vigi-d-fill #DC2626` | **4.8:1** | 4.5 | ✅ AA |
| Tendance + `#4ADE80` / `card` | **10.0:1** | 4.5 | ✅ AAA |
| Tendance − `#F87171` / `card` | **6.3:1** | 4.5 | ✅ AA |
| Tendance = `#8AA5BE` / `card` | **6.8:1** | 4.5 | ✅ AA |
| `admin-urgent #F59542` (texte) / `card` | **7.7:1** | 4.5 | ✅ AA |
| Blanc / `destructive #DC2626` (bouton) | **4.8:1** | 4.5 | ✅ AA |

> Point d'attention mineur : les **eyebrows** de sidebar utilisent `text-muted-foreground/70`
> (opacité 70 %). À `#9DB0C2`/70 % sur le rail `#111921`, on tombe vers ~4–4.5:1 (labels 10px
> décoratifs). Si on veut être strict, passer à `/80` en dark. Non bloquant.

---

## 5. Logo CETé — décision à valider

Le logo est un **PNG** (`logo-cete-adn.png`), pas un SVG. Il contient :

- le wordmark **« CETé ADN »** (bleu `#1A7AB5` + orange) → **lisible sur fond sombre** ;
- une baseline **« Consortium Experts Techniques Électricité »** en **navy foncé** → **disparaît**
  sur le rail sombre `#111921` ;
- le slogan « La force d'un collectif » en vert italique (lisible) ;
- des bulles décoratives bleu/vert (lisibles) ;
- fond **transparent** (le PNG s'intègre sans plaque sur le rail clair actuel).

Aux tailles d'affichage (`h-7`/`h-8`, masthead 32px), la baseline est de toute façon quasi
illisible. Mais pour être propre, deux options :

| Option | Description | Avantage | Inconvénient |
|---|---|---|---|
| **L1 — Variante dark dédiée** *(préférable)* | Produire `logo-cete-adn-dark.png` (baseline + ligne « Consortium… » en `#E7EDF3`), swap via `useTheme()`/`resolvedTheme` dans la masthead | Net, propre, identitaire | **Nécessite un asset graphique** que je ne peux pas générer en qualité — à fournir, ou je le sors via édition d'image basique |
| **L2 — Plaque claire en dark** *(repli sans asset)* | En dark, envelopper le logo dans une plaque arrondie claire (`bg-[#F4F9FD]` + padding) | Zéro nouvel asset, lisibilité garantie | Effet « sticker clair » dans le rail sombre, moins élégant |
| L3 — Statu quo | Garder le PNG tel quel | Zéro effort | Baseline « Consortium… » invisible (acceptable car déjà quasi illisible à cette taille) |

→ **À trancher (Arbitrage Logo).** Ma reco : **L1** si tu peux fournir/valider un PNG dark, sinon
**L2** pour livrer proprement tout de suite. Le PNG clair reste l'asset login / exports PDF.

---

## 6. Composants à risque (scan exhaustif intégré)

### 6.1 Hardcodes à migrer — composants **scopés admin/client** (Phase 2)

> Ces fichiers ne servent QUE l'admin/client : migration sans risque pour le public.

| Fichier:ligne | Hardcode | Impact dark | → Token |
|---|---|---|---|
| **`features/admin/ui/FileUploadField.tsx`** (l.57,59,61,64,74,86,99,101,102,103) | fonds blancs/bleu-pâle, encre `#1A2940`, hovers `#DAEEF8` | ⚠️ **Le pire** : boîtes blanches éclatantes + texte navy invisible dans des dialogs sombres. Réutilisé par les dialogs Document/Resource/Certificate | `bg-card`/`bg-muted`, `text-foreground`, `text-muted-foreground`, `border-border`, `text-primary`, `hover:bg-accent`, `hover:border-primary` |
| `admin/clients/[id]/documents/page.tsx:172` | `text-[#1A7AB5]` (icône Download) | Icône bleue fixe, ne s'éclaircit pas | `text-primary` |
| `features/admin/DocumentFormDialog.tsx:184` | `text-[#4A6580]` (« Taille : ») | Texte trop sombre sur dialog dark | `text-muted-foreground` |
| `features/admin/ResourceFormDialog.tsx:229` | `text-[#4A6580]` | idem | `text-muted-foreground` |
| `features/admin/CertificateFormDialog.tsx:117` | `text-[#1A7AB5]` (icône Award) | Icône bleue fixe | `text-primary` |
| `admin/clients/[id]/evaluations/page.tsx:214` | `color: "#fff"` sur fill Vigi | Cosmétique (sur fill saturé, reste lisible) | `var(--vigi-fg)` (optionnel) |

### 6.2 Composants partagés — édits code (Phase 4)

| Fichier:ligne | Problème dark | Action |
|---|---|---|
| `shared/surface-card.tsx:13` | `shadow-[…rgba(26,41,64,0.04)]` invisible sur dark | `shadow-[var(--surface-shadow)]` (§ 3.6) |
| `shared/kpi-tile.tsx:27` | idem | `shadow-[var(--surface-shadow)]` |
| `shared/rating-seal.tsx` (var. `inline-sm` + glyphe) | lettre/glyphe en `-fill` sombre sur teinte sombre = illisible | lire `var(--vigi-X-ink)` (§ 3.4) |
| `shared/rating-seal.tsx:75` | `inset 0 1px 0 rgba(255,255,255,0.18)` (bevel blanc) | faible impact ; OK de garder, ou tokeniser |
| `shared/rating-seal.tsx:134` | `border-white/30` entre cellules composites | OK en dark (lisible sur fills) ; faible priorité |

> Les autres partagés (`page-header`, `empty-state`, `quick-action`, `data-table`, `status-badge`)
> sont **100 % tokenisés** : aucun édit code. Ils « cassent » uniquement faute de bloc
> `.client-theme.dark` (résolu en § 3 / Phase 2), pas par défaut de code.

### 6.3 Cas à NE PAS toucher (primitives partagées avec le public)

> Le scan les a signalés, mais ce sont des primitives **utilisées aussi par le site public** :
> les migrer changerait le rendu public (**interdit**). Et leur valeur fonctionne déjà en dark.

| Fichier | Hardcode | Décision |
|---|---|---|
| `ui/video-embed.tsx:32,46` | `bg-[#1A2940]` (letterbox vidéo) | **Garder.** Un cadre vidéo navy est conventionnel et correct en clair **et** en dark. `bg-muted` éclaircirait le letterbox **sur le public**. |
| `ui/dialog.tsx:42`, `ui/sheet.tsx:39` | `bg-black/50` (scrim modale) | **Garder.** Un voile noir 50 % marche universellement (clair + dark) ; `bg-foreground/50` changerait le scrim **du public**. |
| `features/client/DocumentsList.tsx:56-58` | hex dans `document.write()` | **Garder.** Chrome d'une **fenêtre popup** isolée (hors arbre React, hors scope) — ni affectée ni affectante. |

### 6.4 Cas spéciaux annoncés par le prompt — statut réel

| Cas | Réalité du repo | Action dark |
|---|---|---|
| **QR code (CertificateCard)** | ⚠️ **Pas un vrai QR** : c'est une **icône Lucide `QrCode`** sur `bg-muted` + bordure dashed, tokenisée → s'adapte seule. Le vrai QR est dans le **PDF** | **Aucune.** Pas besoin de plaque blanche |
| **Export PDF certificat** (`generate-certificate-pdf.ts`, jsPDF) | Document à format fixe, imprimable | **Aucune** — le PDF reste clair (correct pour l'impression), indépendant du thème écran |
| **Carte Leaflet** (`react-leaflet`) | Uniquement dans `sections/about/AboutWorldMap.tsx` = **page publique** | **Hors périmètre.** (Si un jour on passe le public en dark, prévoir des tuiles dark) |
| **Bouton « Télécharger » (CertificateCard)** | C'est le **bouton primaire (bleu)**, pas vert | S'adapte via `--primary` dark |
| **Images fondateurs** (next/image) | Photographiques | **Aucune** ; éventuel ring `--admin-line` (cosmétique) |
| Décorations publiques (`.bg-bubbles-pattern`, `glow-*`, hero gradient) | **Non utilisées** en admin/client (confirmé) | **Aucune** |

---

## 7. Isolation du site public & architecture du scope (CRITIQUE)

### 7.1 Garantie « le public n'a jamais de dark »

`next-themes` pose la classe `.dark` sur **`<html>`** (documentElement). Le provider sera monté
**uniquement** dans les layouts admin/client. **Mais** : en navigation SPA admin (dark) → public,
`next-themes` ne nettoie pas forcément `.dark` au démontage → `html.dark` peut **persister** sur
une page publique.

→ **Stratégie d'isolation bullet-proof :**

1. **Scoper tout le dark** sous `.dark .admin-theme, .dark .client-theme` (jamais `.dark` seul).
   Une page publique n'a **ni** `.admin-theme` **ni** `.client-theme` → même si `html.dark`
   traîne, **aucun** token dark ne s'applique → public **toujours clair**.
2. **Retirer (ou neutraliser) le bloc `.dark { … }` générique** (`globals.css:152-184`) : c'est la
   **seule** chose qui re-skinnerait le public sous `html.dark`. Comme admin + client couvrent les
   deux seules surfaces dark, ce bloc global n'a plus de raison d'être.
3. **Correctif `h1…h6`** : `color: #1A2940` → `color: var(--foreground)` (public identique car
   `:root --foreground = #1A2940`).

### 7.2 Portails Radix (Dialog / Popover / Sonner) — point facile à manquer

Les `DialogContent` / `PopoverContent` / toasts Sonner sont **portés dans `document.body`**, donc
**en dehors** du wrapper `.admin-theme`/`.client-theme`. Aujourd'hui en clair ça « passe » par
accident (retombe sur `:root`, proche). **En dark, un dialog se rendrait en BLANC** (tokens `:root`
clairs) au milieu de l'app sombre — bug visible.

> Le drawer mobile (`SheetContent`) **porte déjà** la classe de scope explicitement
> (`${adminScope}` / `${clientScope}`) — c'est la convention établie. Mais les **dialogs de
> formulaire ne la portent pas**.

**Deux solutions (à trancher — Arbitrage Portails) :**

- **P1 — Classe de scope sur `<body>`** *(recommandé, DRY)* : le layout admin/client ajoute
  `admin-theme`/`client-theme` sur `document.body` (via effet, avec cleanup au démontage). Combinée
  au `.dark` de `next-themes` sur `<html>`, **tous les portails héritent** scope + dark
  automatiquement. Un seul point, zéro répétition.
- **P2 — Scope sur chaque content portalisé** *(cohérent avec le Sheet actuel)* : passer la classe
  de scope à chaque `DialogContent`/`PopoverContent` + `<Toaster>` Sonner. Explicite mais répétitif
  (faut le faire partout, risque d'oubli).

→ Ma reco : **P1**. À valider.

### 7.3 Scrollbar & toasts

- Scrollbar (`globals.css:587-602`) : track `#F4F9FD` / thumb `#4DA6D9` **global**. Cosmétique ;
  optionnellement ajouter un `.dark ::-webkit-scrollbar-track { background:#1A242E }`. Faible prio.
- Sonner (`ui/sonner.tsx`) : déjà piloté par `var(--popover)`/`var(--border)` + `next-themes` →
  **exemplaire**, s'adapte seul (à condition que le scope l'atteigne, cf. § 7.2).

---

## 8. Plan d'attaque proposé (Phases 1→7) — rappel

1. **Phase 1** — Provider `next-themes` scopé admin/client (`attribute="class"`, `defaultTheme="system"`,
   `enableSystem`, `themes=['light','dark']`, `storageKey="cete-theme"`), no-flash, **scope sur `<body>`
   pour les portails (P1)**, retrait du `.dark` générique, isolation public vérifiée.
2. **Phase 2** — Tokens dark dans `globals.css` (§ 3), correctif `h1…h6`, migration des hardcodes
   scopés admin/client (§ 6.1).
3. **Phase 3** — `ThemeToggle` (dropdown 3 états Sun/Moon/Monitor) dans les 2 sidebars.
4. **Phase 4** — Édits composants partagés (`--surface-shadow`, `--vigi-*-ink` dans `rating-seal`).
5. **Phases 5/6** — Validation pages admin / client.
6. **Phase 7** — Build/lint/typecheck, WCAG, persistance, isolation, rapport.

---

## 9. Arbitrages — DÉCISIONS VERROUILLÉES (validées par le client)

| # | Sujet | ✅ Retenu |
|---|---|---|
| **Logo** | Traitement du PNG en dark (baseline navy invisible) | **« Fais ce que tu peux »** → implémentation **L2** (plaque claire en dark dans la masthead), seule option pleinement livrable sans nouvel asset graphique. Si un PNG dark est fourni plus tard, swap trivial. |
| **Portails** | Scope des dialogs/toasts portalisés en dark | **P1** — classe de scope sur `<body>` (tous les portails héritent scope + dark). |
| **Vigi D** | `-fill` dark de la note D | **`#DC2626`** (éclairci, meilleure séparation du fond). |
| **Toggle** | Emplacement dans la sidebar | **Bas, près du bloc profil** (cohérent avec le bloc « compte » existant des 2 sidebars). |
| **Palette** | Valeurs § 3 | Réputées validées (arbitrages tranchés). Ajustements ponctuels possibles en Phases 5-7. |

---

## 10. Checklist Phase 0

- [x] Confirmation stack (Next 16, Tailwind v4, shadcn, **next-themes déjà installé**)
- [x] Inventaire complet des tokens clairs (sémantiques, `--admin-*`, Vigi, charts) + usage
- [x] État des lieux du dark existant (bloc admin incomplet, **0 bloc client**, `.dark` générique, `h1…h6`)
- [x] Palette dark proposée **pour chaque token** avec hex précis + rationale
- [x] Nouveaux tokens identifiés (`--vigi-*-ink`, `--surface-shadow`)
- [x] Ratios de contraste WCAG AA vérifiés sur les paires critiques (toutes ✅)
- [x] Traitement du logo CETé décidé (PNG, baseline navy → L1/L2, à arbitrer)
- [x] Composants à risque identifiés (scan exhaustif : FileUploadField, shadows partagées, Vigi, etc.)
- [x] Cas spéciaux tranchés (QR = icône placeholder, PDF, Leaflet public, video-embed/scrim à garder)
- [x] Stratégie d'isolation du public + **portails Radix** documentée
- [x] Document `docs/dark-mode-audit.md` livré — **aucune ligne de code écrite**

> **STOP Phase 0.** En attente de ta validation de la palette (§ 3) et des arbitrages (§ 9)
> avant de toucher au code (Phase 1).
