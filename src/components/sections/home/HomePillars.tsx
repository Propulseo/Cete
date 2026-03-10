"use client";

import { Zap, Star, Users } from "lucide-react";
import { getPillars } from "@/lib/data-loader";

const icons = { zap: Zap, star: Star, users: Users };
const colors = {
  blue: "from-[#4DA6D9] to-[#1A7AB5]",
  yellow: "from-[#E8630A] to-[#B84D08]",
  green: "from-[#4DA6D9] to-[#0D5A8A]",
};

export function HomePillars() {
  const pillars = getPillars();

  return (
    <section className="py-24 bg-[#F4F9FD] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#4DA6D9]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4DA6D9]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#4DA6D9]/10 text-[#1A2940] text-sm font-semibold uppercase tracking-wider mb-4">
            Notre méthodologie
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1A2940] mb-6">
            ÉVALUER. NOTER. ACCOMPAGNER.
          </h2>
          <p className="text-xl text-[#4A6580]">
            Trois étapes structurées pour objectiver et améliorer votre maîtrise du risque électrique
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => {
            const Icon = icons[pillar.icon as keyof typeof icons] || Zap;
            const bgColor = colors[pillar.color as keyof typeof colors] || colors.blue;

            return (
              <div key={pillar.id} className="group relative">
                <div className="relative h-full p-8 rounded-3xl bg-white border border-[#DAEEF8] hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${bgColor} text-white mb-6 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl text-[#1A2940] group-hover:text-white mb-4 transition-colors duration-300">
                      {pillar.title.toUpperCase()}
                    </h3>
                    <p className="text-[#4A6580] group-hover:text-white/80 leading-relaxed transition-colors duration-300">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="absolute top-4 right-4 font-display text-6xl text-[#1A2940]/5 group-hover:text-white/10 transition-colors duration-300">
                    0{index + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
