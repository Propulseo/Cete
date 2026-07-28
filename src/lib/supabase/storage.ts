import { createClient } from "@/lib/supabase/client";
import { RepoError } from "@/types/repo-error";

// Helpers Supabase Storage (client navigateur + session courante → policies
// storage.objects appliquées). Buckets privés : l'accès passe par des URL signées.
// Conventions de chemin (alignées sur migration 4) :
//   - contract-documents : `<client_id>/<uuid>-<nom>` (admin uniquement)
//   - certificates       : `<client_id>/<uuid>-<nom>` (admin écrit, client lit le sien)
//   - client-documents   : `global/<uuid>-<nom>` ou `<client_id>/<uuid>-<nom>`

export type StorageBucket = "certificates" | "contract-documents" | "client-documents";

/** Nettoie un nom de fichier pour un usage sûr dans un chemin Storage. */
export function safeFileName(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 60) || "fichier";
  const ext = (dot > 0 ? name.slice(dot + 1) : "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
  return ext ? `${base}.${ext}` : base;
}

/** Construit un chemin d'objet unique : `<folder>/<uuid>-<nom-sûr>`. */
export function buildStoragePath(folder: string, fileName: string): string {
  return `${folder}/${crypto.randomUUID()}-${safeFileName(fileName)}`;
}

/** Téléverse un fichier et renvoie son chemin d'objet (à persister en DB). */
export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  file: File,
): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || "application/octet-stream",
  });
  if (error || !data) {
    throw new RepoError("Échec du téléversement du fichier", "storage", "upload");
  }
  return data.path;
}

/** Génère une URL signée temporaire pour télécharger/consulter un objet privé. */
export async function getSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresIn = 3600,
): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);
  if (error || !data) {
    throw new RepoError("Impossible de générer le lien de téléchargement", "storage", "sign");
  }
  return data.signedUrl;
}

/**
 * Récupère les octets d'un objet privé, sans jamais fabriquer d'URL.
 *
 * Utilisé par la visionneuse lecture seule : une URL signée finirait dans le DOM
 * (ou la barre d'adresse) et suffirait à rouvrir le fichier hors visionneuse,
 * donc à l'imprimer. Ici les octets ne quittent pas la mémoire de l'onglet.
 */
export async function downloadFileBytes(
  bucket: StorageBucket,
  path: string,
): Promise<ArrayBuffer> {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from(bucket).download(path);
  if (error || !data) {
    throw new RepoError("Impossible de charger le fichier", "storage", "download");
  }
  return await data.arrayBuffer();
}

/** Supprime un objet Storage (best-effort ; n'interrompt pas le flux appelant). */
export async function deleteFile(bucket: StorageBucket, path: string): Promise<void> {
  const supabase = createClient();
  await supabase.storage.from(bucket).remove([path]);
}
