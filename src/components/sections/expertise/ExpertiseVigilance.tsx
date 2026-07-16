"use client";

import { ShieldCheck, AlertTriangle, AlertOctagon, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

const ncKeys = [
  { key: "nc0", itemCount: 2, hasIntro: false },
  { key: "nc1", itemCount: 3, hasIntro: false },
  { key: "nc2", itemCount: 6, hasIntro: true },
];

function Accordion({ title, intro, items }: { title: string; intro?: string; items: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#DAEEF8] rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/80 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <AlertOctagon className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
          <span className="font-bold text-[#1A2940]">{title}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-[#8AA5BE] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5">
          {intro && (
            <p className="text-sm text-[#1A2940] font-medium mb-3">{intro}</p>
          )}
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[#4A6580]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ExpertiseVigilance() {
  const t = useTranslations("expertise.vigilance");
  return (
    <section className="py-24 bg-[#F4F9FD] relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4DA6D9]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#4DA6D9]/10 text-[#1A2940] text-sm font-semibold uppercase tracking-wider mb-4">
            {t("badge")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-[#1A2940] tracking-wide mb-4">
            {t("headingVigilance")}{" "}
            <span className="text-[#E8630A]">↔</span>{" "}
            {t("headingVulnerability")}
          </h2>
          <p className="text-lg text-[#4A6580] max-w-2xl mx-auto">
            {t("description")}
          </p>
          <div className="w-24 h-1 bg-[#E8630A] mx-auto rounded-full mt-6" />
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Jauge bi-directionnelle */}
          <div className="relative mb-12">
            <div className="flex rounded-2xl overflow-hidden h-16 shadow-lg">
              <div className="flex-1 bg-gradient-to-r from-[#22C55E] to-[#A3E635] flex items-center justify-center">
                <span className="text-white font-bold text-lg drop-shadow">{t("gaugeVigilance")}</span>
              </div>
              <div className="flex-1 bg-gradient-to-r from-[#F97316] to-[#EF4444] flex items-center justify-center">
                <span className="text-white font-bold text-lg drop-shadow">{t("gaugeVulnerability")}</span>
              </div>
            </div>
            <div className="flex justify-between mt-3">
              <span className="text-sm text-[#22C55E] font-semibold">{t("gaugeLow")}</span>
              <span className="text-sm text-[#EF4444] font-semibold">{t("gaugeHigh")}</span>
            </div>
          </div>

          {/* Deux colonnes */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 rounded-3xl bg-[#22C55E]/5 border border-[#22C55E]/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-[#22C55E]" />
                </div>
                <h3 className="font-display text-xl text-[#1A2940] font-bold">{t("vigilanceTitle")}</h3>
              </div>
              <p className="text-[#4A6580] leading-relaxed mb-4">
                {t("vigilanceDescription")}
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-lg bg-[#22C55E]/20 text-[#22C55E] font-bold text-sm">A</span>
                <span className="px-3 py-1 rounded-lg bg-[#A3E635]/20 text-[#65A30D] font-bold text-sm">B</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#EF4444]/5 border border-[#EF4444]/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#EF4444]/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
                </div>
                <h3 className="font-display text-xl text-[#1A2940] font-bold">{t("vulnerabilityTitle")}</h3>
              </div>
              <p className="text-[#4A6580] leading-relaxed mb-4">
                {t("vulnerabilityDescription")}
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-lg bg-[#F97316]/20 text-[#F97316] font-bold text-sm">C</span>
                <span className="px-3 py-1 rounded-lg bg-[#EF4444]/20 text-[#EF4444] font-bold text-sm">D</span>
              </div>
            </div>
          </div>

          {/* Non-conformités majeures → note D */}
          <div>
            <h3 className="font-display text-2xl text-[#1A2940] font-bold text-center mb-2">
              {t("ncHeading")} <span className="text-[#EF4444]">{t("ncHeadingHighlight")}</span>
            </h3>
            <p className="text-sm text-[#4A6580] text-center mb-8 max-w-lg mx-auto">
              {t("ncDescription")}
            </p>
            <div className="max-w-2xl mx-auto space-y-3">
              {ncKeys.map((nc) => (
                <Accordion
                  key={nc.key}
                  title={t(`${nc.key}.title`)}
                  intro={nc.hasIntro ? t(`${nc.key}.intro`) : undefined}
                  items={Array.from({ length: nc.itemCount }, (_, i) => t(`${nc.key}.items.${i}`))}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
