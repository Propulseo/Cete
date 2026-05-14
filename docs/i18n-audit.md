# Audit i18n — CETe Phase 0

> Genere automatiquement. Source de verite pour toutes les phases de migration i18n.

---

## 1. Arborescence des routes et mapping slugs FR/EN

### Routes publiques `(public)/`

| Route FR | Slug EN propose | Fichier | Metadata |
|----------|-----------------|---------|----------|
| `/` | `/` | `(public)/page.tsx` | Herite root |
| `/a-propos` | `/about` | `(public)/a-propos/page.tsx` | Herite root |
| `/expertise` | `/expertise` | `(public)/expertise/page.tsx` | Herite root |
| `/services` | `/services` | `(public)/services/page.tsx` | Herite root |
| `/contact` | `/contact` | `(public)/contact/page.tsx` | `export const metadata` |
| `/blog` | `/blog` | `(public)/blog/page.tsx` | `export const metadata` |
| `/blog/[slug]` | `/blog/[slug]` | `(public)/blog/[slug]/page.tsx` | `generateMetadata` |
| `/cgu` | `/terms` | `(public)/cgu/page.tsx` | `export const metadata` |
| `/verifier/[id]` | `/verify/[id]` | `(public)/verifier/[id]/page.tsx` | Herite root |

### Route auth

| Route FR | Slug EN propose | Fichier |
|----------|-----------------|---------|
| `/connexion` | `/login` | `connexion/page.tsx` |

### Routes client (protegees)

Slugs identiques FR/EN (interface interne, pas indexee SEO).

| Route | Fichier |
|-------|---------|
| `/client` | `client/page.tsx` (redirect -> dashboard) |
| `/client/dashboard` | `client/dashboard/page.tsx` |
| `/client/profile` | `client/profile/page.tsx` |
| `/client/newsletters` | `client/newsletters/page.tsx` |
| `/client/capsules` | `client/capsules/page.tsx` |
| `/client/guides` | `client/guides/page.tsx` |
| `/client/carnets` | `client/carnets/page.tsx` |
| `/client/ressources` | `client/ressources/page.tsx` |

### Routes admin (protegees)

Slugs identiques FR/EN (interface interne, pas indexee SEO).

| Route | Fichier |
|-------|---------|
| `/admin` | `admin/page.tsx` (redirect -> dashboard) |
| `/admin/dashboard` | `admin/dashboard/page.tsx` |
| `/admin/blog` | `admin/blog/page.tsx` |
| `/admin/documents` | `admin/documents/page.tsx` |
| `/admin/ressources` | `admin/ressources/page.tsx` |
| `/admin/organizations` | `admin/organizations/page.tsx` |
| `/admin/team` | `admin/team/page.tsx` |
| `/admin/users` | `admin/users/page.tsx` |
| `/admin/settings` | `admin/settings/page.tsx` |

### Layouts

| Fichier | Role | Contient du texte FR |
|---------|------|---------------------|
| `app/layout.tsx` | Root (html, body, fonts, Toaster, metadata globale) | Oui — metadata + `lang="fr"` |
| `app/(public)/layout.tsx` | Public (Header + Footer) | Non |
| `app/client/layout.tsx` | Client (auth guard, sidebar) | Oui — "Chargement..." |
| `app/admin/layout.tsx` | Admin (auth guard, sidebar) | Oui — 10+ labels sidebar |

---

## 2. Composants a migrer — inventaire par groupe

### 2.1 common (Header, Footer)

| Fichier | "use client" | Strings FR | Exemples |
|---------|-------------|------------|----------|
| `components/common/Header.tsx` | Oui | ~10 | "Retour a l'accueil CETe" (aria), "Espace Client", "Demander une evaluation", "Menu" (sr-only) |
| `components/common/Footer.tsx` | Non (server) | ~10 | "Agence de Notation independante...", "Independance. Objectivite. Transparence.", "Navigation", "Contact", "Legal", copyright, "Fait avec passion par..." |

### 2.2 Sections — Home (10 fichiers)

