"use client";

import { useTranslations } from "next-intl";
import { Users, Monitor, ShieldCheck } from "lucide-react";
import { brandify } from "@/components/ui/brand-name";

const itemIcons = [Users, Monitor, ShieldCheck];

export function AboutGouvernance() {
  const t = useTranslations("about.governance");
  return (
    <section className="section-pad bg-grad-ink relative overflow-hidden">
      <div className="glow-blob absolute -bottom-24 -right-16 h-[380px] w-[380px]" />

      <div className="container-page relative z-10">
        <div className="mx-auto mb-12 max-w-[720px] text-center">
          <span className="type-kicker mb-4 inline-flex rounded-full bg-[#87C4E8]/[0.14] px-4 py-2 text-[#87C4E8]">
            {t("badge")}
          </span>
          <h2 className="type-h2-section mb-4 text-white">
            {t.rich("heading", {
              accent: (chunks) => <span className="text-[#E8630A]">{chunks}</span>,
            })}
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-[1.7] text-[#8AA5BE]">
            {t("description")}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {itemIcons.map((Icon, index) => (
            <div
              key={index}
              className="group rounded-[20px] border border-on-dark bg-white/[0.06] p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#87C4E8]/45"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#4DA6D9]/20 text-[#87C4E8] transition-colors duration-300 group-hover:bg-[#E8630A]/20 group-hover:text-[#E8630A]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="type-h3-card mb-3 text-white">
                {t(`items.${index}.title`)}
              </h3>
              <p className="text-body-sm leading-[1.7] text-[#8AA5BE]">
                {brandify(t(`items.${index}.description`))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
