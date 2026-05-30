"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandName } from "@/components/ui/brand-name";
import { listDocuments } from "@/lib/repo/documents.repo";
import { listArticles } from "@/lib/repo/articles.repo";
import { listEvaluations } from "@/lib/repo/evaluations.repo";
import { getAdminStats } from "@/lib/repo/stats.repo";
import type { AdminStats } from "@/types/stats";
import type { ClientDocument } from "@/types/document";
import type { Article } from "@/types/article";
import type { Evaluation } from "@/types/client";
import { AdminPageHeader } from "@/components/features/admin/ui/admin-page-header";
import { AdminStatsGrid } from "@/components/features/admin/AdminStatsGrid";
import { VigiDistribution } from "@/components/features/admin/VigiDistribution";
import { AdminRecentActivity } from "@/components/features/admin/AdminRecentActivity";
import { AdminQuickActions } from "@/components/features/admin/AdminQuickActions";

export default function AdminDashboardPage() {
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [stats, docs, arts, evals] = await Promise.all([
        getAdminStats(),
        listDocuments(),
        listArticles(),
        listEvaluations(),
      ]);
      setAdminStats(stats);
      setDocuments(docs);
      setArticles(arts);
      setEvaluations(evals);
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
        <Button onClick={loadData} variant="outline">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <AdminPageHeader
        title="Dashboard"
        subtitle={
          <>
            Pilotage de l&apos;agence de notation <BrandName />
          </>
        }
      />

      <div className="space-y-6">
        {adminStats && <AdminStatsGrid stats={adminStats} />}
        <VigiDistribution evaluations={evaluations} />
        <AdminRecentActivity documents={documents} articles={articles} />
        <AdminQuickActions />
      </div>
    </div>
  );
}
