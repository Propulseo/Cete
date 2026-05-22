"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getCertificateById } from "@/lib/repo/certificates.repo";
import type { CertificateData } from "@/types/certificate";
import { CertificateNotFound } from "@/components/sections/verifier/CertificateNotFound";
import { CertificateCard } from "@/components/sections/verifier/CertificateCard";

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
    return <CertificateNotFound id={id} />;
  }

  if (!cert) return null;

  return <CertificateCard cert={cert} />;
}
