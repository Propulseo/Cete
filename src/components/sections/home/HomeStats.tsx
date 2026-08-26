"use client";

import { useTranslations } from "next-intl";
import { useCountUp } from "@/lib/hooks/useCountUp";

const stats = [
  { value: 133, suffix: "", key: "dps" },
  { value: 43, suffix: "", key: "companies" },
  { value: 10108, suffix: "", key: "requirements" },
  { value: 11000, suffix: "", key: "fieldFacts" },
];

export function HomeStats() {
  const t = useTranslations("home.stats");

  const counters = [
    useCountUp(133, 2000),
    useCountUp(43, 1500),
    useCountUp(10108, 2500),
    useCountUp(11000, 2500),
  ];

  return (
    <section className="relative z-20 -mt-11 pb-4">
      <div className="container-page">
        <div className="rounded-[18px] border border-subtle bg-white/90 px-6 py-7 shadow-cete-xl backdrop-blur-sm md:px-11">
          <p className="type-kicker mb-6 text-[#1A7AB5]">
            {t("title")}
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-6">
            {stats.map((stat, index) => {
              const counter = counters[index];
              return (
                <div key={stat.key} ref={counter.ref} className="border-l-[3px] border-[#4DA6D9] pl-[18px]">
                  <div className="type-chiffre-cle text-[38px] text-[#1A2940]">
                    {counter.count.toLocaleString("fr-FR")}
                    <span className="text-[#E8630A]">{stat.suffix}</span>
                  </div>
                  <div className="mt-2 text-[13.5px] font-medium text-[#4A6580]">
                    {t(stat.key)}
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
