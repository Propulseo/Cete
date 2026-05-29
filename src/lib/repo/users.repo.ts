import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/auth";
import type { Database } from "@/lib/supabase/database.types";
import { RepoError } from "@/types/repo-error";
import { createUserAction, deleteUserAction } from "@/app/actions/users";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type CreateUserPayload = Omit<Profile, "id" | "created_at"> & {
  password?: string;
};

function rowToProfile(r: ProfileRow): Profile {
  return {
    id: r.id,
    email: r.email,
    name: r.name,
    role: r.role === "admin" ? "admin" : "client",
    clientId: r.client_id ?? undefined,
    company: r.company ?? undefined,
    phone: r.phone ?? undefined,
    is_active: r.is_active,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

export async function listUsers(): Promise<Profile[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new RepoError("Impossible de charger les utilisateurs", "users", "list");
  return (data ?? []).map(rowToProfile);
}

export async function getAppUser(id: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
  if (error) throw new RepoError("Impossible de charger l'utilisateur", "users", "get");
  return data ? rowToProfile(data) : null;
}

// Création via Server Action (Admin API service-role) : auth.admin.createUser +
// trigger handle_new_user qui crée le profil (role/client_id/company depuis metadata).
export async function createUser(payload: CreateUserPayload): Promise<Profile> {
  const { id } = await createUserAction({
    email: payload.email,
    password: payload.password && payload.password.length >= 6 ? payload.password : "changeme123",
    name: payload.name,
    role: payload.role,
    clientId: payload.clientId,
    company: payload.company,
  });
  const created = await getAppUser(id);
  if (!created) throw new RepoError("Profil introuvable après création", "users", "create");
  return created;
}

export async function updateUser(
  id: string,
  payload: Partial<Omit<Profile, "id" | "created_at">> & { password?: string },
): Promise<Profile | null> {
  const supabase = createClient();
  const patch: ProfileUpdate = {};
  if (payload.name !== undefined) patch.name = payload.name;
  if (payload.email !== undefined) patch.email = payload.email;
  if (payload.role !== undefined) patch.role = payload.role;
  if (payload.clientId !== undefined) patch.client_id = payload.clientId ?? null;
  if (payload.company !== undefined) patch.company = payload.company ?? null;
  if (payload.phone !== undefined) patch.phone = payload.phone ?? null;
  if (payload.is_active !== undefined) patch.is_active = payload.is_active;
  // payload.password ignoré ici (changement de mot de passe = flux dédié, non couvert).
  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new RepoError("Impossible de modifier l'utilisateur", "users", "update");
  return data ? rowToProfile(data) : null;
}

export async function deleteUser(id: string): Promise<boolean> {
  await deleteUserAction(id);
  return true;
}
