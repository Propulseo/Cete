"use client";

import { Edit, Trash2, FileText, Video, ExternalLink, Download, Eye, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminEmptyState } from "@/components/features/admin/ui/admin-empty-state";
import {
  DataTable,
  DataThead,
  DataTh,
  DataTbody,
  DataTr,
  DataTd,
} from "@/components/shared/data-table";
import { RecordCard, RecordCardList } from "@/components/shared/record-card";
import type { Resource, ResourceCategory, ResourceType } from "@/types/resource";

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
  if (resources.length === 0) {
    return <AdminEmptyState icon={Library} title="Aucune ressource trouvée" />;
  }

  const accessBadge = (res: Resource) => (
    <Badge variant="outline" className="gap-1">
      {res.accessType === "download" ? (
        <><Download className="h-3 w-3" strokeWidth={1.75} /> Téléchargement</>
      ) : (
        <><Eye className="h-3 w-3" strokeWidth={1.75} /> Consultation</>
      )}
    </Badge>
  );

  const rowActions = (res: Resource) => (
    <>
      <Button variant="ghost" size="icon" onClick={() => onEdit(res)} aria-label={`Modifier ${res.title}`}>
        <Edit className="h-4 w-4" strokeWidth={1.75} />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onDelete(res.id)} aria-label={`Supprimer ${res.title}`}>
        <Trash2 className="h-4 w-4 text-destructive" strokeWidth={1.75} />
      </Button>
    </>
  );

  return (
    <>
      <div className="hidden lg:block">
        <DataTable>
          <DataThead>
            <tr>
              <DataTh>Ressource</DataTh>
              <DataTh>Catégorie</DataTh>
              <DataTh>Type</DataTh>
              <DataTh>Accès</DataTh>
              <DataTh>Date</DataTh>
              <DataTh className="text-right">Actions</DataTh>
            </tr>
          </DataThead>
          <DataTbody>
            {resources.map((res) => {
              const Icon = typeConfig[res.type].icon;
              return (
                <DataTr key={res.id}>
                  <DataTd>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground line-clamp-1">{res.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {res.description}{res.source ? ` - ${res.source}` : ""}
                        </p>
                      </div>
                    </div>
                  </DataTd>
                  <DataTd><Badge variant="secondary">{categoryLabels[res.category]}</Badge></DataTd>
                  <DataTd>
                    <Badge variant="secondary" className="gap-1">
                      <Icon className="h-3 w-3" strokeWidth={1.75} />
                      {typeLabels[res.type]}
                    </Badge>
                  </DataTd>
                  <DataTd>{accessBadge(res)}</DataTd>
                  <DataTd className="text-sm tabular-nums text-muted-foreground">{res.publishedDate}</DataTd>
                  <DataTd className="text-right">
                    <div className="flex items-center justify-end gap-1">{rowActions(res)}</div>
                  </DataTd>
                </DataTr>
              );
            })}
          </DataTbody>
        </DataTable>
      </div>

      <RecordCardList className="lg:hidden">
        {resources.map((res) => {
          const Icon = typeConfig[res.type].icon;
          return (
            <RecordCard
              key={res.id}
              icon={
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-4" strokeWidth={1.75} />
                </div>
              }
              title={res.title}
              subtitle={`${res.description}${res.source ? ` — ${res.source}` : ""}`}
              badges={
                <>
                  <Badge variant="secondary">{categoryLabels[res.category]}</Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Icon className="h-3 w-3" strokeWidth={1.75} />
                    {typeLabels[res.type]}
                  </Badge>
                  {accessBadge(res)}
                </>
              }
              fields={[{ label: "Publié le", value: <span className="tabular-nums">{res.publishedDate}</span> }]}
              actions={rowActions(res)}
            />
          );
        })}
      </RecordCardList>
    </>
  );
}
