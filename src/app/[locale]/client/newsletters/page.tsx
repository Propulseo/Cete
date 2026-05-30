"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { getVisibleForClient } from "@/lib/repo/documents.repo";
import { PageHeader } from "@/components/shared/page-header";
import { DocumentsList } from "@/components/features/client/DocumentsList";
import type { ClientDocument } from "@/types/document";

export default function NewslettersPage() {
  const { user } = useAuth();
  const t = useTranslations("client");
  const [newsletters, setNewsletters] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const docs = await getVisibleForClient(user.clientId ?? user.id);
      setNewsletters(docs.filter((d) => d.category === "newsletters"));
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
        title={t("pages.newslettersTitle")}
        subtitle={t("pages.available", { count: newsletters.length, item: t("categories.newsletters") })}
      />

      <DocumentsList documents={newsletters} />
    </div>
  );
}
