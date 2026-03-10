import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ClientDocument } from "@/types/document";

interface DocumentsListProps {
  documents: ClientDocument[];
}

export function DocumentsList({ documents }: DocumentsListProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-white p-12 text-center">
        <FileText className="mb-3 h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Aucun document disponible</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-secondary/50">
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              Document
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              Taille
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase text-muted-foreground">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {documents.map((doc) => (
            <tr key={doc.id} className="transition-colors hover:bg-secondary/30">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{doc.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {doc.description}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge variant="outline">{doc.type}</Badge>
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {doc.fileSize ?? "—"}
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {new Date(doc.uploadDate).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-6 py-4 text-right">
                <Button size="sm" variant="outline" asChild>
                  <a href={doc.url ?? "#"} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </a>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
