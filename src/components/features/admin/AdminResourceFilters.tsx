"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import type { ResourceCategory, ResourceType } from "@/types/resource";

const categoryLabels: Record<ResourceCategory, string> = {
  normes: "Normes",
  reglementation: "Réglementation",
  guides: "Guides techniques",
  rapports: "Rapports",
  veille: "Veille réglementaire",
  partenaires: "Partenaires",
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
    <div className="mb-4 grid gap-3 sm:flex sm:flex-wrap">
      <div className="relative sm:flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
        <Input className="pl-9" placeholder="Rechercher..." value={search} onChange={(e) => onSearchChange(e.target.value)} />
      </div>
      <NativeSelect wrapperClassName="sm:w-44" value={filterCat} onChange={(e) => onFilterCatChange(e.target.value)} aria-label="Filtrer par catégorie">
        <option value="">Toutes catégories</option>
        {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </NativeSelect>
      <NativeSelect wrapperClassName="sm:w-40" value={filterType} onChange={(e) => onFilterTypeChange(e.target.value)} aria-label="Filtrer par type">
        <option value="">Tous types</option>
        {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </NativeSelect>
    </div>
  );
}
