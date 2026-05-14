"use client";

import { useTranslations } from "next-intl";
import { MessageSquare } from "lucide-react";

export function ContactHero() {
  const t = useTranslations("contact.hero");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1A2940] via-[#0D5A8A] to-[#1A2940] py-20 md:py-24">
      {/* Decorative blurs */}
      <div className="absolute top-10 left-[10%] h-64 w-64 rounded-full bg-[#4DA6D9]/10 blur-3xl" />
      <div className="absolute bottom-10 right-[10%] h-48 w-48 rounded-full bg-[#4DA6D9]/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#E8630A]/30 bg-[#E8630A]/10 px-4 py-2">
            <MessageSquare className="h-4 w-4 text-[#E8630A]" />
            <span className="text-sm font-medium text-[#E8630A]">
              {t("badge")}
            </span>
          </div>

          <h1 className="font-display text-5xl tracking-wide text-white/90 md:text-6xl lg:text-7xl">
            {t("heading")}
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
            {t("description")}
          </p>
        </div>
      </div>
    </section>
  );
}
