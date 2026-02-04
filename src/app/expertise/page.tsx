import { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { getExpertiseServices } from "@/lib/data-loader";
import { CheckCircle, Shield, TrendingUp, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Expertise - Agence de Notation",
  description:
    "La méthode ADN : Agence De Notation indépendante du risque électrique. Rating de AAA à DDD pour évaluer votre maîtrise opérationnelle.",
};

const adnPillars = [
  {
    icon: <CheckCircle className="h-8 w-8" />,
    title: "Auto-évaluation",
    description:
      "Diagnostic initial de votre situation actuelle. Analyse de vos pratiques et identification des points d'amélioration.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Respect du prescrit",
    description:
      "Vérification de la conformité réglementaire. Audit des procédures et documentation obligatoire.",
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Maîtrise opérationnelle",
    description:
      "Évaluation de la gestion quotidienne des risques. Mesure de la culture sécurité et des comportements terrain.",
  },
];

export default function ExpertisePage() {
  const expertiseServices = getExpertiseServices();

  return (
    <>
      <HeroSection
        title="La Méthode ADN"
        description="Agence De Notation : Rating indépendant du risque électrique"
        size="small"
      />

      {/* ADN Method Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Visual - Radar/Target */}
            <div className="relative order-2 lg:order-1">
              <div className="relative mx-auto aspect-square max-w-md">
                {/* Concentric circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-full rounded-full border-2 border-primary/10" />
                </div>
                <div className="absolute inset-8 flex items-center justify-center">
                  <div className="h-full w-full rounded-full border-2 border-primary/20" />
                </div>
                <div className="absolute inset-16 flex items-center justify-center">
                  <div className="h-full w-full rounded-full border-2 border-primary/30" />
                </div>
                <div className="absolute inset-24 flex items-center justify-center">
                  <div className="h-full w-full rounded-full border-2 border-accent/50" />
                </div>

                {/* Center target */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-accent shadow-lg">
                    <Target className="h-16 w-16 text-accent-foreground" />
                  </div>
                </div>

                {/* Rating labels */}
                <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                  AAA - Maîtrise optimale
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                  DDD - Risque critique
                </div>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                  BB
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                  AA
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Les 3 Piliers de la Méthode ADN
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Notre méthodologie exclusive permet d&apos;évaluer objectivement
                le niveau de maîtrise du risque électrique de votre
                organisation.
              </p>

              <div className="mt-8 space-y-6">
                {adnPillars.map((pillar, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      {pillar.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">
                        {pillar.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <div className="bg-secondary">
        <ServicesGrid
          services={expertiseServices}
          title="Nos Offres Expertise"
          subtitle="Des solutions adaptées à vos besoins d'évaluation et de certification"
        />
      </div>
    </>
  );
}
