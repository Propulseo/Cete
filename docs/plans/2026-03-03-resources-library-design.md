# Design : Bibliothèque de Ressources Techniques et Réglementaires

**Date** : 2026-03-03
**Approche retenue** : Nouveau modèle `Resource` dédié (Approche A)

## Contexte

L'admin dispose déjà d'une page "Documents" pour les contenus clients (newsletters, capsules, guides, carnets). Cette nouvelle fonctionnalité ajoute une **bibliothèque technique et réglementaire** distincte : l'admin gère les ressources, les clients les consultent et les téléchargent.

## Modèle de données

```typescript
interface Resource {
  id: string;                    // "res-{timestamp}"
  title: string;
  description: string;
  category: "normes" | "reglementation" | "guides" | "rapports" | "veille";
  type: "pdf" | "lien" | "video";
  url: string;
  youtubeId?: string;
  fileSize?: string;
  source?: string;               // Ex: "AFNOR", "Légifrance", "CETé"
  publishedDate: string;
  createdAt: string;
}
```

### Catégories (par domaine)

| Clé              | Label                  | Description                              |
|------------------|------------------------|------------------------------------------|
| `normes`         | Normes                 | Normes NF, EN, IEC                       |
| `reglementation` | Réglementation         | Décrets, arrêtés, directives EU          |
| `guides`         | Guides techniques      | Guides pratiques, fiches techniques      |
| `rapports`       | Rapports               | Études, analyses, retours d'expérience   |
| `veille`         | Veille réglementaire   | Actualités, mises à jour normatives      |

### Types de ressources

| Clé     | Label  | Champs spécifiques         |
|---------|--------|----------------------------|
| `pdf`   | PDF    | `fileSize`, `url`          |
| `lien`  | Lien   | `url`                      |
| `video` | Vidéo  | `url`, `youtubeId`         |

## Architecture

### Fichiers à créer

| Fichier                                                | Rôle                              |
|--------------------------------------------------------|-----------------------------------|
| `src/types/resource.ts`                                | Interface Resource                |
| `src/data/mocks/resources.json`                        | ~10 ressources de démo            |
| `src/lib/repo/resources.repo.ts`                       | CRUD localStorage                 |
| `src/app/admin/ressources/page.tsx`                    | Page admin (gestion)              |
| `src/components/features/admin/ResourceFormDialog.tsx`  | Formulaire modal                  |
| `src/app/client/ressources/page.tsx`                   | Page client (consultation)        |

### Fichiers à modifier

| Fichier                          | Modification                              |
|----------------------------------|-------------------------------------------|
| `src/app/admin/layout.tsx`       | Ajout lien "Ressources" dans la sidebar   |
| `src/app/client/layout.tsx`      | Ajout lien "Ressources" dans la sidebar   |
| `src/lib/data-loader.ts`         | Ajout getter `getResources()`             |
| `src/types/index.ts`             | Export du type Resource                   |

## Page Admin `/admin/ressources`

- Header : titre "Ressources" + bouton "Ajouter une ressource"
- Filtres : barre de recherche (titre/description) + dropdown catégorie + dropdown type
- Tableau : Ressource (titre, description, source), Catégorie (badge), Type (badge), Date, Actions
- Dialog modal : formulaire avec champs conditionnels selon le type

## Page Client `/client/ressources`

- Filtres : barre de recherche + dropdown catégorie + dropdown type
- Affichage en grille de cartes
- Actions : "Télécharger" (PDF), "Ouvrir" (lien externe), player intégré (vidéo)

## Patterns suivis

- Repository pattern avec localStorage (comme documents.repo.ts)
- ID generation : `res-{timestamp}`
- Storage key : `"cete_resources"`
- Toast notifications via sonner
- shadcn/ui components (Table, Badge, Dialog, Button, Input, Select)
- Client components (`"use client"`) pour les pages admin/client
