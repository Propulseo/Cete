"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandName } from "@/components/ui/brand-name";
import { listDocuments } from "@/lib/repo/documents.repo";
import { listArticles } from "@/lib/repo/articles.repo";
import { getAdminStats } from "@/lib/repo/stats.repo";
import type { AdminStats } from "@/types/stats";
import type { ClientDocument } from "@/types/document";
import type { Article } from "@/types/article";
import { AdminStatsGrid } from "@/components/features/admin/AdminStatsGrid";
import { AdminRecentActivity } from "@/components/features/admin/AdminRecentActivity";
import { AdminQuickActions } from "@/components/features/admin/AdminQuickActions";

export default function AdminDashboardPage() {
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [stats, docs, arts] = await Promise.all([
        getAdminStats(),
        listDocuments(),
        listArticles(),
      ]);
      setAdminStats(stats);
      setDocuments(docs);
      setArticles(arts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

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
        <Button onClick={loadData} variant="outline">Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Pilotage de l&apos;agence de notation <BrandName />
        </p>
      </div>

      {adminStats && <AdminStatsGrid stats={adminStats} />}

      <AdminRecentActivity documents={documents} articles={articles} />

      <AdminQuickActions />
    </div>
  );
}
