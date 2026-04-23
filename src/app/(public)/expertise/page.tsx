import {
  ExpertiseHero,
  ExpertiseVigiScore,
  ExpertiseADN,
  ExpertiseOMT,
  ExpertiseTertiles,
  ExpertiseComparison,
  ExpertiseServices,
  ExpertiseCTA,
} from "@/components/sections/expertise";

export default function ExpertisePage() {
  return (
    <>
      <ExpertiseHero />
      <ExpertiseVigiScore />
      <ExpertiseADN />
      <ExpertiseOMT />
      <ExpertiseTertiles />
      <ExpertiseComparison />
      <ExpertiseServices />
      <ExpertiseCTA />
    </>
  );
}
