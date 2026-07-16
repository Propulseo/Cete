export type ArticleCategory =
  | "Expertise"
  | "Formation"
  | "Réglementation"
  | "Sécurité"
  | "Innovation";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  /** Corps de l'article au format Markdown. */
  content?: string;
  /** Version anglaise (vitrine /en — fallback sur le français si absente). */
  titleEn?: string;
  excerptEn?: string;
  contentEn?: string;
  metaDescriptionEn?: string;
  coverAltEn?: string;
  author: string;
  authorRole?: string;
  category: ArticleCategory;
  status: "published" | "draft";
  publishedDate: string | null;
  views: number;
  featured: boolean;
  videoUrl?: string;
  /** URL publique de l'image de couverture (bucket blog-images ou URL externe). */
  coverImage?: string;
  coverAlt?: string;
  /** Meta description SEO (fallback : excerpt). */
  metaDescription?: string;
  /** Temps de lecture en minutes (fallback : estimé depuis le contenu). */
  readMinutes?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ArticlesData {
  articles: Article[];
}
