"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import type { ClientStatus, ClientSector } from "@/types/client";

interface ClientsFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  sectorFilter: string;
  onSectorFilterChange: (v: string) => void;
}

const STATUSES: ClientStatus[] = ["active", "onboarding", "paused", "archived"];
const SECTORS: ClientSector[] = ["industrie", "tertiaire", "logistique", "medical", "erp_collectif", "immobilier", "autre"];

export function ClientsFilters({
  search, onSearchChange, statusFilter, onStatusFilterChange, sectorFilter, onSectorFilterChange,
}: ClientsFiltersProps) {
  const t = useTranslations("admin.clients");

  return (
    <div className="mb-4 flex flex-wrap gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder={t("list.search")} value={search} onChange={(e) => onSearchChange(e.target.value)} />
      </div>
      <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm" value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)}>
        <option value="">{t("list.allStatuses")}</option>
        {STATUSES.map((s) => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
      </select>
      <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm" value={sectorFilter} onChange={(e) => onSectorFilterChange(e.target.value)}>
        <option value="">{t("list.allSectors")}</option>
        {SECTORS.map((s) => <option key={s} value={s}>{t(`sectors.${s}`)}</option>)}
      </select>
    </div>
  );
}
