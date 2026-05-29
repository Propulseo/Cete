import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import type { Database } from "./database.types";

/**
 * Rafraîchit la session Supabase en écrivant les cookies sur la réponse DÉJÀ
 * produite par le middleware next-intl. On NE crée PAS de nouvelle réponse pour
 * ne pas écraser la négociation de locale (i18n préservé).
 */
export async function updateSession(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    },
  );

  // IMPORTANT : rafraîchit le token. Ne rien exécuter entre createServerClient et getUser.
  await supabase.auth.getUser();

  return response;
}
