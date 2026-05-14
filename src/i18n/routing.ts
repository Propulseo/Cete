import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  // "always" = locale toujours visible dans l'URL (/fr/..., /en/...)
  // Meilleur pour le SEO : chaque langue a son URL canonique distincte.
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/a-propos": {
      fr: "/a-propos",
      en: "/about",
    },
    "/expertise": "/expertise",
    "/services": "/services",
    "/contact": "/contact",
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/cgu": {
      fr: "/cgu",
      en: "/terms",
    },
    "/verifier/[id]": {
      fr: "/verifier/[id]",
      en: "/verify/[id]",
    },
    "/connexion": {
      fr: "/connexion",
      en: "/login",
    },
    "/client": "/client",
    "/client/dashboard": "/client/dashboard",
    "/client/profile": "/client/profile",
    "/client/newsletters": "/client/newsletters",
    "/client/capsules": "/client/capsules",
    "/client/guides": "/client/guides",
    "/client/carnets": "/client/carnets",
    "/client/ressources": "/client/ressources",
    "/admin": "/admin",
    "/admin/dashboard": "/admin/dashboard",
    "/admin/blog": "/admin/blog",
    "/admin/documents": "/admin/documents",
    "/admin/ressources": "/admin/ressources",
    "/admin/organizations": "/admin/organizations",
    "/admin/team": "/admin/team",
    "/admin/users": "/admin/users",
    "/admin/settings": "/admin/settings",
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