| Fichier | Strings FR |
|---------|------------|
| `sections/home/HomeHero.tsx` | ~15 — "VOTRE NOTATION DU RISQUE ELECTRIQUE", "Decouvrir notre notation", "Demander une evaluation", echelle AAA/DDD |
| `sections/home/HomeStats.tsx` | ~5 — "Observatoire O-M-T", "DPS realises", "Entreprises auditees", "Exigences observees", "Faits terrain observes" |
| `sections/home/HomePillars.tsx` | ~4 — "Notre methodologie", "EVALUER. NOTER. ACCOMPAGNER." |
| `sections/home/HomeADN.tsx` | ~10 — "Notation proprietaire", "METHODE ADN", criteres 3C |
| `sections/home/HomeServices.tsx` | ~5 — "Nos leviers", "DE L'EVALUATION AU AAA" |
| `sections/home/HomeOrganizations.tsx` | ~3 — "References", "ORGANISATIONS EVALUEES" |
| `sections/home/HomeTestimonials.tsx` | ~20 — Temoignage complet (400+ mots), auteur, role, entreprise |
| `sections/home/HomeFounders.tsx` | ~10 — "Les co-fondateurs", "80 ANS D'EXPERTISE CUMULEE", bullets |
| `sections/home/HomeCTA.tsx` | ~4 — "CONNAISSEZ-VOUS VOTRE NOTATION ?" |
| `sections/home/index.ts` | 0 — barrel export |

### 2.3 Sections — About (8 fichiers)

| Fichier | Strings FR |
|---------|------------|
| `sections/about/AboutHero.tsx` | ~5 — "QUI SOMMES-NOUS ?" |
| `sections/about/AboutOriginStory.tsx` | ~20 — Timeline 5 evenements, narratif |
| `sections/about/AboutStats.tsx` | ~4 — Labels stats |
| `sections/about/AboutFounders.tsx` | ~5 |
| `sections/about/AboutWorldMap.tsx` | ~3 |
| `sections/about/AboutGouvernance.tsx` | ~5 |
| `sections/about/AboutValues.tsx` | ~3 — "Notre ADN", "INDEPENDANCE & CONFIDENTIALITE" |
| `sections/about/AboutCTA.tsx` | ~4 |

### 2.4 Sections — Expertise (9 fichiers)

| Fichier | Strings FR |
|---------|------------|
| `sections/expertise/ExpertiseHero.tsx` | ~7 — "LA METHODE ADN" |
| `sections/expertise/ExpertiseVigiScore.tsx` | ~12 — Regle 3C, tendances |
| `sections/expertise/ExpertiseVigilance.tsx` | ~8 |
| `sections/expertise/ExpertiseOMT.tsx` | ~8 |
| `sections/expertise/ExpertiseTertiles.tsx` | ~20 — 3 profils (Vulnerables, Ventre Mou, Talents) |
| `sections/expertise/ExpertiseComparison.tsx` | ~6 |
| `sections/expertise/ExpertiseServices.tsx` | ~5 |
| `sections/expertise/ExpertiseCertificate.tsx` | ~8 |
| `sections/expertise/ExpertiseCTA.tsx` | ~4 |

### 2.5 Sections — Services (6 fichiers)

| Fichier | Strings FR |
|---------|------------|
| `sections/services/ServicesHero.tsx` | ~6 — "NOS OFFRES" |
| `sections/services/ServicesPillars.tsx` | ~5 — "UNE OFFRE COMPLETE" |
| `sections/services/ServicesApproach.tsx` | ~5 |
| `sections/services/ServicesProcess.tsx` | ~8 |
| `sections/services/ServicesCatalog.tsx` | ~5 |
| `sections/services/ServicesCTA.tsx` | ~4 |

### 2.6 Sections — Contact (4 fichiers)

| Fichier | Strings FR |
|---------|------------|
| `sections/contact/ContactHero.tsx` | ~3 — "PARLONS DE VOTRE PROJET" |
| `sections/contact/ContactMain.tsx` | ~2 |
| `sections/contact/ContactMap.tsx` | ~2 — "NOUS TROUVER", "Ouvrir dans Google Maps" |
| `sections/contact/ContactTrust.tsx` | ~6 — 3 items confiance |

