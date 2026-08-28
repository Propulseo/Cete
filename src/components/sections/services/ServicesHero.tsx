"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function ServicesHero() {
  const t = useTranslations("services.hero");

  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="glow-blob absolute right-[6%] top-[30px] h-[340px] w-[340px]" />

      <div className="container-reading relative z-10 pt-[clamp(24px,2.5vw,40px)] pb-[clamp(56px,6vw,88px)] text-center">
        <p className="type-kicker mb-6 inline-flex items-center gap-[9px] rounded-full border border-[#4DA6D9]/35 bg-white/65 px-[18px] py-[9px] text-[#1A7AB5] backdrop-blur-sm animate-slide-up">
          <span className="h-2 w-2 rounded-full bg-[#E8630A] shadow-[0_0_0_3px_rgba(232,99,10,0.18)]" />
          {t("badge")}
        </p>

        <h1 className="mb-6 font-display text-[clamp(30px,4.4vw,58px)] font-black uppercase leading-[1.06] text-[#1A2940] animate-slide-up animation-delay-100">
          {t("heading")}
        </h1>

        <p className="mx-auto mb-3.5 max-w-[720px] text-lead leading-[1.75] text-[#4A6580] animate-slide-up animation-delay-200">
          {t("description")}
        </p>
        <p className="mx-auto mb-9 max-w-[720px] font-display text-base italic leading-[1.6] text-[#0D5A8A] animate-slide-up animation-delay-300">
          {t("subdescription")}
        </p>

        <div className="flex flex-col justify-center gap-3.5 animate-slide-up animation-delay-400 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="shadow-cta h-12 rounded-xl bg-[#E8630A] px-7 text-body font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#B84D08]"
          >
            <Link href="/contact">
              {t("contactUs")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-xl border border-[#4DA6D9]/40 bg-white px-7 text-body font-semibold text-[#0D5A8A] transition-all hover:-translate-y-0.5 hover:border-[#E8630A] hover:bg-white"
          >
            <Link href="/expertise">{t("discoverRating")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
