import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import type {
  Evaluation,
  EvaluationStatus,
  VigiScoreGrade,
} from "@/types/client";
import type { ThreeCScore } from "@/types/shared";
import { RepoError } from "@/types/repo-error";

type EvaluationRow = Database["public"]["Tables"]["evaluations"]["Row"];
type EvaluationInsert = Database["public"]["Tables"]["evaluations"]["Insert"];

/** Mappe une ligne DB (snake_case) vers le type métier Evaluation (camelCase). */
function rowToEvaluation(r: EvaluationRow): Evaluation {
  return {
    id: r.id,
    clientId: r.client_id,
    siteName: r.site_name,
    siteAddress: r.site_address,
    visitDate: r.visit_date,
    vigiScore: r.vigi_score ? (r.vigi_score as VigiScoreGrade) : undefined,
    omtScore: r.omt_score ? (r.omt_score as unknown as ThreeCScore) : undefined,
    compositeRating: r.composite_rating ?? undefined,
    certificateId: r.certificate_id ?? undefined,
    auditorId: r.auditor_id,
    status: r.status as EvaluationStatus,
    reportDocumentId: r.report_document_id ?? undefined,
    nextEvaluationDue: r.next_evaluation_due ?? undefined,
    notes: r.notes ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

/** Construit le payload d'insert/update DB (snake_case) depuis un Evaluation partiel. */
function evaluationToRow(
  payload: Partial<Omit<Evaluation, "id" | "createdAt" | "updatedAt">>
): Partial<EvaluationInsert> {
  const row: Partial<EvaluationInsert> = {};
  if (payload.clientId !== undefined) row.client_id = payload.clientId;
  if (payload.siteName !== undefined) row.site_name = payload.siteName;
  if (payload.siteAddress !== undefined) row.site_address = payload.siteAddress;
  if (payload.visitDate !== undefined) row.visit_date = payload.visitDate;
  if (payload.vigiScore !== undefined) row.vigi_score = payload.vigiScore ?? null;
  if (payload.omtScore !== undefined) {
    row.omt_score = (payload.omtScore ??
      null) as unknown as EvaluationInsert["omt_score"];
  }
  if (payload.compositeRating !== undefined)
    row.composite_rating = payload.compositeRating ?? null;
  if (payload.certificateId !== undefined)
    row.certificate_id = payload.certificateId ?? null;
  if (payload.auditorId !== undefined) row.auditor_id = payload.auditorId;
  if (payload.status !== undefined) row.status = payload.status;
  if (payload.reportDocumentId !== undefined)
    row.report_document_id = payload.reportDocumentId ?? null;
  if (payload.nextEvaluationDue !== undefined)
    row.next_evaluation_due = payload.nextEvaluationDue ?? null;
  if (payload.notes !== undefined) row.notes = payload.notes ?? null;
  return row;
}

export async function listEvaluations(): Promise<Evaluation[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("evaluations")
    .select("*")
    .order("visit_date", { ascending: false });
  if (error) {
    throw new RepoError(
      "Impossible de charger les evaluations",
      "evaluations",
      "list"
    );
  }
  return (data ?? []).map(rowToEvaluation);
}

export async function listEvaluationsByClientId(
  clientId: string
): Promise<Evaluation[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("evaluations")
    .select("*")
    .eq("client_id", clientId)
    .order("visit_date", { ascending: false });
  if (error) {
    throw new RepoError(
      "Impossible de charger les evaluations du client",
      "evaluations",
      "listByClientId"
    );
  }
  return (data ?? []).map(rowToEvaluation);
}

export async function getEvaluation(id: string): Promise<Evaluation | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("evaluations")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    throw new RepoError(
      "Impossible de charger l'evaluation",
      "evaluations",
      "get"
    );
  }
  return data ? rowToEvaluation(data) : null;
}

export async function createEvaluation(
  payload: Omit<Evaluation, "id" | "createdAt" | "updatedAt">
): Promise<Evaluation> {
  const supabase = createClient();
  const insert = evaluationToRow(payload) as EvaluationInsert;
  const { data, error } = await supabase
    .from("evaluations")
    .insert(insert)
    .select("*")
    .single();
  if (error || !data) {
    throw new RepoError(
      "Impossible de creer l'evaluation",
      "evaluations",
      "create"
    );
  }
  return rowToEvaluation(data);
}

export async function updateEvaluation(
  id: string,
  payload: Partial<Omit<Evaluation, "id" | "createdAt">>
): Promise<Evaluation | null> {
  const supabase = createClient();
  const update = evaluationToRow(payload);
  const { data, error } = await supabase
    .from("evaluations")
    .update(update)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) {
    throw new RepoError(
      "Impossible de modifier l'evaluation",
      "evaluations",
      "update"
    );
  }
  return data ? rowToEvaluation(data) : null;
}

export async function deleteEvaluation(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error, count } = await supabase
    .from("evaluations")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) {
    throw new RepoError(
      "Impossible de supprimer l'evaluation",
      "evaluations",
      "delete"
    );
  }
  return (count ?? 0) > 0;
}
