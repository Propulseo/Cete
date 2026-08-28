"use client";

// NotificationBell — cloche du portail client : pastille de non-lues, panneau des
// dernières notifications, marquage lu à l'ouverture d'un ITEM (pas à l'ouverture
// du panneau — l'utilisateur garde la maîtrise de ce qu'il a vu).

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, Eye, FileText, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import {
  listNotificationsForCurrentUser,
  markAllAsRead,
  markAsRead,
} from "@/lib/repo/notifications.repo";
import type { Notification, NotificationType } from "@/types/notification";

const TYPE_ICON: Record<NotificationType, typeof Bell> = {
  document: FileText,
  veille: Eye,
  info: Info,
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function NotificationBell() {
  const { user } = useAuth();
  const t = useTranslations("client.notifications");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      setNotifications(await listNotificationsForCurrentUser());
    } catch (err) {
      console.error("[NotificationBell] chargement échoué:", err);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    load();
  }, [user, load]);

  // Fermeture au clic extérieur et à Échap.
  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  if (!user) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleItemOpen = async (n: Notification) => {
    if (n.isRead) return;
    setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
    try {
      await markAsRead(n.id);
    } catch (err) {
      console.error("[NotificationBell] marquage lu échoué:", err);
      void load();
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead();
      await load();
    } catch (err) {
      console.error("[NotificationBell] tout-marquer-lu échoué:", err);
    }
  };

  return (
    <div ref={wrapperRef} className="relative ml-auto lg:pr-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("title")}
        aria-expanded={open}
        className={cn(
          "relative inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
          open && "bg-accent text-foreground"
        )}
      >
        <Bell strokeWidth={1.75} className="size-5" />
        {unreadCount > 0 && (
          <span
            aria-hidden
            className="absolute top-1 right-1 flex min-w-4 items-center justify-center rounded-full bg-admin-urgent px-1 text-[0.625rem] font-semibold text-white"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-80 overflow-hidden rounded-[10px] border border-[var(--admin-line)] bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-[var(--admin-line)] bg-secondary/60 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("title")}
            </p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                className="text-xs text-primary underline-offset-2 hover:underline"
              >
                {t("markAllRead")}
              </button>
            )}
          </div>
          <ul className="max-h-96 divide-y divide-[var(--admin-line)] overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                {t("empty")}
              </li>
            ) : (
              notifications.slice(0, 10).map((n) => {
                const Icon = TYPE_ICON[n.type] ?? Info;
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => handleItemOpen(n)}
                      className={cn(
                        "flex w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-accent",
                        !n.isRead && "bg-primary/[0.04]"
                      )}
                    >
                      <Icon
                        strokeWidth={1.75}
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          n.isRead ? "text-muted-foreground" : "text-primary"
                        )}
                      />
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block text-sm leading-snug text-foreground",
                            !n.isRead && "font-medium"
                          )}
                        >
                          {n.message}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground tabular-nums">
                          {formatDate(n.date)}
                          {!n.isRead && (
                            <span
                              aria-hidden
                              className="ml-2 inline-block size-1.5 rounded-full bg-admin-urgent align-middle"
                            />
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
