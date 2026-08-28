"use client";

import { Link } from "@/i18n/navigation";
import { BrandName } from "@/components/ui/brand-name";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, QrCode } from "lucide-react";
import { useTranslations } from "next-intl";

const subCriteria = [
  { label: "C1", score: "A" },
  { label: "C2", score: "B" },
  { label: "C3", score: "A" },
];

export function ExpertiseCertificate() {
  const t = useTranslations("expertise.certificate");

  return (
    <section className="section-pad bg-[#F4F9FD]">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-[720px] text-center">
          <p className="type-kicker mb-4 inline-block rounded-full bg-[#4DA6D9]/12 px-4 py-2 text-[#1A2940]">
            {t("badge")}
          </p>
          <h2 className="type-h2-section mb-4 text-[#1A2940]">
            {t("heading")} <BrandName /> ADN<span className="align-super text-[0.4em]">®</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-[1.7] text-[#4A6580]">
            {t("description")}
          </p>
        </div>

        <div className="grid items-center gap-[clamp(28px,4vw,52px)] md:grid-cols-[0.9fr_1.1fr]">
          <div className="shadow-cete-lg rounded-[20px] border border-subtle bg-white p-[26px]">
            <p className="type-kicker mb-[18px] text-[#1A7AB5]">
              <BrandName /> ADN<span className="align-super text-[0.5em]">®</span>
            </p>
            <div className="relative flex aspect-[1/1.35] flex-col justify-between overflow-hidden rounded-xl border border-[#4DA6D9]/25 bg-[repeating-linear-gradient(45deg,#F4F9FD_0_10px,#EAF4FB_10px_11px)] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-label font-bold uppercase tracking-[0.14em] text-[#1A7AB5]">
                    Vigi-Score<span className="align-super text-[0.6em]">®</span>
                  </p>
                  <p className="font-display text-2xl font-black tracking-[0.08em] text-[#1A2940]">
                    ABA
                  </p>
                </div>
                <QrCode className="h-9 w-9 text-[#1A2940]/35" />
              </div>

              <div className="rounded-2xl border border-white/70 bg-white/75 p-5 backdrop-blur-sm">
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {subCriteria.map((criterion) => (
                    <div key={criterion.label} className="rounded-xl border border-subtle bg-white p-3 text-center">
                      <p className="mb-1 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-[#8AA5BE]">
                        {criterion.label}
                      </p>
                      <p className="font-display text-2xl font-black text-[#1A2940]">
                        {criterion.score}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="h-2 rounded-full bg-[linear-gradient(to_right,#22C55E,#A3E635,#F97316,#EF4444)]" />
              </div>

              <p className="text-center text-label font-semibold uppercase tracking-[0.18em] text-[#8AA5BE]">
                <BrandName /> · ADN · AAA-DDD
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-display text-[clamp(19px,2.2vw,26px)] font-bold leading-[1.3] text-[#1A2940]">
              {t("differenceHeading")}
            </h3>
            <p className="mb-6 text-[0.96875rem] leading-[1.75] text-[#4A6580]">
              {t("differenceDescription")}
            </p>

            <ul className="mb-[30px] grid gap-[13px]">
              {Array.from({ length: 5 }, (_, index) => (
                <li key={index} className="flex items-start gap-[13px] text-body leading-[1.6] text-[#1A2940]">
                  <CheckCircle className="mt-0.5 h-[22px] w-[22px] flex-shrink-0 rounded-full bg-[#22C55E]/15 p-0.5 text-[#15803D]" />
                  {t(`features.${index}`)}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3.5 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="shadow-cta h-12 rounded-xl bg-[#E8630A] px-7 text-body font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#B84D08]"
              >
                <Link href="/contact">
                  {t("cta1")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border border-[#4DA6D9]/40 bg-white px-7 text-body font-semibold text-[#0D5A8A] transition-all hover:border-[#E8630A] hover:bg-white"
              >
                <Link href="/services">{t("cta2")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
