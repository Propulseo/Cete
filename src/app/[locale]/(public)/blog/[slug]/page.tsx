import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticleLayout, type ArticleMeta } from "@/components/sections/blog/ArticleLayout";
import { VizActContent } from "@/components/sections/blog/VizActContent";
import { ArticleBody } from "@/components/sections/blog/ArticleBody";
import { VideoEmbed } from "@/components/ui/video-embed";
import { loadArticleBySlug } from "@/lib/vitrine-data";
import type { Locale } from "@/i18n/routing";

// Article éditorial sur-mesure (contenu riche, FR + EN). Les autres articles
// publiés sont servis depuis la DB (traduits par locale) via loadArticleBySlug.
const articles: Record<string, Record<Locale, ArticleMeta>> = {
  "viz-act-tracabilite-intelligente-tst": {
    fr: {
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
    en: {
      title: "VIZ-ACT: smart traceability ",
      titleHighlight: "for live working",
      metaDescription:
        "No more spreadsheets and manual tracking! VIZ-ACT automatically captures, geolocates and records your live working operations. A simple, connected and secure solution to manage your live works with confidence.",
      author: {
        name: "Bruno CLAUDEL",
        initials: "BC",
        role: "Consultant, IPRP, Occupational Health & Safety Expert, Electrical Risk & Live Working Expert, President of M@P Expertise & Conseils",
      },
      category: "Innovation",
      categoryColor: "bg-[#E8630A]",
      publishedDate: "2026-05-08",
      readTime: "7 min",
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      imageAlt: "Digital traceability interface - analytics dashboard",
      imageCaption: "Illustration: analytics tracking interface (indicative screenshot)",
    },
  },
};

const seoKeywords: Record<string, Record<Locale, string[]>> = {
  "viz-act-tracabilite-intelligente-tst": {
    fr: [
      "TST", "travaux sous tension", "traçabilité OTST", "NF C 18-510",
      "habilitation électrique", "VIZ-ACT", "CETé",
    ],
    en: [
      "live working", "TST", "work order traceability", "NF C 18-510",
      "electrical authorisation", "VIZ-ACT", "CETé",
    ],
  },
};

const contentMap: Record<string, React.ComponentType<{ locale?: Locale }>> = {
  "viz-act-tracabilite-intelligente-tst": VizActContent,
};

function initialsOf(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function asLocale(value: string): Locale {
  return value === "en" ? "en" : "fr";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = asLocale(rawLocale);
  const article = articles[slug]?.[locale];
  if (article) {
    return {
      title: `${article.title}${article.titleHighlight ?? ""} - Blog CETé`,
      description: article.metaDescription,
      keywords: seoKeywords[slug]?.[locale],
    };
  }
  const post = await loadArticleBySlug(slug, locale);
  if (!post) {
    const t = await getTranslations({ locale, namespace: "blog.article" });
    return { title: t("notFound") };
  }
  return {
    title: `${post.title} - Blog CETé`,
    description: post.metaDescription || post.excerpt,
  };
}

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = asLocale(rawLocale);
  setRequestLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: "blog.article" });

  // 1) Article éditorial sur-mesure
  const bespoke = articles[slug]?.[locale];
  const Content = contentMap[slug];
  if (bespoke && Content) {
    return (
      <ArticleLayout meta={bespoke}>
        <Content locale={locale} />
      </ArticleLayout>
    );
  }

  // 2) Article publié depuis la DB (corps = excerpt + vidéo éventuelle)
  const post = await loadArticleBySlug(slug, locale);
  if (!post) notFound();

  const meta: ArticleMeta = {
    title: post.title,
    metaDescription: post.metaDescription || post.excerpt,
    author: {
      name: post.author,
      initials: initialsOf(post.author),
      role: post.authorRole || t("defaultRole"),
    },
    category: post.category,
    categoryColor: post.categoryColor,
    publishedDate: post.publishedDate,
    readTime: post.readTime,
    imageUrl: post.imageUrl,
    imageAlt: post.imageAlt ?? post.title,
  };

  return (
    <ArticleLayout meta={meta}>
      {post.videoUrl && (
        <div className="mb-8">
          <VideoEmbed url={post.videoUrl} title={post.title} />
        </div>
      )}
      {/* Chapô = résumé en accroche */}
      <p className="mb-10 border-l-4 border-[#E8630A] pl-5 text-xl font-medium leading-relaxed text-[#1A2940]">
        {post.excerpt}
      </p>
      {post.content ? (
        <ArticleBody content={post.content} />
      ) : (
        <p className="text-lg leading-relaxed text-[#4A6580]">{t("comingSoon")}</p>
      )}
    </ArticleLayout>
  );
}
