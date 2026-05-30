"use client";

import { useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SurfaceCard,
  SurfaceCardHeader,
  SurfaceCardTitle,
  SurfaceCardContent,
} from "@/components/shared/surface-card";
import { createClient } from "@/lib/supabase/client";

/**
 * Changement de mot de passe en self-service (compte courant via `auth.updateUser`).
 * Le changement d'email est géré par l'admin (Admin API, immédiat) pour éviter le
 * flux de confirmation par email non configuré.
 */
export function AccountSettingsCard() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Le mot de passe doit faire au moins 6 caractères");
      return;
    }
    if (password !== confirm) {
      toast.error("Les deux mots de passe ne correspondent pas");
      return;
    }
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPassword("");
      setConfirm("");
      toast.success("Mot de passe mis à jour");
    } catch {
      toast.error("Échec de la mise à jour du mot de passe");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SurfaceCard className="mt-6">
      <SurfaceCardHeader>
        <SurfaceCardTitle>Sécurité du compte</SurfaceCardTitle>
      </SurfaceCardHeader>
      <SurfaceCardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 sm:items-end">
          <div className="space-y-2">
            <Label>Nouveau mot de passe</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 caractères"
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label>Confirmer</Label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={saving || !password}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" strokeWidth={1.75} /> : <KeyRound className="mr-2 h-4 w-4" strokeWidth={1.75} />}
              Changer le mot de passe
            </Button>
          </div>
        </form>
      </SurfaceCardContent>
    </SurfaceCard>
  );
}
