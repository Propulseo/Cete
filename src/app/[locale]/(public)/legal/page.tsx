import { Metadata } from "next";
import { BrandName } from "@/components/ui/brand-name";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Legal Notice" : "Mentions légales",
    description: isEn
      ? "Legal notice of the CETé website - Electrical Risk Rating Agency."
      : "Mentions légales du site CETé - Agence de Notation du Risque Électrique.",
    alternates: buildAlternates(locale as Locale, "/legal"),
    openGraph: buildOpenGraph(locale as Locale, "/legal"),
  };
}

/** Valeur en attente du client : volontairement criarde, interdite en prod par lint-placeholders. */
function TODO({ v }: { v: string }) {
  return (
    <span className="rounded bg-red-100 px-1 py-0.5 font-mono text-sm font-semibold text-red-700">
      [[À FOURNIR : {v}]]
    </span>
  );
}

export default function LegalPage() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl text-[#1A2940] mb-4">
          MENTIONS LÉGALES
        </h1>
        <div className="w-24 h-1 bg-[#E8630A] rounded-full mb-12" />

        <div className="prose prose-lg max-w-none text-[#4A6580]">
          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">1. Éditeur du site</h2>
          <p>
            Le site www.cete-notation.fr (ci-après « le Site ») est édité par{" "}
            <BrandName /> — Consortium Experts Techniques Électricité.
          </p>
          <p>
            Raison sociale : <TODO v="raison sociale" />
            <br />
            Forme juridique : <TODO v="forme juridique" />
            <br />
            Capital social : <TODO v="capital social" />
            <br />
            SIREN : <TODO v="SIREN" /> — SIRET du siège : <TODO v="SIRET" />
            <br />
            N° TVA intracommunautaire : <TODO v="numéro de TVA" />
            <br />
            Siège social : <TODO v="adresse du siège social" />
            <br />
            Téléphone : <TODO v="téléphone" />
            <br />
            Email : contact@cete-notation.fr
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">
            2. Directeur de la publication
          </h2>
          <p>
            <TODO v="nom et qualité du directeur de la publication" />
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">3. Hébergement</h2>
          <p>
            Le Site est hébergé par <TODO v="nom de l'hébergeur" />, <TODO v="adresse de l'hébergeur" />,{" "}
            <TODO v="téléphone de l'hébergeur" />.
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">
            4. Propriété intellectuelle
          </h2>
          <p>
            L&apos;ensemble des contenus du Site (textes, images, logos, méthodologie de
            notation, échelle AAA-DDD) est protégé par le droit de la propriété
            intellectuelle et appartient à <BrandName /> ou fait l&apos;objet d&apos;une
            autorisation d&apos;utilisation.
          </p>
          <p>
            CETé ADN<sup>®</sup> et Vigi-Score<sup>®</sup> sont des marques déposées :
            toute reproduction ou représentation, totale ou partielle, sans autorisation
            écrite préalable de <BrandName /> est interdite.
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">
            5. Limitation de responsabilité
          </h2>
          <p>
            <BrandName /> s&apos;efforce d&apos;assurer l&apos;exactitude des informations
            diffusées sur le Site. Toutefois, <BrandName /> ne saurait être tenu
            responsable des omissions, inexactitudes ou carences dans la mise à jour des
            informations.
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">
            6. Droit applicable
          </h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. Tout litige
            relatif à l&apos;utilisation du Site sera soumis à la compétence exclusive des
            tribunaux français.
          </p>
        </div>
      </div>
    </section>
  );
}
