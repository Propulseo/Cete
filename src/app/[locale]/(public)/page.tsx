import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return {
    // Titre complet de la home (le template "%s | CETé" doublerait la marque).
    title: { absolute: t("title") },
    description: t("description"),
    alternates: buildAlternates(locale as Locale, "/"),
    openGraph: buildOpenGraph(locale as Locale, "/"),
  };
}

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
