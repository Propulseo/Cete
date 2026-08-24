"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Inbox, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/features/admin/ui/admin-page-header";
import { AdminEmptyState } from "@/components/features/admin/ui/admin-empty-state";
import {
  listContactRequests,
  updateContactRequestStatus,
} from "@/lib/repo/contact-requests.repo";
import type { ContactRequest, ContactRequestStatus } from "@/types/contact-request";
import { ContactRequestTable } from "@/components/features/admin/demandes/ContactRequestTable";
import { ContactRequestDetail } from "@/components/features/admin/demandes/ContactRequestDetail";

type StatusFilter = "all" | ContactRequestStatus;

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "new", label: "Nouvelles" },
  { value: "handled", label: "Traitées" },
  { value: "archived", label: "Archivées" },
];

export default function AdminDemandesPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [selected, setSelected] = useState<ContactRequest | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setRequests(await listContactRequests());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = useCallback(
    async (id: string, status: ContactRequestStatus) => {
      try {
        await updateContactRequestStatus(id, status);
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
        setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
        toast.success("Statut mis à jour");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
      }
    },
    []
  );

  const filtered = useMemo(
    () => (filter === "all" ? requests : requests.filter((r) => r.status === filter)),
    [requests, filter]
  );

  const newCount = useMemo(() => requests.filter((r) => r.status === "new").length, [requests]);

  return (
    <div className="p-4 lg:p-8">
      <AdminPageHeader
        title="Demandes entrantes"
        subtitle="Messages et demandes d'évaluation reçus via le site"
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f.value}
            variant={filter === f.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f.value)}
          >
            {f.label}
            {f.value === "new" && newCount > 0 && (
              <span className="ml-2 tabular-nums opacity-80">{newCount}</span>
            )}
          </Button>
        ))}
      </div>

      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin text-primary" strokeWidth={1.75} />
      ) : filtered.length === 0 ? (
        <AdminEmptyState
          icon={Inbox}
          title="Aucune demande"
          description={
            filter === "all"
              ? "Les messages envoyés depuis les formulaires du site apparaîtront ici."
              : "Aucune demande dans ce filtre."
          }
        />
      ) : (
        <ContactRequestTable requests={filtered} onSelect={setSelected} />
      )}

      <ContactRequestDetail
        request={selected}
        open={selected !== null}
        onOpenChange={(o) => !o && setSelected(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
