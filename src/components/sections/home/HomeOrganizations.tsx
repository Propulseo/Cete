"use client";

import { useTranslations } from "next-intl";

export function HomeOrganizations({ organizations }: { organizations: string[] }) {
  const t = useTranslations("home.organizations");

  return (
    <section className="section-pad relative overflow-hidden bg-white pb-0">
      <div className="container-page relative z-10">
        <div className="mx-auto mb-11 max-w-[640px] text-center">
          <span className="type-kicker mb-4 inline-flex text-[#1A7AB5]">
            {t("badge")}
          </span>
          <h2 className="type-h2-section mb-4 text-[#1A2940]">
            {t("heading")}
          </h2>
          <p className="text-base leading-[1.65] text-[#4A6580]">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="relative border-y border-[#4DA6D9]/[0.18] bg-[#F4F9FD] py-6">
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 bg-gradient-to-r from-[#F4F9FD] to-transparent md:w-32" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l from-[#F4F9FD] to-transparent md:w-32" />

        <div className="overflow-hidden">
          <div className="flex animate-scroll-logos">
            {[...organizations, ...organizations].map((org, i) => (
              <div
                key={`${org}-${i}`}
                aria-hidden={i >= organizations.length}
                className="flex flex-shrink-0 items-center"
              >
                <span className="px-[30px] text-sm font-bold uppercase tracking-[0.08em] text-[#4A6580]">
                  {org}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#4DA6D9]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
