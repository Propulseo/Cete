import { getItem, setItem } from "@/lib/store/storage";
import type { Resource } from "@/types/resource";
import { RepoError } from "@/types/repo-error";
import seedData from "@/data/mocks/resources.json";

const KEY = "cete_resources";
const SEED_VERSION_KEY = "cete_resources_v";
const SEED_VERSION = 2;

function seedIfEmpty(): void {
  if (!getItem<Resource[]>(KEY) || getItem<number>(SEED_VERSION_KEY) !== SEED_VERSION) {
    setItem(KEY, seedData.resources);
    setItem(SEED_VERSION_KEY, SEED_VERSION);
  }
}

// TODO Supabase: supabase.from('resources').select('*').order('published_date', { ascending: false })
export async function listResources(): Promise<Resource[]> {
  try {
    seedIfEmpty();
    return getItem<Resource[]>(KEY) ?? [];
  } catch (error) {
    console.error("[resources.repo] listResources failed:", error);
    throw new RepoError("Impossible de charger les ressources", "resources", "list");
  }
}

// TODO Supabase: supabase.from('resources').select('*').eq('id', id).single()
export async function getResource(id: string): Promise<Resource | null> {
  try {
    const resources = await listResources();
    return resources.find((r) => r.id === id) ?? null;
  } catch (error) {
    console.error("[resources.repo] getResource failed:", error);
    throw new RepoError("Impossible de charger la ressource", "resources", "get");
  }
}

// TODO Supabase: supabase.from('resources').insert(payload).select().single()
export async function createResource(
  payload: Omit<Resource, "id">
): Promise<Resource> {
  try {
    const resources = await listResources();
    const newResource: Resource = {
      ...payload,
      id: `res-${Date.now()}`, // TODO Supabase: UUID auto-généré
    };
    resources.unshift(newResource);
    setItem(KEY, resources);
    return newResource;
  } catch (error) {
    console.error("[resources.repo] createResource failed:", error);
    throw new RepoError("Impossible de créer la ressource", "resources", "create");
  }
}

// TODO Supabase: supabase.from('resources').update(payload).eq('id', id).select().single()
export async function updateResource(
  id: string,
  payload: Partial<Omit<Resource, "id">>
): Promise<Resource | null> {
  try {
    const resources = await listResources();
    const idx = resources.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    resources[idx] = { ...resources[idx], ...payload };
    setItem(KEY, resources);
    return resources[idx];
  } catch (error) {
    console.error("[resources.repo] updateResource failed:", error);
    throw new RepoError("Impossible de modifier la ressource", "resources", "update");
  }
}

// TODO Supabase: supabase.from('resources').delete().eq('id', id)
export async function deleteResource(id: string): Promise<boolean> {
  try {
    const resources = await listResources();
    const filtered = resources.filter((r) => r.id !== id);
    if (filtered.length === resources.length) return false;
    setItem(KEY, filtered);
    return true;
  } catch (error) {
    console.error("[resources.repo] deleteResource failed:", error);
    throw new RepoError("Impossible de supprimer la ressource", "resources", "delete");
  }
}

export async function resetResources(): Promise<void> {
  setItem(KEY, seedData.resources);
}
