"use client";

import { useState, useEffect, useCallback } from "react";
import { ClipboardList, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { listDocumentsForClient } from "@/lib/repo/documents.repo";
import { DocumentsList } from "@/components/features/client/DocumentsList";
import type { ClientDocument } from "@/types/document";

export default function CarnetsPage() {
  const { user } = useAuth();
  const t = useTranslations("client");
  const [carnets, setCarnets] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const docs = await listDocumentsForClient(user.id);
      setCarnets(docs.filter((d) => d.category === "carnets"));
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
    <div className="p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
          <ClipboardList className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("pages.carnetsTitle")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("pages.available", { count: carnets.length, item: "carnet" + (carnets.length > 1 ? "s" : "") })}
          </p>
        </div>
      </div>

      <DocumentsList documents={carnets} />
    </div>
  );
}
