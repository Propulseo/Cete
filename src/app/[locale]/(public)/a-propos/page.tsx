import { setRequestLocale } from "next-intl/server";
import {
  AboutHero,
  AboutOriginStory,
  AboutStats,
  AboutFounders,
  AboutWorldMap,
  AboutGouvernance,
  AboutValues,
  AboutCTA,
} from "@/components/sections/about";

export default async function AProposPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <AboutHero />
      <AboutOriginStory />
      <AboutStats />
      <AboutFounders />
      <AboutWorldMap />
      <AboutGouvernance />
      <AboutValues />
      <AboutCTA />
    </>
  );
}
