export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** Corps de l'article au format Markdown (articles rédigés en admin). */
  content?: string;
  author: string;
  authorRole?: string;
  category: string;
  categoryColor: string;
  publishedDate: string;
  readTime: string;
  imageUrl: string;
  imageAlt?: string;
  metaDescription?: string;
  featured: boolean;
  videoUrl?: string;
}
