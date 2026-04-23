"use client";

import { useCountUp } from "@/lib/hooks/useCountUp";

const stats = [
  { value: 133, suffix: "", label: "DPS réalisés" },
  { value: 43, suffix: "", label: "Entreprises auditées" },
  { value: 10108, suffix: "", label: "Exigences observées" },
  { value: 11000, suffix: "", label: "Faits terrain observés" },
];

export function HomeStats() {
  const counters = [
    useCountUp(133, 2000),
    useCountUp(43, 1500),
    useCountUp(10108, 2500),
    useCountUp(11000, 2500),
  ];

  return (
    <section className="relative z-20 -mt-10 pb-4">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-[#1A2940]/[0.04] border border-[#DAEEF8]/50 py-6 px-4 md:py-8 md:px-6">
          <p className="text-center text-xs text-[#8AA5BE] font-medium uppercase tracking-widest mb-4">
            Observatoire O-M-T · 2022–2025
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-[#DAEEF8]">
            {stats.map((stat, index) => {
              const counter = counters[index];
              return (
                <div key={stat.label} ref={counter.ref} className="text-center lg:px-6">
                  <div className="font-display text-3xl md:text-4xl text-[#1A2940] leading-none">
                    {counter.count.toLocaleString("fr-FR")}
                    <span className="text-[#E8630A]">{stat.suffix}</span>
                  </div>
                  <div className="text-xs md:text-sm text-[#4A6580] mt-1.5 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
