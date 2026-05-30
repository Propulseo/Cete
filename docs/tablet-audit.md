# Audit responsive tablette (768-1279px) — CETe

**Date:** 2026-05-29
**Plage cible:** 768px a 1279px (md a xl-1 Tailwind)
**Breakpoints Tailwind v4:** sm:640, md:768, lg:1024, xl:1280
**Appareils cibles:** Surface Pro/Go/Pro X portrait (768-912px) et paysage (1024-1366px)

> Note: La plage cible couvre DEUX breakpoints Tailwind: `md` (768-1023) ET `lg` (1024-1279).
> Le desktop preserve est `xl` (1280+) dans la terminologie Tailwind.

---

## Recapitulatif chiffre

| Criticite | Nombre |
|-----------|--------|
| **Critical** | 7 |
| **Major** | 12 |
| **Minor** | 10 |
| **Total** | 29 |

---

## Problemes par page

---

### 1. COMPOSANTS GLOBAUX (Header, Footer, Layouts)

#### Header (`src/components/common/Header.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| G1 | **Nav desktop deborde a md (768px)** | **critical** | 768-~950px | La nav desktop s'affiche a `md:flex` (768px). A cette largeur, logo (~80px) + ml-28 (112px) + 5 liens nav avec gap-8 (~413px) + 2 boutons CTA (~200px) + language switcher (~40px) = ~845px dans 720px disponibles. Debordement horizontal garanti. Le hamburger devrait rester actif jusqu'a au moins lg (1024px). |
| G2 | **Boutons CTA header trop petits** | major | 768-1279px | `size="sm"` = ~32px de hauteur. Sous le seuil tactile de 44px. |
| G3 | **Espacement ml-28 fixe entre logo et nav** | major | 768-1279px | 112px de marge fixe quelle que soit la largeur. Gaspille de l'espace sur tablette, manque sur mobile. |

#### Footer (`src/components/common/Footer.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| G4 | **Cibles tactiles footer < 44px** | major | 768-1279px | Liens footer en `text-sm` (14px) avec `gap-2`/`gap-3` vertical. Cible effective ~24px hauteur. |
| G5 | **Hack centrage "Made by" md:-ml-40** | minor | 768-1279px | Marge negative de 160px pour centrer texte. Fragile, ne s'adapte pas aux differentes largeurs. |
| G6 | **Padding footer fixe px-4** | minor | 768-1279px | 16px horizontal a toutes les largeurs. Devrait etre 24-32px sur tablette. |

#### Layouts (public, client)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| G7 | **Aucune classe responsive dans les layouts publics** | minor | — | Les layouts `(public)/layout.tsx` et `[locale]/layout.tsx` n'ont aucune classe responsive. Le conteneur principal n'a ni max-width ni padding-x dedie tablette. |

---

### 2. PAGE ACCUEIL (`/`)

#### HomeHero (`src/components/sections/home/HomeHero.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| H1 | **Orbe Vigi-Score masque jusqu'a lg** | major | 768-1023px | `hidden lg:flex` : la visualisation est totalement invisible de 768 a 1023px. Gros trou visuel sur tablette portrait. |
| H2 | **Grille lg:grid-cols-2 sans palier md** | minor | 768-1023px | Contenu en colonne unique jusqu'a 1024px. Acceptable car l'orbe est masque, mais le texte est seul sur toute la largeur. |

#### HomeStats (`src/components/sections/home/HomeStats.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| H3 | **Grille 2 cols direct a 4 cols a lg** | minor | 768-1023px | `grid-cols-2 lg:grid-cols-4`. Pas de palier 3 colonnes. Acceptable mais les 2 colonnes paraissent larges sur tablette paysage. |

#### HomeServices (`src/components/sections/home/HomeServices.tsx`)

Stable. `md:grid-cols-2` fonctionne bien sur tablette.

#### HomePillars (`src/components/sections/home/HomePillars.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| H4 | **3 colonnes a md serrees en portrait** | minor | 768-820px | `md:grid-cols-3` avec p-8 interne. Chaque colonne ~210px utile. Lisible mais serre pour le contenu. |

#### HomeADN (`src/components/sections/home/HomeADN.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| H5 | **Grille lg:grid-cols-2 sans palier md** | major | 768-1023px | Contenu texte + visualisation 3x4 empiles en colonne unique sur toute la plage tablette portrait. La visualisation notation est poussee tout en bas. |

