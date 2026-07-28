"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileUploadField } from "@/components/features/admin/ui/FileUploadField";
import { createContractDocument, updateContractDocument } from "@/lib/repo/contract-documents.repo";
import { uploadFile, buildStoragePath } from "@/lib/supabase/storage";
import type { ContractDocument, ContractDocumentType, ContractDocumentStatus } from "@/types/client";
import type { AccessType } from "@/types/shared";

const DOC_TYPES: ContractDocumentType[] = ["offer", "quote", "contract", "addendum", "resource", "report", "other"];
const DOC_STATUSES: ContractDocumentStatus[] = ["draft", "sent", "signed", "archived"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editDoc: ContractDocument | null;
  clientId: string;
  onSaved: () => void;
}

/** Formulaire d'ajout / édition d'un document contractuel (contrats, rapports…). */
export function ContractDocumentDialog({ open, onOpenChange, editDoc, clientId, onSaved }: Props) {
  const t = useTranslations("admin.clients.documents");
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState<ContractDocumentType>("contract");
  const [docStatus, setDocStatus] = useState<ContractDocumentStatus>("draft");
  const [docAccess, setDocAccess] = useState<AccessType>("download");
  const [docNotes, setDocNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // (Ré)initialise le formulaire à chaque ouverture / changement de document édité.
  useEffect(() => {
    if (!open) return;
    setFile(null);
    setTitle(editDoc?.title ?? "");
    setDocType(editDoc?.type ?? "contract");
    setDocStatus(editDoc?.status ?? "draft");
    setDocAccess(editDoc?.accessType ?? "download");
    setDocNotes(editDoc?.notes ?? "");
  }, [open, editDoc]);

  const handleSave = async () => {
    if (!title.trim()) { toast.error("Le titre est requis"); return; }
    setSaving(true);
    try {
      if (editDoc) {
        let patch: Partial<ContractDocument> = { title, type: docType, status: docStatus, accessType: docAccess, notes: docNotes || undefined };
        if (file) {
          const path = await uploadFile("contract-documents", buildStoragePath(clientId, file.name), file);
          patch = { ...patch, storagePath: path, fileName: file.name, fileSize: file.size, mimeType: file.type || "application/pdf", version: editDoc.version + 1 };
        }
        await updateContractDocument(editDoc.id, patch);
      } else {
        let storagePath: string | undefined;
        let name = ""; let size = 0; let mime = "application/pdf";
        if (file) {
          storagePath = await uploadFile("contract-documents", buildStoragePath(clientId, file.name), file);
          name = file.name; size = file.size; mime = file.type || "application/pdf";
        }
        await createContractDocument({
          clientId, type: docType, title, version: 1, fileName: name, fileSize: size,
          mimeType: mime, storagePath, uploadedAt: new Date().toISOString(), uploadedBy: "", status: docStatus, accessType: docAccess, notes: docNotes || undefined,
        });
      }
      onOpenChange(false);
      onSaved();
      toast.success(editDoc ? "Document mis à jour" : "Document ajouté");
    } catch {
      toast.error("Échec de l'enregistrement du document");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{editDoc ? t("editMeta") : t("upload")}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>{t("formTitle")}</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>{t("formType")}</Label><NativeSelect value={docType} onChange={(e) => setDocType(e.target.value as ContractDocumentType)}>{DOC_TYPES.map((dt) => <option key={dt} value={dt}>{t(`types.${dt}`)}</option>)}</NativeSelect></div>
            <div className="space-y-2"><Label>{t("formStatus")}</Label><NativeSelect value={docStatus} onChange={(e) => setDocStatus(e.target.value as ContractDocumentStatus)}>{DOC_STATUSES.map((ds) => <option key={ds} value={ds}>{t(`statuses.${ds}`)}</option>)}</NativeSelect></div>
          </div>
          <div className="space-y-2">
            <Label>{t("formFile")}</Label>
            <FileUploadField file={file} onFileChange={setFile} currentName={editDoc && editDoc.storagePath ? editDoc.fileName : null} accept="application/pdf,image/*" label="Déposer un PDF" disabled={saving} />
          </div>
          <div className="space-y-2">
            <Label>Accès client</Label>
            <NativeSelect value={docAccess} onChange={(e) => setDocAccess(e.target.value as AccessType)}>
              <option value="download">Téléchargement + impression</option>
              <option value="view-only">Visualisation seule</option>
            </NativeSelect>
            <p className="text-xs text-muted-foreground">
              {docAccess === "view-only"
                ? "Le client peut consulter le document mais ne peut ni le télécharger ni l'imprimer."
                : "Le client peut consulter, télécharger et imprimer le document."}
            </p>
          </div>
          <div className="space-y-2"><Label>{t("formNotes")}</Label><Textarea rows={2} value={docNotes} onChange={(e) => setDocNotes(e.target.value)} /></div>
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" strokeWidth={1.75} />}
              {editDoc ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
