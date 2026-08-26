"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Zap, Star, Users } from "lucide-react";
import { getPillars } from "@/lib/data-loader";

const icons = { zap: Zap, star: Star, users: Users };
const colors = {
  blue: "from-[#4DA6D9] to-[#1A7AB5]",
  yellow: "from-[#E8630A] to-[#B84D08]",
  green: "from-[#4DA6D9] to-[#0D5A8A]",
};

export function HomePillars() {
  const t = useTranslations("home.pillars");
  const pillars = getPillars();

  return (
    <section className="section-pad relative overflow-hidden bg-[#F4F9FD]">
      <div className="glow-blob absolute -left-48 -top-48 h-96 w-96" />
      <div className="glow-blob absolute -bottom-48 -right-48 h-96 w-96 bg-[#87C4E8]/15" />

      <div className="container-page relative z-10">
        <div className="mx-auto mb-14 max-w-[700px] text-center">
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

        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar, index) => {
            const Icon = icons[pillar.icon as keyof typeof icons] || Zap;
            const bgColor = colors[pillar.color as keyof typeof colors] || colors.blue;

            return (
              <Link key={pillar.id} href="/expertise" className="group block h-full">
                <div className="relative h-full overflow-hidden rounded-[18px] border border-subtle bg-white p-7 shadow-cete-sm transition-all duration-300 hover:-translate-y-[5px] hover:border-strong hover:shadow-cete-lg lg:p-8">
                  <div className="relative z-10">
                    <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br ${bgColor} text-white shadow-cete-sm transition-transform duration-300 group-hover:scale-105`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="type-h3-card mb-3 text-[#1A2940]">
                      {pillar.title.toUpperCase()}
                    </h3>
                    <p className="text-[14.5px] leading-[1.65] text-[#4A6580]">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="absolute right-6 top-5 font-display text-[44px] font-black leading-none text-[#4DA6D9]/20">
                    0{index + 1}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
