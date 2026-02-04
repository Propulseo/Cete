"use client";

import { useEffect, useRef, useState } from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  Users,
  Award,
  Calendar,
  Shield,
  Lock,
  Heart,
  Target,
  ArrowRight,
  Sparkles,
  Building2,
  GraduationCap,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFounders, getValues } from "@/lib/data-loader";

// Animated counter hook
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
    }
  }, [startOnView]);

  useEffect(() => {
    if (startOnView && ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [startOnView, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

const iconMap: Record<string, React.ReactNode> = {
  shield: <Shield className="h-7 w-7" />,
  lock: <Lock className="h-7 w-7" />,
  heart: <Heart className="h-7 w-7" />,
  target: <Target className="h-7 w-7" />,
};

// Timeline data
const timelineEvents = [
  {
    year: "2000",
    title: "Création du SERECT",
    description: "Société d'Études, de Recherches et de Conseils Techniques voit le jour",
    icon: Building2,
  },
  {
    year: "2010",
    title: "Expertise reconnue",
    description: "Plus de 1000 entreprises accompagnées en sécurité électrique",
    icon: Award,
  },
  {
    year: "2020",
    title: "Innovation pédagogique",
    description: "Lancement des approches neurosciences appliquées à la prévention",
    icon: GraduationCap,
  },
  {
    year: "2024",
    title: "Naissance de CETé",
    description: "Le consortium indépendant de notation du risque électrique",
    icon: Zap,
  },
];

export default function AProposPage() {
  const founders = getFounders();
  const values = getValues();

  const { count: yearsCount, ref: yearsRef } = useCountUp(20, 2000);
  const { count: clientsCount, ref: clientsRef } = useCountUp(150, 2000);
  const { count: foundersCount, ref: foundersRef } = useCountUp(4, 1500);
  const { count: certifCount, ref: certifRef } = useCountUp(12, 2000);

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
              <Sparkles className="h-4 w-4 text-[#ffc107]" />
              <span className="text-sm font-medium text-[#ffc107]">Consortium d'experts indépendants</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-wide mb-6 animate-slide-up animation-delay-100">
              QUI SOMMES-
              <span className="text-[#ffc107] relative">
                NOUS
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-[#ffc107]/50 rounded-full" />
              </span>
              ?
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/80 font-light mb-8 animate-slide-up animation-delay-200">
              <span className="text-[#ffc107] font-semibold">Passionnés</span>, passeurs de{" "}
              <span className="text-[#ffc107] font-semibold">prévention</span>
            </p>

            {/* Description */}
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed animate-slide-up animation-delay-300">
              Nés du SERECT, nous avons cumulé plus de 20 ans d'expérience terrain
              en sécurité électrique et gestion des risques.
            </p>

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

      {/* ===== ORIGIN STORY ===== */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffc107]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-16">
              <Badge className="bg-[#001a33]/10 text-[#001a33] hover:bg-[#001a33]/20 mb-4">
                Notre Histoire
              </Badge>
              <h2 className="font-display text-4xl md:text-5xl text-[#001a33] tracking-wide mb-4">
                LE CONSORTIUM CETé
              </h2>
              <div className="w-24 h-1 bg-[#ffc107] mx-auto rounded-full" />
            </div>

            {/* Story content */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="space-y-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Nés du <strong className="text-[#001a33]">SERECT</strong> (Société d'Études,
                  de Recherches et de Conseils Techniques), nous avons cumulé plus de{" "}
                  <strong className="text-[#0066cc]">20 ans d'expérience terrain</strong> en
                  sécurité électrique et gestion des risques.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Notre mission : devenir l'
                  <strong className="text-[#001a33]">agence de notation indépendante de référence</strong>{" "}
                  sur le risque électrique et les Travaux Sous Tension (TST), en France
                  et à l'international.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="h-12 w-12 rounded-full bg-[#ffc107] flex items-center justify-center">
                    <Zap className="h-6 w-6 text-[#001a33]" />
                  </div>
                  <p className="text-[#001a33] font-semibold">
                    Transformer la vigilance en énergie collective
                  </p>
                </div>
              </div>

              {/* Visual element */}
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#001a33] to-[#002244] p-8 relative overflow-hidden group">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                  <div className="absolute top-4 right-4 text-[#ffc107]/30 animate-electric-flicker">
                    <Zap className="h-24 w-24" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                    <div className="text-8xl font-display text-[#ffc107] mb-4 group-hover:scale-110 transition-transform duration-500">
                      20+
                    </div>
                    <p className="text-white/80 text-xl">Années d'expertise</p>
                    <p className="text-white/60 text-sm mt-2">en sécurité électrique</p>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-3 animate-float">
                  <Award className="h-8 w-8 text-[#ffc107]" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-3 animate-float animation-delay-300">
                  <Shield className="h-8 w-8 text-[#0066cc]" />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#ffc107] via-[#0066cc] to-[#001a33] hidden md:block" />

              <div className="space-y-12">
                {timelineEvents.map((event, index) => (
                  <div
                    key={event.year}
                    className={`flex items-center gap-8 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content */}
                    <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                      <div
                        className={`inline-block bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 ${
                          index % 2 === 0 ? "border-[#ffc107]" : "border-[#0066cc]"
                        }`}
                      >
                        <span className="text-sm font-bold text-[#ffc107]">{event.year}</span>
                        <h3 className="text-xl font-bold text-[#001a33] mt-1">{event.title}</h3>
                        <p className="text-gray-600 mt-2">{event.description}</p>
                      </div>
                    </div>

                    {/* Center dot */}
                    <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg border-4 border-[#001a33] z-10">
                      <event.icon className="h-6 w-6 text-[#ffc107]" />
                    </div>

                    {/* Spacer */}
                    <div className="flex-1 hidden md:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-20 bg-gradient-to-r from-[#001a33] via-[#002244] to-[#001a33] relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-[#ffc107]/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-[#0066cc]/10 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Years */}
            <div ref={yearsRef} className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 mb-4 group-hover:bg-[#ffc107]/20 transition-colors">
                <Calendar className="h-10 w-10 text-[#ffc107]" />
              </div>
              <div className="text-5xl md:text-6xl font-display text-white mb-2">
                {yearsCount}<span className="text-[#ffc107]">+</span>
              </div>
              <p className="text-white/70">Années d'expertise</p>
            </div>

            {/* Clients */}
            <div ref={clientsRef} className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 mb-4 group-hover:bg-[#ffc107]/20 transition-colors">
                <Users className="h-10 w-10 text-[#ffc107]" />
              </div>
              <div className="text-5xl md:text-6xl font-display text-white mb-2">
                {clientsCount}<span className="text-[#ffc107]">+</span>
              </div>
              <p className="text-white/70">Clients accompagnés</p>
            </div>

            {/* Founders */}
            <div ref={foundersRef} className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 mb-4 group-hover:bg-[#ffc107]/20 transition-colors">
                <Award className="h-10 w-10 text-[#ffc107]" />
              </div>
              <div className="text-5xl md:text-6xl font-display text-white mb-2">
                {foundersCount}
              </div>
              <p className="text-white/70">Fondateurs experts</p>
            </div>

            {/* Certifications */}
            <div ref={certifRef} className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 mb-4 group-hover:bg-[#ffc107]/20 transition-colors">
                <TrendingUp className="h-10 w-10 text-[#ffc107]" />
              </div>
              <div className="text-5xl md:text-6xl font-display text-white mb-2">
                {certifCount}
              </div>
              <p className="text-white/70">Certifications</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOUNDERS SECTION ===== */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-20 left-0 w-72 h-72 bg-[#ffc107]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-[#0066cc]/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <Badge className="bg-[#ffc107]/10 text-[#001a33] hover:bg-[#ffc107]/20 mb-4">
              L'Équipe
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl text-[#001a33] tracking-wide mb-4">
              NOS FONDATEURS
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              4 experts passionnés issus du SERECT, unis par une vision commune :
              transformer la vigilance en énergie collective
            </p>
            <div className="w-24 h-1 bg-[#ffc107] mx-auto rounded-full mt-6" />
          </div>

          {/* Founders grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {founders.map((founder, index) => (
              <div
                key={founder.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Top accent bar */}
                <div className="h-1.5 bg-gradient-to-r from-[#ffc107] via-[#0066cc] to-[#001a33]" />

                <div className="flex flex-col sm:flex-row">
                  {/* Avatar area */}
                  <div className="relative h-48 sm:h-auto sm:w-48 flex-shrink-0 bg-gradient-to-br from-[#001a33] to-[#002244] overflow-hidden">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                    <div className="absolute top-2 right-2 text-[#ffc107]/20 animate-electric-flicker">
                      <Zap className="h-8 w-8" />
                    </div>

                    {/* Initials */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl font-display text-white/20 group-hover:text-[#ffc107]/30 transition-colors duration-500">
                        {founder.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-[#ffc107]/0 group-hover:bg-[#ffc107]/10 transition-colors duration-500" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-[#001a33] group-hover:text-[#0066cc] transition-colors">
                          {founder.name}
                        </h3>
                        <p className="text-sm font-medium text-[#ffc107]">{founder.role}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[#001a33]/5 flex items-center justify-center group-hover:bg-[#ffc107]/10 transition-colors">
                        <ChevronRight className="h-5 w-5 text-[#001a33]/30 group-hover:text-[#ffc107] transition-colors" />
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {founder.bio}
                    </p>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2">
                      {founder.specialties.map((specialty, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#001a33]/5 text-[#001a33] group-hover:bg-[#ffc107]/10 group-hover:text-[#001a33] transition-colors"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VALUES SECTION ===== */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#001a33]/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#ffc107]/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#0066cc]/10" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <Badge className="bg-[#001a33] text-white hover:bg-[#002244] mb-4">
              Notre ADN
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl text-[#001a33] tracking-wide mb-4">
              INDÉPENDANCE & CONFIDENTIALITÉ
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Les valeurs fondamentales qui guident notre engagement quotidien
            </p>
            <div className="w-24 h-1 bg-[#ffc107] mx-auto rounded-full mt-6" />
          </div>

          {/* Values grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div
                key={value.id}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#ffc107]/30 overflow-hidden"
              >
                {/* Hover background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ffc107]/0 to-[#ffc107]/0 group-hover:from-[#ffc107]/5 group-hover:to-transparent transition-all duration-500" />

                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#001a33] to-[#002244] flex items-center justify-center text-[#ffc107] group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    {iconMap[value.icon]}
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-[#ffc107]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-[#001a33] mb-3 group-hover:text-[#0066cc] transition-colors">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {value.description}
                </p>

                {/* Bottom accent */}
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
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#ffc107]/10 blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#0066cc]/10 blur-3xl animate-float animation-delay-500" />
          </div>
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
              <Sparkles className="h-4 w-4 text-[#ffc107]" />
              <span className="text-sm font-medium text-[#ffc107]">Rejoignez-nous</span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wide mb-6">
              PRÊT À TRANSFORMER VOTRE{" "}
              <span className="text-[#ffc107]">APPROCHE</span> ?
            </h2>

            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Découvrez comment notre expertise peut vous accompagner vers l'excellence
              en matière de sécurité électrique.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-[#ffc107] text-[#001a33] hover:bg-[#ffcd38] font-semibold px-8 py-6 text-lg rounded-full group shadow-lg shadow-[#ffc107]/25 hover:shadow-[#ffc107]/40 transition-all"
                >
                  Nous contacter
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
          </div>
        </div>
      </section>
    </>
  );
}
