export type CertificateStatus = "valide" | "expire" | "revoque";

export interface CertificateSubCriteria {
  autoEvaluation: string;
  maitriseExigences: string;
  maitriseOperationnelle: string;
}

export interface CertificateData {
  id: string;
  certificateNumber: string;
  companyName: string;
  siren: string;
  address: string;
  rating: string;
  vigiScore: string;
  vigiScoreTendance: "+" | "-" | "";
  subCriteria: CertificateSubCriteria;
  evaluationDate: string;
  validityDate: string;
  expertName: string;
  status: CertificateStatus;
  createdAt: string;
}
