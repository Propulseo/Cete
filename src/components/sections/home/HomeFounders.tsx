"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useState } from "react";
import { CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFounders } from "@/lib/data-loader";

export function HomeFounders() {
  const t = useTranslations("home.founders");
  const founders = getFounders();

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-2 gap-4">
            {founders.map((founder) => (
              <FounderTile key={founder.id} founder={founder} />
            ))}
          </div>

          <div className="space-y-8">
            <span className="inline-block px-4 py-1 rounded-full bg-[#4DA6D9]/10 text-[#1A2940] text-sm font-semibold uppercase tracking-wider">
              {t("badge")}
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1A2940] leading-tight">
              {t("heading")}
            </h2>
            <p className="text-xl text-[#4A6580] leading-relaxed">
              {t("description")}
            </p>
            <ul className="space-y-4">
              {[t("bullet1"), t("bullet2"), t("bullet3"), t("bullet4")].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#4A6580]">
                  <CheckCircle className="w-5 h-5 text-[#E8630A] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              asChild
              size="lg"
              className="mt-4 bg-[#4DA6D9] text-white hover:bg-[#1A7AB5] text-lg px-8 py-6 font-semibold rounded-xl transition-all duration-300"
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

function FounderTile({
  founder,
}: {
  founder: ReturnType<typeof getFounders>[number];
}) {
  const t = useTranslations("home.founders");
  const [imgError, setImgError] = useState(false);
  const initials = founder.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Link href="/a-propos" className="block">
      <div className="relative rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-[#1A2940] to-[#0D5A8A] group">
        {!imgError ? (
          <Image
            src={founder.imageUrl}
            alt={t("imageAlt", { name: founder.name, role: founder.role })}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
            style={founder.imagePosition ? { objectPosition: founder.imagePosition } : undefined}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-display text-white/20">
              {initials}
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="font-semibold text-white">{founder.name}</div>
          <div className="text-sm text-white/70">{founder.role}</div>
        </div>
      </div>
    </Link>
  );
}
