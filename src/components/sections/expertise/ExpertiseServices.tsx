"use client";

import { Link } from "@/i18n/navigation";
import { ClipboardCheck, Star, ShieldAlert, Zap, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getExpertiseServices } from "@/lib/data-loader";
import { useTranslations } from "next-intl";

const iconMap: Record<string, React.ReactNode> = {
  "clipboard-check": <ClipboardCheck className="h-6 w-6" />,
  star: <Star className="h-6 w-6" />,
  "shield-alert": <ShieldAlert className="h-6 w-6" />,
};

export function ExpertiseServices() {
  const t = useTranslations("expertise.services");
  const expertiseServices = getExpertiseServices();

  return (
    <section className="py-24 bg-[#F4F9FD] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#4DA6D9]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4DA6D9]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge className="bg-[#1A2940] text-white hover:bg-[#0D5A8A] mb-4">
            {t("badge")}
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl text-[#1A2940] tracking-wide mb-4">
            {t("heading")}
          </h2>
          <p className="text-lg text-[#4A6580] max-w-2xl mx-auto">
            {t("description")}
          </p>
          <div className="w-24 h-1 bg-[#E8630A] mx-auto rounded-full mt-6" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {expertiseServices.map((service) => (
            <Link
              key={service.id}
              href="/contact"
              className="block group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#DAEEF8] hover:border-[#E8630A]/30"
            >
              <div className="h-1.5 bg-gradient-to-r from-[#E8630A] via-[#4DA6D9] to-[#1A2940]" />

              <div className="p-8">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1A2940] to-[#0D5A8A] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    {iconMap[service.icon] || <Zap className="h-6 w-6" />}
                  </div>
                  <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-[#E8630A]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <h3 className="text-xl font-bold text-[#1A2940] mb-3 leading-tight">
                  {service.title}
                </h3>

                <p className="text-[#4A6580] mb-5">
                  {service.shortDescription}
                </p>

                <ul className="space-y-2.5 mb-6">
                  {service.features.slice(0, 4).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#4A6580]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E8630A] flex-shrink-0 mt-1.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <span className="inline-flex items-center justify-between w-full text-[#1A2940] group-hover:text-[#1A2940] font-medium transition-colors">
                  {t("learnMore")}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8630A] to-[#1A2940] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
