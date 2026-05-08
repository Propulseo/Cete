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

export default function ExpertisePage() {
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
