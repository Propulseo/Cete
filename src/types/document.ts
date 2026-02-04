export interface ClientDocument {
  id: string;
  title: string;
  category: "newsletters" | "capsules" | "guides" | "carnets";
  type: "PDF" | "video";
  description: string;
  fileSize?: string;
  duration?: string;
  uploadDate: string;
  url?: string;
  youtubeId?: string;
}

export interface Notification {
  id: string;
  type: string;
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
