"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Archive, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useClient } from "@/components/features/admin/clients/ClientContext";
import { StatusBadge } from "@/components/features/admin/ui/status-badge";
import { AdminEmptyState } from "@/components/features/admin/ui/admin-empty-state";
import { listContractDocumentsByClientId, createContractDocument, updateContractDocument, deleteContractDocument } from "@/lib/repo/contract-documents.repo";
import type { ContractDocument, ContractDocumentType, ContractDocumentStatus } from "@/types/client";

const selectClass = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm";
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
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState<ContractDocumentType>("contract");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [docStatus, setDocStatus] = useState<ContractDocumentStatus>("draft");
  const [docNotes, setDocNotes] = useState("");
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
    if (doc) {
      setEditDoc(doc); setTitle(doc.title); setDocType(doc.type); setFileName(doc.fileName); setFileSize(doc.fileSize); setDocStatus(doc.status); setDocNotes(doc.notes ?? "");
    } else {
      setEditDoc(null); setTitle(""); setDocType("contract"); setFileName(""); setFileSize(0); setDocStatus("draft"); setDocNotes("");
    }
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (editDoc) {
      await updateContractDocument(editDoc.id, { title, type: docType, status: docStatus, notes: docNotes || undefined });
    } else {
      const mockSize = fileSize || Math.floor(Math.random() * 500000) + 100000;
      const mockName = fileName || `${docType}-${Date.now()}.pdf`;
      await createContractDocument({
        clientId: client.id, type: docType, title, version: 1, fileName: mockName, fileSize: mockSize,
        mimeType: "application/pdf", uploadedAt: new Date().toISOString(), uploadedBy: "adm-001", status: docStatus, notes: docNotes || undefined,
      });
    }
    setFormOpen(false);
    reload();
  };

  const handleDelete = async (id: string) => { await deleteContractDocument(id); reload(); };
  const handleStatusChange = async (id: string, status: ContractDocumentStatus) => { await updateContractDocument(id, { status }); reload(); };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif-display text-lg font-semibold text-foreground">{t("title")}</h2>
        <Button onClick={() => openForm()}><Plus className="mr-2 h-4 w-4" strokeWidth={1.75} />{t("upload")}</Button>
      </div>

      <div className="mb-4 flex gap-3">
        <select className={`h-9 rounded-md border border-input bg-transparent px-3 text-sm`} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">{t("allTypes")}</option>
          {DOC_TYPES.map((dt) => <option key={dt} value={dt}>{t(`types.${dt}`)}</option>)}
        </select>
        <select className={`h-9 rounded-md border border-input bg-transparent px-3 text-sm`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
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
                <td className="px-4 py-3 text-sm text-muted-foreground">{fmtDate(d.uploadedAt)}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{fmtSize(d.fileSize)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openForm(d)}><Edit className="h-4 w-4" strokeWidth={1.75} /></Button>
                    {d.status !== "signed" && d.status !== "archived" && (
                      <Button variant="ghost" size="icon" onClick={() => handleStatusChange(d.id, d.status === "draft" ? "sent" : "signed")}><Archive className="h-4 w-4" strokeWidth={1.75} /></Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(d.id)}><Trash2 className="h-4 w-4 text-destructive" strokeWidth={1.75} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editDoc ? t("editMeta") : t("upload")}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>{t("formTitle")}</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{t("formType")}</Label><select className={selectClass} value={docType} onChange={(e) => setDocType(e.target.value as ContractDocumentType)}>{DOC_TYPES.map((dt) => <option key={dt} value={dt}>{t(`types.${dt}`)}</option>)}</select></div>
              <div className="space-y-2"><Label>{t("formStatus")}</Label><select className={selectClass} value={docStatus} onChange={(e) => setDocStatus(e.target.value as ContractDocumentStatus)}>{DOC_STATUSES.map((ds) => <option key={ds} value={ds}>{t(`statuses.${ds}`)}</option>)}</select></div>
            </div>
            {!editDoc && (
              <div className="space-y-2"><Label>{t("formFile")}</Label><Input type="file" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFileName(f.name); setFileSize(f.size); } }} /></div>
            )}
            <div className="space-y-2"><Label>{t("formNotes")}</Label><Textarea rows={2} value={docNotes} onChange={(e) => setDocNotes(e.target.value)} /></div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setFormOpen(false)}>Annuler</Button>
              <Button onClick={handleSave}>{editDoc ? "Enregistrer" : "Ajouter"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
