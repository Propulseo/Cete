// Gabarit pur, sans I/O : prend des champs déjà validés par zod et rend un HTML simple.

interface ContactNotificationInput {
  kind: "contact" | "evaluation";
  name: string;
  email: string;
  company: string;
  phone?: string | null;
  subject?: string;
  message?: string;
  contactRole?: string;
  siren?: string | null;
  sector?: string;
  employees?: string;
  evaluationType?: string;
  sites?: string | null;
  details?: string | null;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `<tr><td style="padding:4px 12px 4px 0;color:#4A6580;white-space:nowrap"><strong>${escapeHtml(label)}</strong></td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`;
}

export function buildContactNotification(input: ContactNotificationInput): {
  subject: string;
  htmlContent: string;
} {
  const subject =
    input.kind === "evaluation"
      ? `[CETé] Nouvelle demande d'évaluation — ${input.company}`
      : `[CETé] Nouveau message — ${input.company}`;

  const commonRows =
    row("Société", input.company) +
    row("Contact", input.name) +
    row("Email", input.email) +
    row("Téléphone", input.phone ?? null);

  const specificRows =
    input.kind === "evaluation"
      ? row("Fonction", input.contactRole) +
        row("SIREN", input.siren ?? null) +
        row("Secteur", input.sector) +
        row("Effectif", input.employees) +
        row("Type d'évaluation", input.evaluationType) +
        row("Sites", input.sites ?? null) +
        row("Détails", input.details ?? null)
      : row("Sujet", input.subject) + row("Message", input.message);

  const htmlContent = `<table style="font-family:Arial,sans-serif;font-size:14px;color:#1A2940">${commonRows}${specificRows}</table>`;

  return { subject, htmlContent };
}
