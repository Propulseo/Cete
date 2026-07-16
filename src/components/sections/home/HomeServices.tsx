"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Zap, CheckCircle, Star, Award, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brandify } from "@/components/ui/brand-name";
import { getPillarServices } from "@/lib/data-loader";

const icons: Record<string, typeof Zap> = {
  "clipboard-check": CheckCircle,
  "shield-alert": Shield,
  "graduation-cap": Star,
  "crown": Award,
  "star": Star,
  "award": Award,
  "bell": Shield,
};

export function HomeServices() {
  const t = useTranslations("home.services");
  const locale = useLocale() as "fr" | "en";
  const services = getPillarServices(locale);

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#4DA6D9]/10 text-[#1A2940] text-sm font-semibold uppercase tracking-wider mb-4">
            {t("badge")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1A2940] mb-6">
            {t("heading")}
          </h2>
          <p className="text-xl text-[#4A6580]">
            {t("description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.slice(0, 4).map((service) => {
            const Icon = icons[service.icon as keyof typeof icons] || Zap;

            return (
              <Link key={service.id} href="/services" className="block">
                <div
                  className="group relative p-8 rounded-3xl bg-[#F4F9FD] hover:bg-[#1A2940] border border-transparent hover:border-[#4DA6D9]/30 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#4DA6D9]/5 group-hover:bg-[#4DA6D9]/10 rounded-full blur-2xl transition-all duration-500" />

                  <div className="relative z-10 flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-[#4DA6D9] group-hover:bg-[#4DA6D9] flex items-center justify-center transition-colors duration-300">
                        <Icon className="w-8 h-8 text-white group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-2xl text-[#1A2940] group-hover:text-white mb-2 transition-colors duration-300">
                        {service.title.toUpperCase()}
                      </h3>
                      <p className="text-[#4A6580] group-hover:text-white/70 mb-4 transition-colors duration-300">
                        {brandify(service.description)}
                      </p>
                      <ul className="space-y-2">
                        {service.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-[#4A6580] group-hover:text-white/60 transition-colors duration-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E8630A]" />
                            {brandify(feature)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 border-2 border-[#1A2940] text-[#1A2940] hover:bg-[#1A2940] hover:text-white rounded-xl transition-all duration-300"
          >
            <Link href="/services">
              {t("viewAll")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
