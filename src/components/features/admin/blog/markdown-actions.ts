// Transformations de texte de la barre d'outils Markdown.
//
// Isolées du composant : ce sont des fonctions pures sur (valeur, sélection), donc
// lisibles et vérifiables sans monter de textarea. Chacune renvoie la nouvelle valeur
// et la sélection à restaurer — c'est ce dernier point qui fait la différence à
// l'usage : après un clic sur « Gras », le curseur doit se retrouver entre les
// astérisques, prêt à taper, et non rejeté en fin de texte.

export interface EditResult {
  value: string;
  selStart: number;
  selEnd: number;
}

interface Sel {
  value: string;
  start: number;
  end: number;
}

/** Entoure la sélection (ou un texte d'exemple si rien n'est sélectionné). */
export function surround(
  { value, start, end }: Sel,
  before: string,
  after: string,
  placeholder: string,
): EditResult {
  const selected = value.slice(start, end);
  const body = selected || placeholder;
  const at = start + before.length;
  return {
    value: value.slice(0, start) + before + body + after + value.slice(end),
    selStart: at,
    selEnd: at + body.length,
  };
}

/**
 * Préfixe chaque ligne du bloc touché par la sélection. `makePrefix` reçoit l'index
 * de la ligne, ce qui permet de numéroter une liste ordonnée.
 */
export function prefixLines(
  { value, start, end }: Sel,
  makePrefix: (index: number) => string,
  placeholder: string,
): EditResult {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const nextBreak = value.indexOf("\n", end);
  const lineEnd = nextBreak === -1 ? value.length : nextBreak;

  const block = value.slice(lineStart, lineEnd) || placeholder;
  const prefixed = block
    .split("\n")
    .map((line, i) => makePrefix(i) + line)
    .join("\n");

  return {
    value: value.slice(0, lineStart) + prefixed + value.slice(lineEnd),
    selStart: lineStart,
    selEnd: lineStart + prefixed.length,
  };
}

/**
 * Insère un bloc autonome (image, séparateur) en garantissant la ligne vide qui
 * l'isole du paragraphe précédent — sans elle, Markdown recolle le bloc au texte
 * au-dessus et le rendu part de travers.
 */
export function insertBlock({ value, start, end }: Sel, block: string): EditResult {
  const before = value.slice(0, start);
  const after = value.slice(end);
  const lead = before && !before.endsWith("\n\n") ? (before.endsWith("\n") ? "\n" : "\n\n") : "";
  const trail = after && !after.startsWith("\n\n") ? (after.startsWith("\n") ? "\n" : "\n\n") : "\n";
  const inserted = lead + block + trail;
  return {
    value: before + inserted + after,
    selStart: start + lead.length + block.length,
    selEnd: start + lead.length + block.length,
  };
}

/** Lien : la sélection devient le libellé, le curseur se pose sur l'URL à compléter. */
export function makeLink({ value, start, end }: Sel): EditResult {
  const selected = value.slice(start, end);
  const label = selected || "texte du lien";
  const url = "https://";
  const inserted = `[${label}](${url})`;
  const urlStart = start + 1 + label.length + 2;
  return {
    value: value.slice(0, start) + inserted + value.slice(end),
    selStart: urlStart,
    selEnd: urlStart + url.length,
  };
}

/**
 * Légende d'image dérivée du nom de fichier. Le texte entre crochets d'une image
 * Markdown est rendu en légende sous la photo par ArticleBody : autant partir d'un
 * libellé lisible plutôt que de « IMG_4821.jpg ».
 */
export function captionFromFileName(name: string): string {
  const base = name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  if (!base) return "Illustration";
  return base.charAt(0).toUpperCase() + base.slice(1);
}
