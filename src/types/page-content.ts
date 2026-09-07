export type PageContentFieldType = "text" | "textarea" | "image";

export interface PageContentField {
  /** Identifiant stable, unique dans la page (ex: "hero.badge"). */
  key: string;
  /** Libellé affiché dans le formulaire admin. */
  label: string;
  type: PageContentFieldType;
}

export interface PageOverrideValue {
  fr: string;
  en: string;
}

/** field_key -> valeur, pour une page donnée. */
export type PageOverridesMap = Record<string, PageOverrideValue>;
