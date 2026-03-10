"use client";

import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getFounders } from "@/lib/data-loader";

export function AboutFounders() {
  const founders = getFounders();

  return (
    <section className="py-24 bg-[#F4F9FD] relative overflow-hidden">
      <div className="absolute top-20 left-0 w-72 h-72 bg-[#4DA6D9]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-[#4DA6D9]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge className="bg-[#4DA6D9]/10 text-[#1A2940] hover:bg-[#4DA6D9]/20 mb-4">
            L&apos;Équipe
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl text-[#1A2940] tracking-wide mb-4">
            NOS FONDATEURS
          </h2>
          <p className="text-lg text-[#4A6580] max-w-2xl mx-auto">
            4 experts passionnés issus du SERECT, unis par une vision commune :
            transformer la vigilance en énergie collective
          </p>
          <div className="w-24 h-1 bg-[#E8630A] mx-auto rounded-full mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {founders.map((founder, index) => (
            <div
              key={founder.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-1.5 bg-gradient-to-r from-[#E8630A] via-[#4DA6D9] to-[#1A2940]" />

              <div className="flex flex-col sm:flex-row">
                <div className="relative h-48 sm:h-auto sm:w-48 flex-shrink-0 bg-gradient-to-br from-[#1A2940] to-[#0D5A8A] overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-display text-white/20 group-hover:text-[#E8630A]/30 transition-colors duration-500">
                      {founder.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-[#4DA6D9]/0 group-hover:bg-[#E8630A]/10 transition-colors duration-500" />
                </div>

                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-[#1A2940] group-hover:text-[#1A2940] transition-colors">
                        {founder.name}
                      </h3>
                      <p className="text-sm font-medium text-[#E8630A]">{founder.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#4DA6D9]/10 flex items-center justify-center group-hover:bg-[#E8630A]/10 transition-colors">
                      <ChevronRight className="h-5 w-5 text-[#4DA6D9]/30 group-hover:text-[#E8630A] transition-colors" />
                    </div>
                  </div>

                  <p className="text-[#4A6580] text-sm leading-relaxed mb-4">
                    {founder.bio}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {founder.specialties.map((specialty, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#4DA6D9]/10 text-[#1A2940] group-hover:bg-[#4DA6D9]/10 group-hover:text-[#1A2940] transition-colors"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
