import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout, type ArticleMeta } from "@/components/sections/blog/ArticleLayout";
import { VizActContent } from "@/components/sections/blog/VizActContent";
import { VideoEmbed } from "@/components/ui/video-embed";
import { loadArticleBySlug } from "@/lib/vitrine-data";

// Article éditorial sur-mesure (contenu riche). Les autres articles publiés sont
// servis depuis la DB (excerpt en corps) via loadArticleBySlug.
const articles: Record<string, ArticleMeta> = {
  "viz-act-tracabilite-intelligente-tst": {
    title: "VIZ-ACT : la traçabilité intelligente ",
    titleHighlight: "des travaux sous tension",
    metaDescription:
      "Finis les tableurs et les suivis manuels ! VIZ-ACT capture, géolocalise et enregistre automatiquement vos actes T. Une solution simple, connectée et sécurisée pour piloter vos TST en toute confiance.",
    author: {
      name: "Bruno CLAUDEL",
      initials: "BC",
      role: "Consultant, IPRP, Expert Prévention Santé Sécurité, Expert Risque électrique & TST, Président de M@P Expertise & Conseils",
    },
    category: "Innovation",
    categoryColor: "bg-[#E8630A]",
    publishedDate: "2026-05-08",
    readTime: "7 min",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    imageAlt: "Interface de traçabilité digitale - tableau de bord analytique",
    imageCaption: "Illustration : interface de suivi analytique (capture indicative)",
  },
};

const seoKeywords: Record<string, string[]> = {
  "viz-act-tracabilite-intelligente-tst": [
    "TST", "travaux sous tension", "traçabilité OTST", "NF C 18-510",
    "habilitation électrique", "VIZ-ACT", "CETé",
  ],
};

const contentMap: Record<string, React.ComponentType> = {
  "viz-act-tracabilite-intelligente-tst": VizActContent,
};

function initialsOf(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  if (article) {
    return {
      title: `${article.title}${article.titleHighlight ?? ""} - Blog CETé`,
      description: article.metaDescription,
      keywords: seoKeywords[slug],
    };
  }
  const post = await loadArticleBySlug(slug);
  if (!post) return { title: "Article introuvable" };
  return { title: `${post.title} - Blog CETé`, description: post.excerpt };
}

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1) Article éditorial sur-mesure
  const bespoke = articles[slug];
  const Content = contentMap[slug];
  if (bespoke && Content) {
    return (
      <ArticleLayout meta={bespoke}>
        <Content />
      </ArticleLayout>
    );
  }

  // 2) Article publié depuis la DB (corps = excerpt + vidéo éventuelle)
  const post = await loadArticleBySlug(slug);
  if (!post) notFound();

  const meta: ArticleMeta = {
    title: post.title,
    metaDescription: post.excerpt,
    author: { name: post.author, initials: initialsOf(post.author), role: "Expert CETé" },
    category: post.category,
    categoryColor: post.categoryColor,
    publishedDate: post.publishedDate,
    readTime: post.readTime,
    imageUrl: post.imageUrl,
    imageAlt: post.title,
  };

  return (
    <ArticleLayout meta={meta}>
      {post.videoUrl && (
        <div className="mb-8">
          <VideoEmbed url={post.videoUrl} title={post.title} />
        </div>
      )}
      <p className="text-lg leading-relaxed text-[#4A6580]">{post.excerpt}</p>
    </ArticleLayout>
  );
}
