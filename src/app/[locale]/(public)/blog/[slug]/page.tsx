import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout, type ArticleMeta } from "@/components/sections/blog/ArticleLayout";
import { VizActContent } from "@/components/sections/blog/VizActContent";

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
    "TST",
    "travaux sous tension",
    "traçabilité OTST",
    "NF C 18-510",
    "habilitation électrique",
    "VIZ-ACT",
    "CETé",
  ],
};

const contentMap: Record<string, React.ComponentType> = {
  "viz-act-tracabilite-intelligente-tst": VizActContent,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) return { title: "Article introuvable" };

  return {
    title: `${article.title}${article.titleHighlight ?? ""} - Blog CETé`,
    description: article.metaDescription,
    keywords: seoKeywords[slug],
  };
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
  const article = articles[slug];
  const Content = contentMap[slug];

  if (!article || !Content) notFound();

  return (
    <ArticleLayout meta={article}>
      <Content />
    </ArticleLayout>
  );
}
