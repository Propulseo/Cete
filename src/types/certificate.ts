import type { ThreeCScore } from "./shared";
import type { VigiScoreGrade } from "./client";

export type CertificateStatus = "valide" | "expire" | "revoque";

export interface CertificateData {
  id: string;
  certificateNumber: string;
  /** Lien vers le `Client` (remplace l'ancien rattachement par `companyName`). */
  clientId: string;
  companyName: string;
  siren: string;
  address: string;
  /** Note composite triple-lettre (ex. "BBB"). Anciennement `rating`. */
  compositeRating: string;
  vigiScore: VigiScoreGrade;
  vigiScoreTendance: "+" | "-" | "";
  subCriteria: ThreeCScore;
  evaluationDate: string;
  validityDate: string;
  expertName: string;
  status: CertificateStatus;
  /** Chemin du PDF déposé dans le bucket `certificates` (`<client_id>/...`). */
  pdfStoragePath?: string;
  createdAt: string;
}
