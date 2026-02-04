"use client";

import { useEffect, useState } from "react";
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
  GraduationCap,
  Quote,
  Phone,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getConseilServices } from "@/lib/data-loader";

const iconMap: Record<string, React.ReactNode> = {
  users: <Users className="h-8 w-8" />,
  zap: <Zap className="h-8 w-8" />,
  "hard-hat": <HardHat className="h-8 w-8" />,
  "book-open": <BookOpen className="h-8 w-8" />,
};

const approaches = [
  {
    icon: <Brain className="h-10 w-10" />,
    title: "Neurosciences",
    subtitle: "appliquées",
    description: "Méthodes pédagogiques basées sur les dernières avancées pour une rétention optimale.",
    number: "01",
  },
  {
    icon: <Heart className="h-10 w-10" />,
    title: "Bienveillance",
    subtitle: "& progression",
    description: "Accompagnement positif centré sur la progression plutôt que la sanction.",
    number: "02",
  },
  {
    icon: <Target className="h-10 w-10" />,
    title: "Sur mesure",
    subtitle: "& adapté",
    description: "Formations adaptées à votre contexte et vos enjeux spécifiques.",
    number: "03",
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
  const [activeService, setActiveService] = useState(0);

  // Auto-advance process steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % processSteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ===== HERO - SPLIT ASYMMETRIC ===== */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background split */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#001a33]" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#ffc107] hidden lg:block"
               style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }} />
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-[5%] w-72 h-72 rounded-full bg-[#0066cc]/20 blur-3xl animate-float" />
          <div className="absolute bottom-20 left-[20%] w-48 h-48 rounded-full bg-[#ffc107]/20 blur-3xl animate-float animation-delay-500" />
          <div className="absolute top-1/3 right-[10%] text-[#001a33]/10 animate-electric-flicker hidden lg:block">
            <Zap className="h-40 w-40" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-20">
            {/* Left - Text */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ffc107]/30 bg-[#ffc107]/10 px-4 py-2 mb-8 animate-slide-up">
                <GraduationCap className="h-4 w-4 text-[#ffc107]" />
                <span className="text-sm font-medium text-[#ffc107]">Formation & Coaching</span>
              </div>

              <h1 className="animate-slide-up animation-delay-100">
                <span className="block font-display text-6xl md:text-7xl lg:text-8xl tracking-wide text-white/90">
                  SERVICES
                </span>
                <span className="block font-display text-6xl md:text-7xl lg:text-8xl tracking-wide text-[#ffc107] -mt-2">
                  & CONSEILS
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/60 mt-8 max-w-lg leading-relaxed animate-slide-up animation-delay-200">
                Accompagnement <span className="text-[#ffc107] font-semibold">sur mesure</span> pour
                transformer vos équipes en acteurs de la prévention.
              </p>

              <div className="flex flex-wrap gap-4 mt-10 animate-slide-up animation-delay-300">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-[#ffc107] text-[#001a33] hover:bg-[#ffcd38] font-bold px-8 py-6 text-lg rounded-full group"
                  >
                    Demander un devis
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Stats inline */}
              <div className="flex gap-12 mt-16 animate-slide-up animation-delay-400">
                <div>
                  <div className="font-display text-5xl text-[#ffc107]">150+</div>
                  <div className="text-white/50 text-sm mt-1">Entreprises formées</div>
                </div>
                <div>
                  <div className="font-display text-5xl text-[#ffc107]">98%</div>
                  <div className="text-white/50 text-sm mt-1">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right - Visual */}
            <div className="relative hidden lg:block">
              {/* Large decorative number */}
              <div className="absolute -top-20 -right-10 font-display text-[20rem] text-[#001a33]/20 leading-none select-none">
                &
              </div>

              {/* Floating testimonial card */}
              <div className="absolute top-10 right-0 bg-white rounded-2xl p-6 shadow-2xl max-w-xs animate-float z-10">
                <Quote className="h-8 w-8 text-[#ffc107] mb-3" />
                <p className="text-[#001a33] text-sm leading-relaxed">
                  "Une approche pédagogique qui a transformé notre culture sécurité."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#001a33] flex items-center justify-center text-white font-bold text-sm">
                    JD
                  </div>
                  <div>
                    <div className="font-bold text-[#001a33] text-sm">Jean Dupont</div>
                    <div className="text-gray-500 text-xs">Directeur QSE, Enedis</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-[#ffc107] rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ===== APPROACH - EDITORIAL HORIZONTAL ===== */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Large background text */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 font-display text-[15rem] text-gray-100 leading-none select-none whitespace-nowrap">
          PÉDAGOGIE
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header - Left aligned */}
          <div className="max-w-2xl mb-20">
            <span className="text-[#ffc107] font-bold text-sm tracking-widest uppercase">Notre philosophie</span>
            <h2 className="font-display text-5xl md:text-6xl text-[#001a33] tracking-wide mt-4">
              UNE APPROCHE<br />
              <span className="text-[#0066cc]">DIFFÉRENTE</span>
            </h2>
            <div className="w-24 h-1.5 bg-[#ffc107] mt-6" />
          </div>

          {/* Horizontal scroll cards on mobile, staggered on desktop */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {approaches.map((approach, index) => (
              <div
                key={index}
                className={`group relative ${index === 1 ? 'md:mt-16' : index === 2 ? 'md:mt-32' : ''}`}
              >
                {/* Number */}
                <div className="font-display text-8xl text-gray-100 group-hover:text-[#ffc107]/20 transition-colors duration-500 absolute -top-10 -left-4">
                  {approach.number}
                </div>

                {/* Content */}
                <div className="relative bg-white border-2 border-gray-100 group-hover:border-[#ffc107] rounded-3xl p-8 transition-all duration-500 group-hover:shadow-2xl">
                  {/* Icon */}
                  <div className="w-20 h-20 rounded-2xl bg-[#001a33] flex items-center justify-center text-[#ffc107] mb-6 group-hover:scale-110 transition-transform duration-500">
                    {approach.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-[#001a33]">
                    {approach.title}
                    <span className="block text-[#0066cc] font-normal text-lg">{approach.subtitle}</span>
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mt-4 leading-relaxed">
                    {approach.description}
                  </p>

                  {/* Arrow */}
                  <div className="mt-6 flex items-center gap-2 text-[#001a33] group-hover:text-[#ffc107] transition-colors">
                    <span className="text-sm font-semibold">En savoir plus</span>
                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES - MAGAZINE LAYOUT ===== */}
      <section className="py-32 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
            <div>
              <span className="text-[#ffc107] font-bold text-sm tracking-widest uppercase">Nos offres</span>
              <h2 className="font-display text-5xl md:text-6xl text-[#001a33] tracking-wide mt-4">
                SERVICES
              </h2>
            </div>
            <p className="text-gray-600 max-w-md mt-6 lg:mt-0 lg:text-right">
              Coaching et formation pour tous les niveaux de votre organisation
            </p>
          </div>

          {/* Bento grid layout */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Featured service - Large */}
            <div className="lg:col-span-7 group">
              <div className="relative h-full bg-[#001a33] rounded-3xl overflow-hidden min-h-[500px]">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffc107]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                {/* Content */}
                <div className="relative z-10 p-10 h-full flex flex-col">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-[#ffc107] text-[#001a33] px-4 py-2 rounded-full text-sm font-bold w-fit">
                    <Sparkles className="h-4 w-4" />
                    Populaire
                  </div>

                  {/* Icon */}
                  <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur flex items-center justify-center text-[#ffc107] mt-8">
                    {iconMap[conseilServices[0]?.icon] || <Users className="h-10 w-10" />}
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-4xl md:text-5xl text-white mt-8 tracking-wide">
                    {conseilServices[0]?.title.split(' ').slice(0, 2).join(' ')}
                    <span className="block text-[#ffc107]">{conseilServices[0]?.title.split(' ').slice(2).join(' ')}</span>
                  </h3>

                  {/* Description */}
                  <p className="text-white/70 mt-6 text-lg leading-relaxed max-w-md">
                    {conseilServices[0]?.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-3 mt-8">
                    {conseilServices[0]?.features.map((feature, i) => (
                      <span key={i} className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white/80 text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-auto pt-8">
                    <Link href="/contact">
                      <Button className="bg-[#ffc107] text-[#001a33] hover:bg-[#ffcd38] font-bold px-8 py-6 rounded-full group/btn">
                        Demander un devis
                        <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Other services - Stacked */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {conseilServices.slice(1).map((service, index) => (
                <div
                  key={service.id}
                  className="group relative bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-transparent hover:border-[#ffc107]"
                  onClick={() => setActiveService(index + 1)}
                >
                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-[#001a33] flex items-center justify-center text-[#ffc107] flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                      {iconMap[service.icon] || <Zap className="h-7 w-7" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#001a33] group-hover:text-[#0066cc] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {service.shortDescription}
                      </p>

                      {/* Features preview */}
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                        {service.features.slice(0, 2).map((f, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-[#ffc107]" />
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowUpRight className="h-6 w-6 text-gray-300 group-hover:text-[#ffc107] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROCESS SECTION - KEEP AS IS ===== */}
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

      {/* ===== CTA - SPLIT DRAMATIC ===== */}
      <section className="relative min-h-[80vh] overflow-hidden">
        {/* Split background */}
        <div className="absolute inset-0 grid lg:grid-cols-2">
          <div className="bg-white" />
          <div className="bg-[#001a33] hidden lg:block" />
        </div>

        <div className="container mx-auto px-4 relative z-10 min-h-[80vh] flex items-center">
          <div className="grid lg:grid-cols-2 gap-16 items-center w-full py-20">
            {/* Left - Content */}
            <div>
              <span className="text-[#ffc107] font-bold text-sm tracking-widest uppercase">Passez à l'action</span>

              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#001a33] tracking-wide mt-6">
                PRÊT À<br />
                <span className="text-[#ffc107]">TRANSFORMER</span><br />
                VOS ÉQUIPES ?
              </h2>

              <p className="text-gray-600 text-xl mt-8 max-w-md leading-relaxed">
                Contactez-nous pour construire ensemble le programme de formation
                adapté à vos besoins.
              </p>

              <div className="flex flex-wrap gap-4 mt-10">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-[#001a33] hover:bg-[#002244] text-white font-bold px-8 py-6 text-lg rounded-full group"
                  >
                    Demander un devis gratuit
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 mt-12">
                <div className="flex items-center gap-2 text-gray-500">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Formation sur site</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Certification reconnue</span>
                </div>
              </div>
            </div>

            {/* Right - Contact card */}
            <div className="relative">
              {/* Large decorative element */}
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border-[3px] border-[#ffc107]/20 hidden lg:block" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full border-[3px] border-[#0066cc]/20 hidden lg:block" />

              {/* Contact card */}
              <div className="relative bg-white lg:bg-[#ffc107] rounded-3xl p-10 shadow-2xl">
                <h3 className="font-display text-3xl text-[#001a33] mb-8">
                  CONTACTEZ-NOUS
                </h3>

                <div className="space-y-6">
                  <a href="tel:+33123456789" className="flex items-center gap-4 group">
                    <div className="w-14 h-14 rounded-2xl bg-[#001a33] flex items-center justify-center text-[#ffc107] group-hover:scale-110 transition-transform">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm text-[#001a33]/60">Téléphone</div>
                      <div className="text-xl font-bold text-[#001a33]">01 23 45 67 89</div>
                    </div>
                  </a>

                  <a href="mailto:contact@cete.fr" className="flex items-center gap-4 group">
                    <div className="w-14 h-14 rounded-2xl bg-[#001a33] flex items-center justify-center text-[#ffc107] group-hover:scale-110 transition-transform">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm text-[#001a33]/60">Email</div>
                      <div className="text-xl font-bold text-[#001a33]">contact@cete.fr</div>
                    </div>
                  </a>
                </div>

                <div className="mt-10 pt-8 border-t-2 border-[#001a33]/10">
                  <p className="text-[#001a33]/70 text-sm">
                    Réponse sous 24h ouvrées
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
