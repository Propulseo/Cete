"use client";

import { useState, useEffect, useCallback } from "react";
import { Library, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { Resource } from "@/types/resource";
import { useAuth } from "@/lib/auth-context";
import { getVisibleForClient } from "@/lib/repo/resources.repo";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ResourceCard } from "@/components/sections/resources/ResourceCard";
import { ResourceLibraryFilters } from "@/components/sections/resources/ResourceLibraryFilters";
import { ReferenceSites } from "@/components/sections/resources/ReferenceSites";

export default function ClientResourcesPage() {
  const { user } = useAuth();
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
      const data = await getVisibleForClient(user?.clientId ?? user?.id ?? "");
      setResources(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("states.error"));
    } finally {
      setLoading(false);
    }
  }, [t, user]);

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

  // Les sites de référence / partenaires ont leur propre section ; on les sort
  // de la bibliothèque documentaire (et de ses filtres).
  const partners = resources.filter((r) => r.category === "partenaires");

  const filtered = resources.filter((r) => {
    if (r.category === "partenaires") return false;
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
    <div className="p-4 lg:p-8">
      <PageHeader
        title={t("pages.resourcesTitle")}
        subtitle={t("pages.available", {
          count: filtered.length,
          item: "ressource" + (filtered.length !== 1 ? "s" : ""),
        })}
      />

      <ReferenceSites title={t("resources.partnersTitle")} sites={partners} />

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
        <EmptyState icon={Library} title={t("pages.noResources")} className="mt-4" />
      )}
    </div>
  );
}
