"use client";

import { useState, useEffect, useCallback } from "react";
import { Building2, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/features/admin/ui/admin-page-header";
import { AdminEmptyState } from "@/components/features/admin/ui/admin-empty-state";
import {
  listOrganizations,
  createOrganization,
  deleteOrganization,
  type Organization,
} from "@/lib/repo/organizations.repo";

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [newOrg, setNewOrg] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setOrganizations(await listOrganizations());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    const trimmed = newOrg.trim().toUpperCase();
    if (!trimmed) return;
    if (organizations.some((o) => o.name === trimmed)) {
      toast.error("Cette organisation existe déjà");
      return;
    }
    try {
      const created = await createOrganization(trimmed);
      setOrganizations((prev) => [...prev, created]);
      setNewOrg("");
      toast.success("Organisation ajoutée");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'ajout");
    }
  };

  const handleRemove = async (org: Organization) => {
    if (!window.confirm(`Supprimer « ${org.name} » ? Cette action est définitive.`)) return;
    try {
      await deleteOrganization(org.id);
      setOrganizations((prev) => prev.filter((o) => o.id !== org.id));
      toast.success("Organisation supprimée");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <AdminPageHeader
        title="Organisations évaluées"
        subtitle="Gérez la liste des organisations affichées sur le site"
      />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Ajouter une organisation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Nom de l'organisation..."
              value={newOrg}
              onChange={(e) => setNewOrg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="sm:max-w-md"
            />
            <Button onClick={handleAdd} className="bg-primary shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Liste des organisations</CardTitle>
          <Badge variant="secondary" className="shrink-0 tabular-nums">{organizations.length}</Badge>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" strokeWidth={1.75} />
          ) : organizations.length === 0 ? (
            <AdminEmptyState
              icon={Building2}
              title="Aucune organisation"
              description="Ajoutez une organisation pour qu'elle apparaisse sur le site."
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between rounded-xl border border-[var(--admin-line)] bg-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" strokeWidth={1.75} />
                    <span className="font-medium text-sm text-foreground">{org.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Retirer ${org.name}`}
                    onClick={() => handleRemove(org)}
                    className="shrink-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
