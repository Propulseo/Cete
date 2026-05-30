"use client";

import { useState, useEffect, useCallback } from "react";
import { Mail, Building2, Shield, Phone, FileText, Library, Award, Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { getVisibleForClient as getDocsForClient } from "@/lib/repo/documents.repo";
import { getVisibleForClient as getResourcesForClient } from "@/lib/repo/resources.repo";
import { getCertificatesForClient } from "@/lib/repo/certificates.repo";
import { PageHeader } from "@/components/shared/page-header";
import { AccountSettingsCard } from "@/components/features/client/AccountSettingsCard";
import { KpiTile } from "@/components/shared/kpi-tile";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  SurfaceCard,
  SurfaceCardHeader,
  SurfaceCardTitle,
  SurfaceCardContent,
} from "@/components/shared/surface-card";
import type { CertificateData } from "@/types/certificate";
import type { LucideIcon } from "lucide-react";

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

interface AccessStats {
  docs: number;
  resources: number;
  certStatus: CertificateData["status"] | null;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const t = useTranslations("client.profile");
  const locale = useLocale();
  const [stats, setStats] = useState<AccessStats>({ docs: 0, resources: 0, certStatus: null });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(
    async (signal: { aborted: boolean }) => {
      if (!user) return;
      setLoading(true);
      const clientId = user.clientId ?? user.id;
      try {
        const [docs, resources, certs] = await Promise.all([
          getDocsForClient(clientId).catch(() => []),
          getResourcesForClient(clientId).catch(() => []),
          getCertificatesForClient(clientId).catch(() => []),
        ]);
        if (!signal.aborted)
          setStats({ docs: docs.length, resources: resources.length, certStatus: certs[0]?.status ?? null });
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    },
    [user],
  );

  useEffect(() => {
    const signal = { aborted: false };
    loadData(signal);
    return () => {
      signal.aborted = true;
    };
  }, [loadData]);

  if (!user) return null;

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
        month: "long",
        year: "numeric",
      })
    : null;

  const certLabel =
    stats.certStatus === "valide"
      ? t("certificateValid")
      : stats.certStatus === "expire"
        ? t("certificateExpired")
        : stats.certStatus === "revoque"
          ? t("certificateRevoked")
          : t("certificateNone");

  return (
    <div className="p-4 lg:p-8">
      <PageHeader title={t("heading")} subtitle={t("subtitle")} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Identity */}
        <SurfaceCard>
          <SurfaceCardHeader>
            <SurfaceCardTitle>{t("personalInfo")}</SurfaceCardTitle>
          </SurfaceCardHeader>
          <SurfaceCardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-foreground">
                {initialsOf(user.name)}
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{user.name}</p>
                <Badge variant="secondary">{t("clientBadge")}</Badge>
              </div>
            </div>

            <div className="space-y-3 border-t border-[var(--admin-line)] pt-4">
              <InfoRow icon={Mail}>{user.email}</InfoRow>
              {user.phone && <InfoRow icon={Phone}>{user.phone}</InfoRow>}
            </div>
          </SurfaceCardContent>
        </SurfaceCard>

        {/* Organization & account */}
        <SurfaceCard>
          <SurfaceCardHeader>
            <SurfaceCardTitle>{t("organization")}</SurfaceCardTitle>
          </SurfaceCardHeader>
          <SurfaceCardContent className="space-y-3">
            {user.company && <InfoRow icon={Building2}>{user.company}</InfoRow>}
            <InfoRow icon={Shield}>{t("clientId", { id: user.clientId ?? user.id })}</InfoRow>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">{t("status")}</span>
              <StatusBadge status={user.is_active ? "active" : "inactive"}>
                {user.is_active ? t("statusActive") : t("statusInactive")}
              </StatusBadge>
            </div>
            {memberSince && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">{t("memberSince")}</span>
                <span className="text-sm font-medium text-foreground">{memberSince}</span>
              </div>
            )}
          </SurfaceCardContent>
        </SurfaceCard>
      </div>

      {/* Access summary */}
      <SurfaceCard className="mt-6">
        <SurfaceCardHeader>
          <SurfaceCardTitle>{t("access")}</SurfaceCardTitle>
        </SurfaceCardHeader>
        <SurfaceCardContent className="space-y-4">
          {loading ? (
            <Loader2 className="size-6 animate-spin text-primary" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <KpiTile label={t("accessDocs")} value={stats.docs} icon={FileText} />
              <KpiTile label={t("accessResources")} value={stats.resources} icon={Library} />
              <KpiTile label={t("accessCertificate")} value={certLabel} icon={Award} />
            </div>
          )}
          <p className="text-sm text-muted-foreground">{t("accessHint")}</p>
        </SurfaceCardContent>
      </SurfaceCard>

      <AccountSettingsCard />
    </div>
  );
}

function InfoRow({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-sm text-foreground">
      <Icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      <span className="min-w-0 truncate">{children}</span>
    </div>
  );
}
