import {
  HomeHero,
  HomeStats,
  HomePillars,
  HomeADN,
  HomeServices,
  HomeTestimonials,
  HomeFounders,
  HomeCTA,
} from "@/components/sections/home";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeStats />
      <HomePillars />
      <HomeADN />
      <HomeServices />
      <HomeTestimonials />
      <HomeFounders />
      <HomeCTA />
    </>
  );
}
