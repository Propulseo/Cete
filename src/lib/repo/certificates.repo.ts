import type { CertificateData, CertificateStatus } from "@/types/certificate";

const KEY = "cete_certificates";

const MOCK_CERTIFICATES: CertificateData[] = [
  {
    id: "cete-cert-2026-0042-a7f3",
    certificateNumber: "CERT-2026-0042",
    companyName: "Electricité Pro SA",
    siren: "123 456 789",
    address: "12 rue de l'Industrie, 69003 Lyon",
    rating: "BBB",
    vigiScore: "B",
    vigiScoreTendance: "+",
    subCriteria: {
      autoEvaluation: "B+",
      maitriseExigences: "A-",
      maitriseOperationnelle: "B",
    },
    evaluationDate: "2026-01-15",
    validityDate: "2028-01-15",
    expertName: "Michel LIGIER",
    status: "valide",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "cete-cert-2025-0038-b2e1",
    certificateNumber: "CERT-2025-0038",
    companyName: "Electricité Pro SA",
    siren: "123 456 789",
    address: "12 rue de l'Industrie, 69003 Lyon",
    rating: "BBC",
    vigiScore: "B",
    vigiScoreTendance: "",
    subCriteria: {
      autoEvaluation: "B",
      maitriseExigences: "B+",
      maitriseOperationnelle: "C+",
    },
    evaluationDate: "2025-03-10",
    validityDate: "2027-03-10",
    expertName: "Bruno CLAUDEL",
    status: "expire",
    createdAt: "2025-03-10T10:00:00Z",
  },
];

function getAll(): CertificateData[] {
  if (typeof window === "undefined") return MOCK_CERTIFICATES;
  const stored = localStorage.getItem(KEY);
  if (!stored) {
    localStorage.setItem(KEY, JSON.stringify(MOCK_CERTIFICATES));
    return MOCK_CERTIFICATES;
  }
  return JSON.parse(stored) as CertificateData[];
}

function save(certs: CertificateData[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(certs));
  }
}

export async function listCertificates(): Promise<CertificateData[]> {
  return getAll();
}

export async function listCertificatesForClient(
  companyName: string
): Promise<CertificateData[]> {
  return getAll().filter(
    (c) => c.companyName.toLowerCase() === companyName.toLowerCase()
  );
}

export async function getCertificateById(
  id: string
): Promise<CertificateData | null> {
  return getAll().find((c) => c.id === id) ?? null;
}

export async function updateCertificateStatus(
  id: string,
  status: CertificateStatus
): Promise<void> {
  const certs = getAll();
  const idx = certs.findIndex((c) => c.id === id);
  if (idx !== -1) {
    certs[idx].status = status;
    save(certs);
  }
}
