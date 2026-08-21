import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

// Domaines autorisés à intégrer la vitrine dans une <iframe> : le portfolio de
// l'agence affiche un aperçu live et scrollable du site. `frame-ancestors` est
// le SEUL mécanisme qui sache autoriser un domaine tiers (X-Frame-Options ne le
// peut pas), et il doit être un vrai en-tête HTTP — en <meta> il est ignoré.
const FRAME_ANCESTORS_PUBLIC = [
  "'self'",
  "https://propulseo-site.com",
  "https://www.propulseo-site.com",
  "https://*.propulseo-site.com",
  // Portfolio en développement local (Vite dev/preview, Next.js).
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:3000",
].join(" ");

// Espaces authentifiés, saisie d'identifiants et visionneuse de documents :
// jamais cadrables, par personne (anti-clickjacking).
const PRIVATE_SEGMENTS = new Set([
  "admin",
  "client",
  "connexion",
  "login", // alias EN de /connexion
  "reset-password",
  "viewer",
]);

const LOCALES: readonly string[] = routing.locales;

function isPrivatePath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  // La locale est toujours présente (localePrefix "always"), sauf juste avant
  // la redirection de négociation — on gère donc les deux formes.
  const segment = LOCALES.includes(segments[0]) ? segments[1] : segments[0];
  return segment !== undefined && PRIVATE_SEGMENTS.has(segment);
}

export default async function middleware(request: NextRequest) {
  // 1. i18n d'abord : négociation/redirections de locale → produit la réponse.
  const response = intlMiddleware(request);
  // 2. Rafraîchit la session Supabase en posant les cookies sur CETTE réponse.
  const withSession = await updateSession(request, response);
  // 3. Politique de cadrage (une seule CSP, jamais de X-Frame-Options).
  const frameAncestors = isPrivatePath(request.nextUrl.pathname)
    ? "'none'"
    : FRAME_ANCESTORS_PUBLIC;
  withSession.headers.set("Content-Security-Policy", `frame-ancestors ${frameAncestors};`);
  return withSession;
}

export const config = {
  matcher: [
    // Tout sauf : _next, api, opengraph-image (route metadata SANS extension —
    // sinon le middleware i18n la redirige en 307 vers /fr/... et elle devient
    // inaccessible ; sitemap.xml et robots.txt ont un point, déjà exclus) et
    // fichiers statiques.
    "/((?!_next|api|favicon\\.ico|opengraph-image|.*\\..*).*)",
  ],
};
