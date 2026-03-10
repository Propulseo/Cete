"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExpertiseHero() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-hero-gradient">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-[10%] h-64 w-64 rounded-full bg-[#EC8D19]/10 blur-3xl animate-float" />
        <div className="absolute bottom-20 left-[15%] h-48 w-48 rounded-full bg-[#001a33]/20 blur-3xl animate-float animation-delay-300" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#EC8D19]/5 blur-3xl animate-pulse-glow" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EC8D19]/30 bg-[#EC8D19]/10 px-4 py-2 mb-8 animate-slide-up">
            <Sparkles className="h-4 w-4 text-[#EC8D19]" />
            <span className="text-sm font-medium text-[#EC8D19]">Méthodologie de notation</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-wide mb-6 animate-slide-up animation-delay-100">
            LA MÉTHODE{" "}
            <span className="text-[#EC8D19] relative">
              ADN
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-[#EC8D19]/50 rounded-full" />
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 font-light mb-6 animate-slide-up animation-delay-200">
            <span className="text-[#EC8D19] font-semibold">A</span>gence{" "}
            <span className="text-[#EC8D19] font-semibold">D</span>e{" "}
            <span className="text-[#EC8D19] font-semibold">N</span>otation
          </p>

          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up animation-delay-300">
            Rating indépendant du risque électrique. Une évaluation objective
            de votre maîtrise opérationnelle, de AAA à DDD.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-400">
            <Button
              asChild
              size="lg"
              className="bg-[#EC8D19] text-white hover:bg-[#D07D15] font-semibold px-8 py-6 text-lg rounded-full group shadow-lg shadow-[#EC8D19]/25 hover:shadow-[#EC8D19]/40 transition-all"
            >
              <Link href="/contact">
                Demander une évaluation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-full"
            >
              <Link href="/services">
                Voir l&apos;accompagnement
              </Link>
            </Button>
          </div>

          <div className="mt-16 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/30 mx-auto flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-[#EC8D19] rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full">
          <path
            d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
            fill="#FCFCFC"
          />
        </svg>
      </div>
    </section>
  );
}
