export interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  status: "published" | "draft";
  publishedDate: string | null;
  views: number;
  featured: boolean;
}

export interface ArticlesData {
  articles: Article[];
}