#### HomeOrganizations (`src/components/sections/home/HomeOrganizations.tsx`)

Stable. Carrousel horizontal avec fade edges responsives `md:w-32`.

#### HomeTestimonials (`src/components/sections/home/HomeTestimonials.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| H6 | **Layout lg:grid-cols-5 sans palier md** | major | 768-1023px | Video et citation empilees verticalement jusqu'a 1024px. Tres long verticalement en portrait tablette. |

#### HomeFounders (`src/components/sections/home/HomeFounders.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| H7 | **Grille lg:grid-cols-2 sans palier md** | major | 768-1023px | Photo grid (2x2) et texte empiles en colonne unique. Sur tablette paysage, la grille photos occupe toute la largeur inutilement. |

#### HomeCTA (`src/components/sections/home/HomeCTA.tsx`)

Stable. Boutons en `sm:flex-row`, texte responsive.

---

### 3. PAGE A PROPOS (`/a-propos`)

#### AboutHero (`src/components/sections/about/AboutHero.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| A1 | **Saut de typo text-5xl a md:text-7xl** | major | 768px | Saut de 48px a 72px. Trop brutal. Meme probleme que celui corrige sur HomeHero (text-6xl retenu). |

#### AboutOriginStory (`src/components/sections/about/AboutOriginStory.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| A2 | **Timeline visible a md mais colonne etroite** | minor | 768-820px | La timeline 2 colonnes alternees s'active a md. A 768px les colonnes sont serrees mais fonctionnelles. |

#### AboutStats (`src/components/sections/about/AboutStats.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| A3 | **Grille 2 cols a 4 cols a md** | major | 768px | `grid-cols-2 md:grid-cols-4`. Les 4 stat boxes a 768px font ~165px chacune. Tres serre pour icone + chiffre + label. |

#### AboutFounders, AboutValues, AboutGouvernance

Stables. Grilles `md:grid-cols-2` ou `md:grid-cols-3` bien calibrees.

#### AboutWorldMap (`src/components/sections/about/AboutWorldMap.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| A4 | **Hauteur carte fixe 500px** | minor | 768-1279px | `h-[500px]` fixe. Pas de hauteur responsive. En portrait tablette, 500px occupe ~50% de l'ecran. |
| A5 | **Marqueurs carte < 44px tactile** | minor | 768-1279px | Marqueurs Leaflet 24-28px. Sous le seuil tactile recommande. |

#### AboutCTA

Stable.

---

### 4. PAGE EXPERTISE (`/expertise`)

#### ExpertiseHero (`src/components/sections/expertise/ExpertiseHero.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| E1 | **Saut de typo text-5xl a md:text-7xl** | major | 768px | Meme probleme que AboutHero. |

#### ExpertiseVigiScore (`src/components/sections/expertise/ExpertiseVigiScore.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| E2 | **3 colonnes criteres a md serrees** | minor | 768-820px | `md:grid-cols-3` avec p-8 interne. ~237px utile par colonne. Texte serre mais lisible. |

#### ExpertiseTertiles (`src/components/sections/expertise/ExpertiseTertiles.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| E3 | **3 colonnes tertiles a md serrees** | minor | 768-820px | `md:grid-cols-3` avec p-8 et contenu riche (icone + h3 + citation + liste + badge). ~230px par colonne, dense. |

#### ExpertiseCertificate (`src/components/sections/expertise/ExpertiseCertificate.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| E4 | **Grille lg:grid-cols-2 sans palier md** | major | 768-1023px | Certificat mockup et description empiles. Sur tablette, les deux blocs prennent toute la largeur et la page est tres longue. |

#### ExpertiseComparison (`src/components/sections/expertise/ExpertiseComparison.tsx`)

Stable. Grille `md:grid-cols-[1fr_1fr_1fr]` avec fallback mobile labels. Fonctionne a 768px+.

#### ExpertiseVigilance, ExpertiseServices, ExpertiseCTA

Stables.

---

### 5. PAGE SERVICES (`/services`)

#### ServicesHero (`src/components/sections/services/ServicesHero.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| S1 | **Saut de typo text-5xl a md:text-7xl** | major | 768px | Meme probleme que les autres heros. |

#### ServicesCatalog (`src/components/sections/services/ServicesCatalog.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| S2 | **Pas de grille tablette — empilement vertical** | **critical** | 768-1023px | `grid lg:grid-cols-12` uniquement. Sous lg, featured card (7 cols) et secondary cards (5 cols) s'empilent verticalement. Page tres longue sur tablette portrait. |

