"use client";

// Client certificate card — rebuilt on the shared design system: the Vigi-Score grammar
// (RatingSeal / CompositeRating) carries the colour, surfaces are hairline-first
// (SurfaceCard), status uses the tokenised StatusBadge. No more ad-hoc green/yellow/#4DA6D9.
import { useState, useEffect, useCallback } from "react";
import { Award, Download, QrCode, ShieldCheck, Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/shared/surface-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { RatingSeal, vigiGradeLabel } from "@/components/shared/rating-seal";
import { THREE_C_CRITERIA } from "@/lib/constants";
import { generateCertificatePDF } from "@/lib/generate-certificate-pdf";
import type { ThreeCScore } from "@/types/shared";
import { getCertificatesForClient, listCertificatesForClient } from "@/lib/repo/certificates.repo";
import { getSignedUrl } from "@/lib/supabase/storage";
import type { CertificateData } from "@/types/certificate";

interface CertificateCardProps {
  clientId?: string;
  companyName?: string;
  /** When provided, the card renders these directly and skips its own fetch. */
  certificates?: CertificateData[];
  /** Aperçu (ex. éditeur admin) : aucune récupération, action de téléchargement désactivée. */
  preview?: boolean;
}

export function CertificateCard({ clientId, companyName, certificates: provided, preview }: CertificateCardProps) {
  const t = useTranslations("client.certificate");
  const locale = useLocale();
  const [loaded, setLoaded] = useState<CertificateData[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);
  const certificates = provided ?? loaded;

  const load = useCallback(async () => {
    if (provided) return;
    const certs = clientId
      ? await getCertificatesForClient(clientId)
      : await listCertificatesForClient(companyName ?? "Electricité Pro SA");
    setLoaded(certs);
  }, [clientId, companyName, provided]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDownload = async (cert: CertificateData) => {
    setDownloading(cert.id);
    try {
      // Priorité au PDF officiel déposé par l'admin ; sinon génération jsPDF.
      if (cert.pdfStoragePath) {
        const signed = await getSignedUrl("certificates", cert.pdfStoragePath).catch(() => null);
        if (signed) {
          window.open(signed, "_blank", "noopener");
          return;
        }
      }
      const blob = await generateCertificatePDF(cert);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeName = cert.companyName.replace(/\s+/g, "_");
      a.download = `CETe_certificat_${safeName}_${cert.evaluationDate}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(null);
    }
  };

  const statusLabel = (status: CertificateData["status"]) =>
    status === "valide" ? t("valid") : status === "expire" ? t("expired") : t("revoked");

  const dateLocale = locale === "fr" ? "fr-FR" : "en-GB";
  if (certificates.length === 0) return null;

  return (
    <div className="space-y-4">
      {certificates.map((cert) => (
        <SurfaceCard key={cert.id} className="overflow-hidden">
          {/* Top accent rule — the one ink-blue frame */}
          <div className="h-[3px] w-full bg-primary" aria-hidden />
          <div className="flex flex-col gap-1 border-b border-[var(--admin-line)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="flex items-center gap-2 font-serif-display text-lg font-semibold tracking-tight text-foreground">
              <Award className="size-5 text-muted-foreground" strokeWidth={1.75} />
              {t("title", { brand: "CETé", number: cert.certificateNumber })}
            </h2>
            <StatusBadge status={cert.status}>{statusLabel(cert.status)}</StatusBadge>
          </div>

          <div className="grid gap-6 px-5 py-5 md:grid-cols-[1fr_auto]">
            {/* Left — rating + meta */}
            <div className="space-y-5">
              {/* Vigi-Score en vedette : la note globale est le héros, sa signification à côté. */}
              <div className="flex items-center gap-4">
                <RatingSeal
                  value={`${cert.vigiScore}${cert.vigiScoreTendance}`}
                  size="hero"
                  serif
                  showGlyph
                />
                <div className="min-w-0">
                  <p className="text-label font-medium uppercase tracking-[0.06em] text-muted-foreground">
                    {t("vigiScore")}
                  </p>
                  <p className="font-serif-display text-lg font-semibold leading-tight text-foreground">
                    {vigiGradeLabel(cert.vigiScore)}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t("rating")} :{" "}
                    <span className="font-medium tabular-nums text-foreground">{cert.compositeRating}</span>
                  </p>
                </div>
              </div>

              {/* Détail 3C en scorecard : un critère par ligne + sa pastille de note. */}
              <div>
                <p className="mb-2 text-label font-medium uppercase tracking-[0.06em] text-muted-foreground">
                  Détail — règle des 3C
                </p>
                <div className="divide-y divide-[var(--admin-line)] overflow-hidden rounded-[10px] border border-[var(--admin-line)]">
                  {/* Le libellé complet était porté par un `title` — donc inexistant au
                      doigt. Il est désormais affiché sous l'abréviation. */}
                  {THREE_C_CRITERIA.map((c) => (
                    <div key={c.id} className="flex items-center justify-between gap-3 px-3 py-2">
                      <span className="min-w-0">
                        <span className="block text-sm text-foreground">{c.short}</span>
                        {c.full && c.full !== c.short && (
                          <span className="block text-xs leading-snug text-muted-foreground">{c.full}</span>
                        )}
                      </span>
                      <RatingSeal value={cert.subCriteria[c.id as keyof ThreeCScore]} size="inline-sm" />
                    </div>
                  ))}
                </div>
              </div>

              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm min-[400px]:grid-cols-2">
                <Meta label={t("evaluation")}>
                  {new Date(cert.evaluationDate).toLocaleDateString(dateLocale)}
                </Meta>
                <Meta label={t("validity")}>
                  {new Date(cert.validityDate).toLocaleDateString(dateLocale)}
                </Meta>
                <Meta label={t("expert")}>{cert.expertName}</Meta>
                <Meta label="SIREN">{cert.siren}</Meta>
              </dl>
            </div>

            {/* Right — QR + download */}
            <div className="flex flex-col items-center justify-center gap-3 md:w-44">
              <div className="relative flex size-28 items-center justify-center rounded-[10px] border border-dashed border-[var(--admin-line)] bg-muted">
                <QrCode className="size-14 text-muted-foreground" strokeWidth={1.5} />
                <span className="absolute -bottom-2 -right-2 rounded-full bg-primary p-1">
                  <ShieldCheck className="size-4 text-primary-foreground" strokeWidth={2} />
                </span>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                {t("qrCode")}
                <span className="font-mono tabular-nums">{cert.id.slice(-12)}</span>
              </p>
              <Button
                onClick={() => handleDownload(cert)}
                disabled={preview || downloading === cert.id}
                className="w-full"
              >
                {downloading === cert.id ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Download className="mr-2 size-4" />
                )}
                {t("downloadCert")}
              </Button>
            </div>
          </div>
        </SurfaceCard>
      ))}
    </div>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-label font-medium uppercase tracking-[0.06em] text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium tabular-nums text-foreground">{children}</dd>
    </div>
  );
}
