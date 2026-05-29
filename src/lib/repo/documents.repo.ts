import { createClient } from "@/lib/supabase/client";
import type { ClientDocument, DocumentCategory, DocumentType } from "@/types/document";
import type { AccessType, Visibility } from "@/types/shared";
import type { Database } from "@/lib/supabase/database.types";
import { RepoError } from "@/types/repo-error";

type DocumentRow = Database["public"]["Tables"]["client_documents"]["Row"];
type DocumentInsert = Database["public"]["Tables"]["client_documents"]["Insert"];
type DocumentUpdate = Database["public"]["Tables"]["client_documents"]["Update"];

/** Mappe une ligne DB (snake_case) vers le type métier `ClientDocument` (camelCase). */
function rowToDocument(r: DocumentRow): ClientDocument {
  return {
    id: r.id,
    title: r.title,
    category: r.category as DocumentCategory,
    type: r.type as DocumentType,
    description: r.description,
    fileSize: r.file_size ?? undefined,
    duration: r.duration ?? undefined,
    uploadDate: r.upload_date,
    url: r.url ?? undefined,
    youtubeId: r.youtube_id ?? undefined,
    accessType: (r.access_type as AccessType | null) ?? undefined,
    visibility: r.visibility as Visibility,
    assignedClientIds: r.assigned_client_ids,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

/** Construit le payload d'insert/update DB (snake_case) depuis un `ClientDocument` partiel. */
function documentToRow(
  payload: Partial<Omit<ClientDocument, "id">>
): DocumentUpdate {
  const row: DocumentUpdate = {};
  if (payload.title !== undefined) row.title = payload.title;
  if (payload.category !== undefined) row.category = payload.category;
  if (payload.type !== undefined) row.type = payload.type;
  if (payload.description !== undefined) row.description = payload.description;
  if (payload.fileSize !== undefined) row.file_size = payload.fileSize ?? null;
  if (payload.duration !== undefined) row.duration = payload.duration ?? null;
  if (payload.uploadDate !== undefined) row.upload_date = payload.uploadDate;
  if (payload.url !== undefined) row.url = payload.url ?? null;
  if (payload.youtubeId !== undefined) row.youtube_id = payload.youtubeId ?? null;
  if (payload.accessType !== undefined) row.access_type = payload.accessType ?? null;
  if (payload.visibility !== undefined) row.visibility = payload.visibility;
  if (payload.assignedClientIds !== undefined) row.assigned_client_ids = payload.assignedClientIds;
  return row;
}

export async function listDocuments(): Promise<ClientDocument[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("client_documents")
      .select("*")
      .order("upload_date", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToDocument);
  } catch (error) {
    console.error("[documents.repo] listDocuments failed:", error);
    throw new RepoError("Impossible de charger les documents", "documents", "list");
  }
}

// Lecture client : la RLS filtre déjà (contenu global OU assigné à `current_client_id()`).
// Le paramètre `clientId` est conservé pour préserver la signature consommée par les pages.
export async function getVisibleForClient(
  clientId: string // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<ClientDocument[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("client_documents")
      .select("*")
      .order("upload_date", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToDocument);
  } catch (error) {
    console.error("[documents.repo] getVisibleForClient failed:", error);
    throw new RepoError("Impossible de charger les documents client", "documents", "listForClient");
  }
}

export async function getDocument(id: string): Promise<ClientDocument | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("client_documents")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToDocument(data) : null;
  } catch (error) {
    console.error("[documents.repo] getDocument failed:", error);
    throw new RepoError("Impossible de charger le document", "documents", "get");
  }
}

export async function createDocument(
  payload: Omit<ClientDocument, "id">
): Promise<ClientDocument> {
  try {
    const supabase = createClient();
    const insert: DocumentInsert = {
      title: payload.title,
      category: payload.category,
      type: payload.type,
      description: payload.description,
      file_size: payload.fileSize ?? null,
      duration: payload.duration ?? null,
      upload_date: payload.uploadDate,
      url: payload.url ?? null,
      youtube_id: payload.youtubeId ?? null,
      access_type: payload.accessType ?? null,
      visibility: payload.visibility,
      assigned_client_ids: payload.assignedClientIds,
    };
    const { data, error } = await supabase
      .from("client_documents")
      .insert(insert)
      .select("*")
      .single();
    if (error) throw error;
    return rowToDocument(data);
  } catch (error) {
    console.error("[documents.repo] createDocument failed:", error);
    throw new RepoError("Impossible de créer le document", "documents", "create");
  }
}

export async function updateDocument(
  id: string,
  payload: Partial<Omit<ClientDocument, "id">>
): Promise<ClientDocument | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("client_documents")
      .update(documentToRow(payload))
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) throw error;
    return data ? rowToDocument(data) : null;
  } catch (error) {
    console.error("[documents.repo] updateDocument failed:", error);
    throw new RepoError("Impossible de modifier le document", "documents", "update");
  }
}

export async function deleteDocument(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("client_documents")
      .delete()
      .eq("id", id)
      .select("id");
    if (error) throw error;
    return (data ?? []).length > 0;
  } catch (error) {
    console.error("[documents.repo] deleteDocument failed:", error);
    throw new RepoError("Impossible de supprimer le document", "documents", "delete");
  }
}
