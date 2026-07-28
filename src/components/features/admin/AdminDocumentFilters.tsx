"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";

const categoryLabels: Record<string, string> = {
  newsletters: "Newsletters",
  capsules: "Capsules",
  guides: "Guides",
  carnets: "Carnets",
};

interface AdminDocumentFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterCat: string;
  onFilterCatChange: (value: string) => void;
  filterVis: string;
  onFilterVisChange: (value: string) => void;
}

export function AdminDocumentFilters({
  search,
  onSearchChange,
  filterCat,
  onFilterCatChange,
  filterVis,
  onFilterVisChange,
}: AdminDocumentFiltersProps) {
  return (
    <div className="mb-4 grid gap-3 sm:flex sm:flex-wrap">
      <div className="relative sm:flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
        <Input className="pl-9" placeholder="Rechercher..." value={search} onChange={(e) => onSearchChange(e.target.value)} />
      </div>
      <NativeSelect wrapperClassName="sm:w-44" className="bg-card text-foreground" value={filterCat} onChange={(e) => onFilterCatChange(e.target.value)} aria-label="Filtrer par catégorie">
        <option value="">Toutes catégories</option>
        {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </NativeSelect>
      <NativeSelect wrapperClassName="sm:w-44" className="bg-card text-foreground" value={filterVis} onChange={(e) => onFilterVisChange(e.target.value)} aria-label="Filtrer par visibilité">
        <option value="">Toute visibilité</option>
        <option value="global">Global</option>
        <option value="assigned">Assigné</option>
      </NativeSelect>
    </div>
  );
}
