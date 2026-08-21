import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ContactHero,
  ContactMain,
  ContactTrust,
} from "@/components/sections/contact";
import { loadContactInfo } from "@/lib/vitrine-data";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/schema";
import { FaqSection } from "@/components/sections/FaqSection";
import { getFaq } from "@/data/faq";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(locale as Locale, "/contact"),
    openGraph: buildOpenGraph(locale as Locale, "/contact"),
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
  const faq = getFaq("contact", locale as Locale);

  return (
    <>
      <JsonLd data={faqJsonLd(faq)} />
      <ContactHero />
      <Suspense>
        <ContactMain contact={contact} />
      </Suspense>
      <FaqSection items={faq} />
      <ContactTrust />
    </>
  );
}
