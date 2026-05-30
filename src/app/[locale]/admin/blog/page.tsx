"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Star, Loader2, Video, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Article } from "@/types/article";
import {
  listArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "@/lib/repo/articles.repo";
import { ArticleFormDialog } from "@/components/features/admin/ArticleFormDialog";
import { AdminPageHeader } from "@/components/features/admin/ui/admin-page-header";
import { StatusBadge } from "@/components/features/admin/ui/status-badge";
import { AdminEmptyState } from "@/components/features/admin/ui/admin-empty-state";
import {
  AdminTable,
  AdminThead,
  AdminTh,
  AdminTbody,
  AdminTr,
  AdminTd,
} from "@/components/features/admin/ui/admin-table";

export default function AdminBlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listArticles();
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (data: Omit<Article, "id">) => {
    try {
      const result = await createArticle(data);
      setArticles((prev) => [result, ...prev]);
      toast.success("Article créé");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la création");
    }
  };

  const handleUpdate = async (data: Omit<Article, "id">) => {
    if (!editing) return;
    try {
      const result = await updateArticle(editing.id, data);
      if (result) {
        setArticles((prev) => prev.map((a) => (a.id === editing.id ? result : a)));
      }
      toast.success("Article modifié");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la modification");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cet article ? Cette action est définitive.")) return;
    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      toast.success("Article supprimé");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  };

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
    <div className="p-4 lg:p-8">
      <AdminPageHeader
        title="Blog"
        subtitle="Articles de veille réglementaire et retours terrain"
        actions={
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" strokeWidth={1.75} />
            Nouvel article
          </Button>
        }
      />

      {articles.length === 0 ? (
        <AdminEmptyState icon={Newspaper} title="Aucun article" />
      ) : (
        <AdminTable>
          <AdminThead>
            <AdminTr>
              <AdminTh>Titre</AdminTh>
              <AdminTh>Auteur</AdminTh>
              <AdminTh>Catégorie</AdminTh>
              <AdminTh>Statut</AdminTh>
              <AdminTh>Vues</AdminTh>
              <AdminTh className="text-right">Actions</AdminTh>
            </AdminTr>
          </AdminThead>
          <AdminTbody>
            {articles.map((article) => (
              <AdminTr key={article.id}>
                <AdminTd>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="font-medium text-foreground">{article.title}</p>
                      <p className="text-xs text-muted-foreground">{article.publishedDate || "Non publié"}</p>
                    </div>
                    {article.videoUrl && <Video className="h-4 w-4 text-primary" strokeWidth={1.75} />}
                    {article.featured && <Star className="h-4 w-4 fill-accent text-accent" strokeWidth={1.75} />}
                  </div>
                </AdminTd>
                <AdminTd className="text-sm text-muted-foreground">{article.author}</AdminTd>
                <AdminTd><Badge variant="secondary">{article.category}</Badge></AdminTd>
                <AdminTd>
                  <StatusBadge status={article.status}>
                    {article.status === "published" ? "Publié" : "Brouillon"}
                  </StatusBadge>
                </AdminTd>
                <AdminTd className="text-sm text-muted-foreground">{article.views}</AdminTd>
                <AdminTd className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(article); setDialogOpen(true); }}>
                      <Edit className="h-4 w-4" strokeWidth={1.75} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(article.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" strokeWidth={1.75} />
                    </Button>
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
          </AdminTbody>
        </AdminTable>
      )}

      <ArticleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing}
      />
    </div>
  );
}
