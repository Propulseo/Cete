"use client";

import { XCircle, CheckCircle, AlertTriangle, Target } from "lucide-react";
import { useTranslations } from "next-intl";

const axeKeys = ["axis0", "axis1", "axis2", "axis3"];

const ecartKeys = [
  { number: "01", key: "gap0" },
  { number: "02", key: "gap1" },
  { number: "03", key: "gap2" },
];

export function ExpertiseComparison() {
  const t = useTranslations("expertise.comparison");
  return (
    <section className="py-32 bg-[#F4F9FD] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Comparison */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-[#E8630A] font-bold text-sm tracking-widest uppercase">
              {t("badge")}
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1A2940] tracking-wide mt-4 mb-6">
              {t("heading")}{" "}
              <span className="text-[#8AA5BE]">vs</span>{" "}
              <span className="text-[#E8630A]">{t("headingTalents")}</span>
            </h2>
            <div className="w-24 h-1.5 bg-[#E8630A] mx-auto" />
          </div>

          <div className="max-w-5xl mx-auto space-y-4">
            {/* Header */}
            <div className="hidden md:grid md:grid-cols-[1fr_1fr_1fr] gap-4 px-6 pb-2">
              <div className="text-sm font-bold text-[#1A2940] uppercase tracking-wider">{t("columnTheme")}</div>
              <div className="text-sm font-bold text-red-600 uppercase tracking-wider flex items-center gap-2">
                <XCircle className="h-4 w-4" /> {t("columnVulnerables")}
              </div>
              <div className="text-sm font-bold text-green-600 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> {t("columnTalents")}
              </div>
            </div>

            {axeKeys.map((key, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#DAEEF8] hover:border-[#4DA6D9]/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="grid md:grid-cols-[1fr_1fr_1fr] gap-4 p-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-[#E8630A] flex-shrink-0" />
                    <span className="font-bold text-[#1A2940]">{t(`${key}.theme`)}</span>
                  </div>
                  <div className="text-sm text-[#4A6580] md:border-l md:border-[#DAEEF8] md:pl-4">
                    <span className="md:hidden text-xs font-bold text-red-600 block mb-1">{t("columnVulnerables")} :</span>
                    {t(`${key}.vulnerable`)}
                  </div>
                  <div className="text-sm text-[#4A6580] md:border-l md:border-[#DAEEF8] md:pl-4">
                    <span className="md:hidden text-xs font-bold text-green-600 block mb-1">{t("columnTalents")} :</span>
                    {t(`${key}.talent`)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tiercé des écarts */}
        <div>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8630A]/30 bg-[#E8630A]/10 px-4 py-2 mb-6">
              <Target className="h-4 w-4 text-[#E8630A]" />
              <span className="text-sm font-medium text-[#E8630A]">{t("gapBadge")}</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-[#1A2940] tracking-wide">
              {t("gapHeading")} <span className="text-[#E8630A]">{t("gapHeadingHighlight")}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {ecartKeys.map((ecart) => (
              <div key={ecart.number} className="group relative">
                <div className="font-display text-7xl text-[#DAEEF8] group-hover:text-[#E8630A]/20 transition-colors duration-500 absolute -top-8 -left-2">
                  {ecart.number}
                </div>
                <div className="relative bg-white rounded-2xl p-8 border-2 border-[#DAEEF8] group-hover:border-[#E8630A] transition-all duration-500 hover:shadow-xl">
                  <h3 className="text-lg font-bold text-[#1A2940] mb-3">{t(`${ecart.key}.title`)}</h3>
                  <p className="text-sm text-[#4A6580] leading-relaxed">{t(`${ecart.key}.description`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
