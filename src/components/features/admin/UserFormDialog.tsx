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
import { NativeSelect } from "@/components/ui/native-select";
import { listClients } from "@/lib/repo/clients.repo";
import type { Client } from "@/types/client";
import type { Profile } from "@/types/auth";

type UserPayload = Omit<Profile, "id" | "created_at"> & { password?: string };

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UserPayload) => void;
  initialData?: Profile | null;
  /** Pré-sélectionne une entreprise (ex. "Ouvrir un accès" depuis la fiche client). */
  lockedClient?: { id: string; companyName: string } | null;
}

const EMPTY: UserPayload = {
  name: "",
  email: "",
  role: "client",
  clientId: undefined,
  company: "",
  is_active: true,
  password: "",
};

export function UserFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  lockedClient,
}: UserFormDialogProps) {
  const [form, setForm] = useState<UserPayload>(EMPTY);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      setForm({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
        clientId: initialData.clientId,
        company: initialData.company ?? "",
        is_active: initialData.is_active,
        password: "",
      });
    } else if (lockedClient) {
      setForm({ ...EMPTY, role: "client", clientId: lockedClient.id, company: lockedClient.companyName });
    } else {
      setForm(EMPTY);
    }
    listClients()
      .then(setClients)
      .catch(() => setClients([]));
  }, [open, initialData, lockedClient]);

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isClient = form.role === "client";
    const data: UserPayload = {
      ...form,
      clientId: isClient ? form.clientId : undefined,
      company: isClient ? form.company : undefined,
    };
    onSubmit(data);
    onOpenChange(false);
  };

  const isEdit = !!initialData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
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

          <div className="space-y-2">
            <Label>{isEdit ? "Nouveau mot de passe" : "Mot de passe"}</Label>
            <Input
              type="password"
              value={form.password ?? ""}
              onChange={(e) => set("password", e.target.value)}
              placeholder={isEdit ? "Laisser vide pour ne pas changer" : "Min. 6 caractères"}
              required={!isEdit}
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label>Rôle</Label>
            <NativeSelect
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              disabled={!!lockedClient}
            >
              <option value="client">Client</option>
              <option value="admin">Administrateur</option>
            </NativeSelect>
          </div>

          {form.role === "client" && (
            <div className="space-y-2">
              <Label>Entreprise cliente</Label>
              <NativeSelect
                value={form.clientId ?? ""}
                onChange={(e) => {
                  const c = clients.find((x) => x.id === e.target.value);
                  setForm((prev) => ({
                    ...prev,
                    clientId: e.target.value || undefined,
                    company: c?.companyName ?? "",
                  }));
                }}
                disabled={!!lockedClient}
                required
              >
                <option value="">Choisir une entreprise…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName}
                  </option>
                ))}
              </NativeSelect>
              <p className="text-xs text-muted-foreground">
                Le compte donne accès au portail de cette entreprise.
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {isEdit ? "Enregistrer" : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
