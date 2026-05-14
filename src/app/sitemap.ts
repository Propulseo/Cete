import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cete-notation.fr";

const staticPages = [
  "/",
  "/a-propos",
  "/expertise",
  "/services",
  "/contact",
  "/blog",
  "/cgu",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    const languages: Record<string, string> = {};

    for (const locale of routing.locales) {
      const pathname = getPathname({ locale, href: page });
      languages[locale] = `${siteUrl}/${locale}${pathname === "/" ? "" : pathname}`;
    }

    entries.push({
      url: `${siteUrl}/fr${page === "/" ? "" : getPathname({ locale: "fr", href: page })}`,
      lastModified: new Date(),
      alternates: { languages },
    });
  }

  return entries;
}
