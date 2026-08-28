"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useState } from "react";
import { CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Founder } from "@/types/founder";

export function HomeFounders({ founders }: { founders: Founder[] }) {
  const t = useTranslations("home.founders");

  return (
    <section className="section-pad relative bg-white">
      <div className="container-page">
        <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-[clamp(40px,5vw,72px)]">
          <div className="grid grid-cols-2 gap-[18px]">
            {founders.map((founder) => (
              <FounderTile key={founder.id} founder={founder} />
            ))}
          </div>

          <div>
            <span className="type-kicker mb-5 inline-flex items-center gap-2.5 text-[#1A7AB5]">
              <span className="h-0.5 w-7 rounded-full bg-[#E8630A]" />
              {t("badge")}
            </span>
            <h2 className="type-h2-section mb-5 text-[#1A2940]">
              {t("heading")}
            </h2>
            <p className="mb-7 text-lead leading-[1.7] text-[#4A6580]">
              {t("description")}
            </p>
            <ul className="mb-8 grid gap-3.5">
              {[t("bullet1"), t("bullet2"), t("bullet3"), t("bullet4")].map((item, i) => (
                <li key={i} className="flex items-start gap-3.5 font-medium text-[#1A2940]">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#15803D]" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl bg-[#1A2940] px-7 text-body font-semibold text-white shadow-cete-md transition-all hover:-translate-y-0.5 hover:bg-[#0D5A8A]"
            >
              <Link href="/a-propos">
                {t("cta")}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FounderTile({ founder }: { founder: Founder }) {
  const t = useTranslations("home.founders");
  const [imgError, setImgError] = useState(false);
  const initials = founder.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Link href="/a-propos" className="group flex h-full flex-col overflow-hidden rounded-2xl border border-subtle bg-white shadow-cete-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-cete-lg">
      <div className="relative aspect-square bg-grad-ink">
        {!imgError ? (
          <Image
            src={founder.imageUrl}
            alt={t("imageAlt", { name: founder.name, role: founder.role })}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            style={founder.imagePosition ? { objectPosition: founder.imagePosition } : undefined}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-5xl text-white/20">
              {initials}
            </span>
          </div>
        )}
      </div>
      {/* Nom et rôle sous la photo : les portraits n'ont pas tous du buste sous le
          menton, un bandeau superposé retombait sur certains visages. */}
      <div className="flex-1 px-4 py-3.5">
        <div className="text-sm font-semibold text-[#1A2940]">{founder.name}</div>
        <div className="mt-1 text-xs leading-[1.45] text-[#4A6580]">{founder.role}</div>
      </div>
    </Link>
  );
}
