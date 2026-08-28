"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Zap, CheckCircle, Star, Award, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brandify } from "@/components/ui/brand-name";
import { getPillarServices } from "@/lib/data-loader";

const icons: Record<string, typeof Zap> = {
  "clipboard-check": CheckCircle,
  "shield-alert": Shield,
  "graduation-cap": Star,
  "crown": Award,
  "star": Star,
  "award": Award,
  "bell": Shield,
};

export function HomeServices() {
  const t = useTranslations("home.services");
  const locale = useLocale() as "fr" | "en";
  const services = getPillarServices(locale);

  return (
    <section className="section-pad relative bg-white">
      <div className="container-page">
        <div className="mx-auto mb-14 max-w-[660px] text-center">
          <span className="type-kicker mb-4 inline-flex rounded-full bg-[#4DA6D9]/[0.12] px-4 py-2 text-[#1A2940]">
            {t("badge")}
          </span>
          <h2 className="type-h2-section mb-4 text-[#1A2940]">
            {t("heading")}
          </h2>
          <p className="text-base leading-[1.65] text-[#4A6580]">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-6">
          {services.slice(0, 4).map((service) => {
            const Icon = icons[service.icon as keyof typeof icons] || Zap;

            return (
              <Link key={service.id} href="/services" className="group block min-w-0">
                <div
                  className="relative flex h-full flex-col overflow-hidden rounded-[18px] border border-subtle bg-grad-card p-6 transition-all duration-300 hover:-translate-y-[5px] hover:border-strong hover:shadow-cete-lg sm:p-7"
                >
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#4DA6D9]/10 blur-2xl transition-all duration-300 group-hover:bg-[#4DA6D9]/15" />

                  {/* Icône empilée sous sm : en ligne, elle ne laissait que
                      ~175px au titre, qui se brisait en 4 lignes. */}
                  <div className="relative z-10 flex h-full flex-col gap-5">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-grad-blue text-white shadow-cete-sm">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <h3 className="type-h3-card mb-3 text-[#1A2940]">
                        {service.title.toUpperCase()}
                      </h3>
                      <p className="mb-5 text-sm leading-[1.65] text-[#4A6580]">
                        {brandify(service.description)}
                      </p>
                      <ul className="mt-auto space-y-2 border-t border-[#4DA6D9]/20 pt-4">
                        {service.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex gap-2 text-[0.8125rem] leading-[1.55] text-[#4A6580]">
                            <span className="font-bold text-[#4DA6D9]">›</span>
                            {brandify(feature)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-11 text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 max-w-full rounded-xl border-[#1A2940] px-6 text-body font-semibold text-[#1A2940] transition-all hover:-translate-y-0.5 hover:bg-[#1A2940] hover:text-white sm:px-8"
          >
            <Link href="/services">
              {t("viewAll")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
