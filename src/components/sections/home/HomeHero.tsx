"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustedBy = ["EDF", "Engie", "Vinci Énergies", "Bouygues", "Eiffage", "SPIE"];

export function HomeHero() {
  return (
    <section className="relative min-h-[100vh] overflow-hidden bg-[#001a33]">
      {/* Radial gradient overlay — blue + subtle orange accent */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 25% 35%, rgba(0,26,51,0.2), transparent 55%),
            radial-gradient(ellipse at 75% 65%, rgba(236,141,25,0.06), transparent 45%)
          `,
        }}
      />

      {/* Bubbles pattern overlay */}
      <div className="absolute inset-0 bg-bubbles-pattern" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-[#001a33] to-transparent" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#EC8D19]/8 blur-3xl animate-float" />
      <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-[#001a33]/8 blur-3xl animate-float animation-delay-300" />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-[#EC8D19]/5 blur-2xl animate-float animation-delay-500" />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 pt-20 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
          {/* Left content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#EC8D19]/30 backdrop-blur-sm animate-slide-up">
              <span className="w-2 h-2 rounded-full bg-[#EC8D19] animate-pulse" />
              <span className="text-sm text-[#EC8D19] font-medium tracking-wide uppercase">
                Agence de Notation Indépendante
              </span>
            </div>

            {/* Main headline */}
            <h1 className="opacity-0 animate-slide-up animation-delay-100">
              <span className="block font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] tracking-tight">
                VOTRE NOTATION
              </span>
              <span className="block font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight">
                <span className="text-gradient-accent">DU RISQUE</span>
              </span>
              <span className="block font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] tracking-tight">
                ÉLECTRIQUE
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white/70 max-w-xl leading-relaxed opacity-0 animate-slide-up animation-delay-200">
              CETé évalue, note et accompagne les organisations
              sur l&apos;échelle <span className="text-green-400 font-semibold">AAA</span> à <span className="text-red-400 font-semibold">DDD</span>.
              Un rating indépendant pour objectiver votre maîtrise du risque.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4 opacity-0 animate-slide-up animation-delay-300">
              <Button
                asChild
                size="lg"
                className="group bg-[#EC8D19] text-white hover:bg-[#F5A623] text-lg px-8 py-6 font-semibold rounded-xl shadow-lg shadow-[#EC8D19]/20 hover:shadow-xl hover:shadow-[#EC8D19]/30 transition-all duration-300"
              >
                <Link href="/expertise">
                  Découvrir notre notation
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-transparent text-lg px-8 py-6 border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 rounded-xl backdrop-blur-sm transition-all duration-300"
              >
                <Link href="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Demander une évaluation
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 opacity-0 animate-slide-up animation-delay-400">
              <p className="text-sm text-white/40 mb-4 uppercase tracking-wider">200+ organisations évaluées</p>
              <div className="flex flex-wrap gap-6 items-center">
                {trustedBy.map((company) => (
                  <span
                    key={company}
                    className="text-white/30 font-semibold text-lg hover:text-white/60 transition-colors cursor-default"
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
            <div className="absolute w-[500px] h-[500px] rounded-full border border-[#EC8D19]/10 animate-rotate-slow" />
            <div className="absolute w-[420px] h-[420px] rounded-full border border-white/5" />
            <div className="absolute w-[340px] h-[340px] rounded-full border border-[#001a33]/20" />

            {/* Rating badges floating around */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <div className="px-5 py-2.5 rounded-xl bg-green-500/25 border border-green-400/50 text-green-300 font-bold text-lg animate-float shadow-lg shadow-green-500/10">
                AAA
              </div>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              <div className="px-5 py-2.5 rounded-xl bg-red-500/25 border border-red-400/50 text-red-300 font-bold text-lg animate-float animation-delay-300 shadow-lg shadow-red-500/10">
                DDD
              </div>
            </div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <div className="px-5 py-2.5 rounded-xl bg-yellow-500/25 border border-yellow-400/50 text-yellow-300 font-bold text-lg animate-float animation-delay-500 shadow-lg shadow-yellow-500/10">
                BB+
              </div>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <div className="px-5 py-2.5 rounded-xl bg-blue-500/25 border border-blue-400/50 text-blue-300 font-bold text-lg animate-float animation-delay-700 shadow-lg shadow-blue-500/10">
                AA
              </div>
            </div>

            {/* Center element */}
            <div className="relative z-10 flex flex-col items-center justify-center w-64 h-64 rounded-full bg-gradient-to-br from-[#EC8D19] to-[#D07D15] shadow-2xl shadow-[#EC8D19]/30 animate-pulse-glow">
              <span className="font-display text-5xl text-white mb-1">CETé</span>
              <span className="text-sm text-white/80 font-medium">Notation AAA-DDD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full">
          <path d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" fill="#FCFCFC" />
        </svg>
      </div>
    </section>
  );
}
