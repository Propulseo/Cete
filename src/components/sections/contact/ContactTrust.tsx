import { Shield, Lock, Clock } from "lucide-react";

const trustItems = [
  {
    icon: Shield,
    title: "Indépendance totale",
    description: "Aucun lien avec les prestataires ou fournisseurs évalués",
  },
  {
    icon: Lock,
    title: "Confidentialité garantie",
    description: "Vos résultats et votre notation restent strictement confidentiels",
  },
  {
    icon: Clock,
    title: "Réponse sous 24h",
    description: "Cadrage initial et proposition de calendrier sous 24h ouvrées",
  },
];

export function ContactTrust() {
  return (
    <section className="border-y border-[#E2E4E0] bg-[#F5F6F4] py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-start gap-4 text-center md:flex-col md:items-center">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#001a33]/5">
                <item.icon className="h-5 w-5 text-[#001a33]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#001a33]">{item.title}</h3>
                <p className="mt-1 text-sm text-[#6A6D6A]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
