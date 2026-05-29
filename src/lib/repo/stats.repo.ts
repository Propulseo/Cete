import { createClient } from "@/lib/supabase/client";
import type { AdminStats } from "@/types/stats";
import { RepoError } from "@/types/repo-error";

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("v_admin_dashboard_stats")
    .select("*")
    .single();

  if (error) {
    console.error("[stats.repo] getAdminStats failed:", error);
    throw new RepoError("Impossible de charger les statistiques", "stats", "get");
  }

  const activeClients = data?.active_clients ?? 0;
  const publishedDocuments = data?.published_documents ?? 0;
  const publishedArticles = data?.published_articles ?? 0;

  return {
    timestamp: new Date().toISOString().split("T")[0],
    stats: [
      {
        id: "stat-1",
        label: "Organisations notées",
        value: activeClients,
        trend: "",
        icon: "users",
      },
      {
        id: "stat-2",
        label: "Documents publiés",
        value: publishedDocuments,
        trend: "",
        icon: "check-circle",
      },
      {
        id: "stat-3",
        label: "Articles publiés",
        value: publishedArticles,
        trend: "",
        icon: "award",
      },
      // NOTE: l'ancien KPI "Rating moyen: BB+" (placeholder factice, hors système CETé)
      // a été retiré. La notation réelle du portefeuille est rendue par <VigiDistribution>
      // (répartition A/B/C/D des évaluations complétées) sur le dashboard.
    ],
  };
}
