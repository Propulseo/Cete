"use client";

import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Minus,
  Shield,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";

const vigiScoreKeys = [
  { id: "C1", icon: CheckCircle, example: "A" },
  { id: "C2", icon: Shield, example: "B" },
  { id: "C3", icon: TrendingUp, example: "A" },
];

const levels = [
  {
    letter: "A",
    active: "bg-[#22C55E] text-white",
    muted: "bg-[#22C55E]/14 text-[#15803D]",
  },
  {
    letter: "B",
    active: "bg-[#A3E635] text-[#1A2940]",
    muted: "bg-[#A3E635]/20 text-[#4D7C0F]",
  },
  {
    letter: "C",
    active: "bg-[#F97316] text-white",
    muted: "bg-[#F97316]/14 text-[#C2410C]",
  },
  {
    letter: "D",
    active: "bg-[#EF4444] text-white",
    muted: "bg-[#EF4444]/13 text-[#B91C1C]",
  },
];

const tendencyKeys = [
  { key: "up", symbol: "A+", icon: TrendingUp, className: "border-[#22C55E]/35 bg-[#22C55E]/14" },
  { key: "stable", symbol: "A", icon: Minus, className: "border-[#87C4E8]/25 bg-white/[0.07]" },
  { key: "down", symbol: "A-", icon: TrendingDown, className: "border-[#EF4444]/35 bg-[#EF4444]/13" },
];

export function ExpertiseVigiScore() {
  const t = useTranslations("expertise.vigiScore");

  return (
    <section className="section-pad bg-white">
      <div className="container-page">
        <div className="mx-auto mb-[52px] max-w-[720px] text-center">
          <p className="type-kicker mb-4 inline-block rounded-full bg-[#4DA6D9]/12 px-4 py-2 text-[#1A2940]">
            {t("badge")}
          </p>
          <h2 className="type-h2-section mb-4 text-[#1A2940]">
            {t("headingPrefix")} VIGI-SCORE
            <span className="align-super text-[0.4em]">®</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-[1.7] text-[#4A6580]">
            {t("description")}
          </p>
        </div>

        <div className="mb-7 grid gap-[22px] md:grid-cols-3">
          {vigiScoreKeys.map((vigi) => {
            const activeLetter = vigi.example;

            return (
              <article
                key={vigi.id}
                className="group flex flex-col rounded-[18px] border border-subtle bg-grad-card px-[26px] py-7 transition-all duration-300 hover:-translate-y-1 hover:border-strong hover:shadow-cete-lg"
              >
                <div className="mb-[18px] flex items-center gap-3">
                  <span className="bg-grad-blue shadow-cete-sm inline-flex h-11 w-11 items-center justify-center rounded-[13px] text-sm font-bold text-white">
                    {vigi.id}
                  </span>
                  <vigi.icon className="h-5 w-5 text-[#1A7AB5]" />
                </div>

                <h3 className="type-h3-card mb-2.5 text-[#1A2940]">
                  {t(`${vigi.id}.title`)}
                </h3>
                <p className="mb-5 text-body-sm leading-[1.65] text-[#4A6580]">
                  {t(`${vigi.id}.description`)}
                </p>

                <div className="mt-auto flex gap-2">
                  {levels.map((level) => (
                    <span
                      key={level.letter}
                      className={`inline-flex h-[38px] w-[38px] items-center justify-center rounded-[10px] text-sm font-bold ${
                        level.letter === activeLetter ? level.active : level.muted
                      }`}
                    >
                      {level.letter}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <div className="bg-grad-ink shadow-cete-xl rounded-[22px] p-[clamp(28px,4vw,40px)] text-white">
          <h3 className="mb-7 font-display text-[clamp(19px,2vw,24px)] font-bold">
            {t("assemblyHeading")} <span className="text-[#E8630A]">{t("assemblyHighlight")}</span>
          </h3>

          <div className="mb-6 flex flex-wrap items-center gap-3.5">
            {vigiScoreKeys.map((vigi, index) => (
              <div key={vigi.id} className="flex items-center gap-3.5">
                <span className="inline-flex flex-col items-center gap-1.5">
                  <span className="text-label font-semibold uppercase tracking-[0.14em] text-[#87C4E8]">
                    {vigi.id}
                  </span>
                  <span
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-[14px] font-display text-[1.375rem] font-black ${
                      levels.find((level) => level.letter === vigi.example)?.active
                    }`}
                  >
                    {vigi.example}
                  </span>
                </span>
                {index < vigiScoreKeys.length - 1 && (
                  <span className="text-[1.375rem] text-[#87C4E8]">+</span>
                )}
              </div>
            ))}

            <ArrowRight className="h-6 w-6 text-[#E8630A]" />

            <span className="inline-flex flex-col items-center gap-1.5">
              <span className="text-label font-semibold uppercase tracking-[0.14em] text-[#E8630A]">
                {t("resultLabel")}
              </span>
              <span className="inline-flex h-14 min-w-[130px] items-center justify-center rounded-[14px] border border-[#E8630A]/50 bg-[#E8630A]/16 font-display text-[1.625rem] font-black tracking-[0.06em] text-white">
                ABA
              </span>
            </span>
          </div>

          <p className="mb-[30px] text-body leading-[1.7] text-[#8AA5BE]">
            {t("resultDescription")}
          </p>

          <div className="border-t border-on-dark pt-[26px]">
            <h4 className="mb-2 text-body font-semibold text-white">
              {t("tendencyHeading")} <span className="text-[#E8630A]">+ / -</span>
            </h4>
            <p className="mb-5 text-body-sm leading-[1.65] text-[#8AA5BE]">
              {t("tendencyDescription")}
            </p>
            <div className="flex flex-wrap gap-3.5">
              {tendencyKeys.map((tendency) => (
                <span
                  key={tendency.key}
                  className={`inline-flex items-center gap-2.5 rounded-xl border px-4 py-[11px] ${tendency.className}`}
                >
                  <tendency.icon className="h-4 w-4 text-white" />
                  <span className="font-display text-[1.0625rem] font-black text-white">
                    {tendency.symbol}
                  </span>
                  <span className="text-[0.8125rem] text-[#8AA5BE]">
                    {t(`tendency.${tendency.key}`)}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
