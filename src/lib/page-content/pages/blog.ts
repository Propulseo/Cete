import type { PageContentField } from "@/types";

export const blogFields: PageContentField[] = [
  { key: "hero.badge", label: "Hero - badge", type: "text" },
  { key: "hero.headingStart", label: "Hero - début du titre", type: "text" },
  { key: "hero.headingEnd", label: "Hero - fin du titre", type: "text" },
  { key: "hero.description", label: "Hero - description", type: "textarea" },
  { key: "featured.label", label: "À la une - libellé", type: "text" },
  { key: "cta.heading", label: "Newsletter - titre", type: "text" },
  { key: "cta.description", label: "Newsletter - description", type: "textarea" },
];
