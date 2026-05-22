"use client";

import { Play, Clock, Video } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ClientDocument } from "@/types/document";

interface DocumentCardProps {
  document: ClientDocument;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const t = useTranslations("client.documents");
  const locale = useLocale();
  const dateLocale = locale === "fr" ? "fr-FR" : "en-GB";

  const handleView = () => {
    if (document.type === "video" && document.youtubeId) {
      window.open(`https://www.youtube.com/watch?v=${document.youtubeId}`, "_blank");
    } else if (document.url) {
      window.open(document.url, "_blank");
    }
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      {/* Thumbnail placeholder */}
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-sm">
          <Video className="h-7 w-7 text-primary" />
        </div>
        <Badge className="absolute right-3 top-3 bg-black/60 text-white hover:bg-black/60">
          <Clock className="mr-1 h-3 w-3" />
          {document.duration}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="mb-1 font-semibold text-foreground line-clamp-2">
          {document.title}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {document.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {new Date(document.uploadDate).toLocaleDateString(dateLocale, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <Button size="sm" onClick={handleView}>
            <Play className="mr-2 h-4 w-4" />
            {t("playBtn")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
