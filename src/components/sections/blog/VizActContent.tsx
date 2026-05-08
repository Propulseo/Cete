import {
  MapPin,
  List,
  Camera,
  Brain,
  Share2,
  ClipboardCheck,
  Timer,
  Shield,
  Users,
  FlaskConical,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "./ArticleLayout";

export function VizActContent() {
  return (
    <>
      {/* Introduction */}
      <p className="text-lg text-[#1A2940] leading-relaxed mb-6">
        Dans le monde exigeant des travaux sous tension (TST BT), la fiabilité et la
        maîtrise des compétences ne sont pas une option — ce sont des{" "}
        <strong>impératifs de sécurité</strong>. Pourtant, selon l&apos;Observatoire de la
        Maîtrise des TST (OMT) :
      </p>

      {/* 80% callout */}
      <div className="relative my-12 p-8 md:p-10 rounded-2xl bg-gradient-to-br from-[#1A2940] to-[#0D5A8A] text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#4DA6D9]/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <span className="font-display text-6xl md:text-7xl text-[#E8630A] shrink-0">80%</span>
          <div>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              des employeurs rencontrent des difficultés à assurer la{" "}
              <strong className="text-white">traçabilité des actes T</strong> et à suivre la
              pratique réelle de leurs opérateurs.
            </p>
            <p className="text-sm text-white/50 mt-3">
              Source : Observatoire de la Maîtrise des TST (OMT)
            </p>
          </div>
        </div>
      </div>

      <p className="text-lg text-[#4A6580] leading-relaxed mb-6">
        Face à ce constat, CETé innove avec <strong className="text-[#1A2940]">VIZ-ACT</strong>,
        la solution digitale qui transforme la gestion des Ordres de Travail Sous Tension (OTST).
      </p>

      {/* Section: Une idée simple, un impact fort */}
      <SectionHeading icon={<Sparkles className="w-5 h-5" />} title="Une idée simple, un impact fort" />

      <p className="text-[#4A6580] leading-relaxed mb-6">
        L&apos;innovation VIZ-ACT repose sur une démarche terrain très concrète :
      </p>

      <div className="space-y-4 mb-8">
        <ProcessStep number={1} icon={<Camera className="w-5 h-5" />} text="Le chargé de travaux prend en photo son OTST directement sur le chantier." />
        <ProcessStep number={2} icon={<Share2 className="w-5 h-5" />} text="La photo est téléchargée sur le site partenaire CETé." />
        <ProcessStep number={3} icon={<Brain className="w-5 h-5" />} text="L'intelligence artificielle identifie automatiquement les informations clés (localisation, date, type d'ouvrage, opérateurs, documents associés) et met à jour la base de suivi des actes T." />
      </div>

      <div className="bg-[#F4F9FD] border border-[#DAEEF8] rounded-xl p-6 mb-6">
        <p className="text-[#1A2940] font-semibold text-center">
          Plus besoin de ressaisir, ni de jongler entre fiches papier et tableurs.
        </p>
      </div>

      {/* Section: Deux vues pour une vision complète */}
      <SectionHeading icon={<MapPin className="w-5 h-5" />} title="Deux vues pour une vision complète" />

      <p className="text-[#4A6580] leading-relaxed mb-8">
        VIZ-ACT offre deux niveaux de lecture pour un suivi optimal des interventions :
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-[#DAEEF8] rounded-2xl p-6 hover:shadow-lg hover:border-transparent transition-all duration-300">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#4DA6D9]/10 text-[#4DA6D9] mb-4">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg text-[#1A2940] mb-2">Vue Carte</h3>
          <p className="text-[#4A6580] text-sm leading-relaxed">
            Visualisez en un clin d&apos;oeil tous les actes T passés, en cours ou à venir,
            géolocalisés sur le territoire.
          </p>
        </div>
        <div className="bg-white border border-[#DAEEF8] rounded-2xl p-6 hover:shadow-lg hover:border-transparent transition-all duration-300">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#E8630A]/10 text-[#E8630A] mb-4">
            <List className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg text-[#1A2940] mb-2">Vue Liste</h3>
          <p className="text-[#4A6580] text-sm leading-relaxed">
            Retrouvez, filtrez et consultez les OTST avec leur historique et leurs documents
            associés.
          </p>
        </div>
      </div>

      <p className="text-[#4A6580] leading-relaxed mb-6">
        Transparence, clarté et accessibilité : tout est pensé pour simplifier la vie des
        managers et encadrants TST.
      </p>

      {/* Section: Pourquoi VIZ-ACT change la donne */}
      <SectionHeading icon={<ClipboardCheck className="w-5 h-5" />} title="Pourquoi VIZ-ACT change la donne" />

      <div className="space-y-4 mb-6">
        <AdvantageCard icon={<Shield className="w-5 h-5" />} title="Traçabilité automatique des actes T" description="Chaque OTST est enregistré et archivé sans effort." />
        <AdvantageCard icon={<ClipboardCheck className="w-5 h-5" />} title="Suivi des compétences simplifié" description="Appui direct aux exigences du CTST et à la NF C 18-510-1." />
        <AdvantageCard icon={<Timer className="w-5 h-5" />} title="Gain de temps administratif" description="Laissez l'IA gérer la saisie, et concentrez-vous sur le terrain." />
        <AdvantageCard icon={<Users className="w-5 h-5" />} title="Outil d'aide au management" description="Catégorisation des opérateurs, suivi du recyclage et préparation des renouvellements d'habilitation." />
      </div>

      {/* Section: Une expérimentation en cours */}
      <SectionHeading icon={<FlaskConical className="w-5 h-5" />} title="Une expérimentation en cours" />

      <div className="bg-[#F4F9FD] border-l-4 border-[#E8630A] rounded-r-xl p-6 mb-6">
        <p className="text-[#1A2940] leading-relaxed">
          L&apos;expérimentation débute en <strong>mai 2025</strong> avec les entreprises{" "}
          <strong>SMEE</strong> et <strong>SERPOLLET</strong>. Objectif : faciliter le quotidien
          des équipes TST, renforcer la culture sécurité et garantir le respect des exigences du
          Comité des Travaux Sous Tension.
        </p>
      </div>

      {/* Section: En résumé */}
      <SectionHeading icon={<Sparkles className="w-5 h-5" />} title="En résumé" />

      <div className="relative p-8 rounded-2xl bg-gradient-to-br from-[#F4F9FD] to-white border border-[#DAEEF8]">
        <p className="text-lg text-[#1A2940] leading-relaxed font-medium text-center">
          VIZ-ACT, c&apos;est : <strong>moins d&apos;administratif</strong>, plus de fiabilité,
          une <strong>vision claire des pratiques terrain</strong>, et une{" "}
          <strong>sécurité renforcée</strong> pour tous. Une innovation signée CETé, au service
          du professionnalisme TST.
        </p>
      </div>
    </>
  );
}

function ProcessStep({ number, icon, text }: { number: number; icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F4F9FD] border border-[#DAEEF8]/60">
      <div className="flex items-center gap-3 shrink-0">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#E8630A] text-white text-sm font-bold">
          {number}
        </span>
        <div className="text-[#4DA6D9]">{icon}</div>
      </div>
      <p className="text-[#1A2940] leading-relaxed pt-1">{text}</p>
    </div>
  );
}

function AdvantageCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-[#DAEEF8] hover:shadow-md hover:border-transparent transition-all duration-300">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#E8630A]/10 text-[#E8630A] shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-[#1A2940] mb-1">{title}</h3>
        <p className="text-sm text-[#4A6580] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
