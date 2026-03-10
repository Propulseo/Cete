"use client";

import Link from "next/link";
import { Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExpertiseCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#001a33] via-[#002244] to-[#001a33] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#EC8D19]/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#001a33]/10 blur-3xl animate-float animation-delay-500" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EC8D19]/30 bg-[#EC8D19]/10 px-4 py-2 mb-8">
            <Target className="h-4 w-4 text-[#EC8D19]" />
            <span className="text-sm font-medium text-[#EC8D19]">Objectif AAA</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wide mb-6">
            OBJECTIF{" "}
            <span className="text-[#EC8D19]">AAA</span>
          </h2>

          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Découvrez votre niveau de maîtrise du risque électrique et engagez
            une démarche d&apos;amélioration continue vers la notation AAA.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              <Link href="/a-propos">
                Découvrir CETé
              </Link>
            </Button>
          </div>

          <div className="mt-16 flex justify-center gap-3">
            {["AAA", "AA", "A", "BBB", "BB", "B", "CCC", "CC", "C", "DDD"].map((rating, i) => (
              <div
                key={rating}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                  i === 0
                    ? "bg-green-500 text-white scale-110"
                    : i < 3
                    ? "bg-green-500/20 text-green-400"
                    : i < 6
                    ? "bg-yellow-500/20 text-yellow-400"
                    : i < 9
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {rating}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
