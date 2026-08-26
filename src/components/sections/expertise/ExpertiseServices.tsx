"use client";

import { Link } from "@/i18n/navigation";
import { getExpertiseServices } from "@/lib/data-loader";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

function serviceCode(title: string) {
  return title.split(" - ")[0].toUpperCase();
}

export function ExpertiseServices() {
  const t = useTranslations("expertise.services");
  const locale = useLocale() as "fr" | "en";
  const expertiseServices = getExpertiseServices(locale);

  return (
    <section className="section-pad bg-white">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-[660px] text-center">
          <p className="type-kicker mb-4 inline-block rounded-full bg-[#4DA6D9]/12 px-4 py-2 text-[#1A2940]">
            {t("badge")}
          </p>
          <h2 className="type-h2-section mb-4 text-[#1A2940]">{t("heading")}</h2>
          <p className="text-base leading-[1.7] text-[#4A6580]">{t("description")}</p>
        </div>

        <div className="grid gap-[22px] md:grid-cols-3">
          {expertiseServices.map((service) => {
            const featured = service.id === "exp-vigi";

            return (
              <Link
                key={service.id}
                href="/contact"
                className={`group flex flex-col rounded-[18px] border px-[26px] py-[30px] transition-all duration-300 hover:-translate-y-1 hover:shadow-cete-lg ${
                  featured
                    ? "border-[#E8630A]/25 bg-gradient-to-b from-[#FDF3EC] to-white"
                    : "border-subtle bg-grad-card hover:border-strong"
                }`}
              >
                <span
                  className={`mb-5 inline-flex self-start rounded-full px-[13px] py-1.5 text-[11.5px] font-bold uppercase tracking-[0.08em] ${
                    featured ? "bg-[#E8630A]/12 text-[#B84D08]" : "bg-[#4DA6D9]/14 text-[#0D5A8A]"
                  }`}
                >
                  {serviceCode(service.title)}
                </span>

                <h3 className="mb-2.5 text-[17px] font-bold leading-[1.35] text-[#1A2940]">
                  {service.title}
                </h3>
                <p className="mb-5 text-sm leading-[1.65] text-[#4A6580]">
                  {service.shortDescription}
                </p>

                <ul className={`mb-5 grid gap-[9px] border-t pt-4 text-[13px] leading-[1.55] text-[#4A6580] ${featured ? "border-[#E8630A]/20" : "border-[#4DA6D9]/20"}`}>
                  {service.features.slice(0, 4).map((feature) => (
                    <li key={feature} className="flex gap-2.5">
                      <span className={`font-bold ${featured ? "text-[#E8630A]" : "text-[#4DA6D9]"}`}>›</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <span className="mt-auto inline-flex items-center gap-2 pt-1 text-sm font-semibold text-[#E8630A]">
                  {t("learnMore")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