### 2.7 Sections — Shared

| Fichier | Strings FR |
|---------|------------|
| `sections/ContactForm.tsx` | ~25 — Labels formulaire, options, validation Zod, toast, CGU |
| `sections/EvaluationForm.tsx` | ~40 — Labels, 7 secteurs, 6 types evaluation, 5 tranches effectif, validation, toast |
| `sections/ContactInfo.tsx` | ~5 — Labels ("Adresse", "Email", "Telephone", "Horaires") |
| `sections/HeroSection.tsx` | ~0 — generique, props |
| `sections/FoundersGrid.tsx` | ~2 |
| `sections/PillarsSection.tsx` | ~2 |
| `sections/ProcessSection.tsx` | ~2 |
| `sections/ServicesGrid.tsx` | ~2 |
| `sections/ValuesSection.tsx` | ~2 |
| `sections/ADNTeaser.tsx` | ~5 |

### 2.8 Sections — Blog (6 fichiers)

| Fichier | Strings FR |
|---------|------------|
| `sections/blog/BlogHero.tsx` | ~5 |
| `sections/blog/BlogFeatured.tsx` | ~3 |
| `sections/blog/BlogGrid.tsx` | ~3 |
| `sections/blog/BlogCTA.tsx` | ~4 |
| `sections/blog/ArticleLayout.tsx` | ~5 |
| `sections/blog/VizActContent.tsx` | ~200+ — Article complet inline |

### 2.9 Features — Client (6 fichiers)

| Fichier | Strings FR |
|---------|------------|
| `features/client/ClientSidebar.tsx` | ~10 — Navigation sidebar |
| `features/client/CertificateCard.tsx` | ~5 |
| `features/client/DashboardSummary.tsx` | ~5 |
| `features/client/DocumentCard.tsx` | ~3 |
| `features/client/DocumentsList.tsx` | ~3 |
| `features/client/NotificationsTicker.tsx` | ~3 |

### 2.10 Features — Admin (5 fichiers dialogs)

| Fichier | Strings FR |
|---------|------------|
| `features/admin/ArticleFormDialog.tsx` | ~15 — Labels formulaire article |
| `features/admin/DocumentFormDialog.tsx` | ~15 — Labels formulaire document |
| `features/admin/FounderFormDialog.tsx` | ~10 — Labels formulaire fondateur |
| `features/admin/ResourceFormDialog.tsx` | ~12 — Labels formulaire ressource |
| `features/admin/UserFormDialog.tsx` | ~10 — Labels formulaire utilisateur |

### 2.11 Auth

| Fichier | Strings FR |
|---------|------------|
| `app/connexion/page.tsx` | ~15 — "Espace CETe", "Connexion", labels, demo, toast |

### 2.12 Verify

| Fichier | Strings FR |
|---------|------------|
| `app/(public)/verifier/[id]/page.tsx` | ~20 — Statuts certificat, labels, sous-criteres |

### 2.13 Pages client/admin (contenu inline)

| Fichier | Strings FR |
|---------|------------|
| `app/client/dashboard/page.tsx` | ~5 — "Bienvenue", description, erreur |
| Autres pages client (6) | ~5-15 chacune |
| `app/admin/dashboard/page.tsx` | ~10 — "Dashboard", actions rapides, labels |
| Autres pages admin (7) | ~10-30 chacune |
| `app/admin/layout.tsx` | ~12 — Labels sidebar admin |
| `app/client/layout.tsx` | ~2 — "Chargement..." |

### 2.14 Lib

| Fichier | Strings FR |
|---------|------------|
| `lib/constants.ts` | ~15 — SITE_TAGLINE, VIGI_SCORE_LEVELS, THREE_C_CRITERIA, ADN_LEVELS |

---

## 3. Inventaire des fichiers JSON mock

### 3.1 Tableau recapitulatif

