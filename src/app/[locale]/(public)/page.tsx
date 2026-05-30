import { setRequestLocale } from "next-intl/server";
import {
  HomeHero,
  HomeStats,
  HomePillars,
  HomeADN,
  HomeServices,
  HomeOrganizations,
  HomeTestimonials,
  HomeFounders,
  HomeCTA,
} from "@/components/sections/home";
import { loadFounders, loadOrganizations } from "@/lib/vitrine-data";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [founders, organizations] = await Promise.all([
    loadFounders(locale as "fr" | "en"),
    loadOrganizations(),
  ]);

  return (
    <>
      <HomeHero />
      <HomeStats />
      <HomeFounders founders={founders} />
      <HomeServices />
      <HomePillars />
      <HomeADN />
      <HomeOrganizations organizations={organizations} />
      <HomeTestimonials />
      <HomeCTA />
    </>
  );
}
