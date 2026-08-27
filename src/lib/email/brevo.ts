// Serveur uniquement : lit BREVO_API_KEY, qui ne doit jamais atteindre le navigateur.
// Importé exclusivement depuis des Server Actions (src/app/actions/).

interface SendArgs {
  to: string;
  subject: string;
  htmlContent: string;
  /** Adresse du prospect : permet de répondre directement depuis la boîte mail. */
  replyTo?: { email: string; name?: string };
}

export type SendResult = { ok: true } | { ok: false; error: string };

/**
 * Envoi transactionnel Brevo. Ne lève jamais d'exception : l'appelant décide quoi
 * faire de l'échec. La demande est déjà en base — l'email est un confort, pas la
 * source de vérité.
 */
export async function sendTransactionalEmail(args: SendArgs): Promise<SendResult> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!apiKey || !senderEmail) return { ok: false, error: "Brevo non configuré" };

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: process.env.BREVO_SENDER_NAME || "CETé" },
        to: [{ email: args.to }],
        subject: args.subject,
        htmlContent: args.htmlContent,
        ...(args.replyTo ? { replyTo: args.replyTo } : {}),
      }),
      // Un Brevo lent ne doit pas faire traîner la réponse au prospect.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `HTTP ${res.status} ${body.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "échec réseau" };
  }
}

interface UpsertContactArgs {
  email: string;
  listId: number;
}

/**
 * Inscription à une liste de contacts Brevo (newsletter). `updateEnabled: true`
 * évite une erreur si l'adresse est déjà inscrite — une resoumission doit rester
 * silencieuse pour l'utilisateur.
 */
export async function upsertNewsletterContact(args: UpsertContactArgs): Promise<SendResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return { ok: false, error: "Brevo non configuré" };

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email: args.email,
        listIds: [args.listId],
        updateEnabled: true,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `HTTP ${res.status} ${body.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "échec réseau" };
  }
}
