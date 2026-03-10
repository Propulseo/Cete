import type { AdminStats } from "@/types/stats";
import { RepoError } from "@/types/repo-error";
import { listUsers } from "./users.repo";
import { listDocuments } from "./documents.repo";
import { listArticles } from "./articles.repo";

// TODO Supabase: Remplacer par des requêtes count() sur chaque table :
// const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client').eq('is_active', true)
// const { count: docsCount } = await supabase.from('documents').select('*', { count: 'exact', head: true })
// const { count: articlesCount } = await supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published')
export async function getAdminStats(): Promise<AdminStats> {
  try {
    const [users, documents, articles] = await Promise.all([
      listUsers(),
      listDocuments(),
      listArticles(),
    ]);

    const activeClients = users.filter(
      (u) => u.role === "client" && u.is_active
    ).length;
    const publishedArticles = articles.filter(
      (a) => a.status === "published"
    ).length;

    return {
      timestamp: new Date().toISOString().split("T")[0],
      stats: [
        {
          id: "stat-1",
          label: "Organisations notées",
          value: activeClients,
          trend: "+12%",
          icon: "users",
        },
        {
          id: "stat-2",
          label: "Documents publiés",
          value: documents.length,
          trend: "+8%",
          icon: "check-circle",
        },
        {
          id: "stat-3",
          label: "Articles publiés",
          value: publishedArticles,
          trend: "+5%",
          icon: "award",
        },
        {
          id: "stat-4",
          label: "Rating moyen",
          value: "BB+",
          trend: "stable",
          icon: "star",
        },
      ],
    };
  } catch (error) {
    console.error("[stats.repo] getAdminStats failed:", error);
    throw new RepoError("Impossible de charger les statistiques", "stats", "get");
  }
}
