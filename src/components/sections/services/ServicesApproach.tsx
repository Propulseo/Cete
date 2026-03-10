"use client";

import { Brain, Heart, Target, ArrowUpRight } from "lucide-react";

const approaches = [
  {
    icon: <Brain className="h-10 w-10" />,
    title: "Ancré terrain",
    subtitle: "pas théorique",
    description: "Chaque module est construit à partir de situations réelles observées lors de nos diagnostics. Mémorisation durable, pas de slides génériques.",
    number: "01",
  },
  {
    icon: <Heart className="h-10 w-10" />,
    title: "Orienté progression",
    subtitle: "pas sanction",
    description: "L'objectif est d'améliorer votre notation, pas de pointer les défauts. Coaching constructif, plan d'action concret, résultats mesurables.",
    number: "02",
  },
  {
    icon: <Target className="h-10 w-10" />,
    title: "Calibré sur votre notation",
    subtitle: "pas standard",
    description: "Le programme est défini à partir de votre Vigi-Score. Les axes les plus faibles de votre notation deviennent les priorités de l'accompagnement.",
    number: "03",
  },
];

export function ServicesApproach() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 font-display text-[15rem] text-gray-100 leading-none select-none whitespace-nowrap">
        PROGRESSION
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mb-20">
          <span className="text-[#EC8D19] font-bold text-sm tracking-widest uppercase">Notre méthode</span>
          <h2 className="font-display text-5xl md:text-6xl text-[#001a33] tracking-wide mt-4">
            CHAQUE PROGRAMME<br />
            <span className="text-[#001a33]">PART DE VOTRE NOTATION</span>
          </h2>
          <div className="w-24 h-1.5 bg-[#EC8D19] mt-6" />
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {approaches.map((approach, index) => (
            <div
              key={index}
              className={`group relative ${index === 1 ? 'md:mt-16' : index === 2 ? 'md:mt-32' : ''}`}
            >
              <div className="font-display text-8xl text-gray-100 group-hover:text-[#EC8D19]/20 transition-colors duration-500 absolute -top-10 -left-4">
                {approach.number}
              </div>

              <div className="relative bg-white border-2 border-gray-100 group-hover:border-[#EC8D19] rounded-3xl p-8 transition-all duration-500 group-hover:shadow-2xl">
                <div className="w-20 h-20 rounded-2xl bg-[#001a33] flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500">
                  {approach.icon}
                </div>

                <h3 className="text-2xl font-bold text-[#001a33]">
                  {approach.title}
                  <span className="block text-[#001a33] font-normal text-lg">{approach.subtitle}</span>
                </h3>

                <p className="text-gray-600 mt-4 leading-relaxed">
                  {approach.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-[#001a33] group-hover:text-[#EC8D19] transition-colors">
                  <span className="text-sm font-semibold">En savoir plus</span>
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
