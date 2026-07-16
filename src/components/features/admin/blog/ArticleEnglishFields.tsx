"use client";

import { Languages } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ArticleForm } from "./article-form";

interface Props {
  form: ArticleForm;
  set: (patch: Partial<ArticleForm>) => void;
}

/**
 * Version anglaise de l'article (optionnelle). Tout champ laissé vide retombe
 * sur le français côté vitrine /en — on peut donc traduire progressivement.
 */
export function ArticleEnglishFields({ form, set }: Props) {
  return (
    <section className="space-y-5 rounded-xl border border-border bg-muted/30 p-5">
      <div className="flex items-center gap-2.5">
        <Languages className="h-4 w-4 text-primary" strokeWidth={1.75} />
        <h2 className="text-sm font-semibold text-foreground">Version anglaise (EN)</h2>
        <span className="text-xs text-muted-foreground">
          optionnelle — les champs vides affichent le français sur /en
        </span>
      </div>

      <div className="space-y-2">
        <Label>Titre (EN)</Label>
        <Input
          value={form.titleEn}
          onChange={(e) => set({ titleEn: e.target.value })}
          placeholder="Article title in English"
        />
      </div>

      <div className="space-y-2">
        <Label>Résumé / accroche (EN)</Label>
        <Textarea
          value={form.excerptEn}
          onChange={(e) => set({ excerptEn: e.target.value })}
          rows={3}
          placeholder="English teaser shown at the top of the article and in the list."
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Contenu (EN, Markdown)</Label>
          <span className="text-xs text-muted-foreground">
            ## titre · **gras** · - liste · [lien](url)
          </span>
        </div>
        <Textarea
          value={form.contentEn}
          onChange={(e) => set({ contentEn: e.target.value })}
          rows={14}
          className="font-mono text-sm leading-relaxed"
          placeholder="Write the English body of the article in Markdown…"
        />
      </div>

      <div className="space-y-2">
        <Label>Meta description SEO (EN)</Label>
        <Textarea
          value={form.metaDescriptionEn}
          onChange={(e) => set({ metaDescriptionEn: e.target.value })}
          rows={2}
          placeholder="Par défaut : le résumé anglais ci-dessus."
        />
      </div>

      <div className="space-y-2">
        <Label>Texte alternatif de la couverture (EN)</Label>
        <Input
          value={form.coverAltEn}
          onChange={(e) => set({ coverAltEn: e.target.value })}
          placeholder="Alt text of the cover image (accessibility / SEO)"
        />
      </div>
    </section>
  );
}
