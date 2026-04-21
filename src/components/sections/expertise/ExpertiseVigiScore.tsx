"use client";

import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";

const vigiScores = [
  {
    name: "Vigi-Score Technique",
    description: "Évalue la maîtrise technique des interventions et la conformité des équipements.",
    scores: ["A", "B", "C", "D"],
  },
  {
    name: "Vigi-Score Organisationnel",
    description: "Mesure la qualité des processus, de la documentation et du management de la prévention.",
    scores: ["A", "B", "C", "D"],
  },
  {
    name: "Vigi-Score Comportemental",
    description: "Évalue la culture sécurité, les réflexes terrain et l'appropriation des bonnes pratiques.",
    scores: ["A", "B", "C", "D"],
  },
];

const tendencies = [
  { symbol: "+", icon: TrendingUp, label: "Tendance à la hausse", color: "text-green-500" },
  { symbol: "", icon: Minus, label: "Stable", color: "text-[#4A6580]" },
  { symbol: "−", icon: TrendingDown, label: "Tendance à la baisse", color: "text-red-500" },
];

export function ExpertiseVigiScore() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#4DA6D9]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#4DA6D9]/10 text-[#1A2940] text-sm font-semibold uppercase tracking-wider mb-4">
            Système de notation
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-[#1A2940] tracking-wide mb-4">
            LES 3{" "}
            <span className="text-[#E8630A]">VIGI-SCORES</span>
          </h2>
          <p className="text-lg text-[#4A6580] max-w-2xl mx-auto">
            Chaque organisation est évaluée sur 3 Vigi-Scores distincts, notés de{" "}
            <span className="text-green-500 font-semibold">A</span> (excellence) à{" "}
            <span className="text-red-500 font-semibold">D</span> (insuffisant).
            Chaque lettre peut être accompagnée d&apos;un{" "}
            <span className="font-semibold">« + »</span> ou{" "}
            <span className="font-semibold">« − »</span> pour illustrer la tendance
            entre deux évaluations.
          </p>
          <div className="w-24 h-1 bg-[#E8630A] mx-auto rounded-full mt-6" />
        </div>

        {/* 3 Vigi-Scores */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {vigiScores.map((vigi, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-[#F4F9FD] border border-[#DAEEF8] hover:border-[#4DA6D9]/30 hover:shadow-xl transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#4DA6D9] flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-[#1A2940] font-bold">
                  {vigi.name}
                </h3>
              </div>
              <p className="text-[#4A6580] mb-6">{vigi.description}</p>
              <div className="flex gap-3">
                {vigi.scores.map((score, i) => (
                  <div
                    key={score}
                    className={`flex-1 text-center py-2 rounded-lg font-bold text-sm ${
                      i === 0
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : i === 1
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        : i === 2
                        ? "bg-orange-100 text-orange-700 border border-orange-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {score}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tendance +/- explanation */}
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#1A2940] text-white">
          <h3 className="font-display text-2xl text-center mb-6">
            Indicateur de tendance <span className="text-[#E8630A]">+ / −</span>
          </h3>
          <p className="text-white/70 text-center mb-8">
            Entre deux évaluations, chaque Vigi-Score peut être assorti d&apos;un indicateur
            de tendance reflétant l&apos;évolution de la performance.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {tendencies.map((t) => (
              <div key={t.label} className="text-center p-4 rounded-xl bg-white/5">
                <t.icon className={`w-8 h-8 mx-auto mb-2 ${t.color}`} />
                <div className={`font-bold text-lg ${t.color}`}>
                  {t.symbol ? `A${t.symbol}` : "A"}
                </div>
                <div className="text-xs text-white/50 mt-1">{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
