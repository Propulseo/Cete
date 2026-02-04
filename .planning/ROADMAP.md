# Roadmap: CETé

**Created:** 2026-02-04
**Core Value:** Établir la crédibilité digitale de CETé comme agence de notation indépendante

## Phases Overview

| # | Phase | Goal | Requirements | Status |
|---|-------|------|--------------|--------|
| 1 | Setup & Data | Infrastructure Next.js + Mock Data | INFRA-01 à INFRA-06 | Pending |
| 2 | Pages & Composants | 5 pages publiques + composants réutilisables | PAGE-01 à PAGE-05, COMP-01 à COMP-08 | Pending |
| 3 | Espaces Privés | Auth mock + Client + Admin dashboards | PRIV-01 à PRIV-07 | Pending |
| 4 | Polish & Deploy | Responsive, accessibilité, qualité code | QUAL-01 à QUAL-04 | Pending |

---

## Phase 1: Setup & Data

**Goal:** Infrastructure Next.js complète avec mock data typées

**Requirements:** INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06

### Success Criteria

1. `pnpm dev` démarre sans erreur
2. Tailwind fonctionne avec couleurs custom (Bleu Nuit, Jaune Sécurité)
3. shadcn/ui Button et Card fonctionnent
4. Tous les fichiers JSON existent dans /data/mocks/
5. Interfaces TypeScript dans /types/ compilent sans erreur

### Deliverables

- Next.js 14+ projet initialisé
- tailwind.config.ts avec palette custom
- shadcn/ui configuré
- 9 fichiers JSON mock
- Interfaces TypeScript correspondantes

---

## Phase 2: Pages & Composants

**Goal:** Site vitrine 5 pages complet avec navigation

**Requirements:** PAGE-01 à PAGE-05, COMP-01 à COMP-08

### Success Criteria

1. Navigation entre les 5 pages fonctionne
2. Header sticky présent sur toutes les pages
3. Footer avec liens et coordonnées
4. Contenu chargé depuis JSON (fondateurs, services, piliers)
5. Design conforme à la palette (Bleu Nuit, Jaune)

### Deliverables

- 5 pages publiques complètes
- Composants Header, Footer
- Sections réutilisables (Hero, Pillars, Services, Founders, Values)
- Formulaire contact avec toast

---

## Phase 3: Espaces Privés

**Goal:** Authentification mock + dashboards client et admin

**Requirements:** PRIV-01 à PRIV-07

### Success Criteria

1. Login client avec demo@cete.fr / Cete2026
2. Login admin avec admin@cete.fr / Admin2026
3. Dashboard client affiche ressources mockées
4. Dashboard admin affiche stats mockées
5. Logout redirige vers accueil

### Deliverables

- Système auth localStorage
- Pages login client/admin
- Dashboard client avec ressources
- Dashboard admin avec stats, blog, documents

---

## Phase 4: Polish & Deploy

**Goal:** Production-ready avec qualité et accessibilité

**Requirements:** QUAL-01 à QUAL-04

### Success Criteria

1. Responsive sur mobile/tablet/desktop
2. TypeScript strict (0 any dans le code)
3. Navigation clavier fonctionne
4. ESLint 0 erreurs, Prettier formaté
5. Build production réussit

### Deliverables

- Site responsive complet
- Code TypeScript strict
- Accessibilité WCAG AA
- Prêt pour Vercel deploy

---

## Dependencies

```
Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4
(Setup)    (Pages)    (Auth)      (Polish)
```

Chaque phase dépend de la précédente.

---
*Roadmap created: 2026-02-04*
