"use client";

import { useCallback } from "react";
import { Download, FileText, Eye, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { ClientDocument } from "@/types/document";

interface DocumentsListProps {
  documents: ClientDocument[];
}

function ViewOnlyViewer({ doc }: { doc: ClientDocument }) {
  const handleView = useCallback(() => {
    const url = doc.url ?? "#";
    const viewer = window.open("", "_blank", "noopener,noreferrer");
    if (!viewer) {
      toast.error("Impossible d'ouvrir le document. Autorisez les pop-ups.");
      return;
    }
    // Render a minimal page with an embedded PDF and print/download blocking
    viewer.document.write(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <title>${doc.title} — Lecture seule</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #1A2940; overflow: hidden; }
    .bar { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: #0D5A8A; color: #fff; font-family: system-ui, sans-serif; font-size: 13px; }
    .bar .badge { display: inline-flex; align-items: center; gap: 4px; background: rgba(255,255,255,0.15); padding: 2px 10px; border-radius: 999px; font-size: 11px; }
    iframe { width: 100%; height: calc(100vh - 40px); border: none; }
    @media print { body * { display: none !important; } }
  </style>
  <script>
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's')) {
        e.preventDefault();
      }
    });
    document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
  </script>
</head>
<body>
  <div class="bar">
    <span>${doc.title}</span>
    <span class="badge">Lecture seule</span>
  </div>
  <iframe src="${url}#toolbar=0&navpanes=0" title="${doc.title}"></iframe>
</body>
</html>`);
    viewer.document.close();
  }, [doc]);

  return (
    <Button size="sm" variant="outline" onClick={handleView}>
      <Eye className="mr-2 h-4 w-4" />
      Consulter
    </Button>
  );
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
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              Droits
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase text-muted-foreground">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {documents.map((doc) => {
            const canDownload = doc.accessType === "download";

            return (
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
                <td className="px-6 py-4">
                  {canDownload ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                      <Download className="h-3 w-3" />
                      Téléchargement
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                      <Lock className="h-3 w-3" />
                      Lecture seule
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {canDownload ? (
                    <Button size="sm" variant="outline" asChild>
                      <a href={doc.url ?? "#"} download>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </a>
                    </Button>
                  ) : (
                    <ViewOnlyViewer doc={doc} />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
