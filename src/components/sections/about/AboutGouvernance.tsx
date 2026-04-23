import { Users, Monitor, ShieldCheck } from "lucide-react";
import { brandify } from "@/components/ui/brand-name";

const items = [
  {
    icon: Users,
    title: "Comité de Suivi",
    description:
      "Composé des fondateurs CETé et d'un expert mandaté, le Comité de Suivi assure la notation, l'évaluation dynamique et la durée de validité de chaque certificat.",
  },
  {
    icon: Monitor,
    title: "Logiciel CIBLE",
    description:
      "Outil propriétaire de capitalisation et d'analyse. CIBLE centralise l'ensemble des données d'évaluation et garantit la traçabilité de chaque notation.",
  },
  {
    icon: ShieldCheck,
    title: "Indépendance",
    description:
      "CETé est une agence de notation indépendante. L'évaluation est réalisée sans lien commercial avec les organisations évaluées, garantissant l'objectivité du Vigi-Score.",
  },
];

export function AboutGouvernance() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#4DA6D9]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#4DA6D9]/10 text-[#1A2940] text-sm font-semibold uppercase tracking-wider mb-4">
            Gouvernance
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-[#1A2940] tracking-wide mb-4">
            UNE NOTATION{" "}
            <span className="text-[#E8630A]">INDÉPENDANTE</span>
          </h2>
          <p className="text-lg text-[#4A6580] max-w-2xl mx-auto">
            La crédibilité du Vigi-Score repose sur une gouvernance rigoureuse,
            un outil propriétaire et une totale indépendance vis-à-vis des organisations évaluées.
          </p>
          <div className="w-24 h-1 bg-[#E8630A] mx-auto rounded-full mt-6" />
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {items.map((item) => (
            <div
              key={item.title}
              className="group p-8 rounded-3xl bg-[#F4F9FD] border border-[#DAEEF8] hover:border-[#4DA6D9]/30 hover:shadow-xl transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#4DA6D9]/10 flex items-center justify-center mb-6 group-hover:bg-[#4DA6D9] transition-colors duration-300">
                <item.icon className="w-7 h-7 text-[#4DA6D9] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-display text-xl text-[#1A2940] font-bold mb-3">
                {item.title}
              </h3>
              <p className="text-[#4A6580] leading-relaxed">
                {brandify(item.description)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
