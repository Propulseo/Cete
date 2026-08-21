import { setRequestLocale } from "next-intl/server";
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
