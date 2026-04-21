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

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeStats />
      <HomeServices />
      <HomePillars />
      <HomeADN />
      <HomeOrganizations />
      <HomeTestimonials />
      <HomeFounders />
      <HomeCTA />
    </>
  );
}
