"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandName } from "@/components/ui/brand-name";

const trustedBy = ["EDF", "Engie", "Vinci Énergies", "Bouygues", "Eiffage", "SPIE"];

export function HomeHero() {
  return (
    <section className="relative min-h-[100vh] overflow-hidden bg-gradient-to-b from-[#DAEEF8] to-white">
      {/* Radial gradient overlay — soft blue accents */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 25% 35%, rgba(77,166,217,0.08), transparent 55%),
            radial-gradient(ellipse at 75% 65%, rgba(77,166,217,0.06), transparent 45%)
          `,
        }}
      />

      {/* Bubbles pattern overlay */}
      <div className="absolute inset-0 bg-bubbles-pattern" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white to-transparent" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#4DA6D9]/8 blur-3xl animate-float" />
      <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-[#87C4E8]/10 blur-3xl animate-float animation-delay-300" />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-[#4DA6D9]/5 blur-2xl animate-float animation-delay-500" />

      {/* Decorative bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full bg-[#4DA6D9]/[0.08] w-32 h-32 -top-8 -right-8" />
        <div className="absolute rounded-full bg-[#4DA6D9]/[0.12] w-20 h-20 bottom-12 left-4" />
        <div className="absolute rounded-full bg-[#87C4E8]/[0.15] w-48 h-48 top-1/2 right-1/4" />
        <div className="absolute rounded-full bg-[#4DA6D9]/[0.10] w-40 h-40 top-1/4 left-[15%]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 pt-20 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
          {/* Left content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4DA6D9]/10 border border-[#4DA6D9]/30 backdrop-blur-sm animate-slide-up">
              <span className="w-2 h-2 rounded-full bg-[#E8630A] animate-pulse" />
              <span className="text-sm text-[#4DA6D9] font-medium tracking-wide uppercase">
                Agence de Notation Indépendante
              </span>
            </div>

            {/* Main headline */}
            <h1 className="opacity-0 animate-slide-up animation-delay-100">
              <span className="block font-display text-5xl md:text-7xl lg:text-8xl text-[#1A2940] leading-[0.9] tracking-tight">
                VOTRE NOTATION
              </span>
              <span className="block font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight">
                <span className="text-[#1A2940]">DU </span>
                <span className="text-[#E8630A]">RISQUE</span>
              </span>
              <span className="block font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight text-gradient-accent">
                ÉLECTRIQUE
              </span>
            </h1>

            {/* Baseline + Slogan */}
            <div className="opacity-0 animate-slide-up animation-delay-150 space-y-3">
              <p className="text-lg md:text-xl text-[#4A6580] font-medium italic">
                La force d&apos;un collectif
              </p>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#E8630A]" />
                <span className="text-sm font-bold text-[#E8630A] tracking-widest uppercase">
                  Classer. Évaluer. Éclairer.
                </span>
              </div>
            </div>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-[#4A6580] max-w-xl leading-relaxed opacity-0 animate-slide-up animation-delay-200">
              L&apos;aptitude TST en un simple regard. <BrandName /> évalue et note chaque organisation
              sur 3 critères (A, B, C ou D) assemblés en{" "}
              <span className="text-[#4DA6D9] font-semibold">Vigi-Score</span> composite,
              de <span className="text-[#22C55E] font-semibold">AAA</span> à <span className="text-[#EF4444] font-semibold">DDD</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4 opacity-0 animate-slide-up animation-delay-300">
              <Button
                asChild
                size="lg"
                className="group bg-[#4DA6D9] text-white hover:bg-[#1A7AB5] text-lg px-8 py-6 font-semibold rounded-xl shadow-lg shadow-[#4DA6D9]/20 hover:shadow-xl hover:shadow-[#4DA6D9]/30 transition-all duration-300"
              >
                <Link href="/expertise">
                  Découvrir notre notation
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-[#E8630A] text-lg px-8 py-6 text-white hover:bg-[#B84D08] rounded-xl shadow-lg shadow-[#E8630A]/20 transition-all duration-300"
              >
                <Link href="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Demander une évaluation
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 opacity-0 animate-slide-up animation-delay-400">
              <p className="text-sm text-[#8AA5BE] mb-4 uppercase tracking-wider">200+ organisations évaluées</p>
              <div className="flex flex-wrap gap-6 items-center">
                {trustedBy.map((company) => (
                  <span
                    key={company}
                    className="text-[#8AA5BE] font-semibold text-lg hover:text-[#4A6580] transition-colors cursor-default"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right content - Rating visualization */}
          <div className="relative hidden lg:flex items-center justify-center opacity-0 animate-scale-in animation-delay-300 min-h-[520px] -mt-16">
            {/* Outer ring */}
            <div className="absolute w-[500px] h-[500px] rounded-full border border-[#4DA6D9]/10 animate-rotate-slow" />
            <div className="absolute w-[420px] h-[420px] rounded-full border border-[#4DA6D9]/5" />
            <div className="absolute w-[340px] h-[340px] rounded-full border border-[#4DA6D9]/20" />

            {/* Rating badges — 4 niveaux individuels A/B/C/D */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <div className="px-5 py-2.5 rounded-xl bg-[#22C55E]/25 border border-[#22C55E]/50 text-[#22C55E] font-bold text-lg animate-float shadow-lg shadow-[#22C55E]/10">
                A — Conforme
              </div>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              <div className="px-5 py-2.5 rounded-xl bg-[#EF4444]/25 border border-[#EF4444]/50 text-[#EF4444] font-bold text-lg animate-float animation-delay-300 shadow-lg shadow-[#EF4444]/10">
                D — Critique
              </div>
            </div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <div className="px-5 py-2.5 rounded-xl bg-[#A3E635]/25 border border-[#A3E635]/50 text-[#65A30D] font-bold text-lg animate-float animation-delay-500 shadow-lg shadow-[#A3E635]/10">
                B — Progrès
              </div>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <div className="px-5 py-2.5 rounded-xl bg-[#F97316]/25 border border-[#F97316]/50 text-[#F97316] font-bold text-lg animate-float animation-delay-700 shadow-lg shadow-[#F97316]/10">
                C — Alerte
              </div>
            </div>

            {/* Center element — Vigi-Score */}
            <div className="relative z-10 flex flex-col items-center justify-center w-64 h-64 rounded-full bg-gradient-to-br from-[#4DA6D9] to-[#1A7AB5] shadow-2xl shadow-[#4DA6D9]/30 animate-pulse-glow">
              <span className="text-sm text-white/80 font-medium uppercase tracking-wider mb-1">Vigi-Score</span>
              <span className="font-display text-5xl text-white mb-1">AAA</span>
              <span className="text-xs text-white/60 font-medium">Triple A — Excellence</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full">
          <path d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" fill="#FFFFFF" />
        </svg>
      </div>
    </section>
  );
}
