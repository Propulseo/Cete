"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Download, FileText, Video, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useClient } from "@/components/features/admin/clients/ClientContext";
import { AdminEmptyState } from "@/components/features/admin/ui/admin-empty-state";
import {
  DataTable,
  DataThead,
  DataTh,
  DataTbody,
  DataTr,
  DataTd,
} from "@/components/shared/data-table";
import { RecordCard, RecordCardList } from "@/components/shared/record-card";
import { DocumentFormDialog } from "@/components/features/admin/DocumentFormDialog";
import { listAssignedToClient, createDocument, deleteDocument } from "@/lib/repo/documents.repo";
import { getSignedUrl, deleteFile } from "@/lib/supabase/storage";
import type { ClientDocument } from "@/types/document";

const CATEGORY_LABEL: Record<ClientDocument["category"], string> = {
  newsletters: "Newsletters",
  capsules: "Capsules vidéo",
  guides: "Guides",
  carnets: "Carnets d'appui",
};

export default function ClientEspacePage() {
  const client = useClient();
  const [docs, setDocs] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setDocs(await listAssignedToClient(client.id));
    } catch {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [client.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (data: Omit<ClientDocument, "id">) => {
    try {
      await createDocument(data);
      toast.success("Document publié — visible par ce client");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de la publication");
    }
  };

  const handleDownload = async (d: ClientDocument) => {
    if (d.type === "video" && d.youtubeId) {
      window.open(`https://www.youtube.com/watch?v=${d.youtubeId}`, "_blank", "noopener");
      return;
    }
    if (d.storagePath) {
      try {
        const url = await getSignedUrl("client-documents", d.storagePath);
        window.open(url, "_blank", "noopener");
      } catch {
        toast.error("Impossible d'ouvrir le fichier");
      }
      return;
    }
    if (d.url) window.open(d.url, "_blank", "noopener");
    else toast.error("Aucun fichier attaché");
  };

  const handleDelete = async (d: ClientDocument) => {
    if (!window.confirm(`Retirer « ${d.title} » du portail de ce client ? Action définitive.`)) return;
    try {
      await deleteDocument(d.id);
      if (d.storagePath) await deleteFile("client-documents", d.storagePath);
      load();
      toast.success("Document retiré");
    } catch {
      toast.error("Échec de la suppression");
    }
  };

  // Actions partagées par la vue tableau (≥lg) et la vue fiches.
  const rowActions = (d: ClientDocument) => (
    <>
      <Button variant="ghost" size="icon" onClick={() => handleDownload(d)} aria-label={`Ouvrir ${d.title}`}>
        <Download className="h-4 w-4 text-primary" strokeWidth={1.75} />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => handleDelete(d)} aria-label={`Retirer ${d.title}`}>
        <Trash2 className="h-4 w-4 text-destructive" strokeWidth={1.75} />
      </Button>
    </>
  );

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-serif-display text-lg font-semibold text-foreground">Espace client — documents</h2>
          <p className="text-sm text-muted-foreground">Ces documents apparaissent dans le portail de ce client, sur la page correspondant à leur catégorie.</p>
        </div>
        <Button className="w-full shrink-0 sm:w-auto" onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" strokeWidth={1.75} />Publier un document</Button>
      </div>

      <div className="mb-4 flex items-start gap-2 rounded-lg border border-[var(--admin-line)] bg-secondary/40 p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
        <span>Pour publier un document à <strong>tous</strong> les clients, utilisez Admin → Documents (visibilité « Global »). Les <strong>rapports et contrats signés</strong> de l&apos;onglet « Documents » apparaissent automatiquement dans la page « Mes documents » du client ; les brouillons, devis et offres y restent internes.</span>
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-primary" strokeWidth={1.75} /></div>
      ) : docs.length === 0 ? (
        <AdminEmptyState icon={FileText} title="Aucun document publié pour ce client" />
      ) : (
        <>
          <div className="hidden lg:block">
            <DataTable>
              <DataThead>
                <tr>
                  <DataTh>Document</DataTh>
                  <DataTh>Catégorie</DataTh>
                  <DataTh>Type</DataTh>
                  <DataTh className="text-right">Actions</DataTh>
                </tr>
              </DataThead>
              <DataTbody>
                {docs.map((d) => (
                  <DataTr key={d.id}>
                    <DataTd>
                      <p className="text-sm font-medium">{d.title}</p>
                      {d.description && <p className="text-xs text-muted-foreground line-clamp-1">{d.description}</p>}
                    </DataTd>
                    <DataTd><Badge variant="secondary">{CATEGORY_LABEL[d.category]}</Badge></DataTd>
                    <DataTd className="text-muted-foreground">
                      {d.type === "video" ? <Video className="h-4 w-4" strokeWidth={1.75} /> : <FileText className="h-4 w-4" strokeWidth={1.75} />}
                    </DataTd>
                    <DataTd className="text-right">
                      <div className="flex items-center justify-end gap-1">{rowActions(d)}</div>
                    </DataTd>
                  </DataTr>
                ))}
              </DataTbody>
            </DataTable>
          </div>

          <RecordCardList className="lg:hidden">
            {docs.map((d) => (
              <RecordCard
                key={d.id}
                icon={
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    {d.type === "video" ? <Video className="size-4" strokeWidth={1.75} /> : <FileText className="size-4" strokeWidth={1.75} />}
                  </div>
                }
                title={d.title}
                subtitle={d.description}
                badges={<Badge variant="secondary">{CATEGORY_LABEL[d.category]}</Badge>}
                actions={rowActions(d)}
              />
            ))}
          </RecordCardList>
        </>
      )}

      <DocumentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        initialData={null}
        lockedClientId={client.id}
      />
    </div>
  );
}
