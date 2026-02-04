"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Brain,
  Heart,
  Target,
  Zap,
  Sparkles,
  ArrowRight,
  Users,
  HardHat,
  BookOpen,
  Search,
  Pencil,
  Rocket,
  TrendingUp,
  CheckCircle,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getConseilServices } from "@/lib/data-loader";

const iconMap: Record<string, React.ReactNode> = {
  users: <Users className="h-7 w-7" />,
  zap: <Zap className="h-7 w-7" />,
  "hard-hat": <HardHat className="h-7 w-7" />,
  "book-open": <BookOpen className="h-7 w-7" />,
};

const approaches = [
  {
    icon: <Brain className="h-8 w-8" />,
    title: "Neurosciences appliquées",
    description:
      "Nos méthodes pédagogiques s'appuient sur les dernières avancées en neurosciences pour une meilleure rétention.",
    color: "from-purple-500 to-indigo-600",
    bgLight: "bg-purple-50",
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Bienveillance",
    description:
      "Un accompagnement positif et constructif, centré sur la progression plutôt que la sanction.",
    color: "from-rose-500 to-pink-600",
    bgLight: "bg-rose-50",
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "Sur mesure",
    description:
      "Chaque entreprise est unique. Nos formations s'adaptent à votre contexte et vos enjeux spécifiques.",
    color: "from-[#ffc107] to-amber-600",
    bgLight: "bg-amber-50",
  },
];

const processSteps = [
  {
    icon: <Search className="h-6 w-6" />,
    title: "Diagnostic",
    description: "Analyse approfondie de votre situation actuelle et identification des besoins",
    number: "01",
  },
  {
    icon: <Pencil className="h-6 w-6" />,
    title: "Conception",
    description: "Élaboration d'un plan d'action sur mesure adapté à vos enjeux",
    number: "02",
  },
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "Déploiement",
    description: "Mise en œuvre accompagnée des solutions avec support terrain",
    number: "03",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Suivi",
    description: "Mesure des résultats et optimisation continue des performances",
    number: "04",
  },
];

