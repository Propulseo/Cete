"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Archive, FileText, Download, Loader2, Eye, EyeOff, Info } from "lucide-react";
import { toast } from "sonner";
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
import { FileUploadField } from "@/components/features/admin/ui/FileUploadField";
import { listContractDocumentsByClientId, createContractDocument, updateContractDocument, deleteContractDocument, isClientVisibleContractDocument } from "@/lib/repo/contract-documents.repo";
import { uploadFile, getSignedUrl, deleteFile, buildStoragePath } from "@/lib/supabase/storage";
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
  const [file, setFile] = useState<File | null>(null);
  const [docStatus, setDocStatus] = useState<ContractDocumentStatus>("draft");
  const [docNotes, setDocNotes] = useState("");
  const [saving, setSaving] = useState(false);
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
    setFile(null);
    if (doc) {
      setEditDoc(doc); setTitle(doc.title); setDocType(doc.type); setFileName(doc.fileName); setFileSize(doc.fileSize); setDocStatus(doc.status); setDocNotes(doc.notes ?? "");
    } else {
      setEditDoc(null); setTitle(""); setDocType("contract"); setFileName(""); setFileSize(0); setDocStatus("draft"); setDocNotes("");
    }
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim()) { toast.error("Le titre est requis"); return; }
    setSaving(true);
    try {
      if (editDoc) {
        // Remplacement de fichier optionnel en édition.
        let patch: Partial<ContractDocument> = { title, type: docType, status: docStatus, notes: docNotes || undefined };
        if (file) {
          const path = await uploadFile("contract-documents", buildStoragePath(client.id, file.name), file);
          patch = { ...patch, storagePath: path, fileName: file.name, fileSize: file.size, mimeType: file.type || "application/pdf", version: editDoc.version + 1 };
        }
        await updateContractDocument(editDoc.id, patch);
      } else {
        let storagePath: string | undefined;
        let name = "";
        let size = 0;
        let mime = "application/pdf";
        if (file) {
          storagePath = await uploadFile("contract-documents", buildStoragePath(client.id, file.name), file);
          name = file.name; size = file.size; mime = file.type || "application/pdf";
        }
        await createContractDocument({
          clientId: client.id, type: docType, title, version: 1, fileName: name, fileSize: size,
          mimeType: mime, storagePath, uploadedAt: new Date().toISOString(), uploadedBy: "", status: docStatus, notes: docNotes || undefined,
        });
      }
      setFormOpen(false);
      reload();
      toast.success(editDoc ? "Document mis à jour" : "Document ajouté");
    } catch {
      toast.error("Échec de l'enregistrement du document");
    } finally {
      setSaving(false);
    }
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
                  {isClientVisibleContractDocument(d) ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-admin-pos">
                      <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />{t("visibleClient")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <EyeOff className="h-3.5 w-3.5" strokeWidth={1.75} />{t("internalOnly")}
                    </span>
                  )}
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

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editDoc ? t("editMeta") : t("upload")}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>{t("formTitle")}</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{t("formType")}</Label><select className={selectClass} value={docType} onChange={(e) => setDocType(e.target.value as ContractDocumentType)}>{DOC_TYPES.map((dt) => <option key={dt} value={dt}>{t(`types.${dt}`)}</option>)}</select></div>
              <div className="space-y-2"><Label>{t("formStatus")}</Label><select className={selectClass} value={docStatus} onChange={(e) => setDocStatus(e.target.value as ContractDocumentStatus)}>{DOC_STATUSES.map((ds) => <option key={ds} value={ds}>{t(`statuses.${ds}`)}</option>)}</select></div>
            </div>
            <div className="space-y-2">
              <Label>{t("formFile")}</Label>
              <FileUploadField
                file={file}
                onFileChange={setFile}
                currentName={editDoc && editDoc.storagePath ? editDoc.fileName : null}
                accept="application/pdf,image/*"
                label="Déposer un PDF"
                disabled={saving}
              />
            </div>
            <div className="space-y-2"><Label>{t("formNotes")}</Label><Textarea rows={2} value={docNotes} onChange={(e) => setDocNotes(e.target.value)} /></div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setFormOpen(false)} disabled={saving}>Annuler</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" strokeWidth={1.75} />}
                {editDoc ? "Enregistrer" : "Ajouter"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
