"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Star, Loader2, Video } from "lucide-react";
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
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog</h1>
          <p className="text-muted-foreground">Articles de veille réglementaire et retours terrain</p>
        </div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel article
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Titre</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Auteur</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Catégorie</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Statut</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Vues</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-secondary/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="font-medium text-foreground">{article.title}</p>
                      <p className="text-xs text-muted-foreground">{article.publishedDate || "Non publié"}</p>
                    </div>
                    {article.videoUrl && <Video className="h-4 w-4 text-[#4DA6D9]" />}
                    {article.featured && <Star className="h-4 w-4 fill-accent text-accent" />}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{article.author}</td>
                <td className="px-4 py-3"><Badge variant="secondary">{article.category}</Badge></td>
                <td className="px-4 py-3">
                  <Badge variant={article.status === "published" ? "default" : "outline"}>
                    {article.status === "published" ? "Publié" : "Brouillon"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{article.views}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(article); setDialogOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(article.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">Aucun article</div>
        )}
      </div>

      <ArticleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing}
      />
    </div>
  );
}
