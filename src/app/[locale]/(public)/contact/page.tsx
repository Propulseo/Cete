import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ContactHero,
  ContactMain,
  ContactTrust,
} from "@/components/sections/contact";
import { loadContactInfo } from "@/lib/vitrine-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.hero" });
  return {
    title: locale === "en" ? "Contact & Assessment Request" : "Contact & Demande d'évaluation",
    description: t("description"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const contact = await loadContactInfo(locale as "fr" | "en");

  return (
    <>
      <ContactHero />
      <Suspense>
        <ContactMain contact={contact} />
      </Suspense>
      <ContactTrust />
    </>
  );
}
