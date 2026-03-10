import { getItem, setItem } from "@/lib/store/storage";
import type { Notification } from "@/types/document";
import { RepoError } from "@/types/repo-error";
import seedData from "@/data/mocks/client_documents.json";

const KEY = "cete_notifications";

function seedIfEmpty(): void {
  if (!getItem<Notification[]>(KEY)) {
    setItem(KEY, seedData.notifications as Notification[]);
  }
}

// TODO Supabase: supabase.from('notifications').select('*').eq('user_id', auth.uid()).order('date', { ascending: false })
// Note: en Supabase le RLS filtrera par user_id automatiquement
export async function listNotifications(): Promise<Notification[]> {
  try {
    seedIfEmpty();
    return getItem<Notification[]>(KEY) ?? [];
  } catch (error) {
    console.error("[notifications.repo] listNotifications failed:", error);
    throw new RepoError("Impossible de charger les notifications", "notifications", "list");
  }
}

// TODO Supabase: supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', auth.uid()).eq('read', false)
export async function getUnreadCount(): Promise<number> {
  try {
    const notifs = await listNotifications();
    return notifs.filter((n) => !n.read).length;
  } catch (error) {
    console.error("[notifications.repo] getUnreadCount failed:", error);
    throw new RepoError("Impossible de compter les notifications", "notifications", "count");
  }
}

// TODO Supabase: supabase.from('notifications').update({ read: true }).eq('id', id).select().single()
export async function markAsRead(id: string): Promise<Notification | null> {
  try {
    const notifs = await listNotifications();
    const idx = notifs.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    notifs[idx] = { ...notifs[idx], read: true };
    setItem(KEY, notifs);
    return notifs[idx];
  } catch (error) {
    console.error("[notifications.repo] markAsRead failed:", error);
    throw new RepoError("Impossible de marquer la notification comme lue", "notifications", "markAsRead");
  }
}

// TODO Supabase: supabase.from('notifications').update({ read: true }).eq('user_id', auth.uid()).eq('read', false)
export async function markAllAsRead(): Promise<void> {
  try {
    const notifs = await listNotifications();
    const updated = notifs.map((n) => ({ ...n, read: true }));
    setItem(KEY, updated);
  } catch (error) {
    console.error("[notifications.repo] markAllAsRead failed:", error);
    throw new RepoError("Impossible de marquer toutes les notifications", "notifications", "markAllAsRead");
  }
}

export async function resetNotifications(): Promise<void> {
  setItem(KEY, seedData.notifications as Notification[]);
}
