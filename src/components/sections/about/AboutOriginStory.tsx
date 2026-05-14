"use client";

import { useTranslations } from "next-intl";
import { Zap, Award, Shield, Building2, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { brandify } from "@/components/ui/brand-name";

const timelineIcons = [Building2, Award, GraduationCap, Shield, Zap];

export function AboutOriginStory() {
  const t = useTranslations("about.originStory");
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#4DA6D9]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-[#1A2940]/10 text-[#1A2940] hover:bg-[#1A2940]/20 mb-4">
              {t("badge")}
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl text-[#1A2940] tracking-wide mb-4">
              {t.rich("heading", {
                sup: (chunks) => <span className="text-[0.75em] align-super">{chunks}</span>,
              })}
            </h2>
            <div className="w-24 h-1 bg-[#E8630A] mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <p className="text-lg text-[#4A6580] leading-relaxed">
                {t.rich("narrative1", {
                  strong: (chunks) => <strong className="text-[#1A2940]">{chunks}</strong>,
                })}
              </p>
              <p className="text-lg text-[#4A6580] leading-relaxed">
                {t.rich("narrative2", {
                  strong: (chunks) => <strong className="text-[#1A2940]">{chunks}</strong>,
                })}
              </p>
              <p className="text-lg text-[#4A6580] leading-relaxed">
                {t.rich("narrative3", {
                  strong: (chunks) => <strong className="text-[#1A2940]">{chunks}</strong>,
                  sup: (chunks) => <span className="text-[0.75em] align-super">{chunks}</span>,
                })}
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="h-12 w-12 rounded-full bg-[#E8630A] flex items-center justify-center">
                  <Zap className="h-6 w-6 text-[#1A2940]" />
                </div>
                <p className="text-[#1A2940] font-semibold">
                  {t("motto")}
                </p>
              </div>
            </div>

            <div className="relative">
              {/* Photo patchwork grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#1A2940] to-[#0D5A8A] p-6 flex flex-col justify-center items-center text-center group overflow-hidden">
                  <div className="text-6xl font-display text-[#4DA6D9] mb-2 group-hover:scale-110 transition-transform duration-500">
                    20+
                  </div>
                  <p className="text-white/80 text-sm">{t("statsYears")}</p>
                </div>
                <div className="aspect-square rounded-2xl bg-[#4DA6D9]/10 border border-[#DAEEF8] flex items-center justify-center overflow-hidden">
                  <div className="text-center p-4">
                    <Zap className="h-12 w-12 text-[#E8630A] mx-auto mb-2" />
                    <p className="text-sm font-semibold text-[#1A2940]">{t("statsTerrain")}</p>
                  </div>
                </div>
                <div className="aspect-square rounded-2xl bg-[#F4F9FD] border border-[#DAEEF8] flex items-center justify-center overflow-hidden">
                  <div className="text-center p-4">
                    <Award className="h-12 w-12 text-[#4DA6D9] mx-auto mb-2" />
                    <p className="text-sm font-semibold text-[#1A2940]">{t("statsNotation")}</p>
                  </div>
                </div>
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#E8630A] to-[#B84D08] flex items-center justify-center overflow-hidden group">
                  <div className="text-center">
                    <div className="text-4xl font-display text-white mb-1 group-hover:scale-110 transition-transform duration-500">200+</div>
                    <p className="text-white/80 text-sm">{t("statsOrgs")}</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-3 animate-float z-10">
                <Shield className="h-8 w-8 text-[#1A2940]" />
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#E8630A] via-[#4DA6D9] to-[#1A2940] hidden md:block" />

            <div className="space-y-12">
              {timelineIcons.map((Icon, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div
                      className={`inline-block bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 ${
                        index % 2 === 0 ? "border-[#E8630A]" : "border-[#4DA6D9]"
                      }`}
                    >
                      <span className="text-sm font-bold text-[#E8630A]">{t(`events.${index}.year`)}</span>
                      <h3 className="text-xl font-bold text-[#1A2940] mt-1">{brandify(t(`events.${index}.title`))}</h3>
                      <p className="text-[#4A6580] mt-2">{brandify(t(`events.${index}.description`))}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg border-4 border-[#4DA6D9] z-10">
                    <Icon className="h-6 w-6 text-[#E8630A]" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
