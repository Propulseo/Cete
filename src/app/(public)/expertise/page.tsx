"use client";

import Link from "next/link";
import {
  CheckCircle,
  Shield,
  TrendingUp,
  Target,
  Zap,
  Sparkles,
  ArrowRight,
  ClipboardCheck,
  Star,
  Award,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getExpertiseServices } from "@/lib/data-loader";

const adnPillars = [
  {
    icon: <CheckCircle className="h-8 w-8" />,
    title: "Auto-évaluation",
    description:
      "Diagnostic initial de votre situation actuelle. Analyse de vos pratiques et identification des points d'amélioration.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Respect du prescrit",
    description:
      "Vérification de la conformité réglementaire. Audit des procédures et documentation obligatoire.",
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Maîtrise opérationnelle",
    description:
      "Évaluation de la gestion quotidienne des risques. Mesure de la culture sécurité et des comportements terrain.",
  },
];

const iconMap: Record<string, React.ReactNode> = {
  "clipboard-check": <ClipboardCheck className="h-6 w-6" />,
  star: <Star className="h-6 w-6" />,
  award: <Award className="h-6 w-6" />,
  bell: <Bell className="h-6 w-6" />,
};

export default function ExpertisePage() {
  const expertiseServices = getExpertiseServices();

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[70vh] overflow-hidden bg-gradient-to-b from-[#001a33] via-[#002244] to-[#001a33]">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />

          {/* Floating orbs */}
          <div className="absolute top-20 right-[10%] h-64 w-64 rounded-full bg-[#ffc107]/10 blur-3xl animate-float" />
          <div className="absolute bottom-20 left-[15%] h-48 w-48 rounded-full bg-[#0066cc]/20 blur-3xl animate-float animation-delay-300" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#ffc107]/5 blur-3xl animate-pulse-glow" />

          {/* Lightning accents */}
          <div className="absolute top-10 left-[20%] text-[#ffc107]/20 animate-electric-flicker">
            <Zap className="h-16 w-16" />
          </div>
          <div className="absolute bottom-20 right-[25%] text-[#ffc107]/15 animate-electric-flicker animation-delay-500">
            <Zap className="h-12 w-12 rotate-12" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffc107]/30 bg-[#ffc107]/10 px-4 py-2 mb-8 animate-slide-up">
              <Sparkles className="h-4 w-4 text-[#ffc107]" />
              <span className="text-sm font-medium text-[#ffc107]">Méthodologie exclusive</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-wide mb-6 animate-slide-up animation-delay-100">
              LA MÉTHODE{" "}
              <span className="text-[#ffc107] relative">
                ADN
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-[#ffc107]/50 rounded-full" />
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/80 font-light mb-6 animate-slide-up animation-delay-200">
              <span className="text-[#ffc107] font-semibold">A</span>gence{" "}
              <span className="text-[#ffc107] font-semibold">D</span>e{" "}
              <span className="text-[#ffc107] font-semibold">N</span>otation
            </p>

            {/* Description */}
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up animation-delay-300">
              Rating indépendant du risque électrique. Une évaluation objective
              de votre maîtrise opérationnelle, de AAA à DDD.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-400">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-[#ffc107] text-[#001a33] hover:bg-[#ffcd38] font-semibold px-8 py-6 text-lg rounded-full group shadow-lg shadow-[#ffc107]/25 hover:shadow-[#ffc107]/40 transition-all"
                >
                  Demander une évaluation
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-full"
                >
                  Voir nos services
                </Button>
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className="mt-16 animate-bounce">
              <div className="w-6 h-10 rounded-full border-2 border-white/30 mx-auto flex justify-center pt-2">
                <div className="w-1.5 h-3 bg-[#ffc107] rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path
              d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ===== ADN METHOD SECTION - PRESERVED ===== */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Visual - Radar/Target */}
            <div className="relative order-2 lg:order-1">
              <div className="relative mx-auto aspect-square max-w-md">
                {/* Concentric circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-full rounded-full border-2 border-primary/10" />
                </div>
                <div className="absolute inset-8 flex items-center justify-center">
                  <div className="h-full w-full rounded-full border-2 border-primary/20" />
                </div>
                <div className="absolute inset-16 flex items-center justify-center">
                  <div className="h-full w-full rounded-full border-2 border-primary/30" />
                </div>
                <div className="absolute inset-24 flex items-center justify-center">
                  <div className="h-full w-full rounded-full border-2 border-accent/50" />
                </div>

                {/* Center target */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-accent shadow-lg">
                    <Target className="h-16 w-16 text-accent-foreground" />
                  </div>
                </div>

                {/* Rating labels */}
                <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                  AAA - Maîtrise optimale
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                  DDD - Risque critique
                </div>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                  BB
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                  AA
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Les 3 Piliers de la Méthode ADN
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Notre méthodologie exclusive permet d&apos;évaluer objectivement
                le niveau de maîtrise du risque électrique de votre
                organisation.
              </p>

              <div className="mt-8 space-y-6">
                {adnPillars.map((pillar, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      {pillar.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">
                        {pillar.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES GRID - REDESIGNED ===== */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#ffc107]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0066cc]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <Badge className="bg-[#001a33] text-white hover:bg-[#002244] mb-4">
              Nos Offres
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl text-[#001a33] tracking-wide mb-4">
              OFFRES EXPERTISE
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des solutions adaptées à vos besoins d'évaluation et de certification
            </p>
            <div className="w-24 h-1 bg-[#ffc107] mx-auto rounded-full mt-6" />
          </div>

          {/* Services grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {expertiseServices.map((service, index) => (
              <div
                key={service.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#ffc107]/30"
              >
                {/* Top gradient bar */}
                <div className="h-1.5 bg-gradient-to-r from-[#ffc107] via-[#0066cc] to-[#001a33]" />

                {/* Content */}
                <div className="p-6">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#001a33] to-[#002244] flex items-center justify-center text-[#ffc107] group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      {iconMap[service.icon] || <Zap className="h-6 w-6" />}
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 w-14 h-14 rounded-2xl bg-[#ffc107]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#001a33] mb-2 group-hover:text-[#0066cc] transition-colors line-clamp-2">
                    {service.title}
                  </h3>

                  {/* Short description */}
                  <p className="text-sm text-gray-500 mb-4">
                    {service.shortDescription}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ffc107]" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href="/contact">
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-[#001a33] hover:text-[#0066cc] hover:bg-[#ffc107]/10 group/btn"
                    >
                      En savoir plus
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

                {/* Bottom accent on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffc107] to-[#0066cc] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 bg-gradient-to-br from-[#001a33] via-[#002244] to-[#001a33] relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#ffc107]/10 blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#0066cc]/10 blur-3xl animate-float animation-delay-500" />
        </div>

        {/* Lightning decorations */}
        <div className="absolute top-10 left-10 text-[#ffc107]/10 animate-electric-flicker">
          <Zap className="h-20 w-20" />
        </div>
        <div className="absolute bottom-10 right-10 text-[#ffc107]/10 animate-electric-flicker animation-delay-300">
          <Zap className="h-16 w-16 rotate-12" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffc107]/30 bg-[#ffc107]/10 px-4 py-2 mb-8">
              <Target className="h-4 w-4 text-[#ffc107]" />
              <span className="text-sm font-medium text-[#ffc107]">Objectif AAA</span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wide mb-6">
              VISEZ L'EXCELLENCE{" "}
              <span className="text-[#ffc107]">OPÉRATIONNELLE</span>
            </h2>

            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Découvrez votre niveau de maîtrise du risque électrique et engagez
              une démarche d'amélioration continue vers la notation AAA.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-[#ffc107] text-[#001a33] hover:bg-[#ffcd38] font-semibold px-8 py-6 text-lg rounded-full group shadow-lg shadow-[#ffc107]/25 hover:shadow-[#ffc107]/40 transition-all"
                >
                  Demander un diagnostic
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/a-propos">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-full"
                >
                  Découvrir CETé
                </Button>
              </Link>
            </div>

            {/* Rating preview */}
            <div className="mt-16 flex justify-center gap-3">
              {["AAA", "AA", "A", "BBB", "BB", "B", "CCC", "CC", "C", "DDD"].map((rating, i) => (
                <div
                  key={rating}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                    i === 0
                      ? "bg-green-500 text-white scale-110"
                      : i < 3
                      ? "bg-green-500/20 text-green-400"
                      : i < 6
                      ? "bg-yellow-500/20 text-yellow-400"
                      : i < 9
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {rating}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
