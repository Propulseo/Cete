import { getItem, setItem } from "@/lib/store/storage";
import type { ClientDocument } from "@/types/document";
import { RepoError } from "@/types/repo-error";
import seedData from "@/data/mocks/client_documents.json";

const KEY = "cete_documents";

function seedIfEmpty(): void {
  if (!getItem<ClientDocument[]>(KEY)) {
    setItem(KEY, seedData.documents);
  }
}

// TODO Supabase: supabase.from('documents').select('*').order('upload_date', { ascending: false })
export async function listDocuments(): Promise<ClientDocument[]> {
  try {
    seedIfEmpty();
    return getItem<ClientDocument[]>(KEY) ?? [];
  } catch (error) {
    console.error("[documents.repo] listDocuments failed:", error);
    throw new RepoError("Impossible de charger les documents", "documents", "list");
  }
}

// TODO Supabase: Le paramètre clientId disparaîtra.
// Le RLS (Row Level Security) filtrera automatiquement par auth.uid().
// La signature deviendra : listDocumentsForClient(): Promise<ClientDocument[]>
// Requête: supabase.from('documents').select('*').or('visibility.eq.global,client_id.eq.{auth.uid()}')
export async function listDocumentsForClient(clientId: string): Promise<ClientDocument[]> {
  try {
    const docs = await listDocuments();
    return docs.filter(
      (d) => d.visibility === "global" || d.clientId === clientId
    );
  } catch (error) {
    console.error("[documents.repo] listDocumentsForClient failed:", error);
    throw new RepoError("Impossible de charger les documents client", "documents", "listForClient");
  }
}

// TODO Supabase: supabase.from('documents').select('*').eq('id', id).single()
export async function getDocument(id: string): Promise<ClientDocument | null> {
  try {
    const docs = await listDocuments();
    return docs.find((d) => d.id === id) ?? null;
  } catch (error) {
    console.error("[documents.repo] getDocument failed:", error);
    throw new RepoError("Impossible de charger le document", "documents", "get");
  }
}

// TODO Supabase: supabase.from('documents').insert(payload).select().single()
export async function createDocument(
  payload: Omit<ClientDocument, "id">
): Promise<ClientDocument> {
  try {
    const docs = await listDocuments();
    const newDoc: ClientDocument = {
      ...payload,
      id: `doc-${Date.now()}`, // TODO Supabase: UUID auto-généré
    };
    docs.unshift(newDoc);
    setItem(KEY, docs);
    return newDoc;
  } catch (error) {
    console.error("[documents.repo] createDocument failed:", error);
    throw new RepoError("Impossible de créer le document", "documents", "create");
  }
}

// TODO Supabase: supabase.from('documents').update(payload).eq('id', id).select().single()
export async function updateDocument(
  id: string,
  payload: Partial<Omit<ClientDocument, "id">>
): Promise<ClientDocument | null> {
  try {
    const docs = await listDocuments();
    const idx = docs.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    docs[idx] = { ...docs[idx], ...payload };
    setItem(KEY, docs);
    return docs[idx];
  } catch (error) {
    console.error("[documents.repo] updateDocument failed:", error);
    throw new RepoError("Impossible de modifier le document", "documents", "update");
  }
}

// TODO Supabase: supabase.from('documents').delete().eq('id', id)
export async function deleteDocument(id: string): Promise<boolean> {
  try {
    const docs = await listDocuments();
    const filtered = docs.filter((d) => d.id !== id);
    if (filtered.length === docs.length) return false;
    setItem(KEY, filtered);
    return true;
  } catch (error) {
    console.error("[documents.repo] deleteDocument failed:", error);
    throw new RepoError("Impossible de supprimer le document", "documents", "delete");
  }
}

export async function resetDocuments(): Promise<void> {
  setItem(KEY, seedData.documents);
}
