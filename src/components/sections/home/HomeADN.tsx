"use client";

import Link from "next/link";
import { CheckCircle, Shield, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const threeCriteria = [
  { icon: CheckCircle, title: "Auto-évaluation", desc: "Capacité d'auto-évaluation — diagnostic factuel de vos pratiques actuelles." },
  { icon: Shield, title: "Recommandation & Amélioration", desc: "Capacité à maîtriser les exigences de la Recommandation du Métier." },
  { icon: TrendingUp, title: "Gestes Métiers", desc: "Capacité à maîtriser les gestes métiers — scoring terrain." },
];

const levels = [
  { letter: "A", color: "bg-[#22C55E]", label: "Conforme" },
  { letter: "B", color: "bg-[#A3E635]", label: "Progrès attendus" },
  { letter: "C", color: "bg-[#F97316]", label: "Alerte" },
  { letter: "D", color: "bg-[#EF4444]", label: "Non conforme" },
];

export function HomeADN() {
  return (
    <section className="py-24 bg-[#1A2940] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A2940] via-[#0D5A8A] to-[#1A2940] opacity-50" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="inline-block px-4 py-1 rounded-full bg-[#4DA6D9]/10 text-[#4DA6D9] text-sm font-semibold uppercase tracking-wider">
              Notation propriétaire
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
              MÉTHODE <span className="text-gradient-accent">ADN</span> — AGENCE DE NOTATION
            </h2>
            <p className="text-xl text-white/70 leading-relaxed">
              Notre référentiel produit une notation composite de{" "}
              <span className="text-[#22C55E] font-semibold">AAA</span> à{" "}
              <span className="text-[#EF4444] font-semibold">DDD</span>, fondée sur
              la <span className="text-[#E8630A] font-semibold">Règle des 3C</span> — trois capacités mesurables.
            </p>

            <div className="space-y-6 pt-4">
              {threeCriteria.map((step, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#4DA6D9]/10 flex items-center justify-center group-hover:bg-[#E8630A] transition-colors duration-300">
                    <step.icon className="w-6 h-6 text-[#4DA6D9] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg mb-1">{step.title}</h4>
                    <p className="text-white/60">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="mt-8 bg-white text-[#1A2940] hover:bg-[#4DA6D9] hover:text-white text-lg px-8 py-6 font-semibold rounded-xl transition-all duration-300"
            >
              <Link href="/expertise">
                Comprendre la notation
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* 3×4 pastilles — un score par critère */}
          <div className="relative flex items-center justify-center py-12">
            <div className="w-full max-w-md space-y-8">
              {threeCriteria.map((criterion, ci) => (
                <div key={ci}>
                  <div className="text-sm text-white/50 uppercase tracking-wider mb-3">
                    {criterion.title}
                  </div>
                  <div className="flex gap-3">
                    {levels.map((level) => (
                      <div
                        key={level.letter}
                        className="flex-1 text-center py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                      >
                        <div className={`w-8 h-8 rounded-full ${level.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                        <span className="text-white font-bold text-lg">{level.letter}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Assemblage triple-lettre */}
              <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-sm text-white/50 text-center mb-3 uppercase tracking-wider">
                  Assemblage → Notation composite
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-[#22C55E]/20 text-[#22C55E] font-bold">A</span>
                  <span className="text-white/30">+</span>
                  <span className="px-3 py-1 rounded-lg bg-[#A3E635]/20 text-[#A3E635] font-bold">B</span>
                  <span className="text-white/30">+</span>
                  <span className="px-3 py-1 rounded-lg bg-[#22C55E]/20 text-[#22C55E] font-bold">A</span>
                  <span className="text-white/40 mx-2">→</span>
                  <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#4DA6D9] to-[#1A7AB5] text-white font-display font-bold text-xl">
                    ABA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
