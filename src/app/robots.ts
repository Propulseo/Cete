import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/seo";

// localePrefix "always" : les URLs réelles sont /fr/client/..., /en/admin/...
// Un Disallow sans préfixe de locale ne matche jamais.
// Une seule arme par URL : connexion/login/reset-password/verifier portent un
// meta noindex qui doit rester LISIBLE par le crawler (donc pas de Disallow —
// un Disallow empêcherait Google de voir le noindex). Le Disallow est réservé
// aux espaces privés jamais utiles au crawl (client, admin, viewer).
const PRIVATE_PATHS = ["client/", "admin/", "viewer"];

// Crawlers des moteurs de réponse IA : autorisés explicitement sur le contenu
// public (stratégie GEO — être cité par ChatGPT/Claude/Perplexity/AI Overviews).
// ⚠️ En preview, Cloudflare REMPLACE ce robots.txt par une version managée qui
// bloque ces bots ; le réglage Cloudflare doit être désactivé sur le domaine de
// prod pour que cette politique s'applique (checklist go-live, décision D1).
const AI_CRAWLERS = [
  "GPTBot",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = routing.locales.flatMap((locale) =>
    PRIVATE_PATHS.map((path) => `/${locale}/${path}`),
  );
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
