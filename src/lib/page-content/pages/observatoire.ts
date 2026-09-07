import type { PageContentField } from "@/types";

// tertiles.* exclus : reprend mot pour mot les clés déjà utilisées par
// ExpertiseTertiles sur /expertise (mêmes clés messages.json) — les exposer
// ici créerait deux copies indépendamment éditables du même texte
// méthodologique. À unifier avant de les rendre éditables (hors périmètre).
export const observatoireFields: PageContentField[] = [
  { key: "hero.badge", label: "Hero - badge", type: "text" },
  { key: "hero.heading", label: "Hero - titre", type: "text" },
  { key: "hero.description", label: "Hero - description", type: "textarea" },
  { key: "page.intro", label: "Introduction", type: "textarea" },
  { key: "page.note", label: "Note", type: "textarea" },
];
