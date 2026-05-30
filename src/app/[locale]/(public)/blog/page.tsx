import type { Metadata } from "next";
import {
  BlogHero,
  BlogFeatured,
  BlogGrid,
  BlogCTA,
} from "@/components/sections/blog";
import { loadPublishedArticles } from "@/lib/vitrine-data";

export const metadata: Metadata = {
  title: "Blog - Décryptages & Analyses",
  description:
    "Réglementation, retours d'expérience et bonnes pratiques : nos experts décryptent l'actualité du risque électrique.",
};

export default async function BlogPage() {
  const posts = await loadPublishedArticles();
  const featured = posts.find((p) => p.featured) ?? posts[0] ?? null;
  const others = featured ? posts.filter((p) => p.slug !== featured.slug) : posts;

  return (
    <>
      <BlogHero />
      {featured && <BlogFeatured post={featured} />}
      {others.length > 0 && <BlogGrid posts={others} />}
      <BlogCTA />
    </>
  );
}
