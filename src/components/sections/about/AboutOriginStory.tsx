"use client";

import { Zap, Award, Shield, Building2, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const timelineEvents = [
  {
    year: "2000",
    title: "Création du SERECT",
    description: "Société d'Études, de Recherches et de Conseils Techniques. Début de l'expertise terrain en sécurité électrique.",
    icon: Building2,
  },
  {
    year: "2010",
    title: "200+ organisations évaluées",
    description: "Consolidation de l'expertise terrain. Conception des premiers outils de scoring du risque électrique.",
    icon: Award,
  },
  {
    year: "2020",
    title: "Conception du référentiel ADN",
    description: "Structuration de la méthodologie de notation AAA-DDD. Formalisation des trois axes d'évaluation.",
    icon: GraduationCap,
  },
  {
    year: "2024",
    title: "Création de CETé",
    description: "Première agence de notation indépendante du risque électrique en France. Séparation du SERECT pour garantir l'indépendance.",
    icon: Zap,
  },
];

export function AboutOriginStory() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#EC8D19]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-[#001a33]/10 text-[#001a33] hover:bg-[#001a33]/20 mb-4">
              Notre Histoire
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl text-[#001a33] tracking-wide mb-4">
              LE CONSORTIUM CETé
            </h2>
            <div className="w-24 h-1 bg-[#EC8D19] mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed">
                Le <strong className="text-[#001a33]">SERECT</strong> (Société d&apos;Études,
                de Recherches et de Conseils Techniques) a accompagné pendant 20 ans
                les organisations dans la maîtrise du risque électrique. Cette expérience terrain
                a révélé un manque : <strong className="text-[#001a33]">aucun système de notation indépendant</strong> n&apos;existait.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                En 2024, quatre experts fondent <strong className="text-[#001a33]">CETé</strong> —
                une structure séparée du SERECT pour garantir une{" "}
                <strong className="text-[#001a33]">indépendance totale</strong>.
                Mission : devenir l&apos;agence de notation de référence du risque électrique
                en France et à l&apos;international.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="h-12 w-12 rounded-full bg-[#EC8D19] flex items-center justify-center">
                  <Zap className="h-6 w-6 text-[#001a33]" />
                </div>
                <p className="text-[#001a33] font-semibold">
                  Indépendance. Objectivité. Transparence.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#001a33] to-[#002244] p-8 relative overflow-hidden group">
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                  <div className="text-8xl font-display text-[#EC8D19] mb-4 group-hover:scale-110 transition-transform duration-500">
                    20+
                  </div>
                  <p className="text-white/80 text-xl">Années d&apos;expertise</p>
                  <p className="text-white/60 text-sm mt-2">en sécurité électrique</p>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-3 animate-float">
                <Award className="h-8 w-8 text-[#EC8D19]" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-3 animate-float animation-delay-300">
                <Shield className="h-8 w-8 text-[#001a33]" />
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#EC8D19] via-[#001a33] to-[#001a33] hidden md:block" />

            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <div
                  key={event.year}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div
                      className={`inline-block bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 ${
                        index % 2 === 0 ? "border-[#EC8D19]" : "border-[#001a33]"
                      }`}
                    >
                      <span className="text-sm font-bold text-[#EC8D19]">{event.year}</span>
                      <h3 className="text-xl font-bold text-[#001a33] mt-1">{event.title}</h3>
                      <p className="text-gray-600 mt-2">{event.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg border-4 border-[#001a33] z-10">
                    <event.icon className="h-6 w-6 text-[#EC8D19]" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
