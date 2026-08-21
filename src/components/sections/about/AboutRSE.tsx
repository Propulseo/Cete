"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Heart, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AboutRSE() {
  const t = useTranslations("about.rse");

  return (
    <section className="py-24 bg-[#F4F9FD] relative overflow-hidden">
      {/* Decorative bubbles */}
      <div className="absolute top-12 right-16 w-48 h-48 rounded-full bg-[rgba(77,166,217,0.08)] blur-2xl" />
      <div className="absolute bottom-16 left-12 w-64 h-64 rounded-full bg-[rgba(77,166,217,0.06)] blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <Badge className="bg-[#1A2940] text-white hover:bg-[#0D5A8A] mb-4">
            <Heart className="h-3.5 w-3.5 mr-1.5" />
            {t("badge")}
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl text-[#1A2940] tracking-wide mb-4">
            {t.rich("heading", {
              accent: (chunks) => (
                <span className="text-[#E8630A]">{chunks}</span>
              ),
            })}
          </h2>
          <p className="text-lg text-[#4A6580] max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
          <div className="w-24 h-1 bg-[#E8630A] mx-auto rounded-full mt-6" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-[#DAEEF8] overflow-hidden">
            <div className="grid md:grid-cols-[240px_1fr] items-center">
              {/* Logo ESF */}
              <div className="flex items-center justify-center p-8 md:p-10 bg-gradient-to-br from-[#F4F9FD] to-white md:border-r border-b md:border-b-0 border-[#DAEEF8]">
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
                <h3 className="text-xl font-bold text-[#1A2940] mb-4">
                  {t("partnerTitle")}
                </h3>

                <p className="text-[#4A6580] leading-relaxed mb-4">
                  {t("paragraph1")}
                </p>

                <p className="text-[#4A6580] leading-relaxed mb-6">
                  {t("paragraph2")}
                </p>

                {/* Values tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {(["solidarity", "expertise", "commitment"] as const).map(
                    (key) => (
                      <span
                        key={key}
                        className="inline-flex items-center rounded-full bg-[#DAEEF8] px-3 py-1 text-sm font-medium text-[#0D5A8A]"
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
                  className="border-[#4DA6D9] text-[#1A7AB5] hover:bg-[#F4F9FD] group"
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
