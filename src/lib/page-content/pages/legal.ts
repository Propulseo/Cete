import type { PageContentField } from "@/types";

// Page non adossée à next-intl (texte 100% en dur, non localisé) : chaque champ
// porte son propre defaultValue au lieu de venir de messages/fr.json.
export const legalFields: PageContentField[] = [
  {
    key: "editor.companyName",
    label: "Éditeur - raison sociale",
    type: "text",
    defaultValue: "SCI MaP Expertise & Conseils",
  },
  {
    key: "editor.legalForm",
    label: "Éditeur - forme juridique",
    type: "text",
    defaultValue: "Société par actions simplifiée à associé unique (SASU)",
  },
  { key: "editor.capital", label: "Éditeur - capital social", type: "text", defaultValue: "2 000 €" },
  { key: "editor.siren", label: "Éditeur - SIREN", type: "text", defaultValue: "902 413 525" },
  { key: "editor.siret", label: "Éditeur - SIRET du siège", type: "text" },
  { key: "editor.vat", label: "Éditeur - n° TVA intracommunautaire", type: "text" },
  {
    key: "editor.address",
    label: "Éditeur - siège social",
    type: "text",
    defaultValue: "103 Chemin de Sapois, 88400 Gérardmer",
  },
  { key: "editor.phone", label: "Éditeur - téléphone", type: "text" },
  {
    key: "director.name",
    label: "Directeur de la publication",
    type: "text",
    defaultValue: "Bruno Claudel, Président",
  },
  { key: "host.name", label: "Hébergeur - nom", type: "text", defaultValue: "OVH SAS" },
  {
    key: "host.address",
    label: "Hébergeur - adresse",
    type: "text",
    defaultValue: "2 rue Kellermann, 59100 Roubaix, France",
  },
  {
    key: "host.phone",
    label: "Hébergeur - téléphone",
    type: "text",
    defaultValue: "1007 (ou +33 9 72 10 10 07 depuis l'étranger)",
  },
];
