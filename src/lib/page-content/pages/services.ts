import type { PageContentField } from "@/types";

export const servicesFields: PageContentField[] = [
  { key: "hero.badge", label: "Hero - badge", type: "text" },
  { key: "hero.heading", label: "Hero - titre", type: "text" },
  { key: "hero.description", label: "Hero - description", type: "textarea" },
  { key: "hero.subdescription", label: "Hero - sous-description", type: "textarea" },
  { key: "hero.discoverRating", label: "Hero - bouton découvrir la notation", type: "text" },
  { key: "hero.contactUs", label: "Hero - bouton contact", type: "text" },
  { key: "pillars.heading", label: "Piliers - titre", type: "text" },
  { key: "pillars.description", label: "Piliers - description", type: "textarea" },
  { key: "process.heading", label: "Processus - titre", type: "text" },
  { key: "process.description", label: "Processus - description", type: "textarea" },
  { key: "cta.heading", label: "CTA - titre", type: "text" },
  { key: "cta.description", label: "CTA - description", type: "textarea" },
  { key: "cta.ourRating", label: "CTA - bouton notre notation", type: "text" },
  { key: "cta.requestEvaluation", label: "CTA - bouton demander une évaluation", type: "text" },
];
