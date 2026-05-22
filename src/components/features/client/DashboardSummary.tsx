"use client";

import Link from "next/link";
import {
  FileText,
  Video,
  BookOpen,
  ClipboardList,
  Download,
  Play,
  ArrowRight,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ClientDocument } from "@/types/document";

const categoryMeta: Record<
  string,
  { icon: React.ReactNode; color: string; href: string; key: string }
> = {
  newsletters: {
    icon: <FileText className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-600",
    href: "/client/newsletters",
    key: "newsletters",
  },
  capsules: {
    icon: <Video className="h-5 w-5" />,
    color: "bg-purple-100 text-purple-600",
    href: "/client/capsules",
    key: "capsules",
  },
  guides: {
    icon: <BookOpen className="h-5 w-5" />,
    color: "bg-green-100 text-green-600",
    href: "/client/guides",
    key: "guides",
  },
  carnets: {
    icon: <ClipboardList className="h-5 w-5" />,
    color: "bg-orange-100 text-orange-600",
    href: "/client/carnets",
    key: "carnets",
  },
};

interface DashboardSummaryProps {
  documents: ClientDocument[];
}

function handleDocAction(doc: ClientDocument) {
  if (doc.type === "video" && doc.youtubeId) {
    window.open(`https://www.youtube.com/watch?v=${doc.youtubeId}`, "_blank");
  } else if (doc.url) {
    window.open(doc.url, "_blank");
  }
}

export function DashboardSummary({ documents }: DashboardSummaryProps) {
  const t = useTranslations("client");
  const locale = useLocale();

  const countByCategory = documents.reduce(
    (acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const recentDocs = [...documents]
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(categoryMeta).map(([key, config]) => (
          <Link key={key} href={config.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${config.color}`}>
                    {config.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{countByCategory[key] || 0}</div>
                    <p className="text-sm text-muted-foreground">
                      {t(`categories.${config.key}` as Parameters<typeof t>[0])}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Documents */}
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg">{t("dashboard.recentPublications")}</CardTitle>
          <Badge variant="secondary">{t("dashboard.totalCount", { count: documents.length })}</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {recentDocs.map((doc) => {
              const config = categoryMeta[doc.category];
              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-secondary/30"
                >
                  <div className={`rounded-lg p-2 ${config?.color}`}>
                    {doc.type === "video" ? (
                      <Video className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate font-medium text-foreground">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {config ? t(`categories.${config.key}` as Parameters<typeof t>[0]) : ""} · {doc.type === "pdf" ? doc.fileSize : doc.duration}
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-xs text-muted-foreground">
                    {new Date(doc.uploadDate).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => handleDocAction(doc)}>
                    {doc.type === "video" ? (
                      <Play className="h-4 w-4" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
          <div className="border-t p-4 text-center">
            <Button variant="link" size="sm" asChild>
              <Link href="/client/newsletters">
                {t("dashboard.viewAll")}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
