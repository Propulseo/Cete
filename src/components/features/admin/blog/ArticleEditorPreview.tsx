"use client";

import { Clock, Eye } from "lucide-react";
import { ArticleBody } from "@/components/sections/blog/ArticleBody";
import { CATEGORY_COLOR, type ArticleForm } from "./article-form";

interface Props {
  form: ArticleForm;
  coverPreview: string | null;
}

export function ArticleEditorPreview({ form, coverPreview }: Props) {
  const readTime = form.readMinutes ? `${form.readMinutes} min` : "≈ lecture";

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
        <Eye className="h-4 w-4 text-primary" strokeWidth={1.75} />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Aperçu live
        </span>
      </div>

      <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
        {/* Cover */}
        {coverPreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverPreview}
            alt={form.coverAlt || form.title}
            className="h-48 w-full object-cover"
          />
        )}

        <div className="px-6 py-6 md:px-8">
          {/* Meta */}
          <div className="mb-4 flex items-center gap-3">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${
                CATEGORY_COLOR[form.category] ?? "bg-[#4DA6D9]"
              }`}
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E8630A]">
              {form.category}
            </span>
            <span className="text-[#DAEEF8]">/</span>
            <span className="flex items-center gap-1 text-xs text-[#4A6580]">
              <Clock className="h-3.5 w-3.5" />
              {readTime}
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-4 font-display text-2xl leading-snug text-[#1A2940] md:text-3xl">
            {form.title || "Titre de l'article"}
          </h1>

          {/* Author */}
          {(form.author || form.authorRole) && (
            <div className="mb-6 flex items-center gap-3 border-b border-[#DAEEF8] pb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8630A] text-sm font-semibold text-white">
                {initials(form.author)}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A2940]">{form.author || "Auteur"}</p>
                {form.authorRole && <p className="text-xs text-[#4A6580]">{form.authorRole}</p>}
              </div>
            </div>
          )}

          {/* Chapô */}
          {form.excerpt && (
            <p className="mb-8 border-l-4 border-[#E8630A] pl-4 text-lg font-medium leading-relaxed text-[#1A2940]">
              {form.excerpt}
            </p>
          )}

          {/* Body */}
          {form.content.trim() ? (
            <ArticleBody content={form.content} />
          ) : (
            <p className="text-sm italic text-[#8AA5BE]">
              Le corps de l&apos;article (Markdown) s&apos;affichera ici au fur et à mesure de la
              rédaction.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}
