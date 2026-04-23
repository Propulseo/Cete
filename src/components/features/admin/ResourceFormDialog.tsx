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
import type { Resource, ResourceCategory, ResourceType, ResourceAccessMode } from "@/types/resource";

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
};

const typeLabels: Record<ResourceType, string> = {
  pdf: "PDF",
  lien: "Lien externe",
  video: "Vidéo",
};

const accessModeLabels: Record<ResourceAccessMode, string> = {
  lecture: "Consultation en ligne",
  telechargement: "Téléchargement",
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
  accessMode: "lecture",
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

  useEffect(() => {
    if (open) {
      if (initialData) {
        const { id: _, ...rest } = initialData;
        setForm(rest);
      } else {
        setForm(EMPTY);
      }
    }
  }, [open, initialData]);

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    onOpenChange(false);
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
              value={form.accessMode}
              onChange={(e) => set("accessMode", e.target.value)}
            >
              {(Object.entries(accessModeLabels) as [ResourceAccessMode, string][]).map(
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

          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
              placeholder={urlPlaceholders[form.type]}
              required
            />
          </div>

          {form.type === "pdf" && (
            <div className="space-y-2">
              <Label>Taille du fichier</Label>
              <Input
                placeholder="ex: 2.5 MB"
                value={form.fileSize ?? ""}
                onChange={(e) => set("fileSize", e.target.value)}
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
