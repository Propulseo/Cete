import { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { getConseilServices } from "@/lib/data-loader";
import { Brain, Heart, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Services & Conseils",
  description:
    "Coaching managers, formation TST, accompagnement pédagogique. Une approche bienveillante basée sur les neurosciences.",
};

const approaches = [
  {
    icon: <Brain className="h-6 w-6" />,
    title: "Neurosciences appliquées",
    description:
      "Nos méthodes pédagogiques s'appuient sur les dernières avancées en neurosciences pour une meilleure rétention.",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Bienveillance",
    description:
      "Un accompagnement positif et constructif, centré sur la progression plutôt que la sanction.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Sur mesure",
    description:
      "Chaque entreprise est unique. Nos formations s'adaptent à votre contexte et vos enjeux spécifiques.",
  },
];

export default function ServicesPage() {
  const conseilServices = getConseilServices();

  return (
    <>
      <HeroSection
        title="Services & Conseils"
        description="Accompagnement sur mesure et sur étagère"
        size="small"
      />

      {/* Intro Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Notre Approche Pédagogique
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Chez CETé, nous croyons que la sécurité s&apos;apprend dans la
              bienveillance. Notre approche combine rigueur technique et
              pédagogie innovante, pour des formations qui marquent durablement
              les esprits et les comportements.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {approaches.map((approach, index) => (
              <div
                key={index}
                className="rounded-xl bg-secondary p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
                  {approach.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">
                  {approach.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {approach.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <ServicesGrid
        services={conseilServices}
        title="Nos Services"
        subtitle="Coaching et formation pour tous les niveaux de votre organisation"
      />

      {/* Process Section */}
      <ProcessSection />
    </>
  );
}
