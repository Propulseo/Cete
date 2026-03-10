import { Zap } from "lucide-react";

export function BlogHero() {
  return (
    <section className="relative py-24 md:py-32 bg-[#001a33] overflow-hidden">
      {/* Gradient overlays */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(236,141,25,0.06), transparent 50%),
            radial-gradient(ellipse at 80% 30%, rgba(0,26,51,0.3), transparent 50%)
          `,
        }}
      />
      <div className="absolute inset-0 bg-bubbles-pattern opacity-30" />

      {/* Floating orbs */}
      <div className="absolute top-10 right-20 w-48 h-48 rounded-full bg-[#EC8D19]/8 blur-3xl animate-float" />
      <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-[#001a33]/20 blur-3xl animate-float animation-delay-300" />

      {/* Decorative large text */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 font-display text-[20rem] leading-none text-white/[0.02] select-none pointer-events-none hidden lg:block">
        &
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#EC8D19]/30 backdrop-blur-sm mb-8 animate-slide-up">
            <Zap className="w-4 h-4 text-[#EC8D19]" />
            <span className="text-sm text-[#EC8D19] font-medium tracking-wide uppercase">
              Analyses & Perspectives
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6 opacity-0 animate-slide-up animation-delay-100">
            DÉCRYPTAGES{" "}
            <span className="text-gradient-accent">&</span>{" "}
            ANALYSES
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed opacity-0 animate-slide-up animation-delay-200">
            Réglementation, retours d&apos;expérience et bonnes pratiques :
            nos experts décryptent l&apos;actualité du risque électrique.
          </p>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#FCFCFC" />
        </svg>
      </div>
    </section>
  );
}
