"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, FileText, ExternalLink, Video, Download, Library, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Resource, ResourceCategory, ResourceType } from "@/types/resource";
import { listResources } from "@/lib/repo/resources.repo";

const categoryLabels: Record<ResourceCategory, string> = {
  normes: "Normes",
  reglementation: "Réglementation",
  guides: "Guides techniques",
  rapports: "Rapports",
  veille: "Veille réglementaire",
};

const typeLabels: Record<ResourceType, string> = {
  pdf: "PDF",
  lien: "Lien",
  video: "Vidéo",
};

const typeConfig: Record<ResourceType, { icon: typeof FileText; color: string }> = {
  pdf: { icon: FileText, color: "bg-red-100 text-red-600" },
  lien: { icon: ExternalLink, color: "bg-blue-100 text-blue-600" },
  video: { icon: Video, color: "bg-purple-100 text-purple-600" },
};

function ResourceCard({ res }: { res: Resource }) {
  const cfg = typeConfig[res.type];
  const Icon = cfg.icon;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-white transition hover:shadow-md">
      {res.type === "video" && res.youtubeId && (
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${res.youtubeId}`}
            title={res.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cfg.color}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground line-clamp-2">{res.title}</p>
            {res.source && (
              <p className="text-xs text-muted-foreground">{res.source}</p>
            )}
          </div>
        </div>
        <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-3">
          {res.description}
        </p>
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{categoryLabels[res.category]}</Badge>
            {res.fileSize && (
              <span className="text-xs text-muted-foreground">{res.fileSize}</span>
            )}
          </div>
          {res.type === "pdf" && (
            <Button variant="outline" size="sm" asChild>
              <a href={res.url} target="_blank" rel="noopener noreferrer">
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Télécharger
              </a>
            </Button>
          )}
          {res.type === "lien" && (
            <Button variant="outline" size="sm" asChild>
              <a href={res.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Ouvrir
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ClientResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterType, setFilterType] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listResources();
      setResources(data);
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

  const filtered = resources.filter((r) => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q))
        return false;
    }
    if (filterCat && r.category !== filterCat) return false;
    if (filterType && r.type !== filterType) return false;
    return true;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Library className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Bibliothèque technique et réglementaire
        </h1>
        <p className="text-muted-foreground">
          {filtered.length} ressource{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
        >
          <option value="">Toutes catégories</option>
          {Object.entries(categoryLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Tous types</option>
          {Object.entries(typeLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Card Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((res) => (
            <ResourceCard key={res.id} res={res} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
          <Library className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Aucune ressource trouvée</p>
        </div>
      )}
    </div>
  );
}
