import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import type { Database } from "./database.types";

/**
 * Rafraîchit la session Supabase en écrivant les cookies sur la réponse DÉJÀ
 * produite par le middleware next-intl. On NE crée PAS de nouvelle réponse pour
 * ne pas écraser la négociation de locale (i18n préservé).
 */
export async function updateSession(request: NextRequest, response: NextResponse) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Garde-fou « la vitrine ne tombe jamais en 500 » : sans configuration Supabase
  // (p. ex. variables d'env absentes sur la plateforme), on NE crée PAS le client et
  // on NE plante PAS le middleware — la session n'est simplement pas rafraîchie.
  // (login / admin / client nécessitent ces variables pour fonctionner.)
  if (!url || !anonKey) {
    return response;
  }

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANT : rafraîchit le token. Ne rien exécuter entre createServerClient et getUser.
  // try/catch : une erreur transitoire (réseau / Supabase) ne doit pas faire tomber le site.
  try {
    await supabase.auth.getUser();
  } catch {
    // Session non rafraîchie ce tour-ci ; la requête continue normalement.
  }

  return response;
}
