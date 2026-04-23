"use client";

import Link from "next/link";
import {
  ClipboardCheck,
  ShieldAlert,
  GraduationCap,
  Crown,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { getPillarServices } from "@/lib/data-loader";

const iconMap: Record<string, React.ReactNode> = {
  "clipboard-check": <ClipboardCheck className="h-8 w-8" />,
  "shield-alert": <ShieldAlert className="h-8 w-8" />,
  "graduation-cap": <GraduationCap className="h-8 w-8" />,
  crown: <Crown className="h-8 w-8" />,
};

const categoryStyle = {
  Expertise: {
    badge: "bg-[#1A2940] text-white",
    accent: "border-[#4DA6D9]",
    iconBg: "bg-gradient-to-br from-[#1A2940] to-[#0D5A8A]",
    hover: "hover:border-[#4DA6D9]",
  },
  Conseil: {
    badge: "bg-[#E8630A] text-white",
    accent: "border-[#E8630A]",
    iconBg: "bg-gradient-to-br from-[#E8630A] to-[#B84D08]",
    hover: "hover:border-[#E8630A]",
  },
};

export function ServicesPillars() {
  const pillars = getPillarServices();
  const expertise = pillars.filter((s) => s.category === "Expertise");
  const conseil = pillars.filter((s) => s.category === "Conseil");

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 font-display text-[12rem] text-[#DAEEF8] leading-none select-none whitespace-nowrap pointer-events-none">
        NOS OFFRES
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mb-20">
          <span className="text-[#E8630A] font-bold text-sm tracking-widest uppercase">
            4 piliers
          </span>
          <h2 className="font-display text-5xl md:text-6xl text-[#1A2940] tracking-wide mt-4">
            UNE OFFRE
            <br />
            <span className="text-[#4DA6D9]">COMPLÈTE</span>
          </h2>
          <div className="w-24 h-1.5 bg-[#E8630A] mt-6" />
          <p className="text-lg text-[#4A6580] mt-6 max-w-xl">
            De l&apos;expertise terrain au conseil stratégique, chaque offre répond à un besoin précis de votre démarche de maîtrise du risque électrique.
          </p>
        </div>

        <PillarGroup label="Expertise" services={expertise} />
        <PillarGroup label="Conseil & Accompagnement" services={conseil} />
      </div>
    </section>
  );
}

function PillarGroup({
  label,
  services,
}: {
  label: string;
  services: ReturnType<typeof getPillarServices>;
}) {
  return (
    <div className="mb-16 last:mb-0">
      <div className="flex items-center gap-4 mb-8">
        <h3 className="font-display text-2xl text-[#1A2940] tracking-wide uppercase">
          {label}
        </h3>
        <div className="flex-1 h-px bg-[#DAEEF8]" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {services.map((service) => {
          const style = categoryStyle[service.category];
          return (
            <Link
              key={service.id}
              href="/contact"
              className={`block group relative bg-white rounded-3xl border-2 border-[#DAEEF8] ${style.hover} p-8 md:p-10 transition-all duration-500 hover:shadow-2xl`}
            >
              <div className="flex items-start gap-5 mb-6">
                <div
                  className={`w-16 h-16 rounded-2xl ${style.iconBg} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                >
                  {iconMap[service.icon] || <ClipboardCheck className="h-8 w-8" />}
                </div>
                <div>
                  <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${style.badge} mb-2`}>
                    {service.category}
                  </span>
                  <h4 className="text-xl md:text-2xl font-bold text-[#1A2940] leading-tight">
                    {service.title}
                  </h4>
                </div>
              </div>

              <p className="text-[#4A6580] leading-relaxed mb-6">
                {service.description}
              </p>

              <ul className="space-y-2.5 mb-8">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#4A6580]">
                    <CheckCircle className="h-4 w-4 text-[#E8630A] flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <span className="inline-flex items-center text-[#1A2940] group-hover:text-[#E8630A] font-semibold transition-colors">
                Nous contacter
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
