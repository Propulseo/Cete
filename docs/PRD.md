# Product Requirements Document (PRD) - CETé Phase 1
## Site Vitrine 5 Pages + Plateforme Admin/Client

**Version:** 1.0
**Date:** Février 2026
**Statut:** Validé avec le client
**Projet:** CETé (Conseil Expertise Technique Électricité)

---

## Contexte & Vision

### Qu'est-ce que CETé ?
**CETé** = Conseil Expertise Technique Électricité

Un **consortium fondé par 4 anciens experts du SERECT** (Société d'Études, de Recherches et de Conseils Techniques).

### Fondateurs & Expertise
- **Michel LIGIER** - Co-fondateur / Expert
- **Bruno CLAUDEL** - Co-fondateur / Expert
- **Pierre VIRELY** - Co-fondateur / Expert
- **Denis VUILLOZ** - Co-fondateur / Expert

*Mention clé : "Passionnés, passeurs de prévention"*
*Expérience cumulée : 20+ ans | 200+ entreprises accompagnées*

### Mission Stratégique
Devenir l'**agence de notation indépendante de référence (FR/INT)** sur le risque électrique et les **Travaux Sous Tension (TST)**.

### Proposition de Valeur
**"Transformer la vigilance en énergie collective"**

---

## Périmètre & Objectifs

### Phase 1 : Lancement (Livraison V1)
- Site vitrine 5 pages (hardcodé, SEO-ready)
- Structure Admin/Client complète (mockée)
- Architecture prête pour Supabase (phase 2)

### Out of Scope Phase 1
- Authentification réelle (JWT/Supabase)
- Paiements (Stripe/Mollie)
- Base de données réelle
- Intégration email marketing

---

## Tech Stack

### Frontend
| Technologie | Version | Usage |
|-------------|---------|-------|
| **Next.js** | 14+ | Framework principal (App Router) |
| **TypeScript** | 5.0+ | Type Safety strict |
| **Tailwind CSS** | 3.4+ | Styling / Responsiveness |
| **Lucide React** | Latest | Icônes professionnelles |
| **shadcn/ui** | Latest | Composants UI prêts à l'emploi |
| **React Hook Form** | 7.0+ | Gestion formulaires |

### Data Layer (Phase 1)
- **Content** : JSON files (`/data/mocks`) typés en TypeScript
- **State Management** : React Context API (simple)
- **Authentication (Mock)** : localStorage + Cookie simple

### Build & Deployment
- **pnpm** : Package manager
- **Vercel** : Deployment CD/CI
- **Git** : Version control (GitHub)
- **ESLint + Prettier** : Code quality

---

## Architecture du Site (Sitemap)

### Partie Publique (Vitrine - Accès libre)

```
/                   → Accueil
/a-propos           → Qui sommes-nous ?
/expertise          → Agence de Notation (Méthode ADN)
/services           → Services & Conseils
/contact            → Contact
```

### Partie Privée (Mock)

```
/client/            → Dashboard Client (ressources, newsletters, capsules)
/admin/             → Dashboard Admin (stats, blog, documents, users)
```

---

## Design System

### Palette de Couleurs
| Nom | Hex | Usage |
|-----|-----|-------|
| **Bleu Nuit** | `#001a33` | Headers, CTAs primaires |
| **Bleu Pro** | `#0066cc` | Links, accents |
| **Jaune Sécurité** | `#ffc107` | Icônes électricité, Alerts |
| **Gris Clair** | `#f5f5f5` | Backgrounds cartes |
| **Blanc** | `#ffffff` | Fond principal |
| **Gris Texte** | `#333333` | Texte body |

### Typography
- **Headings:** Inter, font-weight: 600-700
- **Body:** Inter, 16px, font-weight: 400

---

## Structure de Dossiers

```
cete-project/
├── app/                          # Routes Next.js (App Router)
│   ├── layout.tsx
│   ├── page.tsx                 # Homepage
│   ├── a-propos/page.tsx
│   ├── expertise/page.tsx
│   ├── services/page.tsx
│   ├── contact/page.tsx
│   ├── client/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── page.tsx
│   └── admin/
│       ├── layout.tsx
│       ├── login/page.tsx
│       ├── page.tsx
│       ├── blog/page.tsx
│       └── documents/page.tsx
├── components/
│   ├── common/
│   ├── sections/
│   └── ui/
├── data/mocks/
├── types/
├── lib/
├── public/images/
└── styles/
```

---

## Fichiers JSON Mock

Tous définis dans le PRD complet avec structures détaillées :
- founders.json
- services.json
- pillars.json
- values.json
- client_documents.json
- admin_articles.json
- admin_stats.json
- navigation.json
- contact_info.json

---

## Critères de Succès

- 5 pages publiques fonctionnelles
- Mock data JSON chargées dynamiquement
- Authentification localStorage (demo)
- Espace client + admin visuellement complets
- Design cohérent et professionnel
- TypeScript strict (0 any)
- Responsive design
- Accessible (ARIA, keyboard nav)
- Production-ready
