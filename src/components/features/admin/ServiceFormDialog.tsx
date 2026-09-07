"use client";

import { useState } from "react";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ServiceItem } from "@/lib/repo/services.repo";

interface ServiceFormDialogProps {
  service: ServiceItem;
  onClose: () => void;
  onSave: (data: Partial<ServiceItem>) => void;
}

export function ServiceFormDialog({ service, onClose, onSave }: ServiceFormDialogProps) {
  const [form, setForm] = useState({
    category: service.category,
    type: service.type,
    isPillar: service.isPillar,
    title: service.title,
    description: service.description,
    shortDescription: service.shortDescription,
    featuresText: service.features.join("\n"),
    icon: service.icon,
    imageUrl: service.imageUrl,
  });

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = () => {
    onSave({
      category: form.category,
      type: form.type,
      isPillar: form.isPillar,
      title: form.title,
      description: form.description,
      shortDescription: form.shortDescription,
      features: form.featuresText.split("\n").map((f) => f.trim()).filter(Boolean),
      icon: form.icon,
      imageUrl: form.imageUrl,
    });
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier - {service.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Expertise ou Conseil" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Input value={form.type} onChange={(e) => set("type", e.target.value)} placeholder="expertise ou service" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="isPillar"
              type="checkbox"
              checked={form.isPillar}
              onChange={(e) => set("isPillar", e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="isPillar">Service pilier (mis en avant)</Label>
          </div>
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description courte</Label>
            <Input value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Points clés (un par ligne)</Label>
            <Textarea value={form.featuresText} onChange={(e) => set("featuresText", e.target.value)} rows={5} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Icône (nom Lucide)</Label>
              <Input value={form.icon} onChange={(e) => set("icon", e.target.value)} placeholder="ex: shield-alert" />
            </div>
            <div className="space-y-2">
              <Label>URL de l'image</Label>
              <Input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="/images/services/nom.png" />
            </div>
          </div>
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" strokeWidth={1.75} />
              Annuler
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" strokeWidth={1.75} />
              Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
