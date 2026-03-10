export type DocumentCategory = "newsletters" | "capsules" | "guides" | "carnets";
export type DocumentType = "pdf" | "video";
export type NotificationType = "veille" | "document" | "info";

export interface ClientDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  type: DocumentType;
  description: string;
  fileSize?: string;
  duration?: string;
  uploadDate: string;
  url?: string;
  youtubeId?: string;
  visibility: "global" | "client";
  clientId?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Notification {
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
