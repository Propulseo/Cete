import { setRequestLocale } from "next-intl/server";
import {
  ServicesHero,
  ServicesPillars,
  ServicesProcess,
  ServicesCTA,
} from "@/components/sections/services";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ServicesHero />
      <ServicesPillars />
      <ServicesProcess />
      <ServicesCTA />
    </>
  );
}
