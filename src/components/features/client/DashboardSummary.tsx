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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ClientDocument } from "@/types/document";

const categoryConfig: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; href: string }
> = {
  newsletters: {
    label: "Newsletters",
    icon: <FileText className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-600",
    href: "/client/newsletters",
  },
  capsules: {
    label: "Capsules vidéo",
    icon: <Video className="h-5 w-5" />,
    color: "bg-purple-100 text-purple-600",
    href: "/client/capsules",
  },
  guides: {
    label: "Guides pratiques",
    icon: <BookOpen className="h-5 w-5" />,
    color: "bg-green-100 text-green-600",
    href: "/client/guides",
  },
  carnets: {
    label: "Carnets d'appui",
    icon: <ClipboardList className="h-5 w-5" />,
    color: "bg-orange-100 text-orange-600",
    href: "/client/carnets",
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
        {Object.entries(categoryConfig).map(([key, config]) => (
          <Link key={key} href={config.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${config.color}`}>
                    {config.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{countByCategory[key] || 0}</div>
                    <p className="text-sm text-muted-foreground">{config.label}</p>
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
          <CardTitle className="text-lg">Dernières publications</CardTitle>
          <Badge variant="secondary">{documents.length} au total</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {recentDocs.map((doc) => {
              const config = categoryConfig[doc.category];
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
                      {config?.label} · {doc.type === "pdf" ? doc.fileSize : doc.duration}
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-xs text-muted-foreground">
                    {new Date(doc.uploadDate).toLocaleDateString("fr-FR", {
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
                Voir toutes les publications
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
