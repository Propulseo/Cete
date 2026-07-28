"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Newspaper, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { toast } from "sonner";
import type { Article } from "@/types/article";
import { listArticles, deleteArticle } from "@/lib/repo/articles.repo";
import { CATEGORIES } from "@/components/features/admin/blog/article-form";
import { BlogArticlesList } from "@/components/features/admin/blog/BlogArticlesList";
import { AdminPageHeader } from "@/components/features/admin/ui/admin-page-header";
import { AdminEmptyState } from "@/components/features/admin/ui/admin-empty-state";

export default function AdminBlogPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("Toutes");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setArticles(await listArticles());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return articles.filter((a) => {
      const matchQ =
        !q || a.title.toLowerCase().includes(q) || a.author.toLowerCase().includes(q);
      const matchCat = category === "Toutes" || a.category === category;
      return matchQ && matchCat;
    });
  }, [articles, search, category]);

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
        <Button onClick={loadData} variant="outline">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <AdminPageHeader
        title="Blog"
        subtitle="Articles de veille réglementaire et retours terrain"
        actions={
          <Button onClick={() => router.push("/admin/blog/new")}>
            <Plus className="mr-2 h-4 w-4" strokeWidth={1.75} />
            Nouvel article
          </Button>
        }
      />

      {/* Filtres */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un titre ou un auteur…"
            className="pl-9"
          />
        </div>
        <NativeSelect
          wrapperClassName="sm:w-52"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filtrer par catégorie"
        >
          <option value="Toutes">Toutes les catégories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </NativeSelect>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState icon={Newspaper} title="Aucun article" />
      ) : (
        <BlogArticlesList articles={filtered} onDelete={handleDelete} />
      )}
    </div>
  );
}
