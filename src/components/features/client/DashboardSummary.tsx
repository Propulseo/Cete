"use client";

import Link from "next/link";
import {
  FileText,
  Video,
  BookOpen,
  ClipboardList,
  Download,
  Play,
  Eye,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSignedUrl } from "@/lib/supabase/storage";
import { openSecureViewer } from "@/lib/secure-viewer";
import { KpiTile } from "@/components/shared/kpi-tile";
import {
  SurfaceCard,
  SurfaceCardHeader,
  SurfaceCardTitle,
  SurfaceCardContent,
} from "@/components/shared/surface-card";
import type { ClientDocument, DocumentCategory } from "@/types/document";

const categoryMeta: Record<DocumentCategory, { icon: LucideIcon; href: string; key: string }> = {
  newsletters: { icon: FileText, href: "/client/newsletters", key: "newsletters" },
  capsules: { icon: Video, href: "/client/capsules", key: "capsules" },
  guides: { icon: BookOpen, href: "/client/guides", key: "guides" },
  carnets: { icon: ClipboardList, href: "/client/carnets", key: "carnets" },
};

interface DashboardSummaryProps {
  documents: ClientDocument[];
}

async function handleDocAction(doc: ClientDocument, viewOnlyTitle: string, popupError: string) {
  if (doc.type === "video" && doc.youtubeId) {
    window.open(`https://www.youtube.com/watch?v=${doc.youtubeId}`, "_blank");
    return;
  }
  const url = doc.storagePath
    ? await getSignedUrl("client-documents", doc.storagePath).catch(() => null)
    : doc.url ?? null;
  if (!url) {
    toast.error("Document indisponible");
    return;
  }
  if (doc.accessType === "download") {
    window.open(url, "_blank", "noopener");
  } else if (!openSecureViewer(url, { title: doc.title, badge: viewOnlyTitle })) {
    toast.error(popupError);
  }
}

export function DashboardSummary({ documents }: DashboardSummaryProps) {
  const t = useTranslations("client");
  const tDoc = useTranslations("client.documents");
  const locale = useLocale();

  const countByCategory = documents.reduce(
    (acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const recentDocs = [...documents]
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Category stats — ledger tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.entries(categoryMeta) as [DocumentCategory, (typeof categoryMeta)[DocumentCategory]][]).map(
          ([key, config]) => (
            <Link key={key} href={config.href} className="block transition-transform hover:-translate-y-0.5">
              <KpiTile
                label={t(`categories.${config.key}` as Parameters<typeof t>[0])}
                value={countByCategory[key] || 0}
                icon={config.icon}
              />
            </Link>
          ),
        )}
      </div>

      {/* Recent publications */}
      <SurfaceCard>
        <SurfaceCardHeader>
          <SurfaceCardTitle>{t("dashboard.recentPublications")}</SurfaceCardTitle>
          <Badge variant="secondary" className="tabular-nums">
            {t("dashboard.totalCount", { count: documents.length })}
          </Badge>
        </SurfaceCardHeader>
        <SurfaceCardContent className="p-0">
          <ul className="divide-y divide-[var(--admin-line)]">
            {recentDocs.map((doc) => {
              const config = categoryMeta[doc.category];
              const Icon = doc.type === "video" ? Video : FileText;
              return (
                <li
                  key={doc.id}
                  className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-[var(--admin-sidebar-hover)]"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="size-4" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {config ? t(`categories.${config.key}` as Parameters<typeof t>[0]) : ""} ·{" "}
                      {doc.type === "pdf" ? doc.fileSize : doc.duration}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {new Date(doc.uploadDate).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDocAction(doc, tDoc("viewOnlyTitle"), tDoc("popupError"))}
                  >
                    {doc.type === "video" ? (
                      <Play className="size-4" />
                    ) : doc.accessType === "download" ? (
                      <Download className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-[var(--admin-line)] p-3 text-center">
            <Button variant="link" size="sm" asChild>
              <Link href="/client/newsletters">
                {t("dashboard.viewAll")}
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </SurfaceCardContent>
      </SurfaceCard>
    </div>
  );
}
