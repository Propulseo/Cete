"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { listClients, createClient, softArchiveClient, deleteClient } from "@/lib/repo/clients.repo";
import { listEvaluations } from "@/lib/repo/evaluations.repo";
import type { Client } from "@/types/client";
import type { Evaluation } from "@/types/client";
import { ClientKpiCards } from "@/components/features/admin/clients/ClientKpiCards";
import { ClientsFilters } from "@/components/features/admin/clients/ClientsFilters";
import { ClientsTable } from "@/components/features/admin/clients/ClientsTable";
import { ClientFormDialog } from "@/components/features/admin/clients/ClientFormDialog";
import { ClientDeleteDialog } from "@/components/features/admin/clients/ClientDeleteDialog";
import { AdminPageHeader } from "@/components/features/admin/ui/admin-page-header";

export default function AdminClientsPage() {
  const t = useTranslations("admin.clients");
  const [clients, setClients] = useState<Client[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([listClients(), listEvaluations()]).then(([c, e]) => {
      if (!cancelled) { setClients(c); setEvaluations(e); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [refreshKey]);

  const reload = () => setRefreshKey((k) => k + 1);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || c.companyName.toLowerCase().includes(q) || c.siret.includes(q) || c.address.city.toLowerCase().includes(q);
      const matchesStatus = !statusFilter || c.status === statusFilter;
      const matchesSector = !sectorFilter || c.sector === sectorFilter;
      return matchesSearch && matchesStatus && matchesSector;
    });
  }, [clients, search, statusFilter, sectorFilter]);

  const evalCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    evaluations.forEach((e) => { counts[e.clientId] = (counts[e.clientId] ?? 0) + 1; });
    return counts;
  }, [evaluations]);

  const activeCount = clients.filter((c) => c.status === "active").length;
  const scheduledEvals = evaluations.filter((e) => e.status === "scheduled").length;
  const inProgressEvals = evaluations.filter((e) => e.status === "in_progress").length;
  const completedEvals = evaluations.filter((e) => e.status === "completed").length;

  const handleCreate = async (data: Omit<Client, "id" | "slug" | "createdAt" | "updatedAt">) => {
    await createClient(data);
    reload();
  };

  const handleArchive = async (id: string) => {
    await softArchiveClient(id);
    reload();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteClient(deleteTarget.id);
    setDeleteTarget(null);
    reload();
  };

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-4 lg:p-8">
      <AdminPageHeader
        title={t("list.title")}
        subtitle={t("list.subtitle")}
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("list.newClient")}
          </Button>
        }
      />


      <ClientKpiCards activeCount={activeCount} scheduledEvals={scheduledEvals} inProgressEvals={inProgressEvals} completedEvals={completedEvals} />
      <ClientsFilters search={search} onSearchChange={setSearch} statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} sectorFilter={sectorFilter} onSectorFilterChange={setSectorFilter} />
      <ClientsTable clients={filtered} evalCounts={evalCounts} onArchive={handleArchive} onDelete={(id) => setDeleteTarget(clients.find((c) => c.id === id) ?? null)} />

      <ClientFormDialog open={createOpen} onOpenChange={setCreateOpen} onSubmit={handleCreate} />
      <ClientDeleteDialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }} clientName={deleteTarget?.companyName ?? ""} onConfirm={handleDelete} />
    </div>
  );
}
