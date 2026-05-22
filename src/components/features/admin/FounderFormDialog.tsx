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
import type { Founder } from "@/types/founder";

interface FounderFormDialogProps {
  founder: Founder;
  onClose: () => void;
  onSave: (data: Partial<Founder>) => void;
}

export function FounderFormDialog({
  founder,
  onClose,
  onSave,
}: FounderFormDialogProps) {
  const [form, setForm] = useState({
    name: founder.name,
    role: founder.role,
    bio: founder.bio,
    imageUrl: founder.imageUrl,
    formerOrg: founder.formerOrg ?? "",
    currentEntity: founder.currentEntity ?? "",
  });

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier - {founder.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nom</Label>
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Titre / Rôle</Label>
            <Input
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Biographie</Label>
            <Textarea
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>URL de la photo</Label>
            <Input
              value={form.imageUrl}
              onChange={(e) => set("imageUrl", e.target.value)}
              placeholder="/images/founders/nom.jpg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ancien organisme</Label>
              <Input
                value={form.formerOrg}
                onChange={(e) => set("formerOrg", e.target.value)}
                placeholder="ex: Ancien Expert SERECT"
              />
            </div>
            <div className="space-y-2">
              <Label>Entité actuelle</Label>
              <Input
                value={form.currentEntity}
                onChange={(e) => set("currentEntity", e.target.value)}
                placeholder="ex: Fondateur de..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button onClick={() => onSave(form)}>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