#### ServicesPillars (`src/components/sections/services/ServicesPillars.tsx`)

Stable. `md:grid-cols-2` fonctionne bien.

#### ServicesProcess (`src/components/sections/services/ServicesProcess.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| S3 | **4 colonnes process a md tres serrees** | **critical** | 768-912px | `hidden md:block` + `grid grid-cols-4`. A 768px, chaque step fait ~150px avec cercle 64px + titre + description. Texte illisible, debordements potentiels. |

#### ServicesApproach (`src/components/sections/services/ServicesApproach.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| S4 | **Decalage vertical md:mt-16/md:mt-32 en 3 cols** | minor | 768-912px | `md:grid-cols-3` avec stagger vertical. Les 3 colonnes etroites plus le decalage creent un layout tres haut et desequilibre en portrait tablette. |

#### ServicesCTA

Stable.

---

### 6. BLOG (`/blog`, `/blog/[slug]`)

#### BlogFeatured (`src/components/sections/blog/BlogFeatured.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| B1 | **Pas de grille md — empilement jusqu'a lg** | **critical** | 768-1023px | `lg:grid-cols-12` uniquement. L'article featured est en pleine largeur empile jusqu'a 1024px. Gaspille d'espace sur tablette. |

#### BlogGrid (`src/components/sections/blog/BlogGrid.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| B2 | **md:grid-cols-2 avec gap-8 serre a 768px** | minor | 768-820px | 2 colonnes avec 32px gap. Chaque card ~336px. Acceptable mais serre. |

#### ArticleLayout, VizActContent

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| B3 | **Article prose max-w-3xl (768px)** | minor | 768px | Image featured et prose a max-w-3xl = 768px, egal a la largeur viewport. Pas de marge visuelle en portrait tablette etroit. |

#### BlogHero, BlogCTA

Stables.

---

### 7. CONTACT (`/contact`)

#### ContactMain (`src/components/sections/contact/ContactMain.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| C1 | **Pas de grille md — formulaire + sidebar empiles jusqu'a lg** | **critical** | 768-1023px | `lg:grid-cols-2`. Formulaire et sidebar empiles verticalement sur toute la plage tablette portrait. Sidebar tres longue quand empilee sous le formulaire. |

#### ContactTrust (`src/components/sections/contact/ContactTrust.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| C2 | **3 colonnes md:grid-cols-3 avec gap-8 tres serrees** | minor | 768-820px | ~216px par colonne avec icone + texte. Lisible mais dense. |

#### ContactFormFields

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| C3 | **Checkbox h-4 w-4 = 16px** | minor | 768-1279px | Cible tactile checkbox sous 44px. |

#### ContactHero, ContactSidebar, ContactMap, ContactForm

Stables (heritent du layout ContactMain).

---

### 8. CGU (`/cgu`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| L1 | **prose-lg fixe a toutes les tailles** | minor | 768-1279px | Taille de prose fixe. Pas de `md:prose-lg` conditionnel. Line-length acceptable grace a `max-w-4xl`. |

---

### 9. CONNEXION (`/connexion`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| X1 | **max-w-md (448px) trop etroit sur tablette** | major | 768-1279px | Formulaire centre dans 448px avec marges laterales massives. En paysage tablette, >60% de l'ecran est vide. |

---

### 10. VERIFIER (`/verifier/[id]`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| V1 | **CertificateNotFound max-w-lg (512px)** | minor | 768-1279px | Conteneur fixe etroit. Espace perdu sur tablette. |

---

### 11. ESPACE CLIENT (`/client/*`)

#### Client Layout + Sidebar

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| CL1 | **Sidebar fixe w-64 (256px) sans variante tablette** | **critical** | 768-1023px | A 768px, la sidebar occupe 33% de l'ecran. Le contenu principal n'a que 512px. Aucun mecanisme de drawer, hamburger ou collapse. |
| CL2 | **main ml-64 hardcode** | **critical** | 768-1023px | Marge gauche fixe de 256px. Combinee avec p-8 (32px padding) dans les pages, ne laisse que 448px de contenu utile a 768px. |

#### Dashboard (`src/app/[locale]/client/dashboard/page.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| CL3 | **p-8 fixe sur 512px de contenu** | major | 768-912px | 32px de padding chaque cote dans un conteneur de 512px = 448px utile. |
| CL4 | **KPI grid sm:grid-cols-2 lg:grid-cols-4** | major | 768-1023px | A 768px viewport, le contenu fait 512px. `sm:grid-cols-2` s'active (>640px viewport), mais chaque KPI n'a que ~240px. |

