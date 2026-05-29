import { createClient } from "@/lib/supabase/client";
import type { Notification, NotificationType } from "@/types/document";
import type { Visibility } from "@/types/shared";
import type { Tables } from "@/lib/supabase/database.types";
import { RepoError } from "@/types/repo-error";

type NotificationRow = Tables<"notifications">;

/** Mappe une ligne `notifications` (snake_case) vers `Notification` (camelCase). */
function rowToNotification(row: NotificationRow, read: boolean): Notification {
  return {
    id: row.id,
    type: row.type as NotificationType,
    message: row.message,
    date: row.date,
    read,
    visibility: row.visibility as Visibility,
    assignedClientIds: row.assigned_client_ids ?? [],
  };
}

/** Récupère l'utilisateur courant ; null si non authentifié. */
async function getCurrentUserId(
  supabase: ReturnType<typeof createClient>
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/**
 * Récupère l'ensemble des `notification_id` lus par l'utilisateur courant.
 * Vide si aucun utilisateur authentifié.
 */
async function getReadIds(
  supabase: ReturnType<typeof createClient>,
  userId: string | null
): Promise<Set<string>> {
  if (!userId) return new Set();
  const { data, error } = await supabase
    .from("notification_reads")
    .select("notification_id")
    .eq("user_id", userId);
  if (error) {
    throw new RepoError(
      "Impossible de charger l'état de lecture des notifications",
      "notifications",
      "readState"
    );
  }
  return new Set((data ?? []).map((r) => r.notification_id));
}

// Liste toutes les notifications visibles (RLS filtre selon le rôle de l'utilisateur).
// `read` est calculé par utilisateur via la table notification_reads.
export async function listNotifications(): Promise<Notification[]> {
  try {
    const supabase = createClient();
    const userId = await getCurrentUserId(supabase);
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("date", { ascending: false });
    if (error) {
      throw new RepoError("Impossible de charger les notifications", "notifications", "list");
    }
    const readIds = await getReadIds(supabase, userId);
    return (data ?? []).map((row) => rowToNotification(row, readIds.has(row.id)));
  } catch (error) {
    if (error instanceof RepoError) throw error;
    console.error("[notifications.repo] listNotifications failed:", error);
    throw new RepoError("Impossible de charger les notifications", "notifications", "list");
  }
}

// Lecture client : notifications globales OU assignées à ce client (contrat ClientScoped).
// La RLS filtre déjà côté serveur ; le filtre local conserve la sémantique de la signature.
export async function getVisibleForClient(clientId: string): Promise<Notification[]> {
  try {
    const notifs = await listNotifications();
    return notifs.filter(
      (n) => n.visibility === "global" || n.assignedClientIds.includes(clientId)
    );
  } catch (error) {
    if (error instanceof RepoError) throw error;
    console.error("[notifications.repo] getVisibleForClient failed:", error);
    throw new RepoError("Impossible de charger les notifications client", "notifications", "listForClient");
  }
}

// Nombre de notifications visibles non encore lues par l'utilisateur courant.
export async function getUnreadCount(): Promise<number> {
  try {
    const notifs = await listNotifications();
    return notifs.filter((n) => !n.read).length;
  } catch (error) {
    if (error instanceof RepoError) throw error;
    console.error("[notifications.repo] getUnreadCount failed:", error);
    throw new RepoError("Impossible de compter les notifications", "notifications", "count");
  }
}

// Compteur non-lus restreint à ce client (global + assigné).
export async function getUnreadCountForClient(clientId: string): Promise<number> {
  try {
    const notifs = await getVisibleForClient(clientId);
    return notifs.filter((n) => !n.read).length;
  } catch (error) {
    if (error instanceof RepoError) throw error;
    console.error("[notifications.repo] getUnreadCountForClient failed:", error);
    throw new RepoError("Impossible de compter les notifications", "notifications", "count");
  }
}

// Marque une notification comme lue pour l'utilisateur courant.
// Insère une ligne notification_reads (upsert, conflit ignoré).
export async function markAsRead(id: string): Promise<Notification | null> {
  try {
    const supabase = createClient();
    const userId = await getCurrentUserId(supabase);
    if (!userId) {
      throw new RepoError(
        "Utilisateur non authentifié",
        "notifications",
        "markAsRead"
      );
    }

    const { data: row, error: fetchError } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (fetchError) {
      throw new RepoError(
        "Impossible de marquer la notification comme lue",
        "notifications",
        "markAsRead"
      );
    }
    if (!row) return null;

    const { error: upsertError } = await supabase
      .from("notification_reads")
      .upsert(
        { notification_id: id, user_id: userId },
        { onConflict: "notification_id,user_id", ignoreDuplicates: true }
      );
    if (upsertError) {
      throw new RepoError(
        "Impossible de marquer la notification comme lue",
        "notifications",
        "markAsRead"
      );
    }

    return rowToNotification(row, true);
  } catch (error) {
    if (error instanceof RepoError) throw error;
    console.error("[notifications.repo] markAsRead failed:", error);
    throw new RepoError("Impossible de marquer la notification comme lue", "notifications", "markAsRead");
  }
}

// Marque toutes les notifications visibles non lues comme lues pour l'utilisateur courant.
export async function markAllAsRead(): Promise<void> {
  try {
    const supabase = createClient();
    const userId = await getCurrentUserId(supabase);
    if (!userId) {
      throw new RepoError(
        "Utilisateur non authentifié",
        "notifications",
        "markAllAsRead"
      );
    }

    const { data, error } = await supabase.from("notifications").select("id");
    if (error) {
      throw new RepoError(
        "Impossible de marquer toutes les notifications",
        "notifications",
        "markAllAsRead"
      );
    }

    const rows = (data ?? []).map((n) => ({
      notification_id: n.id,
      user_id: userId,
    }));
    if (rows.length === 0) return;

    const { error: upsertError } = await supabase
      .from("notification_reads")
      .upsert(rows, {
        onConflict: "notification_id,user_id",
        ignoreDuplicates: true,
      });
    if (upsertError) {
      throw new RepoError(
        "Impossible de marquer toutes les notifications",
        "notifications",
        "markAllAsRead"
      );
    }
  } catch (error) {
    if (error instanceof RepoError) throw error;
    console.error("[notifications.repo] markAllAsRead failed:", error);
    throw new RepoError("Impossible de marquer toutes les notifications", "notifications", "markAllAsRead");
  }
}
