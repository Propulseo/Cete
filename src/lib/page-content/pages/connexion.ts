import type { PageContentField } from "@/types";

// Les libellés du formulaire (email, mot de passe, toasts, aria) restent hors
// périmètre : ce sont des libellés fonctionnels/accessibilité d'un flux
// d'authentification, pas du contenu éditorial.
export const connexionFields: PageContentField[] = [
  { key: "form.heading", label: "Formulaire - titre", type: "text" },
  { key: "form.subtitle", label: "Formulaire - sous-titre", type: "textarea" },
  { key: "brand.eyebrow", label: "Panneau de marque - eyebrow", type: "text" },
  { key: "brand.sub", label: "Panneau de marque - sous-texte", type: "textarea" },
  { key: "brand.titleLine1", label: "Panneau de marque - titre ligne 1", type: "text" },
  { key: "brand.titleLine2", label: "Panneau de marque - titre ligne 2", type: "text" },
  { key: "brand.vigiTitle", label: "Panneau de marque - titre Vigi-Score", type: "text" },
  { key: "brand.vigiCaption", label: "Panneau de marque - légende Vigi-Score", type: "text" },
];
