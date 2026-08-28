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
import { RecordCard, RecordCardList } from "@/components/shared/record-card";

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

  const userIcon = (u: Profile) => (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
      {u.role === "admin" ? <Shield className="h-4 w-4" strokeWidth={1.75} /> : <User className="h-4 w-4" strokeWidth={1.75} />}
    </div>
  );

  // Un compte client sans clientId ne verra rien dans son portail. L'explication était
  // portée par un attribut `title` — donc invisible au doigt : elle est désormais rendue
  // en texte, replié sur une ligne au-delà de `lg` où la colonne est étroite.
  const companyCell = (u: Profile) =>
    u.role === "client" && !u.clientId ? (
      <span className="inline-flex flex-col gap-0.5">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-admin-urgent">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
          Non rattaché
        </span>
        <span className="text-label leading-snug text-muted-foreground lg:hidden">
          Ce compte ne verra ni document ni notation. Rattachez-le depuis la fiche client
          («&nbsp;Ouvrir un accès&nbsp;») ou en modifiant le compte.
        </span>
      </span>
    ) : (
      (u.company ?? "-")
    );

  const rowActions = (u: Profile) => (
    <>
      <Button variant="ghost" size="icon" onClick={() => { setEditing(u); setDialogOpen(true); }} aria-label={`Modifier ${u.name}`}>
        <Edit className="h-4 w-4" strokeWidth={1.75} />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)} aria-label={`Supprimer ${u.name}`}>
        <Trash2 className="h-4 w-4 text-destructive" strokeWidth={1.75} />
      </Button>
    </>
  );

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
        <>
        <div className="hidden lg:block">
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
                    {userIcon(u)}
                    <span className="font-medium">{u.name}</span>
                  </div>
                </AdminTd>
                <AdminTd className="text-sm text-muted-foreground">{u.email}</AdminTd>
                <AdminTd>
                  <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                    {u.role === "admin" ? "Admin" : "Client"}
                  </Badge>
                </AdminTd>
                <AdminTd className="text-sm text-muted-foreground">{companyCell(u)}</AdminTd>
                <AdminTd className="text-sm tabular-nums text-muted-foreground">{u.created_at ?? "-"}</AdminTd>
                <AdminTd className="text-right">
                  <div className="flex items-center justify-end gap-1">{rowActions(u)}</div>
                </AdminTd>
              </AdminTr>
            ))}
          </AdminTbody>
        </AdminTable>
        </div>

        <RecordCardList className="lg:hidden">
          {users.map((u) => (
            <RecordCard
              key={u.id}
              icon={userIcon(u)}
              title={u.name}
              subtitle={u.email}
              badges={
                <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                  {u.role === "admin" ? "Admin" : "Client"}
                </Badge>
              }
              fields={[
                { label: "Entreprise", value: companyCell(u) },
                { label: "Créé le", value: <span className="tabular-nums">{u.created_at ?? "-"}</span> },
              ]}
              actions={rowActions(u)}
            />
          ))}
        </RecordCardList>
        </>
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
