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
import { VideoEmbed } from "@/components/ui/video-embed";
import type { Article } from "@/types/article";

interface ArticleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Article, "id">) => void;
  initialData?: Article | null;
}

const EMPTY: Omit<Article, "id"> = {
  title: "",
  excerpt: "",
  author: "",
  category: "Sécurité",
  status: "draft",
  publishedDate: null,
  views: 0,
  featured: false,
  videoUrl: "",
};

export function ArticleFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: ArticleFormDialogProps) {
  const [form, setForm] = useState<Omit<Article, "id">>(EMPTY);

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

  const set = (key: string, value: string | boolean | number | null) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      publishedDate:
        form.status === "published"
          ? form.publishedDate ?? new Date().toISOString().split("T")[0]
          : null,
    };
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier l'article" : "Nouvel article"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label>Résumé</Label>
            <Textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Vidéo (optionnel)</Label>
            <Input
              value={form.videoUrl ?? ""}
              onChange={(e) => set("videoUrl", e.target.value)}
              placeholder="URL YouTube, Vimeo ou vidéo directe (.mp4)"
            />
            {form.videoUrl && (
              <div className="mt-2">
                <VideoEmbed url={form.videoUrl} title={form.title} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Auteur</Label>
              <Input value={form.author} onChange={(e) => set("author", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                <option value="Sécurité">Sécurité</option>
                <option value="Réglementation">Réglementation</option>
                <option value="Formation">Formation</option>
                <option value="Innovation">Innovation</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Statut</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>
            <div className="flex items-end gap-2 pb-1">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="featured">Article à la une</Label>
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
