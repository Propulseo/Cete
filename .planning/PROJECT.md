# CETé - Conseil Expertise Technique Électricité

## What This Is

Site vitrine professionnel pour CETé, un consortium d'experts en sécurité électrique fondé par 4 anciens du SERECT. Le site présente leur expertise en notation du risque électrique (méthode ADN) et leurs services de conseil/formation. Inclut des espaces client et admin mockés, prêts pour intégration Supabase en Phase 2.

## Core Value

**Établir la crédibilité digitale de CETé comme agence de notation indépendante de référence sur le risque électrique** — les visiteurs doivent comprendre immédiatement l'expertise, l'indépendance et la méthodologie ADN.

## Requirements

### Validated

(None yet — ship to validate)

### Active

#### Site Vitrine (5 pages)
- [ ] Page Accueil avec Hero, 3 Piliers, Teaser ADN
- [ ] Page À Propos avec histoire, fondateurs, valeurs
- [ ] Page Expertise avec méthode ADN et offres
- [ ] Page Services avec conseils et processus
- [ ] Page Contact avec formulaire et infos

#### Infrastructure
- [ ] Setup Next.js 14+ (App Router, TypeScript)
- [ ] Tailwind CSS + shadcn/ui + Lucide React
- [ ] Structure dossiers conforme PRD
- [ ] Fichiers JSON mock avec types TypeScript

#### Espaces Privés (Mock)
- [ ] Espace Client avec ressources downloadables
- [ ] Espace Admin avec dashboard et gestion
- [ ] Authentification mock (localStorage)

### Out of Scope

- Backend réel / Base de données — Phase 2 avec Supabase
- Authentification JWT — Mock localStorage suffit pour Phase 1
- Paiements Stripe/Mollie — Pas prévu
- Email marketing — Phase 2

## Context

- **Fondateurs:** Michel LIGIER, Bruno CLAUDEL, Pierre VIRELY, Denis VUILLOZ (ex-SERECT)
- **Positionnement:** Agence de notation indépendante du risque électrique
- **Méthode ADN:** Auto-évaluation → Respect du prescrit → Maîtrise opérationnelle
- **Adresse:** SERCE, 9 rue de Berri, 75008 Paris
- **Cible:** Entreprises avec risques électriques (200+ déjà accompagnées)

## Constraints

- **Tech stack:** Next.js 14+, TypeScript strict, Tailwind, shadcn/ui, pnpm
- **Data:** Mock JSON uniquement (pas de backend Phase 1)
- **Deployment:** Vercel-ready
- **Design:** Professionnel, sobre (Bleu Nuit #001a33, Jaune Sécurité #ffc107)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Mock data en JSON | Prépare Supabase Phase 2 sans complexité | — Pending |
| shadcn/ui | Composants pro, personnalisables, accessibles | — Pending |
| App Router Next.js 14 | Standard moderne, Server Components | — Pending |

---
*Last updated: 2026-02-04 after initialization*
