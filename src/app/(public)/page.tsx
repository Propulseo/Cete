import { HeroSection } from "@/components/sections/HeroSection";
import { PillarsSection } from "@/components/sections/PillarsSection";
import { ADNTeaser } from "@/components/sections/ADNTeaser";

export default function HomePage() {
  return (
    <>
      <HeroSection
        subtitle="Conseil Expertise Technique Électricité"
        title="Risques Électriques : Agence De Notation, Expertise, Conseils"
        description="Transformer la vigilance en énergie collective. CETé accompagne les entreprises vers la maîtrise optimale du risque électrique."
        primaryCTA={{
          label: "Découvrir notre méthode ADN",
          href: "/expertise",
        }}
        secondaryCTA={{
          label: "Qui sommes-nous ?",
          href: "/a-propos",
        }}
      />
      <PillarsSection />
      <ADNTeaser />
    </>
  );
}
