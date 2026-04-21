import { Metadata } from "next";
import {
  ContactHero,
  ContactMain,
  ContactTrust,
} from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez CETé pour un audit, une formation ou un accompagnement. Réponse garantie sous 24h.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactMain />
      <ContactTrust />
    </>
  );
}
