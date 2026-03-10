"use client";

import { CheckCircle, Shield, TrendingUp, Target } from "lucide-react";

const adnPillars = [
  {
    icon: <CheckCircle className="h-8 w-8" />,
    title: "Axe 1 — Auto-évaluation",
    description:
      "Où en êtes-vous ? Diagnostic factuel de vos pratiques actuelles. Scoring de votre capacité d'auto-diagnostic et de remontée d'information.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Axe 2 — Conformité réglementaire",
    description:
      "Vos obligations sont-elles couvertes ? Audit des procédures, habilitations et documentation. Mesure des écarts par rapport au prescrit.",
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Axe 3 — Maîtrise opérationnelle",
    description:
      "Le risque est-il maîtrisé au quotidien ? Observation terrain des gestes, comportements et réflexes sécurité. Scoring de la culture prévention.",
  },
];

export function ExpertiseADN() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative mx-auto aspect-square max-w-md">
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

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-accent shadow-lg">
                  <Target className="h-16 w-16 text-accent-foreground" />
                </div>
              </div>

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

          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Les 3 axes de notation ADN
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Chaque notation CETé repose sur trois axes mesurables et reproductibles.
              Le scoring combiné produit votre notation finale de AAA à DDD.
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
  );
}
