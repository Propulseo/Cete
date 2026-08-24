"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, Eye, FileText, Info, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/features/admin/ui/admin-page-header";
import { AdminEmptyState } from "@/components/features/admin/ui/admin-empty-state";
import { listClients } from "@/lib/repo/clients.repo";
import {
  createNotification,
  deleteNotification,
  listAllNotifications,
} from "@/lib/repo/notifications.repo";
import type {
  Notification,
  NotificationType,
  NotificationVisibility,
} from "@/types/notification";

const TYPES: { value: NotificationType; label: string; icon: typeof Bell }[] = [
  { value: "info", label: "Information", icon: Info },
  { value: "document", label: "Document", icon: FileText },
  { value: "veille", label: "Veille", icon: Eye },
];

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [clients, setClients] = useState<{ id: string; companyName: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("info");
  const [visibility, setVisibility] = useState<NotificationVisibility>("global");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [notifs, clientList] = await Promise.all([listAllNotifications(), listClients()]);
      setNotifications(notifs);
      setClients(
        clientList.map((c) => ({ id: c.id, companyName: c.companyName }))
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const canSubmit = useMemo(
    () =>
      message.trim().length > 0 &&
      (visibility === "global" || selectedClients.length > 0) &&
      !submitting,
    [message, visibility, selectedClients, submitting]
  );

  const handleToggleClient = (id: string) => {
    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    try {
      setSubmitting(true);
      await createNotification({
        type,
        message: message.trim(),
        date: new Date().toISOString(),
        visibility,
        assignedClientIds: visibility === "assigned" ? selectedClients : [],
      });
      setMessage("");
      setSelectedClients([]);
      await load();
      toast.success("Notification diffusée");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la diffusion");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (n: Notification) => {
    if (!window.confirm("Supprimer cette notification ?")) return;
    try {
      await deleteNotification(n.id);
      setNotifications((prev) => prev.filter((x) => x.id !== n.id));
      toast.success("Notification supprimée");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <AdminPageHeader
        title="Notifications"
        subtitle="Diffusez des informations aux clients dans leur portail"
      />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Nouvelle notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Message à diffuser..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
          />
          <div className="flex flex-wrap items-center gap-2">
            {TYPES.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={type === value ? "default" : "outline"}
                size="sm"
                onClick={() => setType(value)}
              >
                <Icon strokeWidth={1.75} className="mr-2 size-4" />
                {label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={visibility === "global" ? "default" : "outline"}
              size="sm"
              onClick={() => setVisibility("global")}
            >
              Tous les clients
            </Button>
            <Button
              variant={visibility === "assigned" ? "default" : "outline"}
              size="sm"
              onClick={() => setVisibility("assigned")}
            >
              Clients spécifiques
            </Button>
          </div>
          {visibility === "assigned" && (
            <div className="grid gap-1.5 rounded-[10px] border border-[var(--admin-line)] bg-secondary/40 p-3 sm:grid-cols-2 lg:grid-cols-3">
              {clients.map((c) => (
                <label key={c.id} className="flex min-h-8 cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(c.id)}
                    onChange={() => handleToggleClient(c.id)}
                    className="size-4 accent-[var(--primary)]"
                  />
                  <span className="truncate text-foreground">{c.companyName}</span>
                </label>
              ))}
            </div>
          )}
          <Button onClick={handleCreate} disabled={!canSubmit}>
            {submitting ? (
              <Loader2 strokeWidth={1.75} className="mr-2 size-4 animate-spin" />
            ) : (
              <Bell strokeWidth={1.75} className="mr-2 size-4" />
            )}
            Diffuser
          </Button>
        </CardContent>
      </Card>

      <p className="mb-3 text-sm font-medium text-foreground">Historique ({notifications.length})</p>
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin text-primary" strokeWidth={1.75} />
      ) : notifications.length === 0 ? (
        <AdminEmptyState
          icon={Bell}
          title="Aucune notification"
          description="Les notifications diffusées apparaîtront ici."
        />
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="flex items-start justify-between gap-4 rounded-[10px] border border-[var(--admin-line)] bg-card p-4"
            >
              <div className="min-w-0">
                <p className="text-sm text-foreground">{n.message}</p>
                <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                  {TYPES.find((t) => t.value === n.type)?.label ?? n.type} ·{" "}
                  {n.visibility === "global"
                    ? "Tous les clients"
                    : `${n.assignedClientIds.length} client(s)`}{" "}
                  · {formatDate(n.createdAt)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Supprimer la notification"
                onClick={() => handleDelete(n)}
                className="shrink-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" strokeWidth={1.75} />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
