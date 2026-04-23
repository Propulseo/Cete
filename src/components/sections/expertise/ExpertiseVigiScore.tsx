"use client";

import { BarChart3, CheckCircle, Shield, TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";

const vigiScores = [
  {
    id: "C1",
    icon: CheckCircle,
    name: "Auto-évaluation",
    description: "Capacité d'auto-évaluation : diagnostic factuel des pratiques, remontée d'information et culture du retour d'expérience.",
    example: "A",
  },
  {
    id: "C2",
    icon: Shield,
    name: "Recommandation & Amélioration",
    description: "Capacité à maîtriser les exigences de la Recommandation du Métier et à enclencher une boucle d'amélioration continue.",
    example: "B",
  },
  {
    id: "C3",
    icon: TrendingUp,
    name: "Gestes Métiers",
    description: "Capacité à maîtriser les gestes métiers : observation terrain, réflexes sécurité et savoir-faire opérationnel.",
    example: "A",
  },
];

const levels = [
  { letter: "A", color: "#22C55E", bg: "bg-green-100 text-green-700 border-green-200" },
  { letter: "B", color: "#A3E635", bg: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { letter: "C", color: "#F97316", bg: "bg-orange-100 text-orange-700 border-orange-200" },
  { letter: "D", color: "#EF4444", bg: "bg-red-100 text-red-700 border-red-200" },
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
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#4DA6D9]/10 text-[#1A2940] text-sm font-semibold uppercase tracking-wider mb-4">
            La Règle des 3C — Système de notation
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-[#1A2940] tracking-wide mb-4">
            LE{" "}
            <span className="text-[#E8630A]">VIGI-SCORE</span>
          </h2>
          <p className="text-lg text-[#4A6580] max-w-2xl mx-auto">
            La vigilance est liée à la maîtrise de la <strong>Règle des 3C</strong>.
            Chaque capacité est notée de{" "}
            <span className="text-[#22C55E] font-semibold">A</span> à{" "}
            <span className="text-[#EF4444] font-semibold">D</span>,
            puis les trois scores sont assemblés en notation composite triple-lettre.
          </p>
          <div className="w-24 h-1 bg-[#E8630A] mx-auto rounded-full mt-6" />
        </div>

        {/* 3 critères */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {vigiScores.map((vigi) => (
            <div
              key={vigi.id}
              className="group relative p-8 rounded-3xl bg-[#F4F9FD] border border-[#DAEEF8] hover:border-[#4DA6D9]/30 hover:shadow-xl transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#4DA6D9] flex items-center justify-center">
                  <vigi.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#E8630A] uppercase block">{vigi.id}</span>
                  <h3 className="font-display text-lg text-[#1A2940] font-bold leading-tight">{vigi.name}</h3>
                </div>
              </div>
              <p className="text-[#4A6580] mb-6 text-sm leading-relaxed">{vigi.description}</p>
              <div className="flex gap-2">
                {levels.map((l) => (
                  <div key={l.letter} className={`flex-1 text-center py-2 rounded-lg font-bold text-sm border ${l.bg}`}>
                    {l.letter}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Assemblage triple-lettre */}
        <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-[#1A2940] text-white mb-12">
          <h3 className="font-display text-2xl text-center mb-6">
            Assemblage en <span className="text-[#E8630A]">notation composite</span>
          </h3>
          <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
            {vigiScores.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-xs text-white/50 mb-1">{c.id}</div>
                  <span
                    className="inline-flex w-12 h-12 rounded-xl items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: levels.find((l) => l.letter === c.example)?.color }}
                  >
                    {c.example}
                  </span>
                </div>
                {i < vigiScores.length - 1 && <span className="text-white/30 text-xl">+</span>}
              </div>
            ))}
            <ArrowRight className="h-6 w-6 text-white/40 mx-2" />
            <div className="text-center">
              <div className="text-xs text-white/50 mb-1">Résultat</div>
              <span className="inline-flex px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4DA6D9] to-[#1A7AB5] text-white font-display font-bold text-2xl">
                ABA
              </span>
            </div>
          </div>
          <p className="text-white/50 text-sm text-center">
            L&apos;excellence traduite par un Triple A (AAA) représente une vigilance élevée
            et une probabilité d&apos;accident faible.
          </p>
        </div>

        {/* Tendance +/- */}
        <div className="max-w-xl mx-auto p-6 rounded-2xl bg-[#F4F9FD] border border-[#DAEEF8]">
          <h4 className="font-display text-lg text-center text-[#1A2940] font-bold mb-4">
            Indicateur de tendance <span className="text-[#E8630A]">+ / −</span>
          </h4>
          <p className="text-sm text-[#4A6580] text-center mb-6">
            Entre deux évaluations, chaque score peut être assorti d&apos;un modificateur.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {tendencies.map((t) => (
              <div key={t.label} className="text-center p-3 rounded-xl bg-white border border-[#DAEEF8]">
                <t.icon className={`w-6 h-6 mx-auto mb-1 ${t.color}`} />
                <div className={`font-bold ${t.color}`}>{t.symbol ? `A${t.symbol}` : "A"}</div>
                <div className="text-xs text-[#8AA5BE] mt-1">{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
