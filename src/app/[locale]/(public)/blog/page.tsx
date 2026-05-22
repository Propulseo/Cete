import type { Metadata } from "next";
import type { BlogPost } from "@/types";
import {
  BlogHero,
  BlogFeatured,
  BlogGrid,
  BlogCTA,
} from "@/components/sections/blog";

export const metadata: Metadata = {
  title: "Blog - Décryptages & Analyses",
  description:
    "Réglementation, retours d'expérience et bonnes pratiques : nos experts décryptent l'actualité du risque électrique.",
};

const blogPosts: BlogPost[] = [
  {
    slug: "viz-act-tracabilite-intelligente-tst",
    title: "VIZ-ACT : la traçabilité intelligente des travaux sous tension",
    excerpt:
      "Finis les tableurs et les suivis manuels ! VIZ-ACT capture, géolocalise et enregistre automatiquement vos actes T. Une solution simple, connectée et sécurisée pour piloter vos TST en toute confiance.",
    author: "Bruno CLAUDEL",
    category: "Innovation",
    categoryColor: "bg-[#E8630A]",
    publishedDate: "2026-05-08",
    readTime: "7 min",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    featured: true,
  },
  {
    slug: "nouvelle-reglementation-nf-c-18-510-2026",
    title: "Nouvelle réglementation NF C 18-510 : ce qui change en 2026",
    excerpt:
      "L'évolution majeure de la norme NF C 18-510 redéfinit les exigences en matière d'habilitation électrique. Décryptage des nouvelles obligations pour les employeurs et les opérateurs, et impact direct sur votre notation CETé.",
    author: "Marc Dubois",
    category: "Réglementation",
    categoryColor: "bg-[#1A2940]",
    publishedDate: "2026-02-15",
    readTime: "8 min",
    imageUrl:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop",
    featured: false,
  },
  {
    slug: "ameliorer-notation-risque-electrique",
    title:
      "Comment améliorer votre notation de risque électrique de 2 crans",
    excerpt:
      "De BB à A+ en 12 mois : retour d'expérience sur les leviers concrets qui ont permis à un groupe industriel d'améliorer significativement sa notation CETé.",
    author: "Sophie Laurent",
    category: "Expertise",
    categoryColor: "bg-[#4DA6D9]",
    publishedDate: "2026-01-28",
    readTime: "6 min",
    imageUrl:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
    featured: false,
  },
  {
    slug: "erreurs-frequentes-habilitation-electrique",
    title:
      "Les 5 erreurs les plus fréquentes en habilitation électrique",
    excerpt:
      "Analyse des non-conformités les plus observées lors de nos audits terrain. Des erreurs évitables qui impactent directement votre notation.",
    author: "Philippe Martin",
    category: "Sécurité",
    categoryColor: "bg-[#1A7AB5]",
    publishedDate: "2026-01-10",
    readTime: "5 min",
    imageUrl:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600&fit=crop",
    featured: false,
  },
];

export default function BlogPage() {
  const featured = blogPosts.find((p) => p.featured)!;
  const others = blogPosts.filter((p) => !p.featured);

  return (
    <>
      <BlogHero />
      <BlogFeatured post={featured} />
      <BlogGrid posts={others} />
      <BlogCTA />
    </>
  );
}