| Fichier | Nb records | Champs traduisibles | Champs neutres | Total strings traduisibles |
|---------|-----------|---------------------|----------------|---------------------------|
| `founders.json` | 4 fondateurs | role, bio, specialties[], formerOrg, currentEntity | id, name, imageUrl, imagePosition, visible | ~24 |
| `services.json` | 8 services | title, description, shortDescription, features[] | id, category, type, icon, imageUrl, pillar | ~56 |
| `pillars.json` | 3 piliers | title, description | id, icon, color | 6 |
| `values.json` | 4 valeurs | title, description | id, icon | 8 |
| `navigation.json` | 12 items | label (mainNav, footerNav, ctaButtons) | href | 12 |
| `contact_info.json` | 1 objet | company, country, businessHours.* | address, city, phone, email, website, maps | ~9 |
| `organizations.json` | 12 noms | — (noms propres, non traduits) | — | 0 |
| `admin_articles.json` | 4 articles | title, excerpt, category | id, author, status, publishedDate, views, featured | 12 |
| `admin_stats.json` | 4 stats | label | id, value, trend, icon | 4 |
| `client_documents.json` | 12 docs + 4 notifs | title, description (docs), message (notifs), clientName | id, category, type, fileSize, duration, uploadDate, url, youtubeId, visibility, accessType, date, read | ~29 |
| `resources.json` | 10 ressources | title, description | id, category, type, accessMode, url, youtubeId, fileSize, source, publishedDate, createdAt | 20 |

**Total strings traduisibles dans les JSON : ~180**

### 3.2 Champs details par fichier

#### founders.json
- **Traduisible** : `role`, `bio`, `specialties[]`, `formerOrg`, `currentEntity`
- **Neutre** : `id`, `name` (nom propre), `imageUrl`, `imagePosition`, `visible`

#### services.json
- **Traduisible** : `title`, `description`, `shortDescription`, `features[]`
- **Neutre** : `id`, `category` (filtre technique : "Expertise"|"Conseil"), `type`, `icon`, `imageUrl`, `pillar`
- Note : `category` est un filtre technique, pas affiche directement tel quel

#### pillars.json
- **Traduisible** : `title`, `description`
- **Neutre** : `id`, `icon`, `color`

#### values.json
- **Traduisible** : `title`, `description`
- **Neutre** : `id`, `icon`

#### navigation.json
- **Traduisible** : `label` (mainNav: 6, footerNav: 4, ctaButtons: 2)
- **Neutre** : `href` (sera gere par le routing i18n)

#### contact_info.json
- **Traduisible** : `company`, `country`, `businessHours.*` (ex: "Ferme")
- **Neutre** : `address`, `city`, `phone`, `email`, `website`, `maps`

#### organizations.json
- **Neutre** : Noms propres d'entreprises (12 strings)

#### admin_articles.json
- **Traduisible** : `title`, `excerpt`, `category`
- **Neutre** : `id`, `author`, `status`, `publishedDate`, `views`, `featured`

#### admin_stats.json
- **Traduisible** : `label`
- **Neutre** : `id`, `value`, `trend`, `icon`

#### client_documents.json
- **Traduisible** : `clientName`, `title`, `description` (docs), `message` (notifications)
- **Neutre** : `id`, `category`, `type`, `fileSize`, `duration`, `uploadDate`, `url`, `youtubeId`, `visibility`, `accessType`, `date`, `read`

#### resources.json
- **Traduisible** : `title`, `description`
- **Neutre** : `id`, `category`, `type`, `accessMode`, `url`, `youtubeId`, `fileSize`, `source`, `publishedDate`, `createdAt`

---

## 4. Inventaire des metadonnees SEO

| Route | Type | Title FR | Description FR |
|-------|------|----------|----------------|
| Root `layout.tsx` | `export const metadata` (template) | `"CETe - Consortium Experts Techniques Electricite"` | `"Agence de Notation independante du risque electrique..."` |
| `/contact` | `export const metadata` | `"Contact & Demande d'evaluation"` | `"Demandez une evaluation CETe ou posez vos questions..."` |
| `/blog` | `export const metadata` | `"Blog — Decryptages & Analyses"` | `"Reglementation, retours d'experience..."` |
| `/blog/[slug]` | `generateMetadata` | Dynamique depuis `articles[slug]` | `article.metaDescription` |
| `/cgu` | `export const metadata` | `"Conditions Generales d'Utilisation"` | `"CGU du site CETe..."` |
| `/a-propos` | Herite root | — | — |
| `/expertise` | Herite root | — | — |
| `/services` | Herite root | — | — |
| `/connexion` | Herite root | — | — |
| `/verifier/[id]` | Herite root | — | — |
| `/client/*` | Herite root | — | — |
| `/admin/*` | Herite root | — | — |

