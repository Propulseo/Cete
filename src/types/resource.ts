export type ResourceCategory = "normes" | "reglementation" | "guides" | "rapports" | "veille";

export type ResourceType = "pdf" | "lien" | "video";

export type ResourceAccessMode = "lecture" | "telechargement";

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  type: ResourceType;
  accessMode: ResourceAccessMode;
  url: string;
  youtubeId?: string;
  fileSize?: string;
  source?: string;
  publishedDate: string;
  createdAt: string;
  created_at?: string;
  updated_at?: string;
}