#### DocumentsList (`src/components/features/client/DocumentsList.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| CL5 | **Table 6 colonnes dans 512px** | **critical** | 768-1023px | 6 colonnes avec px-6 padding chacune. Padding seul = 144px. Reste 368px pour le contenu de 6 colonnes = ~61px par colonne. Dates, badges, boutons actions debordent ou s'ecrasent. Aucun `overflow-x-auto` ni colonnes masquees en responsive. |
| CL6 | **Aucune classe responsive dans le tableau** | major | 768-1279px | Zero breakpoint. Le meme tableau est rendu identiquement a 512px et a 1920px. |

#### Capsules/Guides/Newsletters/Carnets/Ressources

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| CL7 | **Pages utilisant DocumentsList** | major | 768-1023px | newsletters, guides, carnets heritent du probleme CL5/CL6. |
| CL8 | **Ressources grid md:grid-cols-2 dans 512px** | minor | 768px | 2 colonnes a 768px viewport mais seulement 512px dispo. Chaque card fait ~244px. Dense mais fonctionnel. |

#### Profile

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| CL9 | **lg:grid-cols-2 seulement** | minor | 768-1023px | Formulaire profile empile en 1 colonne jusqu'a 1024px. Acceptable sur tablette mais espace sous-utilise. |

---

### 12. COMPOSANTS PARTAGES

#### ADNTeaser (`src/components/sections/ADNTeaser.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| P1 | **lg:grid-cols-2 sans palier md** | major | 768-1023px | Texte + visualisation cible empiles. Composant tres long verticalement sur tablette portrait. |

#### ProcessSection (`src/components/sections/ProcessSection.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| P2 | **md:grid-cols-4 serre en tablette portrait** | minor | 768-820px | 4 steps horizontaux a 768px. Cercles 64px + texte dans ~150px. Fonctionnel mais dense. |

#### EvaluationForm (`src/components/sections/EvaluationForm.tsx`)

| # | Probleme | Criticite | Largeurs | Detail |
|---|----------|-----------|----------|--------|
| P3 | **sm:grid-cols-2 au lieu de md** | minor | 640-767px | Les champs passent a 2 colonnes des 640px au lieu de 768px. Legerement serre sur petit ecran mais hors plage tablette. |

---

## Synthese par criticite

### Critical (7)

| ID | Composant | Resume |
|----|-----------|--------|
| G1 | Header | Nav desktop deborde a 768-950px |
| S2 | ServicesCatalog | Pas de grille tablette, empilement vertical |
| S3 | ServicesProcess | 4 colonnes dans ~600px, texte illisible |
| B1 | BlogFeatured | Pas de grille md, empilement jusqu'a lg |
| C1 | ContactMain | Formulaire + sidebar empiles jusqu'a lg |
| CL1/CL2 | Client sidebar + layout | Sidebar fixe 256px, contenu 512px a 768px |
| CL5 | DocumentsList | Table 6 colonnes dans 512px, debordement |

### Major (12)

| ID | Composant | Resume |
|----|-----------|--------|
| G2 | Header CTA | Boutons < 44px tactile |
| G3 | Header | ml-28 fixe non responsive |
| G4 | Footer | Liens < 44px tactile |
| H1 | HomeHero | Orbe masque 768-1023px |
| H5 | HomeADN | Pas de md:grid-cols-2 |
| H6 | HomeTestimonials | Pas de md layout |
| H7 | HomeFounders | Pas de md:grid-cols-2 |
| A1 | AboutHero | Saut typo 5xl a 7xl |
| A3 | AboutStats | 4 cols a md, 165px/col |
| E1/S1 | Expertise/Services Hero | Saut typo 5xl a 7xl |
| E4 | ExpertiseCertificate | Pas de md:grid-cols-2 |
| X1 | Connexion | max-w-md trop etroit |
| CL3/CL4 | Dashboard | Padding + KPI grid serres |
| CL6/CL7 | DocumentsList pages | Tableau sans responsive |
| P1 | ADNTeaser | Pas de md:grid-cols-2 |

### Minor (10)

