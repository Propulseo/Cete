"use client";

import { XCircle, CheckCircle, AlertTriangle, Target } from "lucide-react";

const axes = [
  {
    theme: "Prévention primaire",
    vulnerable: "La Recommandation du CTST est méconnue et absente des plans de prévention.",
    talent: "La Recommandation du CTST est connue. Politique d'emploi des TST opérationnelle et sous contrôle.",
  },
  {
    theme: "Compétence de l'encadrement",
    vulnerable: "Attitude d'abandon, fuite des contrôles. Attentes aux encadrants non définies, formation inadaptée.",
    talent: "Exigences de la Recommandation intégrées au référentiel. Encadrement aux attendus.",
  },
  {
    theme: "Animation TST",
    vulnerable: "Absence de diagnostic de la maîtrise des TST. Aucun feed-back entreprise / OdF.",
    talent: "L'animation s'inscrit dans la boucle d'amélioration. DPS Or & Op alimentent annuellement le DUERP.",
  },
  {
    theme: "Formation",
    vulnerable: "Aucun contrôle de la qualité de la formation. Pas de feed-back OdF.",
    talent: "Un coaching opérationnel est en place. Feed-back structuré avec les OdF.",
  },
];

const ecarts = [
  {
    number: "01",
    title: "La Recommandation du CTST",
    description: "Le prescrit réglementaire reste le premier angle mort : méconnu du management, absent des pratiques terrain.",
  },
  {
    number: "02",
    title: "Les attentes aux encadrants",
    description: "Les missions et responsabilités des encadrants en matière de TST ne sont pas formalisées ni contrôlées.",
  },
  {
    number: "03",
    title: "Le contrôle du savoir-faire",
    description: "L'évaluation des compétences réelles sur le terrain est insuffisante ou inexistante.",
  },
];

export function ExpertiseComparison() {
  return (
    <section className="py-32 bg-[#F4F9FD] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Comparison */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-[#E8630A] font-bold text-sm tracking-widest uppercase">
              Faits marquants comparés
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1A2940] tracking-wide mt-4 mb-6">
              VULNÉRABLES{" "}
              <span className="text-[#8AA5BE]">vs</span>{" "}
              <span className="text-[#E8630A]">TALENTS</span>
            </h2>
            <div className="w-24 h-1.5 bg-[#E8630A] mx-auto" />
          </div>

          <div className="max-w-5xl mx-auto space-y-4">
            {/* Header */}
            <div className="hidden md:grid md:grid-cols-[1fr_1fr_1fr] gap-4 px-6 pb-2">
              <div className="text-sm font-bold text-[#1A2940] uppercase tracking-wider">Thème</div>
              <div className="text-sm font-bold text-red-600 uppercase tracking-wider flex items-center gap-2">
                <XCircle className="h-4 w-4" /> Vulnérables
              </div>
              <div className="text-sm font-bold text-green-600 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Talents
              </div>
            </div>

            {axes.map((axe, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#DAEEF8] hover:border-[#4DA6D9]/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="grid md:grid-cols-[1fr_1fr_1fr] gap-4 p-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-[#E8630A] flex-shrink-0" />
                    <span className="font-bold text-[#1A2940]">{axe.theme}</span>
                  </div>
                  <div className="text-sm text-[#4A6580] md:border-l md:border-[#DAEEF8] md:pl-4">
                    <span className="md:hidden text-xs font-bold text-red-600 block mb-1">Vulnérables :</span>
                    {axe.vulnerable}
                  </div>
                  <div className="text-sm text-[#4A6580] md:border-l md:border-[#DAEEF8] md:pl-4">
                    <span className="md:hidden text-xs font-bold text-green-600 block mb-1">Talents :</span>
                    {axe.talent}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tiercé des écarts */}
        <div>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8630A]/30 bg-[#E8630A]/10 px-4 py-2 mb-6">
              <Target className="h-4 w-4 text-[#E8630A]" />
              <span className="text-sm font-medium text-[#E8630A]">Les 3 axes de progrès systématiques</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-[#1A2940] tracking-wide">
              LE TIERCÉ DES <span className="text-[#E8630A]">ÉCARTS</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {ecarts.map((ecart) => (
              <div key={ecart.number} className="group relative">
                <div className="font-display text-7xl text-[#DAEEF8] group-hover:text-[#E8630A]/20 transition-colors duration-500 absolute -top-8 -left-2">
                  {ecart.number}
                </div>
                <div className="relative bg-white rounded-2xl p-8 border-2 border-[#DAEEF8] group-hover:border-[#E8630A] transition-all duration-500 hover:shadow-xl">
                  <h3 className="text-lg font-bold text-[#1A2940] mb-3">{ecart.title}</h3>
                  <p className="text-sm text-[#4A6580] leading-relaxed">{ecart.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
