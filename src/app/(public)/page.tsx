"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Zap,
  Shield,
  Award,
  Users,
  Star,
  ChevronRight,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Quote,
  Building2,
  Factory,
  HardHat,
  Target,
  Clock,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPillars, getExpertiseServices, getFounders } from "@/lib/data-loader";

// Animated counter hook
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

// Lightning bolt SVG component
function LightningBolt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
    </svg>
  );
}

// Electric circuit line SVG
function CircuitLine() {
  return (
    <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path
        d="M0,50 L30,50 L35,30 L40,70 L45,30 L50,70 L55,50 L100,50"
        stroke="rgba(255,193,7,0.3)"
        strokeWidth="0.5"
        fill="none"
        className="animate-pulse"
      />
    </svg>
  );
}

export default function HomePage() {
  const pillars = getPillars();
  const services = getExpertiseServices();
  const founders = getFounders();

  const stats = [
    { value: 200, suffix: "+", label: "Entreprises accompagnées", icon: Building2 },
    { value: 20, suffix: "+", label: "Années d'expertise", icon: Clock },
    { value: 4, suffix: "", label: "Experts fondateurs", icon: Users },
    { value: 98, suffix: "%", label: "Clients satisfaits", icon: Star },
  ];

  const testimonials = [
    {
      quote: "CETé a transformé notre approche de la sécurité électrique. Leur méthodologie ADN nous a permis d'atteindre une notation AA en seulement 18 mois.",
      author: "Marie Dubois",
      role: "Directrice QSE",
      company: "Électricité Industrielle SA",
    },
    {
      quote: "L'expertise des fondateurs et leur approche pédagogique bienveillante ont fait toute la différence. Nos équipes sont désormais autonomes et confiantes.",
      author: "Philippe Martin",
      role: "Responsable Formation",
      company: "Groupe Énergie Plus",
    },
    {
      quote: "La notation indépendante de CETé nous a ouvert des portes auprès de grands donneurs d'ordre. Un investissement qui a vraiment payé.",
      author: "Sophie Laurent",
      role: "PDG",
      company: "TST Solutions",
    },
  ];

  const trustedBy = [
    "EDF", "Engie", "Vinci Énergies", "Bouygues", "Eiffage", "SPIE"
  ];

  const counter1 = useCountUp(200, 2000);
  const counter2 = useCountUp(20, 2000);
  const counter3 = useCountUp(4, 1500);
  const counter4 = useCountUp(98, 2000);
  const counters = [counter1, counter2, counter3, counter4];

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[100vh] overflow-hidden bg-[#001a33]">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-grid-pattern" />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a33] via-[#002244] to-[#001a33]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#001a33] to-transparent" />

        {/* Floating electric orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#ffc107]/10 blur-3xl animate-float" />
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-[#0066cc]/10 blur-3xl animate-float animation-delay-300" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-[#ffc107]/5 blur-2xl animate-float animation-delay-500" />

        {/* Lightning decorations */}
        <div className="absolute top-32 right-1/4 text-[#ffc107]/20 animate-electric-flicker">
          <LightningBolt className="w-16 h-16" />
        </div>
        <div className="absolute bottom-1/3 left-1/4 text-[#ffc107]/10 animate-electric-flicker animation-delay-200">
          <LightningBolt className="w-24 h-24 rotate-12" />
        </div>

        {/* Main content */}
        <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
            {/* Left content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#ffc107]/30 backdrop-blur-sm animate-slide-up">
                <span className="w-2 h-2 rounded-full bg-[#ffc107] animate-pulse" />
                <span className="text-sm text-[#ffc107] font-medium tracking-wide uppercase">
                  Agence de Notation Indépendante
                </span>
              </div>

              {/* Main headline */}
              <h1 className="opacity-0 animate-slide-up animation-delay-100">
                <span className="block font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] tracking-tight">
                  MAÎTRISEZ
                </span>
                <span className="block font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight">
                  <span className="text-gradient-electric">LE RISQUE</span>
                </span>
                <span className="block font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] tracking-tight">
                  ÉLECTRIQUE
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-white/70 max-w-xl leading-relaxed opacity-0 animate-slide-up animation-delay-200">
                Transformer la <span className="text-[#ffc107] font-semibold">vigilance</span> en{" "}
                <span className="text-white font-semibold">énergie collective</span>.
                CETé accompagne les entreprises vers l'excellence opérationnelle.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4 opacity-0 animate-slide-up animation-delay-300">
                <Button
                  asChild
                  size="lg"
                  className="group bg-[#ffc107] text-[#001a33] hover:bg-[#ffdb58] text-lg px-8 py-6 font-semibold rounded-xl shadow-lg shadow-[#ffc107]/20 hover:shadow-xl hover:shadow-[#ffc107]/30 transition-all duration-300"
                >
                  <Link href="/expertise">
                    Découvrir la Méthode ADN
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 rounded-xl backdrop-blur-sm transition-all duration-300"
                >
                  <Link href="/contact">
                    <Phone className="mr-2 h-5 w-5" />
                    Demander un audit
                  </Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="pt-8 opacity-0 animate-slide-up animation-delay-400">
                <p className="text-sm text-white/40 mb-4 uppercase tracking-wider">Ils nous font confiance</p>
                <div className="flex flex-wrap gap-6 items-center">
                  {trustedBy.map((company, i) => (
                    <span
                      key={company}
                      className="text-white/30 font-semibold text-lg hover:text-white/60 transition-colors cursor-default"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right content - Rating visualization */}
            <div className="relative hidden lg:flex items-center justify-center opacity-0 animate-scale-in animation-delay-300">
              {/* Outer ring */}
              <div className="absolute w-[500px] h-[500px] rounded-full border border-[#ffc107]/10 animate-rotate-slow" />
              <div className="absolute w-[420px] h-[420px] rounded-full border border-white/5" />
              <div className="absolute w-[340px] h-[340px] rounded-full border border-[#ffc107]/20" />

              {/* Rating badges floating around */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
                <div className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/40 text-green-400 font-bold text-lg backdrop-blur-sm animate-float">
                  AAA
                </div>
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4">
                <div className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 font-bold text-lg backdrop-blur-sm animate-float animation-delay-300">
                  DDD
                </div>
              </div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4">
                <div className="px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 font-bold text-lg backdrop-blur-sm animate-float animation-delay-500">
                  BB+
                </div>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4">
                <div className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 font-bold text-lg backdrop-blur-sm animate-float animation-delay-700">
                  AA
                </div>
              </div>

              {/* Center element */}
              <div className="relative z-10 flex flex-col items-center justify-center w-64 h-64 rounded-full bg-gradient-to-br from-[#ffc107] to-[#ff9800] shadow-2xl shadow-[#ffc107]/30 animate-pulse-glow">
                <Zap className="w-20 h-20 text-[#001a33] mb-2" />
                <span className="font-display text-4xl text-[#001a33] tracking-wider">CETé</span>
                <span className="text-sm text-[#001a33]/70 font-medium">Méthode ADN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path
              d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,26,51,0.03),transparent_50%)]" />

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const counter = counters[index];
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  ref={counter.ref}
                  className="relative group"
                >
                  <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#f8f9fc] to-white border border-[#e2e8f0] hover:border-[#ffc107]/50 hover:shadow-xl hover:shadow-[#ffc107]/10 transition-all duration-500">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#001a33] text-[#ffc107] mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="font-display text-5xl md:text-6xl text-[#001a33] mb-2">
                      {counter.count}{stat.suffix}
                    </div>
                    <div className="text-[#5a6478] font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PILLARS SECTION ===== */}
      <section className="py-24 bg-[#f8f9fc] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#ffc107]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0066cc]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-[#001a33]/5 text-[#001a33] text-sm font-semibold uppercase tracking-wider mb-4">
              Notre approche
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#001a33] mb-6">
              LES 3 PILIERS DE NOTRE EXPERTISE
            </h2>
            <p className="text-xl text-[#5a6478]">
              Une méthodologie éprouvée pour accompagner votre organisation vers l'excellence
            </p>
          </div>

          {/* Pillars grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => {
              const icons = {
                zap: Zap,
                star: Star,
                users: Users,
              };
              const Icon = icons[pillar.icon as keyof typeof icons] || Zap;
              const colors = {
                blue: "from-[#001a33] to-[#003366]",
                yellow: "from-[#ffc107] to-[#ff9800]",
                green: "from-[#28a745] to-[#20c997]",
              };
              const bgColor = colors[pillar.color as keyof typeof colors] || colors.blue;

              return (
                <div
                  key={pillar.id}
                  className="group relative"
                >
                  <div className="relative h-full p-8 rounded-3xl bg-white border border-[#e2e8f0] hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    {/* Hover gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${bgColor} text-white mb-6 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl text-[#001a33] group-hover:text-white mb-4 transition-colors duration-300">
                        {pillar.title.toUpperCase()}
                      </h3>
                      <p className="text-[#5a6478] group-hover:text-white/80 leading-relaxed transition-colors duration-300">
                        {pillar.description}
                      </p>
                    </div>

                    {/* Number indicator */}
                    <div className="absolute top-4 right-4 font-display text-6xl text-[#001a33]/5 group-hover:text-white/10 transition-colors duration-300">
                      0{index + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ADN METHOD SECTION ===== */}
      <section className="py-24 bg-[#001a33] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div className="space-y-8">
              <span className="inline-block px-4 py-1 rounded-full bg-[#ffc107]/10 text-[#ffc107] text-sm font-semibold uppercase tracking-wider">
                Méthodologie exclusive
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
                LA MÉTHODE <span className="text-gradient-electric">ADN</span>
              </h2>
              <p className="text-xl text-white/70 leading-relaxed">
                Notre système de notation propriétaire évalue objectivement votre niveau de maîtrise
                du risque électrique, de <span className="text-green-400 font-semibold">AAA</span> (excellence)
                à <span className="text-red-400 font-semibold">DDD</span> (risque critique).
              </p>

              {/* Steps */}
              <div className="space-y-6 pt-4">
                {[
                  { icon: CheckCircle, title: "Auto-évaluation", desc: "Diagnostic initial de votre situation actuelle" },
                  { icon: Shield, title: "Respect du prescrit", desc: "Vérification de la conformité réglementaire" },
                  { icon: TrendingUp, title: "Maîtrise opérationnelle", desc: "Évaluation de la gestion quotidienne des risques" },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#ffc107]/10 flex items-center justify-center group-hover:bg-[#ffc107] transition-colors duration-300">
                      <step.icon className="w-6 h-6 text-[#ffc107] group-hover:text-[#001a33] transition-colors duration-300" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-1">{step.title}</h4>
                      <p className="text-white/60">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                asChild
                size="lg"
                className="mt-8 bg-white text-[#001a33] hover:bg-[#ffc107] text-lg px-8 py-6 font-semibold rounded-xl transition-all duration-300"
              >
                <Link href="/expertise">
                  En savoir plus
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Right - Visual */}
            <div className="relative flex items-center justify-center py-12">
              {/* Rating scale visualization */}
              <div className="relative w-full max-w-md">
                {/* Scale bars */}
                {[
                  { rating: "AAA", color: "bg-green-500", width: "100%", label: "Maîtrise optimale" },
                  { rating: "AA", color: "bg-green-400", width: "85%", label: "Très bonne maîtrise" },
                  { rating: "A", color: "bg-lime-400", width: "70%", label: "Bonne maîtrise" },
                  { rating: "BBB", color: "bg-yellow-400", width: "55%", label: "Maîtrise satisfaisante" },
                  { rating: "BB", color: "bg-orange-400", width: "40%", label: "Maîtrise correcte" },
                  { rating: "B", color: "bg-orange-500", width: "30%", label: "Maîtrise suffisante" },
                  { rating: "CCC", color: "bg-red-400", width: "20%", label: "Risque modéré" },
                  { rating: "DDD", color: "bg-red-600", width: "10%", label: "Risque critique" },
                ].map((item, i) => (
                  <div key={item.rating} className="flex items-center gap-4 mb-3 group">
                    <div className="w-12 text-right font-display text-lg text-white/80 group-hover:text-white transition-colors">
                      {item.rating}
                    </div>
                    <div className="flex-1 h-8 bg-white/10 rounded-lg overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-lg transition-all duration-500 group-hover:shadow-lg`}
                        style={{ width: item.width }}
                      />
                    </div>
                    <div className="w-40 text-sm text-white/50 group-hover:text-white/80 transition-colors hidden md:block">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-[#ffc107]/10 text-[#001a33] text-sm font-semibold uppercase tracking-wider mb-4">
              Nos services
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#001a33] mb-6">
              EXPERTISE & ACCOMPAGNEMENT
            </h2>
            <p className="text-xl text-[#5a6478]">
              Des solutions adaptées à chaque étape de votre démarche sécurité
            </p>
          </div>

          {/* Services grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {services.slice(0, 4).map((service, index) => {
              const icons = {
                "clipboard-check": CheckCircle,
                "star": Star,
                "award": Award,
                "bell": Shield,
              };
              const Icon = icons[service.icon as keyof typeof icons] || Zap;

              return (
                <div
                  key={service.id}
                  className="group relative p-8 rounded-3xl bg-[#f8f9fc] hover:bg-[#001a33] border border-transparent hover:border-[#ffc107]/30 transition-all duration-500 overflow-hidden"
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffc107]/5 group-hover:bg-[#ffc107]/10 rounded-full blur-2xl transition-all duration-500" />

                  <div className="relative z-10 flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-[#001a33] group-hover:bg-[#ffc107] flex items-center justify-center transition-colors duration-300">
                        <Icon className="w-8 h-8 text-[#ffc107] group-hover:text-[#001a33] transition-colors duration-300" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-2xl text-[#001a33] group-hover:text-white mb-2 transition-colors duration-300">
                        {service.title.toUpperCase()}
                      </h3>
                      <p className="text-[#5a6478] group-hover:text-white/70 mb-4 transition-colors duration-300">
                        {service.description}
                      </p>
                      <ul className="space-y-2">
                        {service.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-[#5a6478] group-hover:text-white/60 transition-colors duration-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ffc107]" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View all CTA */}
          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-[#001a33] text-[#001a33] hover:bg-[#001a33] hover:text-white rounded-xl transition-all duration-300"
            >
              <Link href="/services">
                Voir tous nos services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="py-24 bg-[#f8f9fc] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ffc107]/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-[#001a33]/5 text-[#001a33] text-sm font-semibold uppercase tracking-wider mb-4">
              Témoignages
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#001a33] mb-6">
              ILS NOUS FONT CONFIANCE
            </h2>
          </div>

          {/* Testimonials grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="relative p-8 rounded-3xl bg-white border border-[#e2e8f0] hover:border-[#ffc107]/50 hover:shadow-xl transition-all duration-500"
              >
                {/* Quote icon */}
                <div className="absolute top-6 right-6 text-[#ffc107]/20">
                  <Quote className="w-12 h-12" />
                </div>

                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#ffc107] text-[#ffc107]" />
                    ))}
                  </div>

                  <p className="text-[#5a6478] leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#001a33] flex items-center justify-center text-white font-semibold">
                      {testimonial.author.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-semibold text-[#001a33]">{testimonial.author}</div>
                      <div className="text-sm text-[#5a6478]">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOUNDERS PREVIEW ===== */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Founders grid */}
            <div className="grid grid-cols-2 gap-4">
              {founders.map((founder, index) => (
                <div
                  key={founder.id}
                  className={`relative rounded-2xl overflow-hidden ${
                    index === 0 ? "col-span-2 aspect-[2/1]" : "aspect-square"
                  } bg-gradient-to-br from-[#001a33] to-[#002244] group`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-16 h-16 text-white/20 group-hover:text-[#ffc107]/30 transition-colors duration-300" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="font-semibold text-white">{founder.name}</div>
                    <div className="text-sm text-white/70">{founder.role}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <span className="inline-block px-4 py-1 rounded-full bg-[#ffc107]/10 text-[#001a33] text-sm font-semibold uppercase tracking-wider">
                L'équipe
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#001a33] leading-tight">
                PASSIONNÉS, PASSEURS DE PRÉVENTION
              </h2>
              <p className="text-xl text-[#5a6478] leading-relaxed">
                Fondé par 4 experts du SERECT cumulant plus de 80 ans d'expérience,
                CETé incarne l'excellence et l'indépendance dans le domaine de la sécurité électrique.
              </p>
              <ul className="space-y-4">
                {[
                  "Experts reconnus en Travaux Sous Tension",
                  "Formateurs certifiés et passionnés",
                  "Indépendance totale et impartialité",
                  "Approche neurosciences et pédagogie bienveillante",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#5a6478]">
                    <CheckCircle className="w-5 h-5 text-[#ffc107] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                className="mt-4 bg-[#001a33] text-white hover:bg-[#002244] text-lg px-8 py-6 font-semibold rounded-xl transition-all duration-300"
              >
                <Link href="/a-propos">
                  Découvrir notre équipe
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 bg-gradient-to-br from-[#001a33] via-[#002244] to-[#001a33] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#ffc107]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#0066cc]/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#ffc107] mb-8 animate-pulse-glow">
              <Zap className="w-10 h-10 text-[#001a33]" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              PRÊT À TRANSFORMER VOTRE APPROCHE ?
            </h2>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Contactez-nous pour un diagnostic gratuit et découvrez comment CETé peut vous accompagner vers l'excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-[#ffc107] text-[#001a33] hover:bg-[#ffdb58] text-lg px-10 py-6 font-semibold rounded-xl shadow-lg shadow-[#ffc107]/20 hover:shadow-xl hover:shadow-[#ffc107]/30 transition-all duration-300"
              >
                <Link href="/contact">
                  Demander un diagnostic gratuit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-10 py-6 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-xl transition-all duration-300"
              >
                <Link href="/client">
                  Espace Client
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
