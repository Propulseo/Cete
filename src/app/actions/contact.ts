"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { routing } from "@/i18n/routing";
import { sendTransactionalEmail } from "@/lib/email/brevo";
import { buildContactNotification } from "@/lib/email/contact-notification";
import type { TablesInsert } from "@/lib/supabase/database.types";

/**
 * Réception des deux formulaires publics (contact + demande d'évaluation).
 *
 * Une Server Action est un endpoint POST public : le schéma zod du navigateur
 * n'est qu'une aide à la saisie, jamais une garantie. Tout est donc revalidé ici.
 *
 * Règle intangible : une demande légitime ne doit JAMAIS être perdue. En cas de
 * doute (garde-fou anti-rafale indisponible, en-têtes absents), on laisse passer
 * et on écrit. Le seul échec possible est l'écriture elle-même, et il est alors
 * signalé à l'utilisateur — plus jamais un faux « message envoyé ».
 */

const trimmed = (max: number) => z.string().trim().max(max);

const baseFields = {
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().toLowerCase().email().max(320),
  company: z.string().trim().min(2).max(200),
  phone: trimmed(40).optional(),
  acceptCgu: z.boolean().refine((v) => v),
  // Normalisée côté serveur (cf. resolveLocale) : le client n'impose rien.
  locale: z.string().optional(),
  // Pot de miel. Invisible à l'écran et hors du parcours clavier : seul un
  // robot le remplit. Nommé « website » car c'est ce que les robots cherchent.
  website: z.string().max(200).optional(),
};

const contactSchema = z.object({
  ...baseFields,
  kind: z.literal("contact"),
  subject: trimmed(100),
  message: z.string().trim().min(10).max(5000),
});

const evaluationSchema = z.object({
  ...baseFields,
  kind: z.literal("evaluation"),
  contactRole: trimmed(200),
  siren: trimmed(20).optional(),
  sector: trimmed(50),
  employees: trimmed(20),
  evaluationType: trimmed(50),
  sites: trimmed(200).optional(),
  details: trimmed(5000).optional(),
});

const submissionSchema = z.discriminatedUnion("kind", [contactSchema, evaluationSchema]);

export type ContactSubmission = z.input<typeof submissionSchema>;

/** `invalid` : données refusées. `storage` : écriture impossible, demande perdue. */
export type ContactSubmitResult = { ok: true } | { ok: false; reason: "invalid" | "storage" };

/** Même garde que buildResetRedirect dans auth.ts : la locale ne vient pas du client. */
function resolveLocale(raw: string | undefined): "fr" | "en" {
  return routing.locales.includes(raw as "fr" | "en")
    ? (raw as "fr" | "en")
    : routing.defaultLocale;
}

/** Première adresse de la chaîne x-forwarded-for, sinon x-real-ip. */
function clientIp(h: Headers): string | null {
  const chain = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (chain || h.get("x-real-ip") || "").slice(0, 100) || null;
}

/**
 * Garde-fou anti-rafale. Renvoie `true` seulement si l'abus est CERTAIN : une
 * erreur de comptage laisse passer, parce qu'un lead perdu coûte plus cher
 * qu'un doublon de spam.
 */
async function isFlooding(
  supabase: ReturnType<typeof createAdminClient>,
  ip: string | null,
): Promise<boolean> {
  if (!ip) return false;
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from("contact_requests")
    .select("id", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("created_at", since);
  if (error || count === null) return false;
  return count >= 5;
}

export async function submitContactRequestAction(
  input: ContactSubmission,
): Promise<ContactSubmitResult> {
  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, reason: "invalid" };
  const data = parsed.data;

  // Pot de miel rempli : on répond « ok » sans rien écrire. Un robot ne doit
  // pas apprendre qu'il a été repéré, et un humain ne voit jamais ce champ.
  if (data.website) return { ok: true };

  const h = await headers();
  const ip = clientIp(h);
  const supabase = createAdminClient();

  if (await isFlooding(supabase, ip)) return { ok: true };

  const row: TablesInsert<"contact_requests"> = {
    kind: data.kind,
    name: data.name,
    email: data.email,
    company: data.company,
    phone: data.phone || null,
    locale: resolveLocale(data.locale),
    ip,
    user_agent: h.get("user-agent")?.slice(0, 500) ?? null,
    ...(data.kind === "contact"
      ? { subject: data.subject, message: data.message }
      : {
          payload: {
            contactRole: data.contactRole,
            siren: data.siren || null,
            sector: data.sector,
            employees: data.employees,
            evaluationType: data.evaluationType,
            sites: data.sites || null,
            details: data.details || null,
          },
        }),
  };

  const { data: inserted, error } = await supabase
    .from("contact_requests")
    .insert(row)
    .select("id")
    .single();

  if (error || !inserted) {
    // Seule trace de la demande perdue : le projet n'a pas encore de Sentry.
    console.error("[contact] écriture impossible", {
      kind: data.kind,
      email: data.email,
      message: error?.message,
    });
    return { ok: false, reason: "storage" };
  }

  // L'email est un confort ; la ligne en base est la preuve. Un échec se trace,
  // il ne se propage jamais jusqu'au prospect — la demande est déjà en sécurité.
  const notif = buildContactNotification(
    data.kind === "contact"
      ? { kind: "contact", name: data.name, email: data.email, company: data.company, phone: data.phone, subject: data.subject, message: data.message }
      : { kind: "evaluation", name: data.name, email: data.email, company: data.company, phone: data.phone, contactRole: data.contactRole, siren: data.siren, sector: data.sector, employees: data.employees, evaluationType: data.evaluationType, sites: data.sites, details: data.details },
  );
  const sent = await sendTransactionalEmail({
    to: process.env.CONTACT_NOTIFICATION_TO ?? "",
    subject: notif.subject,
    htmlContent: notif.htmlContent,
    replyTo: { email: data.email, name: data.name },
  });
  await supabase
    .from("contact_requests")
    .update(sent.ok ? { email_sent: true } : { email_error: sent.error.slice(0, 2000) })
    .eq("id", inserted.id);

  return { ok: true };
}
