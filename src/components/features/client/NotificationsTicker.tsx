"use client";

import { AlertCircle, Bell, CheckCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SurfaceCard,
  SurfaceCardHeader,
  SurfaceCardTitle,
  SurfaceCardContent,
} from "@/components/shared/surface-card";
import type { Notification } from "@/types/document";
import { markAsRead } from "@/lib/repo/notifications.repo";

interface NotificationsTickerProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
}

export function NotificationsTicker({ notifications, onMarkAsRead }: NotificationsTickerProps) {
  const t = useTranslations("client.notifications");
  const locale = useLocale();
  const dateLocale = locale === "fr" ? "fr-FR" : "en-GB";

  if (notifications.length === 0) return null;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      onMarkAsRead?.(id);
    } catch {
      // silently fail - non-critical action
    }
  };

  return (
    <SurfaceCard>
      <SurfaceCardHeader>
        <SurfaceCardTitle className="flex items-center gap-2">
          <Bell className="size-4 text-muted-foreground" strokeWidth={1.75} />
          {t("title")}
        </SurfaceCardTitle>
      </SurfaceCardHeader>
      <SurfaceCardContent className="p-0">
        <ul className="divide-y divide-[var(--admin-line)]">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`flex items-start gap-3 px-5 py-3 ${!notif.read ? "bg-accent" : ""}`}
            >
              {notif.read ? (
                <CheckCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
              ) : (
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.75} />
              )}
              <div className="min-w-0 flex-1">
                <p className={`text-sm ${!notif.read ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                  {notif.message}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {new Date(notif.date).toLocaleDateString(dateLocale, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  {!notif.read && (
                    <Badge variant="secondary" className="text-[10px]">
                      {t("new")}
                    </Badge>
                  )}
                </div>
              </div>
              {!notif.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleMarkAsRead(notif.id)}
                >
                  {t("markRead")}
                </Button>
              )}
            </li>
          ))}
        </ul>
      </SurfaceCardContent>
    </SurfaceCard>
  );
}
