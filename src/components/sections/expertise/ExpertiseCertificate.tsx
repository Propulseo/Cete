"use client";

import { Link } from "@/i18n/navigation";
import { Shield, CheckCircle, QrCode, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandName } from "@/components/ui/brand-name";
import { useTranslations } from "next-intl";

const subCriteria = [
  { label: "Capacité d'auto-évaluation", score: "A" },
  { label: "Maîtrise des exigences métier", score: "B" },
  { label: "Maîtrise opérationnelle", score: "A" },
];

export function ExpertiseCertificate() {
  const t = useTranslations("expertise.certificate");
  return (
    <section className="py-24 bg-[#F4F9FD] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#4DA6D9]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4DA6D9]/8 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#4DA6D9]/10 text-[#1A2940] text-sm font-semibold uppercase tracking-wider mb-4">
            {t("badge")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-[#1A2940] tracking-wide mb-4">
            {t("heading")}{" "}
            <span className="text-[#E8630A]">CET<span className="text-[0.75em] align-super">é</span> ADN</span>
          </h2>
          <p className="text-lg text-[#4A6580] max-w-2xl mx-auto">
            {t("description")}
          </p>
          <div className="w-24 h-1 bg-[#E8630A] mx-auto rounded-full mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Certificate mockup */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Shadow & tilt effect */}
              <div className="absolute inset-0 bg-[#1A2940]/10 rounded-2xl blur-2xl translate-y-4 scale-95" />

              {/* Certificate card */}
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#DAEEF8]">
                {/* Top bands */}
                <div className="h-1.5 bg-[#E8630A]" />
                <div className="h-1 bg-[#4DA6D9]" />

                {/* Header */}
                <div className="bg-[#1A2940] px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold text-lg">
                      CET<span className="text-[0.75em] align-super">é</span> ADN
                    </div>
                    <div className="text-white/50 text-xs">
                      Agence de notation indépendante
                    </div>
                  </div>
                  <Shield className="h-8 w-8 text-[#4DA6D9]/50" />
                </div>

                {/* Title */}
                <div className="px-6 pt-6 pb-4 text-center">
                  <h3 className="font-display text-sm font-bold text-[#1A2940] tracking-wide uppercase">
                    Certificat d&apos;évaluation des risques professionnels
                  </h3>
                  <div className="w-16 h-0.5 bg-[#E8630A] mx-auto mt-2" />
                </div>

                {/* Body */}
                <div className="px-6 pb-6 grid grid-cols-2 gap-4">
                  {/* Left - company info */}
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] font-bold text-[#8AA5BE] uppercase">Entreprise évaluée</div>
                      <div className="text-sm font-bold text-[#1A2940]">Entreprise XYZ</div>
                      <div className="text-[10px] text-[#4A6580]">SIREN : 123 456 789</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#8AA5BE] uppercase">Évaluation</div>
                      <div className="text-xs text-[#4A6580]">15 janvier 2026</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#8AA5BE] uppercase">Validité</div>
                      <div className="text-xs text-[#4A6580]">15 janvier 2027</div>
                    </div>
                  </div>

                  {/* Right - rating */}
                  <div className="space-y-3">
                    <div className="rounded-xl border-2 border-[#22C55E] p-3 text-center">
                      <div className="bg-[#1A2940] rounded-lg px-3 py-1 mb-2 inline-block">
                        <span className="text-[10px] font-bold text-white tracking-wider">NOTATION CETé ADN</span>
                      </div>
                      <div className="font-display text-4xl font-bold text-[#22C55E]">ABA</div>
                      <div className="text-[9px] text-[#8AA5BE] mt-1">AAA (optimal) - DDD (critique)</div>
                    </div>

                    {/* Sub-criteria */}
                    <div className="rounded-lg border border-[#DAEEF8] p-2.5 space-y-1.5">
                      {subCriteria.map((c) => (
                        <div key={c.label} className="flex items-center justify-between text-[10px]">
                          <span className="text-[#4A6580]">{c.label}</span>
                          <span className="font-bold text-[#1A2940]">{c.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-[#F4F9FD] border-t border-[#DAEEF8] flex items-center justify-between">
                  <div className="text-[9px] text-[#8AA5BE] max-w-[60%]">
                    Ce certificat est délivré par CETé - Consortium Experts Techniques Électricité.
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <QrCode className="h-8 w-8 text-[#1A2940]/20" />
                    <span className="text-[8px] text-[#8AA5BE]">Vérifiable en ligne</span>
                  </div>
                </div>

                {/* Bottom bands */}
                <div className="h-1 bg-[#4DA6D9]" />
                <div className="h-1 bg-[#E8630A]" />
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-[#E8630A] shadow-lg flex items-center justify-center animate-pulse-glow">
                <div className="text-center">
                  <div className="text-white font-bold text-[10px] leading-tight">CETé</div>
                  <div className="text-white/80 text-[7px]">CERTIFIÉ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Description & CTA */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="font-display text-2xl md:text-3xl text-[#1A2940]">
                {t("differenceHeading")}
              </h3>
              <p className="text-[#4A6580] leading-relaxed">
                {t("differenceDescription")}
              </p>
            </div>

            <ul className="space-y-4">
              {Array.from({ length: 5 }, (_, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                  <span className="text-[#4A6580]">{t(`features.${i}`)}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-[#E8630A] text-white hover:bg-[#B84D08] font-semibold px-8 py-6 text-lg rounded-xl group shadow-lg shadow-[#E8630A]/20 hover:shadow-[#E8630A]/40 transition-all"
              >
                <Link href="/contact">
                  {t("cta1")}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-[#1A2940] text-[#1A2940] hover:bg-[#1A2940] hover:text-white font-semibold px-8 py-6 text-lg rounded-xl transition-all"
              >
                <Link href="/services">
                  {t("cta2")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
