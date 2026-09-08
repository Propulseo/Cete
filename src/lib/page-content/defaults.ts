import frMessages from "../../../messages/fr.json";

/** pageKey (clé du schéma admin) -> namespace racine dans messages/fr.json. */
const MESSAGE_ROOT: Record<string, string> = {
  home: "home",
  "a-propos": "about",
  services: "services",
  expertise: "expertise",
  contact: "contact",
  blog: "blog",
  glossaire: "glossary",
  observatoire: "observatory",
  connexion: "connexion",
};

// Cas où le premier segment de la clé de champ (ex: "sidebar.howItWorks")
// ne correspond pas au groupe réel dans messages/fr.json (ex: "contact.main.howItWorks").
// "" signifie que le groupe n'existe pas dans messages.json : la clé est à la racine du namespace.
const GROUP_ALIASES: Record<string, Record<string, string>> = {
  contact: { sidebar: "main" },
  connexion: { form: "" },
  observatoire: { page: "" },
};

function getByPath(obj: unknown, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof value === "string" ? value : "";
}

/** Texte actuellement affiché sur le site pour ce champ, avant toute surcharge admin. */
export function getPageFieldDefault(pageKey: string, fieldKey: string): string {
  const root = MESSAGE_ROOT[pageKey];
  if (!root) return "";
  const [group, ...rest] = fieldKey.split(".");
  const alias = GROUP_ALIASES[pageKey]?.[group];
  const realGroup = alias !== undefined ? alias : group;
  const path = [root, realGroup, ...rest].filter(Boolean).join(".");
  return getByPath(frMessages, path);
}
