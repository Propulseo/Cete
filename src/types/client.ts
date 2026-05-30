// ── Client Management Types ──────────────────────────────────────────

import type { ThreeCScore, AccessType } from "./shared";

export type ClientLegalForm = "SAS" | "SARL" | "SA" | "EURL" | "SCI" | "autre";

export type ClientSector =
  | "industrie"
  | "tertiaire"
  | "logistique"
  | "medical"
  | "erp_collectif"
  | "immobilier"
  | "autre";

export type ClientStatus = "active" | "onboarding" | "paused" | "archived";

export interface ClientAddress {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface ClientContact {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface Client {
  id: string;
  slug: string;
  companyName: string;
  legalForm: ClientLegalForm;
  siret: string;
  vatNumber?: string;
  sector: ClientSector;
  headcount?: string;
  address: ClientAddress;
  contacts: ClientContact[];
  status: ClientStatus;
  contractStartDate: string;
  contractEndDate?: string;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}

// ── Contract Documents ───────────────────────────────────────────────

export type ContractDocumentType =
  | "offer"
  | "quote"
  | "contract"
  | "addendum"
  | "resource"
  | "report"
  | "other";

export type ContractDocumentStatus = "draft" | "sent" | "signed" | "archived";

export interface ContractDocument {
  id: string;
  clientId: string;
  type: ContractDocumentType;
  title: string;
  version: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  /** Chemin de l'objet dans le bucket `contract-documents` (NULL si pas de fichier). */
  storagePath?: string;
  uploadedAt: string;
  uploadedBy: string;
  status: ContractDocumentStatus;
  notes?: string;
  /** Mode d'accès côté client. `download` (défaut) = consulter + télécharger + imprimer ;
   *  `view-only` = consultation seule (téléchargement/impression bridés côté UX). */
  accessType?: AccessType;
}

// ── Evaluations ──────────────────────────────────────────────────────

export type EvaluationStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export type VigiScoreGrade = "A" | "B" | "C" | "D";

export interface Evaluation {
  id: string;
  clientId: string;
  siteName: string;
  siteAddress: string;
  visitDate: string;
  vigiScore?: VigiScoreGrade;
  omtScore?: ThreeCScore;
  compositeRating?: string;
  certificateId?: string;
  auditorId: string;
  status: EvaluationStatus;
  reportDocumentId?: string;
  nextEvaluationDue?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
