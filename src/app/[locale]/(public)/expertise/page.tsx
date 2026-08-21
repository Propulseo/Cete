import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ExpertiseHero,
  ExpertiseVigiScore,
  ExpertiseVigilance,
  ExpertiseOMT,
  ExpertiseTertiles,
  ExpertiseComparison,
  ExpertiseServices,
  ExpertiseCertificate,
  ExpertiseCTA,
} from "@/components/sections/expertise";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd, servicesJsonLd } from "@/lib/schema";
import { getExpertiseServices } from "@/lib/data-loader";
import { FaqSection } from "@/components/sections/FaqSection";
import { getFaq } from "@/data/faq";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "expertise.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(locale as Locale, "/expertise"),
    openGraph: buildOpenGraph(locale as Locale, "/expertise"),
  };
}

export default async function ExpertisePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const faq = getFaq("expertise", locale as Locale);

  return (
    <>
      <JsonLd
        data={servicesJsonLd(getExpertiseServices(locale as Locale), locale as Locale)}
      />
      <JsonLd data={faqJsonLd(faq)} />
      <ExpertiseHero />
      <ExpertiseVigiScore />
      <ExpertiseVigilance />
      <ExpertiseOMT />
      <ExpertiseTertiles />
      <ExpertiseComparison />
      <ExpertiseServices />
      <ExpertiseCertificate />
      <FaqSection items={faq} />
      <ExpertiseCTA />
    </>
  );
}