| ID | Composant | Resume |
|----|-----------|--------|
| G5 | Footer | Hack centrage -ml-40 |
| G6 | Footer | Padding px-4 fixe |
| G7 | Layouts | Aucune classe responsive |
| H2 | HomeHero | Grid lg sans md |
| H3 | HomeStats | 2 a 4 cols sans intermediaire |
| H4 | HomePillars | 3 cols serrees portrait |
| E2/E3 | VigiScore/Tertiles | 3 cols denses a md |
| S4 | ServicesApproach | Stagger mt-16/mt-32 en 3 cols |
| A2 | AboutOriginStory | Timeline serree a 768px |
| A4/A5 | AboutWorldMap | Hauteur fixe + marqueurs petits |
| B2/B3 | BlogGrid/ArticleLayout | Grid serree, prose pleine largeur |
| C2/C3 | ContactTrust/FormFields | 3 cols denses, checkbox 16px |
| L1 | CGU | prose-lg fixe |
| V1 | CertificateNotFound | max-w-lg etroit |
| CL8/CL9 | Ressources/Profile | Grid dense, lg seulement |
| P2/P3 | ProcessSection/EvalForm | 4 cols denses, sm au lieu de md |

---

## Ordre de traitement propose

### Lot 1 — Composants globaux (Header, Footer, Layouts)
**Priorite: BLOQUANT** — un probleme ici affecte toutes les pages.
- G1: Passer le hamburger de md a lg (ou breakpoint custom ~1024px)
- G2/G3: Redimensionner nav et CTA pour tablette
- G4/G5/G6: Footer touch targets et centering fix

### Lot 2 — Accueil
**Priorite: HAUTE** — page d'entree principale.
- H1: Afficher une version simplifiee de l'orbe a md, ou ameliorer le layout 1-col
- H5/H6/H7: Ajouter md:grid-cols-2 aux sections ADN, Testimonials, Founders
- H4: Ajuster grille Pillars en portrait

### Lot 3 — Pages institutionnelles (A propos, Expertise, Services)
**Priorite: HAUTE**
- A1/E1/S1: Corriger saut typo heroes (md:text-6xl comme HomeHero)
- S2: Ajouter grille tablette a ServicesCatalog
- S3: Passer process de md:grid-cols-4 a md:grid-cols-2 lg:grid-cols-4
- E4: Passer ExpertiseCertificate a md:grid-cols-2
- A3: Passer AboutStats a md:grid-cols-3 ou md:grid-cols-2
- S4: Limiter stagger a lg seulement
- P1: Ajouter md:grid-cols-2 a ADNTeaser

### Lot 4 — Blog, Contact, CGU, Connexion, Verifier
**Priorite: MOYENNE**
- B1: Ajouter md:grid-cols-2 a BlogFeatured
- C1: Ajouter md:grid-cols-2 a ContactMain
- X1: Elargir formulaire connexion sur tablette

### Lot 5 — Espace client
**Priorite: HAUTE** (criticite des problemes sidebar + tableau)
- CL1/CL2: Sidebar collapsible ou drawer en md, ml-64 conditionnel
- CL5/CL6: Table responsive (colonnes masquees ou scroll horizontal controle)
- CL3/CL4: Padding et KPI grid adaptes
- CL7/CL8: Propagation des corrections

### Lot 6 — Verifications finales et rapport

---

## Notes pour decision

### Espace client sidebar (CL1/CL2)
La sidebar fixe w-64 est le probleme le plus structurel. Trois options:
1. **Drawer overlay** en md (hamburger cote client, comme le mobile public) — Impact UX: perd la navigation persistante
2. **Sidebar icones seules** en md (~64px au lieu de 256px) — Impact UX: navigation presente mais reduite
3. **Sidebar collapsible** avec toggle — Impact: plus complexe a implementer mais meilleure UX

Je recommande l'option 1 (drawer) pour md portrait (768-1023px) et l'option 2 (icones) pour lg paysage (1024-1279px), mais j'attends ta validation avant de toucher a ce composant.

### DocumentsList (CL5)
Deux options:
1. **Masquer colonnes secondaires** (Size, Rights) en tablette via `hidden md:table-cell lg:table-cell`
2. **Wrapper overflow-x-auto** pour scroll horizontal controle

Je recommande l'option 1 (colonnes masquees) pour un meilleur UX tactile, avec l'option 2 en fallback. A valider.

### Header (G1)
L'extension du hamburger de md a lg est la correction la plus impactante visuellement. A 1024px en paysage, la nav complete devrait tenir. Je propose `lg:flex` au lieu de `md:flex` pour le switch hamburger/desktop.
