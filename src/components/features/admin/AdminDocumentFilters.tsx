"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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
    <div className="mb-4 flex flex-wrap gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Rechercher..." value={search} onChange={(e) => onSearchChange(e.target.value)} />
      </div>
      <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm" value={filterCat} onChange={(e) => onFilterCatChange(e.target.value)}>
        <option value="">Toutes catégories</option>
        {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm" value={filterVis} onChange={(e) => onFilterVisChange(e.target.value)}>
        <option value="">Toute visibilité</option>
        <option value="global">Global</option>
        <option value="client">Client</option>
      </select>
    </div>
  );
}
