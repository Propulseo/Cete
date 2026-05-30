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
import { listClients } from "@/lib/repo/clients.repo";
import type { Resource, ResourceCategory, ResourceType } from "@/types/resource";
import type { AccessType, Visibility } from "@/types/shared";
import type { Client } from "@/types/client";

function formatBytes(bytes: number): string {
  if (!bytes) return "";
  const units = ["o", "Ko", "Mo", "Go"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

interface ResourceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Resource, "id">) => void;
  initialData?: Resource | null;
}

const categoryLabels: Record<ResourceCategory, string> = {
  normes: "Normes",
  reglementation: "Réglementation",
  guides: "Guides techniques",
  rapports: "Rapports",
  veille: "Veille réglementaire",
  partenaires: "Partenaires / sites de référence",
};

const typeLabels: Record<ResourceType, string> = {
  pdf: "PDF",
  lien: "Lien externe",
  video: "Vidéo",
};

const accessTypeLabels: Record<AccessType, string> = {
  "view-only": "Consultation en ligne",
  download: "Téléchargement",
};

const urlPlaceholders: Record<ResourceType, string> = {
  pdf: "/ressources/document.pdf",
  lien: "https://exemple.com/article",
  video: "https://youtube.com/watch?v=...",
};

const EMPTY: Omit<Resource, "id"> = {
  title: "",
  description: "",
  category: "normes",
  type: "pdf",
  accessType: "view-only",
  visibility: "global",
  assignedClientIds: [],
  url: "",
  youtubeId: undefined,
  fileSize: undefined,
  source: undefined,
  publishedDate: new Date().toISOString().split("T")[0],
  createdAt: new Date().toISOString().split("T")[0],
};

export function ResourceFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: ResourceFormDialogProps) {
  const [form, setForm] = useState<Omit<Resource, "id">>(EMPTY);
  const [clients, setClients] = useState<Client[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setFile(null);
      if (initialData) {
        const { id: _, ...rest } = initialData;
        setForm(rest);
      } else {
        setForm(EMPTY);
      }
      listClients().then(setClients).catch(() => setClients([]));
    }
  }, [open, initialData]);

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleClient = (id: string) =>
    setForm((prev) => ({
      ...prev,
      assignedClientIds: prev.assignedClientIds.includes(id)
        ? prev.assignedClientIds.filter((x) => x !== id)
        : [...prev.assignedClientIds, id],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.type === "pdf" && !file && !form.storagePath) {
      toast.error("Déposez un fichier PDF");
      return;
    }
    setSaving(true);
    try {
      let payload = { ...form };
      if (form.type === "pdf" && file) {
        const path = await uploadFile(
          "client-documents",
          buildStoragePath("global", file.name),
          file,
        );
        payload = { ...payload, storagePath: path, fileSize: formatBytes(file.size), url: "" };
      }
      onSubmit(payload);
      onOpenChange(false);
    } catch {
      toast.error("Échec du téléversement du fichier");
    } finally {
      setSaving(false);
    }
  };

  const selectClass =
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier la ressource" : "Nouvelle ressource"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <select
                className={selectClass}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {(Object.entries(categoryLabels) as [ResourceCategory, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <select
                className={selectClass}
                value={form.type}
                onChange={(e) => {
                  const t = e.target.value as ResourceType;
                  setForm((prev) => ({
                    ...prev,
                    type: t,
                    fileSize: t === "pdf" ? prev.fileSize : undefined,
                    youtubeId: t === "video" ? prev.youtubeId : undefined,
                  }));
                }}
              >
                {(Object.entries(typeLabels) as [ResourceType, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mode d&apos;accès client</Label>
            <select
              className={selectClass}
              value={form.accessType}
              onChange={(e) => set("accessType", e.target.value)}
            >
              {(Object.entries(accessTypeLabels) as [AccessType, string][]).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                )
              )}
            </select>
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
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={form.url}
                onChange={(e) => set("url", e.target.value)}
                placeholder={urlPlaceholders[form.type]}
                required
              />
            </div>
          )}

          {form.type === "video" && (
            <div className="space-y-2">
              <Label>YouTube ID</Label>
              <Input
                placeholder="ex: dQw4w9WgXcQ"
                value={form.youtubeId ?? ""}
                onChange={(e) => set("youtubeId", e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Source</Label>
            <Input
              placeholder="ex: AFNOR, Légifrance, CETé"
              value={form.source ?? ""}
              onChange={(e) => set("source", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Visibilité</Label>
            <select
              className={selectClass}
              value={form.visibility}
              onChange={(e) => {
                const v = e.target.value as Visibility;
                setForm((prev) => ({ ...prev, visibility: v, assignedClientIds: v === "global" ? [] : prev.assignedClientIds }));
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de publication</Label>
              <Input
                type="date"
                value={form.publishedDate}
                onChange={(e) => set("publishedDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Date de création</Label>
              <Input
                type="date"
                value={form.createdAt}
                onChange={(e) => set("createdAt", e.target.value)}
              />
            </div>
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
