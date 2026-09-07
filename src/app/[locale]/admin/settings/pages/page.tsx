"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/features/admin/ui/admin-page-header";
import { PageContentForm } from "@/components/features/admin/page-content/PageContentForm";
import { PAGE_KEYS, PAGE_LABELS } from "@/lib/page-content";
import { cn } from "@/lib/utils";

export default function AdminPagesContentPage() {
  const [pageKey, setPageKey] = useState(PAGE_KEYS[0]);

  return (
    <div className="p-4 lg:p-8">
      <AdminPageHeader
        title="Contenu des pages"
        subtitle="Modifiez le texte et les images du site public. Un champ vide affiche le texte par défaut."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {PAGE_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setPageKey(key)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              key === pageKey
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-accent",
            )}
          >
            {PAGE_LABELS[key]}
          </button>
        ))}
      </div>

      <PageContentForm pageKey={pageKey} />
    </div>
  );
}
