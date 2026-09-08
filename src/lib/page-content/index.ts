import type { PageContentField } from "@/types";
import { homeFields } from "./pages/home";
import { aboutFields } from "./pages/about";
import { servicesFields } from "./pages/services";
import { expertiseFields } from "./pages/expertise";
import { contactFields } from "./pages/contact";
import { blogFields } from "./pages/blog";
import { glossaireFields } from "./pages/glossaire";
import { observatoireFields } from "./pages/observatoire";
import { connexionFields } from "./pages/connexion";
import { legalFields } from "./pages/legal";

export { getPageFieldDefault } from "./defaults";

export const PAGE_CONTENT_SCHEMA: Record<string, PageContentField[]> = {
  home: homeFields,
  "a-propos": aboutFields,
  services: servicesFields,
  expertise: expertiseFields,
  contact: contactFields,
  blog: blogFields,
  glossaire: glossaireFields,
  observatoire: observatoireFields,
  connexion: connexionFields,
  legal: legalFields,
};

export const PAGE_LABELS: Record<string, string> = {
  home: "Accueil",
  "a-propos": "À propos",
  services: "Services",
  expertise: "Expertise / Notation",
  contact: "Contact",
  blog: "Blog (page d'index)",
  glossaire: "Glossaire",
  observatoire: "Observatoire",
  connexion: "Connexion",
  legal: "Mentions légales",
};

export const PAGE_KEYS = Object.keys(PAGE_CONTENT_SCHEMA);

export function getPageSchema(pageKey: string): PageContentField[] {
  return PAGE_CONTENT_SCHEMA[pageKey] ?? [];
}
