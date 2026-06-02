import type { ClientScoped, AccessType } from "./shared";

export type DocumentCategory = "newsletters" | "capsules" | "guides" | "carnets";
export type DocumentType = "pdf" | "video";

export interface ClientDocument extends ClientScoped {
  id: string;
  title: string;
  category: DocumentCategory;
  type: DocumentType;
  description: string;
  fileSize?: string;
  duration?: string;
  uploadDate: string;
  url?: string;
  /** Chemin de l'objet dans le bucket `client-documents` (dossier `global/` ou `<client_id>/`). */
  storagePath?: string;
  youtubeId?: string;
  accessType?: AccessType;
  created_at?: string;
  updated_at?: string;
}

export interface ClientData {
  clientName: string;
  clientId: string;
  documents: ClientDocument[];
}
