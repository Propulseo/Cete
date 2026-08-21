import type { Locale } from "@/i18n/routing";
import type { Founder } from "@/types/founder";
import type { Service } from "@/types/service";
import { localizedUrl, siteUrl } from "@/lib/seo";

// Builders de données structurées schema.org (rendues via <JsonLd />).
// Volontairement SANS address/telephone/sameAs tant que la fiche légale (SIRET,
// adresse assumée) et la page LinkedIn ne sont pas fournies — un schéma
// incohérent avec le contenu visible ferait plus de mal que d'absence.

export const ORGANIZATION_ID = `${siteUrl}/#organization`;

export function organizationJsonLd(locale: Locale): Record<string, unknown> {
  const isEn = locale === "en";
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "CETé - Consortium Experts Techniques Électricité",
    alternateName: "CETé",
    legalName: "Consortium Experts Techniques Électricité",
    url: localizedUrl(locale, "/"),
    logo: `${siteUrl}/assets/brand/logo-cete.png`,
    email: "contact@cete-notation.fr",
    description: isEn
      ? "Independent Electrical Risk Rating Agency. Expertise, consulting and training in electrical safety and Live Working (TST)."
      : "Agence de Notation indépendante du risque électrique. Expertise, conseil et formation en sécurité électrique et Travaux Sous Tension (TST).",
    slogan: isEn ? "The strength of a collective" : "La force d'un collectif",
    foundingLocation: { "@type": "Country", name: "France" },
    areaServed: "FR",
    knowsAbout: isEn
      ? [
          "live working",
          "LV live working (TST BT)",
          "HV live working (TST HTA)",
          "electrical risk",
          "electrical safety prevention",
          "NF C 18-510",
          "electrical risk audit",
          "electrical risk rating",
        ]
      : [
          "travaux sous tension",
          "TST BT",
          "TST HTA",
          "risques électriques",
          "prévention et sécurité électrique",
          "NF C 18-510",
          "audit du risque électrique",
          "notation du risque électrique",
        ],
  };
}

export function foundersJsonLd(
  founders: Founder[],
  locale: Locale,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": founders.map((f) => ({
      "@type": "Person",
      name: f.name,
      jobTitle: f.role,
      ...(f.bio ? { description: f.bio } : {}),
      ...(f.imageUrl ? { image: `${siteUrl}${f.imageUrl}` } : {}),
      ...(f.specialties?.length ? { knowsAbout: f.specialties } : {}),
      worksFor: { "@id": ORGANIZATION_ID },
      alumniOf: {
        "@type": "EducationalOrganization",
        name:
          locale === "en"
            ? "EDF Distribution trade schools"
            : "Écoles de métiers EDF Distribution",
      },
    })),
  };
}

export function servicesJsonLd(
  services: Service[],
  locale: Locale,
): Record<string, unknown> {
  const isEn = locale === "en";
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: s.description,
        serviceType:
          s.category === "Expertise"
            ? isEn
              ? "Electrical risk audit and expertise"
              : "Audit et expertise du risque électrique"
            : isEn
              ? "Electrical safety consulting and training"
              : "Conseil et formation en sécurité électrique",
        provider: { "@id": ORGANIZATION_ID },
        areaServed: "FR",
        availableChannel: {
          "@type": "ServiceChannel",
          availableLanguage: ["fr", "en"],
        },
      },
    })),
  };
}

export function articleJsonLd(input: {
  locale: Locale;
  url: string;
  title: string;
  description: string;
  image: string;
  datePublished: string;
  authorName: string;
  authorRole?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    image: input.image,
    datePublished: input.datePublished,
    inLanguage: input.locale,
    mainEntityOfPage: input.url,
    author: {
      "@type": "Person",
      name: input.authorName,
      ...(input.authorRole ? { jobTitle: input.authorRole } : {}),
    },
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function faqJsonLd(
  items: Array<{ question: string; answer: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; url?: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}
