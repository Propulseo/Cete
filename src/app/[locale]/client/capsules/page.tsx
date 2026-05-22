"use client";

import { useState, useEffect, useCallback } from "react";
import { Video, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { listDocumentsForClient } from "@/lib/repo/documents.repo";
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
      const docs = await listDocumentsForClient(user.id);
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
    <div className="p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
          <Video className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("pages.capsulesTitle")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("pages.available", { count: capsules.length, item: "capsule" + (capsules.length > 1 ? "s" : "") })}
          </p>
        </div>
      </div>

      {capsules.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-white p-12 text-center">
          <Video className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("pages.noCapsules")}</p>
        </div>
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
