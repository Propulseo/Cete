"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutRSE() {
  const t = useTranslations("about.rse");

  return (
    <section className="section-pad relative overflow-hidden bg-gradient-to-b from-[#F4F9FD] to-white">
      {/* Decorative bubbles */}
      <div className="glow-blob absolute right-16 top-12 h-48 w-48" />
      <div className="glow-blob absolute bottom-16 left-12 h-64 w-64 bg-[#87C4E8]/10" />

      <div className="container-page relative z-10">
        <div className="mx-auto mb-11 max-w-[700px] text-center">
          <span className="type-kicker mb-4 inline-flex items-center gap-2 rounded-full bg-[#22C55E]/[0.12] px-4 py-2 text-[#15803D]">
            <Heart className="h-3.5 w-3.5" />
            {t("badge")}
          </span>
          <h2 className="type-h2-section mb-4 text-[#1A2940]">
            {t.rich("heading", {
              accent: (chunks) => (
                <span className="text-[#E8630A]">{chunks}</span>
              ),
            })}
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-[1.7] text-[#4A6580]">
            {t("subtitle")}
          </p>
        </div>

        <div className="mx-auto max-w-[1080px]">
          <div className="overflow-hidden rounded-3xl border border-subtle bg-white p-0 shadow-cete-xl md:p-0">
            <div className="grid items-center md:grid-cols-[0.8fr_1.2fr]">
              {/* Logo ESF */}
              <div className="flex min-h-[180px] items-center justify-center bg-[#F4F9FD] p-8 md:p-10">
                <Image
                  src="/images/partners/esf-logo.png"
                  alt={t("logoAlt")}
                  width={180}
                  height={180}
                  className="object-contain"
                />
              </div>

              {/* Content */}
              <div className="p-8 md:p-10">
                <h3 className="type-h3-card mb-4 text-[#1A2940] md:text-2xl">
                  {t("partnerTitle")}
                </h3>

                <p className="mb-4 leading-[1.75] text-[#4A6580]">
                  {t("paragraph1")}
                </p>

                <p className="mb-6 leading-[1.75] text-[#4A6580]">
                  {t("paragraph2")}
                </p>

                {/* Values tags */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {(["solidarity", "expertise", "commitment"] as const).map(
                    (key) => (
                      <span
                        key={key}
                         className="inline-flex items-center rounded-full bg-[#22C55E]/10 px-3.5 py-1.5 text-sm font-semibold text-[#15803D]"
                      >
                        {t(`tags.${key}`)}
                      </span>
                    )
                  )}
                </div>

                {/* CTA */}
                <Button
                  asChild
                  variant="outline"
                  className="group h-11 rounded-xl border-[#1A2940] text-body font-semibold text-[#1A2940] transition-all hover:-translate-y-0.5 hover:bg-[#1A2940] hover:text-white"
                >
                  <a
                    href="https://www.electriciens-sans-frontieres.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("cta")}
                    <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
