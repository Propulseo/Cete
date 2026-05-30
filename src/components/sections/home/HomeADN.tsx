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
    <section className="py-24 bg-[#1A2940] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A2940] via-[#0D5A8A] to-[#1A2940] opacity-50" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-8">
            <span className="inline-block px-4 py-1 rounded-full bg-[#4DA6D9]/10 text-[#4DA6D9] text-sm font-semibold uppercase tracking-wider">
              {t("badge")}
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
              {t("heading")}
            </h2>
            <p className="text-xl text-white/70 leading-relaxed">
              {t("description")}
            </p>

            <div className="space-y-6 pt-4">
              {threeCriteria.map((step, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#4DA6D9]/10 flex items-center justify-center group-hover:bg-[#E8630A] transition-colors duration-300">
                    <step.icon className="w-6 h-6 text-[#4DA6D9] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg mb-1">{t(`${step.key}Title`)}</h4>
                    <p className="text-white/60">{t(`${step.key}Desc`)}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="mt-8 bg-white text-[#1A2940] hover:bg-[#4DA6D9] hover:text-white text-lg px-8 py-6 font-semibold rounded-xl transition-all duration-300"
            >
              <Link href="/expertise">
                {t("understandRating")}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* 3×4 pastilles - un score par critère */}
          <div className="relative flex items-center justify-center py-12">
            <div className="w-full max-w-md space-y-8">
              {threeCriteria.map((criterion, ci) => (
                <div key={ci}>
                  <div className="text-sm text-white/50 uppercase tracking-wider mb-3">
                    {t(`${criterion.key}Title`)}
                  </div>
                  <div className="flex gap-3">
                    {levels.map((level) => (
                      <div
                        key={level.letter}
                        className="flex-1 text-center py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                      >
                        <div className={`w-8 h-8 rounded-full ${level.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                        <span className="text-white font-bold text-lg">{level.letter}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Assemblage triple-lettre */}
              <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-sm text-white/50 text-center mb-3 uppercase tracking-wider">
                  {t("assemblyLabel")}
                </div>
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
