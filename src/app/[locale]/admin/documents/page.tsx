"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, FileText, Video, Search, Loader2, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { ClientDocument } from "@/types/document";
import {
  listDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from "@/lib/repo/documents.repo";
import { DocumentFormDialog } from "@/components/features/admin/DocumentFormDialog";

const categoryLabels: Record<string, string> = {
  newsletters: "Newsletters",
  capsules: "Capsules",
  guides: "Guides",
  carnets: "Carnets",
};

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
        <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm" value={filterVis} onChange={(e) => setFilterVis(e.target.value)}>
          <option value="">Toute visibilité</option>
          <option value="global">Global</option>
          <option value="client">Client</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Document</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Catégorie</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Visibilité</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Accès</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((doc) => (
              <tr key={doc.id} className="hover:bg-secondary/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${doc.type === "pdf" ? "bg-red-100 text-red-600" : "bg-purple-100 text-purple-600"}`}>
                      {doc.type === "pdf" ? <FileText className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground line-clamp-1">{doc.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{doc.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge variant="secondary">{categoryLabels[doc.category]}</Badge></td>
                <td className="px-4 py-3"><Badge variant={doc.type === "pdf" ? "outline" : "default"}>{doc.type}</Badge></td>
                <td className="px-4 py-3"><Badge variant={doc.visibility === "global" ? "default" : "outline"}>{doc.visibility}{doc.clientId ? ` · ${doc.clientId}` : ""}</Badge></td>
                <td className="px-4 py-3">
                  {doc.accessType === "download" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                      <Download className="h-3 w-3" />
                      Téléchargement
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                      <Eye className="h-3 w-3" />
                      Lecture seule
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{doc.uploadDate}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(doc); setDialogOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">Aucun document trouvé</div>
        )}
      </div>

      <DocumentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing}
      />
    </div>
  );
}
