"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

const progression = [
  { letter: "D", className: "border-[#EF4444]/35 bg-[#EF4444]/16" },
  { letter: "C", className: "border-[#F97316]/35 bg-[#F97316]/16" },
  { letter: "B", className: "border-[#A3E635]/40 bg-[#A3E635]/18" },
  { letter: "A", className: "border-[#22C55E]/45 bg-[#22C55E]/20" },
];

export function ServicesCTA() {
  const t = useTranslations("services.cta");

  return (
    <section className="bg-grad-ink relative overflow-hidden py-[clamp(64px,8vw,110px)]">
      <div className="glow-blob absolute right-[12%] top-[-60px] h-[300px] w-[300px]" />
      <div className="absolute bottom-[-80px] left-[8%] h-[320px] w-[320px] rounded-full bg-[#E8630A]/10 blur-[80px]" />

      <div className="container-reading relative z-10 text-center">
        <p className="type-kicker mb-[18px] inline-block rounded-full bg-[#87C4E8]/14 px-4 py-2 text-[#87C4E8]">
          {t("badge")}
        </p>
        <h2 className="mb-5 font-display text-[clamp(28px,4.2vw,52px)] font-black uppercase leading-[1.1] text-white">
          {t("heading")}
        </h2>
        <p className="mx-auto mb-[34px] max-w-[580px] text-lead leading-[1.7] text-[#8AA5BE]">
          {t("description")}
        </p>

        <div className="mb-9 flex flex-wrap items-center justify-center gap-2.5">
          {progression.map((level, index) => (
            <div key={level.letter} className="flex items-center gap-2.5">
              <span className={`inline-flex h-[42px] w-[42px] items-center justify-center rounded-[11px] border font-bold text-white ${level.className}`}>
                {level.letter}
              </span>
              {index < progression.length - 1 && <ArrowRight className="h-4 w-4 text-[#87C4E8]" />}
            </div>
          ))}
          <ArrowRight className="h-4 w-4 text-[#E8630A]" />
          <span className="inline-flex h-[42px] items-center justify-center rounded-[11px] border border-[#E8630A]/50 bg-[#E8630A]/18 px-[18px] font-display text-lg font-black tracking-[0.06em] text-white">
            AAA
          </span>
        </div>

        <div className="flex flex-col justify-center gap-3.5 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="shadow-cta h-12 rounded-xl bg-[#E8630A] px-[30px] text-body font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#B84D08]"
          >
            <Link href="/contact">
              {t("requestEvaluation")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="h-12 rounded-xl border border-[#87C4E8]/35 bg-white/[0.08] px-[30px] text-body font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/[0.14] hover:text-white"
          >
            <Link href="/expertise">{t("ourRating")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
