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
import { RecordCard, RecordCardList } from "@/components/shared/record-card";
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

  const openDoc = async (doc: ClientDocument) => {
    if (doc.accessType !== "download") {
      if (!openSecureViewer({ title: doc.title, bucket: "client-documents", path: doc.storagePath, src: doc.url })) {
        toast.error(t("popupError"));
      }
      return;
    }
    const url = await resolveDocUrl(doc);
    if (!url) {
      toast.error("Fichier indisponible");
      return;
    }
    window.open(url, "_blank", "noopener");
  };

  // Le bouton d'action porte son libellé en toutes lettres : sur mobile il occupe toute
  // la largeur du pied de fiche, c'est l'action principale de la ligne.
  const docAction = (doc: ClientDocument, fullWidth?: boolean) => {
    const canDownload = doc.accessType === "download";
    return (
      <Button size="sm" variant="outline" className={fullWidth ? "w-full" : undefined} onClick={() => openDoc(doc)}>
        {canDownload ? <Download className="mr-2 size-4" /> : <Eye className="mr-2 size-4" />}
        {canDownload ? t("downloadBtn") : t("viewBtn")}
      </Button>
    );
  };

  const rightsMark = (doc: ClientDocument) =>
    doc.accessType === "download" ? (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-admin-pos">
        <Download className="size-3" strokeWidth={1.75} />
        {t("downloadAccess")}
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-admin-urgent">
        <Lock className="size-3" strokeWidth={1.75} />
        {t("viewOnly")}
      </span>
    );

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(dateLocale, { day: "numeric", month: "short", year: "numeric" });

  return (
    <>
    <div className="hidden lg:block">
    <DataTable>
      <DataThead>
        <tr>
          <DataTh>{t("headerDocument")}</DataTh>
          <DataTh>{t("headerType")}</DataTh>
          <DataTh>{t("headerSize")}</DataTh>
          <DataTh>{t("headerDate")}</DataTh>
          <DataTh>{t("headerRights")}</DataTh>
          <DataTh className="text-right">{t("headerAction")}</DataTh>
        </tr>
      </DataThead>
      <DataTbody>
        {documents.map((doc) => {
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
              <DataTd className="text-sm tabular-nums text-muted-foreground">{doc.fileSize ?? "-"}</DataTd>
              <DataTd className="text-sm tabular-nums text-muted-foreground">{fmtDate(doc.uploadDate)}</DataTd>
              <DataTd>{rightsMark(doc)}</DataTd>
              <DataTd className="text-right">{docAction(doc)}</DataTd>
            </DataTr>
          );
        })}
      </DataTbody>
    </DataTable>
    </div>

    <RecordCardList className="lg:hidden">
      {documents.map((doc) => {
        const Icon = doc.type === "video" ? Video : FileText;
        return (
          <RecordCard
            key={doc.id}
            icon={
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="size-4" strokeWidth={1.75} />
              </div>
            }
            title={doc.title}
            subtitle={doc.description}
            badges={
              <>
                <Badge variant="outline">{doc.type}</Badge>
                {rightsMark(doc)}
              </>
            }
            fields={[
              { label: t("headerDate"), value: <span className="tabular-nums">{fmtDate(doc.uploadDate)}</span> },
              { label: t("headerSize"), value: <span className="tabular-nums">{doc.fileSize ?? "-"}</span> },
            ]}
            actions={docAction(doc, true)}
          />
        );
      })}
    </RecordCardList>
    </>
  );
}
