import { getItem, setItem } from "@/lib/store/storage";
import type { Client } from "@/types/client";
import { RepoError } from "@/types/repo-error";
import seedData from "@/data/mocks/fr/clients.json";

const KEY = "cete_clients";
const SEED_VERSION_KEY = "cete_clients_v";
const SEED_VERSION = 2;

function seedIfEmpty(): void {
  if (!getItem<Client[]>(KEY) || getItem<number>(SEED_VERSION_KEY) !== SEED_VERSION) {
    setItem(KEY, seedData.clients);
    setItem(SEED_VERSION_KEY, SEED_VERSION);
  }
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// TODO Supabase: supabase.from('clients').select('*').order('created_at', { ascending: false })
export async function listClients(): Promise<Client[]> {
  try {
    seedIfEmpty();
    return getItem<Client[]>(KEY) ?? [];
  } catch (error) {
    console.error("[clients.repo] listClients failed:", error);
    throw new RepoError("Impossible de charger les clients", "clients", "list");
  }
}

// TODO Supabase: supabase.from('clients').select('*').eq('id', id).single()
export async function getClientById(id: string): Promise<Client | null> {
  try {
    const clients = await listClients();
    return clients.find((c) => c.id === id) ?? null;
  } catch (error) {
    console.error("[clients.repo] getClientById failed:", error);
    throw new RepoError("Impossible de charger le client", "clients", "get");
  }
}

// TODO Supabase: supabase.from('clients').select('*').eq('slug', slug).single()
export async function getClientBySlug(slug: string): Promise<Client | null> {
  try {
    const clients = await listClients();
    return clients.find((c) => c.slug === slug) ?? null;
  } catch (error) {
    console.error("[clients.repo] getClientBySlug failed:", error);
    throw new RepoError("Impossible de charger le client", "clients", "getBySlug");
  }
}

// TODO Supabase: supabase.from('clients').insert(payload).select().single()
export async function createClient(
  payload: Omit<Client, "id" | "slug" | "createdAt" | "updatedAt">
): Promise<Client> {
  try {
    const clients = await listClients();
    const now = new Date().toISOString();
    const newClient: Client = {
      ...payload,
      id: `cli-${Date.now()}`,
      slug: toSlug(payload.companyName),
      createdAt: now,
      updatedAt: now,
    };
    clients.unshift(newClient);
    setItem(KEY, clients);
    return newClient;
  } catch (error) {
    console.error("[clients.repo] createClient failed:", error);
    throw new RepoError("Impossible de creer le client", "clients", "create");
  }
}

// TODO Supabase: supabase.from('clients').update(payload).eq('id', id).select().single()
export async function updateClient(
  id: string,
  payload: Partial<Omit<Client, "id" | "slug" | "createdAt">>
): Promise<Client | null> {
  try {
    const clients = await listClients();
    const idx = clients.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    clients[idx] = {
      ...clients[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    if (payload.companyName) {
      clients[idx].slug = toSlug(payload.companyName);
    }
    setItem(KEY, clients);
    return clients[idx];
  } catch (error) {
    console.error("[clients.repo] updateClient failed:", error);
    throw new RepoError("Impossible de modifier le client", "clients", "update");
  }
}

// TODO Supabase: supabase.from('clients').update({ status: 'archived' }).eq('id', id)
export async function softArchiveClient(id: string): Promise<Client | null> {
  return updateClient(id, { status: "archived" });
}

// TODO Supabase: supabase.from('clients').delete().eq('id', id)
export async function deleteClient(id: string): Promise<boolean> {
  try {
    const clients = await listClients();
    const filtered = clients.filter((c) => c.id !== id);
    if (filtered.length === clients.length) return false;
    setItem(KEY, filtered);
    return true;
  } catch (error) {
    console.error("[clients.repo] deleteClient failed:", error);
    throw new RepoError("Impossible de supprimer le client", "clients", "delete");
  }
}

export async function resetClients(): Promise<void> {
  setItem(KEY, seedData.clients);
  setItem(SEED_VERSION_KEY, SEED_VERSION);
}
