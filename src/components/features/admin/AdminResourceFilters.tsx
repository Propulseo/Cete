"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ResourceCategory, ResourceType } from "@/types/resource";

const categoryLabels: Record<ResourceCategory, string> = {
  normes: "Normes",
  reglementation: "Réglementation",
  guides: "Guides techniques",
  rapports: "Rapports",
  veille: "Veille réglementaire",
};

const typeLabels: Record<ResourceType, string> = {
  pdf: "PDF",
  lien: "Lien",
  video: "Vidéo",
};

interface AdminResourceFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterCat: string;
  onFilterCatChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
}

export function AdminResourceFilters({
  search,
  onSearchChange,
  filterCat,
  onFilterCatChange,
  filterType,
  onFilterTypeChange,
}: AdminResourceFiltersProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Rechercher..." value={search} onChange={(e) => onSearchChange(e.target.value)} />
      </div>
      <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm" value={filterCat} onChange={(e) => onFilterCatChange(e.target.value)}>
        <option value="">Toutes catégories</option>
        {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm" value={filterType} onChange={(e) => onFilterTypeChange(e.target.value)}>
        <option value="">Tous types</option>
        {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
    </div>
  );
}
