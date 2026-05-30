# Rapport de livraison — Mode nuit admin + espace client

> Chantier mode nuit livré sur `/admin/*` et `/client/*`. Le **site public reste en clair**
> (hors périmètre, jamais touché). Document de clôture (Phase 7). Audit & palette : voir
> [`docs/dark-mode-audit.md`](./dark-mode-audit.md).

## 1. Résultat des vérifications

| Vérification | Résultat |
|---|---|
| `npx next build` | ✅ **exit 0** — « Compiled successfully », 63 pages générées (admin + client + public) |
| `npx tsc --noEmit` | ✅ **clean** (zéro erreur) |
| `npx eslint` (fichiers touchés) | ✅ **clean** (zéro warning) |
| `node scripts/lint-lines.js` | ✅ **pass** (aucun fichier > 250 lignes) |

## 2. Architecture livrée

- **`next-themes` scopé** : provider `src/components/providers/ThemeProvider.tsx` monté
  **uniquement** dans les layouts admin et client (`attribute="class"`, `defaultTheme="system"`,
  `enableSystem`, `themes=['light','dark']`, `storageKey="cete-theme"`, `disableTransitionOnChange`).
  Le no-flash est assuré par le script injecté par next-themes (SSR), le wrapper de contenu
  portant déjà la classe de scope au premier paint.
- **P1 — scope sur `<body>`** : le provider miroite la classe de scope (+ la variable de police
  serif) sur `document.body` pendant que la zone est montée, avec **cleanup au démontage**. Les
  portails Radix (Dialog/Sheet/Popover) et le Toaster Sonner racine — qui se rendent hors du
  wrapper en flux — héritent ainsi des tokens scopés et de la cascade `.dark`. **Vérifié** :
  `DialogContent` (`bg-background`) aurait rendu **blanc** en dark sans ce miroir.
- **Toggle** : `src/components/shared/theme-toggle.tsx`, contrôle segmenté 3 états
  (Clair / Système / Sombre, icônes Sun/Monitor/Moon), accessible (`role="radiogroup"`,
  `aria-checked`, focus visible), hydration-safe via `useSyncExternalStore` (pas de
  setState-in-effect). Intégré **en bas, près du profil** dans les deux sidebars.

### Isolation du site public — triple verrou

1. Provider monté **seulement** dans admin/client.
2. Tokens dark **scopés** `.dark .admin-theme` / `.dark .client-theme` → une page publique (sans
   classe de scope) ne reçoit **aucun** override, même si `.dark` traîne sur `<html>`.
3. **Variant Tailwind `dark:` scopé** aux mêmes classes (`globals.css` `@custom-variant`) → même
   les utilitaires `dark:` des primitives partagées restent inertes sur le public.
