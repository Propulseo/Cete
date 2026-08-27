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
    <span className="inline-block rounded-[6px] border border-dashed border-[#E8630A]/45 bg-[#E8630A]/10 px-2 py-0.5 font-mono text-[12.5px] text-[#B84D08]">
      [[À FOURNIR : {v}]]
    </span>
  );
}

const h2Class =
  "mb-3.5 flex gap-3 font-display text-[clamp(18px,2vw,22px)] font-bold leading-[1.3] text-[#1A2940]";
const markerClass = "font-body pt-1 text-[15px] font-bold text-[#E8630A]";
const pClass = "mb-3.5 text-[15.5px] leading-[1.8] text-[#4A6580] last:mb-0";
const sectionClass = "border-t border-[#DAEEF8] py-7";

export default function LegalPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="container-reading pb-[clamp(36px,4vw,56px)] pt-[clamp(24px,2.5vw,40px)]">
          <h1 className="type-h1-page text-[#1A2940]">MENTIONS LÉGALES</h1>
        </div>
      </section>

      <section className="bg-white pb-[clamp(56px,7vw,96px)]">
        <div className="container-reading">
          <article className="grid gap-0">
            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>1.</span>
                Éditeur du site
              </h2>
              <p className={pClass}>
                Le site www.cete-notation.fr (ci-après « le Site ») est édité par{" "}
                <BrandName /> — Consortium Experts Techniques Électricité.
              </p>
              <div className="grid gap-2.5 rounded-[14px] border border-subtle bg-[#F4F9FD] px-[22px] py-5 text-[15px] leading-[1.7] text-[#4A6580]">
                <p className="m-0">
                  Raison sociale : <TODO v="raison sociale" />
                </p>
                <p className="m-0">
                  Forme juridique : <TODO v="forme juridique" />
                </p>
                <p className="m-0">
                  Capital social : <TODO v="capital social" />
                </p>
                <p className="m-0">
                  SIREN : <TODO v="SIREN" /> — SIRET du siège : <TODO v="SIRET" />
                </p>
                <p className="m-0">
                  N° TVA intracommunautaire : <TODO v="numéro de TVA" />
                </p>
                <p className="m-0">
                  Siège social : <TODO v="adresse du siège social" />
                </p>
                <p className="m-0">
                  Téléphone : <TODO v="téléphone" />
                </p>
                <p className="m-0">Email : contact@cete-notation.fr</p>
              </div>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>2.</span>
                Directeur de la publication
              </h2>
              <p className={pClass}>
                <TODO v="nom et qualité du directeur de la publication" />
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>3.</span>
                Hébergement
              </h2>
              <p className={pClass}>
                Le Site est hébergé par <TODO v="nom de l'hébergeur" />,{" "}
                <TODO v="adresse de l'hébergeur" />, <TODO v="téléphone de l'hébergeur" />.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>4.</span>
                Propriété intellectuelle
              </h2>
              <p className={pClass}>
                L&apos;ensemble des contenus du Site (textes, images, logos, méthodologie de
                notation, échelle AAA-DDD) est protégé par le droit de la propriété
                intellectuelle et appartient à <BrandName /> ou fait l&apos;objet d&apos;une
                autorisation d&apos;utilisation.
              </p>
              <p className={pClass}>
                CETé ADN<sup>®</sup> et Vigi-Score<sup>®</sup> sont des marques déposées :
                toute reproduction ou représentation, totale ou partielle, sans autorisation
                écrite préalable de <BrandName /> est interdite.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>5.</span>
                Limitation de responsabilité
              </h2>
              <p className={pClass}>
                <BrandName /> s&apos;efforce d&apos;assurer l&apos;exactitude des informations
                diffusées sur le Site. Toutefois, <BrandName /> ne saurait être tenu
                responsable des omissions, inexactitudes ou carences dans la mise à jour des
                informations.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>6.</span>
                Droit applicable
              </h2>
              <p className={pClass}>
                Les présentes mentions légales sont régies par le droit français. Tout litige
                relatif à l&apos;utilisation du Site sera soumis à la compétence exclusive des
                tribunaux français.
              </p>
            </section>
          </article>
        </div>
      </section>
    </>
  );
}
