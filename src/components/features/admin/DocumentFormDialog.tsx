"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ClientDocument } from "@/types/document";
import type { Profile } from "@/types/auth";
import { listUsers } from "@/lib/repo/users.repo";

type DocCategory = ClientDocument["category"];
type DocType = ClientDocument["type"];
type Visibility = ClientDocument["visibility"];

interface DocumentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<ClientDocument, "id">) => void;
  initialData?: ClientDocument | null;
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
};

export function DocumentFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: DocumentFormDialogProps) {
  const [form, setForm] = useState<Omit<ClientDocument, "id">>(EMPTY);
  const [clients, setClients] = useState<Profile[]>([]);

  useEffect(() => {
    if (open) {
      if (initialData) {
        const { id: _, ...rest } = initialData;
        setForm(rest);
      } else {
        setForm(EMPTY);
      }
      listUsers()
        .then((users) => setClients(users.filter((u) => u.role === "client")))
        .catch(() => setClients([]));
    }
  }, [open, initialData]);

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    onOpenChange(false);
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
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
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
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Taille du fichier</Label>
                <Input
                  placeholder="ex: 2.5 MB"
                  value={form.fileSize ?? ""}
                  onChange={(e) => set("fileSize", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>URL du fichier</Label>
                <Input
                  placeholder="/documents/fichier.pdf"
                  value={form.url ?? ""}
                  onChange={(e) => set("url", e.target.value)}
                />
              </div>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Visibilité</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={form.visibility}
                onChange={(e) => {
                  const v = e.target.value as Visibility;
                  setForm((prev) => ({
                    ...prev,
                    visibility: v,
                    clientId: v === "global" ? undefined : prev.clientId,
                  }));
                }}
              >
                <option value="global">Global (tous les clients)</option>
                <option value="client">Client spécifique</option>
              </select>
            </div>
            {form.visibility === "client" && (
              <div className="space-y-2">
                <Label>Client</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={form.clientId ?? ""}
                  onChange={(e) => set("clientId", e.target.value)}
                  required
                >
                  <option value="">Choisir...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.company}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {initialData ? "Enregistrer" : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
