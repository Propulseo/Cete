import { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContactInfo } from "@/components/sections/ContactInfo";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez CETé pour un audit, une formation ou un accompagnement. Réponse garantie sous 24h.",
};

export default function ContactPage() {
  return (
    <>
      <HeroSection
        title="Contactez-nous"
        description="Prêts à transformer votre vigilance en énergie ?"
        size="small"
      />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Form */}
            <ContactForm />

            {/* Info */}
            <ContactInfo />
          </div>
        </div>
      </section>
    </>
  );
}
