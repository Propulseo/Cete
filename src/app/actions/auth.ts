"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { routing } from "@/i18n/routing";
import type { Database } from "@/lib/supabase/database.types";

/** Construit l'URL de retour côté serveur (jamais depuis le client → pas d'open-redirect). */
function buildResetRedirect(locale: string): string | undefined {
  const safeLocale = routing.locales.includes(locale as "fr" | "en")
    ? locale
    : routing.defaultLocale;
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  // Sans base de confiance configurée, on laisse Supabase retomber sur son Site URL.
  return base ? `${base}/${safeLocale}/reset-password` : undefined;
}

/**
 * Demande d'un lien de réinitialisation de mot de passe.
 *
 * Règle métier : seuls les comptes DÉJÀ INSCRITS et ACTIFS (clients ou admins
 * provisionnés par l'admin) peuvent recevoir un lien. Un email inconnu ou un
 * compte désactivé n'en reçoit aucun.
 *
 * La vérification se fait côté serveur via le client service-role (bypass RLS) :
 * le client public (anon) ne peut pas interroger `profiles` par email.
 *
 * Note enumeration : renvoyer `ok:false` pour un email inconnu/inactif révèle
 * qu'il n'est pas inscrit. Choix assumé (portail B2B fermé, comptes créés par
 * l'admin) et conforme à la demande « uniquement les inscrits ». Pour un message
 * générique anti-énumération, renvoyer toujours `{ ok: true }` côté UI.
 */
export async function requestPasswordResetAction(
  email: string,
  locale: string,
): Promise<{ ok: boolean }> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return { ok: false };

  // 1. Le compte doit exister ET être actif (service-role → bypass RLS).
  //    `.eq` exact sur l'email déjà normalisé en minuscules (invariant garanti
  //    à l'écriture + trigger DB) ; `.ilike` interpréterait %/_ comme des jokers.
  const admin = createAdminClient();
  const { data: profile, error } = await admin
    .from("profiles")
    .select("id, is_active")
    .eq("email", normalized)
    .maybeSingle();

  if (error || !profile || !profile.is_active) {
    return { ok: false };
  }

  // 2. Compte inscrit et actif → envoi du lien via un client anon éphémère
  //    (endpoint public ; pas de session à muter ici).
  const anon = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const { error: sendError } = await anon.auth.resetPasswordForEmail(normalized, {
    redirectTo: buildResetRedirect(locale),
  });
  if (sendError) return { ok: false };

  return { ok: true };
}