4. **Bloc `.dark { }` générique non scopé SUPPRIMÉ** (c'était le seul vecteur de fuite CSS).

## 3. Palette dark finale (clair → dark)

| Token | Clair | Dark | Token | Clair | Dark |
|---|---|---|---|---|---|
| `--background` | `#F8F9FB` | `#0E141B` | `--admin-sidebar` | `#FCFCFD` | `#111921` |
| `--foreground` | `#1A2940` | `#E7EDF3` | `--admin-sidebar-hover` | `#EAF1F6` | `#1C2A37` |
| `--card` | `#FFFFFF` | `#131B24` | `--admin-line` | `#E6ECF1` | `#243240` |
| `--popover` | `#FFFFFF` | `#131B24` | `--admin-blue-ink` | `#1A7AB5` | `#4DA6D9` |
| `--muted` | `#EEF2F6` | `#1A242E` | `--admin-blue-link` | `#0D5A8A` | `#87C4E8` |
| `--muted-foreground` | `#4A6580` | `#9DB0C2` | `--admin-pos` | `#15803D` | `#4ADE80` |
| `--secondary` | `#F1F4F8` | `#1A242E` | `--admin-neg` | `#B91C1C` | `#F87171` |
| `--accent` | `#EAF1F6` | `#1C2A37` | `--admin-stable` | `#8AA5BE` | `#8AA5BE` |
| `--primary` | `#1A7AB5` | `#4DA6D9` | `--admin-urgent` | `#E8630A` | `#F59542` |
| `--primary-foreground` | `#FFFFFF` | `#08111A` | `--surface-shadow` | navy 4% | `rgba(0,0,0,.45)` |
| `--border` / `--input` | `#E6ECF1` | `#243240` | `--vigi-a-fill` | `#15803D` | `#15803D` |
| `--ring` | `#1A7AB5` | `#4DA6D9` | `--vigi-b-fill` | `#A16207` | `#A16207` |
| `--destructive` | `#B91C1C` | `#DC2626` | `--vigi-c-fill` | `#C2410C` | `#C2410C` |
| `--vigi-fg` | `#FFFFFF` | `#FFFFFF` | `--vigi-d-fill` | `#B91C1C` | **`#DC2626`** |

**Vigi-Score — nouveaux tokens `--vigi-*-ink`** (lettre/glyphe du petit sceau ; `= -fill` en clair,
éclairci en dark) : A `#4ADE80` · B `#FBBF24` · C `#FB923C` · D `#F87171`.
**Teintes `-tint`** : 12 % du `-fill` en clair → **18 % du hue clair** en dark.

## 4. Contrastes WCAG (dark) — toutes les paires critiques ≥ AA

| Paire | Ratio | Paire | Ratio |
|---|---|---|---|
| foreground / background | 15.7:1 (AAA) | Blanc / vigi-A `#15803D` | 5.0:1 |
| foreground / card | 14.8:1 (AAA) | Blanc / vigi-B `#A16207` | 4.9:1 |
| muted-foreground / card | 7.8:1 (AAA) | Blanc / vigi-C `#C2410C` | 5.2:1 |
| primary (texte) / card | 6.4:1 | Blanc / vigi-D `#DC2626` | 4.8:1 |
| primary-fg `#08111A` / primary | 7.0:1 | Tendance + `#4ADE80` / card | 10.0:1 |
| admin-blue-link `#87C4E8` / card | 9.2:1 | Tendance − `#F87171` / card | 6.3:1 |
| admin-urgent `#F59542` / card | 7.7:1 | Blanc / destructive `#DC2626` | 4.8:1 |

## 5. Ajustements composant par composant

| Composant | Changement dark |
|---|---|
| `globals.css` | Bloc dark unifié admin+client (tous tokens) ; `--vigi-*-ink` + `--surface-shadow` ajoutés aux scopes clairs ; **`h1-h6 { color }` → `var(--foreground)`** (titres ne sont plus navy-sur-navy) ; variant `dark:` scopé ; `.dark` générique retiré |
| `shared/rating-seal.tsx` | Petit sceau `inline-sm` + glyphe redondant lisent `var(--vigi-*-ink)` (éclairci en dark) au lieu du `-fill` sombre → restent lisibles sur la teinte sombre |
| `shared/surface-card.tsx` · `shared/kpi-tile.tsx` | Ombre `rgba(26,41,64,0.04)` (invisible sur dark) → `shadow-[var(--surface-shadow)]` (vraie ombre en dark) |
| `features/admin/ui/FileUploadField.tsx` | **Réécrit en tokens** (fonds blancs/bleu-pâle + encre navy → `bg-card`/`bg-muted`/`text-foreground`/`text-muted-foreground`/`border-border`/`text-primary`/`hover:bg-accent`). Corrige le pire foyer (réutilisé par 3 dialogs) |
| `CertificateFormDialog` / `DocumentFormDialog` / `ResourceFormDialog` / `clients/[id]/documents` | Icônes/textes hex one-off → `text-primary` / `text-muted-foreground` |
| `AdminSidebar` / `ClientSidebar` | `ThemeToggle` ajouté près du profil ; **logo sur plaque claire en dark (L2)** via `dark:bg-[#F4F9FD]` (la baseline navy du PNG reste lisible sur le rail sombre) |
| layouts admin/client | Provider + plaque logo dark sur la top-bar mobile |

## 6. Dette & recommandations

- **Logo (L2 retenu, « fais ce que tu peux »)** : faute d'outil pour produire un PNG dark de
  qualité, le logo est posé sur une **plaque claire** en dark (sidebar + top-bar mobile). Si un
  `logo-cete-adn-dark.png` (baseline en `#E7EDF3`) est fourni plus tard, le swap est trivial
  (`useTheme()`/`resolvedTheme` → `src`) et on retire la plaque.
- **Validation visuelle (Phases 5-6)** : exécutée en **statique** (re-scan exhaustif des hardcodes
  → 0 restant en admin/client/shared ; tokenisation vérifiée ; contrastes calculés). Une **passe
  œil dans le navigateur** (toggle light↔dark↔system sur chaque page, no-flash au refresh) reste
  recommandée avant prod — je n'ai pas d'accès navigateur en autonome.
- **Toaster Sonner** : monté au layout racine (hors provider scopé) → sa prop `theme` vaut
  `"system"` par défaut, mais ses couleurs viennent de `var(--popover/--border)` donc le rendu dark
  est correct via le scope `<body>`. Nuance cosmétique seulement.
- **Scrollbar** (`globals.css`) : reste claire (token global non scopé). Faible priorité ;
  optionnel `.dark ::-webkit-scrollbar-*`.
- **Hors périmètre, intacts** : pages `/connexion` et `/reset-password` (auth publique, pas sous
  admin/client) gardent leur hero hardcodé ; `video-embed` (letterbox navy) et le scrim
  `bg-black/50` des dialogs/sheets (primitives partagées avec le public) **non touchés** pour ne
  pas altérer le site public — leurs valeurs fonctionnent en clair comme en dark.

## 7. Étendre le mode nuit au site public (plus tard)

C'est un **autre chantier**. Pour l'activer : monter le provider plus haut (ou ajouter un scope
`.public-theme`), définir un bloc dark `:root`-équivalent scopé public, traiter les décorations
(`bg-bubbles-pattern`, `bg-hero-gradient`, `glow-*`), la carte Leaflet (tuiles dark), et les pages
`/connexion`/`/reset-password`. Le variant `dark:` devra alors inclure le scope public.

## 8. Checklist Phase 7

- [x] build / lint / typecheck / lint:lines **clean**
- [x] Contrastes WCAG AA validés (toutes paires critiques)
- [x] Toggle 3 états fonctionnel, accessible, hydration-safe, dans les 2 sidebars
- [x] Isolation site public triple-verrouillée (provider scopé + tokens scopés + variant scopé + `.dark` générique retiré)
- [x] Tous les hardcodes admin/client/shared migrés vers tokens
- [x] Vigi-Score, tendances, ombres, logo traités en dark
- [x] Rapport livré
