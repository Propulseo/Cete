"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadField } from "@/components/features/admin/ui/FileUploadField";
import { uploadFile, buildStoragePath } from "@/lib/supabase/storage";
import type { ClientDocument } from "@/types/document";
import type { Client } from "@/types/client";
import { listClients } from "@/lib/repo/clients.repo";

function formatBytes(bytes: number): string {
  if (!bytes) return "";
  const units = ["o", "Ko", "Mo", "Go"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

type DocCategory = ClientDocument["category"];
type DocType = ClientDocument["type"];
type Visibility = ClientDocument["visibility"];

interface DocumentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<ClientDocument, "id">) => void;
  initialData?: ClientDocument | null;
  /** Verrouille l'assignation à un client (publication depuis le dossier client). */
  lockedClientId?: string;
}

const EMPTY: Omit<ClientDocument, "id"> = {
  title: "",
  category: "newsletters",
  type: "pdf",
  description: "",
  fileSize: "",
  uploadDate: new Date().toISOString().split("T")[0],
  url: "",
  visibility: "global",
  assignedClientIds: [],
  accessType: "view-only",
};

export function DocumentFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  lockedClientId,
}: DocumentFormDialogProps) {
  const [form, setForm] = useState<Omit<ClientDocument, "id">>(EMPTY);
  const [clients, setClients] = useState<Client[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setFile(null);
      if (initialData) {
        const { id: _, ...rest } = initialData;
        setForm(rest);
      } else if (lockedClientId) {
        setForm({ ...EMPTY, visibility: "assigned", assignedClientIds: [lockedClientId] });
      } else {
        setForm(EMPTY);
      }
      if (!lockedClientId) {
        listClients()
          .then(setClients)
          .catch(() => setClients([]));
      }
    }
  }, [open, initialData, lockedClientId]);

  const toggleClient = (id: string) =>
    setForm((prev) => ({
      ...prev,
      assignedClientIds: prev.assignedClientIds.includes(id)
        ? prev.assignedClientIds.filter((x) => x !== id)
        : [...prev.assignedClientIds, id],
    }));

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.type === "pdf" && !file && !form.storagePath) {
      toast.error("Déposez un fichier PDF");
      return;
    }
    setSaving(true);
    try {
      // Assignation effective (verrouillée au client courant le cas échéant).
      const visibility = lockedClientId ? "assigned" : form.visibility;
      const assignedClientIds = lockedClientId ? [lockedClientId] : form.assignedClientIds;
      let payload = { ...form, visibility, assignedClientIds };
      if (form.type === "pdf" && file) {
        // Un seul client assigné → dossier isolé <client_id> ; sinon `global/`
        // (lisible par tous les clients assignés ; la visibilité de la LIGNE est filtrée par la RLS table).
        const folder =
          visibility === "assigned" && assignedClientIds.length === 1
            ? assignedClientIds[0]
            : "global";
        const path = await uploadFile(
          "client-documents",
          buildStoragePath(folder, file.name),
          file,
        );
        payload = { ...payload, storagePath: path, fileSize: formatBytes(file.size), url: undefined };
      }
      onSubmit(payload);
      onOpenChange(false);
    } catch {
      toast.error("Échec du téléversement du fichier");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier le document" : "Nouveau document"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm text-foreground shadow-sm"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                <option value="newsletters">Newsletters</option>
                <option value="capsules">Capsules vidéo</option>
                <option value="guides">Guides</option>
                <option value="carnets">Carnets d&apos;appui</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm text-foreground shadow-sm"
                value={form.type}
                onChange={(e) => {
                  const t = e.target.value as DocType;
                  setForm((prev) => ({
                    ...prev,
                    type: t,
                    fileSize: t === "pdf" ? prev.fileSize : undefined,
                    url: t === "pdf" ? prev.url : undefined,
                    duration: t === "video" ? prev.duration : undefined,
                    youtubeId: t === "video" ? prev.youtubeId : undefined,
                  }));
                }}
              >
                <option value="pdf">PDF</option>
                <option value="video">Vidéo</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
            />
          </div>

          {form.type === "pdf" ? (
            <div className="space-y-2">
              <Label>Fichier PDF</Label>
              <FileUploadField
                file={file}
                onFileChange={setFile}
                currentName={initialData?.storagePath ? `${initialData.title}.pdf` : null}
                accept="application/pdf"
                label="Déposer le PDF"
                disabled={saving}
              />
              {form.fileSize && !file && (
                <p className="text-xs text-muted-foreground">Taille : {form.fileSize}</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Durée</Label>
                <Input
                  placeholder="ex: 8:42"
                  value={form.duration ?? ""}
                  onChange={(e) => set("duration", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>YouTube ID</Label>
                <Input
                  placeholder="ex: dQw4w9WgXcQ"
                  value={form.youtubeId ?? ""}
                  onChange={(e) => set("youtubeId", e.target.value)}
                />
              </div>
            </div>
          )}

          {!lockedClientId && (
            <>
              <div className="space-y-2">
                <Label>Visibilité</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm text-foreground shadow-sm"
                  value={form.visibility}
                  onChange={(e) => {
                    const v = e.target.value as Visibility;
                    setForm((prev) => ({
                      ...prev,
                      visibility: v,
                      assignedClientIds: v === "global" ? [] : prev.assignedClientIds,
                    }));
                  }}
                >
                  <option value="global">Global (tous les clients)</option>
                  <option value="assigned">Clients spécifiques</option>
                </select>
              </div>
              {form.visibility === "assigned" && (
                <div className="space-y-2">
                  <Label>Clients destinataires</Label>
                  <div className="max-h-40 space-y-0.5 overflow-y-auto rounded-md border border-input p-2">
                    {clients.length === 0 ? (
                      <p className="px-1 text-xs text-muted-foreground">Aucune entreprise cliente.</p>
                    ) : (
                      clients.map((c) => (
                        <label key={c.id} className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-accent">
                          <input
                            type="checkbox"
                            checked={form.assignedClientIds.includes(c.id)}
                            onChange={() => toggleClient(c.id)}
                            className="h-4 w-4 rounded border-input"
                          />
                          {c.companyName}
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <Label>Type d&apos;accès</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm text-foreground shadow-sm"
              value={form.accessType ?? "view-only"}
              onChange={(e) => set("accessType", e.target.value)}
            >
              <option value="view-only">Visualisation uniquement</option>
              <option value="download">Téléchargement autorisé</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={form.uploadDate}
              onChange={(e) => set("uploadDate", e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" strokeWidth={1.75} />}
              {initialData ? "Enregistrer" : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
