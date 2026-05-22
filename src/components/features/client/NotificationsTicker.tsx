"use client";

import { AlertCircle, Bell, CheckCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <Card>
      <CardHeader className="flex-row items-center gap-2 pb-4">
        <Bell className="h-5 w-5 text-accent" />
        <CardTitle className="text-lg">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-3 px-6 py-3 ${
                !notif.read ? "bg-accent/5" : ""
              }`}
            >
              {notif.read ? (
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
              )}
              <div className="flex-1">
                <p className={`text-sm ${!notif.read ? "font-medium" : "text-muted-foreground"}`}>
                  {notif.message}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
