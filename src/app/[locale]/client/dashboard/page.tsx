"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { getVisibleForClient as getDocsForClient } from "@/lib/repo/documents.repo";
import { BrandName } from "@/components/ui/brand-name";
import { PageHeader } from "@/components/shared/page-header";
import { DashboardSummary } from "@/components/features/client/DashboardSummary";
import { NotationSummaryCard } from "@/components/features/client/NotationSummaryCard";
import { ClientEvaluationsCard } from "@/components/features/client/ClientEvaluationsCard";
import type { ClientDocument } from "@/types/document";

export default function ClientDashboardPage() {
  const { user } = useAuth();
  const t = useTranslations("client");
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const clientId = user.clientId ?? user.id;
      const docs = await getDocsForClient(clientId);
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("states.error"));
    } finally {
      setLoading(false);
    }
  }, [user, t]);

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
        <Button onClick={loadData} variant="outline">{t("states.retry")}</Button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <PageHeader
        title={t("dashboard.welcome", { name: user.name })}
        subtitle={
          <>
            {t("dashboard.description")} <BrandName />
          </>
        }
      />

      <div className="space-y-6">
        <NotationSummaryCard clientId={user.clientId ?? user.id} />
        <ClientEvaluationsCard clientId={user.clientId ?? user.id} />
        <DashboardSummary documents={documents} />
      </div>
    </div>
  );
}
