"use client";

import Link from "next/link";
import { Users, Zap, HardHat, BookOpen, Sparkles, ArrowRight, CheckCircle, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getConseilServices } from "@/lib/data-loader";

const iconMap: Record<string, React.ReactNode> = {
  users: <Users className="h-8 w-8" />,
  zap: <Zap className="h-8 w-8" />,
  "hard-hat": <HardHat className="h-8 w-8" />,
  "book-open": <BookOpen className="h-8 w-8" />,
};

export function ServicesCatalog() {
  const conseilServices = getConseilServices();

  return (
    <section className="py-32 bg-[#F4F9FD] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
          <div>
            <span className="text-[#E8630A] font-bold text-sm tracking-widest uppercase">Nos offres</span>
            <h2 className="font-display text-5xl md:text-6xl text-[#1A2940] tracking-wide mt-4">
              SERVICES
            </h2>
          </div>
          <p className="text-[#4A6580] max-w-md mt-6 lg:mt-0 lg:text-right">
            Coaching et formation pour tous les niveaux de votre organisation
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 group">
            <div className="relative h-full bg-[#1A2940] rounded-3xl overflow-hidden min-h-[500px]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#4DA6D9]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10 p-10 h-full flex flex-col">
                <div className="inline-flex items-center gap-2 bg-[#E8630A] text-white px-4 py-2 rounded-full text-sm font-bold w-fit">
                  <Sparkles className="h-4 w-4" />
                  Populaire
                </div>

                <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur flex items-center justify-center text-[#4DA6D9] mt-8">
                  {iconMap[conseilServices[0]?.icon] || <Users className="h-10 w-10" />}
                </div>

                <h3 className="font-display text-4xl md:text-5xl text-white mt-8 tracking-wide">
                  {conseilServices[0]?.title.split(' ').slice(0, 2).join(' ')}
                  <span className="block text-[#4DA6D9]">{conseilServices[0]?.title.split(' ').slice(2).join(' ')}</span>
                </h3>

                <p className="text-white/70 mt-6 text-lg leading-relaxed max-w-md">
                  {conseilServices[0]?.description}
                </p>

                <div className="flex flex-wrap gap-3 mt-8">
                  {conseilServices[0]?.features.map((feature, i) => (
                    <span key={i} className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white/80 text-sm">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                  <Button
                    asChild
                    className="bg-[#E8630A] text-white hover:bg-[#B84D08] font-bold px-8 py-6 rounded-full group/btn"
                  >
                    <Link href="/contact">
                      Demander un devis
                      <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            {conseilServices.slice(1).map((service) => (
              <div
                key={service.id}
                className="group relative bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-transparent hover:border-[#E8630A]"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#4DA6D9] flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                    {iconMap[service.icon] || <Zap className="h-7 w-7" />}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1A2940] group-hover:text-[#1A2940] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-[#4A6580] text-sm mt-1">
                      {service.shortDescription}
                    </p>

                    <div className="flex items-center gap-4 mt-4 text-sm text-[#8AA5BE]">
                      {service.features.slice(0, 2).map((f, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-[#E8630A]" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ArrowUpRight className="h-6 w-6 text-[#8AA5BE] group-hover:text-[#E8630A] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
