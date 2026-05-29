import { getItem, setItem } from "@/lib/store/storage";
import type { ContractDocument } from "@/types/client";
import { RepoError } from "@/types/repo-error";
import seedData from "@/data/mocks/fr/contract_documents.json";

const KEY = "cete_contract_documents";
const SEED_VERSION_KEY = "cete_contract_documents_v";
const SEED_VERSION = 1;

function seedIfEmpty(): void {
  if (
    !getItem<ContractDocument[]>(KEY) ||
    getItem<number>(SEED_VERSION_KEY) !== SEED_VERSION
  ) {
    setItem(KEY, seedData.contractDocuments);
    setItem(SEED_VERSION_KEY, SEED_VERSION);
  }
}

// TODO Supabase: supabase.from('contract_documents').select('*').order('uploaded_at', { ascending: false })
export async function listContractDocuments(): Promise<ContractDocument[]> {
  try {
    seedIfEmpty();
    return getItem<ContractDocument[]>(KEY) ?? [];
  } catch (error) {
    console.error("[contract-documents.repo] listContractDocuments failed:", error);
    throw new RepoError("Impossible de charger les documents", "contractDocuments", "list");
  }
}

// TODO Supabase: supabase.from('contract_documents').select('*').eq('client_id', clientId)
export async function listContractDocumentsByClientId(
  clientId: string
): Promise<ContractDocument[]> {
  try {
    const docs = await listContractDocuments();
    return docs.filter((d) => d.clientId === clientId);
  } catch (error) {
    console.error("[contract-documents.repo] listByClientId failed:", error);
    throw new RepoError(
      "Impossible de charger les documents du client",
      "contractDocuments",
      "listByClientId"
    );
  }
}

// TODO Supabase: supabase.from('contract_documents').select('*').eq('id', id).single()
export async function getContractDocument(
  id: string
): Promise<ContractDocument | null> {
  try {
    const docs = await listContractDocuments();
    return docs.find((d) => d.id === id) ?? null;
  } catch (error) {
    console.error("[contract-documents.repo] getContractDocument failed:", error);
    throw new RepoError("Impossible de charger le document", "contractDocuments", "get");
  }
}

// TODO Supabase: supabase.from('contract_documents').insert(payload).select().single()
export async function createContractDocument(
  payload: Omit<ContractDocument, "id">
): Promise<ContractDocument> {
  try {
    const docs = await listContractDocuments();
    const newDoc: ContractDocument = {
      ...payload,
      id: `cdoc-${Date.now()}`,
    };
    docs.unshift(newDoc);
    setItem(KEY, docs);
    return newDoc;
  } catch (error) {
    console.error("[contract-documents.repo] createContractDocument failed:", error);
    throw new RepoError("Impossible de creer le document", "contractDocuments", "create");
  }
}

// TODO Supabase: supabase.from('contract_documents').update(payload).eq('id', id).select().single()
export async function updateContractDocument(
  id: string,
  payload: Partial<Omit<ContractDocument, "id">>
): Promise<ContractDocument | null> {
  try {
    const docs = await listContractDocuments();
    const idx = docs.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    docs[idx] = { ...docs[idx], ...payload };
    setItem(KEY, docs);
    return docs[idx];
  } catch (error) {
    console.error("[contract-documents.repo] updateContractDocument failed:", error);
    throw new RepoError("Impossible de modifier le document", "contractDocuments", "update");
  }
}

// TODO Supabase: supabase.from('contract_documents').delete().eq('id', id)
export async function deleteContractDocument(id: string): Promise<boolean> {
  try {
    const docs = await listContractDocuments();
    const filtered = docs.filter((d) => d.id !== id);
    if (filtered.length === docs.length) return false;
    setItem(KEY, filtered);
    return true;
  } catch (error) {
    console.error("[contract-documents.repo] deleteContractDocument failed:", error);
    throw new RepoError("Impossible de supprimer le document", "contractDocuments", "delete");
  }
}

export async function resetContractDocuments(): Promise<void> {
  setItem(KEY, seedData.contractDocuments);
  setItem(SEED_VERSION_KEY, SEED_VERSION);
}
