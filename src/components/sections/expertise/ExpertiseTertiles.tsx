"use client";

import { AlertTriangle, MinusCircle, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";

const tertileKeys = [
  {
    id: "vulnerables",
    key: "vulnerables",
    icon: AlertTriangle,
    styles: {
      border: "border-[#EF4444]/28",
      icon: "bg-[#EF4444]/12 text-[#B91C1C]",
      badge: "bg-[#EF4444]/10 text-[#B91C1C]",
      bullet: "text-[#EF4444]",
      quote: "border-[#EF4444]/40",
      footer: "border-[#EF4444]/20 text-[#B91C1C]",
      shadow: "shadow-[0_12px_32px_-24px_rgba(185,28,28,0.35)]",
    },
    traitsCount: 4,
  },
  {
    id: "ventre-mou",
    key: "ventreMou",
    icon: MinusCircle,
    styles: {
      border: "border-[#F97316]/28",
      icon: "bg-[#F97316]/13 text-[#C2410C]",
      badge: "bg-[#F97316]/10 text-[#C2410C]",
      bullet: "text-[#F97316]",
      quote: "border-[#F97316]/40",
      footer: "border-[#F97316]/20 text-[#C2410C]",
      shadow: "shadow-[0_12px_32px_-24px_rgba(194,65,12,0.3)]",
    },
    traitsCount: 4,
  },
  {
    id: "talents",
    key: "talents",
    icon: Trophy,
    styles: {
      border: "border-[#22C55E]/30",
      icon: "bg-[#22C55E]/13 text-[#15803D]",
      badge: "bg-[#22C55E]/10 text-[#15803D]",
      bullet: "text-[#22C55E]",
      quote: "border-[#22C55E]/45",
      footer: "border-[#22C55E]/20 text-[#15803D]",
      shadow: "shadow-[0_12px_32px_-24px_rgba(21,128,61,0.3)]",
    },
    traitsCount: 4,
  },
];

export function ExpertiseTertiles() {
  const t = useTranslations("expertise.tertiles");

  return (
    <section className="section-pad bg-white">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-[740px] text-center">
          <p className="type-kicker mb-4 inline-block rounded-full bg-[#4DA6D9]/12 px-4 py-2 text-[#1A2940]">
            {t("badge")}
          </p>
          <h2 className="type-h2-section mb-4 text-[#1A2940]">
            {t("heading")} <span className="text-grad-title">{t("headingHighlight")}</span> ?
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-[1.7] text-[#4A6580]">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-[22px] md:grid-cols-3">
          {tertileKeys.map((tert) => {
            const Icon = tert.icon;

            return (
              <article
                key={tert.id}
                className={`flex flex-col rounded-[18px] border bg-white px-[26px] py-7 ${tert.styles.border} ${tert.styles.shadow}`}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-[13px] ${tert.styles.icon}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className={`rounded-full px-3 py-1.5 text-[0.71875rem] font-semibold ${tert.styles.badge}`}>
                    {t(`${tert.key}.subtitle`)}
                  </span>
                </div>

                <h3 className="type-h3-card mb-3 text-[#1A2940]">{t(`${tert.key}.name`)}</h3>
                <blockquote className={`mb-[18px] border-l-[3px] pl-3.5 font-display text-body italic leading-[1.55] text-[#4A6580] ${tert.styles.quote}`}>
                  &laquo; {t(`${tert.key}.quote`)} &raquo;
                </blockquote>

                <ul className="mb-[18px] grid gap-[9px] text-note leading-[1.55] text-[#4A6580]">
                  {Array.from({ length: tert.traitsCount }, (_, index) => (
                    <li key={index} className="flex gap-2.5">
                      <span className={`font-bold ${tert.styles.bullet}`}>•</span>
                      {t(`${tert.key}.traits.${index}`)}
                    </li>
                  ))}
                </ul>

                <p className={`mt-auto border-t pt-4 text-xs font-bold uppercase tracking-[0.06em] ${tert.styles.footer}`}>
                  {t(`${tert.key}.riskLabel`)} - {t(`${tert.key}.risk`)}
                </p>
              </article>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-note leading-[1.65] text-[#15803D]">
          {t("note")}
        </p>
      </div>
    </section>
  );
}
