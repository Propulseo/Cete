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
import { VIZ_ACT_COPY } from "./viz-act-copy";

const STEP_ICONS = [
  <Camera key="camera" className="w-5 h-5" />,
  <Share2 key="share" className="w-5 h-5" />,
  <Brain key="brain" className="w-5 h-5" />,
];

const ADVANTAGE_ICONS = [
  <Shield key="shield" className="w-5 h-5" />,
  <ClipboardCheck key="clipboard" className="w-5 h-5" />,
  <Timer key="timer" className="w-5 h-5" />,
  <Users key="users" className="w-5 h-5" />,
];

export function VizActContent({ locale = "fr" }: { locale?: "fr" | "en" }) {
  const c = VIZ_ACT_COPY[locale];
  return (
    <>
      {/* Introduction */}
      <p className="text-lg text-[#1A2940] leading-relaxed mb-6">{c.intro}</p>

      {/* 80% callout */}
      <div className="relative my-12 p-8 md:p-10 rounded-2xl bg-gradient-to-br from-[#1A2940] to-[#0D5A8A] text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#4DA6D9]/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <span className="font-display text-6xl md:text-7xl text-[#E8630A] shrink-0">80%</span>
          <div>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">{c.statText}</p>
            <p className="text-sm text-white/50 mt-3">{c.statSource}</p>
          </div>
        </div>
      </div>

      <p className="text-lg text-[#4A6580] leading-relaxed mb-6">{c.afterStat}</p>

      {/* Section : idée simple, impact fort */}
      <SectionHeading icon={<Sparkles className="w-5 h-5" />} title={c.ideaTitle} />

      <p className="text-[#4A6580] leading-relaxed mb-6">{c.ideaIntro}</p>

      <div className="space-y-4 mb-8">
        {c.steps.map((text, i) => (
          <ProcessStep key={i} number={i + 1} icon={STEP_ICONS[i]} text={text} />
        ))}
      </div>

      <div className="bg-[#F4F9FD] border border-[#DAEEF8] rounded-xl p-6 mb-6">
        <p className="text-[#1A2940] font-semibold text-center">{c.noRetype}</p>
      </div>

      {/* Section : deux vues */}
      <SectionHeading icon={<MapPin className="w-5 h-5" />} title={c.viewsTitle} />

      <p className="text-[#4A6580] leading-relaxed mb-8">{c.viewsIntro}</p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-[#DAEEF8] rounded-2xl p-6 hover:shadow-lg hover:border-transparent transition-all duration-300">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#4DA6D9]/10 text-[#4DA6D9] mb-4">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg text-[#1A2940] mb-2">{c.mapTitle}</h3>
          <p className="text-[#4A6580] text-sm leading-relaxed">{c.mapDesc}</p>
        </div>
        <div className="bg-white border border-[#DAEEF8] rounded-2xl p-6 hover:shadow-lg hover:border-transparent transition-all duration-300">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#E8630A]/10 text-[#E8630A] mb-4">
            <List className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg text-[#1A2940] mb-2">{c.listTitle}</h3>
          <p className="text-[#4A6580] text-sm leading-relaxed">{c.listDesc}</p>
        </div>
      </div>

      <p className="text-[#4A6580] leading-relaxed mb-6">{c.transparency}</p>

      {/* Section : pourquoi VIZ-ACT change la donne */}
      <SectionHeading icon={<ClipboardCheck className="w-5 h-5" />} title={c.whyTitle} />

      <div className="space-y-4 mb-6">
        {c.advantages.map((a, i) => (
          <AdvantageCard key={i} icon={ADVANTAGE_ICONS[i]} title={a.title} description={a.description} />
        ))}
      </div>

      {/* Section : expérimentation */}
      <SectionHeading icon={<FlaskConical className="w-5 h-5" />} title={c.pilotTitle} />

      <div className="bg-[#F4F9FD] border-l-4 border-[#E8630A] rounded-r-xl p-6 mb-6">
        <p className="text-[#1A2940] leading-relaxed">{c.pilotText}</p>
      </div>

      {/* Section : en résumé */}
      <SectionHeading icon={<Sparkles className="w-5 h-5" />} title={c.summaryTitle} />

      <div className="relative p-8 rounded-2xl bg-gradient-to-br from-[#F4F9FD] to-white border border-[#DAEEF8]">
        <p className="text-lg text-[#1A2940] leading-relaxed font-medium text-center">
          {c.summaryText}
        </p>
      </div>
    </>
  );
}

function ProcessStep({ number, icon, text }: { number: number; icon: React.ReactNode; text: React.ReactNode }) {
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
