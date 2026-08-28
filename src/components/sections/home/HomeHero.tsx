"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustedBy = ["EDF", "Engie", "Vinci Énergies", "Bouygues", "Eiffage", "SPIE"];

const ratingBadges = [
  {
    key: "ratingA",
    className:
      "left-1/2 top-[2%] -translate-x-1/2 border-[#22C55E]/45 bg-[#22C55E]/15 text-[#15803D]",
    delayClass: "",
  },
  {
    key: "ratingB",
    className:
      "left-[-4%] top-[47%] border-[#65A30D]/45 bg-[#A3E635]/15 text-[#4D7C0F]",
    delayClass: "animation-delay-200",
  },
  {
    key: "ratingC",
    className:
      "right-[-5%] top-[44%] border-[#F97316]/45 bg-[#F97316]/15 text-[#C2410C]",
    delayClass: "animation-delay-400",
  },
  {
    key: "ratingD",
    className:
      "bottom-[4%] left-1/2 -translate-x-1/2 border-[#EF4444]/45 bg-[#EF4444]/15 text-[#B91C1C]",
    delayClass: "animation-delay-600",
  },
];

export function HomeHero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="glow-blob absolute left-[5%] top-16 h-[340px] w-[340px]" />
      <div className="glow-blob absolute bottom-20 right-[8%] h-[420px] w-[420px] bg-[#87C4E8]/15" />
      <div className="pointer-events-none absolute inset-0 bg-bubbles-pattern opacity-70" />

      <div className="container-wide relative z-10 pt-[clamp(16px,1.6vw,24px)] pb-[clamp(40px,4.5vw,72px)]">
        <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-[clamp(40px,5vw,72px)]">
          <div>
            <div className="type-kicker mb-[12px] inline-flex items-center gap-[9px] rounded-full border border-[#4DA6D9]/35 bg-white/65 px-[18px] py-[9px] text-[#1A7AB5] backdrop-blur-sm animate-slide-up">
              <span className="h-2 w-2 rounded-full bg-[#E8630A] shadow-[0_0_0_3px_rgba(232,99,10,0.18)]" />
              <span>
                {t("badge")}
              </span>
            </div>

            <h1 className="mb-3 opacity-0 animate-slide-up animation-delay-100">
              <span className="type-h1-hero block text-[#1A2940]">
                {t("titleLine1")}
              </span>
              <span className="type-h1-hero block">
                <span className="text-[#1A2940]">{t("titleLine2")} </span>
                <span className="text-[#E8630A]">{t("titleLine3")}</span>
              </span>
              <span className="type-h1-hero text-grad-title block">
                {t("titleLine4")}
              </span>
            </h1>

            <div className="mb-3 space-y-2 opacity-0 animate-slide-up animation-delay-150">
              <p className="font-display text-[1.1875rem] italic text-[#1A2940]">
                {t("baseline")}
              </p>
              <div className="flex items-center gap-3">
                <span className="h-0.5 w-[34px] rounded-full bg-[#E8630A]" />
                <span className="text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-[#E8630A]">
                  {t("slogan")}
                </span>
              </div>
            </div>

            <p className="mb-4 max-w-[540px] text-[1.0625rem] leading-[1.7] text-[#4A6580] opacity-0 animate-slide-up animation-delay-200">
              {t("subtitle")}
            </p>

            <div className="mb-7 flex flex-wrap gap-3.5 opacity-0 animate-slide-up animation-delay-300">
              <Button
                asChild
                size="lg"
                className="bg-grad-blue shadow-cete-sm h-12 rounded-xl px-7 text-body font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-cete-lg"
              >
                <Link href="/expertise">
                  {t("discoverRating")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="shadow-cta h-12 rounded-xl bg-[#E8630A] px-7 text-body font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#B84D08]"
              >
                <Link href="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  {t("requestEvaluation")}
                </Link>
              </Button>
            </div>

            <div className="border-t border-subtle pt-4 opacity-0 animate-slide-up animation-delay-400">
              <p className="mb-3 text-note font-semibold text-[#1A2940]">
                {t("trustIndicator")}
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {trustedBy.map((company) => (
                  <span
                    key={company}
                    className="cursor-default text-caption font-semibold uppercase tracking-[0.05em] text-[#8AA5BE] transition-colors hover:text-[#4A6580]"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mx-auto hidden aspect-square w-full max-w-[520px] opacity-0 animate-scale-in animation-delay-300 md:block">
            <div className="absolute inset-0 rounded-full border border-[#4DA6D9]/30" />
            <div className="absolute inset-[11%] animate-rotate-slow rounded-full border border-dashed border-[#4DA6D9]/35" />
            <div className="absolute inset-[22%] rounded-full border border-[#4DA6D9]/25" />

            <div className="absolute inset-0 m-auto flex h-[52%] w-[52%] flex-col items-center justify-center rounded-full bg-gradient-to-br from-[#5FB3E3] to-[#1A7AB5] text-center text-white shadow-[0_24px_60px_-18px_rgba(13,90,138,0.5),inset_0_2px_14px_rgba(255,255,255,0.35)]">
              <span className="mb-1 text-label font-bold uppercase tracking-[0.16em] text-white/85">
                {t("vigiScore")}
              </span>
              <span className="font-display text-[clamp(44px,4.6vw,62px)] font-black leading-none text-white drop-shadow-sm">
                AAA
              </span>
              <span className="mt-1 text-[0.71875rem] font-medium text-white/90">
                {t("tripleA")}
              </span>
            </div>

            {ratingBadges.map((badge) => (
              <span
                key={badge.key}
                className={`absolute rounded-xl border px-[18px] py-[9px] text-note font-bold shadow-cete-sm backdrop-blur-sm animate-float ${badge.className} ${badge.delayClass}`}
              >
                {t(badge.key)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
