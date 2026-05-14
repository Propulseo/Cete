"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const progression = [
  { letter: "D", color: "bg-[#EF4444]/20", text: "text-[#EF4444]" },
  { letter: "C", color: "bg-[#F97316]/20", text: "text-[#F97316]" },
  { letter: "B", color: "bg-[#A3E635]/20", text: "text-[#65A30D]" },
  { letter: "A", color: "bg-[#22C55E]/20", text: "text-[#22C55E]" },
];

export function ServicesCTA() {
  const t = useTranslations("services.cta");

  return (
    <section className="py-24 bg-gradient-to-br from-[#1A2940] via-[#0D5A8A] to-[#1A2940] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#4DA6D9]/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#1A2940]/10 blur-3xl animate-float animation-delay-500" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8630A]/30 bg-[#E8630A]/10 px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-[#E8630A]" />
            <span className="text-sm font-medium text-[#E8630A]">{t("badge")}</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wide mb-6">
            {t("heading")}
          </h2>

          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#E8630A] text-white hover:bg-[#B84D08] font-semibold px-8 py-6 text-lg rounded-full group shadow-lg shadow-[#E8630A]/25 hover:shadow-[#E8630A]/40 transition-all"
            >
              <Link href="/contact">
                {t("requestEvaluation")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-full"
            >
              <Link href="/expertise">
                {t("ourRating")}
              </Link>
            </Button>
          </div>

          {/* Progression D → C → B → A → AAA */}
          <div className="mt-16 flex justify-center items-center gap-2">
            {progression.map((level, i) => (
              <div key={level.letter} className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${level.color} ${level.text}`}>
                  {level.letter}
                </div>
                {i < progression.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-white/30" />
                )}
              </div>
            ))}
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-white/30" />
              <div className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#22C55E] text-white scale-110">
                AAA
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
