"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, FileText, Video, ExternalLink, Search, Library, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Resource, ResourceCategory, ResourceType } from "@/types/resource";
import {
  listResources,
  createResource,
  updateResource,
  deleteResource,
} from "@/lib/repo/resources.repo";
import { ResourceFormDialog } from "@/components/features/admin/ResourceFormDialog";

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

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
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

  const handleCreate = async (data: Omit<Resource, "id">) => {
    try {
      const result = await createResource(data);
      setResources((prev) => [result, ...prev]);
      toast.success("Ressource créée");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la création");
    }
  };

  const handleUpdate = async (data: Omit<Resource, "id">) => {
    if (!editing) return;
    try {
      const result = await updateResource(editing.id, data);
      if (result) {
        setResources((prev) => prev.map((r) => (r.id === editing.id ? result : r)));
      }
      toast.success("Ressource modifiée");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la modification");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteResource(id);
      setResources((prev) => prev.filter((r) => r.id !== id));
      toast.success("Ressource supprimée");
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ressources</h1>
          <p className="text-muted-foreground">Bibliothèque technique et réglementaire</p>
        </div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une ressource
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="">Toutes catégories</option>
          {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">Tous types</option>
          {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Stats */}
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Library className="h-4 w-4" />
        <span>{filtered.length} ressource{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Ressource</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Catégorie</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((res) => {
              const cfg = typeConfig[res.type];
              const Icon = cfg.icon;
              return (
                <tr key={res.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${cfg.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground line-clamp-1">{res.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {res.description}{res.source ? ` — ${res.source}` : ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="secondary">{categoryLabels[res.category]}</Badge></td>
                  <td className="px-4 py-3">
                    <Badge className={cfg.color}>{typeLabels[res.type]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{res.publishedDate}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(res); setDialogOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(res.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">Aucune ressource trouvée</div>
        )}
      </div>

      <ResourceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing}
      />
    </div>
  );
}
