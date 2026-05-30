"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Shield, User, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Profile } from "@/types/auth";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/lib/repo/users.repo";
import { UserFormDialog } from "@/components/features/admin/UserFormDialog";
import { AdminPageHeader } from "@/components/features/admin/ui/admin-page-header";
import { AdminEmptyState } from "@/components/features/admin/ui/admin-empty-state";
import {
  AdminTable,
  AdminThead,
  AdminTh,
  AdminTbody,
  AdminTr,
  AdminTd,
} from "@/components/features/admin/ui/admin-table";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Profile | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (data: Omit<Profile, "id" | "created_at"> & { password?: string }) => {
    try {
      const result = await createUser(data);
      setUsers((prev) => [result, ...prev]);
      toast.success("Utilisateur créé");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la création");
    }
  };

  const handleUpdate = async (data: Omit<Profile, "id" | "created_at"> & { password?: string }) => {
    if (!editing) return;
    try {
      const result = await updateUser(editing.id, data);
      if (result) {
        setUsers((prev) => prev.map((u) => (u.id === editing.id ? result : u)));
      }
      toast.success("Utilisateur modifié");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la modification");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce compte ? L'utilisateur perdra l'accès. Action définitive.")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Utilisateur supprimé");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={loadData} variant="outline">Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <AdminPageHeader
        title="Utilisateurs"
        subtitle="Organisations notées et administrateurs de l'agence"
        actions={
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" strokeWidth={1.75} />
            Nouvel utilisateur
          </Button>
        }
      />

      {users.length === 0 ? (
        <AdminEmptyState icon={User} title="Aucun utilisateur" />
      ) : (
        <AdminTable>
          <AdminThead>
            <AdminTr>
              <AdminTh>Utilisateur</AdminTh>
              <AdminTh>Email</AdminTh>
              <AdminTh>Rôle</AdminTh>
              <AdminTh>Entreprise</AdminTh>
              <AdminTh>Créé le</AdminTh>
              <AdminTh className="text-right">Actions</AdminTh>
            </AdminTr>
          </AdminThead>
          <AdminTbody>
            {users.map((u) => (
              <AdminTr key={u.id}>
                <AdminTd>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      {u.role === "admin" ? <Shield className="h-4 w-4" strokeWidth={1.75} /> : <User className="h-4 w-4" strokeWidth={1.75} />}
                    </div>
                    <span className="font-medium">{u.name}</span>
                  </div>
                </AdminTd>
                <AdminTd className="text-sm text-muted-foreground">{u.email}</AdminTd>
                <AdminTd>
                  <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                    {u.role === "admin" ? "Admin" : "Client"}
                  </Badge>
                </AdminTd>
                <AdminTd className="text-sm text-muted-foreground">
                  {u.role === "client" && !u.clientId ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-admin-urgent" title="Ce compte client n'est rattaché à aucune entreprise : il ne verra aucun document ni notation. Rattachez-le via la fiche client (« Ouvrir un accès ») ou en modifiant le compte.">
                      <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.75} />
                      Non rattaché
                    </span>
                  ) : (
                    u.company ?? "-"
                  )}
                </AdminTd>
                <AdminTd className="text-sm text-muted-foreground">{u.created_at ?? "-"}</AdminTd>
                <AdminTd className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(u); setDialogOpen(true); }}>
                      <Edit className="h-4 w-4" strokeWidth={1.75} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" strokeWidth={1.75} />
                    </Button>
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
          </AdminTbody>
        </AdminTable>
      )}

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing}
      />
    </div>
  );
}
