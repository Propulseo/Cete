"use client";

import { Link } from "@/i18n/navigation";
import { BrandName } from "@/components/ui/brand-name";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

const levels = [
  { letter: "A", className: "bg-[#22C55E] text-white" },
  { letter: "B", className: "bg-[#A3E635] text-[#1A2940]" },
  { letter: "C", className: "bg-[#F97316] text-white" },
  { letter: "D", className: "bg-[#EF4444] text-white" },
];

export function ExpertiseCTA() {
  const t = useTranslations("expertise.cta");

  return (
    <section className="bg-grad-ink relative overflow-hidden py-[clamp(64px,8vw,110px)]">
      <div className="glow-blob absolute right-[12%] top-[-60px] h-[300px] w-[300px]" />
      <div className="absolute bottom-[-80px] left-[8%] h-[320px] w-[320px] rounded-full bg-[#E8630A]/10 blur-[80px]" />

      <div className="container-reading relative z-10 text-center">
        <p className="type-kicker mb-5 inline-block rounded-full bg-white/[0.08] px-4 py-2 text-[#87C4E8]">
          {t("badge")}
        </p>
        <h2 className="mb-5 font-display text-[clamp(30px,4.4vw,54px)] font-black uppercase leading-[1.1] text-white">
          {t("heading")} <span className="text-[#E8630A]">AAA</span>
        </h2>
        <p className="mx-auto mb-10 max-w-[560px] text-[16.5px] leading-[1.7] text-[#8AA5BE]">
          {t("description")}
        </p>

        <div className="flex flex-col justify-center gap-3.5 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="shadow-cta h-12 rounded-xl bg-[#E8630A] px-[30px] text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#B84D08]"
          >
            <Link href="/contact">
              {t("cta1")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="h-12 rounded-xl border border-[#87C4E8]/35 bg-white/[0.08] px-[30px] text-[15px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/[0.14] hover:text-white"
          >
            <Link href="/a-propos">
              {t("cta2")} <BrandName />
            </Link>
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {levels.map((level) => (
            <span
              key={level.letter}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${level.className}`}
            >
              {level.letter}
            </span>
          ))}
          <ArrowRight className="h-5 w-5 text-white/40" />
          <span className="inline-flex h-10 min-w-16 items-center justify-center rounded-xl bg-[#22C55E] px-4 text-sm font-bold text-white">
            AAA
          </span>
        </div>
      </div>
    </section>
  );
}
