"use client";

import { Shield, Lock, Heart, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getValues } from "@/lib/data-loader";

const iconMap: Record<string, React.ReactNode> = {
  shield: <Shield className="h-7 w-7" />,
  lock: <Lock className="h-7 w-7" />,
  heart: <Heart className="h-7 w-7" />,
  target: <Target className="h-7 w-7" />,
};

export function AboutValues() {
  const values = getValues();

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#1A2940]/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#4DA6D9]/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#1A2940]/10" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge className="bg-[#1A2940] text-white hover:bg-[#0D5A8A] mb-4">
            Notre ADN
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl text-[#1A2940] tracking-wide mb-4">
            INDÉPENDANCE & CONFIDENTIALITÉ
          </h2>
          <p className="text-lg text-[#4A6580] max-w-2xl mx-auto">
            Les valeurs fondamentales qui guident notre engagement quotidien
          </p>
          <div className="w-24 h-1 bg-[#E8630A] mx-auto rounded-full mt-6" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <div
              key={value.id}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#DAEEF8] hover:border-[#E8630A]/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4DA6D9]/0 to-[#4DA6D9]/0 group-hover:from-[#E8630A]/5 group-hover:to-transparent transition-all duration-500" />

              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1A2940] to-[#0D5A8A] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  {iconMap[value.icon]}
                </div>
                <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-[#E8630A]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <h3 className="text-lg font-bold text-[#1A2940] mb-3 group-hover:text-[#1A2940] transition-colors">
                {value.title}
              </h3>
              <p className="text-sm text-[#4A6580] leading-relaxed">
                {value.description}
              </p>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8630A] to-[#4DA6D9] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
