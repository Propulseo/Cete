"use client";

import { FileText, ExternalLink, Video, Download, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSignedUrl } from "@/lib/supabase/storage";
import { openSecureViewer } from "@/lib/secure-viewer";
import type { Resource, ResourceCategory, ResourceType } from "@/types/resource";

/** URL ouvrable : objet Storage (URL signée) sinon `url` (lien externe). */
async function resolveResourceUrl(res: Resource): Promise<string | null> {
  if (res.storagePath) {
    try {
      return await getSignedUrl("client-documents", res.storagePath);
    } catch {
      return null;
    }
  }
  return res.url || null;
}

const categoryKeyMap: Record<ResourceCategory, string> = {
  normes: "categoryNormes",
  reglementation: "categoryReglementation",
  guides: "categoryGuides",
  rapports: "categoryRapports",
  veille: "categoryVeille",
  partenaires: "categoryPartenaires",
};

const typeConfig: Record<ResourceType, { icon: typeof FileText; color: string }> = {
  pdf: { icon: FileText, color: "bg-red-100 text-red-600" },
  lien: { icon: ExternalLink, color: "bg-blue-100 text-blue-600" },
  video: { icon: Video, color: "bg-purple-100 text-purple-600" },
};

export function ResourceCard({ res }: { res: Resource }) {
  const t = useTranslations("client.resources");
  const cfg = typeConfig[res.type];
  const Icon = cfg.icon;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-white transition hover:shadow-md">
      {res.type === "video" && res.youtubeId && (
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${res.youtubeId}`}
            title={res.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cfg.color}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground line-clamp-2">{res.title}</p>
            {res.source && (
              <p className="text-xs text-muted-foreground">{res.source}</p>
            )}
          </div>
        </div>
        <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-3">
          {res.description}
        </p>
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {t(categoryKeyMap[res.category] as Parameters<typeof t>[0])}
            </Badge>
            {res.fileSize && (
              <span className="text-xs text-muted-foreground">{res.fileSize}</span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              // Seuls les PDF restreints passent par la visionneuse lecture seule ;
              // liens externes et vidéos s'ouvrent normalement.
              if (res.type === "pdf" && res.accessType !== "download") {
                const opened = openSecureViewer({
                  title: res.title,
                  bucket: "client-documents",
                  path: res.storagePath,
                  src: res.url || undefined,
                });
                if (!opened) toast.error(t("popupError"));
                return;
              }
              const url = await resolveResourceUrl(res);
              if (!url) {
                toast.error("Ressource indisponible");
                return;
              }
              window.open(url, "_blank", "noopener,noreferrer");
            }}
          >
            {res.accessType === "download" ? (
              <>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                {t("download")}
              </>
            ) : (
              <>
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                {t("view")}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
