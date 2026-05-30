"use client";

import { FileText, FolderOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ClientDocument } from "@/types/document";
import type { Article } from "@/types/article";
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardContent } from "./ui/admin-card";
import { AdminEmptyState } from "./ui/admin-empty-state";

interface AdminRecentActivityProps {
  documents: ClientDocument[];
  articles: Article[];
}

export function AdminRecentActivity({ documents, articles }: AdminRecentActivityProps) {
  const recentDocs = documents.slice(0, 4);
  const recentArticles = articles.slice(0, 3);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AdminCard>
        <AdminCardHeader>
          <AdminCardTitle>Derniers documents</AdminCardTitle>
          <Badge variant="outline" className="tabular-nums">
            {documents.length}
          </Badge>
        </AdminCardHeader>
        <AdminCardContent className="py-1">
          {recentDocs.length === 0 ? (
            <AdminEmptyState icon={FolderOpen} title="Aucun document" className="border-0 py-6 shadow-none" />
          ) : (
            <ul className="divide-y divide-[var(--admin-line)]">
              {recentDocs.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.category} · {doc.uploadDate}
                    </p>
                  </div>
                  <Badge variant={doc.visibility === "global" ? "secondary" : "outline"}>
                    {doc.visibility}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </AdminCardContent>
      </AdminCard>

      <AdminCard>
        <AdminCardHeader>
          <AdminCardTitle>Articles récents</AdminCardTitle>
          <Badge variant="outline" className="tabular-nums">
            {articles.length}
          </Badge>
        </AdminCardHeader>
        <AdminCardContent className="py-1">
          {recentArticles.length === 0 ? (
            <AdminEmptyState icon={FileText} title="Aucun article" className="border-0 py-6 shadow-none" />
          ) : (
            <ul className="divide-y divide-[var(--admin-line)]">
              {recentArticles.map((article) => (
                <li key={article.id} className="flex items-start justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{article.title}</p>
                    <p className="text-xs text-muted-foreground">Par {article.author}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium",
                      article.status === "published" ? "text-admin-pos" : "text-admin-urgent",
                    )}
                  >
                    <span className="size-1.5 rounded-full bg-current" />
                    {article.status === "published" ? "Publié" : "Brouillon"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AdminCardContent>
      </AdminCard>
    </div>
  );
}
