"use client";

import { useCountUp } from "@/lib/hooks/useCountUp";
import { BarChart3 } from "lucide-react";

const omtStats = [
  { value: 133, label: "DPS réalisés" },
  { value: 43, label: "Entreprises auditées" },
  { value: 10108, label: "Exigences observées" },
  { value: 11000, label: "Faits terrain" },
];

export function ExpertiseOMT() {
  const counters = [
    useCountUp(133, 2000),
    useCountUp(43, 1500),
    useCountUp(10108, 2500),
    useCountUp(11000, 2500),
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-[#1A2940] via-[#0D5A8A] to-[#1A2940] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#4DA6D9]/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#4DA6D9]/5 blur-3xl animate-float animation-delay-500" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4DA6D9]/30 bg-[#4DA6D9]/10 px-4 py-2 mb-6">
            <BarChart3 className="h-4 w-4 text-[#4DA6D9]" />
            <span className="text-sm font-medium text-[#4DA6D9]">Observatoire O-M-T · 2022–2025</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wide mb-6">
            L&apos;OBSERVATOIRE DE LA{" "}
            <span className="text-[#E8630A]">MAÎTRISE DES TST</span>
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            L&apos;O-M-T capitalise les résultats des DPS Organisationnels et Opérationnels
            pour objectiver la maîtrise du risque électrique à l&apos;échelle sectorielle.
            Trois niveaux de lecture pour une vision complète.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {omtStats.map((stat, index) => {
            const counter = counters[index];
            return (
              <div
                key={stat.label}
                ref={counter.ref}
                className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <div className="font-display text-3xl md:text-4xl text-white leading-none mb-2">
                  {counter.count.toLocaleString("fr-FR")}
                </div>
                <div className="text-sm text-white/60 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
