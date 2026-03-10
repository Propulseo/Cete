"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#1A2940] via-[#0D5A8A] to-[#1A2940] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#4DA6D9]/10 blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#1A2940]/10 blur-3xl animate-float animation-delay-500" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8630A]/30 bg-[#E8630A]/10 px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-[#E8630A]" />
            <span className="text-sm font-medium text-[#E8630A]">Passez à l&apos;action</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wide mb-6">
            CONNAISSEZ-VOUS VOTRE{" "}
            <span className="text-[#E8630A]">NOTATION</span> ?
          </h2>

          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Demandez votre évaluation initiale et situez votre organisation
            sur l&apos;échelle AAA-DDD.
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
              <Link href="/expertise">
                Notre notation
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
