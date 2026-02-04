import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Target, CheckCircle, Shield, TrendingUp } from "lucide-react";

const adnSteps = [
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: "Auto-évaluation",
    description: "Diagnostic initial de votre situation",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Respect du prescrit",
    description: "Conformité réglementaire",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Maîtrise opérationnelle",
    description: "Gestion quotidienne des risques",
  },
];

export function ADNTeaser() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              La Méthode ADN
            </h2>
            <p className="mt-2 text-lg font-medium text-primary">
              Agence De Notation : Rating indépendant du risque électrique
            </p>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Notre méthodologie exclusive permet d&apos;évaluer et noter
              objectivement le niveau de maîtrise du risque électrique de votre
              organisation, de AAA (maîtrise optimale) à DDD (risque critique).
            </p>

            <div className="mt-8 space-y-4">
              {adnSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button asChild size="lg" className="mt-8">
              <Link href="/expertise">En savoir plus</Link>
            </Button>
          </div>

          {/* Visual - Radar/Target */}
          <div className="relative">
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
                AAA
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                DDD
              </div>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                BB
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                AA
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
