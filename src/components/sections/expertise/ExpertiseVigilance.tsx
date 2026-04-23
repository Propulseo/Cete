"use client";

import { ShieldCheck, AlertTriangle, AlertOctagon, ChevronDown } from "lucide-react";
import { useState } from "react";

const nonConformites = [
  {
    title: "AuDiMaT — Auto-évaluation",
    items: [
      "Formation dispensée par un organisme de formation (OdF) non agréé",
      "Opérateur non habilité ou habilitation expirée",
      "Absence de DUERP (Document Unique d'Évaluation des Risques Professionnels)",
    ],
  },
  {
    title: "Organisationnel",
    items: [
      "Absence d'autorisation administrative requise",
      "Documentation technique manquante ou obsolète",
      "Non-respect des procédures de consignation / déconsignation",
    ],
  },
  {
    title: "Opérationnel",
    items: [
      "Absence d'EPI (Équipements de Protection Individuelle) conformes",
      "Écart volontaire par rapport aux consignes de sécurité",
      "Non-respect des gestes métiers prescrits lors d'interventions TST",
    ],
  },
];

function Accordion({ title, items }: { title: string; items: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#DAEEF8] rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/80 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <AlertOctagon className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
          <span className="font-bold text-[#1A2940]">{title}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-[#8AA5BE] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="px-5 pb-5 space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[#4A6580]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] mt-1.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ExpertiseVigilance() {
  return (
    <section className="py-24 bg-[#F4F9FD] relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4DA6D9]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#4DA6D9]/10 text-[#1A2940] text-sm font-semibold uppercase tracking-wider mb-4">
            Concept fondateur
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-[#1A2940] tracking-wide mb-4">
            VIGILANCE{" "}
            <span className="text-[#E8630A]">↔</span>{" "}
            VULNÉRABILITÉ
          </h2>
          <p className="text-lg text-[#4A6580] max-w-2xl mx-auto">
            La probabilité de survenue d&apos;un accident est liée au niveau de vulnérabilité,
            inversement proportionnel à la prévention réalisée.
          </p>
          <div className="w-24 h-1 bg-[#E8630A] mx-auto rounded-full mt-6" />
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Jauge bi-directionnelle */}
          <div className="relative mb-12">
            <div className="flex rounded-2xl overflow-hidden h-16 shadow-lg">
              <div className="flex-1 bg-gradient-to-r from-[#22C55E] to-[#A3E635] flex items-center justify-center">
                <span className="text-white font-bold text-lg drop-shadow">Vigilance élevée</span>
              </div>
              <div className="flex-1 bg-gradient-to-r from-[#F97316] to-[#EF4444] flex items-center justify-center">
                <span className="text-white font-bold text-lg drop-shadow">Vulnérabilité élevée</span>
              </div>
            </div>
            <div className="flex justify-between mt-3">
              <span className="text-sm text-[#22C55E] font-semibold">Probabilité accident faible</span>
              <span className="text-sm text-[#EF4444] font-semibold">Probabilité accident forte</span>
            </div>
          </div>

          {/* Deux colonnes */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 rounded-3xl bg-[#22C55E]/5 border border-[#22C55E]/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-[#22C55E]" />
                </div>
                <h3 className="font-display text-xl text-[#1A2940] font-bold">Vigilance</h3>
              </div>
              <p className="text-[#4A6580] leading-relaxed mb-4">
                Maîtrise des 3C : auto-évaluation, respect de la Recommandation
                du Métier et maîtrise des gestes métiers.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-lg bg-[#22C55E]/20 text-[#22C55E] font-bold text-sm">A</span>
                <span className="px-3 py-1 rounded-lg bg-[#A3E635]/20 text-[#65A30D] font-bold text-sm">B</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#EF4444]/5 border border-[#EF4444]/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#EF4444]/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
                </div>
                <h3 className="font-display text-xl text-[#1A2940] font-bold">Vulnérabilité</h3>
              </div>
              <p className="text-[#4A6580] leading-relaxed mb-4">
                Défaillances sur un ou plusieurs des 3C. La probabilité d&apos;accident
                augmente proportionnellement.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-lg bg-[#F97316]/20 text-[#F97316] font-bold text-sm">C</span>
                <span className="px-3 py-1 rounded-lg bg-[#EF4444]/20 text-[#EF4444] font-bold text-sm">D</span>
              </div>
            </div>
          </div>

          {/* Non-conformités majeures → note D */}
          <div>
            <h3 className="font-display text-2xl text-[#1A2940] font-bold text-center mb-2">
              Ce qui déclenche <span className="text-[#EF4444]">une note D</span>
            </h3>
            <p className="text-sm text-[#4A6580] text-center mb-8 max-w-lg mx-auto">
              Certaines non-conformités majeures entraînent automatiquement
              la note D sur le critère concerné.
            </p>
            <div className="max-w-2xl mx-auto space-y-3">
              {nonConformites.map((cat) => (
                <Accordion key={cat.title} title={cat.title} items={cat.items} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
