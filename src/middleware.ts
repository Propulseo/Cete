import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // 1. i18n d'abord : négociation/redirections de locale → produit la réponse.
  const response = intlMiddleware(request);
  // 2. Rafraîchit la session Supabase en posant les cookies sur CETTE réponse.
  return await updateSession(request, response);
}

export const config = {
  matcher: [
    // Tout sauf : _next, api, fichiers statiques.
    "/((?!_next|api|favicon\\.ico|.*\\..*).*)",
  ],
};
