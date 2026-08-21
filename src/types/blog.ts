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
  /**
   * true si l'article dispose d'une vraie traduction anglaise (title_en +
   * contenu). Pilote le hreflang et le sitemap : un article FR sans traduction
   * ne doit pas déclarer d'alternate EN (duplicate cross-locale).
   */
  hasEnglish: boolean;
}
