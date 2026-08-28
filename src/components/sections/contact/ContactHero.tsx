"use client";

import { useTranslations } from "next-intl";

export function ContactHero() {
  const t = useTranslations("contact.hero");

  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="glow-blob absolute right-[10%] top-5 h-[320px] w-[320px]" />

      <div className="container-reading relative z-10 pt-[clamp(24px,2.5vw,40px)] pb-[clamp(44px,5vw,72px)] text-center">
        <p className="type-kicker mb-6 inline-flex items-center gap-[9px] rounded-full border border-[#4DA6D9]/35 bg-white/65 px-[18px] py-[9px] text-[#1A7AB5] backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-[#E8630A] shadow-[0_0_0_3px_rgba(232,99,10,0.18)]" />
          {t("badge")}
        </p>

        <h1 className="mb-5 font-display text-[clamp(30px,4.4vw,56px)] font-black uppercase leading-[1.06] text-[#1A2940]">
          {t("heading")}
        </h1>

        <p className="mx-auto max-w-[620px] text-lead leading-[1.75] text-[#4A6580]">
          {t("description")}
        </p>
      </div>
    </section>
  );
}
