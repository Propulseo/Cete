"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { Founder } from "@/types/founder";

export function AboutFounders({ founders }: { founders: Founder[] }) {
  const t = useTranslations("about.founders");

  return (
    <section className="section-pad relative overflow-hidden bg-white">
      <div className="glow-blob absolute left-0 top-20 h-72 w-72" />
      <div className="glow-blob absolute bottom-20 right-0 h-96 w-96 bg-[#87C4E8]/15" />

      <div className="container-page relative z-10">
        <div className="mx-auto mb-12 max-w-[680px] text-center">
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

        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-6">
          {founders.map((founder, index) => (
            <FounderCard key={founder.id} founder={founder} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FounderCard({
  founder,
  index,
}: {
  founder: Founder;
  index: number;
}) {
  const [imgError, setImgError] = useState(false);
  const initials = founder.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div
      className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-subtle bg-white shadow-cete-sm transition-all duration-300 hover:-translate-y-1 hover:border-strong hover:shadow-cete-lg"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-1 flex-col">
        {/* Photo or fallback initials */}
        <div className="relative aspect-[4/4.6] flex-shrink-0 overflow-hidden bg-grad-ink">
          {!imgError ? (
            <Image
              src={founder.imageUrl}
              alt={`Portrait de ${founder.name}, ${founder.role}`}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
              style={founder.imagePosition ? { objectPosition: founder.imagePosition } : undefined}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-5xl text-white/20 transition-colors duration-500 group-hover:text-[#E8630A]/30">
                {initials}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-4">
            <h3 className="type-h3-card mb-1 text-[#1A2940]">
              {founder.name}
            </h3>
              <p className="text-[13.5px] font-semibold text-[#0D5A8A]">
                Co-fondateur
              </p>
              {founder.formerOrg && (
                <p className="mt-0.5 text-xs text-[#8AA5BE]">
                  {founder.formerOrg}
                </p>
              )}
              {founder.currentEntity && (
                <p className="text-xs font-medium text-[#4A6580]">
                  {founder.currentEntity}
                </p>
              )}
          </div>

          {founder.bio && (
            <p className="mt-auto text-[13px] leading-[1.6] text-[#4A6580]">
              {founder.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
