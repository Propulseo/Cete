import {
  ServicesHero,
  ServicesApproach,
  ServicesCatalog,
  ServicesProcess,
  ServicesCTA,
} from "@/components/sections/services";

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesApproach />
      <ServicesCatalog />
      <ServicesProcess />
      <ServicesCTA />
    </>
  );
}
