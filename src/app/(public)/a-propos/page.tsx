import { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { FoundersGrid } from "@/components/sections/FoundersGrid";
import { ValuesSection } from "@/components/sections/ValuesSection";
import {
  YEARS_EXPERIENCE,
  CLIENTS_ACCOMPANIED,
  FOUNDERS_COUNT,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Qui sommes-nous ?",
  description:
    "Découvrez CETé, consortium fondé par 4 experts du SERECT. 20+ ans d'expérience en sécurité électrique et Travaux Sous Tension.",
};

const stats = [
  { value: CLIENTS_ACCOMPANIED, label: "Clients accompagnés" },
  { value: YEARS_EXPERIENCE, label: "Années d'expertise" },
  { value: FOUNDERS_COUNT.toString(), label: "Fondateurs experts" },
];

export default function AProposPage() {
  return (
    <>
      <HeroSection
        title="Qui sommes-nous ?"
        description="Passionnés, passeurs de prévention"
        size="small"
      />

      {/* History Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Le Consortium CETé
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Nés du <strong className="text-foreground">SERECT</strong>{" "}
              (Société d&apos;Études, de Recherches et de Conseils Techniques),
              nous avons cumulé plus de 20 ans d&apos;expérience terrain en
              sécurité électrique et gestion des risques.
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Notre mission : devenir l&apos;
              <strong className="text-primary">
                agence de notation indépendante de référence
              </strong>{" "}
              sur le risque électrique et les Travaux Sous Tension (TST), en
              France et à l&apos;international.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-xl bg-secondary p-8 text-center"
              >
                <div className="text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="mt-2 text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FoundersGrid />
      <ValuesSection />
    </>
  );
}
