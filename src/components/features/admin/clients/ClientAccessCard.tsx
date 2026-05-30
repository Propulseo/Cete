"use client";

import { useState, useEffect, useCallback } from "react";
import { KeyRound, UserPlus, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserFormDialog } from "@/components/features/admin/UserFormDialog";
import { listUsers, createUser, updateUser } from "@/lib/repo/users.repo";
import type { Profile } from "@/types/auth";

interface ClientAccessCardProps {
  clientId: string;
  companyName: string;
}

/**
 * Pont fiche entreprise → compte de connexion (profiles.client_id). Permet d'ouvrir
 * un accès email/mot de passe rattaché au client, ou de redéfinir son mot de passe.
 */
export function ClientAccessCard({ clientId, companyName }: ClientAccessCardProps) {
  const [account, setAccount] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const users = await listUsers();
      setAccount(users.find((u) => u.clientId === clientId) ?? null);
    } catch {
      setAccount(null);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (data: Omit<Profile, "id" | "created_at"> & { password?: string }) => {
    try {
      if (editing && account) {
        const updated = await updateUser(account.id, data);
        if (updated) setAccount(updated);
        toast.success("Accès mis à jour");
      } else {
        const created = await createUser(data);
        setAccount(created);
        toast.success("Accès client créé");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de l'opération");
    }
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <KeyRound className="h-4 w-4" strokeWidth={1.75} />
          Accès au portail client
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" strokeWidth={1.75} />
        ) : account ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" strokeWidth={2} />
                  Accès actif
                </Badge>
                {!account.is_active && <Badge variant="outline">Désactivé</Badge>}
              </div>
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
                {account.email}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => { setEditing(true); setDialogOpen(true); }}>
              <KeyRound className="mr-2 h-4 w-4" strokeWidth={1.75} />
              Modifier / réinitialiser le mot de passe
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Aucun compte de connexion n&apos;est encore rattaché à cette entreprise.
            </p>
            <Button size="sm" onClick={() => { setEditing(false); setDialogOpen(true); }}>
              <UserPlus className="mr-2 h-4 w-4" strokeWidth={1.75} />
              Ouvrir un accès
            </Button>
          </div>
        )}
      </CardContent>

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        initialData={editing ? account : null}
        lockedClient={editing ? null : { id: clientId, companyName }}
      />
    </Card>
  );
}
