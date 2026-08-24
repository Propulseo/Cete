import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { routing, type Locale } from "@/i18n/routing";
import { languageAlternates, localizedUrl, type SeoHref } from "@/lib/seo";
import type { Database } from "@/lib/supabase/database.types";

// getPathname (localePrefix "always") retourne des chemins déjà préfixés par la
// locale : localizedUrl ne re-concatène jamais /${locale} (l'ancien code
// produisait des URLs /fr/fr/... toutes en 404).

// ISR : sans revalidate, la route serait figée AU BUILD et les articles publiés
// via l'admin n'apparaîtraient jamais dans le sitemap avant un redéploiement.
export const revalidate = 3600;

const staticPages = [
  "/",
  "/a-propos",
  "/expertise",
  "/services",
  "/contact",
  "/blog",
  "/glossaire",
  "/observatoire",
  "/cgu",
  "/legal",
  "/privacy",
] as const;

// Article éditorial sur-mesure (FR + EN), rendu par blog/[slug]/page.tsx hors DB.
const BESPOKE_ARTICLE = {
  slug: "viz-act-tracabilite-intelligente-tst",
  publishedDate: "2026-05-08",
};

/**
 * Une entrée <url> par locale, chacune portant le set hreflang complet
 * (exigence de réciprocité). `locales` restreint le set pour les contenus non
 * traduits ; lastModified n'est émis que quand une vraie date existe (un
 * lastmod artificiel apprend à Google à ignorer le signal).
 */
function entriesFor(
  href: SeoHref,
  lastModified?: string,
  locales: readonly Locale[] = routing.locales,
): MetadataRoute.Sitemap {
  const languages = languageAlternates(href, locales);
  return locales.map((locale) => ({
    url: localizedUrl(locale, href),
    ...(lastModified ? { lastModified } : {}),
    alternates: { languages },
  }));
}

/** Articles publiés, lus avec la clé anon SANS cookies (sitemap hors requête). */
async function articleEntries(): Promise<MetadataRoute.Sitemap> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    console.warn("[sitemap] env Supabase absentes : articles omis du sitemap");
    return [];
  }
  try {
    const supabase = createClient<Database>(supabaseUrl, anonKey);
    const { data, error } = await supabase
      .from("articles")
      .select("slug,title_en,content_en,excerpt_en,published_date,updated_at")
      .eq("status", "published");
    if (error || !data) {
      console.warn("[sitemap] lecture articles échouée :", error?.message);
      return [];
    }
    return data.flatMap((a) => {
      if (!a.slug) return [];
      const hasEnglish = Boolean(a.title_en && (a.content_en || a.excerpt_en));
      return entriesFor(
        { pathname: "/blog/[slug]", params: { slug: a.slug } },
        a.updated_at ?? a.published_date ?? undefined,
        hasEnglish ? routing.locales : ["fr"],
      );
    });
  } catch (err) {
    console.warn("[sitemap] lecture articles échouée :", err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    entries.push(...entriesFor(page));
  }

  entries.push(
    ...entriesFor(
      { pathname: "/blog/[slug]", params: { slug: BESPOKE_ARTICLE.slug } },
      BESPOKE_ARTICLE.publishedDate,
    ),
  );

  entries.push(...(await articleEntries()));

  return entries;
}
