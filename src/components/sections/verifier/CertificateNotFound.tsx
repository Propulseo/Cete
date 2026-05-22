import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandName } from "@/components/ui/brand-name";

export function CertificateNotFound({ id }: { id: string }) {
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
