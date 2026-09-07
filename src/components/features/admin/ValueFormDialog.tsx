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
import type { ValueItem } from "@/lib/repo/values.repo";

interface ValueFormDialogProps {
  value: ValueItem;
  onClose: () => void;
  onSave: (data: Partial<ValueItem>) => void;
}

export function ValueFormDialog({ value, onClose, onSave }: ValueFormDialogProps) {
  const [form, setForm] = useState({
    title: value.title,
    description: value.description,
    icon: value.icon,
  });

  const set = (key: string, val: string) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier - {value.title}</DialogTitle>
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
          <div className="space-y-2">
            <Label>Icône (nom Lucide)</Label>
            <Input value={form.icon} onChange={(e) => set("icon", e.target.value)} placeholder="ex: shield" />
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
