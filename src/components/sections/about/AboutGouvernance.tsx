"use client";

import { useTranslations } from "next-intl";
import { Users, Monitor, ShieldCheck } from "lucide-react";
import { brandify } from "@/components/ui/brand-name";

const itemIcons = [Users, Monitor, ShieldCheck];

export function AboutGouvernance() {
  const t = useTranslations("about.governance");
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#4DA6D9]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#4DA6D9]/10 text-[#1A2940] text-sm font-semibold uppercase tracking-wider mb-4">
            {t("badge")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-[#1A2940] tracking-wide mb-4">
            {t.rich("heading", {
              accent: (chunks) => <span className="text-[#E8630A]">{chunks}</span>,
            })}
          </h2>
          <p className="text-lg text-[#4A6580] max-w-2xl mx-auto">
            {t("description")}
          </p>
          <div className="w-24 h-1 bg-[#E8630A] mx-auto rounded-full mt-6" />
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {itemIcons.map((Icon, index) => (
            <div
              key={index}
              className="group p-8 rounded-3xl bg-[#F4F9FD] border border-[#DAEEF8] hover:border-[#4DA6D9]/30 hover:shadow-xl transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#4DA6D9]/10 flex items-center justify-center mb-6 group-hover:bg-[#4DA6D9] transition-colors duration-300">
                <Icon className="w-7 h-7 text-[#4DA6D9] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-display text-xl text-[#1A2940] font-bold mb-3">
                {t(`items.${index}.title`)}
              </h3>
              <p className="text-[#4A6580] leading-relaxed">
                {brandify(t(`items.${index}.description`))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
