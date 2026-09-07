import type { PageContentField } from "@/types";

// Le corps de la page (les définitions) vient de src/data/glossary.ts — hors
// périmètre : c'est un jeu de définitions métier, pas du texte de page.
export const glossaireFields: PageContentField[] = [
  { key: "hero.badge", label: "Hero - badge", type: "text" },
  { key: "hero.heading", label: "Hero - titre", type: "text" },
  { key: "hero.description", label: "Hero - description", type: "textarea" },
];
