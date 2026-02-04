# Requirements: CETé

**Defined:** 2026-02-04
**Core Value:** Établir la crédibilité digitale de CETé comme agence de notation indépendante de référence sur le risque électrique

## v1 Requirements

### Infrastructure (INFRA)

- [ ] **INFRA-01**: Projet Next.js 14+ initialisé avec App Router et TypeScript strict
- [ ] **INFRA-02**: Tailwind CSS 3.4+ configuré avec palette custom (Bleu Nuit, Jaune Sécurité)
- [ ] **INFRA-03**: shadcn/ui installé et configuré
- [ ] **INFRA-04**: Lucide React installé pour les icônes
- [ ] **INFRA-05**: Structure dossiers conforme PRD (app/, components/, data/, types/, lib/)
- [ ] **INFRA-06**: Fichiers JSON mock créés avec interfaces TypeScript

### Pages Publiques (PAGE)

- [ ] **PAGE-01**: Page Accueil (/) avec Header sticky, Hero, 3 Piliers, Teaser ADN, Footer
- [ ] **PAGE-02**: Page À Propos (/a-propos) avec histoire, grid fondateurs 2x2, valeurs
- [ ] **PAGE-03**: Page Expertise (/expertise) avec méthode ADN, radar visuel, offres
- [ ] **PAGE-04**: Page Services (/services) avec grid services, process timeline
- [ ] **PAGE-05**: Page Contact (/contact) avec formulaire mock, infos, map placeholder

### Composants (COMP)

- [ ] **COMP-01**: Header avec navigation et CTA Espace Client
- [ ] **COMP-02**: Footer avec liens, légal, coordonnées
- [ ] **COMP-03**: HeroSection réutilisable (titre, sous-titre, CTAs)
- [ ] **COMP-04**: PillarsSection (3 piliers avec icônes)
- [ ] **COMP-05**: ServicesGrid (cards services filtrable)
- [ ] **COMP-06**: FoundersGrid (cards fondateurs 2x2)
- [ ] **COMP-07**: ValuesSection (4 valeurs éthiques)
- [ ] **COMP-08**: ContactForm avec validation et toast succès

### Espaces Privés Mock (PRIV)

- [ ] **PRIV-01**: Système auth mock (localStorage, credentials demo)
- [ ] **PRIV-02**: Page login client (/client/login)
- [ ] **PRIV-03**: Dashboard client avec ressources (newsletters, capsules, guides)
- [ ] **PRIV-04**: Page login admin (/admin/login)
- [ ] **PRIV-05**: Dashboard admin avec stats mockées
- [ ] **PRIV-06**: Page admin blog (tableau articles)
- [ ] **PRIV-07**: Page admin documents (bibliothèque)

### Qualité (QUAL)

- [ ] **QUAL-01**: Design responsive (mobile, tablet, desktop)
- [ ] **QUAL-02**: TypeScript strict (0 any)
- [ ] **QUAL-03**: Accessibilité WCAG AA (ARIA, keyboard nav)
- [ ] **QUAL-04**: ESLint + Prettier configurés

## v2 Requirements

### Backend Supabase
- **BACK-01**: Base de données PostgreSQL
- **BACK-02**: Authentification JWT réelle
- **BACK-03**: API pour documents et articles
- **BACK-04**: Système de notifications

### Fonctionnalités Avancées
- **ADV-01**: Paiements Stripe/Mollie
- **ADV-02**: Email marketing intégré
- **ADV-03**: Blog dynamique avec CMS

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend réel | Phase 2 - Supabase |
| Auth JWT | Mock localStorage suffit Phase 1 |
| Paiements | Pas dans le scope initial |
| Multi-langue | Français uniquement Phase 1 |
| Analytics avancés | Vercel Analytics suffira |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Pending |
| INFRA-02 | Phase 1 | Pending |
| INFRA-03 | Phase 1 | Pending |
| INFRA-04 | Phase 1 | Pending |
| INFRA-05 | Phase 1 | Pending |
| INFRA-06 | Phase 1 | Pending |
| PAGE-01 | Phase 2 | Pending |
| PAGE-02 | Phase 2 | Pending |
| PAGE-03 | Phase 2 | Pending |
| PAGE-04 | Phase 2 | Pending |
| PAGE-05 | Phase 2 | Pending |
| COMP-01 | Phase 2 | Pending |
| COMP-02 | Phase 2 | Pending |
| COMP-03 | Phase 2 | Pending |
| COMP-04 | Phase 2 | Pending |
| COMP-05 | Phase 2 | Pending |
| COMP-06 | Phase 2 | Pending |
| COMP-07 | Phase 2 | Pending |
| COMP-08 | Phase 2 | Pending |
| PRIV-01 | Phase 3 | Pending |
| PRIV-02 | Phase 3 | Pending |
| PRIV-03 | Phase 3 | Pending |
| PRIV-04 | Phase 3 | Pending |
| PRIV-05 | Phase 3 | Pending |
| PRIV-06 | Phase 3 | Pending |
| PRIV-07 | Phase 3 | Pending |
| QUAL-01 | Phase 4 | Pending |
| QUAL-02 | Phase 4 | Pending |
| QUAL-03 | Phase 4 | Pending |
| QUAL-04 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 26 total
- Mapped to phases: 26
- Unmapped: 0

---
*Requirements defined: 2026-02-04*
*Last updated: 2026-02-04 after initial definition*
