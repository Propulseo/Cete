import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

// Base URL publique du site. NEXT_PUBLIC_* est inliné AU BUILD : tout changement
// de domaine (preview ↔ prod) exige un rebuild complet, pas seulement une mise à
// jour de la variable d'environnement (cf. docs/seo-geo-audit-2026-07-29.md, B2).
// Slash final retiré : getPathname retourne un chemin déjà préfixé (/fr/...),
// une base terminée par "/" produirait des canonicals en "//fr" (même garde
// que buildResetRedirect dans src/app/actions/auth.ts).
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://cet-notation.com"
).replace(/\/+$/, "");

export type SeoHref = Parameters<typeof getPathname>[0]["href"];

/**
 * URL absolue d'une page dans une locale. getPathname (localePrefix "always")
 * retourne le chemin DÉJÀ préfixé par la locale (/fr/a-propos, /en/about) :
 * ne jamais re-concaténer `/${locale}` devant.
 */
export function localizedUrl(locale: Locale, href: SeoHref): string {
  return `${siteUrl}${getPathname({ locale, href })}`;
}

/**
 * Set hreflang complet d'une page : une URL par locale + x-default (version
 * locale par défaut). Partagé entre les metadata (buildAlternates) et le
 * sitemap pour que les deux sources émettent des signaux identiques.
 */
export function languageAlternates(
  href: SeoHref,
  locales: readonly Locale[] = routing.locales,
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = localizedUrl(l, href);
  }
  const fallback = locales.includes(routing.defaultLocale)
    ? routing.defaultLocale
    : locales[0];
  languages["x-default"] = localizedUrl(fallback, href);
  return languages;
}

/**
 * Alternates auto-référents d'une page : canonical vers sa propre URL localisée
 * + hreflang par locale + x-default. Le hreflang n'est valide que si la page
 * s'inclut elle-même et que le canonical appartient au set — c'est exactement
 * ce que garantit ce helper.
 *
 * `locales` permet de restreindre le set (ex. article sans traduction EN : ne
 * déclarer que le FR pour éviter un hreflang vers un contenu dupliqué).
 */
export function buildAlternates(
  locale: Locale,
  href: SeoHref,
  locales: readonly Locale[] = routing.locales,
): Metadata["alternates"] {
  return {
    canonical: localizedUrl(locale, href),
    languages: languageAlternates(href, locales),
  };
}

/** Image OG par défaut (générée par src/app/opengraph-image.tsx). */
export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "CETé - Agence de Notation du Risque Électrique",
} as const;

/**
 * openGraph COMPLET d'une page. Next.js remplace l'objet openGraph hérité en
 * entier dès qu'une page en définit un (merge shallow) : chaque page doit donc
 * émettre le set complet (siteName, type, locale, url, image), jamais un objet
 * partiel qui effacerait le reste.
 */
export function buildOpenGraph(
  locale: Locale,
  href: SeoHref,
): Metadata["openGraph"] {
  const isEn = locale === "en";
  return {
    type: "website",
    siteName: "CETé",
    locale: isEn ? "en_US" : "fr_FR",
    alternateLocale: isEn ? "fr_FR" : "en_US",
    url: localizedUrl(locale, href),
    images: [OG_IMAGE],
  };
}
