import { MessageSquare } from "lucide-react";
import { BrandName } from "@/components/ui/brand-name";

export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1A2940] via-[#0D5A8A] to-[#1A2940] py-20 md:py-24">
      {/* Decorative blurs */}
      <div className="absolute top-10 left-[10%] h-64 w-64 rounded-full bg-[#4DA6D9]/10 blur-3xl" />
      <div className="absolute bottom-10 right-[10%] h-48 w-48 rounded-full bg-[#4DA6D9]/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#E8630A]/30 bg-[#E8630A]/10 px-4 py-2">
            <MessageSquare className="h-4 w-4 text-[#E8630A]" />
            <span className="text-sm font-medium text-[#E8630A]">
              Agence de Notation <BrandName />
            </span>
          </div>

          <h1>
            <span className="block font-display text-5xl tracking-wide text-white/90 md:text-6xl lg:text-7xl">
              PARLONS DE
            </span>
            <span className="-mt-1 block font-display text-5xl tracking-wide text-[#E8630A] md:text-6xl lg:text-7xl">
              VOTRE PROJET
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
            Demandez votre évaluation ou posez vos questions sur la notation.
            Entretien dans les meilleurs délais.
          </p>
        </div>
      </div>
    </section>
  );
}
