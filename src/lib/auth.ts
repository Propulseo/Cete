import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

/** Mappe une ligne `profiles` (snake_case) vers le type métier `Profile`. */
function toProfile(row: {
  id: string;
  email: string;
  name: string;
  role: string;
  client_id: string | null;
  company: string | null;
  phone: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}): Profile {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role === "admin" ? "admin" : "client",
    clientId: row.client_id ?? undefined,
    company: row.company ?? undefined,
    phone: row.phone ?? undefined,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return toProfile(data);
}

/** Connexion email + mot de passe (Supabase Auth). Retourne le profil ou null. */
export async function login(email: string, password: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return null;
  return fetchProfile(data.user.id);
}

export async function logout(): Promise<void> {
  await createClient().auth.signOut();
}

/** Profil de l'utilisateur courant (session) ou null. */
export async function getUser(): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return fetchProfile(data.user.id);
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getUser()) !== null;
}

export async function isAdmin(): Promise<boolean> {
  return (await getUser())?.role === "admin";
}

export async function isClient(): Promise<boolean> {
  return (await getUser())?.role === "client";
}
