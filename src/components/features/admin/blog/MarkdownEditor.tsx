"use client";

// MarkdownEditor — zone de rédaction du corps d'article, avec barre d'outils.
//
// Le stockage reste du Markdown (c'est ce que rend la vitrine), mais le rédacteur
// n'a plus à le connaître : chaque bouton écrit la syntaxe à sa place, sur la
// sélection en cours. Les libellés sont écrits en toutes lettres à côté des icônes —
// pour un rédacteur non technique, « Gras » est infiniment plus clair qu'un B stylisé,
// et c'est le genre de détail qui décide si l'outil est utilisé ou contourné.
//
// L'insertion d'image passe par un vrai choix de fichier + envoi vers le bucket
// `blog-images` : coller une URL à la main était le point de blocage le plus dur.
import { useEffect, useRef, useState } from "react";
import {
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link2,
  ImagePlus,
  Minus,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadBlogImage } from "@/lib/repo/blog-media.repo";
import {
  surround,
  prefixLines,
  insertBlock,
  makeLink,
  captionFromFileName,
  type EditResult,
} from "./markdown-actions";

interface MarkdownEditorProps {
  value: string;
  onChange: (next: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingSel = useRef<[number, number] | null>(null);
  const [uploading, setUploading] = useState(false);

  // La textarea est contrôlée par React : après un changement de valeur, la sélection
  // est perdue au re-rendu. On la repose ici, une fois le DOM à jour, pour que le
  // curseur reste là où l'action l'a laissé (entre les astérisques, sur l'URL…).
  useEffect(() => {
    const el = ref.current;
    if (!el || !pendingSel.current) return;
    const [start, end] = pendingSel.current;
    pendingSel.current = null;
    el.focus();
    el.setSelectionRange(start, end);
  });

  const apply = (fn: (sel: { value: string; start: number; end: number }) => EditResult) => {
    const el = ref.current;
    if (!el) return;
    const result = fn({ value, start: el.selectionStart, end: el.selectionEnd });
    onChange(result.value);
    pendingSel.current = [result.selStart, result.selEnd];
  };

  const handleFile = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Ce fichier n'est pas une image.");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadBlogImage(file);
      const caption = captionFromFileName(file.name);
      apply((sel) => insertBlock(sel, `![${caption}](${url})`));
      toast.success("Image ajoutée à l'article");
    } catch {
      toast.error("L'envoi de l'image a échoué. Réessayez.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  // Raccourcis clavier usuels, pour ceux qui les connaissent — la barre reste le
  // chemin principal.
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const key = e.key.toLowerCase();
    if (key === "b") {
      e.preventDefault();
      apply((s) => surround(s, "**", "**", "texte en gras"));
    } else if (key === "i") {
      e.preventDefault();
      apply((s) => surround(s, "*", "*", "texte en italique"));
    } else if (key === "k") {
      e.preventDefault();
      apply(makeLink);
    }
  };

  const tools: { key: string; label: string; icon: typeof Bold; run: () => void }[] = [
    { key: "h2", label: "Titre", icon: Heading2, run: () => apply((s) => prefixLines(s, () => "## ", "Titre de section")) },
    { key: "h3", label: "Sous-titre", icon: Heading3, run: () => apply((s) => prefixLines(s, () => "### ", "Sous-titre")) },
    { key: "b", label: "Gras", icon: Bold, run: () => apply((s) => surround(s, "**", "**", "texte en gras")) },
    { key: "i", label: "Italique", icon: Italic, run: () => apply((s) => surround(s, "*", "*", "texte en italique")) },
    { key: "ul", label: "Liste", icon: List, run: () => apply((s) => prefixLines(s, () => "- ", "Premier point")) },
    { key: "ol", label: "Numérotée", icon: ListOrdered, run: () => apply((s) => prefixLines(s, (i) => `${i + 1}. `, "Première étape")) },
    { key: "quote", label: "Citation", icon: Quote, run: () => apply((s) => prefixLines(s, () => "> ", "Texte de la citation")) },
    { key: "link", label: "Lien", icon: Link2, run: () => apply(makeLink) },
    { key: "hr", label: "Séparateur", icon: Minus, run: () => apply((s) => insertBlock(s, "---")) },
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="article-content">Contenu de l&apos;article</Label>

      <div className="overflow-hidden rounded-md border border-input bg-card">
        <div className="flex flex-wrap items-center gap-1 border-b border-input bg-secondary/40 p-1.5">
          {tools.map((tool) => (
            <ToolButton key={tool.key} label={tool.label} icon={tool.icon} onClick={tool.run} />
          ))}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          <ToolButton
            label={uploading ? "Envoi…" : "Image"}
            icon={uploading ? Loader2 : ImagePlus}
            spin={uploading}
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          />
        </div>

        <Textarea
          id="article-content"
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          rows={14}
          className="rounded-none border-0 text-base leading-relaxed shadow-none focus-visible:ring-0 lg:min-h-[32rem]"
          placeholder="Rédigez votre article ici.&#10;&#10;Sélectionnez du texte puis cliquez sur un bouton ci-dessus pour le mettre en forme."
        />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Sélectionnez du texte puis cliquez sur un bouton pour le mettre en forme. Le résultat
        exact s&apos;affiche dans l&apos;aperçu à droite. Pour une image, cliquez sur
        «&nbsp;Image&nbsp;» : le texte entre crochets deviendra la légende sous la photo.
      </p>
    </div>
  );
}

function ToolButton({
  label,
  icon: Icon,
  onClick,
  disabled,
  spin,
}: {
  label: string;
  icon: typeof Bold;
  onClick: () => void;
  disabled?: boolean;
  spin?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      // Survol neutre plutôt que `bg-accent` : ce jeton vaut l'orange de marque hors
      // du thème admin, et un bouton d'outil en aplat orange fait croire à un état actif.
      className="inline-flex min-h-11 items-center gap-1.5 rounded px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-black/[0.06] disabled:opacity-50 sm:min-h-8 dark:hover:bg-white/10"
    >
      <Icon className={`size-4 shrink-0 ${spin ? "animate-spin" : ""}`} strokeWidth={1.75} />
      {label}
    </button>
  );
}
