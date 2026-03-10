# 📋 Product Requirements Document (PRD) - CETé Phase 1
## Site Vitrine 5 Pages + Plateforme Admin/Client

**Version:** 1.0  
**Date:** Février 2026  
**Statut:** Validé avec le client  
**Projet:** CETé (Conseil Expertise Technique Électricité)

---

## 📑 Table des Matières
1. [Contexte & Vision](#contexte--vision)
2. [Périmètre & Objectifs](#périmètre--objectifs)
3. [Tech Stack](#tech-stack)
4. [Architecture du Site (Sitemap)](#architecture-du-site-sitemap)
5. [Détails des Pages](#détails-des-pages)
6. [Spécifications Fonctionnelles](#spécifications-fonctionnelles)
7. [Modèle de Données (Mock Schema)](#modèle-de-données-mock-schema)
8. [Design System & UI](#design-system--ui)
9. [Instructions pour Claude Code](#instructions-pour-claude-code)
10. [Checklist de Déploiement](#checklist-de-déploiement)

---

## 🎯 Contexte & Vision

### 🏢 Qu'est-ce que CETé ?
**CETé** = Conseil Expertise Technique Électricité

Un **consortium fondé par 4 anciens experts du SERECT** (Société d'Études, de Recherches et de Conseils Techniques).

### 🎪 Fondateurs & Expertise
- **Michel LIGIER** - Co-fondateur / Expert
- **Bruno CLAUDEL** - Co-fondateur / Expert  
- **Pierre VIRELY** - Co-fondateur / Expert
- **Denis VUILLOZ** - Co-fondateur / Expert

*Mention clé : "Passionnés, passeurs de prévention"*  
*Expérience cumulée : 20+ ans | 200+ entreprises accompagnées*

### 🎯 Mission Stratégique
Devenir l'**agence de notation indépendante de référence (FR/INT)** sur le risque électrique et les **Travaux Sous Tension (TST)**.

### 💡 Proposition de Valeur
**"Transformer la vigilance en énergie collective"**

Approche holistique basée sur :
- **Expertise** : Diagnostic et conseil en sécurité électrique
- **Agence de Notation (ADN)** : Rating indépendant du risque
- **Conseils & Formation** : Pédagogie bienveillante

### 🎭 Éthique & Positionnement
- ✅ **Indépendance totale** : Pas de conflit d'intérêt
- ✅ **Confidentialité garantie** : Notation anonyme possible
- ✅ **Sérénité préventive** : Objectif "AAA" (maîtrise optimale)
- ✅ **Neurosciences & Pédagogie** : Engagement fort dans la formation

---

## 🎯 Périmètre & Objectifs

### Phase 1 : Lancement (Livraison V1)
**Objectif :** Déployer une présence digitale professionnelle avec :
- ✅ Site vitrine 5 pages (hardcodé, SEO-ready)
- ✅ Structure Admin/Client complète (mockée)
- ✅ Architecture prête pour Supabase (phase 2)

### Out of Scope Phase 1
- ❌ Authentification réelle (JWT/Supabase)
- ❌ Paiements (Stripe/Mollie)
- ❌ Base de données réelle
- ❌ Intégration email marketing

### Phase 2 (Future)
- BDD Supabase + PostgreSQL
- Authentification sécurisée
- Espace client dynamique (factures, contrats)
- Système de notification
- Intégration paiements

---

## ⚙️ Tech Stack

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
| Élément | Approche |
|---------|----------|
| **Content** | JSON files (`/data/mocks`) typés en TypeScript |
| **State Management** | React Context API (simple) |
| **Authentication (Mock)** | localStorage + Cookie simple |

### Build & Deployment
| Outil | Usages |
|------|--------|
| **pnpm** | Package manager |
| **Vercel** | Deployment CD/CI |
| **Git** | Version control (GitHub) |
| **ESLint + Prettier** | Code quality |

---

## 🗺 Architecture du Site (Sitemap)

### Partie Publique (Vitrine - Accès libre)

```
/
├── / (Accueil)
│   ├── Header + Nav
│   ├── Hero Section
│   ├── Section "En un regard" (3 Piliers)
│   ├── Teaser Méthode ADN
│   └── Footer
│
├── /a-propos (Qui sommes-nous ?)
│   ├── Histoire du consortium
│   ├── Grid Fondateurs
│   ├── Éthique & Valeurs
│   └── Footer
│
├── /expertise (Agence de Notation)
│   ├── Méthode ADN (détaillée)
│   ├── Offres Expertise (DPS, Vigi-Score, Certificat, Veille)
│   ├── Visuel Radar/Cible
│   └── Footer
│
├── /services (Services & Conseils)
│   ├── Accompagnement sur mesure
│   ├── Services listés (Coaching Managers, TST, etc.)
│   ├── Approche pédagogique
│   └── Footer
│
└── /contact (Contact)
    ├── Formulaire (UI mockée)
    ├── Coordonnées (Paris, SERCE)
    ├── Google Maps (ou placeholder)
    └── Footer
```

### Partie Privée (Mock) - Accès authentifié (demo)

```
/client/
├── /client (Dashboard Client)
│   ├── Ressources downloadables
│   ├── Newsletters
│   ├── Capsules de prévention
│   ├── Guides opératoires
│   └── Carnets d'appui
│
└── /admin/
    ├── Dashboard (Stats mockées)
    ├── /admin/blog (Gestion articles)
    ├── /admin/documents (Biblioithèque technique)
    ├── /admin/users (Gestion utilisateurs simulée)
    └── /admin/settings (Paramètres)
```

---

## 📄 Détails des Pages

### Page 1 : Accueil `/`

#### Structure
```
├── Header (sticky)
│   ├── Logo CETé
│   ├── Navigation (A propos, Expertise, Services, Contact)
│   └── CTA "Espace Client" (lien vers /client)
│
├── Hero Section
│   ├── Background: Visuel électricité/énergie (ou gradient bleu/jaune)
│   ├── Headline: "Risques Électriques : Agence De Notation, Expertise, Conseils"
│   ├── Subheadline: "Transformer la vigilance en énergie collective"
│   ├── CTA Primary: "Découvrir notre méthode ADN" → /expertise
│   └── CTA Secondary: "Qui sommes-nous ?" → /a-propos
│
├── Section "En un regard" (3 Piliers)
│   ├── Pilier 1: Expertise
│   │   ├── Icon (gear/lightning)
│   │   ├── Title: "Expertise"
│   │   └── Description: "20+ ans d'expérience, 200+ entreprises accompagnées"
│   │
│   ├── Pilier 2: Agence de Notation
│   │   ├── Icon (rating star)
│   │   ├── Title: "Agence de Notation (ADN)"
│   │   └── Description: "Rating indépendant et transparent du risque électrique"
│   │
│   └── Pilier 3: Conseils
│   │   ├── Icon (chat/mentor)
│   │   ├── Title: "Conseils & Formation"
│   │   └── Description: "Pédagogie bienveillante, neurosciences appliquées"
│
├── Section Teaser Méthode ADN
│   ├── Heading: "La Méthode ADN : Notation Maîtrisée"
│   ├── Visuel: Graphique radar/cible (mock SVG ou image)
│   ├── Description: "Auto-évaluation → Respect du prescrit → Maîtrise opérationnelle"
│   └── CTA: "En savoir plus" → /expertise
│
├── Section Testimonials (optionnel - Phase 2)
│   └── Carousel de clients
│
└── Footer
    ├── Links rapides (A propos, Services, Contact)
    ├── Légal (Mentions légales, Politique confidentialité, CGU)
    ├── Coordonnées: SERCE, 9 rue de Berri, 75008 Paris
    ├── Email: contact@cete-notation.fr
    └── Réseaux sociaux (mock links)
```

#### Contenus à charger depuis JSON
- **3 Piliers** → depuis `pillars.json`
- **CTA links** → depuis `navigation.json`

---

### Page 2 : Qui sommes-nous ? `/a-propos`

#### Structure
```
├── Hero Section (mini)
│   ├── Heading: "Qui sommes-nous ?"
│   └── Subheading: "Passionnés, passeurs de prévention"
│
├── Section Histoire
│   ├── Heading: "Le Consortium CETé"
│   ├── Intro: "Nés du SERECT, forts de 20+ ans d'expérience..."
│   ├── Chiffres clés:
│   │   ├── "200+" clients accompagnés
│   │   ├── "20+" années d'expertise
│   │   └── "4" fondateurs experts
│   └── Paragraphe: Mission et valeurs
│
├── Section Fondateurs (Grid 2x2)
│   ├── Carte 1: Michel LIGIER
│   │   ├── Image (mock placeholder)
│   │   ├── Name: Michel LIGIER
│   │   ├── Role: Co-fondateur / Expert
│   │   └── Bio: "Expert reconnu en risques électriques..."
│   │
│   ├── Carte 2: Bruno CLAUDEL
│   ├── Carte 3: Pierre VIRELY
│   └── Carte 4: Denis VUILLOZ
│
├── Section Éthique & Valeurs
│   ├── Heading: "Notre ADN : Indépendance & Confidentialité"
│   ├── Valeur 1: Indépendance totale
│   ├── Valeur 2: Confidentialité garantie
│   ├── Valeur 3: Sérénité préventive
│   └── Valeur 4: Notation "AAA"
│
└── Footer
```

#### Contenus à charger depuis JSON
- **Fondateurs** → depuis `founders.json`
- **Valeurs** → depuis `values.json`

---

### Page 3 : Expertise - Agence de Notation `/expertise`

#### Structure
```
├── Hero Section (mini)
│   ├── Heading: "La Méthode ADN"
│   └── Subheading: "Agence De Notation : Rating indépendant du risque électrique"
│
├── Section ADN - Les 3 Piliers
│   ├── Visuel Central: Graphique radar/cible (mock SVG)
│   ├── Pilier 1: Auto-évaluation
│   │   ├── Icon + Title
│   │   └── Description: "Diagnostic initial"
│   │
│   ├── Pilier 2: Respect du prescrit
│   │   ├── Icon + Title
│   │   └── Description: "Conformité réglementaire"
│   │
│   └── Pilier 3: Maîtrise opérationnelle
│   │   ├── Icon + Title
│   │   └── Description: "Gestion quotidienne des risques"
│
├── Section Offres Expertise (Cards Grid)
│   ├── Offre 1: DPS (Diagnostic de Prévention Sécurité)
│   │   ├── Title
│   │   ├── Description
│   │   ├── Features list
│   │   └── CTA: "En savoir plus"
│   │
│   ├── Offre 2: Vigi-Score (Notation du risque)
│   │   └── ...idem
│   │
│   ├── Offre 3: Certificat (Maîtrise certifiée)
│   │   └── ...idem
│   │
│   └── Offre 4: Veille (Suivi réglementaire)
│   │   └── ...idem
│
└── Footer
```

#### Contenus à charger depuis JSON
- **Services Expertise** → depuis `services.json` (filtered by category="Expertise")
- **Radar/Cible image** → `/public/images/adn-radar.svg`

---

### Page 4 : Services & Conseils `/services`

#### Structure
```
├── Hero Section (mini)
│   ├── Heading: "Services & Conseils"
│   └── Subheading: "Accompagnement sur mesure et sur étagère"
│
├── Intro Section
│   ├── Texte: Approche pédagogique + neurosciences
│   └── Highlight: "Bienveillance, rigueur, adaptation"
│
├── Section Services (Cards Grid 2x2 ou 3 col)
│   ├── Service 1: Coaching des Managers & QSE
│   │   ├── Icon + Title
│   │   ├── Description: "Accompagnement décisionnels"
│   │   ├── Features list
│   │   └── CTA: "Découvrir"
│   │
│   ├── Service 2: Coaching des Animateurs TST
│   ├── Service 3: Coaching encadrement chantiers
│   └── Service 4: Accompagnement Organismes de formation
│
├── Section Process
│   ├── Timeline visual (4 steps)
│   ├── Step 1: Diagnostic
│   ├── Step 2: Conception
│   ├── Step 3: Déploiement
│   └── Step 4: Suivi & Amélioration
│
└── Footer
```

#### Contenus à charger depuis JSON
- **Services** → depuis `services.json` (filtered by category="Conseil")
- **Process** → depuis `process.json`

---

### Page 5 : Contact `/contact`

#### Structure
```
├── Hero Section (mini)
│   ├── Heading: "Contactez-nous"
│   └── Subheading: "Prêts à transformer votre vigilance en énergie ?"
│
├── Conteneur Principal (2 colonnes: Formulaire | Infos)
│
│   Colonne 1: Formulaire (UI mockée - pas de backend)
│   ├── Form Title: "Envoyez-nous un message"
│   ├── Field 1: Nom complet (input text)
│   ├── Field 2: Entreprise (input text)
│   ├── Field 3: Email (input email)
│   ├── Field 4: Téléphone (input tel)
│   ├── Field 5: Message (textarea)
│   ├── Checkbox: "J'accepte les CGU"
│   ├── CTA: "Envoyer" (affiche toast/modal "Merci !")
│   └── Note: "Réponse dans 24h"
│
│   Colonne 2: Informations de Contact
│   ├── Heading: "CETé - Contact"
│   ├── Info 1: Adresse
│   │   ├── Icon (location)
│   │   └── "SERCE - 9 rue de Berri, 75008 Paris"
│   │
│   ├── Info 2: Email
│   │   ├── Icon (mail)
│   │   └── "contact@cete-notation.fr"
│   │
│   ├── Info 3: Téléphone
│   │   ├── Icon (phone)
│   │   └── "+33 (0)1 XX XX XX XX"
│   │
│   └── Info 4: Horaires
│       ├── Icon (clock)
│       └── "Lun-Ven: 9h-18h"
│
├── Map Section
│   ├── Heading: "Nous trouver"
│   └── Google Maps embed (ou placeholder SVG)
│
└── Footer
```

#### Comportement
- Form submission → Toast "Merci ! Nous vous répondrons sous 24h"
- Pas d'envoi réel d'email (mockée)

---

## 🔧 Spécifications Fonctionnelles

### 1️⃣ Authentification Mock (Phase 1)

**Approach :** localStorage simple (aucune sécurité réelle)

```typescript
// Credentials de démo
const DEMO_CREDENTIALS = {
  email: "demo@cete.fr",
  password: "Cete2026"
};

// Espace Admin
const ADMIN_CREDENTIALS = {
  email: "admin@cete.fr",
  password: "Admin2026"
};
```

**Comportement :**
- Clic sur "Espace Client" → /client/login
- Entrée des credentials → localStorage set
- Redirection vers /client ou /admin selon le role
- Logout → localStorage clear + redirection /

### 2️⃣ Espace Client `/client`

#### Features
- ✅ **Dashboard** : Vue personnalisée (Client: Jean Dupont)
- ✅ **Ressources downloadables** :
  - Newsletters (mock PDFs)
  - Capsules de prévention (vidéos embed YouTube ou image)
  - Guides opératoires (docs)
  - Carnets d'appui (templates)
- ✅ **Notifications** : Ticker "Nouvelle veille réglementaire"
- ✅ **Profil** : Affichage données client + édition (UI seulement)

#### Mock Data Structure
```json
// /data/mocks/client_documents.json
{
  "documents": [
    {
      "id": "doc-1",
      "title": "Guide TST 2026",
      "category": "guides",
      "type": "PDF",
      "fileSize": "2.4 MB",
      "uploadDate": "2026-01-15",
      "url": "#"
    },
    {
      "id": "doc-2",
      "title": "Capsule #12 - Harnais",
      "category": "capsules",
      "type": "video",
      "youtubeId": "dQw4w9WgXcQ",
      "uploadDate": "2026-02-01"
    }
  ]
}
```

### 3️⃣ Espace Admin `/admin`

#### Features
- ✅ **Dashboard** : Stats mockées (Clients: 47, Documents: 134, etc.)
- ✅ **Blog Management** : Tableau listant articles, bouton "Ajouter"
  - Modale d'ajout (UI seulement, pas de save)
- ✅ **Document Library** : Tableau de guides/docs techniques
  - Formulaire upload simulé
- ✅ **User Management** : Grille d'utilisateurs (read-only demo)

#### Mock Data Structure
```json
// /data/mocks/admin_articles.json
{
  "articles": [
    {
      "id": "art-1",
      "title": "Risques électriques : les tendances 2026",
      "author": "Michel LIGIER",
      "category": "Expertise",
      "status": "published",
      "publishedDate": "2026-02-01",
      "views": 342
    }
  ]
}
```

---

## 📊 Modèle de Données (Mock Schema)

### Fichiers JSON à créer dans `/data/mocks/`

#### 1. `founders.json`
```json
[
  {
    "id": "1",
    "name": "Michel LIGIER",
    "role": "Co-fondateur / Expert Senior",
    "bio": "Expert reconnu en sécurité électrique et risques. 20+ années d'expérience terrain.",
    "imageUrl": "/images/founders/michel.jpg",
    "specialties": ["TST", "Diagnostic", "Formation"]
  },
  {
    "id": "2",
    "name": "Bruno CLAUDEL",
    "role": "Co-fondateur / Expert",
    "bio": "Spécialiste en prévention et réglementation électrique.",
    "imageUrl": "/images/founders/bruno.jpg",
    "specialties": ["Conformité", "Audit", "Veille réglementaire"]
  },
  {
    "id": "3",
    "name": "Pierre VIRELY",
    "role": "Co-fondateur / Expert",
    "bio": "Accompagnateur pédagogique en santé-sécurité.",
    "imageUrl": "/images/founders/pierre.jpg",
    "specialties": ["Formation", "Coaching", "Neurosciences appliquées"]
  },
  {
    "id": "4",
    "name": "Denis VUILLOZ",
    "role": "Co-fondateur / Expert",
    "bio": "Expert en gestion de risques et notation indépendante.",
    "imageUrl": "/images/founders/denis.jpg",
    "specialties": ["Rating", "Notation", "Analyse risques"]
  }
]
```

#### 2. `services.json`
```json
[
  {
    "id": "exp-dps",
    "category": "Expertise",
    "type": "expertise",
    "title": "DPS - Diagnostic de Prévention Sécurité",
    "description": "Audit complet de votre système de sécurité électrique",
    "shortDescription": "Diagnostic initial de conformité et risques",
    "features": [
      "Analyse terrain exhaustive",
      "Rapport détaillé",
      "Plan d'action priorisé",
      "Recommandations opérationnelles"
    ],
    "icon": "clipboard-check",
    "imageUrl": "/images/services/dps.jpg"
  },
  {
    "id": "exp-vigi",
    "category": "Expertise",
    "type": "expertise",
    "title": "Vigi-Score - Agence de Notation",
    "description": "Rating indépendant du risque électrique de votre organisation",
    "shortDescription": "Notation du risque (AAA à DDD)",
    "features": [
      "Évaluation indépendante",
      "Notation transparente",
      "Benchmark secteur",
      "Suivi trimestriel possible"
    ],
    "icon": "star",
    "imageUrl": "/images/services/vigi-score.jpg"
  },
  {
    "id": "exp-cert",
    "category": "Expertise",
    "type": "expertise",
    "title": "Certificat CETé - Maîtrise certifiée",
    "description": "Attestation de maîtrise opérationnelle du risque électrique",
    "shortDescription": "Certification de conformité",
    "features": [
      "Validation des compétences",
      "Certificat nominatif",
      "Validité 2 ans",
      "Renouvellement assisté"
    ],
    "icon": "award",
    "imageUrl": "/images/services/certificate.jpg"
  },
  {
    "id": "exp-veille",
    "category": "Expertise",
    "type": "expertise",
    "title": "Veille - Suivi Réglementaire",
    "description": "Surveillance continue de l'évolution réglementaire et juridique",
    "shortDescription": "Alertes réglementaires et juridiques",
    "features": [
      "Bulletin mensuel",
      "Alertes immédiates",
      "Analyse juridique",
      "Impact métier"
    ],
    "icon": "bell",
    "imageUrl": "/images/services/veille.jpg"
  },
  {
    "id": "srv-coach-mgr",
    "category": "Conseil",
    "type": "service",
    "title": "Coaching Managers & QSE",
    "description": "Accompagnement des décideurs et responsables qualité-sécurité",
    "shortDescription": "Formation leadership sécurité",
    "features": [
      "Séminaires sur mesure",
      "Coaching terrain",
      "Outils de pilotage",
      "Tableaux de bord KPIs"
    ],
    "icon": "users",
    "imageUrl": "/images/services/coaching-mgr.jpg"
  },
  {
    "id": "srv-coach-tst",
    "category": "Conseil",
    "type": "service",
    "title": "Coaching Animateurs TST",
    "description": "Formation spécialisée pour Travaux Sous Tension (accrédités)",
    "shortDescription": "TST Expertise & Certification",
    "features": [
      "Modules TST avancés",
      "Certification reconnue",
      "Simulateurs terrain",
      "Suivi post-formation"
    ],
    "icon": "zap",
    "imageUrl": "/images/services/coaching-tst.jpg"
  },
  {
    "id": "srv-coach-encad",
    "category": "Conseil",
    "type": "service",
    "title": "Coaching Encadrement Chantier",
    "description": "Formation et coaching des chefs de chantier en sécurité électrique",
    "shortDescription": "Gestion sécurité opérationnelle",
    "features": [
      "Formation terrain",
      "Audit chantier",
      "Mentoring personnalisé",
      "Certification opérationnelle"
    ],
    "icon": "hard-hat",
    "imageUrl": "/images/services/coaching-encad.jpg"
  },
  {
    "id": "srv-form-orgs",
    "category": "Conseil",
    "type": "service",
    "title": "Accompagnement Organismes de Formation",
    "description": "Support pédagogique et contenu pour prestataires formation",
    "shortDescription": "Partner Formation",
    "features": [
      "Contenus pédagogiques",
      "Certification cursus",
      "Partenariat long terme",
      "Suport formateurs"
    ],
    "icon": "book-open",
    "imageUrl": "/images/services/coaching-orgs.jpg"
  }
]
```

#### 3. `pillars.json`
```json
[
  {
    "id": "pillar-1",
    "title": "Expertise",
    "icon": "zap",
    "description": "20+ ans d'expérience, 200+ entreprises accompagnées. Expertise terrain reconnue en sécurité électrique et risques opérationnels.",
    "color": "blue"
  },
  {
    "id": "pillar-2",
    "title": "Agence de Notation",
    "icon": "star",
    "description": "Rating indépendant et transparent du risque électrique. Notation de AAA (maîtrise optimale) à DDD (risque critique).",
    "color": "yellow"
  },
  {
    "id": "pillar-3",
    "title": "Conseils & Formation",
    "icon": "users",
    "description": "Coaching pédagogique bienveillant. Approche neurosciences et formation sur mesure pour tous les niveaux organisationnels.",
    "color": "green"
  }
]
```

#### 4. `values.json`
```json
[
  {
    "id": "val-1",
    "title": "Indépendance Totale",
    "description": "Aucun conflit d'intérêt. Notation objective et impartiale sans lien avec prestataires ou fournisseurs.",
    "icon": "shield"
  },
  {
    "id": "val-2",
    "title": "Confidentialité Garantie",
    "description": "Vos données et vos notes restent strictement confidentielles. Notation anonyme possible sur demande.",
    "icon": "lock"
  },
  {
    "id": "val-3",
    "title": "Sérénité Préventive",
    "description": "Transformer l'inquiétude en vigilance collective et maîtrise opérationnelle. Approche positive et constructive.",
    "icon": "heart"
  },
  {
    "id": "val-4",
    "title": "Notation AAA",
    "description": "Objectif : accompagner vers la maîtrise optimale (AAA) du risque électrique. Excellence opérationnelle.",
    "icon": "target"
  }
]
```

#### 5. `client_documents.json`
```json
{
  "clientName": "Jean Dupont - Electricité Pro SA",
  "clientId": "cli-12345",
  "documents": [
    {
      "id": "doc-nl-001",
      "title": "Newsletter CETé #15 - Janvier 2026",
      "category": "newsletters",
      "type": "PDF",
      "description": "Actualités réglementaires et tendances sécurité",
      "fileSize": "1.2 MB",
      "uploadDate": "2026-02-01",
      "url": "/documents/newsletter-15.pdf"
    },
    {
      "id": "doc-cap-012",
      "title": "Capsule #12 - Harnais de sécurité TST",
      "category": "capsules",
      "type": "video",
      "description": "Utilisation et certification du matériel de protection",
      "duration": "8:42",
      "uploadDate": "2026-01-28",
      "youtubeId": "dQw4w9WgXcQ"
    },
    {
      "id": "doc-guide-001",
      "title": "Guide Opératoire - Procédure Habilitation électrique",
      "category": "guides",
      "type": "PDF",
      "description": "Étapes et vérifications pour l'habilitation du personnel",
      "fileSize": "3.1 MB",
      "uploadDate": "2026-01-20",
      "url": "/documents/guide-habilitation.pdf"
    },
    {
      "id": "doc-carnet-001",
      "title": "Carnet d'Appui - Risques électriques courants",
      "category": "carnets",
      "type": "PDF",
      "description": "Aide-mémoire terrain pour opérateurs et techniciens",
      "fileSize": "2.8 MB",
      "uploadDate": "2026-01-15",
      "url": "/documents/carnet-appui.pdf"
    },
    {
      "id": "doc-guide-002",
      "title": "Guide TST 2026 - Travaux Sous Tension",
      "category": "guides",
      "type": "PDF",
      "description": "Réglementation et bonnes pratiques pour les TST accrédités",
      "fileSize": "4.2 MB",
      "uploadDate": "2026-01-10",
      "url": "/documents/guide-tst-2026.pdf"
    }
  ],
  "notifications": [
    {
      "id": "notif-1",
      "type": "veille",
      "message": "Nouvelle réglementation décret électrique du 01/02/2026",
      "date": "2026-02-04",
      "read": false
    }
  ]
}
```

#### 6. `admin_articles.json`
```json
{
  "articles": [
    {
      "id": "art-1",
      "title": "Tendances de la sécurité électrique 2026",
      "excerpt": "L'année 2026 apporte des évolutions réglementaires majeures...",
      "author": "Michel LIGIER",
      "category": "Expertise",
      "status": "published",
      "publishedDate": "2026-02-01",
      "views": 342,
      "featured": true
    },
    {
      "id": "art-2",
      "title": "TST et neurosciences : une pédagogie innovante",
      "excerpt": "Comment les apports des neurosciences transforment la formation...",
      "author": "Pierre VIRELY",
      "category": "Formation",
      "status": "published",
      "publishedDate": "2026-01-25",
      "views": 187,
      "featured": false
    },
    {
      "id": "art-3",
      "title": "Audit de conformité : nouvelle approche 2026",
      "excerpt": "CETé lance une nouvelle méthodologie d'audit...",
      "author": "Bruno CLAUDEL",
      "category": "Expertise",
      "status": "draft",
      "publishedDate": null,
      "views": 0,
      "featured": false
    }
  ]
}
```

#### 7. `navigation.json`
```json
{
  "mainNav": [
    { "label": "Accueil", "href": "/" },
    { "label": "Qui sommes-nous ?", "href": "/a-propos" },
    { "label": "Expertise", "href": "/expertise" },
    { "label": "Services", "href": "/services" },
    { "label": "Contact", "href": "/contact" }
  ],
  "footerNav": [
    { "label": "Mentions légales", "href": "/legal" },
    { "label": "Politique de confidentialité", "href": "/privacy" },
    { "label": "Conditions générales", "href": "/cgu" },
    { "label": "Plan du site", "href": "/sitemap" }
  ],
  "ctaButtons": [
    { "label": "Espace Client", "href": "/client" },
    { "label": "Demander un audit", "href": "/contact" }
  ]
}
```

#### 8. `contact_info.json`
```json
{
  "company": "CETé - Conseil Expertise Technique Électricité",
  "address": "SERCE - 9 rue de Berri",
  "city": "75008 Paris",
  "country": "France",
  "phone": "+33 (0)1 XX XX XX XX",
  "email": "contact@cete-notation.fr",
  "website": "www.cete-notation.fr",
  "businessHours": {
    "monday": "09:00-18:00",
    "tuesday": "09:00-18:00",
    "wednesday": "09:00-18:00",
    "thursday": "09:00-18:00",
    "friday": "09:00-18:00",
    "saturday": "Fermé",
    "sunday": "Fermé"
  },
  "maps": {
    "latitude": 48.8706,
    "longitude": 2.3062
  }
}
```

#### 9. `admin_stats.json` (Mock Dashboard)
```json
{
  "timestamp": "2026-02-04",
  "stats": [
    {
      "id": "stat-1",
      "label": "Clients actifs",
      "value": 47,
      "trend": "+12%",
      "icon": "users"
    },
    {
      "id": "stat-2",
      "label": "Audits réalisés",
      "value": 134,
      "trend": "+8%",
      "icon": "check-circle"
    },
    {
      "id": "stat-3",
      "label": "Certificats émis",
      "value": 28,
      "trend": "+5%",
      "icon": "award"
    },
    {
      "id": "stat-4",
      "label": "Rating moyen",
      "value": "BB+",
      "trend": "stable",
      "icon": "star"
    }
  ]
}
```

---

## 🎨 Design System & UI

### Palette de Couleurs

| Nom | Hex | Usage |
|-----|-----|-------|
| **Bleu Nuit (Confiance)** | `#001a33` | Headers, CTAs primaires |
| **Bleu Professionnel** | `#0066cc` | Links, accents |
| **Jaune Sécurité (Vigilance)** | `#ffc107` | Icônes électricité, Alerts |
| **Gris Clair (Fond)** | `#f5f5f5` | Backgrounds cartes |
| **Blanc** | `#ffffff` | Fond principal |
| **Gris Texte** | `#333333` | Texte body |
| **Vert Succès** | `#28a745` | Status OK, validations |
| **Rouge Alerte** | `#dc3545` | Erreurs, risques |

### Typography
- **Headings (H1-H6):** `font-family: 'Inter', sans-serif` | `font-weight: 600-700`
- **Body:** `font-family: 'Inter', sans-serif` | `font-size: 1rem | 16px` | `font-weight: 400`
- **Code:** `font-family: 'Courier New', monospace` | `font-size: 0.875rem`

### Spacing (Tailwind)
- Base unit: `8px` (rem = 0.5rem)
- Padding: `p-4`, `p-6`, `p-8`, `p-12`
- Margin: `m-4`, `m-6`, `m-8`
- Gap: `gap-4`, `gap-6`, `gap-8`

### Border Radius
- Cards: `rounded-lg` (8px)
- Buttons: `rounded-md` (6px)
- Inputs: `rounded` (4px)

### Shadows
- Cards hover: `shadow-md`
- Dropdowns: `shadow-lg`

---

## 🚀 Instructions pour Claude Code

### Prompt à Copier-Coller dans Claude Code

```
Tu es Lead Developer Senior React/Next.js. Nous lançons le projet CETé (Conseil Expertise Technique Électricité).

🎯 OBJECTIF PHASE 1
Créer un site vitrine 5 pages + une structure Admin/Client complète (mockée).

⚙️ CONTRAINTE MAJEURE
Pas de Backend réel. Utilise Mock Data (JSON typés en TypeScript) pour tout le contenu dynamique. Prépare le terrain pour Supabase intégration Phase 2.

🛠 TECH STACK REQUIS
- Next.js 14+ (App Router)
- TypeScript strict
- Tailwind CSS 3.4+
- shadcn/ui (composants)
- Lucide React (icônes)
- React Hook Form (formulaires)

🎨 DESIGN SYSTEM
Professionnel, sobre, rassurant (secteur sécurité électrique).
Palette : Bleu Nuit (#001a33), Jaune Sécurité (#ffc107), Blanc, Gris clair
Utiliser Tailwind variables pour cohérence.

📂 STRUCTURE DE DOSSIERS OBLIGATOIRE
cete-project/
├── app/                          # Routes Next.js (App Router)
│   ├── layout.tsx               # Root layout + providers
│   ├── page.tsx                 # Homepage (/)
│   ├── a-propos/page.tsx        # About page
│   ├── expertise/page.tsx       # Expertise page
│   ├── services/page.tsx        # Services page
│   ├── contact/page.tsx         # Contact page
│   ├── client/
│   │   ├── layout.tsx           # Client layout avec authentification check
│   │   ├── login/page.tsx       # Client login
│   │   └── dashboard/page.tsx   # Client dashboard
│   └── admin/
│       ├── layout.tsx           # Admin layout avec auth check
│       ├── login/page.tsx       # Admin login
│       ├── dashboard/page.tsx   # Admin dashboard
│       ├── blog/page.tsx        # Blog management
│       └── documents/page.tsx   # Document library
│
├── components/
│   ├── common/
│   │   ├── Header.tsx           # Navigation sticky
│   │   ├── Footer.tsx           # Footer global
│   │   └── Navigation.tsx       # Nav composant
│   ├── sections/
│   │   ├── HeroSection.tsx      # Hero réutilisable
│   │   ├── PillarsSection.tsx   # 3 Piliers
│   │   ├── ServicesGrid.tsx     # Grid services
│   │   ├── FoundersGrid.tsx     # Grid fondateurs
│   │   └── ValuesSection.tsx    # Valeurs éthiques
│   └── ui/
│       ├── Button.tsx           # Button component
│       ├── Card.tsx             # Card component
│       ├── Modal.tsx            # Modal wrapper
│       └── Toast.tsx            # Toast notifications
│
├── data/
│   └── mocks/
│       ├── founders.json
│       ├── services.json
│       ├── pillars.json
│       ├── values.json
│       ├── client_documents.json
│       ├── admin_articles.json
│       ├── admin_stats.json
│       ├── navigation.json
│       └── contact_info.json
│
├── types/
│   ├── index.ts                 # Export central
│   ├── founder.ts               # export interface Founder
│   ├── service.ts               # export interface Service
│   ├── document.ts              # export interface Document
│   └── auth.ts                  # export interface AuthUser
│
├── lib/
│   ├── auth.ts                  # Mock auth utils (localStorage)
│   ├── data-loader.ts           # Utilitaires charger JSON
│   └── constants.ts             # Constants globales
│
├── public/
│   ├── images/
│   │   ├── founders/            # Photo fondateurs (placeholders)
│   │   ├── services/            # Visuels services
│   │   └── adn-radar.svg        # Radar/Cible ADN
│   └── fonts/
│
├── styles/
│   └── globals.css              # Styles globaux Tailwind
│
├── tailwind.config.ts           # Config Tailwind custom
├── tsconfig.json                # Config TypeScript
├── next.config.js               # Config Next.js
├── package.json                 # Dependencies
└── README.md                    # Documentation projet

📋 ÉTAPES DE LIVRAISON (ORDONNÉES)

**ÉTAPE 1 : Setup & Types**
- [ ] Initialiser Next.js 14 avec TypeScript
- [ ] Installer : Tailwind, shadcn/ui, Lucide React, React Hook Form
- [ ] Créer la structure de dossiers
- [ ] Créer tous les fichiers JSON dans /data/mocks/
- [ ] Générer les interfaces TypeScript dans /types/ (Founder, Service, etc.)

**ÉTAPE 2 : Architecture de base**
- [ ] Root layout.tsx (providers, Header/Footer)
- [ ] Créer composants réutilisables (Button, Card, Modal, Toast)
- [ ] Créer sections (HeroSection, PillarsSection, ServicesGrid, etc.)
- [ ] Intégrer data-loader utility (charger JSON)

**ÉTAPE 3 : Pages Vitrine (5 pages publiques)**
- [ ] / (Accueil) ✓
- [ ] /a-propos (Qui sommes-nous) ✓
- [ ] /expertise (Agence de Notation) ✓
- [ ] /services (Services & Conseils) ✓
- [ ] /contact (Contact) ✓

**ÉTAPE 4 : Système d'authentification (mock)**
- [ ] Créer auth utils (localStorage simple)
- [ ] Page /client/login
- [ ] Page /admin/login
- [ ] Middleware/Layout checks pour protéger /client/* et /admin/*

**ÉTAPE 5 : Espace Client**
- [ ] /client/dashboard (Ressources downloadables)
- [ ] UI pour afficher documents (PDF, vidéo, guides, carnets)
- [ ] Notifications ticker
- [ ] Profil client (lecture + UI édition)

**ÉTAPE 6 : Espace Admin**
- [ ] /admin/dashboard (Stats mockées)
- [ ] /admin/blog (Tableau articles + modale ajout)
- [ ] /admin/documents (Tableau docs + form upload simulé)
- [ ] /admin/users (Grille utilisateurs read-only)

**ÉTAPE 7 : Polishing & Testing**
- [ ] Vérifier tous les links/routing
- [ ] Responsive design mobile/tablet/desktop
- [ ] Optimiser images (next/image)
- [ ] ESLint + Prettier
- [ ] Tester authentification mock

✅ LIVRABLES ATTENDUS
1. Repository GitHub avec historique commits
2. Projet deployable sur Vercel (lien live)
3. README.md avec setup local instructions
4. Tous les fichiers JSON peuplés et typés
5. Responsive et accessible (WCAG AA minimum)
6. Prêt pour intégration Supabase Phase 2

🎯 CRITÈRES DE SUCCÈS
- ✅ 5 pages publiques fonctionnelles
- ✅ Mock data JSON chargées dynamiquement
- ✅ Authentification localStorage (demo)
- ✅ Espace client + admin visuellement complets
- ✅ Design cohérent et professionnel
- ✅ TypeScript strict (0 any)
- ✅ Responsive design
- ✅ Accessible (ARIA, keyboard nav)
- ✅ Production-ready (optimized, no console errors)

Commençons par l'ÉTAPE 1 : setup Next.js + types + JSON.
```

---

## ✅ Checklist de Déploiement

### Pré-Développement
- [ ] Valider la structure avec le client
- [ ] Confirmer les 4 fondateurs (noms, photos)
- [ ] Fournir images/visuels (ou placeholders)
- [ ] Valider palette de couleurs

### Développement
- [ ] Setup Git + GitHub repo
- [ ] Initialiser Next.js project
- [ ] Créer tous les fichiers JSON
- [ ] Générer interfaces TypeScript
- [ ] Développer 5 pages publiques
- [ ] Implémenter authentification mock
- [ ] Créer espace client
- [ ] Créer espace admin
- [ ] Tests responsiveness
- [ ] Tests accessibilité

### Pré-Déploiement
- [ ] ESLint clean (0 warnings)
- [ ] Prettier formatted
- [ ] Build local OK (no errors)
- [ ] Vérifier tous les links/routing
- [ ] Images optimisées
- [ ] Meta tags (OG, titles)
- [ ] Favicon
- [ ] README documentation

### Déploiement
- [ ] Setup environment variables
- [ ] Deploy preview
- [ ] Valider avec client sur lien live
- [ ] Corrections/feedback
- [ ] Deploy production
- [ ] Monitoring (error tracking)

###
- [ ] Backup database (via Supabase Phase 2)
- [ ] Documentation API (pour Phase 2)
- [ ] Roadmap Phase 2 : Supabase + Auth réelle

---

## 📞 Contacts & Support

**Client Signatory :**
- Point de contact client pour feedback
- Validation pages visuellement

**Team CETé (Fondateurs) :**
- Michel LIGIER, Bruno CLAUDEL, Pierre VIRELY, Denis VUILLOZ
- Pour contenus spécialisés (expertise)

**Adresse Bureau :**
SERCE - 9 rue de Berri  
75008 Paris, France  
contact@cete-notation.fr

---

## 📚 Références & Ressources

### Documentation Technique
- [Next.js 14 Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev)

### Design Patterns Utilisés
- Server Components (Next.js 14)
- Static Generation + ISR où applicable
- Mock data pattern (préparation Supabase)
- Type-safe data fetching

---

**END OF PRD v1.0**

*Ce document est prêt pour transmission à Claude Code. Tous les éléments sont couverts pour une implémentation complète et sans ambiguïté.*