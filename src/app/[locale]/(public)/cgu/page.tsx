import { Metadata } from "next";
import { BrandName } from "@/components/ui/brand-name";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "CGU du site CETé — Agence de Notation du Risque Électrique.",
};

export default function CGUPage() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl text-[#1A2940] mb-4">
          CONDITIONS GÉNÉRALES D&apos;UTILISATION
        </h1>
        <div className="w-24 h-1 bg-[#E8630A] rounded-full mb-12" />

        <div className="prose prose-lg max-w-none text-[#4A6580]">
          <p className="text-sm text-[#8AA5BE] mb-8">
            Dernière mise à jour : 21 avril 2026
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">
            1. Objet
          </h2>
          <p>
            Les présentes Conditions Générales d&apos;Utilisation (CGU) définissent
            les modalités d&apos;accès et d&apos;utilisation du site internet
            www.cete-notation.fr (ci-après « le Site »), édité par <BrandName /> — Consortium
            Experts Techniques Électricité.
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">
            2. Éditeur du Site
          </h2>
          <p>
            <BrandName /> — Consortium Experts Techniques Électricité<br />
            Agence de Notation indépendante du risque électrique<br />
            Email : contact@cete-notation.fr
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">
            3. Accès au Site
          </h2>
          <p>
            Le Site est accessible gratuitement depuis tout lieu à tout utilisateur
            disposant d&apos;un accès Internet. Certaines sections du Site (Espace
            Client, Espace Administrateur) sont réservées aux utilisateurs
            disposant d&apos;identifiants de connexion.
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">
            4. Propriété intellectuelle
          </h2>
          <p>
            L&apos;ensemble des contenus présents sur le Site (textes, images,
            logos, méthodologie de notation, échelle AAA-DDD, Vigi-Score,
            référentiel ADN) sont protégés par le droit de la propriété
            intellectuelle et appartiennent à <BrandName /> ou font l&apos;objet d&apos;une
            autorisation d&apos;utilisation.
          </p>
          <p>
            Toute reproduction, représentation, modification, publication ou
            adaptation de tout ou partie des éléments du Site est interdite sans
            autorisation écrite préalable de <BrandName />.
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">
            5. Données personnelles
          </h2>
          <p>
            Les données personnelles collectées via le formulaire de contact ou
            l&apos;espace client sont traitées conformément au Règlement Général
            sur la Protection des Données (RGPD). Elles ne sont utilisées que
            dans le cadre de la relation commerciale et ne sont jamais cédées à
            des tiers.
          </p>
          <p>
            Conformément à la loi « Informatique et Libertés » et au RGPD, vous
            disposez d&apos;un droit d&apos;accès, de rectification, de
            suppression et d&apos;opposition sur vos données personnelles.
            Pour exercer ces droits, contactez-nous à : contact@cete-notation.fr.
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">
            6. Cookies
          </h2>
          <p>
            Le Site utilise des cookies techniques nécessaires à son bon
            fonctionnement. Aucun cookie publicitaire ou de suivi n&apos;est
            utilisé sans votre consentement explicite.
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">
            7. Confidentialité des notations
          </h2>
          <p>
            Les résultats de notation, les Vigi-Scores et les certificats
            délivrés par <BrandName /> sont strictement confidentiels. Leur divulgation
            à des tiers n&apos;est possible qu&apos;avec l&apos;accord écrit de
            l&apos;organisation évaluée.
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">
            8. Limitation de responsabilité
          </h2>
          <p>
            <BrandName /> s&apos;efforce d&apos;assurer l&apos;exactitude des informations
            diffusées sur le Site. Toutefois, <BrandName /> ne saurait être tenu
            responsable des omissions, inexactitudes ou carences dans la mise à
            jour des informations.
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">
            9. Droit applicable
          </h2>
          <p>
            Les présentes CGU sont régies par le droit français. Tout litige
            relatif à l&apos;utilisation du Site sera soumis à la compétence
            exclusive des tribunaux français.
          </p>

          <h2 className="font-display text-2xl text-[#1A2940] mt-10 mb-4">
            10. Contact
          </h2>
          <p>
            Pour toute question relative aux présentes CGU, vous pouvez nous
            contacter à l&apos;adresse : contact@cete-notation.fr.
          </p>
        </div>
      </div>
    </section>
  );
}
