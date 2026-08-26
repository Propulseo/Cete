"use client";

import { Pencil, Rocket, Search, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

const processKeys = [
  { icon: Search, title: "step1Title", description: "step1Desc", number: "01", tone: "blue" },
  { icon: Pencil, title: "step2Title", description: "step2Desc", number: "02", tone: "blue" },
  { icon: Rocket, title: "step3Title", description: "step3Desc", number: "03", tone: "orange" },
  { icon: TrendingUp, title: "step4Title", description: "step4Desc", number: "04", tone: "green" },
] as const;

const toneClass = {
  blue: "bg-grad-blue shadow-[0_8px_18px_-8px_rgba(13,90,138,0.5)]",
  orange: "bg-gradient-to-br from-[#E8630A] to-[#B84D08] shadow-[0_8px_18px_-8px_rgba(232,99,10,0.5)]",
  green: "bg-gradient-to-br from-[#22C55E] to-[#15803D] shadow-[0_8px_18px_-8px_rgba(34,197,94,0.5)]",
};

export function ServicesProcess() {
  const t = useTranslations("services.process");

  return (
    <section className="section-pad relative overflow-hidden bg-[#F4F9FD]">
      <div className="glow-blob absolute -bottom-20 -left-16 h-80 w-80" />

      <div className="container-page relative z-10">
        <div className="mx-auto mb-[52px] max-w-[660px] text-center">
          <h2 className="type-h2-section mb-4 text-[#1A2940]">{t("heading")}</h2>
          <p className="text-base leading-[1.7] text-[#4A6580]">{t("description")}</p>
        </div>

        <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
          {processKeys.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="shadow-cete-md relative flex min-h-[220px] flex-col rounded-[18px] border border-subtle bg-white px-[26px] py-[30px] transition-all duration-300 hover:-translate-y-1 hover:shadow-cete-lg"
              >
                <span className="absolute right-[22px] top-5 font-display text-[38px] font-black leading-none text-[#4DA6D9]/18">
                  {step.number}
                </span>
                <span className={`mb-[18px] inline-flex h-[46px] w-[46px] items-center justify-center rounded-[13px] text-white ${toneClass[step.tone]}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="type-h3-card mb-2.5 text-[#1A2940]">{t(step.title)}</h3>
                <p className="text-sm leading-[1.65] text-[#4A6580]">{t(step.description)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
