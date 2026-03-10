"use client";

import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote: "Nous sommes passés de BB à AA en 14 mois. Le diagnostic CETé a identifié des écarts que nos audits internes ne voyaient pas. La notation a crédibilisé notre démarche auprès de nos donneurs d'ordre.",
    author: "Marie Dubois",
    role: "Directrice QSE",
    company: "Électricité Industrielle SA",
  },
  {
    quote: "Le Vigi-Score nous a donné un cadre objectif pour piloter le risque électrique. Nos chefs de chantier utilisent la grille CETé au quotidien. Le passage de B à BBB a été mesuré en 8 mois.",
    author: "Philippe Martin",
    role: "Directeur des Opérations",
    company: "Groupe Énergie Plus",
  },
  {
    quote: "La notation CETé est devenue un argument commercial. Nos clients industriels exigent un rating indépendant — nous avons obtenu AA et cela nous a ouvert trois marchés cadres.",
    author: "Sophie Laurent",
    role: "Présidente",
    company: "TST Solutions",
  },
];

export function HomeTestimonials() {
  return (
    <section className="py-24 bg-[#F4F9FD] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#4DA6D9]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#4DA6D9]/10 text-[#1A2940] text-sm font-semibold uppercase tracking-wider mb-4">
            Témoignages
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1A2940] mb-6">
            RÉSULTATS MESURABLES
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative p-8 rounded-3xl bg-white border border-[#DAEEF8] hover:border-[#E8630A]/40 hover:shadow-xl transition-all duration-500"
            >
              <div className="absolute top-6 right-6 text-[#E8630A]/20">
                <Quote className="w-12 h-12" />
              </div>

              <div className="relative z-10">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#E8630A] text-[#E8630A]" />
                  ))}
                </div>

                <p className="text-[#4A6580] leading-relaxed mb-6 italic">
                  &quot;{testimonial.quote}&quot;
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#1A2940] flex items-center justify-center text-white font-semibold">
                    {testimonial.author.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-[#1A2940]">{testimonial.author}</div>
                    <div className="text-sm text-[#4A6580]">{testimonial.role}, {testimonial.company}</div>
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
