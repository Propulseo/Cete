import { Search, Pencil, Rocket, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: <Search className="h-6 w-6" />,
    title: "Diagnostic",
    description: "Analyse approfondie de votre situation actuelle",
    color: "bg-primary",
  },
  {
    icon: <Pencil className="h-6 w-6" />,
    title: "Conception",
    description: "Élaboration d'un plan d'action sur mesure",
    color: "bg-[#1A2940]",
  },
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "Déploiement",
    description: "Mise en œuvre accompagnée des solutions",
    color: "bg-accent",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Suivi & Amélioration",
    description: "Mesure des résultats et optimisation continue",
    color: "bg-green-600",
  },
];

export function ProcessSection() {
  return (
    <section className="bg-secondary py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Notre Approche
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Un accompagnement structuré pour des résultats durables
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-border md:block" />

          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step number */}
                <div className="mb-4 flex justify-center">
                  <div
                    className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full ${step.color} text-white shadow-lg`}
                  >
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <div className="mb-2 text-sm font-medium text-muted-foreground">
                    Étape {index + 1}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
