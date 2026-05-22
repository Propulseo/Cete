"use client";

import { useState, useEffect, useCallback } from "react";
import { Library, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { Resource } from "@/types/resource";
import { listResources } from "@/lib/repo/resources.repo";
import { ResourceCard } from "@/components/sections/resources/ResourceCard";
import { ResourceLibraryFilters } from "@/components/sections/resources/ResourceLibraryFilters";

export default function ClientResourcesPage() {
  const t = useTranslations("client");
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterType, setFilterType] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listResources();
      setResources(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("states.error"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
        <Button onClick={loadData} variant="outline">{t("states.retry")}</Button>
      </div>
    );
  }

  const filtered = resources.filter((r) => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q))
        return false;
    }
    if (filterCat && r.category !== filterCat) return false;
    if (filterType && r.type !== filterType) return false;
    return true;
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Library className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("pages.resourcesTitle")}
        </h1>
        <p className="text-muted-foreground">
          {t("pages.available", { count: filtered.length, item: "ressource" + (filtered.length !== 1 ? "s" : "") })}
        </p>
      </div>

      <ResourceLibraryFilters
        search={search}
        onSearchChange={setSearch}
        filterCat={filterCat}
        onFilterCatChange={setFilterCat}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
      />

      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((res) => (
            <ResourceCard key={res.id} res={res} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
          <Library className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">{t("pages.noResources")}</p>
        </div>
      )}
    </div>
  );
}
