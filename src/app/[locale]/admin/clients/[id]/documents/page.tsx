"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Archive, FileText, Download, Eye, EyeOff, Info, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { useClient } from "@/components/features/admin/clients/ClientContext";
import { StatusBadge } from "@/components/features/admin/ui/status-badge";
import { AdminEmptyState } from "@/components/features/admin/ui/admin-empty-state";
import { ContractDocumentDialog } from "@/components/features/admin/clients/ContractDocumentDialog";
import { listContractDocumentsByClientId, updateContractDocument, deleteContractDocument, isClientVisibleContractDocument } from "@/lib/repo/contract-documents.repo";
import { getSignedUrl, deleteFile } from "@/lib/supabase/storage";
import type { ContractDocument, ContractDocumentType, ContractDocumentStatus } from "@/types/client";

const DOC_TYPES: ContractDocumentType[] = ["offer", "quote", "contract", "addendum", "resource", "report", "other"];
const DOC_STATUSES: ContractDocumentStatus[] = ["draft", "sent", "signed", "archived"];

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / 1048576).toFixed(1)} Mo`;
}

export default function ClientDocumentsPage() {
  const client = useClient();
  const t = useTranslations("admin.clients.documents");
  const [docs, setDocs] = useState<ContractDocument[]>([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editDoc, setEditDoc] = useState<ContractDocument | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    listContractDocumentsByClientId(client.id).then((d) => {
      if (!cancelled) setDocs(d.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)));
    });
    return () => { cancelled = true; };
  }, [client.id, refreshKey]);

  const reload = () => setRefreshKey((k) => k + 1);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  const filtered = docs.filter((d) => (!typeFilter || d.type === typeFilter) && (!statusFilter || d.status === statusFilter));

  const openForm = (doc?: ContractDocument) => {
    setEditDoc(doc ?? null);
    setFormOpen(true);
  };

  const handleDownload = async (d: ContractDocument) => {
    if (!d.storagePath) { toast.error("Aucun fichier attaché à ce document"); return; }
    try {
      const url = await getSignedUrl("contract-documents", d.storagePath);
      window.open(url, "_blank", "noopener");
    } catch {
      toast.error("Impossible d'ouvrir le fichier");
    }
  };

  const handleDelete = async (d: ContractDocument) => {
    if (!window.confirm(`Supprimer « ${d.title} » ? Cette action est définitive.`)) return;
    await deleteContractDocument(d.id);
    if (d.storagePath) await deleteFile("contract-documents", d.storagePath);
    reload();
  };
  const handleStatusChange = async (id: string, status: ContractDocumentStatus) => { await updateContractDocument(id, { status }); reload(); };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif-display text-lg font-semibold text-foreground">{t("title")}</h2>
        <Button onClick={() => openForm()}><Plus className="mr-2 h-4 w-4" strokeWidth={1.75} />{t("upload")}</Button>
      </div>

      <div className="mb-4 flex items-start gap-2 rounded-lg border border-[var(--admin-line)] bg-secondary/40 p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
        <span>{t("visibilityInfo")}</span>
      </div>

      <div className="mb-4 flex gap-3">
        <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">{t("allTypes")}</option>
          {DOC_TYPES.map((dt) => <option key={dt} value={dt}>{t(`types.${dt}`)}</option>)}
        </select>
        <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">{t("allStatuses")}</option>
          {DOC_STATUSES.map((ds) => <option key={ds} value={ds}>{t(`statuses.${ds}`)}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState icon={FileText} title={t("empty")} />
      ) : (
      <div className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">{t("colTitle")}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">{t("colType")}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">{t("colVersion")}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">{t("colStatus")}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">{t("colVisibility")}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">{t("colDate")}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">{t("colSize")}</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">{t("colActions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-secondary/30">
                <td className="px-4 py-3 text-sm font-medium">{d.title}</td>
                <td className="px-4 py-3"><Badge variant="secondary">{t(`types.${d.type}`)}</Badge></td>
                <td className="px-4 py-3 text-sm text-muted-foreground">v{d.version}</td>
                <td className="px-4 py-3"><StatusBadge status={d.status}>{t(`statuses.${d.status}`)}</StatusBadge></td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    {isClientVisibleContractDocument(d) ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-admin-pos">
                        <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />{t("visibleClient")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <EyeOff className="h-3.5 w-3.5" strokeWidth={1.75} />{t("internalOnly")}
                      </span>
                    )}
                    {isClientVisibleContractDocument(d) && (
                      d.accessType === "view-only" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-admin-urgent">
                          <Lock className="h-3 w-3" strokeWidth={1.75} />Lecture seule
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Download className="h-3 w-3" strokeWidth={1.75} />Téléchargeable
                        </span>
                      )
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{fmtDate(d.uploadedAt)}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{fmtSize(d.fileSize)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {d.storagePath && (
                      <Button variant="ghost" size="icon" onClick={() => handleDownload(d)} title="Télécharger"><Download className="h-4 w-4 text-primary" strokeWidth={1.75} /></Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => openForm(d)}><Edit className="h-4 w-4" strokeWidth={1.75} /></Button>
                    {d.status !== "signed" && d.status !== "archived" && (
                      <Button variant="ghost" size="icon" onClick={() => handleStatusChange(d.id, d.status === "draft" ? "sent" : "signed")}><Archive className="h-4 w-4" strokeWidth={1.75} /></Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(d)}><Trash2 className="h-4 w-4 text-destructive" strokeWidth={1.75} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      <ContractDocumentDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editDoc={editDoc}
        clientId={client.id}
        onSaved={reload}
      />
    </div>
  );
}
