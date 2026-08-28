"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeCTA() {
  const t = useTranslations("home.cta");

  return (
    <section className="section-pad bg-grad-ink relative overflow-hidden">
      <div className="glow-blob absolute right-[10%] top-[-60px] h-[300px] w-[300px]" />
      <div className="absolute bottom-[-80px] left-[8%] h-[340px] w-[340px] rounded-full bg-[#E8630A]/10 blur-[80px]" />

      <div className="container-reading relative z-10 text-center">
        <div className="mx-auto max-w-[860px]">
          <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8630A] shadow-cta">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h2 className="mb-5 font-display text-[clamp(30px,4.4vw,54px)] font-black leading-[1.1] text-white">
            {t("heading")}
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lead leading-[1.7] text-[#8AA5BE]">
            {t("description")}
          </p>
          <div className="flex flex-col justify-center gap-3.5 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="shadow-cta h-12 rounded-xl bg-[#E8630A] px-8 text-body font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#B84D08]"
            >
              <Link href="/contact">
                {t("requestEvaluation")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl border border-[#87C4E8]/35 bg-white/[0.08] px-8 text-body font-semibold text-white backdrop-blur-sm transition-all hover:border-[#87C4E8]/60 hover:bg-white/[0.14]"
            >
              <Link href="/connexion">
                {t("clientArea")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
