"use client";

import { Link } from "@/i18n/navigation";
import { useCountUp } from "@/lib/hooks/useCountUp";
import { ArrowRight, BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";

const omtStatKeys = [
  { value: 133, key: "stat1" },
  { value: 43, key: "stat2" },
  { value: 10108, key: "stat3" },
  { value: 11000, key: "stat4" },
];

export function ExpertiseOMT() {
  const t = useTranslations("expertise.omt");
  const counters = [
    useCountUp(133, 2000),
    useCountUp(43, 1500),
    useCountUp(10108, 2500),
    useCountUp(11000, 2500),
  ];

  return (
    <section className="relative overflow-hidden bg-[#1A2940] py-[clamp(56px,7vw,90px)]">
      <div className="glow-blob absolute -right-10 -top-20 h-[340px] w-[340px]" />

      <div className="container-page relative z-10">
        <div className="mx-auto mb-11 max-w-[780px] text-center">
          <p className="type-kicker mb-[18px] inline-flex items-center gap-2.5 rounded-full bg-[#87C4E8]/14 px-4 py-2 text-[#87C4E8]">
            <BarChart3 className="h-[15px] w-[15px]" />
            {t("badge")}
          </p>
          <h2 className="mb-4 font-display text-[clamp(24px,3vw,38px)] font-black uppercase leading-[1.15] text-white">
            {t("heading")} <span className="text-[#87C4E8]">{t("headingHighlight")}</span>
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-[1.7] text-[#8AA5BE]">
            {t("description")}
          </p>
        </div>

        <div className="mx-auto mb-10 grid max-w-4xl grid-cols-2 gap-[22px] lg:grid-cols-4">
          {omtStatKeys.map((stat, index) => {
            const counter = counters[index];

            return (
              <article
                key={stat.key}
                ref={counter.ref}
                className="rounded-[18px] border border-on-dark bg-white/[0.06] px-[22px] py-[26px]"
              >
                <p className="type-chiffre-cle mb-2 text-4xl text-white">
                  {counter.count.toLocaleString("fr-FR")}
                </p>
                <p className="text-sm font-medium leading-[1.45] text-[#8AA5BE]">
                  {t(stat.key)}
                </p>
              </article>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/observatoire"
            className="bg-grad-blue shadow-cete-lg inline-flex h-12 items-center gap-2.5 rounded-xl px-7 text-body font-semibold text-white transition-transform hover:-translate-y-0.5 hover:text-white"
          >
            {t("cta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
