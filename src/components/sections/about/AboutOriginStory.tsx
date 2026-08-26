"use client";

import { useTranslations } from "next-intl";
import { Zap, Award, Shield, Building2, GraduationCap } from "lucide-react";
import { brandify } from "@/components/ui/brand-name";

const timelineIcons = [Building2, Award, GraduationCap, Shield, Zap];

export function AboutOriginStory() {
  const t = useTranslations("about.originStory");
  return (
    <section className="section-pad relative overflow-hidden bg-white">
      <div className="glow-blob absolute -right-48 -top-48 h-96 w-96" />

      <div className="container-page">
        <div>
          <div className="mb-14 text-center">
            <span className="type-kicker mb-4 inline-flex rounded-full bg-[#4DA6D9]/[0.12] px-4 py-2 text-[#1A2940]">
              {t("badge")}
            </span>
            <h2 className="type-h2-section mb-4 text-[#1A2940]">
              {t.rich("heading", {
                sup: (chunks) => <span className="text-[0.75em] align-super">{chunks}</span>,
              })}
            </h2>
          </div>

          <div className="mb-16 grid items-start gap-10 md:grid-cols-[1.1fr_0.9fr] lg:gap-[clamp(40px,5vw,72px)]">
            <div className="grid gap-[18px] text-base leading-[1.75] text-[#4A6580]">
              <p>
                {t.rich("narrative1", {
                  strong: (chunks) => <strong className="text-[#1A2940]">{chunks}</strong>,
                })}
              </p>
              <p>
                {t.rich("narrative2", {
                  strong: (chunks) => <strong className="text-[#1A2940]">{chunks}</strong>,
                })}
              </p>
              <p>
                {t.rich("narrative3", {
                  strong: (chunks) => <strong className="text-[#1A2940]">{chunks}</strong>,
                  sup: (chunks) => <span className="text-[0.75em] align-super">{chunks}</span>,
                })}
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8630A]">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <p className="text-[#1A2940] font-semibold">
                  {t("motto")}
                </p>
              </div>
            </div>

            <div className="relative rounded-[22px] bg-grad-ink p-7 text-white shadow-cete-xl">
              <p className="type-kicker mb-6 text-[#87C4E8]">{t("motto")}</p>
              {/* Photo patchwork grid */}
              <div className="grid grid-cols-2 gap-5">
                <div className="rounded-[14px] border border-on-dark bg-white/[0.07] p-5">
                  <div className="type-chiffre-cle mb-1 text-[32px] text-white">
                    20+
                  </div>
                  <p className="text-[12.5px] text-[#8AA5BE]">{t("statsYears")}</p>
                </div>
                <div className="flex items-center gap-3 rounded-[14px] border border-on-dark bg-white/[0.07] p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#4DA6D9]/25 text-[#87C4E8]">
                    <Zap className="h-5 w-5" />
                  </div>
                  <p className="text-[13.5px] font-semibold">{t("statsTerrain")}</p>
                </div>
                <div className="flex items-center gap-3 rounded-[14px] border border-on-dark bg-white/[0.07] p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#E8630A]/20 text-[#E8630A]">
                    <Award className="h-5 w-5" />
                  </div>
                  <p className="text-[13.5px] font-semibold">{t("statsNotation")}</p>
                </div>
                <div className="rounded-[14px] border border-on-dark bg-white/[0.07] p-5">
                  <div className="type-chiffre-cle mb-1 text-[32px] text-white">200+</div>
                  <p className="text-[12.5px] text-[#8AA5BE]">{t("statsOrgs")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-0">
            {timelineIcons.map((Icon, index) => (
              <div
                key={index}
                className="grid gap-4 border-t border-[#DAEEF8] py-6 md:grid-cols-[132px_1fr] md:gap-8 last:border-b"
              >
                <p className="text-[13.5px] font-bold tracking-[0.06em] text-[#E8630A]">
                  {t(`events.${index}.year`)}
                </p>
                <div className="flex gap-4">
                  <Icon className="mt-1 h-5 w-5 flex-shrink-0 text-[#4DA6D9]" />
                  <div>
                    <h3 className="type-h3-card mb-2 text-[#1A2940]">
                      {brandify(t(`events.${index}.title`))}
                    </h3>
                    <p className="text-[15px] leading-[1.7] text-[#4A6580]">
                      {brandify(t(`events.${index}.description`))}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
