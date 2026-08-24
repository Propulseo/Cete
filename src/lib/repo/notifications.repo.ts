import { createClient } from "@/lib/supabase/client";
import { RepoError } from "@/types/repo-error";
import type { Tables } from "@/lib/supabase/database.types";
import type {
  NewNotificationInput,
  Notification,
  NotificationType,
  NotificationVisibility,
} from "@/types/notification";

type Row = Tables<"notifications">;

function rowToNotification(r: Row, isRead?: boolean): Notification {
  return {
    id: r.id,
    type: r.type as NotificationType,
    message: r.message,
    date: r.date,
    visibility: r.visibility as NotificationVisibility,
    assignedClientIds: r.assigned_client_ids,
    createdAt: r.created_at,
    ...(isRead !== undefined ? { isRead } : {}),
  };
}

/**
 * Lectures du portail : la RLS ne renvoie déjà que les notifications globales ou
 * assignées au client courant. Les lectures (`notification_reads`) sont chargées
 * séparément puis fusionnées — plus prévisible qu'un embed Supabase.
 */
export async function listNotificationsForCurrentUser(): Promise<Notification[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("date", { ascending: false })
    .limit(50);
  if (error)
    throw new RepoError("Impossible de charger les notifications", "notifications", "list");

  const rows = data ?? [];
  const { data: me } = await supabase.auth.getUser();
  const userId = me.user?.id;

  if (!userId || rows.length === 0) return rows.map((r) => rowToNotification(r));

  const { data: reads, error: readsError } = await supabase
    .from("notification_reads")
    .select("notification_id")
    .eq("user_id", userId);
  if (readsError)
    throw new RepoError(
      "Impossible de charger les lectures",
      "notification_reads",
      "list"
    );
  const readIds = new Set((reads ?? []).map((r) => r.notification_id));
  return rows.map((r) => rowToNotification(r, readIds.has(r.id)));
}

/** Idempotent : la clé primaire est la paire (notification, utilisateur). */
export async function markAsRead(notificationId: string): Promise<void> {
  const supabase = createClient();
  const { data: me, error: meError } = await supabase.auth.getUser();
  if (meError || !me.user)
    throw new RepoError("Utilisateur non identifié", "notification_reads", "markRead");
  const { error } = await supabase.from("notification_reads").upsert({
    notification_id: notificationId,
    user_id: me.user.id,
  });
  if (error)
    throw new RepoError("Impossible de marquer comme lue", "notification_reads", "markRead");
}

/** Marque tout ce qui est visible et non lu — un upsert par notification non lue. */
export async function markAllAsRead(): Promise<void> {
  const notifications = await listNotificationsForCurrentUser();
  const unread = notifications.filter((n) => !n.isRead);
  for (const n of unread) {
    await markAsRead(n.id);
  }
}

/* ---- Côté admin ---- */

export async function listAllNotifications(): Promise<Notification[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error)
    throw new RepoError("Impossible de charger les notifications", "notifications", "listAll");
  return (data ?? []).map((r) => rowToNotification(r));
}

export async function createNotification(input: NewNotificationInput): Promise<Notification> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      type: input.type,
      message: input.message,
      date: input.date,
      visibility: input.visibility,
      assigned_client_ids: input.assignedClientIds,
    })
    .select("*")
    .single();
  if (error || !data)
    throw new RepoError("Impossible de créer la notification", "notifications", "create");
  return rowToNotification(data);
}

export async function deleteNotification(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("notifications").delete().eq("id", id);
  if (error)
    throw new RepoError("Impossible de supprimer la notification", "notifications", "delete");
}

/**
 * Déclencheur produit (7.4) : une notification `document` assignée à chaque client
 * visé. Échouer silencieusement serait pire que ne pas notifier : l'appelant logue,
 * mais la publication reste un succès.
 */
export async function notifyClientsAssigned(input: {
  message: string;
  clientIds: string[];
}): Promise<void> {
  if (input.clientIds.length === 0) return;
  try {
    await createNotification({
      type: "document",
      message: input.message,
      date: new Date().toISOString(),
      visibility: "assigned",
      assignedClientIds: input.clientIds,
    });
  } catch (err) {
    console.error("[notifications] notifyClientsAssigned failed:", err);
  }
}
