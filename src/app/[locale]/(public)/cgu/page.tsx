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
    title: isEn ? "Terms of Use" : "Conditions Générales d'Utilisation",
    description: isEn
      ? "Terms of use of the CETé website - Electrical Risk Rating Agency."
      : "CGU du site CETé - Agence de Notation du Risque Électrique.",
    alternates: buildAlternates(locale as Locale, "/cgu"),
    openGraph: buildOpenGraph(locale as Locale, "/cgu"),
  };
}

const h2Class =
  "mb-3.5 flex gap-3 font-display text-[clamp(18px,2vw,22px)] font-bold leading-[1.3] text-[#1A2940]";
const markerClass = "font-body pt-1 text-body font-bold text-[#E8630A]";
const pClass = "mb-3.5 text-[0.96875rem] leading-[1.8] text-[#4A6580] last:mb-0";
const sectionClass = "border-t border-[#DAEEF8] py-7";

export default function CGUPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="container-reading pb-[clamp(36px,4vw,56px)] pt-[clamp(24px,2.5vw,40px)]">
          <h1 className="type-h1-page mb-3.5 text-[#1A2940]">
            CONDITIONS GÉNÉRALES D&apos;UTILISATION
          </h1>
          <p className="text-note font-semibold tracking-[0.04em] text-[#0D5A8A]">
            Dernière mise à jour : 21 avril 2026
          </p>
        </div>
      </section>

      <section className="bg-white pb-[clamp(56px,7vw,96px)]">
        <div className="container-reading">
          <article className="grid gap-0">
            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>1.</span>
                Objet
              </h2>
              <p className={pClass}>
                Les présentes Conditions Générales d&apos;Utilisation (CGU) définissent
                les modalités d&apos;accès et d&apos;utilisation du site internet
                www.cet-notation.com (ci-après « le Site »), édité par <BrandName /> - Consortium
                Experts Techniques Électricité.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>2.</span>
                Éditeur du Site
              </h2>
              <div className="rounded-[14px] border border-subtle bg-[#F4F9FD] px-[22px] py-5 text-body leading-[1.8] text-[#4A6580]">
                <p className="m-0">
                  <strong className="text-[#1A2940]">
                    <BrandName /> - Consortium Experts Techniques Électricité
                  </strong>
                  <br />
                  Agence de Notation indépendante du risque électrique
                  <br />
                  Email : contact@cet-notation.com
                </p>
              </div>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>3.</span>
                Accès au Site
              </h2>
              <p className={pClass}>
                Le Site est accessible gratuitement depuis tout lieu à tout utilisateur
                disposant d&apos;un accès Internet. Certaines sections du Site (Espace
                Client, Espace Administrateur) sont réservées aux utilisateurs
                disposant d&apos;identifiants de connexion.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>4.</span>
                Propriété intellectuelle
              </h2>
              <p className={pClass}>
                L&apos;ensemble des contenus présents sur le Site (textes, images,
                logos, méthodologie de notation, échelle AAA-DDD, Vigi-Score,
                référentiel ADN) sont protégés par le droit de la propriété
                intellectuelle et appartiennent à <BrandName /> ou font l&apos;objet d&apos;une
                autorisation d&apos;utilisation.
              </p>
              <p className={pClass}>
                Toute reproduction, représentation, modification, publication ou
                adaptation de tout ou partie des éléments du Site est interdite sans
                autorisation écrite préalable de <BrandName />.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>5.</span>
                Données personnelles
              </h2>
              <p className={pClass}>
                Les données personnelles collectées via le formulaire de contact ou
                l&apos;espace client sont traitées conformément au Règlement Général
                sur la Protection des Données (RGPD). Elles ne sont utilisées que
                dans le cadre de la relation commerciale et ne sont jamais cédées à
                des tiers.
              </p>
              <p className={pClass}>
                Conformément à la loi « Informatique et Libertés » et au RGPD, vous
                disposez d&apos;un droit d&apos;accès, de rectification, de
                suppression et d&apos;opposition sur vos données personnelles.
                Pour exercer ces droits, contactez-nous à : contact@cet-notation.com.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>6.</span>
                Cookies
              </h2>
              <p className={pClass}>
                Le Site utilise des cookies techniques nécessaires à son bon
                fonctionnement. Aucun cookie publicitaire ou de suivi n&apos;est
                utilisé sans votre consentement explicite.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>7.</span>
                Confidentialité des notations
              </h2>
              <p className={pClass}>
                Les résultats de notation, les Vigi-Scores et les certificats
                délivrés par <BrandName /> sont strictement confidentiels. Leur divulgation
                à des tiers n&apos;est possible qu&apos;avec l&apos;accord écrit de
                l&apos;organisation évaluée.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>8.</span>
                Limitation de responsabilité
              </h2>
              <p className={pClass}>
                <BrandName /> s&apos;efforce d&apos;assurer l&apos;exactitude des informations
                diffusées sur le Site. Toutefois, <BrandName /> ne saurait être tenu
                responsable des omissions, inexactitudes ou carences dans la mise à
                jour des informations.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>9.</span>
                Droit applicable
              </h2>
              <p className={pClass}>
                Les présentes CGU sont régies par le droit français. Tout litige
                relatif à l&apos;utilisation du Site sera soumis à la compétence
                exclusive des tribunaux français.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>10.</span>
                Contact
              </h2>
              <p className={pClass}>
                Pour toute question relative aux présentes CGU, vous pouvez nous
                contacter à l&apos;adresse : contact@cet-notation.com.
              </p>
            </section>
          </article>
        </div>
      </section>
    </>
  );
}
