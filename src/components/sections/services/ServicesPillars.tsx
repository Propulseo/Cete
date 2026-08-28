"use client";

import { Link } from "@/i18n/navigation";
import { getPillarServices } from "@/lib/data-loader";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const categoryStyle = {
  Expertise: {
    line: "bg-[#4DA6D9]",
    badge: "bg-[#4DA6D9]/14 text-[#0D5A8A]",
    border: "border-subtle bg-grad-card hover:border-strong",
    bullet: "text-[#4DA6D9]",
    separator: "border-[#4DA6D9]/20",
  },
  Conseil: {
    line: "bg-[#E8630A]",
    badge: "bg-[#E8630A]/12 text-[#B84D08]",
    border: "border-[#E8630A]/22 bg-gradient-to-b from-[#FDF3EC] to-white hover:border-[#E8630A]/50",
    bullet: "text-[#E8630A]",
    separator: "border-[#E8630A]/20",
  },
};

export function ServicesPillars() {
  const t = useTranslations("services.pillars");
  const locale = useLocale() as "fr" | "en";
  const pillars = getPillarServices(locale);
  const expertise = pillars.filter((service) => service.category === "Expertise");
  const conseil = pillars.filter((service) => service.category === "Conseil");

  return (
    <section className="section-pad bg-white">
      <div className="container-page">
        <div className="mx-auto mb-[52px] max-w-[760px] text-center">
          <h2 className="type-h2-section mb-4 text-[#1A2940]">{t("heading")}</h2>
          <p className="text-base leading-[1.7] text-[#4A6580]">{t("description")}</p>
        </div>

        <PillarGroup label={t("expertise")} services={expertise} contactLabel={t("contactUs")} />
        <PillarGroup label={t("conseil")} services={conseil} contactLabel={t("contactUs")} />
      </div>
    </section>
  );
}

function PillarGroup({
  label,
  services,
  contactLabel,
}: {
  label: string;
  services: ReturnType<typeof getPillarServices>;
  contactLabel: string;
}) {
  const style = categoryStyle[services[0]?.category ?? "Expertise"];

  return (
    <div className="mb-[clamp(44px,5vw,64px)] last:mb-0">
      <h3 className="mb-6 flex items-center gap-3.5 font-display text-xl font-bold text-[#1A2940]">
        <span className={`h-[3px] w-[30px] rounded-sm ${style.line}`} />
        {label}
      </h3>

      <div className="grid gap-[22px] md:grid-cols-2">
        {services.map((service) => {
          const serviceStyle = categoryStyle[service.category];

          return (
            <Link
              key={service.id}
              href="/contact"
              className={`group flex flex-col rounded-[20px] border px-7 py-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-cete-lg ${serviceStyle.border}`}
            >
              <span className={`mb-[18px] inline-flex self-start rounded-full px-[13px] py-1.5 text-[0.71875rem] font-bold tracking-[0.08em] ${serviceStyle.badge}`}>
                {service.category}
              </span>

              <h4 className="mb-3 text-[1.1875rem] font-bold leading-[1.3] text-[#1A2940]">
                {service.title}
              </h4>
              <p className="mb-[22px] text-body-sm leading-[1.7] text-[#4A6580]">
                {service.description}
              </p>

              <ul className={`mb-[22px] grid gap-2.5 border-t pt-[18px] text-note leading-[1.55] text-[#4A6580] ${serviceStyle.separator}`}>
                {service.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5">
                    <span className={`font-bold ${serviceStyle.bullet}`}>›</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <span className="mt-auto inline-flex items-center gap-2 text-body-sm font-semibold text-[#E8630A]">
                {contactLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
