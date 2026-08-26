"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function ExpertiseHero() {
  const t = useTranslations("expertise.hero");

  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="glow-blob absolute left-[6%] top-10 h-[340px] w-[340px]" />

      <div className="container-reading relative z-10 py-[clamp(56px,7vw,104px)] pb-[clamp(56px,6vw,88px)] text-center">
        <div className="mx-auto max-w-[1000px]">
          <div className="type-kicker mb-6 inline-flex items-center gap-[9px] rounded-full border border-[#4DA6D9]/35 bg-white/65 px-[18px] py-[9px] text-[#1A7AB5] backdrop-blur-sm animate-slide-up">
            <span className="h-2 w-2 rounded-full bg-[#E8630A] shadow-[0_0_0_3px_rgba(232,99,10,0.18)]" />
            <span>{t("badge")}</span>
          </div>

          <h1 className="type-h1-page mb-6 text-[#1A2940] animate-slide-up animation-delay-100">
            {t("heading")} <span className="text-grad-title">ADN</span>
          </h1>

          <p className="mb-6 font-display text-[clamp(17px,1.7vw,21px)] italic text-[#0D5A8A] animate-slide-up animation-delay-200">
            <span className="font-semibold text-[#E8630A]">A</span>
            {t("subheading.part1")} {" "}
            <span className="font-semibold text-[#E8630A]">D</span>
            {t("subheading.part2")} {" "}
            <span className="font-semibold text-[#E8630A]">N</span>
            {t("subheading.part3")}
          </p>

          <p className="mx-auto mb-9 max-w-[740px] text-[16.5px] leading-[1.75] text-[#4A6580] animate-slide-up animation-delay-300">
            {t("description")}
          </p>

          <div className="flex flex-col justify-center gap-3.5 animate-slide-up animation-delay-400 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="shadow-cta h-12 rounded-xl bg-[#E8630A] px-7 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#B84D08]"
            >
              <Link href="/contact">
                {t("cta1")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border border-[#4DA6D9]/40 bg-white px-7 text-[15px] font-semibold text-[#0D5A8A] transition-all hover:-translate-y-0.5 hover:border-[#E8630A] hover:bg-white"
            >
              <Link href="/services">{t("cta2")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
