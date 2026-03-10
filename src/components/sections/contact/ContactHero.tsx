import { MessageSquare } from "lucide-react";

export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#001a33] via-[#002244] to-[#001a33] py-20 md:py-24">
      {/* Decorative blurs */}
      <div className="absolute top-10 left-[10%] h-64 w-64 rounded-full bg-[#EC8D19]/10 blur-3xl" />
      <div className="absolute bottom-10 right-[10%] h-48 w-48 rounded-full bg-[#EC8D19]/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#EC8D19]/30 bg-[#EC8D19]/10 px-4 py-2">
            <MessageSquare className="h-4 w-4 text-[#EC8D19]" />
            <span className="text-sm font-medium text-[#EC8D19]">
              Agence de Notation CETé
            </span>
          </div>

          <h1>
            <span className="block font-display text-5xl tracking-wide text-white/90 md:text-6xl lg:text-7xl">
              PARLONS DE
            </span>
            <span className="-mt-1 block font-display text-5xl tracking-wide text-[#EC8D19] md:text-6xl lg:text-7xl">
              VOTRE PROJET
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
            Demandez votre évaluation ou posez vos questions sur la notation.
            Réponse garantie sous 24h ouvrées.
          </p>
        </div>
      </div>
    </section>
  );
}
