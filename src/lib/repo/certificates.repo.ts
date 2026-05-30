import { createClient } from "@/lib/supabase/client";
import type { CertificateData, CertificateStatus } from "@/types/certificate";
import type { VigiScoreGrade } from "@/types/client";
import type { ThreeCScore } from "@/types/shared";
import { RepoError } from "@/types/repo-error";
import type { Database, Json } from "@/lib/supabase/database.types";

type CertificateRow = Database["public"]["Tables"]["certificates"]["Row"];
type CertificateInsert = Database["public"]["Tables"]["certificates"]["Insert"];

export type CreateCertificatePayload = Omit<CertificateData, "id" | "createdAt">;

const TABLE = "certificates";

/** Mappe une ligne DB (snake_case) vers le type métier `CertificateData` (camelCase). */
function rowToCertificate(r: CertificateRow): CertificateData {
  return {
    id: r.id,
    certificateNumber: r.certificate_number,
    clientId: r.client_id,
    companyName: r.company_name,
    siren: r.siren,
    address: r.address,
    compositeRating: r.composite_rating,
    vigiScore: r.vigi_score as VigiScoreGrade,
    vigiScoreTendance: r.vigi_score_tendance as CertificateData["vigiScoreTendance"],
    subCriteria: r.sub_criteria as unknown as ThreeCScore,
    evaluationDate: r.evaluation_date,
    validityDate: r.validity_date,
    expertName: r.expert_name,
    status: r.status as CertificateStatus,
    pdfStoragePath: r.pdf_storage_path ?? undefined,
    createdAt: r.created_at,
  };
}

export async function listCertificates(): Promise<CertificateData[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    throw new RepoError(
      "Impossible de charger les certificats",
      "certificates",
      "list"
    );
  }
  return (data ?? []).map(rowToCertificate);
}

// Lecture client legacy par raison sociale (conservée pour compatibilité).
export async function listCertificatesForClient(
  companyName: string
): Promise<CertificateData[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("company_name", companyName)
    .order("created_at", { ascending: false });
  if (error) {
    throw new RepoError(
      "Impossible de charger les certificats du client",
      "certificates",
      "listForClient"
    );
  }
  return (data ?? []).map(rowToCertificate);
}

// Lecture client unifiée par clientId. La RLS filtre déjà côté serveur,
// mais on conserve le filtre explicite pour l'usage admin (ciblage d'un client).
export async function getCertificatesForClient(
  clientId: string
): Promise<CertificateData[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) {
    throw new RepoError(
      "Impossible de charger les certificats du client",
      "certificates",
      "getForClient"
    );
  }
  return (data ?? []).map(rowToCertificate);
}

export async function getCertificateById(
  id: string
): Promise<CertificateData | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    throw new RepoError(
      "Impossible de charger le certificat",
      "certificates",
      "getById"
    );
  }
  return data ? rowToCertificate(data) : null;
}

/** Dépôt d'un certificat par l'admin (infos + PDF optionnel déjà uploadé). */
export async function createCertificate(
  payload: CreateCertificatePayload
): Promise<CertificateData> {
  const supabase = createClient();
  const insert: CertificateInsert = {
    certificate_number: payload.certificateNumber,
    client_id: payload.clientId,
    company_name: payload.companyName,
    siren: payload.siren,
    address: payload.address,
    composite_rating: payload.compositeRating,
    vigi_score: payload.vigiScore,
    vigi_score_tendance: payload.vigiScoreTendance,
    sub_criteria: payload.subCriteria as unknown as Json,
    evaluation_date: payload.evaluationDate,
    validity_date: payload.validityDate,
    expert_name: payload.expertName,
    status: payload.status,
    pdf_storage_path: payload.pdfStoragePath ?? null,
  };
  const { data, error } = await supabase
    .from(TABLE)
    .insert(insert)
    .select("*")
    .single();
  if (error || !data) {
    throw new RepoError("Impossible de déposer le certificat", "certificates", "create");
  }
  return rowToCertificate(data);
}

export async function updateCertificateStatus(
  id: string,
  status: CertificateStatus
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from(TABLE)
    .update({ status })
    .eq("id", id);
  if (error) {
    throw new RepoError(
      "Impossible de mettre à jour le statut du certificat",
      "certificates",
      "updateStatus"
    );
  }
}
