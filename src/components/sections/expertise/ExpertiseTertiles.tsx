"use client";

import { AlertTriangle, MinusCircle, Trophy } from "lucide-react";

const tertiles = [
  {
    id: "vulnerables",
    name: "Les Vulnérables",
    subtitle: "« Les Grognons »",
    icon: <AlertTriangle className="h-8 w-8" />,
    color: {
      bg: "bg-red-500/10",
      border: "border-red-500/30 hover:border-red-500",
      iconBg: "bg-red-500",
      text: "text-red-600",
      badge: "bg-red-500/20 text-red-600",
    },
    quote: "Il faut un doctorat pour encadrer les TST. Recommandation ? CTST ?...",
    risk: "Probabilité d'accident forte",
    riskLabel: "VULNÉRABILITÉ",
    traits: [
      "Méconnaissance du prescrit réglementaire par tous les acteurs",
      "Absence de contrôle des exigences de la Recommandation CTST",
      "Chargé de travaux abandonné, gestes métiers incertains",
      "Repas et nocturnes comme mesures d'ajustement",
    ],
  },
  {
    id: "ventre-mou",
    name: "Le Ventre Mou",
    subtitle: "Position médiane",
    icon: <MinusCircle className="h-8 w-8" />,
    color: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30 hover:border-yellow-500",
      iconBg: "bg-yellow-500",
      text: "text-yellow-600",
      badge: "bg-yellow-500/20 text-yellow-600",
    },
    quote: "Tout est conforme. Je forme mes électriciens dans un OdF agréé. Ce n'est qu'une Recommandation.",
    risk: "Probabilité d'accident modérée",
    riskLabel: "VIGILANCE",
    traits: [
      "Méconnaissance du prescrit par le management",
      "Faiblesse du respect du prescrit par un ou plusieurs acteurs",
      "Absence de contrôle des exigences CTST",
      "Préparation et organisation perfectibles",
    ],
  },
  {
    id: "talents",
    name: "Les Talents",
    subtitle: "L'excellence opérationnelle",
    icon: <Trophy className="h-8 w-8" />,
    color: {
      bg: "bg-green-500/10",
      border: "border-green-500/30 hover:border-green-500",
      iconBg: "bg-green-500",
      text: "text-green-600",
      badge: "bg-green-500/20 text-green-600",
    },
    quote: "Je suis en capacité de m'autoévaluer. Je connais mes faiblesses et points forts. La boucle d'amélioration fonctionne.",
    risk: "Probabilité d'accident faible",
    riskLabel: "MAÎTRISE",
    traits: [
      "Respect du prescrit de la Recommandation CTST voire au-delà",
      "Leadership, référent TST & QSE, encadrement aux attendus",
      "Chargé de travaux performant et compétent",
      "Sécurité et productivité avérées",
    ],
  },
];

export function ExpertiseTertiles() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 font-display text-[12rem] text-[#DAEEF8] leading-none select-none whitespace-nowrap pointer-events-none">
        TERTILES
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mb-16">
          <span className="text-[#E8630A] font-bold text-sm tracking-widest uppercase">
            Observatoire O-M-T
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1A2940] tracking-wide mt-4">
            OÙ VOUS{" "}
            <span className="text-[#E8630A]">SITUEZ-VOUS</span> ?
          </h2>
          <div className="w-24 h-1.5 bg-[#E8630A] mt-6" />
          <p className="text-lg text-[#4A6580] mt-6 max-w-xl">
            L&apos;analyse croisée AudiMaT (auto-évaluation) et respect de la Recommandation CTST
            révèle trois profils distincts d&apos;entreprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tertiles.map((t) => (
            <div
              key={t.id}
              className={`group relative rounded-3xl border-2 ${t.color.border} p-8 transition-all duration-500 hover:shadow-2xl`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl ${t.color.iconBg} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500`}>
                  {t.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A2940]">{t.name}</h3>
                  <span className="text-sm text-[#8AA5BE]">{t.subtitle}</span>
                </div>
              </div>

              <blockquote className={`text-sm italic ${t.color.text} bg-${t.id === "vulnerables" ? "red" : t.id === "ventre-mou" ? "yellow" : "green"}-50 rounded-xl p-4 mb-6 border-l-4 ${t.id === "vulnerables" ? "border-red-500" : t.id === "ventre-mou" ? "border-yellow-500" : "border-green-500"}`}>
                &laquo; {t.quote} &raquo;
              </blockquote>

              <ul className="space-y-2.5 mb-6">
                {t.traits.map((trait, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#4A6580]">
                    <span className={`w-1.5 h-1.5 rounded-full ${t.color.iconBg} flex-shrink-0 mt-1.5`} />
                    {trait}
                  </li>
                ))}
              </ul>

              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${t.color.badge}`}>
                {t.riskLabel} — {t.risk}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[#4A6580] italic mt-12 max-w-2xl mx-auto">
          Une maîtrise opérationnelle des TST proportionnelle au respect de la Recommandation, voire plus.
        </p>
      </div>
    </section>
  );
}
