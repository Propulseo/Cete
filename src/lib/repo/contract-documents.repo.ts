import { createClient } from "@/lib/supabase/client";
import type {
  ContractDocument,
  ContractDocumentStatus,
  ContractDocumentType,
} from "@/types/client";
import type { AccessType } from "@/types/shared";
import { RepoError } from "@/types/repo-error";
import type { Database } from "@/lib/supabase/database.types";

type ContractDocumentRow =
  Database["public"]["Tables"]["contract_documents"]["Row"];
type ContractDocumentInsert =
  Database["public"]["Tables"]["contract_documents"]["Insert"];

function rowToContractDocument(r: ContractDocumentRow): ContractDocument {
  return {
    id: r.id,
    clientId: r.client_id,
    type: r.type as ContractDocumentType,
    title: r.title,
    version: r.version,
    fileName: r.file_name,
    fileSize: r.file_size,
    mimeType: r.mime_type,
    storagePath: r.storage_path ?? undefined,
    uploadedAt: r.uploaded_at,
    uploadedBy: r.uploaded_by ?? "",
    status: r.status as ContractDocumentStatus,
    notes: r.notes ?? undefined,
    accessType: (r.access_type as AccessType | null) ?? undefined,
  };
}

function toInsert(
  payload: Omit<ContractDocument, "id">
): ContractDocumentInsert {
  return {
    client_id: payload.clientId,
    type: payload.type,
    title: payload.title,
    version: payload.version,
    file_name: payload.fileName,
    file_size: payload.fileSize,
    mime_type: payload.mimeType,
    storage_path: payload.storagePath ?? null,
    uploaded_at: payload.uploadedAt,
    uploaded_by: payload.uploadedBy || null,
    status: payload.status,
    notes: payload.notes ?? null,
    access_type: payload.accessType ?? "download",
  };
}

function toUpdate(
  payload: Partial<Omit<ContractDocument, "id">>
): Database["public"]["Tables"]["contract_documents"]["Update"] {
  const update: Database["public"]["Tables"]["contract_documents"]["Update"] = {};
  if (payload.clientId !== undefined) update.client_id = payload.clientId;
  if (payload.type !== undefined) update.type = payload.type;
  if (payload.title !== undefined) update.title = payload.title;
  if (payload.version !== undefined) update.version = payload.version;
  if (payload.fileName !== undefined) update.file_name = payload.fileName;
  if (payload.fileSize !== undefined) update.file_size = payload.fileSize;
  if (payload.mimeType !== undefined) update.mime_type = payload.mimeType;
  if (payload.storagePath !== undefined) update.storage_path = payload.storagePath ?? null;
  if (payload.uploadedAt !== undefined) update.uploaded_at = payload.uploadedAt;
  if (payload.uploadedBy !== undefined)
    update.uploaded_by = payload.uploadedBy || null;
  if (payload.status !== undefined) update.status = payload.status;
  if (payload.notes !== undefined) update.notes = payload.notes ?? null;
  if (payload.accessType !== undefined) update.access_type = payload.accessType ?? "download";
  return update;
}

export async function listContractDocuments(): Promise<ContractDocument[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contract_documents")
    .select("*")
    .order("uploaded_at", { ascending: false });
  if (error) {
    throw new RepoError(
      "Impossible de charger les documents",
      "contractDocuments",
      "list"
    );
  }
  return (data ?? []).map(rowToContractDocument);
}

export async function listContractDocumentsByClientId(
  clientId: string
): Promise<ContractDocument[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contract_documents")
    .select("*")
    .eq("client_id", clientId)
    .order("uploaded_at", { ascending: false });
  if (error) {
    throw new RepoError(
      "Impossible de charger les documents du client",
      "contractDocuments",
      "listByClientId"
    );
  }
  return (data ?? []).map(rowToContractDocument);
}

// Lecture CLIENT : ses propres documents "client-facing" (rapports + contrats signés).
// La RLS (contract_documents_client_select) filtre déjà côté serveur : le client ne reçoit
// que ses lignes type ∈ {report,contract,addendum} ET statut ∈ {sent,signed}. On conserve un
// filtre défensif identique côté client pour ne jamais afficher une ligne hors périmètre.
const CLIENT_VISIBLE_TYPES: ContractDocumentType[] = ["report", "contract", "addendum"];
const CLIENT_VISIBLE_STATUSES: ContractDocumentStatus[] = ["sent", "signed"];

export function isClientVisibleContractDocument(d: ContractDocument): boolean {
  return (
    CLIENT_VISIBLE_TYPES.includes(d.type) &&
    CLIENT_VISIBLE_STATUSES.includes(d.status)
  );
}

export async function getClientContractDocuments(): Promise<ContractDocument[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contract_documents")
    .select("*")
    .order("uploaded_at", { ascending: false });
  if (error) {
    throw new RepoError(
      "Impossible de charger vos documents",
      "contractDocuments",
      "listForClient"
    );
  }
  return (data ?? []).map(rowToContractDocument).filter(isClientVisibleContractDocument);
}

export async function getContractDocument(
  id: string
): Promise<ContractDocument | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contract_documents")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    throw new RepoError(
      "Impossible de charger le document",
      "contractDocuments",
      "get"
    );
  }
  return data ? rowToContractDocument(data) : null;
}

export async function createContractDocument(
  payload: Omit<ContractDocument, "id">
): Promise<ContractDocument> {
  const supabase = createClient();
  // uploaded_by = utilisateur courant (ignore les valeurs mock type "adm-001"
  // qui violeraient la FK vers profiles).
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("contract_documents")
    .insert({ ...toInsert(payload), uploaded_by: user?.id ?? null })
    .select("*")
    .single();
  if (error || !data) {
    throw new RepoError(
      "Impossible de creer le document",
      "contractDocuments",
      "create"
    );
  }
  return rowToContractDocument(data);
}

export async function updateContractDocument(
  id: string,
  payload: Partial<Omit<ContractDocument, "id">>
): Promise<ContractDocument | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contract_documents")
    .update(toUpdate(payload))
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) {
    throw new RepoError(
      "Impossible de modifier le document",
      "contractDocuments",
      "update"
    );
  }
  return data ? rowToContractDocument(data) : null;
}

export async function deleteContractDocument(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contract_documents")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) {
    throw new RepoError(
      "Impossible de supprimer le document",
      "contractDocuments",
      "delete"
    );
  }
  return (data ?? []).length > 0;
}
