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
import type { PillarItem } from "@/lib/repo/pillars.repo";

interface PillarFormDialogProps {
  pillar: PillarItem;
  onClose: () => void;
  onSave: (data: Partial<PillarItem>) => void;
}

export function PillarFormDialog({ pillar, onClose, onSave }: PillarFormDialogProps) {
  const [form, setForm] = useState({
    title: pillar.title,
    description: pillar.description,
    icon: pillar.icon,
    color: pillar.color,
  });

  const set = (key: string, val: string) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier - {pillar.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Icône (nom Lucide)</Label>
              <Input value={form.icon} onChange={(e) => set("icon", e.target.value)} placeholder="ex: zap" />
            </div>
            <div className="space-y-2">
              <Label>Couleur</Label>
              <Input value={form.color} onChange={(e) => set("color", e.target.value)} placeholder="blue, yellow, green..." />
            </div>
          </div>
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" strokeWidth={1.75} />
              Annuler
            </Button>
            <Button onClick={() => onSave(form)}>
              <Save className="mr-2 h-4 w-4" strokeWidth={1.75} />
              Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
