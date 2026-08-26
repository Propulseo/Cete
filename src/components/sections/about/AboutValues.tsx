"use client";

import { useTranslations } from "next-intl";
import { Shield, Lock, Heart, Target } from "lucide-react";
import { getValues } from "@/lib/data-loader";

const iconMap: Record<string, React.ReactNode> = {
  shield: <Shield className="h-7 w-7" />,
  lock: <Lock className="h-7 w-7" />,
  heart: <Heart className="h-7 w-7" />,
  target: <Target className="h-7 w-7" />,
};

export function AboutValues() {
  const t = useTranslations("about.values");
  const values = getValues();

  return (
    <section className="section-pad relative overflow-hidden bg-white">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#1A2940]/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#4DA6D9]/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#1A2940]/10" />
      </div>

      <div className="container-page relative z-10">
        <div className="mx-auto mb-12 max-w-[660px] text-center">
          <span className="type-kicker mb-4 inline-flex rounded-full bg-[#4DA6D9]/[0.12] px-4 py-2 text-[#1A2940]">
            {t("badge")}
          </span>
          <h2 className="type-h2-section mb-4 text-[#1A2940]">
            {t("heading")}
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-[1.7] text-[#4A6580]">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
          {values.map((value) => (
            <div
              key={value.id}
              className="group relative flex flex-col overflow-hidden rounded-[18px] border border-subtle bg-grad-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-strong hover:shadow-cete-lg"
            >
              <div className="relative mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-[#4DA6D9]/[0.14] text-[#0D5A8A] transition-transform duration-300 group-hover:scale-105">
                  {iconMap[value.icon]}
                </div>
              </div>

              <h3 className="type-h3-card mb-3 text-[#1A2940]">
                {value.title}
              </h3>
              <p className="text-sm leading-[1.65] text-[#4A6580]">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
