"use client";

import Link from "next/link";
import { CheckCircle, Shield, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { icon: CheckCircle, title: "Auto-évaluation", desc: "Où en êtes-vous ? Diagnostic factuel de vos pratiques actuelles." },
  { icon: Shield, title: "Conformité réglementaire", desc: "Vos obligations sont-elles couvertes ? Écarts mesurés, priorisés." },
  { icon: TrendingUp, title: "Maîtrise opérationnelle", desc: "Vos équipes maîtrisent-elles le risque au quotidien ? Scoring terrain." },
];

const ratingScale = [
  { rating: "AAA", color: "bg-green-500", width: "100%", label: "Maîtrise optimale" },
  { rating: "AA", color: "bg-green-400", width: "85%", label: "Très bonne maîtrise" },
  { rating: "A", color: "bg-lime-400", width: "70%", label: "Bonne maîtrise" },
  { rating: "BBB", color: "bg-yellow-400", width: "55%", label: "Maîtrise satisfaisante" },
  { rating: "BB", color: "bg-orange-400", width: "40%", label: "Maîtrise correcte" },
  { rating: "B", color: "bg-orange-500", width: "30%", label: "Maîtrise suffisante" },
  { rating: "CCC", color: "bg-red-400", width: "20%", label: "Risque modéré" },
  { rating: "DDD", color: "bg-red-600", width: "10%", label: "Risque critique" },
];

export function HomeADN() {
  return (
    <section className="py-24 bg-[#1A2940] relative overflow-hidden">
      {/* Subtle gradient overlay instead of grid pattern */}
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
              ADN — Agence De Notation. Notre référentiel propriétaire produit une notation
              de <span className="text-green-400 font-semibold">AAA</span> (maîtrise optimale)
              à <span className="text-red-400 font-semibold">DDD</span> (risque critique), fondée sur trois axes mesurables.
            </p>

            <div className="space-y-6 pt-4">
              {steps.map((step, i) => (
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

          <div className="relative flex items-center justify-center py-12">
            <div className="relative w-full max-w-md">
              {ratingScale.map((item) => (
                <div key={item.rating} className="flex items-center gap-4 mb-3 group">
                  <div className="w-12 text-right font-display text-lg text-white/80 group-hover:text-white transition-colors">
                    {item.rating}
                  </div>
                  <div className="flex-1 h-8 bg-white/10 rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-lg transition-all duration-500 group-hover:shadow-lg`}
                      style={{ width: item.width }}
                    />
                  </div>
                  <div className="w-40 text-sm text-white/50 group-hover:text-white/80 transition-colors hidden md:block">
                    {item.label}
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
