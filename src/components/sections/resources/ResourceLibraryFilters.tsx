"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import type { ResourceCategory, ResourceType } from "@/types/resource";

const categoryKeys: Record<ResourceCategory, string> = {
  normes: "categoryNormes",
  reglementation: "categoryReglementation",
  guides: "categoryGuides",
  rapports: "categoryRapports",
  veille: "categoryVeille",
  // 'partenaires' n'apparaît pas dans ce filtre : ces liens ont leur propre section.
  partenaires: "categoryPartenaires",
};

const typeKeys: Record<ResourceType, string> = {
  pdf: "typePdf",
  lien: "typeLien",
  video: "typeVideo",
};

interface ResourceLibraryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterCat: string;
  onFilterCatChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
}

export function ResourceLibraryFilters({
  search,
  onSearchChange,
  filterCat,
  onFilterCatChange,
  filterType,
  onFilterTypeChange,
}: ResourceLibraryFiltersProps) {
  const t = useTranslations("client.resources");

  return (
    <div className="mb-6 grid gap-3 sm:flex sm:flex-wrap">
      <div className="relative sm:flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder={t("search")}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <NativeSelect
        wrapperClassName="sm:w-48"
        value={filterCat}
        onChange={(e) => onFilterCatChange(e.target.value)}
        aria-label={t("allCategories")}
      >
        <option value="">{t("allCategories")}</option>
        {(Object.entries(categoryKeys) as [ResourceCategory, string][])
          .filter(([k]) => k !== "partenaires")
          .map(([k, tKey]) => (
            <option key={k} value={k}>{t(tKey as Parameters<typeof t>[0])}</option>
          ))}
      </NativeSelect>
      <NativeSelect
        wrapperClassName="sm:w-40"
        value={filterType}
        onChange={(e) => onFilterTypeChange(e.target.value)}
        aria-label={t("allTypes")}
      >
        <option value="">{t("allTypes")}</option>
        {(Object.entries(typeKeys) as [ResourceType, string][]).map(([k, tKey]) => (
          <option key={k} value={k}>{t(tKey as Parameters<typeof t>[0])}</option>
        ))}
      </NativeSelect>
    </div>
  );
}
