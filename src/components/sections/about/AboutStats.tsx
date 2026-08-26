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
    <section className="relative overflow-hidden bg-[#F4F9FD] py-[clamp(44px,5vw,64px)]">
      <div className="container-page relative z-10">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-6">
          {stats.map((stat, index) => {
            const counter = counters[index];
            const Icon = stat.icon;
            return (
              <div key={stat.labelKey} ref={counter.ref} className="group rounded-[18px] border border-subtle bg-white p-6 shadow-cete-sm transition-all duration-300 hover:-translate-y-1 hover:border-strong hover:shadow-cete-lg">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[13px] bg-[#4DA6D9]/[0.12] text-[#0D5A8A] transition-colors group-hover:bg-[#E8630A]/[0.12] group-hover:text-[#B84D08]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="type-chiffre-cle text-[38px] text-[#1A2940]">
                  {counter.count}{stat.suffix && <span className="text-[#E8630A]">{stat.suffix}</span>}
                </div>
                <p className="mt-2 text-[13.5px] text-[#4A6580]">{t(stat.labelKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
