import { createClient } from "@/lib/supabase/client";
import { RepoError } from "@/types/repo-error";
import type { Tables } from "@/lib/supabase/database.types";
import type {
  ContactRequest,
  ContactRequestKind,
  ContactRequestStatus,
  EvaluationPayload,
} from "@/types/contact-request";

type Row = Tables<"contact_requests">;

/** Le jsonb est `Json` côté types générés : on le narrow, jamais de `any`. */
function toPayload(raw: Row["payload"]): EvaluationPayload | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  const str = (v: unknown): string => (typeof v === "string" ? v : "");
  const nullable = (v: unknown): string | null => (typeof v === "string" && v ? v : null);
  return {
    contactRole: str(o.contactRole),
    siren: nullable(o.siren),
    sector: str(o.sector),
    employees: str(o.employees),
    evaluationType: str(o.evaluationType),
    sites: nullable(o.sites),
    details: nullable(o.details),
  };
}

/** Mappe une ligne `contact_requests` (snake_case) vers le type métier camelCase. */
function rowToRequest(r: Row): ContactRequest {
  return {
    id: r.id,
    kind: r.kind as ContactRequestKind,
    name: r.name,
    email: r.email,
    company: r.company,
    phone: r.phone,
    subject: r.subject,
    message: r.message,
    payload: r.kind === "evaluation" ? toPayload(r.payload) : null,
    locale: r.locale,
    status: r.status as ContactRequestStatus,
    emailSent: r.email_sent,
    emailError: r.email_error,
    createdAt: r.created_at,
  };
}

export async function listContactRequests(): Promise<ContactRequest[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new RepoError("Impossible de charger les demandes", "contact_requests", "list");
  return (data ?? []).map(rowToRequest);
}

export async function updateContactRequestStatus(
  id: string,
  status: ContactRequestStatus
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("contact_requests").update({ status }).eq("id", id);
  if (error) throw new RepoError("Impossible de changer le statut", "contact_requests", "update");
}

/** Pastille du menu et tuile du dashboard. */
export async function countNewContactRequests(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("contact_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");
  if (error)
    throw new RepoError("Impossible de compter les demandes", "contact_requests", "count");
  return count ?? 0;
}
