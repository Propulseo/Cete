import { createClient } from "@/lib/supabase/server";
import type { CertificateData } from "@/types/certificate";
import { CertificateNotFound } from "@/components/sections/verifier/CertificateNotFound";
import { CertificateCard } from "@/components/sections/verifier/CertificateCard";

// Server Component : lecture publique (anon) via la vue v_certificate_public
// (uniquement certificats valides + non expirés, colonnes minimales — pas de
// client_id ni pdf_storage_path). SEO-friendly (rendu serveur).
export default async function VerifierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("v_certificate_public")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data || !data.id) {
    return <CertificateNotFound id={id} />;
  }

  const cert: CertificateData = {
    id: data.id,
    certificateNumber: data.certificate_number ?? "",
    clientId: "", // non exposé publiquement
    companyName: data.company_name ?? "",
    siren: data.siren ?? "",
    address: data.address ?? "",
    compositeRating: data.composite_rating ?? "",
    vigiScore: (data.vigi_score ?? "A") as CertificateData["vigiScore"],
    vigiScoreTendance: (data.vigi_score_tendance ?? "") as CertificateData["vigiScoreTendance"],
    subCriteria: (data.sub_criteria ?? {}) as unknown as CertificateData["subCriteria"],
    evaluationDate: data.evaluation_date ?? "",
    validityDate: data.validity_date ?? "",
    expertName: data.expert_name ?? "",
    status: (data.status ?? "valide") as CertificateData["status"],
    createdAt: "",
  };

  return <CertificateCard cert={cert} />;
}
