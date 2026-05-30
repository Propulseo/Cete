import { createClient } from "@/lib/supabase/client";
import { RepoError } from "@/types/repo-error";

export interface Organization {
  id: string;
  name: string;
  sortOrder: number;
  visible: boolean;
}

export async function listOrganizations(): Promise<Organization[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new RepoError("Impossible de charger les organisations", "organizations", "list");
  return (data ?? []).map((r) => ({ id: r.id, name: r.name, sortOrder: r.sort_order, visible: r.visible }));
}

export async function createOrganization(name: string): Promise<Organization> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("organizations")
    .insert({ name, sort_order: 999 })
    .select("*")
    .single();
  if (error || !data) throw new RepoError("Impossible d'ajouter l'organisation", "organizations", "create");
  return { id: data.id, name: data.name, sortOrder: data.sort_order, visible: data.visible };
}

export async function deleteOrganization(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("organizations").delete().eq("id", id);
  if (error) throw new RepoError("Impossible de supprimer l'organisation", "organizations", "delete");
  return true;
}
