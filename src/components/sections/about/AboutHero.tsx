"use client";

import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { brandify } from "@/components/ui/brand-name";

export function AboutHero() {
  const t = useTranslations("about.hero");
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="glow-blob absolute right-[8%] top-10 h-[360px] w-[360px]" />

      <div className="container-reading relative z-10 pt-[clamp(24px,2.5vw,40px)] pb-[clamp(56px,6vw,88px)] text-center">
        <div className="mx-auto max-w-4xl">
          <div className="type-kicker mb-6 inline-flex items-center gap-[9px] rounded-full border border-[#4DA6D9]/35 bg-white/65 px-[18px] py-[9px] text-[#1A7AB5] backdrop-blur-sm animate-slide-up">
            <Sparkles className="h-4 w-4 text-[#E8630A]" />
            <span>{t("badge")}</span>
          </div>

          <h1 className="type-h1-page mb-5 text-[#1A2940] animate-slide-up animation-delay-100">
            {t.rich("heading", {
              accent: (chunks) => (
                <span className="relative text-[#E8630A]">
                  {chunks}
                </span>
              ),
            })}
          </h1>

          <p className="mb-6 font-display text-[clamp(17px,1.7vw,21px)] italic text-[#0D5A8A] animate-slide-up animation-delay-200">
            {t.rich("subtitle", {
              serect: (chunks) => <span className="text-[#E8630A] font-semibold">{chunks}</span>,
              cete: (chunks) => <span className="text-[#E8630A] font-semibold">{chunks}<span className="text-[0.75em] align-super">é</span></span>,
            })}
          </p>

          <p className="mx-auto max-w-[700px] text-lead leading-[1.75] text-[#4A6580] animate-slide-up animation-delay-300">
            {brandify(t("description"))}
          </p>
        </div>
      </div>
    </section>
  );
}
