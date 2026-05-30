"use client";

import { Edit, Trash2, FileText, Video, ExternalLink, Download, Eye, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminEmptyState } from "@/components/features/admin/ui/admin-empty-state";
import type { Resource, ResourceCategory, ResourceType } from "@/types/resource";

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

const typeConfig: Record<ResourceType, { icon: typeof FileText }> = {
  pdf: { icon: FileText },
  lien: { icon: ExternalLink },
  video: { icon: Video },
};

interface AdminResourceTableProps {
  resources: Resource[];
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
}

export function AdminResourceTable({ resources, onEdit, onDelete }: AdminResourceTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-secondary/50">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Ressource</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Catégorie</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Accès</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Date</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {resources.map((res) => {
            const cfg = typeConfig[res.type];
            const Icon = cfg.icon;
            return (
              <tr key={res.id} className="hover:bg-secondary/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground line-clamp-1">{res.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {res.description}{res.source ? ` - ${res.source}` : ""}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge variant="secondary">{categoryLabels[res.category]}</Badge></td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className="gap-1">
                    <Icon className="h-3 w-3" strokeWidth={1.75} />
                    {typeLabels[res.type]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="gap-1">
                    {res.accessType === "download" ? (
                      <><Download className="h-3 w-3" strokeWidth={1.75} /> Téléchargement</>
                    ) : (
                      <><Eye className="h-3 w-3" strokeWidth={1.75} /> Consultation</>
                    )}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{res.publishedDate}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(res)}>
                      <Edit className="h-4 w-4" strokeWidth={1.75} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(res.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" strokeWidth={1.75} />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {resources.length === 0 && (
        <AdminEmptyState
          icon={Library}
          title="Aucune ressource trouvée"
          className="rounded-none border-0 bg-transparent"
        />
      )}
    </div>
  );
}
