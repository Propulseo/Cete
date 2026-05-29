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
import type { Profile } from "@/types/auth";

type UserPayload = Omit<Profile, "id" | "created_at"> & { password?: string };

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UserPayload) => void;
  initialData?: Profile | null;
}

const EMPTY: UserPayload = {
  name: "",
  email: "",
  role: "client",
  company: "",
  is_active: true,
  password: "",
};

export function UserFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: UserFormDialogProps) {
  const [form, setForm] = useState<UserPayload>(EMPTY);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          name: initialData.name,
          email: initialData.email,
          role: initialData.role,
          company: initialData.company ?? "",
          is_active: initialData.is_active,
        });
      } else {
        setForm(EMPTY);
      }
    }
  }, [open, initialData]);

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: UserPayload = {
      ...form,
      company: form.role === "client" ? form.company : undefined,
    };
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nom complet</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
            />
          </div>

          {!initialData && (
            <div className="space-y-2">
              <Label>Mot de passe</Label>
              <Input
                type="password"
                value={form.password ?? ""}
                onChange={(e) => set("password", e.target.value)}
                placeholder="Min. 6 caractères"
                required
                minLength={6}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Rôle</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
            >
              <option value="client">Client</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          {form.role === "client" && (
            <div className="space-y-2">
              <Label>Entreprise</Label>
              <Input
                value={form.company ?? ""}
                onChange={(e) => set("company", e.target.value)}
              />
            </div>
          )}

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
