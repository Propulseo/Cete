"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { routing } from "@/i18n/routing";
import { upsertNewsletterContact } from "@/lib/email/brevo";
import type { TablesInsert } from "@/lib/supabase/database.types";

/**
 * Inscription à la newsletter du blog (Phase 8 du plan de fin de projet).
 *
 * Même principe qu'en Phase 1 : la base d'abord, Brevo ensuite. Un email
 * refusé ou en double n'est jamais une erreur pour l'utilisateur — seule une
 * saisie invalide ou une écriture impossible en base le sont.
 */

const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  consent: z.boolean().refine((v) => v),
  locale: z.string().optional(),
  // Pot de miel, même convention que contact.ts.
  website: z.string().max(200).optional(),
});

export type NewsletterSubmission = z.input<typeof newsletterSchema>;
export type NewsletterSubmitResult = { ok: true } | { ok: false; reason: "invalid" | "storage" };

function resolveLocale(raw: string | undefined): "fr" | "en" {
  return routing.locales.includes(raw as "fr" | "en")
    ? (raw as "fr" | "en")
    : routing.defaultLocale;
}

export async function subscribeNewsletterAction(
  input: NewsletterSubmission,
): Promise<NewsletterSubmitResult> {
  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success) return { ok: false, reason: "invalid" };
  const data = parsed.data;

  if (data.website) return { ok: true };

  const supabase = createAdminClient();

  const row: TablesInsert<"newsletter_subscribers"> = {
    email: data.email,
    locale: resolveLocale(data.locale),
  };

  // Une resoumission de la même adresse n'est jamais une erreur : `upsert`
  // sur l'email évite un conflit de contrainte unique pour un cas normal.
  const { data: inserted, error } = await supabase
    .from("newsletter_subscribers")
    .upsert(row, { onConflict: "email" })
    .select("id")
    .single();

  if (error || !inserted) {
    console.error("[newsletter] écriture impossible", { email: data.email, message: error?.message });
    return { ok: false, reason: "storage" };
  }

  const listId = Number(process.env.BREVO_NEWSLETTER_LIST_ID);
  const synced = Number.isFinite(listId)
    ? await upsertNewsletterContact({ email: data.email, listId })
    : { ok: false as const, error: "BREVO_NEWSLETTER_LIST_ID absent ou invalide" };

  await supabase
    .from("newsletter_subscribers")
    .update(synced.ok ? { brevo_synced: true } : { brevo_error: synced.error.slice(0, 2000) })
    .eq("id", inserted.id);

  return { ok: true };
}
