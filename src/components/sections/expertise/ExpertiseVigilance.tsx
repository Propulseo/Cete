"use client";

import { AlertOctagon, AlertTriangle, ChevronDown, ShieldCheck } from "lucide-react";
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
    <div className="overflow-hidden rounded-[14px] border border-subtle bg-[#F4F9FD] transition-colors hover:border-[#E8630A] hover:bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3 font-semibold text-[#1A2940]">
          <AlertOctagon className="h-5 w-5 flex-shrink-0 text-[#E8630A]" />
          {title}
        </span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-[#8AA5BE] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5">
          {intro && <p className="mb-3 text-sm font-medium text-[#1A2940]">{intro}</p>}
          <ul className="grid gap-2">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-[1.6] text-[#4A6580]">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#EF4444]" />
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
    <section className="section-pad bg-[#F4F9FD]">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-[720px] text-center">
          <p className="type-kicker mb-4 inline-block rounded-full bg-[#4DA6D9]/14 px-4 py-2 text-[#1A2940]">
            {t("badge")}
          </p>
          <h2 className="type-h2-section mb-4 text-[#1A2940]">
            {t("headingVigilance")} <span className="text-[#E8630A]">↔</span> {t("headingVulnerability")}
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-[1.7] text-[#4A6580]">
            {t("description")}
          </p>
        </div>

        <div className="mx-auto mb-8 max-w-[820px]">
          <div className="mb-2.5 flex justify-between text-[12.5px] font-bold uppercase tracking-[0.08em]">
            <span className="text-[#15803D]">{t("gaugeVigilance")}</span>
            <span className="text-[#B91C1C]">{t("gaugeVulnerability")}</span>
          </div>
          <div className="h-2.5 rounded-full bg-[linear-gradient(to_right,#22C55E,#A3E635,#F97316,#EF4444)]" />
          <div className="mt-2.5 flex justify-between text-xs text-[#4A6580]">
            <span>{t("gaugeLow")}</span>
            <span>{t("gaugeHigh")}</span>
          </div>
        </div>

        <div className="mb-11 grid gap-[22px] md:grid-cols-2">
          <article className="rounded-[18px] border border-[#22C55E]/30 bg-white px-[26px] py-7 shadow-[0_12px_32px_-22px_rgba(21,128,61,0.3)]">
            <span className="mb-[18px] inline-flex h-11 w-11 items-center justify-center rounded-[13px] bg-[#22C55E]/14 text-[#15803D]">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h3 className="type-h3-card mb-2.5 text-[#1A2940]">{t("vigilanceTitle")}</h3>
            <p className="mb-[18px] text-[14.5px] leading-[1.7] text-[#4A6580]">
              {t("vigilanceDescription")}
            </p>
            <div className="flex gap-2">
              <span className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[#22C55E] font-bold text-white">
                A
              </span>
              <span className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[#A3E635]/20 font-bold text-[#4D7C0F]">
                B
              </span>
            </div>
          </article>

          <article className="rounded-[18px] border border-[#EF4444]/28 bg-white px-[26px] py-7 shadow-[0_12px_32px_-22px_rgba(185,28,28,0.3)]">
            <span className="mb-[18px] inline-flex h-11 w-11 items-center justify-center rounded-[13px] bg-[#EF4444]/12 text-[#B91C1C]">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <h3 className="type-h3-card mb-2.5 text-[#1A2940]">{t("vulnerabilityTitle")}</h3>
            <p className="mb-[18px] text-[14.5px] leading-[1.7] text-[#4A6580]">
              {t("vulnerabilityDescription")}
            </p>
            <div className="flex gap-2">
              <span className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[#F97316]/16 font-bold text-[#C2410C]">
                C
              </span>
              <span className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[#EF4444] font-bold text-white">
                D
              </span>
            </div>
          </article>
        </div>

        <div className="shadow-cete-lg mx-auto max-w-[860px] rounded-[20px] border border-subtle bg-white p-[clamp(24px,3.5vw,36px)]">
          <h3 className="mb-2.5 font-display text-xl font-bold text-[#1A2940]">
            {t("ncHeading")} <span className="text-[#EF4444]">{t("ncHeadingHighlight")}</span>
          </h3>
          <p className="mb-6 text-[15px] leading-[1.7] text-[#4A6580]">
            {t("ncDescription")}
          </p>
          <div className="grid gap-3">
            {ncKeys.map((nc) => (
              <Accordion
                key={nc.key}
                title={t(`${nc.key}.title`)}
                intro={nc.hasIntro ? t(`${nc.key}.intro`) : undefined}
                items={Array.from({ length: nc.itemCount }, (_, index) => t(`${nc.key}.items.${index}`))}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
