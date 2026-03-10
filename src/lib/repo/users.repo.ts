import { getItem, setItem } from "@/lib/store/storage";
import type { Profile } from "@/types/auth";
import { RepoError } from "@/types/repo-error";

const KEY = "cete_users";

const SEED_USERS: Profile[] = [
  {
    id: "adm-001",
    name: "Administrateur CETé",
    email: "admin@cete.fr",
    role: "admin",
    is_active: true,
    created_at: "2025-01-01",
  },
  {
    id: "cli-12345",
    name: "Jean Dupont",
    email: "demo@cete.fr",
    role: "client",
    company: "Electricité Pro SA",
    is_active: true,
    created_at: "2025-06-15",
  },
];

function seedIfEmpty(): void {
  if (!getItem<Profile[]>(KEY)) {
    setItem(KEY, SEED_USERS);
  }
}

// TODO Supabase: supabase.from('profiles').select('*').order('created_at', { ascending: false })
export async function listUsers(): Promise<Profile[]> {
  try {
    seedIfEmpty();
    return getItem<Profile[]>(KEY) ?? [];
  } catch (error) {
    console.error("[users.repo] listUsers failed:", error);
    throw new RepoError("Impossible de charger les utilisateurs", "users", "list");
  }
}

// TODO Supabase: supabase.from('profiles').select('*').eq('id', id).single()
export async function getAppUser(id: string): Promise<Profile | null> {
  try {
    const users = await listUsers();
    return users.find((u) => u.id === id) ?? null;
  } catch (error) {
    console.error("[users.repo] getAppUser failed:", error);
    throw new RepoError("Impossible de charger l'utilisateur", "users", "get");
  }
}

// TODO Supabase: supabase.from('profiles').insert(payload).select().single()
// Note: en Supabase, la création d'un user passe d'abord par auth.admin.createUser()
// puis un trigger insère automatiquement le profil dans la table profiles.
export async function createUser(
  payload: Omit<Profile, "id" | "created_at">
): Promise<Profile> {
  try {
    const users = await listUsers();
    const newUser: Profile = {
      ...payload,
      id: `usr-${Date.now()}`, // TODO Supabase: UUID auto-généré par auth.users
      created_at: new Date().toISOString().split("T")[0],
    };
    users.unshift(newUser);
    setItem(KEY, users);
    return newUser;
  } catch (error) {
    console.error("[users.repo] createUser failed:", error);
    throw new RepoError("Impossible de créer l'utilisateur", "users", "create");
  }
}

// TODO Supabase: supabase.from('profiles').update(payload).eq('id', id).select().single()
export async function updateUser(
  id: string,
  payload: Partial<Omit<Profile, "id" | "created_at">>
): Promise<Profile | null> {
  try {
    const users = await listUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...payload };
    setItem(KEY, users);
    return users[idx];
  } catch (error) {
    console.error("[users.repo] updateUser failed:", error);
    throw new RepoError("Impossible de modifier l'utilisateur", "users", "update");
  }
}

// TODO Supabase: supabase.from('profiles').delete().eq('id', id)
// Note: en Supabase, supprimer un profil implique aussi auth.admin.deleteUser()
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const users = await listUsers();
    const filtered = users.filter((u) => u.id !== id);
    if (filtered.length === users.length) return false;
    setItem(KEY, filtered);
    return true;
  } catch (error) {
    console.error("[users.repo] deleteUser failed:", error);
    throw new RepoError("Impossible de supprimer l'utilisateur", "users", "delete");
  }
}

export async function resetUsers(): Promise<void> {
  setItem(KEY, SEED_USERS);
}
