"use client";

import { useState } from "react";
import { Play, Quote, Star, ChevronDown, ChevronUp } from "lucide-react";
import { brandify } from "@/components/ui/brand-name";

const testimonial = {
  pullQuote:
    "Le diagnostic CETé a identifié des écarts que nos audits internes ne voyaient pas. Notre passage de BBB à AAA a crédibilisé notre démarche auprès de nos donneurs d'ordre.",
  fullText: `Quand nous avons fait appel à CETé, notre notation initiale était BBB — reflet d'années de conformité minimale sans vision globale du risque électrique. Dès le premier diagnostic, l'équipe a mis en lumière des écarts que nos audits internes ne détectaient tout simplement pas.

Des problèmes de câblage dans nos installations industrielles, des protocoles de maintenance devenus obsolètes, et surtout un manque de culture sécurité électrique parmi nos équipes terrain. Le constat était sans appel, mais l'accompagnement proposé était à la hauteur du défi.

Chaque non-conformité a été documentée, priorisée et suivie dans un plan d'action structuré. Les consultants CETé ont formé nos chefs de chantier à la grille d'évaluation des 24 critères CTST, ce qui a provoqué une prise de conscience immédiate sur le terrain. En trois mois, nos indicateurs d'incidents avaient baissé de 40%.

Le passage de BBB à AAA en 14 mois a transformé notre positionnement commercial. Nous avons depuis remporté deux marchés cadres qui exigeaient explicitement un rating indépendant. La notation CETé est devenue un véritable avantage concurrentiel — et bien plus qu'un simple label.`,
  author: "Marie Dubois",
  role: "Directrice QSE",
  company: "Électricité Industrielle SA",
  ratingBefore: "BBB",
  ratingAfter: "AAA",
  duration: "14 mois",
};

export function HomeTestimonials() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-24 bg-gradient-to-b from-[#F4F9FD] to-white relative overflow-hidden">
      {/* Decorative bubbles */}
      <div className="absolute top-20 left-[10%] w-[300px] h-[300px] rounded-full bg-[#4DA6D9]/[0.06] blur-3xl" />
      <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] rounded-full bg-[#4DA6D9]/[0.04] blur-3xl" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#4DA6D9]/10 text-[#1A2940] text-sm font-semibold uppercase tracking-wider mb-4">
            Témoignage client
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1A2940]">
            RÉSULTATS MESURABLES
          </h2>
        </div>

        {/* Featured testimonial card */}
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl overflow-hidden bg-white border border-[#DAEEF8] shadow-xl shadow-[#4DA6D9]/5">
            {/* Video + Pull quote row */}
            <div className="grid lg:grid-cols-5">
              {/* Video area — 3/5 */}
              <div className="lg:col-span-3 relative">
                <div className="aspect-video bg-gradient-to-br from-[#1A2940] via-[#0D5A8A] to-[#1A2940] relative overflow-hidden">
                  {/* Subtle grid texture */}
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
                      backgroundSize: "48px 48px",
                    }}
                  />

                  {/* Ambient glow */}
                  <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full bg-[#4DA6D9]/10 blur-3xl" />
                  <div className="absolute bottom-1/4 right-1/4 w-52 h-52 rounded-full bg-[#E8630A]/[0.06] blur-3xl" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 group">
                    <div className="relative">
                      {/* Pulse ring */}
                      <span className="absolute inset-[-12px] rounded-full border-2 border-white/20 animate-ping [animation-duration:2.5s]" />
                      <span className="absolute inset-[-12px] rounded-full border border-white/10" />
                      <div className="w-20 h-20 rounded-full bg-[#E8630A] flex items-center justify-center shadow-2xl shadow-[#E8630A]/30 group-hover:scale-110 group-hover:shadow-[#E8630A]/50 transition-all duration-300">
                        <Play className="w-8 h-8 text-white ml-1" fill="white" />
                      </div>
                    </div>
                    <span className="text-white/50 text-sm font-medium tracking-widest uppercase">
                      Voir le témoignage
                    </span>
                  </div>
                </div>
              </div>

              {/* Pull quote — 2/5 */}
              <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col justify-center bg-gradient-to-br from-white to-[#F4F9FD]">
                <Quote className="w-14 h-14 text-[#E8630A]/15 mb-4 -scale-x-100" />

                <blockquote className="font-display text-xl lg:text-[1.35rem] xl:text-2xl text-[#1A2940] leading-snug italic mb-8">
                  {brandify(testimonial.pullQuote)}
                </blockquote>

                {/* Rating progress */}
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-lg bg-[#F97316]/10 text-[#F97316] font-bold text-sm">
                    {testimonial.ratingBefore}
                  </span>
                  <div className="flex-1 max-w-[80px] h-[2px] rounded-full bg-gradient-to-r from-[#F97316] via-[#A3E635] to-[#22C55E]" />
                  <span className="px-3 py-1.5 rounded-lg bg-[#22C55E]/10 text-[#22C55E] font-bold text-sm">
                    {testimonial.ratingAfter}
                  </span>
                  <span className="text-[#8AA5BE] text-sm ml-1">
                    en {testimonial.duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Full text + author */}
            <div className="px-8 lg:px-12 py-10 border-t border-[#DAEEF8]">
              <div className="max-w-4xl">
                {/* Expandable text */}
                <div
                  className={`relative overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                    isExpanded ? "max-h-[800px]" : "max-h-[120px]"
                  }`}
                >
                  {testimonial.fullText.split("\n\n").map((p, i) => (
                    <p
                      key={i}
                      className="text-[#4A6580] leading-relaxed mb-4 last:mb-0"
                    >
                      {brandify(p)}
                    </p>
                  ))}

                  {/* Fade when collapsed */}
                  {!isExpanded && (
                    <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                  )}
                </div>

                <button
                  onClick={() => setIsExpanded((v) => !v)}
                  className="mt-4 flex items-center gap-2 text-[#E8630A] font-medium text-sm hover:text-[#B84D08] transition-colors cursor-pointer group"
                >
                  {isExpanded ? (
                    <>
                      Réduire
                      <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                    </>
                  ) : (
                    <>
                      Lire le témoignage complet
                      <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              {/* Author bar */}
              <div className="mt-8 pt-8 border-t border-[#DAEEF8] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1A2940] to-[#0D5A8A] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#1A2940]/20">
                    {testimonial.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-[#1A2940] text-lg">
                      {testimonial.author}
                    </div>
                    <div className="text-[#4A6580]">
                      {testimonial.role} — {testimonial.company}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-[#E8630A] text-[#E8630A]"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
