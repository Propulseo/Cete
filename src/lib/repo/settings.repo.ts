import { getItem, setItem } from "@/lib/store/storage";
import type { ContactInfo } from "@/types/contact";
import { RepoError } from "@/types/repo-error";
import seedData from "@/data/mocks/contact_info.json";

const KEY = "cete_settings";

function seedIfEmpty(): void {
  if (!getItem<ContactInfo>(KEY)) {
    setItem(KEY, seedData);
  }
}

// TODO Supabase: supabase.from('settings').select('*').single()
// Note: table settings avec une seule ligne (singleton pattern)
export async function getSettings(): Promise<ContactInfo> {
  try {
    seedIfEmpty();
    return getItem<ContactInfo>(KEY) ?? (seedData as ContactInfo);
  } catch (error) {
    console.error("[settings.repo] getSettings failed:", error);
    throw new RepoError("Impossible de charger les paramètres", "settings", "get");
  }
}

// TODO Supabase: supabase.from('settings').update(payload).eq('id', 1).select().single()
export async function updateSettings(payload: Partial<ContactInfo>): Promise<ContactInfo> {
  try {
    const current = await getSettings();
    const updated = { ...current, ...payload };
    setItem(KEY, updated);
    return updated;
  } catch (error) {
    console.error("[settings.repo] updateSettings failed:", error);
    throw new RepoError("Impossible de modifier les paramètres", "settings", "update");
  }
}

export async function resetSettings(): Promise<void> {
  setItem(KEY, seedData);
}
