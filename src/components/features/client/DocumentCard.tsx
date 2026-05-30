"use client";

import { Play, Clock, Video, FileText } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SurfaceCard } from "@/components/shared/surface-card";
import { getSignedUrl } from "@/lib/supabase/storage";
import type { ClientDocument } from "@/types/document";

interface DocumentCardProps {
  document: ClientDocument;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const t = useTranslations("client.documents");
  const locale = useLocale();
  const dateLocale = locale === "fr" ? "fr-FR" : "en-GB";
  const isVideo = document.type === "video";
  const ThumbIcon = isVideo ? Video : FileText;

  const handleView = async () => {
    if (isVideo && document.youtubeId) {
      window.open(`https://www.youtube.com/watch?v=${document.youtubeId}`, "_blank");
      return;
    }
    const url = document.storagePath
      ? await getSignedUrl("client-documents", document.storagePath).catch(() => null)
      : document.url ?? null;
    if (!url) {
      toast.error("Document indisponible");
      return;
    }
    window.open(url, "_blank", "noopener");
  };

  return (
    <SurfaceCard className="flex flex-col overflow-hidden transition-shadow hover:shadow-[0_2px_8px_rgba(26,41,64,0.08)]">
      {/* Thumbnail */}
      <div className="relative flex h-36 items-center justify-center border-b border-[var(--admin-line)] bg-muted">
        <div className="flex size-12 items-center justify-center rounded-full bg-card text-primary shadow-sm">
          <ThumbIcon className="size-6" strokeWidth={1.75} />
        </div>
        {isVideo && document.duration && (
          <Badge variant="secondary" className="absolute right-3 top-3 gap-1 tabular-nums">
            <Clock className="size-3" strokeWidth={1.75} />
            {document.duration}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 font-medium text-foreground line-clamp-2">{document.title}</h3>
        <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-2">
          {document.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs tabular-nums text-muted-foreground">
            {new Date(document.uploadDate).toLocaleDateString(dateLocale, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <Button size="sm" onClick={handleView}>
            <Play className="mr-2 size-4" />
            {t("playBtn")}
          </Button>
        </div>
      </div>
    </SurfaceCard>
  );
}
