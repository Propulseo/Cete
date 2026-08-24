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
    <span className="rounded bg-red-100 px-1 py-0.5 font-mono text-sm font-semibold text-red-700">
      [[À FOURNIR : {v}]]
    </span>
  );
}

export default function PrivacyPage() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl text-[#1A2940] mb-4">
          POLITIQUE DE CONFIDENTIALITÉ
        </h1>
        <div className="w-24 h-1 bg-[#E8630A] rounded-full mb-12" />

        <div className="prose prose-lg max-w-none text-[#4A6580]">
          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">
            1. Responsable de traitement
          </h2>
          <p>
            Le responsable du traitement des données personnelles collectées sur le Site
            est : <TODO v="responsable de traitement (raison sociale)" />. Contact pour
            toute question relative aux données : <TODO v="DPO ou contact données personnelles" />
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">
            2. Données collectées
          </h2>
          <p>Via le formulaire de contact et le formulaire de demande d&apos;évaluation :</p>
          <ul>
            <li>identité et coordonnées : nom, email, société, téléphone ;</li>
            <li>pour une demande d&apos;évaluation : fonction du contact, SIREN, secteur,
            effectif, type d&apos;évaluation, sites concernés et précisions que vous saisissez ;</li>
            <li>données techniques : adresse IP et user-agent de votre navigateur.</li>
          </ul>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">3. Finalité</h2>
          <p>
            Ces données servent exclusivement à répondre à vos demandes et à assurer le
            suivi de la relation commerciale qui peut en découler. Elles ne sont ni vendues
            ni cédées à des tiers.
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">4. Base légale</h2>
          <p>
            Le traitement repose sur votre consentement au moment de l&apos;envoi du
            formulaire et sur l&apos;exécution de mesures précontractuelles prises à votre
            demande (article 6.1.a et 6.1.b du RGPD).
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">
            5. Destinataires et sous-traitants
          </h2>
          <p>
            Les données sont conservées sur les infrastructures de nos sous-traitants
            techniques : Supabase (base de données et stockage), Brevo (envoi d&apos;emails),
            notre hébergeur (<TODO v="nom de l'hébergeur" />) ainsi qu&apos;un outil de mesure
            d&apos;audience respectueux de la vie privée. Chacun est lié par des engagements
            de confidentialité et de sécurité conformes au RGPD.
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">
            6. Durée de conservation
          </h2>
          <p>
            Les demandes de contact sont conservées pendant{" "}
            <TODO v="durée de conservation des demandes de contact" />, puis supprimées.
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">7. Vos droits</h2>
          <p>
            Conformément au RGPD et à la loi « Informatique et Libertés », vous disposez de
            droits d&apos;accès, de rectification, d&apos;effacement et d&apos;opposition sur
            vos données personnelles.
          </p>
          <p>
            Pour exercer ces droits, écrivez-nous à : contact@cete-notation.fr. Vous pouvez
            également introduire une réclamation auprès de la CNIL (www.cnil.fr).
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">8. Cookies</h2>
          <p>
            Le Site n&apos;utilise aucun cookie publicitaire. Seuls des cookies techniques,
            nécessaires à son bon fonctionnement (session de connexion des espaces client et
            administrateur), sont utilisés.
          </p>
        </div>
      </div>
    </section>
  );
}
