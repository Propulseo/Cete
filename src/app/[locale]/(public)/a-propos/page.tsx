import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  AboutHero,
  AboutOriginStory,
  AboutStats,
  AboutFounders,
  AboutWorldMap,
  AboutGouvernance,
  AboutValues,
  AboutRSE,
  AboutCTA,
} from "@/components/sections/about";
import { loadFounders } from "@/lib/vitrine-data";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { foundersJsonLd } from "@/lib/schema";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(locale as Locale, "/a-propos"),
    openGraph: buildOpenGraph(locale as Locale, "/a-propos"),
  };
}

export default async function AProposPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const founders = await loadFounders(locale as "fr" | "en");

  return (
    <>
      <JsonLd data={foundersJsonLd(founders, locale as Locale)} />
      <AboutHero />
      <AboutOriginStory />
      <AboutStats />
      <AboutFounders founders={founders} />
      <AboutWorldMap />
      <AboutGouvernance />
      <AboutValues />
      <AboutRSE />
      <AboutCTA />
    </>
  );
}
