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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HomeHero />
      <HomeStats />
      <HomeFounders />
      <HomeServices />
      <HomePillars />
      <HomeADN />
      <HomeOrganizations />
      <HomeTestimonials />
      <HomeCTA />
    </>
  );
}
