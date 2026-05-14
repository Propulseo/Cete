"use client";

import { useTranslations } from "next-intl";
import { Calendar, Users, Award, TrendingUp } from "lucide-react";
import { useCountUp } from "@/lib/hooks/useCountUp";

const stats = [
  { value: 20, suffix: "+", labelKey: "yearsLabel", icon: Calendar },
  { value: 200, suffix: "+", labelKey: "orgsLabel", icon: Users },
  { value: 4, suffix: "", labelKey: "foundersLabel", icon: Award },
  { value: 100, suffix: "%", labelKey: "satisfactionLabel", icon: TrendingUp },
];

export function AboutStats() {
  const t = useTranslations("about.stats");
  const counters = [
    useCountUp(20, 2000),
    useCountUp(200, 2000),
    useCountUp(4, 1500),
    useCountUp(100, 2000),
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-[#1A2940] via-[#0D5A8A] to-[#1A2940] relative overflow-hidden">
      <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-[#4DA6D9]/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-[#1A2940]/10 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const counter = counters[index];
            const Icon = stat.icon;
            return (
              <div key={stat.labelKey} ref={counter.ref} className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 mb-4 group-hover:bg-[#E8630A]/20 transition-colors">
                  <Icon className="h-10 w-10 text-[#4DA6D9]" />
                </div>
                <div className="text-5xl md:text-6xl font-display text-white mb-2">
                  {counter.count}{stat.suffix && <span className="text-[#E8630A]">{stat.suffix}</span>}
                </div>
                <p className="text-white/70">{t(stat.labelKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
