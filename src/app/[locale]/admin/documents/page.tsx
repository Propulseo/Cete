"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ClientDocument } from "@/types/document";
import {
  listDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from "@/lib/repo/documents.repo";
import { DocumentFormDialog } from "@/components/features/admin/DocumentFormDialog";
import { AdminDocumentFilters } from "@/components/features/admin/AdminDocumentFilters";
import { AdminDocumentTable } from "@/components/features/admin/AdminDocumentTable";

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ClientDocument | null>(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterVis, setFilterVis] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listDocuments();
      setDocs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (data: Omit<ClientDocument, "id">) => {
    try {
      const result = await createDocument(data);
      setDocs((prev) => [result, ...prev]);
      toast.success("Document créé");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la création");
    }
  };

  const handleUpdate = async (data: Omit<ClientDocument, "id">) => {
    if (!editing) return;
    try {
      const result = await updateDocument(editing.id, data);
      if (result) {
        setDocs((prev) => prev.map((d) => (d.id === editing.id ? result : d)));
      }
      toast.success("Document modifié");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la modification");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      setDocs((prev) => prev.filter((d) => d.id !== id));
      toast.success("Document supprimé");
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

  const filtered = docs.filter((d) => {
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCat && d.category !== filterCat) return false;
    if (filterVis && d.visibility !== filterVis) return false;
    return true;
  });

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground">Publications et ressources diffusées aux organisations notées</p>
        </div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>

      <AdminDocumentFilters
        search={search}
        onSearchChange={setSearch}
        filterCat={filterCat}
        onFilterCatChange={setFilterCat}
        filterVis={filterVis}
        onFilterVisChange={setFilterVis}
      />

      <AdminDocumentTable
        documents={filtered}
        onEdit={(doc) => { setEditing(doc); setDialogOpen(true); }}
        onDelete={handleDelete}
      />

      <DocumentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing}
      />
    </div>
  );
}
