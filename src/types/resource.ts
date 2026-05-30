import type { ClientScoped, AccessType } from "./shared";

export type ResourceCategory = "normes" | "reglementation" | "guides" | "rapports" | "veille" | "partenaires";

export type ResourceType = "pdf" | "lien" | "video";

export interface Resource extends ClientScoped {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  type: ResourceType;
  accessType: AccessType;
  url: string;
  /** Chemin de l'objet dans le bucket `client-documents` (ressources PDF déposées). */
  storagePath?: string;
  youtubeId?: string;
  fileSize?: string;
  source?: string;
  publishedDate: string;
  createdAt: string;
  created_at?: string;
  updated_at?: string;
}
