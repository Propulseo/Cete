"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, PencilLine } from "lucide-react";
import { ArticleLayout, type ArticleMeta } from "@/components/sections/blog/ArticleLayout";
import { ArticleBody } from "@/components/sections/blog/ArticleBody";
import { VideoEmbed } from "@/components/ui/video-embed";
import { getArticle } from "@/lib/repo/articles.repo";
import { CATEGORY_COLOR } from "./article-form";
import type { Article } from "@/types/article";

const CATEGORY_IMG_FALLBACK =
  "https://images.unsplash.com/photo-1758101755915-462eddc23f57?w=1200&h=800&fit=crop";

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

export function ArticlePreview({ articleId }: { articleId: string }) {
  const router = useRouter();
  const [article, setArticle] = useState<Article | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    getArticle(articleId)
      .then((a) => active && setArticle(a))
      .catch(() => active && setArticle(null));
    return () => {
      active = false;
    };
  }, [articleId]);

  if (article === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Article introuvable.</p>
        <button
          onClick={() => router.push("/admin/blog")}
          className="text-sm font-medium text-primary underline"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  const readTime = article.readMinutes
    ? `${article.readMinutes} min`
    : `${Math.max(2, Math.ceil((article.content || article.excerpt).split(/\s+/).length / 180))} min`;

  const meta: ArticleMeta = {
    title: article.title,
    metaDescription: article.metaDescription || article.excerpt,
    author: {
      name: article.author,
      initials: initials(article.author),
      role: article.authorRole || "Expert CETé",
    },
    category: article.category,
    categoryColor: CATEGORY_COLOR[article.category] ?? "bg-[#4DA6D9]",
    publishedDate: article.publishedDate || new Date().toISOString().split("T")[0],
    readTime,
    imageUrl: article.coverImage || CATEGORY_IMG_FALLBACK,
    imageAlt: article.coverAlt || article.title,
  };

  return (
    <div>
      {/* Bandeau aperçu */}
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-[#1A2940] px-4 py-2.5 text-white lg:px-8">
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-full bg-[#E8630A] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider">
            Aperçu
          </span>
          <span className="text-white/70">
            {article.status === "published" ? "Article publié" : "Brouillon non publié"} — rendu vitrine
          </span>
        </div>
        <button
          onClick={() => router.push(`/admin/blog/${article.id}`)}
          className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white/20"
        >
          <PencilLine className="h-4 w-4" strokeWidth={1.75} />
          Revenir à l&apos;éditeur
        </button>
      </div>

      <ArticleLayout meta={meta}>
        {article.videoUrl && (
          <div className="mb-8">
            <VideoEmbed url={article.videoUrl} title={article.title} />
          </div>
        )}
        <p className="mb-10 border-l-4 border-[#E8630A] pl-5 text-xl font-medium leading-relaxed text-[#1A2940]">
          {article.excerpt}
        </p>
        {article.content ? (
          <ArticleBody content={article.content} />
        ) : (
          <p className="text-lg leading-relaxed text-[#4A6580]">
            (Aucun contenu rédigé pour le moment.)
          </p>
        )}
      </ArticleLayout>

      {/* Filet retour bas */}
      <div className="border-t border-[#DAEEF8] bg-white py-6 text-center">
        <button
          onClick={() => router.push(`/admin/blog/${article.id}`)}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1A2940] hover:text-[#E8630A]"
        >
          <ArrowLeft className="h-4 w-4" />
          Revenir à l&apos;éditeur
        </button>
      </div>
    </div>
  );
}
