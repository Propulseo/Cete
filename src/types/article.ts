export type ArticleCategory =
  | "Expertise"
  | "Formation"
  | "Réglementation"
  | "Sécurité"
  | "Innovation";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  category: ArticleCategory;
  status: "published" | "draft";
  publishedDate: string | null;
  views: number;
  featured: boolean;
  videoUrl?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ArticlesData {
  articles: Article[];
}
