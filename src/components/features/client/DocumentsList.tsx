"use client";

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
import { openSecureViewer } from "@/lib/secure-viewer";
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      const url = await resolveDocUrl(doc);
                      if (!url) {
                        toast.error("Fichier indisponible");
                        return;
                      }
                      if (!openSecureViewer(url, { title: doc.title, badge: t("viewOnlyTitle") })) {
                        toast.error(t("popupError"));
                      }
                    }}
                  >
                    <Eye className="mr-2 size-4" />
                    {t("viewBtn")}
                  </Button>
                )}
              </DataTd>
            </DataTr>
          );
        })}
      </DataTbody>
    </DataTable>
  );
}
