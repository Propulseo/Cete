"use client";

import { Edit, Trash2, FileText, Video, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ClientDocument } from "@/types/document";

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
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-secondary/50">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Document</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Catégorie</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Visibilité</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Accès</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Date</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-secondary/30">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${doc.type === "pdf" ? "bg-red-100 text-red-600" : "bg-purple-100 text-purple-600"}`}>
                    {doc.type === "pdf" ? <FileText className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground line-clamp-1">{doc.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{doc.description}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3"><Badge variant="secondary">{categoryLabels[doc.category]}</Badge></td>
              <td className="px-4 py-3"><Badge variant={doc.type === "pdf" ? "outline" : "default"}>{doc.type}</Badge></td>
              <td className="px-4 py-3"><Badge variant={doc.visibility === "global" ? "default" : "outline"}>{doc.visibility}{doc.clientId ? ` · ${doc.clientId}` : ""}</Badge></td>
              <td className="px-4 py-3">
                {doc.accessType === "download" ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                    <Download className="h-3 w-3" />
                    Téléchargement
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                    <Eye className="h-3 w-3" />
                    Lecture seule
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{doc.uploadDate}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(doc)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(doc.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {documents.length === 0 && (
        <div className="p-8 text-center text-sm text-muted-foreground">Aucun document trouvé</div>
      )}
    </div>
  );
}
