"use client";

import { RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/repo/articles.repo";
import { CoverImageField } from "./CoverImageField";
import { CATEGORIES, type ArticleForm } from "./article-form";

interface Props {
  form: ArticleForm;
  set: (patch: Partial<ArticleForm>) => void;
  coverFile: File | null;
  onCoverFileChange: (file: File | null) => void;
}

export function ArticleEditorFields({ form, set, coverFile, onCoverFileChange }: Props) {
  const onTitle = (v: string) =>
    set({ title: v, ...(form.slugLocked ? {} : { slug: slugify(v) }) });

  return (
    <div className="space-y-5">
      {/* Titre */}
      <div className="space-y-2">
        <Label>Titre *</Label>
        <Input
          value={form.title}
          onChange={(e) => onTitle(e.target.value)}
          placeholder="Titre de l'article"
          required
        />
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label>Slug (URL)</Label>
        <div className="flex items-center gap-2">
          <Input
            value={form.slug}
            onChange={(e) => set({ slug: e.target.value, slugLocked: true })}
            placeholder="slug-de-larticle"
          />
          <button
            type="button"
            onClick={() => set({ slug: slugify(form.title), slugLocked: false })}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-input px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title="Régénérer depuis le titre"
            aria-label="Régénérer le slug depuis le titre"
          >
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.75} />
            Auto
          </button>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          /blog/{form.slug || slugify(form.title) || "…"}
        </p>
      </div>

      {/* Résumé / chapô */}
      <div className="space-y-2">
        <Label>Résumé / accroche *</Label>
        <Textarea
          value={form.excerpt}
          onChange={(e) => set({ excerpt: e.target.value })}
          rows={3}
          placeholder="Phrase d'accroche affichée en tête d'article et dans la liste."
        />
      </div>

      {/* Catégorie + temps de lecture */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Catégorie</Label>
          <NativeSelect
            value={form.category}
            onChange={(e) => set({ category: e.target.value as ArticleForm["category"] })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="space-y-2">
          <Label>Temps de lecture (min)</Label>
          <Input
            type="number"
            min={1}
            value={form.readMinutes}
            onChange={(e) => set({ readMinutes: e.target.value })}
            placeholder="auto"
          />
        </div>
      </div>

      {/* Auteur + rôle */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Auteur *</Label>
          <Input
            value={form.author}
            onChange={(e) => set({ author: e.target.value })}
            placeholder="Prénom NOM"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Rôle de l&apos;auteur</Label>
          <Input
            value={form.authorRole}
            onChange={(e) => set({ authorRole: e.target.value })}
            placeholder="Expert risque électrique"
          />
        </div>
      </div>

      {/* Couverture + alt */}
      <div className="space-y-2">
        <Label>Image de couverture</Label>
        <CoverImageField
          file={coverFile}
          onFileChange={onCoverFileChange}
          currentUrl={form.coverImage || null}
          onClearCurrent={() => set({ coverImage: "" })}
        />
        <Input
          value={form.coverAlt}
          onChange={(e) => set({ coverAlt: e.target.value })}
          placeholder="Texte alternatif de l'image (accessibilité / SEO)"
        />
      </div>

      {/* Vidéo */}
      <div className="space-y-2">
        <Label>Vidéo (optionnel)</Label>
        <Input
          value={form.videoUrl}
          onChange={(e) => set({ videoUrl: e.target.value })}
          placeholder="URL YouTube, Vimeo ou .mp4"
        />
      </div>

      {/* SEO */}
      <div className="space-y-2">
        <Label>Meta description (SEO)</Label>
        <Textarea
          value={form.metaDescription}
          onChange={(e) => set({ metaDescription: e.target.value })}
          rows={2}
          placeholder="Par défaut : le résumé ci-dessus."
        />
      </div>

      {/* À la une */}
      <label className="flex items-center gap-2.5 pt-1">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => set({ featured: e.target.checked })}
          className="h-4 w-4 rounded border-input"
        />
        <span className="text-sm font-medium text-foreground">Mettre cet article à la une</span>
      </label>
    </div>
  );
}
