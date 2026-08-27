import { Metadata } from "next";
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
    title: isEn ? "Privacy Policy" : "Politique de confidentialité",
    description: isEn
      ? "How CETé collects and protects your personal data."
      : "Comment CETé collecte et protège vos données personnelles.",
    alternates: buildAlternates(locale as Locale, "/privacy"),
    openGraph: buildOpenGraph(locale as Locale, "/privacy"),
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

export default function PrivacyPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="container-reading pb-[clamp(36px,4vw,56px)] pt-[clamp(24px,2.5vw,40px)]">
          <h1 className="type-h1-page text-[#1A2940]">POLITIQUE DE CONFIDENTIALITÉ</h1>
        </div>
      </section>

      <section className="bg-white pb-[clamp(56px,7vw,96px)]">
        <div className="container-reading">
          <article className="grid gap-0">
            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>1.</span>
                Responsable de traitement
              </h2>
              <p className={pClass}>
                Le responsable du traitement des données personnelles collectées sur le Site
                est : <TODO v="responsable de traitement (raison sociale)" />. Contact pour
                toute question relative aux données : <TODO v="DPO ou contact données personnelles" />
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>2.</span>
                Données collectées
              </h2>
              <p className={pClass}>Via le formulaire de contact et le formulaire de demande d&apos;évaluation :</p>
              <ul className="m-0 grid list-none gap-2.5 p-0">
                <li className="flex gap-3 text-[15.5px] leading-[1.75] text-[#4A6580]">
                  <span className="font-bold text-[#4DA6D9]">›</span>
                  identité et coordonnées : nom, email, société, téléphone ;
                </li>
                <li className="flex gap-3 text-[15.5px] leading-[1.75] text-[#4A6580]">
                  <span className="font-bold text-[#4DA6D9]">›</span>
                  pour une demande d&apos;évaluation : fonction du contact, SIREN, secteur,
                  effectif, type d&apos;évaluation, sites concernés et précisions que vous saisissez ;
                </li>
                <li className="flex gap-3 text-[15.5px] leading-[1.75] text-[#4A6580]">
                  <span className="font-bold text-[#4DA6D9]">›</span>
                  données techniques : adresse IP et user-agent de votre navigateur.
                </li>
              </ul>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>3.</span>
                Finalité
              </h2>
              <p className={pClass}>
                Ces données servent exclusivement à répondre à vos demandes et à assurer le
                suivi de la relation commerciale qui peut en découler. Elles ne sont ni vendues
                ni cédées à des tiers.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>4.</span>
                Base légale
              </h2>
              <p className={pClass}>
                Le traitement repose sur votre consentement au moment de l&apos;envoi du
                formulaire et sur l&apos;exécution de mesures précontractuelles prises à votre
                demande (article 6.1.a et 6.1.b du RGPD).
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>5.</span>
                Destinataires et sous-traitants
              </h2>
              <p className={pClass}>
                Les données sont conservées sur les infrastructures de nos sous-traitants
                techniques : Supabase (base de données et stockage), Brevo (envoi d&apos;emails),
                notre hébergeur (<TODO v="nom de l'hébergeur" />) ainsi qu&apos;un outil de mesure
                d&apos;audience respectueux de la vie privée. Chacun est lié par des engagements
                de confidentialité et de sécurité conformes au RGPD.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>6.</span>
                Durée de conservation
              </h2>
              <p className={pClass}>
                Les demandes de contact sont conservées pendant <strong className="text-[#1A2940]">3 ans</strong>, puis supprimées.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>7.</span>
                Vos droits
              </h2>
              <p className={pClass}>
                Conformément au RGPD et à la loi « Informatique et Libertés », vous disposez de
                droits d&apos;accès, de rectification, d&apos;effacement et d&apos;opposition sur
                vos données personnelles.
              </p>
              <p className={pClass}>
                Pour exercer ces droits, écrivez-nous à : contact@cete-notation.fr. Vous pouvez
                également introduire une réclamation auprès de la CNIL (www.cnil.fr).
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class}>
                <span className={markerClass}>8.</span>
                Cookies
              </h2>
              <p className={pClass}>
                Le Site n&apos;utilise aucun cookie publicitaire. Seuls des cookies techniques,
                nécessaires à son bon fonctionnement (session de connexion des espaces client et
                administrateur), sont utilisés.
              </p>
            </section>
          </article>
        </div>
      </section>
    </>
  );
}
