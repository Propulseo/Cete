import { setRequestLocale } from "next-intl/server";
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

export default async function ExpertisePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ExpertiseHero />
      <ExpertiseVigiScore />
      <ExpertiseVigilance />
      <ExpertiseOMT />
      <ExpertiseTertiles />
      <ExpertiseComparison />
      <ExpertiseServices />
      <ExpertiseCertificate />
      <ExpertiseCTA />
    </>
  );
}
