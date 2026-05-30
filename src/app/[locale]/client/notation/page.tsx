"use client";

import { useState, useEffect, useCallback } from "react";
import { Award, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { getCertificatesForClient } from "@/lib/repo/certificates.repo";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { BrandName } from "@/components/ui/brand-name";
import { CertificateCard } from "@/components/features/client/CertificateCard";
import { NotationExplainer } from "@/components/features/client/NotationExplainer";
import type { CertificateData } from "@/types/certificate";

export default function NotationPage() {
  const { user } = useAuth();
  const t = useTranslations("client.notation");
  const tStates = useTranslations("client.states");
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const certs = await getCertificatesForClient(user.clientId ?? user.id);
      setCertificates(certs);
    } catch (err) {
      setError(err instanceof Error ? err.message : tStates("error"));
    } finally {
      setLoading(false);
    }
  }, [user, tStates]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={loadData} variant="outline">
          {tStates("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <PageHeader
        title={t("heading")}
        subtitle={
          <>
            {t("subtitle")} <BrandName />
          </>
        }
      />

      <div className="space-y-6">
        {certificates.length > 0 ? (
          <CertificateCard certificates={certificates} />
        ) : (
          <EmptyState icon={Award} title={t("empty")} description={t("emptyDescription")} />
        )}

        <NotationExplainer />
      </div>
    </div>
  );
}
