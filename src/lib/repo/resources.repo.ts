import { createClient } from "@/lib/supabase/client";
import type { Resource, ResourceCategory, ResourceType } from "@/types/resource";
import type { AccessType, Visibility } from "@/types/shared";
import { RepoError } from "@/types/repo-error";
import type { Tables, TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";

type ResourceRow = Tables<"resources">;

/** Mappe une ligne `resources` (snake_case) vers le type métier `Resource` (camelCase). */
function rowToResource(r: ResourceRow): Resource {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category as ResourceCategory,
    type: r.type as ResourceType,
    accessType: r.access_type as AccessType,
    url: r.url,
    youtubeId: r.youtube_id ?? undefined,
    fileSize: r.file_size ?? undefined,
    source: r.source ?? undefined,
    publishedDate: r.published_date ?? "",
    createdAt: r.created_at,
    visibility: r.visibility as Visibility,
    assignedClientIds: r.assigned_client_ids,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

/** Construit l'objet d'insertion snake_case à partir du payload métier. */
function toInsert(payload: Omit<Resource, "id">): TablesInsert<"resources"> {
  return {
    title: payload.title,
    description: payload.description,
    category: payload.category,
    type: payload.type,
    access_type: payload.accessType,
    url: payload.url,
    youtube_id: payload.youtubeId ?? null,
    file_size: payload.fileSize ?? null,
    source: payload.source ?? null,
    published_date: payload.publishedDate || null,
    visibility: payload.visibility,
    assigned_client_ids: payload.assignedClientIds,
  };
}

/** Construit l'objet de mise à jour snake_case à partir d'un payload partiel. */
function toUpdate(payload: Partial<Omit<Resource, "id">>): TablesUpdate<"resources"> {
  const update: TablesUpdate<"resources"> = {};
  if (payload.title !== undefined) update.title = payload.title;
  if (payload.description !== undefined) update.description = payload.description;
  if (payload.category !== undefined) update.category = payload.category;
  if (payload.type !== undefined) update.type = payload.type;
  if (payload.accessType !== undefined) update.access_type = payload.accessType;
  if (payload.url !== undefined) update.url = payload.url;
  if (payload.youtubeId !== undefined) update.youtube_id = payload.youtubeId ?? null;
  if (payload.fileSize !== undefined) update.file_size = payload.fileSize ?? null;
  if (payload.source !== undefined) update.source = payload.source ?? null;
  if (payload.publishedDate !== undefined) update.published_date = payload.publishedDate || null;
  if (payload.visibility !== undefined) update.visibility = payload.visibility;
  if (payload.assignedClientIds !== undefined) update.assigned_client_ids = payload.assignedClientIds;
  return update;
}

export async function listResources(): Promise<Resource[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new RepoError("Impossible de charger les ressources", "resources", "list");
  return (data ?? []).map(rowToResource);
}

// Lecture client : ressources globales OU assignées à ce client (contrat ClientScoped).
// La RLS filtre déjà la visibilité côté serveur ; on conserve néanmoins le filtre
// applicatif pour garder un comportement identique et la signature inchangée.
export async function getVisibleForClient(clientId: string): Promise<Resource[]> {
  const resources = await listResources();
  return resources.filter(
    (r) => r.visibility === "global" || r.assignedClientIds.includes(clientId)
  );
}

export async function getResource(id: string): Promise<Resource | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new RepoError("Impossible de charger la ressource", "resources", "get");
  return data ? rowToResource(data) : null;
}

export async function createResource(payload: Omit<Resource, "id">): Promise<Resource> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("resources")
    .insert(toInsert(payload))
    .select("*")
    .single();
  if (error || !data) throw new RepoError("Impossible de créer la ressource", "resources", "create");
  return rowToResource(data);
}

export async function updateResource(
  id: string,
  payload: Partial<Omit<Resource, "id">>
): Promise<Resource | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("resources")
    .update(toUpdate(payload))
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new RepoError("Impossible de modifier la ressource", "resources", "update");
  return data ? rowToResource(data) : null;
}

export async function deleteResource(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error, count } = await supabase
    .from("resources")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) throw new RepoError("Impossible de supprimer la ressource", "resources", "delete");
  return (count ?? 0) > 0;
}
