import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ServicesHero,
  ServicesPillars,
  ServicesProcess,
  ServicesCTA,
} from "@/components/sections/services";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd, servicesJsonLd } from "@/lib/schema";
import { getServices } from "@/lib/data-loader";
import { FaqSection } from "@/components/sections/FaqSection";
import { getFaq } from "@/data/faq";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(locale as Locale, "/services"),
    openGraph: buildOpenGraph(locale as Locale, "/services"),
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const faq = getFaq("services", locale as Locale);

  return (
    <>
      <JsonLd data={servicesJsonLd(getServices(locale as Locale), locale as Locale)} />
      <JsonLd data={faqJsonLd(faq)} />
      <ServicesHero />
      <ServicesPillars />
      <ServicesProcess />
      <FaqSection items={faq} />
      <ServicesCTA />
    </>
  );
}
