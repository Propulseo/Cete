"use client";

import { MapPin, Globe } from "lucide-react";

const interventionZones = [
  { name: "France", position: { top: "35%", left: "48%" }, primary: true },
  { name: "Afrique de l'Ouest", position: { top: "55%", left: "45%" }, primary: false },
  { name: "Afrique du Nord", position: { top: "42%", left: "48%" }, primary: false },
  { name: "Moyen-Orient", position: { top: "40%", left: "58%" }, primary: false },
  { name: "Océan Indien", position: { top: "60%", left: "62%" }, primary: false },
];

export function AboutWorldMap() {
  return (
    <section className="py-24 bg-[#1A2940] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A2940] via-[#0D5A8A] to-[#1A2940] opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#4DA6D9]/10 text-[#4DA6D9] text-sm font-semibold uppercase tracking-wider mb-4">
            <Globe className="h-4 w-4" />
            Rayonnement international
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white tracking-wide mb-4">
            ZONES D&apos;INTERVENTION
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            CETé intervient en France et à l&apos;international pour évaluer et noter
            la maîtrise du risque électrique
          </p>
        </div>

        {/* Simplified world map */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative aspect-[2/1] rounded-3xl bg-[#0D5A8A]/30 border border-[#4DA6D9]/20 overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full border-t border-[#4DA6D9]/10"
                  style={{ top: `${(i + 1) * 14.28}%` }}
                />
              ))}
              {[...Array(8)].map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full border-l border-[#4DA6D9]/10"
                  style={{ left: `${(i + 1) * 11.11}%` }}
                />
              ))}
            </div>

            {/* Intervention zone markers */}
            {interventionZones.map((zone) => (
              <div
                key={zone.name}
                className="absolute group cursor-pointer z-10"
                style={{ top: zone.position.top, left: zone.position.left }}
              >
                {zone.primary && (
                  <div className="absolute -inset-8 rounded-full bg-[#E8630A]/20 animate-pulse" />
                )}
                <div className={`relative flex items-center justify-center w-6 h-6 rounded-full ${
                  zone.primary
                    ? "bg-[#E8630A] shadow-lg shadow-[#E8630A]/30"
                    : "bg-[#4DA6D9] shadow-lg shadow-[#4DA6D9]/30"
                }`}>
                  <MapPin className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                    zone.primary ? "bg-[#E8630A] text-white" : "bg-[#4DA6D9] text-white"
                  }`}>
                    {zone.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {interventionZones.map((zone) => (
            <div key={zone.name} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                zone.primary ? "bg-[#E8630A]" : "bg-[#4DA6D9]"
              }`} />
              <span className="text-sm text-white/70">{zone.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
