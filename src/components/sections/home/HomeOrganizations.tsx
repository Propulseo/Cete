"use client";

import { Building2 } from "lucide-react";
import { getOrganizations } from "@/lib/data-loader";

export function HomeOrganizations() {
  const organizations = getOrganizations();

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#4DA6D9]/10 text-[#1A2940] text-sm font-semibold uppercase tracking-wider mb-4">
            Références
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1A2940] mb-6">
            ORGANISATIONS ÉVALUÉES
          </h2>
          <p className="text-xl text-[#4A6580]">
            Ils nous font confiance pour évaluer et noter leur maîtrise du risque électrique
          </p>
        </div>
      </div>

      {/* Carousel with fade edges */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden">
          <div className="flex animate-scroll-logos">
            {[...organizations, ...organizations].map((org, i) => (
              <div
                key={`${org}-${i}`}
                className="flex-shrink-0 px-3"
              >
                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#F4F9FD] border border-[#DAEEF8] whitespace-nowrap">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#4DA6D9]/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[#4DA6D9]" />
                  </div>
                  <span className="font-semibold text-sm text-[#1A2940]">{org}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
