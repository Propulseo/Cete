import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  BlogHero,
  BlogFeatured,
  BlogFilter,
  BlogCTA,
} from "@/components/sections/blog";
import { loadPublishedArticles } from "@/lib/vitrine-data";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(locale as Locale, "/blog"),
    openGraph: buildOpenGraph(locale as Locale, "/blog"),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await loadPublishedArticles(locale as Locale);
  const featured = posts.find((p) => p.featured) ?? posts[0] ?? null;
  const others = featured ? posts.filter((p) => p.slug !== featured.slug) : posts;

  return (
    <>
      <BlogHero count={posts.length} />
      {featured && <BlogFeatured post={featured} />}
      {others.length > 0 && <BlogFilter posts={others} />}
      <BlogCTA />
    </>
  );
}
