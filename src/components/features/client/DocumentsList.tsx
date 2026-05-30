"use client";

import { useCallback } from "react";
import { Download, FileText, Video, Eye, Lock } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  DataTable,
  DataThead,
  DataTh,
  DataTbody,
  DataTr,
  DataTd,
} from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { getSignedUrl } from "@/lib/supabase/storage";
import type { ClientDocument } from "@/types/document";

interface DocumentsListProps {
  documents: ClientDocument[];
}

/** Résout l'URL téléchargeable : objet Storage (URL signée) sinon `url` legacy. */
async function resolveDocUrl(doc: ClientDocument): Promise<string | null> {
  if (doc.storagePath) {
    try {
      return await getSignedUrl("client-documents", doc.storagePath);
    } catch {
      return null;
    }
  }
  return doc.url ?? null;
}

function ViewOnlyViewer({ doc, viewBtnLabel, viewOnlyTitle, popupError }: { doc: ClientDocument; viewBtnLabel: string; viewOnlyTitle: string; popupError: string }) {
  const handleView = useCallback(async () => {
    const url = await resolveDocUrl(doc);
    if (!url) {
      toast.error("Fichier indisponible");
      return;
    }
    const viewer = window.open("", "_blank", "noopener,noreferrer");
    if (!viewer) {
      toast.error(popupError);
      return;
    }
    viewer.document.write(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <title>${doc.title} - ${viewOnlyTitle}</title>
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
    <span class="badge">${viewOnlyTitle}</span>
  </div>
  <iframe src="${url}#toolbar=0&navpanes=0" title="${doc.title}"></iframe>
</body>
</html>`);
    viewer.document.close();
  }, [doc, viewOnlyTitle, popupError]);

  return (
    <Button size="sm" variant="outline" onClick={handleView}>
      <Eye className="mr-2 h-4 w-4" />
      {viewBtnLabel}
    </Button>
  );
}

export function DocumentsList({ documents }: DocumentsListProps) {
  const t = useTranslations("client.documents");
  const locale = useLocale();
  const dateLocale = locale === "fr" ? "fr-FR" : "en-GB";

  if (documents.length === 0) {
    return <EmptyState icon={FileText} title={t("empty")} />;
  }

  return (
    <DataTable>
      <DataThead>
        <tr>
          <DataTh>{t("headerDocument")}</DataTh>
          <DataTh>{t("headerType")}</DataTh>
          <DataTh className="hidden lg:table-cell">{t("headerSize")}</DataTh>
          <DataTh>{t("headerDate")}</DataTh>
          <DataTh className="hidden lg:table-cell">{t("headerRights")}</DataTh>
          <DataTh className="text-right">{t("headerAction")}</DataTh>
        </tr>
      </DataThead>
      <DataTbody>
        {documents.map((doc) => {
          const canDownload = doc.accessType === "download";
          const Icon = doc.type === "video" ? Video : FileText;

          return (
            <DataTr key={doc.id}>
              <DataTd>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="size-4" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground line-clamp-1">{doc.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{doc.description}</p>
                  </div>
                </div>
              </DataTd>
              <DataTd>
                <Badge variant="outline">{doc.type}</Badge>
              </DataTd>
              <DataTd className="hidden lg:table-cell text-sm text-muted-foreground">
                {doc.fileSize ?? "-"}
              </DataTd>
              <DataTd className="text-sm tabular-nums text-muted-foreground">
                {new Date(doc.uploadDate).toLocaleDateString(dateLocale, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </DataTd>
              <DataTd className="hidden lg:table-cell">
                {canDownload ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-admin-pos">
                    <Download className="size-3" strokeWidth={1.75} />
                    {t("downloadAccess")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-admin-urgent">
                    <Lock className="size-3" strokeWidth={1.75} />
                    {t("viewOnly")}
                  </span>
                )}
              </DataTd>
              <DataTd className="text-right">
                {canDownload ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      const url = await resolveDocUrl(doc);
                      if (!url) {
                        toast.error("Fichier indisponible");
                        return;
                      }
                      window.open(url, "_blank", "noopener");
                    }}
                  >
                    <Download className="mr-2 size-4" />
                    {t("downloadBtn")}
                  </Button>
                ) : (
                  <ViewOnlyViewer
                    doc={doc}
                    viewBtnLabel={t("viewBtn")}
                    viewOnlyTitle={t("viewOnlyTitle")}
                    popupError={t("popupError")}
                  />
                )}
              </DataTd>
            </DataTr>
          );
        })}
      </DataTbody>
    </DataTable>
  );
}
