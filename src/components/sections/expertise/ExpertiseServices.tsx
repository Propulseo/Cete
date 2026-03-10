"use client";

import Link from "next/link";
import { ClipboardCheck, Star, Award, Bell, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getExpertiseServices } from "@/lib/data-loader";

const iconMap: Record<string, React.ReactNode> = {
  "clipboard-check": <ClipboardCheck className="h-6 w-6" />,
  star: <Star className="h-6 w-6" />,
  award: <Award className="h-6 w-6" />,
  bell: <Bell className="h-6 w-6" />,
};

export function ExpertiseServices() {
  const expertiseServices = getExpertiseServices();

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#EC8D19]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#001a33]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge className="bg-[#001a33] text-white hover:bg-[#002244] mb-4">
            Nos Offres
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl text-[#001a33] tracking-wide mb-4">
            OFFRES EXPERTISE
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Des solutions adaptees a vos besoins d&apos;evaluation et de certification
          </p>
          <div className="w-24 h-1 bg-[#EC8D19] mx-auto rounded-full mt-6" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {expertiseServices.map((service) => (
            <div
              key={service.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#EC8D19]/30"
            >
              <div className="h-1.5 bg-gradient-to-r from-[#EC8D19] via-[#001a33] to-[#001a33]" />

              <div className="p-6">
                <div className="relative mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#001a33] to-[#002244] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    {iconMap[service.icon] || <Zap className="h-6 w-6" />}
                  </div>
                  <div className="absolute inset-0 w-14 h-14 rounded-2xl bg-[#EC8D19]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <h3 className="text-lg font-bold text-[#001a33] mb-2 group-hover:text-[#001a33] transition-colors line-clamp-2">
                  {service.title}
                </h3>

                <p className="text-sm text-gray-500 mb-4">
                  {service.shortDescription}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#EC8D19]" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-between text-[#001a33] hover:text-[#001a33] hover:bg-[#EC8D19]/10 group/btn"
                >
                  <Link href="/contact">
                    En savoir plus
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EC8D19] to-[#001a33] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
