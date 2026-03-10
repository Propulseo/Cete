"use client";

import Link from "next/link";
import { Zap, CheckCircle, Star, Award, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getExpertiseServices } from "@/lib/data-loader";

const icons = {
  "clipboard-check": CheckCircle,
  "star": Star,
  "award": Award,
  "bell": Shield,
};

export function HomeServices() {
  const services = getExpertiseServices();

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#EC8D19]/10 text-[#001a33] text-sm font-semibold uppercase tracking-wider mb-4">
            Nos leviers
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#001a33] mb-6">
            DE L&apos;ÉVALUATION AU AAA
          </h2>
          <p className="text-xl text-[#6A6D6A]">
            Quatre prestations structurées qui alimentent et améliorent votre notation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.slice(0, 4).map((service) => {
            const Icon = icons[service.icon as keyof typeof icons] || Zap;

            return (
              <div
                key={service.id}
                className="group relative p-8 rounded-3xl bg-[#F5F6F4] hover:bg-[#001a33] border border-transparent hover:border-[#EC8D19]/30 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#EC8D19]/5 group-hover:bg-[#EC8D19]/10 rounded-full blur-2xl transition-all duration-500" />

                <div className="relative z-10 flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-[#001a33] group-hover:bg-[#EC8D19] flex items-center justify-center transition-colors duration-300">
                      <Icon className="w-8 h-8 text-[#EC8D19] group-hover:text-[#001a33] transition-colors duration-300" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl text-[#001a33] group-hover:text-white mb-2 transition-colors duration-300">
                      {service.title.toUpperCase()}
                    </h3>
                    <p className="text-[#6A6D6A] group-hover:text-white/70 mb-4 transition-colors duration-300">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-[#6A6D6A] group-hover:text-white/60 transition-colors duration-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EC8D19]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 border-2 border-[#001a33] text-[#001a33] hover:bg-[#001a33] hover:text-white rounded-xl transition-all duration-300"
          >
            <Link href="/services">
              Voir l&apos;accompagnement complet
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
