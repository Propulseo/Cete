import { Metadata } from "next";
import { Suspense } from "react";
import {
  ContactHero,
  ContactMain,
  ContactTrust,
} from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "Contact & Demande d'évaluation",
  description:
    "Demandez une évaluation CETé ou posez vos questions. Entretien dans les meilleurs délais.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <Suspense>
        <ContactMain />
      </Suspense>
      <ContactTrust />
    </>
  );
}
