import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticleLayout, type ArticleMeta } from "@/components/sections/blog/ArticleLayout";
import { VizActContent } from "@/components/sections/blog/VizActContent";
import { ArticleBody } from "@/components/sections/blog/ArticleBody";
import { VideoEmbed } from "@/components/ui/video-embed";
import { loadArticleBySlug } from "@/lib/vitrine-data";
import { buildAlternates, localizedUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/schema";
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
  // Le template du layout ajoute déjà " | CETé" : jamais de marque dans le titre.
  const href = { pathname: "/blog/[slug]", params: { slug } } as const;
  const article = articles[slug]?.[locale];
  if (article) {
    return {
      title: `${article.title}${article.titleHighlight ?? ""}`.trim(),
      description: article.metaDescription,
      alternates: buildAlternates(locale, href),
      openGraph: {
        type: "article",
        siteName: "CETé",
        locale: locale === "en" ? "en_US" : "fr_FR",
        url: localizedUrl(locale, href),
        images: [article.imageUrl],
        publishedTime: article.publishedDate,
        authors: [article.author.name],
      },
    };
  }
  const post = await loadArticleBySlug(slug, locale);
  if (!post) {
    const t = await getTranslations({ locale, namespace: "blog.article" });
    return { title: t("notFound"), robots: { index: false, follow: false } };
  }
  // Article sans traduction EN : /en/blog/<slug> sert le texte FR à l'identique.
  // Ce vrai duplicata (même langue, même contenu) est consolidé par un canonical
  // vers l'URL FR — sans hreflang (le canonical prime, le set serait ignoré).
  const alternates =
    !post.hasEnglish && locale === "en"
      ? { canonical: localizedUrl("fr", href) }
      : buildAlternates(locale, href, post.hasEnglish ? undefined : ["fr"]);
  return {
    title: post.title,
    description: post.metaDescription || post.excerpt,
    alternates,
    openGraph: {
      type: "article",
      siteName: "CETé",
      locale: locale === "en" ? "en_US" : "fr_FR",
      url: localizedUrl(locale, href),
      images: [post.imageUrl],
      publishedTime: post.publishedDate,
      authors: [post.author],
    },
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

  const articleUrl = localizedUrl(locale, {
    pathname: "/blog/[slug]",
    params: { slug },
  });
  const breadcrumb = (title: string) =>
    breadcrumbJsonLd([
      { name: locale === "en" ? "Home" : "Accueil", url: localizedUrl(locale, "/") },
      { name: "Blog", url: localizedUrl(locale, "/blog") },
      { name: title },
    ]);

  // 1) Article éditorial sur-mesure
  const bespoke = articles[slug]?.[locale];
  const Content = contentMap[slug];
  if (bespoke && Content) {
    const bespokeTitle = `${bespoke.title}${bespoke.titleHighlight ?? ""}`.trim();
    return (
      <>
        <JsonLd
          data={articleJsonLd({
            locale,
            url: articleUrl,
            title: bespokeTitle,
            description: bespoke.metaDescription,
            image: bespoke.imageUrl,
            datePublished: bespoke.publishedDate,
            authorName: bespoke.author.name,
            authorRole: bespoke.author.role,
          })}
        />
        <JsonLd data={breadcrumb(bespokeTitle)} />
        <ArticleLayout meta={bespoke}>
          <Content locale={locale} />
        </ArticleLayout>
      </>
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
    <>
      <JsonLd
        data={articleJsonLd({
          locale,
          url: articleUrl,
          title: post.title,
          description: post.metaDescription || post.excerpt,
          image: post.imageUrl,
          datePublished: post.publishedDate,
          authorName: post.author,
          authorRole: post.authorRole,
        })}
      />
      <JsonLd data={breadcrumb(post.title)} />
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
    </>
  );
}
