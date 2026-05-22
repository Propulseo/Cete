"use client";

import { useState, useEffect, useCallback } from "react";
import { Award, Download, QrCode, Shield, Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateCertificatePDF } from "@/lib/generate-certificate-pdf";
import { listCertificatesForClient } from "@/lib/repo/certificates.repo";
import type { CertificateData } from "@/types/certificate";

interface CertificateCardProps {
  userName: string;
  companyName?: string;
}

export function CertificateCard({ companyName }: CertificateCardProps) {
  const t = useTranslations("client.certificate");
  const locale = useLocale();
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);

  const load = useCallback(async () => {
    const certs = await listCertificatesForClient(
      companyName ?? "Electricité Pro SA"
    );
    setCertificates(certs);
  }, [companyName]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDownload = async (cert: CertificateData) => {
    setDownloading(cert.id);
    try {
      const blob = await generateCertificatePDF(cert);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeName = cert.companyName.replace(/\s+/g, "_");
      a.download = `CETe_certificat_${safeName}_${cert.evaluationDate}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(null);
    }
  };

  function statusBadge(status: CertificateData["status"]) {
    if (status === "valide")
      return <Badge className="bg-green-100 text-green-700">{t("valid")}</Badge>;
    if (status === "expire")
      return <Badge className="bg-yellow-100 text-yellow-700">{t("expired")}</Badge>;
    return <Badge className="bg-red-100 text-red-700">{t("revoked")}</Badge>;
  }

  const dateLocale = locale === "fr" ? "fr-FR" : "en-GB";

  if (certificates.length === 0) return null;

  return (
    <div className="space-y-4">
      {certificates.map((cert) => (
        <Card
          key={cert.id}
          className={`${
            cert.status === "valide"
              ? "border-green-200 bg-gradient-to-r from-green-50 to-white"
              : "border-muted bg-muted/30"
          }`}
        >
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-green-600" />
              {t("title", { brand: "CETé", number: cert.certificateNumber })}
            </CardTitle>
            {statusBadge(cert.status)}
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Row label={t("rating")}>
                  <span className="rounded-lg bg-yellow-100 px-3 py-1 font-bold text-yellow-700">
                    {cert.rating}
                  </span>
                </Row>
                <Row label={t("vigiScore")}>
                  <span className="font-bold text-[#4DA6D9]">
                    {cert.vigiScore}
                    {cert.vigiScoreTendance}
                  </span>
                </Row>
                <Row label={t("evaluation")}>
                  {new Date(cert.evaluationDate).toLocaleDateString(dateLocale)}
                </Row>
                <Row label={t("validity")}>
                  {new Date(cert.validityDate).toLocaleDateString(dateLocale)}
                </Row>
                <Row label={t("expert")}>{cert.expertName}</Row>
                <div className="flex gap-2 pt-1">
                  <Badge variant="outline">
                    {t("autoEval", { value: cert.subCriteria.autoEvaluation })}
                  </Badge>
                  <Badge variant="outline">
                    {t("requirements", { value: cert.subCriteria.maitriseExigences })}
                  </Badge>
                  <Badge variant="outline">
                    {t("operational", { value: cert.subCriteria.maitriseOperationnelle })}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-4">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-2xl border-2 border-dashed border-green-300 bg-white">
                  <QrCode className="h-14 w-14 text-green-600" />
                  <div className="absolute -bottom-2 -right-2 rounded-full bg-green-500 p-1">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  {t("qrCode")}
                  <span className="font-mono">{cert.id.slice(-12)}</span>
                </p>
                <Button
                  onClick={() => handleDownload(cert)}
                  disabled={downloading === cert.id}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {downloading === cert.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  {t("downloadCert")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{children}</span>
    </div>
  );
}
