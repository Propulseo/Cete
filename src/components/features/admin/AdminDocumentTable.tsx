"use client";

import { Edit, Trash2, FileText, Video, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ClientDocument } from "@/types/document";
import {
  AdminTable,
  AdminThead,
  AdminTh,
  AdminTbody,
  AdminTr,
  AdminTd,
} from "@/components/features/admin/ui/admin-table";
import { AdminEmptyState } from "@/components/features/admin/ui/admin-empty-state";

const categoryLabels: Record<string, string> = {
  newsletters: "Newsletters",
  capsules: "Capsules",
  guides: "Guides",
  carnets: "Carnets",
};

interface AdminDocumentTableProps {
  documents: ClientDocument[];
  onEdit: (doc: ClientDocument) => void;
  onDelete: (id: string) => void;
}

export function AdminDocumentTable({ documents, onEdit, onDelete }: AdminDocumentTableProps) {
  if (documents.length === 0) {
    return <AdminEmptyState icon={FileText} title="Aucun document trouvé" />;
  }

  return (
    <AdminTable>
      <AdminThead>
        <tr>
          <AdminTh>Document</AdminTh>
          <AdminTh>Catégorie</AdminTh>
          <AdminTh>Type</AdminTh>
          <AdminTh>Visibilité</AdminTh>
          <AdminTh>Accès</AdminTh>
          <AdminTh>Date</AdminTh>
          <AdminTh className="text-right">Actions</AdminTh>
        </tr>
      </AdminThead>
      <AdminTbody>
        {documents.map((doc) => (
          <AdminTr key={doc.id}>
            <AdminTd>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  {doc.type === "pdf" ? <FileText className="h-4 w-4" strokeWidth={1.75} /> : <Video className="h-4 w-4" strokeWidth={1.75} />}
                </div>
                <div>
                  <p className="font-medium text-foreground line-clamp-1">{doc.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{doc.description}</p>
                </div>
              </div>
            </AdminTd>
            <AdminTd><Badge variant="secondary">{categoryLabels[doc.category]}</Badge></AdminTd>
            <AdminTd><Badge variant={doc.type === "pdf" ? "outline" : "default"}>{doc.type}</Badge></AdminTd>
            <AdminTd><Badge variant={doc.visibility === "global" ? "default" : "outline"}>{doc.visibility}{doc.assignedClientIds.length ? ` · ${doc.assignedClientIds.join(", ")}` : ""}</Badge></AdminTd>
            <AdminTd>
              {doc.accessType === "download" ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-admin-pos">
                  <Download className="h-3 w-3" strokeWidth={1.75} />
                  Téléchargement
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-admin-urgent">
                  <Eye className="h-3 w-3" strokeWidth={1.75} />
                  Lecture seule
                </span>
              )}
            </AdminTd>
            <AdminTd className="text-sm text-muted-foreground">{doc.uploadDate}</AdminTd>
            <AdminTd className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => onEdit(doc)}>
                  <Edit className="h-4 w-4" strokeWidth={1.75} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(doc.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" strokeWidth={1.75} />
                </Button>
              </div>
            </AdminTd>
          </AdminTr>
        ))}
      </AdminTbody>
    </AdminTable>
  );
}
