export type ContactRequestKind = "contact" | "evaluation";
export type ContactRequestStatus = "new" | "handled" | "archived";

/** Champs propres au formulaire d'évaluation, stockés en jsonb côté base. */
export interface EvaluationPayload {
  contactRole: string;
  siren: string | null;
  sector: string;
  employees: string;
  evaluationType: string;
  sites: string | null;
  details: string | null;
}

export interface ContactRequest {
  id: string;
  kind: ContactRequestKind;
  name: string;
  email: string;
  company: string;
  phone: string | null;
  subject: string | null;
  message: string | null;
  payload: EvaluationPayload | null;
  locale: string;
  status: ContactRequestStatus;
  emailSent: boolean;
  emailError: string | null;
  createdAt: string;
}
