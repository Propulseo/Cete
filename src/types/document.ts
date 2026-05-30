import type { ClientScoped, AccessType } from "./shared";

export type DocumentCategory = "newsletters" | "capsules" | "guides" | "carnets";
export type DocumentType = "pdf" | "video";
export type NotificationType = "veille" | "document" | "info";

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

export interface Notification extends ClientScoped {
  id: string;
  type: NotificationType;
  message: string;
  date: string;
  read: boolean;
}

export interface ClientData {
  clientName: string;
  clientId: string;
  documents: ClientDocument[];
  notifications: Notification[];
}