### OpenGraph actuel (root)
- `locale: "fr_FR"`
- `url: "https://cete-notation.fr"`
- `siteName: "CETe"`
- Keywords : 8 mots-cles FR

### Points d'attention
- `<html lang="fr">` est hardcode dans le root layout
- Aucun `alternates.languages` n'est configure
- Aucun sitemap multilingue
- Les dates dans verifier/ utilisent `toLocaleDateString("fr-FR")` — a rendre dynamique

---

## 5. Contenu blog

### Structure actuelle
- **Blog listing** (`blog/page.tsx`) : 4 `BlogPost` hardcodes dans un tableau inline
- **Blog article** (`blog/[slug]/page.tsx`) : `articles` Record + `contentMap` Record + composants de contenu
- **Contenu article** : `VizActContent.tsx` contient le texte complet de l'article (200+ mots FR inline)
- **SEO keywords** : `seoKeywords` Record par slug dans `blog/[slug]/page.tsx`

### Strategie proposee
- Deplacer les `BlogPost[]` dans `src/data/blog/fr/posts.json` et `src/data/blog/en/posts.json`
- Deplacer les `ArticleMeta` dans `src/data/blog/fr/articles/` et `src/data/blog/en/articles/`
- Les composants de contenu (`VizActContent.tsx`) seront dupliques par locale ou utiliseront des cles de traduction

---

## 6. Estimations globales

| Categorie | Strings FR estimees |
|-----------|-------------------|
| Composants common (Header, Footer) | ~20 |
| Sections Home | ~75 |
| Sections About | ~45 |
| Sections Expertise | ~75 |
| Sections Services | ~35 |
| Sections Contact + Formulaires | ~75 |
| Sections Blog | ~215 |
| Pages Auth | ~15 |
| Pages Verify | ~20 |
| Pages Client (sidebar + 7 pages) | ~45 |
| Pages Admin (sidebar + 8 pages + dialogs) | ~100 |
| Constants (lib/constants.ts) | ~15 |
| CGU (page legale complete) | ~150+ lignes |
| **Sous-total composants** | **~785** |
| JSON mock (11 fichiers) | ~180 |
| **TOTAL** | **~965** |

---

## 7. Architecture des namespaces de traduction (proposition)

```
messages/fr.json
messages/en.json

common
  header        — nav links, CTA, aria-labels, logo alt
  footer        — colonnes, copyright, taglines
  buttons       — "En savoir plus", "Demander une evaluation", etc.
  states        — "Chargement...", "Erreur", "Aucun resultat", "Reessayer"

home
  hero          — titre, sous-titre, CTA, echelle
  stats         — labels stats O-M-T
  pillars       — badge, titre, description
  adn           — badge, titre, criteres 3C
  services      — badge, titre, description, CTA
  organizations — badge, titre, description
  testimonials  — badge, titre, temoignage complet, auteur
  founders      — badge, titre, description, bullets, CTA
  cta           — titre, description, boutons

about
  hero / originStory / stats / founders / worldMap / gouvernance / values / cta

expertise
  hero / vigiScore / vigilance / omt / tertiles / comparison / services / certificate / cta

services
  hero / pillars / approach / process / catalog / cta

contact
  hero / main / map / trust / form / evaluationForm / info

blog
  hero / featured / grid / cta / article

legal
  cgu           — 10 sections CGU completes

auth
  login         — labels formulaire, demo, messages

verify
  status / labels / subCriteria / messages

client
  sidebar / dashboard / profile / newsletters / capsules / guides / carnets / ressources

admin
  sidebar / dashboard / blog / documents / ressources / organizations / team / users / settings
  dialogs       — articleForm / documentForm / founderForm / resourceForm / userForm

constants
  siteTagline / vigiScoreLevels / threeCCriteria / adnLevels
```
