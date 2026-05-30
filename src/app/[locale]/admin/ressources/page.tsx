"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Library, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Resource } from "@/types/resource";
import {
  listResources,
  createResource,
  updateResource,
  deleteResource,
} from "@/lib/repo/resources.repo";
import { ResourceFormDialog } from "@/components/features/admin/ResourceFormDialog";
import { AdminResourceFilters } from "@/components/features/admin/AdminResourceFilters";
import { AdminResourceTable } from "@/components/features/admin/AdminResourceTable";
import { AdminPageHeader } from "@/components/features/admin/ui/admin-page-header";

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
    if (!window.confirm("Supprimer cette ressource ? Cette action est définitive.")) return;
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
    <div className="p-4 lg:p-8">
      <AdminPageHeader
        title="Ressources"
        subtitle="Bibliothèque technique et réglementaire"
        actions={
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une ressource
          </Button>
        }
      />

      <AdminResourceFilters
        search={search}
        onSearchChange={setSearch}
        filterCat={filterCat}
        onFilterCatChange={setFilterCat}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
      />

      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Library className="h-4 w-4" />
        <span>{filtered.length} ressource{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <AdminResourceTable
        resources={filtered}
        onEdit={(res) => { setEditing(res); setDialogOpen(true); }}
        onDelete={handleDelete}
      />

      <ResourceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing}
      />
    </div>
  );
}