export default function ServicesPage() {
  const conseilServices = getConseilServices();
  const [activeStep, setActiveStep] = useState(0);

  // Auto-advance process steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % processSteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[70vh] overflow-hidden bg-gradient-to-b from-[#001a33] via-[#002244] to-[#001a33]">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />

          {/* Floating orbs */}
          <div className="absolute top-20 left-[10%] h-64 w-64 rounded-full bg-[#ffc107]/10 blur-3xl animate-float" />
          <div className="absolute bottom-20 right-[15%] h-48 w-48 rounded-full bg-[#0066cc]/20 blur-3xl animate-float animation-delay-300" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#ffc107]/5 blur-3xl animate-pulse-glow" />

          {/* Lightning accents */}
          <div className="absolute top-10 right-[20%] text-[#ffc107]/20 animate-electric-flicker">
            <Zap className="h-16 w-16" />
          </div>
          <div className="absolute bottom-20 left-[25%] text-[#ffc107]/15 animate-electric-flicker animation-delay-500">
            <Zap className="h-12 w-12 rotate-12" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffc107]/30 bg-[#ffc107]/10 px-4 py-2 mb-8 animate-slide-up">
              <GraduationCap className="h-4 w-4 text-[#ffc107]" />
              <span className="text-sm font-medium text-[#ffc107]">Formation & Accompagnement</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-wide mb-6 animate-slide-up animation-delay-100">
              SERVICES &{" "}
              <span className="text-[#ffc107] relative">
                CONSEILS
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-[#ffc107]/50 rounded-full" />
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/80 font-light mb-6 animate-slide-up animation-delay-200">
              Accompagnement{" "}
              <span className="text-[#ffc107] font-semibold">sur mesure</span> et{" "}
              <span className="text-[#ffc107] font-semibold">sur étagère</span>
            </p>

            {/* Description */}
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up animation-delay-300">
              Coaching managers, formation TST, accompagnement pédagogique.
              Une approche bienveillante basée sur les neurosciences.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-400">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-[#ffc107] text-[#001a33] hover:bg-[#ffcd38] font-semibold px-8 py-6 text-lg rounded-full group shadow-lg shadow-[#ffc107]/25 hover:shadow-[#ffc107]/40 transition-all"
                >
                  Demander un devis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/expertise">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-full"
                >
                  Notre expertise
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

      {/* ===== APPROACH SECTION ===== */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffc107]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#0066cc]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <Badge className="bg-[#001a33]/10 text-[#001a33] hover:bg-[#001a33]/20 mb-4">
              Notre Philosophie
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl text-[#001a33] tracking-wide mb-4">
              APPROCHE PÉDAGOGIQUE
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chez CETé, nous croyons que la sécurité s'apprend dans la bienveillance.
              Rigueur technique et pédagogie innovante pour des formations qui marquent.
            </p>
            <div className="w-24 h-1 bg-[#ffc107] mx-auto rounded-full mt-6" />
          </div>

          {/* Approaches grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {approaches.map((approach, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${approach.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${approach.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    {approach.icon}
                  </div>
                  {/* Glow effect */}
                  <div className={`absolute inset-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${approach.color} blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-[#001a33] mb-3 group-hover:text-[#0066cc] transition-colors">
                  {approach.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {approach.description}
                </p>

                {/* Bottom accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${approach.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#ffc107]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-[#0066cc]/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <Badge className="bg-[#001a33] text-white hover:bg-[#002244] mb-4">
              Nos Offres
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl text-[#001a33] tracking-wide mb-4">
              NOS SERVICES
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Coaching et formation pour tous les niveaux de votre organisation
            </p>
            <div className="w-24 h-1 bg-[#ffc107] mx-auto rounded-full mt-6" />
          </div>

          {/* Services grid - 2x2 layout */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {conseilServices.map((service, index) => (
              <div
                key={service.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* Top gradient bar */}
                <div className="h-2 bg-gradient-to-r from-[#ffc107] via-[#0066cc] to-[#001a33]" />

                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start gap-5 mb-6">
                    {/* Icon */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#001a33] to-[#002244] flex items-center justify-center text-[#ffc107] group-hover:scale-110 transition-transform duration-500 shadow-lg">
                        {iconMap[service.icon] || <Zap className="h-7 w-7" />}
                      </div>
                      {/* Glow effect */}
                      <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-[#ffc107]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Title & subtitle */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#001a33] mb-1 group-hover:text-[#0066cc] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm font-medium text-[#ffc107]">
                        {service.shortDescription}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {service.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle className="h-4 w-4 text-[#ffc107] flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link href="/contact">
                    <Button
                      className="w-full bg-[#001a33] hover:bg-[#002244] text-white group/btn"
                    >
                      En savoir plus
                      <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
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

      {/* ===== PROCESS SECTION ===== */}
      <section className="py-24 bg-gradient-to-br from-[#001a33] via-[#002244] to-[#001a33] relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#ffc107]/10 blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#0066cc]/10 blur-3xl animate-float animation-delay-500" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffc107]/30 bg-[#ffc107]/10 px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-[#ffc107]" />
              <span className="text-sm font-medium text-[#ffc107]">Méthodologie</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-wide mb-4">
              NOTRE APPROCHE
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Un accompagnement structuré en 4 étapes pour des résultats durables
            </p>
          </div>

          {/* Process timeline */}
          <div className="max-w-5xl mx-auto">
            {/* Desktop view */}
            <div className="hidden md:block">
              {/* Connection line */}
              <div className="relative mb-8">
                <div className="absolute top-8 left-0 right-0 h-1 bg-white/10 rounded-full" />
                <div
                  className="absolute top-8 left-0 h-1 bg-gradient-to-r from-[#ffc107] to-[#0066cc] rounded-full transition-all duration-500"
                  style={{ width: `${((activeStep + 1) / processSteps.length) * 100}%` }}
                />
              </div>

              {/* Steps */}
              <div className="grid grid-cols-4 gap-6">
                {processSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer transition-all duration-500 ${
                      index <= activeStep ? "opacity-100" : "opacity-50"
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    {/* Number circle */}
                    <div className="flex justify-center mb-6">
                      <div
                        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                          index === activeStep
                            ? "bg-[#ffc107] text-[#001a33] scale-110 shadow-lg shadow-[#ffc107]/30"
                            : index < activeStep
                            ? "bg-[#0066cc] text-white"
                            : "bg-white/10 text-white/50"
                        }`}
                      >
                        {step.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <span className="text-[#ffc107] text-sm font-bold mb-2 block">
                        {step.number}
                      </span>
                      <h3 className="text-white font-bold text-lg mb-2">
                        {step.title}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile view */}
            <div className="md:hidden space-y-6">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${
                    index === activeStep
                      ? "bg-white/10"
                      : "bg-transparent"
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      index === activeStep
                        ? "bg-[#ffc107] text-[#001a33]"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <span className="text-[#ffc107] text-xs font-bold">{step.number}</span>
                    <h3 className="text-white font-bold">{step.title}</h3>
                    <p className="text-white/60 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#001a33]/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#ffc107]/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#0066cc]/10" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-[#ffc107]/10 text-[#001a33] hover:bg-[#ffc107]/20 mb-6">
              Passez à l'action
            </Badge>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#001a33] tracking-wide mb-6">
              PRÊT À FORMER VOS{" "}
              <span className="text-[#ffc107]">ÉQUIPES</span> ?
            </h2>

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Contactez-nous pour construire ensemble le programme de formation
              adapté à vos besoins et vos enjeux.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-[#001a33] hover:bg-[#002244] text-white font-semibold px-8 py-6 text-lg rounded-full group shadow-lg hover:shadow-xl transition-all"
                >
                  Demander un devis gratuit
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#001a33]/20 text-[#001a33] hover:bg-[#001a33]/5 font-semibold px-8 py-6 text-lg rounded-full"
                >
                  Nous appeler
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-16 flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2 text-gray-500">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Formation sur site</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Certification reconnue</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Suivi personnalisé</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
