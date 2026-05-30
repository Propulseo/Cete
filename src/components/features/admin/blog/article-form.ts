import type { Article, ArticleCategory } from "@/types/article";
import { slugify } from "@/lib/repo/articles.repo";

export const CATEGORIES: ArticleCategory[] = [
  "Expertise",
  "Sécurité",
  "Réglementation",
  "Formation",
  "Innovation",
];

/** Couleur de pastille par catégorie (miroir de vitrine-data). */
export const CATEGORY_COLOR: Record<string, string> = {
  Expertise: "bg-[#4DA6D9]",
  Formation: "bg-[#1A7AB5]",
  Réglementation: "bg-[#1A2940]",
  Sécurité: "bg-[#0D5A8A]",
  Innovation: "bg-[#E8630A]",
};

/** État du formulaire d'édition (tout en chaînes pour les inputs contrôlés). */
export interface ArticleForm {
  title: string;
  slug: string;
  slugLocked: boolean;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  category: ArticleCategory;
  status: "draft" | "published";
  featured: boolean;
  coverImage: string;
  coverAlt: string;
  metaDescription: string;
  readMinutes: string;
  videoUrl: string;
}

export const EMPTY_FORM: ArticleForm = {
  title: "",
  slug: "",
  slugLocked: false,
  excerpt: "",
  content: "",
  author: "",
  authorRole: "",
  category: "Sécurité",
  status: "draft",
  featured: false,
  coverImage: "",
  coverAlt: "",
  metaDescription: "",
  readMinutes: "",
  videoUrl: "",
};

export function formFromArticle(a: Article): ArticleForm {
  return {
    title: a.title,
    slug: a.slug || slugify(a.title),
    slugLocked: true,
    excerpt: a.excerpt,
    content: a.content ?? "",
    author: a.author,
    authorRole: a.authorRole ?? "",
    category: a.category,
    status: a.status,
    featured: a.featured,
    coverImage: a.coverImage ?? "",
    coverAlt: a.coverAlt ?? "",
    metaDescription: a.metaDescription ?? "",
    readMinutes: a.readMinutes ? String(a.readMinutes) : "",
    videoUrl: a.videoUrl ?? "",
  };
}

/** Construit le payload repo depuis le formulaire (+ vues conservées). */
export function formToPayload(
  form: ArticleForm,
  opts: { status: "draft" | "published"; views: number; publishedDate: string | null },
): Omit<Article, "id"> {
  const minutes = parseInt(form.readMinutes, 10);
  return {
    title: form.title.trim(),
    slug: slugify(form.slug || form.title),
    excerpt: form.excerpt.trim(),
    content: form.content.trim() || undefined,
    author: form.author.trim(),
    authorRole: form.authorRole.trim() || undefined,
    category: form.category,
    status: opts.status,
    publishedDate:
      opts.status === "published"
        ? opts.publishedDate ?? new Date().toISOString().split("T")[0]
        : null,
    views: opts.views,
    featured: form.featured,
    videoUrl: form.videoUrl.trim() || undefined,
    coverImage: form.coverImage.trim() || undefined,
    coverAlt: form.coverAlt.trim() || undefined,
    metaDescription: form.metaDescription.trim() || undefined,
    readMinutes: Number.isFinite(minutes) && minutes > 0 ? minutes : undefined,
  };
}
