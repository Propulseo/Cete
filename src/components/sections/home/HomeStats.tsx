"use client";

import { useCountUp } from "@/lib/hooks/useCountUp";

const stats = [
  { value: 200, suffix: "+", label: "Organisations évaluées" },
  { value: 20, suffix: "+", label: "Années d'expertise" },
  { value: 4, suffix: "", label: "Experts fondateurs" },
  { value: 98, suffix: "%", label: "Satisfaction client" },
];

export function HomeStats() {
  const counters = [
    useCountUp(200, 2000),
    useCountUp(20, 2000),
    useCountUp(4, 1500),
    useCountUp(98, 2000),
  ];

  return (
    <section className="relative z-20 -mt-10 pb-4">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-[#1A2940]/[0.04] border border-[#DAEEF8]/50 py-6 px-4 md:py-8 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-[#DAEEF8]">
            {stats.map((stat, index) => {
              const counter = counters[index];
              return (
                <div key={stat.label} ref={counter.ref} className="text-center lg:px-6">
                  <div className="font-display text-3xl md:text-4xl text-[#1A2940] leading-none">
                    {counter.count}
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
