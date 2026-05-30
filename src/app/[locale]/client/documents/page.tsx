"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, FileText, FileSignature, FileCheck2, Loader2, Eye, Lock } from "lucide-react";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { getClientContractDocuments } from "@/lib/repo/contract-documents.repo";
import { getSignedUrl } from "@/lib/supabase/storage";
import { openSecureViewer } from "@/lib/secure-viewer";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import {
  DataTable,
  DataThead,
  DataTh,
  DataTbody,
  DataTr,
  DataTd,
} from "@/components/shared/data-table";
import type { ContractDocument, ContractDocumentType } from "@/types/client";

const TYPE_ICON: Record<ContractDocumentType, typeof FileText> = {
  report: FileText,
  contract: FileSignature,
  addendum: FileCheck2,
  offer: FileText,
  quote: FileText,
  resource: FileText,
  other: FileText,
};

function fmtSize(bytes: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / 1048576).toFixed(1)} Mo`;
}

export default function ClientDocumentsPage() {
  const { user } = useAuth();
  const t = useTranslations("client.myDocuments");
  const tStates = useTranslations("client.states");
  const locale = useLocale();
  const dateLocale = locale === "fr" ? "fr-FR" : "en-GB";
  const [docs, setDocs] = useState<ContractDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      setDocs(await getClientContractDocuments());
    } catch (err) {
      setError(err instanceof Error ? err.message : tStates("error"));
    } finally {
      setLoading(false);
    }
  }, [user, tStates]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 'view-only' restreint à la consultation ; tout autre cas (download / hérité) reste téléchargeable.
  const canDownload = (d: ContractDocument) => d.accessType !== "view-only";

  const handleDownload = async (d: ContractDocument) => {
    if (!d.storagePath) {
      toast.error(t("fileUnavailable"));
      return;
    }
    try {
      const url = await getSignedUrl("contract-documents", d.storagePath);
      window.open(url, "_blank", "noopener");
    } catch {
      toast.error(t("fileUnavailable"));
    }
  };

  const handleView = async (d: ContractDocument) => {
    if (!d.storagePath) {
      toast.error(t("fileUnavailable"));
      return;
    }
    try {
      const url = await getSignedUrl("contract-documents", d.storagePath);
      if (!openSecureViewer(url, { title: d.title, badge: t("viewOnly") })) {
        toast.error(t("popupError"));
      }
    } catch {
      toast.error(t("fileUnavailable"));
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={loadData} variant="outline">{tStates("retry")}</Button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <PageHeader
        title={t("heading")}
        subtitle={t("subtitle")}
      />

      {docs.length === 0 ? (
        <EmptyState icon={FileText} title={t("empty")} description={t("emptyDescription")} />
      ) : (
        <DataTable>
          <DataThead>
            <tr>
              <DataTh>{t("colDocument")}</DataTh>
              <DataTh>{t("colType")}</DataTh>
              <DataTh className="hidden lg:table-cell">{t("colDate")}</DataTh>
              <DataTh className="hidden lg:table-cell">{t("colSize")}</DataTh>
              <DataTh className="text-right">{t("colAction")}</DataTh>
            </tr>
          </DataThead>
          <DataTbody>
            {docs.map((d) => {
              const Icon = TYPE_ICON[d.type] ?? FileText;
              return (
                <DataTr key={d.id}>
                  <DataTd>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Icon className="size-4" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground line-clamp-1">{d.title}</p>
                        {d.notes && <p className="text-xs text-muted-foreground line-clamp-1">{d.notes}</p>}
                        {!canDownload(d) && (
                          <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-admin-urgent">
                            <Lock className="size-3" strokeWidth={1.75} />
                            {t("viewOnly")}
                          </span>
                        )}
                      </div>
                    </div>
                  </DataTd>
                  <DataTd>
                    <Badge variant="outline">{t(`types.${d.type}`)}</Badge>
                  </DataTd>
                  <DataTd className="hidden lg:table-cell text-sm tabular-nums text-muted-foreground">
                    {new Date(d.uploadedAt).toLocaleDateString(dateLocale, { day: "numeric", month: "short", year: "numeric" })}
                  </DataTd>
                  <DataTd className="hidden lg:table-cell text-sm text-muted-foreground">
                    {fmtSize(d.fileSize)}
                  </DataTd>
                  <DataTd className="text-right">
                    {canDownload(d) ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(d)}
                        disabled={!d.storagePath}
                      >
                        <Download className="mr-2 size-4" />
                        {t("download")}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(d)}
                        disabled={!d.storagePath}
                        title={t("viewOnly")}
                      >
                        <Eye className="mr-2 size-4" />
                        {t("view")}
                      </Button>
                    )}
                  </DataTd>
                </DataTr>
              );
            })}
          </DataTbody>
        </DataTable>
      )}
    </div>
  );
}
