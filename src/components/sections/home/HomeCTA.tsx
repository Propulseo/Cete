"use client";

import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#001a33] via-[#002244] to-[#001a33] relative overflow-hidden">
      <div className="absolute top-10 left-10 w-64 h-64 bg-[#EC8D19]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#001a33]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#EC8D19] mb-8 animate-pulse-glow">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            CONNAISSEZ-VOUS VOTRE NOTATION ?
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Demandez votre évaluation initiale. En quelques jours, vous saurez où vous vous situez sur l&apos;échelle AAA-DDD et quels leviers activer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#EC8D19] text-white hover:bg-[#D07D15] text-lg px-10 py-6 font-semibold rounded-xl shadow-lg shadow-[#EC8D19]/20 hover:shadow-xl hover:shadow-[#EC8D19]/30 transition-all duration-300"
            >
              <Link href="/contact">
                Demander une évaluation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-transparent text-lg px-10 py-6 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-xl transition-all duration-300"
            >
              <Link href="/client">
                Espace Client
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
