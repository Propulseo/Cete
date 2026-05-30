"use client";

import { useState, useEffect, useCallback } from "react";
import { Video, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { getVisibleForClient } from "@/lib/repo/documents.repo";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DocumentCard } from "@/components/features/client/DocumentCard";
import type { ClientDocument } from "@/types/document";

export default function CapsulesPage() {
  const { user } = useAuth();
  const t = useTranslations("client");
  const [capsules, setCapsules] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const docs = await getVisibleForClient(user.clientId ?? user.id);
      setCapsules(docs.filter((d) => d.category === "capsules"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("states.error"));
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
        title={t("pages.capsulesTitle")}
        subtitle={t("pages.available", { count: capsules.length, item: t("categories.capsules") })}
      />

      {capsules.length === 0 ? (
        <EmptyState icon={Video} title={t("pages.noCapsules")} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capsules.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
