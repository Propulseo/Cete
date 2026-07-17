import jsPDF from "jspdf";
import QRCode from "qrcode";
import type { CertificateData } from "@/types/certificate";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getRatingColor(rating: string): [number, number, number] {
  const letter = rating.charAt(0);
  if (letter === "A") return [34, 197, 94];
  if (letter === "B") return [234, 179, 8];
  if (letter === "C") return [249, 115, 22];
  return [239, 68, 68];
}

export async function generateCertificatePDF(
  cert: CertificateData
): Promise<Blob> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const H = 297;

  // ── Background ──
  doc.setFillColor(235, 245, 252); // light sky blue
  doc.rect(0, 0, W, H, "F");

  // Decorative bubbles
  doc.setFillColor(77, 166, 217, 0.06);
  doc.circle(30, 40, 25, "F");
  doc.circle(180, 80, 18, "F");
  doc.circle(50, 250, 22, "F");
  doc.circle(170, 230, 15, "F");

  // ── Top gradient band ──
  doc.setFillColor(232, 99, 10); // orange
  doc.rect(0, 0, W, 4, "F");
  doc.setFillColor(77, 166, 217); // blue
  doc.rect(0, 4, W, 2, "F");

  // ��─ Header ──
  doc.setFillColor(26, 42, 64); // dark blue
  doc.rect(0, 6, W, 28, "F");

  // Logo text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("CETé ADN", 15, 22);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 210, 225);
  doc.text(
    "Agence de notation indépendante des risques professionnels",
    15,
    29
  );

  // ── Title ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(26, 42, 64);
  const title = "CERTIFICAT D'ÉVALUATION DES RISQUES PROFESSIONNELS";
  doc.text(title, W / 2, 48, { align: "center" });

  // Orange underline
  const titleWidth = doc.getTextWidth(title);
  doc.setDrawColor(232, 99, 10);
  doc.setLineWidth(0.8);
  doc.line((W - titleWidth) / 2, 50, (W + titleWidth) / 2, 50);

  // ── Left block ──
  const LX = 15;
  let ly = 62;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(26, 42, 64);
  doc.text("Entreprise évaluée", LX, ly);
  ly += 7;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(cert.companyName, LX, ly);
  ly += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(74, 101, 128);
  doc.text(`SIREN : ${cert.siren}`, LX, ly);
  ly += 5;
  doc.text(cert.address, LX, ly);
  ly += 10;

  // Standard text
  doc.setFontSize(8.5);
  doc.setTextColor(74, 101, 128);
  const standardText =
    "Après évaluation réalisée selon le référentiel CETé ADN, " +
    "il est attribué la notation suivante :\n\n" +
    "Cette notation reflète le niveau de vigilance et la probabilité " +
    "d'occurrence d'un accident d'origine électrique au sein de " +
    "l'organisation évaluée.";
  const lines = doc.splitTextToSize(standardText, 85);
  doc.text(lines, LX, ly);
  ly += lines.length * 4 + 6;

  // Dates
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(26, 42, 64);
  doc.text("Date d'évaluation :", LX, ly);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(cert.evaluationDate), LX + 42, ly);
  ly += 6;
  doc.text("Date de validité :", LX, ly);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(cert.validityDate), LX + 42, ly);

  // ── Right block - Rating badge ──
  const RX = 120;
  let ry = 58;

  // Rating box
  const [rr, rg, rb] = getRatingColor(cert.compositeRating);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(RX, ry, 75, 48, 4, 4, "F");
  doc.setDrawColor(rr, rg, rb);
  doc.setLineWidth(1);
  doc.roundedRect(RX, ry, 75, 48, 4, 4, "S");

  // Badge header
  doc.setFillColor(26, 42, 64);
  doc.roundedRect(RX + 8, ry + 3, 59, 10, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text("NOTATION CETé ADN", RX + 37.5, ry + 9.5, { align: "center" });

  // Big rating
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(rr, rg, rb);
  doc.text(cert.compositeRating, RX + 37.5, ry + 35, { align: "center" });

  // Label
  doc.setFontSize(7);
  doc.setTextColor(74, 101, 128);
  doc.text("Échelle : AAA (optimal) - DDD (critique)", RX + 37.5, ry + 43, {
    align: "center",
  });

  ry += 55;

  // Vigi-Score box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(RX, ry, 75, 18, 3, 3, "F");
  doc.setDrawColor(77, 166, 217);
  doc.setLineWidth(0.5);
  doc.roundedRect(RX, ry, 75, 18, 3, 3, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(26, 42, 64);
  doc.text("VIGI-SCORE", RX + 5, ry + 7);

  const vigiText =
    cert.vigiScore + (cert.vigiScoreTendance ? cert.vigiScoreTendance : "");
  doc.setFontSize(18);
  doc.setTextColor(77, 166, 217);
  doc.text(vigiText, RX + 55, ry + 13, { align: "center" });

  ry += 24;

  // Sub-criteria
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(RX, ry, 75, 38, 3, 3, "F");
  doc.setDrawColor(218, 238, 248);
  doc.setLineWidth(0.3);
  doc.roundedRect(RX, ry, 75, 38, 3, 3, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(26, 42, 64);
  doc.text("SOUS-CRITÈRES", RX + 5, ry + 6);

  const criteria = [
    ["Capacité d'auto-évaluation", cert.subCriteria.autoEvaluation],
    ["Recommandation & Amélioration", cert.subCriteria.recommandation],
    ["Gestes Métiers", cert.subCriteria.gestesMetiers],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  criteria.forEach(([label, score], i) => {
    const cy = ry + 14 + i * 8;
    doc.setTextColor(74, 101, 128);
    doc.text(label, RX + 5, cy);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 42, 64);
    doc.text(score, RX + 68, cy, { align: "right" });
    doc.setFont("helvetica", "normal");
  });

  ry += 44;

  // Dates + Expert on the right
  doc.setFontSize(8);
  doc.setTextColor(74, 101, 128);
  doc.text(`Évaluation : ${formatDate(cert.evaluationDate)}`, RX, ry);
  ry += 5;
  doc.text(`Validité : ${formatDate(cert.validityDate)}`, RX, ry);
  ry += 8;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 42, 64);
  doc.text("Expert évaluateur", RX, ry);
  ry += 5;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(74, 101, 128);
  doc.text(cert.expertName, RX, ry);

  ry += 10;

  // Stamp / cachet
  doc.setDrawColor(232, 99, 10);
  doc.setLineWidth(1.2);
  doc.circle(RX + 37.5, ry + 12, 14, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(232, 99, 10);
  doc.text("CETé ADN", RX + 37.5, ry + 9, { align: "center" });
  doc.setFontSize(4.5);
  doc.text("CERTIFIÉ", RX + 37.5, ry + 13, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(4);
  doc.text(cert.certificateNumber, RX + 37.5, ry + 17, { align: "center" });

  // ── Footer - Legal mentions ──
  const fy = H - 38;
  doc.setDrawColor(218, 238, 248);
  doc.setLineWidth(0.3);
  doc.line(15, fy, W - 15, fy);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(138, 165, 190);
  const legalLines = [
    "Ce certificat est délivré par CETé - Consortium Experts Techniques Électricité, agence de notation indépendante.",
    "La notation attribuée est fondée sur le référentiel propriétaire CETé ADN et ne constitue pas une garantie d'absence de risque.",
    "La reproduction ou la falsification de ce document est passible de poursuites. Vérifiez l'authenticité via le QR code ci-contre.",
  ];
  legalLines.forEach((line, i) => {
    doc.text(line, 15, fy + 5 + i * 3.5);
  });

  // ── QR Code - bottom right ──
  // Préfixe de locale obligatoire : routing.ts déclare localePrefix "always".
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://cete-notation.fr";
  const verifyUrl = `${base}/fr/verifier/${cert.id}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 200,
      margin: 1,
      color: { dark: "#1A2940", light: "#FFFFFF" },
    });

    // White background for QR
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(W - 50, H - 55, 38, 45, 3, 3, "F");
    doc.setDrawColor(77, 166, 217);
    doc.setLineWidth(0.4);
    doc.roundedRect(W - 50, H - 55, 38, 45, 3, 3, "S");

    doc.addImage(qrDataUrl, "PNG", W - 47, H - 52, 26, 26);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(5);
    doc.setTextColor(26, 42, 64);
    doc.text("Certificat vérifiable", W - 31, H - 20, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(4.5);
    doc.setTextColor(77, 166, 217);
    doc.text("en ligne", W - 31, H - 17, { align: "center" });
  } catch {
    // QR generation failed silently, skip QR code
  }

  // ── Bottom band ──
  doc.setFillColor(77, 166, 217);
  doc.rect(0, H - 4, W, 2, "F");
  doc.setFillColor(232, 99, 10);
  doc.rect(0, H - 2, W, 2, "F");

  return doc.output("blob");
}
