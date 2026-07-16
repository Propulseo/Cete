"use client";

// NotationSummaryCard — compact "rating at a glance" surface for the client dashboard.
// The full certificate detail lives on /client/notation; here we only echo the headline
// (composite rating + Vigi-Score seal + status) and link through, so the deliverable is
// never duplicated in full. Reuses the shared Vigi-Score grammar (RatingSeal / CompositeRating).
import { useState, useEffect, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { Award, ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/shared/surface-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { RatingSeal, CompositeRating } from "@/components/shared/rating-seal";
import { getCertificatesForClient } from "@/lib/repo/certificates.repo";
import type { CertificateData } from "@/types/certificate";

interface NotationSummaryCardProps {
  clientId: string;
}

export function NotationSummaryCard({ clientId }: NotationSummaryCardProps) {
  const t = useTranslations("client");
  const [cert, setCert] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const certs = await getCertificatesForClient(clientId);
      setCert(certs[0] ?? null);
    } catch {
      setError(true);
      setCert(null);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  const statusLabel = (status: CertificateData["status"]) =>
    status === "valide"
      ? t("certificate.valid")
      : status === "expire"
        ? t("certificate.expired")
        : t("certificate.revoked");

  return (
    <SurfaceCard className="overflow-hidden">
      <div className="h-[3px] w-full bg-primary" aria-hidden />
      <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Award className="size-5" strokeWidth={1.75} />
          </div>

          {loading ? (
            <Loader2 className="size-5 animate-spin text-primary" />
          ) : error ? (
            <p className="text-sm text-muted-foreground">{t("states.error")}</p>
          ) : cert ? (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                  {t("certificate.rating")}
                </p>
                <CompositeRating value={cert.compositeRating} />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                  {t("certificate.vigiScore")}
                </p>
                <RatingSeal value={`${cert.vigiScore}${cert.vigiScoreTendance}`} size="lg" />
              </div>
              <StatusBadge status={cert.status}>{statusLabel(cert.status)}</StatusBadge>
            </div>
          ) : (
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{t("dashboard.ratingNone")}</p>
              <p className="truncate text-xs text-muted-foreground">{t("dashboard.ratingNoneHint")}</p>
            </div>
          )}
        </div>

        <Button asChild variant="outline" className="shrink-0">
          <Link href="/client/notation">
            {t("dashboard.ratingView")}
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      </div>
    </SurfaceCard>
  );
}
