"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";

/** Vérifie que l'appelant est un admin authentifié (la service-role bypasse la RLS). */
async function assertAdmin(): Promise<void> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié — reconnectez-vous.");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin")
    throw new Error("Action réservée aux administrateurs (session non-admin).");
}

/** Nettoie un nom de fichier pour un chemin Storage sûr (server-side). */
function safeFileName(name: string): string {
  const dot = name.lastIndexOf(".");
  const base =
    (dot > 0 ? name.slice(0, dot) : name)
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase()
      .slice(0, 60) || "fichier";
  const ext = (dot > 0 ? name.slice(dot + 1) : "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  return ext ? `${base}.${ext}` : base;
}

export interface CreateCertificateInput {
  clientId: string;
  certificateNumber: string;
  companyName: string;
  siren: string;
  address: string;
  compositeRating: string;
  vigiScore: string;
  vigiScoreTendance: "+" | "-" | "";
  subCriteria: { autoEvaluation: string; recommandation: string; gestesMetiers: string };
  evaluationDate: string;
  validityDate: string;
  expertName: string;
  status: string;
  /** Si fourni, on rattache le certificat à cette évaluation (evaluations.certificate_id). */
  evaluationId?: string;
}

/**
 * Dépôt d'un certificat par l'admin via la service-role (assertAdmin d'abord).
 * Robuste à l'état de session du navigateur : l'écriture privilégiée (upload Storage +
 * insert certificat + lien évaluation) ne dépend plus du token client/RLS — d'où une
 * erreur claire « réservé aux administrateurs » plutôt qu'un 400 Storage opaque.
 * Le PDF (optionnel) est transmis via FormData ; les métadonnées via `input`.
 */
export async function createCertificateAction(
  input: CreateCertificateInput,
  formData: FormData | null,
): Promise<{ id: string }> {
  await assertAdmin();
  const admin = createAdminClient();

  let pdfStoragePath: string | null = null;
  const file = formData?.get("file");
  if (file instanceof File && file.size > 0) {
    const path = `${input.clientId}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
    const { data, error } = await admin.storage
      .from("certificates")
      .upload(path, file, { upsert: true, contentType: file.type || "application/pdf" });
    if (error || !data) throw new Error("Échec du téléversement du certificat");
    pdfStoragePath = data.path;
  }

  const { data, error } = await admin
    .from("certificates")
    .insert({
      client_id: input.clientId,
      certificate_number: input.certificateNumber,
      company_name: input.companyName,
      siren: input.siren,
      address: input.address,
      composite_rating: input.compositeRating,
      vigi_score: input.vigiScore,
      vigi_score_tendance: input.vigiScoreTendance,
      sub_criteria: input.subCriteria as unknown as Json,
      evaluation_date: input.evaluationDate,
      validity_date: input.validityDate,
      expert_name: input.expertName,
      status: input.status,
      pdf_storage_path: pdfStoragePath,
    })
    .select("id")
    .single();
  if (error || !data) throw new Error("Impossible de déposer le certificat");

  if (input.evaluationId) {
    await admin.from("evaluations").update({ certificate_id: data.id }).eq("id", input.evaluationId);
  }

  return { id: data.id };
}
