"use client";

import Link from "next/link";
import { Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandName } from "@/components/ui/brand-name";

const levels = [
  { letter: "A", bg: "bg-[#22C55E]", text: "text-white" },
  { letter: "B", bg: "bg-[#A3E635]", text: "text-white" },
  { letter: "C", bg: "bg-[#F97316]", text: "text-white" },
  { letter: "D", bg: "bg-[#EF4444]", text: "text-white" },
];

export function ExpertiseCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#1A2940] via-[#0D5A8A] to-[#1A2940] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#4DA6D9]/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#1A2940]/10 blur-3xl animate-float animation-delay-500" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8630A]/30 bg-[#E8630A]/10 px-4 py-2 mb-8">
            <Target className="h-4 w-4 text-[#E8630A]" />
            <span className="text-sm font-medium text-[#E8630A]">Objectif AAA</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wide mb-6">
            OBJECTIF{" "}
            <span className="text-[#E8630A]">AAA</span>
          </h2>

          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Découvrez votre niveau de maîtrise du risque électrique et engagez
            une démarche d&apos;amélioration continue vers la notation AAA.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#E8630A] text-white hover:bg-[#B84D08] font-semibold px-8 py-6 text-lg rounded-full group shadow-lg shadow-[#E8630A]/25 hover:shadow-[#E8630A]/40 transition-all"
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
              <Link href="/a-propos">
                Découvrir <BrandName />
              </Link>
            </Button>
          </div>

          {/* 4 niveaux → notation composite */}
          <div className="mt-16 flex justify-center items-center gap-3">
            {levels.map((level) => (
              <div
                key={level.letter}
                className={`px-4 py-2 rounded-xl text-sm font-bold ${level.bg} ${level.text}`}
              >
                {level.letter}
              </div>
            ))}
            <ArrowRight className="h-5 w-5 text-white/40 mx-2" />
            <div className="px-4 py-2 rounded-xl text-sm font-bold bg-[#22C55E] text-white scale-110">
              AAA
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
