"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Shield,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrandName } from "@/components/ui/brand-name";
import { getCertificateById } from "@/lib/repo/certificates.repo";
import type { CertificateData } from "@/types/certificate";

function StatusDisplay({ status }: { status: CertificateData["status"] }) {
  if (status === "valide") {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <Badge className="bg-green-100 text-green-700 text-lg px-4 py-1">
          Certificat Valide
        </Badge>
      </div>
    );
  }
  if (status === "expire") {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
          <AlertTriangle className="h-10 w-10 text-yellow-600" />
        </div>
        <Badge className="bg-yellow-100 text-yellow-700 text-lg px-4 py-1">
          Certificat Expiré
        </Badge>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <XCircle className="h-10 w-10 text-red-600" />
      </div>
      <Badge className="bg-red-100 text-red-700 text-lg px-4 py-1">
        Certificat Révoqué
      </Badge>
    </div>
  );
}

export default function VerifierPage() {
  const params = useParams();
  const id = params.id as string;
  const [cert, setCert] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getCertificateById(id);
    if (!data) {
      setNotFound(true);
    } else {
      setCert(data);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4DA6D9]" />
      </div>
    );
  }

  if (notFound) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-red-100 mb-6">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="font-display text-3xl text-[#1A2940] mb-4">
            Certificat non reconnu
          </h1>
          <p className="text-[#4A6580] mb-8">
            L&apos;identifiant <code className="font-mono bg-[#F4F9FD] px-2 py-1 rounded">{id}</code> ne correspond à aucun certificat <BrandName />.
            Vérifiez que le QR code scanné est correct.
          </p>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l&apos;accueil
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  if (!cert) return null;

  return (
    <section className="py-24 bg-gradient-to-b from-[#F4F9FD] to-white">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4DA6D9]/10 border border-[#4DA6D9]/30 mb-6">
            <Shield className="h-4 w-4 text-[#4DA6D9]" />
            <span className="text-sm font-medium text-[#4DA6D9]">
              Vérification de certificat <BrandName /> ADN
            </span>
          </div>

          <StatusDisplay status={cert.status} />
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8 space-y-6">
            <div className="text-center pb-4 border-b border-[#DAEEF8]">
              <p className="text-xs uppercase tracking-wider text-[#8AA5BE] mb-1">
                Certificat N°
              </p>
              <p className="font-mono font-bold text-lg text-[#1A2940]">
                {cert.certificateNumber}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoBlock label="Entreprise certifiée" value={cert.companyName} />
              <InfoBlock label={<>Notation <BrandName /> ADN</>}>
                <span className="inline-block rounded-lg bg-yellow-100 px-3 py-1 font-bold text-yellow-700 text-xl">
                  {cert.rating}
                </span>
              </InfoBlock>
              <InfoBlock label="Vigi-Score">
                <span className="font-bold text-lg text-[#4DA6D9]">
                  {cert.vigiScore}
                  {cert.vigiScoreTendance}
                </span>
              </InfoBlock>
              <InfoBlock label="Expert évaluateur" value={cert.expertName} />
              <InfoBlock
                label="Date d'évaluation"
                value={new Date(cert.evaluationDate).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
              <InfoBlock
                label="Date de validité"
                value={new Date(cert.validityDate).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
            </div>

            <div className="pt-4 border-t border-[#DAEEF8]">
              <p className="text-xs uppercase tracking-wider text-[#8AA5BE] mb-3">
                Sous-critères
              </p>
              <div className="grid grid-cols-3 gap-3">
                <SubScore
                  label="Auto-évaluation"
                  score={cert.subCriteria.autoEvaluation}
                />
                <SubScore
                  label="Exigences métier"
                  score={cert.subCriteria.maitriseExigences}
                />
                <SubScore
                  label="Maîtrise opérationnelle"
                  score={cert.subCriteria.maitriseOperationnelle}
                />
              </div>
            </div>

            <p className="text-xs text-[#8AA5BE] text-center pt-4">
              Ce certificat a été délivré par <BrandName /> — Agence de Notation
              indépendante du risque électrique, selon le référentiel <BrandName /> ADN.
            </p>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l&apos;accueil
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function InfoBlock({
  label,
  value,
  children,
}: {
  label: React.ReactNode;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-[#8AA5BE] mb-1">
        {label}
      </p>
      {children ?? <p className="font-semibold text-[#1A2940]">{value}</p>}
    </div>
  );
}

function SubScore({ label, score }: { label: string; score: string }) {
  return (
    <div className="rounded-xl bg-[#F4F9FD] p-3 text-center">
      <p className="text-xs text-[#8AA5BE] mb-1">{label}</p>
      <p className="font-bold text-[#1A2940] text-lg">{score}</p>
    </div>
  );
}
