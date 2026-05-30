"use client";

import { AlertTriangle, MinusCircle, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";

const tertileKeys = [
  {
    id: "vulnerables",
    key: "vulnerables",
    icon: <AlertTriangle className="h-8 w-8" />,
    color: {
      bg: "bg-red-500/10",
      border: "border-red-500/30 hover:border-red-500",
      iconBg: "bg-red-500",
      text: "text-red-600",
      badge: "bg-red-500/20 text-red-600",
    },
    traitsCount: 4,
  },
  {
    id: "ventre-mou",
    key: "ventreMou",
    icon: <MinusCircle className="h-8 w-8" />,
    color: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30 hover:border-yellow-500",
      iconBg: "bg-yellow-500",
      text: "text-yellow-600",
      badge: "bg-yellow-500/20 text-yellow-600",
    },
    traitsCount: 4,
  },
  {
    id: "talents",
    key: "talents",
    icon: <Trophy className="h-8 w-8" />,
    color: {
      bg: "bg-green-500/10",
      border: "border-green-500/30 hover:border-green-500",
      iconBg: "bg-green-500",
      text: "text-green-600",
      badge: "bg-green-500/20 text-green-600",
    },
    traitsCount: 4,
  },
];

export function ExpertiseTertiles() {
  const t = useTranslations("expertise.tertiles");
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mb-16">
          <span className="text-[#E8630A] font-bold text-sm tracking-widest uppercase">
            {t("badge")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1A2940] tracking-wide mt-4">
            {t("heading")}{" "}
            <span className="text-[#E8630A]">{t("headingHighlight")}</span> ?
          </h2>
          <div className="w-24 h-1.5 bg-[#E8630A] mt-6" />
          <p className="text-lg text-[#4A6580] mt-6 max-w-xl">
            {t("description")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {tertileKeys.map((tert) => (
            <div
              key={tert.id}
              className={`group relative rounded-3xl border-2 ${tert.color.border} p-6 lg:p-8 transition-all duration-500 hover:shadow-2xl`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl ${tert.color.iconBg} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500`}>
                  {tert.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A2940]">{t(`${tert.key}.name`)}</h3>
                  <span className="text-sm text-[#8AA5BE]">{t(`${tert.key}.subtitle`)}</span>
                </div>
              </div>

              <blockquote className={`text-sm italic ${tert.color.text} bg-${tert.id === "vulnerables" ? "red" : tert.id === "ventre-mou" ? "yellow" : "green"}-50 rounded-xl p-4 mb-6 border-l-4 ${tert.id === "vulnerables" ? "border-red-500" : tert.id === "ventre-mou" ? "border-yellow-500" : "border-green-500"}`}>
                &laquo; {t(`${tert.key}.quote`)} &raquo;
              </blockquote>

              <ul className="space-y-2.5 mb-6">
                {Array.from({ length: tert.traitsCount }, (_, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#4A6580]">
                    <span className={`w-1.5 h-1.5 rounded-full ${tert.color.iconBg} flex-shrink-0 mt-1.5`} />
                    {t(`${tert.key}.traits.${i}`)}
                  </li>
                ))}
              </ul>

              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${tert.color.badge}`}>
                {t(`${tert.key}.riskLabel`)} - {t(`${tert.key}.risk`)}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[#4A6580] italic mt-12 max-w-2xl mx-auto">
          {t("note")}
        </p>
      </div>
    </section>
  );
}
