"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CheckCircle, Shield, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const threeCriteria = [
  { icon: CheckCircle, key: "criterion1" },
  { icon: Shield, key: "criterion2" },
  { icon: TrendingUp, key: "criterion3" },
];

const levels = [
  { letter: "A", color: "bg-[#22C55E]", key: "levelA" },
  { letter: "B", color: "bg-[#A3E635]", key: "levelB" },
  { letter: "C", color: "bg-[#F97316]", key: "levelC" },
  { letter: "D", color: "bg-[#EF4444]", key: "levelD" },
];

export function HomeADN() {
  const t = useTranslations("home.adn");

  return (
    <section className="section-pad bg-grad-ink relative overflow-hidden">
      <div className="glow-blob absolute -left-20 -top-24 h-[400px] w-[400px]" />

      <div className="container-page relative z-10">
        <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-[clamp(40px,5vw,72px)]">
          <div>
            <span className="type-kicker mb-5 inline-flex items-center gap-2.5 text-[#87C4E8]">
              <span className="h-0.5 w-7 rounded-full bg-[#E8630A]" />
              {t("badge")}
            </span>
            <h2 className="type-h2-section mb-5 text-white">
              {t("heading")}
            </h2>
            <p className="mb-8 text-base leading-[1.65] text-[#8AA5BE]">
              {t("description")}
            </p>

            <div className="mb-8 grid gap-4">
              {threeCriteria.map((step, i) => (
                <div key={i} className="group flex gap-4 rounded-[14px] border border-on-dark bg-white/[0.05] p-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[11px] bg-[#4DA6D9]/20 text-[#87C4E8] transition-colors duration-300 group-hover:bg-[#E8630A] group-hover:text-white">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-[15px] font-semibold text-white">{t(`${step.key}Title`)}</h4>
                    <p className="text-[13.5px] leading-[1.55] text-[#8AA5BE]">{t(`${step.key}Desc`)}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="bg-grad-blue h-12 rounded-xl px-7 text-[15px] font-semibold text-white shadow-cete-md transition-all hover:-translate-y-0.5 hover:shadow-cete-lg"
            >
              <Link href="/expertise">
                {t("understandRating")}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* 3×4 pastilles - un score par critère */}
          <div className="relative flex items-center justify-center py-6">
            <div className="w-full max-w-md rounded-[20px] border border-on-dark bg-white/[0.06] p-7 backdrop-blur-sm">
              <p className="type-kicker mb-6 text-[#87C4E8]">{t("assemblyLabel")}</p>
              <div className="grid gap-5">
              {threeCriteria.map((criterion, ci) => (
                <div key={ci}>
                  <div className="mb-3 text-[13.5px] font-semibold text-white">
                    {t(`${criterion.key}Title`)}
                  </div>
                  <div className="flex gap-3">
                    {levels.map((level) => (
                      <div
                        key={level.letter}
                        className="group flex-1 rounded-xl border border-on-dark bg-white/[0.04] py-3 text-center transition-all hover:border-[#87C4E8]/45"
                      >
                        <div className={`mx-auto mb-2 h-8 w-8 rounded-full ${level.color} transition-transform group-hover:scale-110`} />
                        <span className="text-lg font-bold text-white">{level.letter}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              </div>

              {/* Assemblage triple-lettre */}
              <div className="mt-6 rounded-2xl border border-on-dark bg-white/[0.05] p-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-[#22C55E]/20 text-[#22C55E] font-bold">A</span>
                  <span className="text-white/30">+</span>
                  <span className="px-3 py-1 rounded-lg bg-[#A3E635]/20 text-[#A3E635] font-bold">B</span>
                  <span className="text-white/30">+</span>
                  <span className="px-3 py-1 rounded-lg bg-[#22C55E]/20 text-[#22C55E] font-bold">A</span>
                  <span className="text-white/40 mx-2">→</span>
                  <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#4DA6D9] to-[#1A7AB5] text-white font-display font-bold text-xl">
                    ABA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
