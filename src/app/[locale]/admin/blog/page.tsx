"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  Plus,
  Edit,
  Trash2,
  Star,
  Loader2,
  Video,
  Newspaper,
  ExternalLink,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { Article } from "@/types/article";
import { listArticles, deleteArticle } from "@/lib/repo/articles.repo";
import { CATEGORIES } from "@/components/features/admin/blog/article-form";
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
  const router = useRouter();
  const locale = useLocale();
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
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm sm:w-52"
        >
          <option value="Toutes">Toutes les catégories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState icon={Newspaper} title="Aucun article" />
      ) : (
        <AdminTable>
          <AdminThead>
            <AdminTr>
              <AdminTh>Article</AdminTh>
              <AdminTh>Auteur</AdminTh>
              <AdminTh>Catégorie</AdminTh>
              <AdminTh>Statut</AdminTh>
              <AdminTh>Vues</AdminTh>
              <AdminTh className="text-right">Actions</AdminTh>
            </AdminTr>
          </AdminThead>
          <AdminTbody>
            {filtered.map((article) => (
              <AdminTr
                key={article.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/blog/${article.id}`)}
              >
                <AdminTd>
                  <div className="flex items-center gap-3">
                    <Thumb article={article} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium text-foreground">{article.title}</p>
                        {article.videoUrl && (
                          <Video className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
                        )}
                        {article.featured && (
                          <Star className="h-4 w-4 shrink-0 fill-accent text-accent" strokeWidth={1.75} />
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {article.publishedDate || "Non publié"} · /{article.slug}
                      </p>
                    </div>
                  </div>
                </AdminTd>
                <AdminTd className="text-sm text-muted-foreground">{article.author}</AdminTd>
                <AdminTd>
                  <Badge variant="secondary">{article.category}</Badge>
                </AdminTd>
                <AdminTd>
                  <StatusBadge status={article.status}>
                    {article.status === "published" ? "Publié" : "Brouillon"}
                  </StatusBadge>
                </AdminTd>
                <AdminTd className="text-sm text-muted-foreground">{article.views}</AdminTd>
                <AdminTd className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    {article.status === "published" && (
                      <a
                        href={`/${locale}/blog/${article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Voir en ligne"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/admin/blog/${article.id}`)}
                    >
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
    </div>
  );
}

function Thumb({ article }: { article: Article }) {
  if (article.coverImage) {
    return (
      <Image
        src={article.coverImage}
        alt=""
        width={56}
        height={40}
        className="h-10 w-14 shrink-0 rounded-md object-cover ring-1 ring-border"
      />
    );
  }
  return (
    <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground ring-1 ring-border">
      <Newspaper className="h-4 w-4" strokeWidth={1.75} />
    </div>
  );
}
