import {
  MapPin,
  Mail,
  Phone,
  Clock,
  MessageCircle,
  FileSearch,
  Handshake,
} from "lucide-react";
import { getContactInfo } from "@/lib/data-loader";
import { ContactForm } from "@/components/sections/ContactForm";

const processSteps = [
  {
    icon: MessageCircle,
    number: "01",
    title: "Échange initial",
    description: "Cadrage de votre périmètre et objectifs",
  },
  {
    icon: FileSearch,
    number: "02",
    title: "Évaluation terrain",
    description: "Diagnostic sur site selon le référentiel ADN",
  },
  {
    icon: Handshake,
    number: "03",
    title: "Notation et plan d'action",
    description: "Remise de votre Vigi-Score et feuille de route",
  },
];

const serviceChips = ["Notation Vigi-Score", "Diagnostic DPS", "Coaching", "Veille réglementaire"];

export function ContactMain() {
  const contact = getContactInfo();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left — Form */}
          <div>
            <ContactForm />
          </div>

          {/* Right — Info + Process + Chips */}
          <div className="space-y-8">
            {/* Info Cards */}
            <div className="rounded-2xl border border-[#DAEEF8] bg-white p-6 shadow-sm">
              <h3 className="mb-5 font-display text-xl tracking-wide text-[#1A2940]">
                COORDONNÉES
              </h3>
              <div className="space-y-4">
                <InfoRow
                  icon={MapPin}
                  label="Adresse"
                  value={`${contact.address}\n${contact.city}`}
                />
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={contact.email}
                  href={`mailto:${contact.email}`}
                />
                <InfoRow
                  icon={Phone}
                  label="Téléphone"
                  value={contact.phone}
                  href={`tel:${contact.phone}`}
                />
                <InfoRow
                  icon={Clock}
                  label="Horaires"
                  value={`Lun–Ven : ${contact.businessHours.monday}\nSam–Dim : Fermé`}
                />
              </div>
            </div>

            {/* Mini Process */}
            <div className="rounded-2xl border border-[#DAEEF8] bg-white p-6 shadow-sm">
              <h3 className="mb-5 font-display text-xl tracking-wide text-[#1A2940]">
                COMMENT ÇA MARCHE
              </h3>
              <div className="space-y-4">
                {processSteps.map((step, i) => (
                  <div key={step.number} className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4DA6D9] text-white">
                        <step.icon className="h-4 w-4" />
                      </div>
                      {i < processSteps.length - 1 && (
                        <div className="absolute left-1/2 top-10 h-4 w-px -translate-x-1/2 bg-[#DAEEF8]" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#E8630A]">
                        {step.number}
                      </span>
                      <h4 className="font-semibold text-[#1A2940]">
                        {step.title}
                      </h4>
                      <p className="text-sm text-[#4A6580]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Chips */}
            <div className="flex flex-wrap gap-2">
              {serviceChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[#4DA6D9]/20 bg-[#4DA6D9]/10 px-4 py-1.5 text-sm font-medium text-[#1A2940]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Internal sub-component ── */

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const lines = value.split("\n");

  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#4DA6D9]/10">
        <Icon className="h-4 w-4 text-[#4DA6D9]" />
      </div>
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-[#4A6580]">
          {label}
        </span>
        {href ? (
          <a
            href={href}
            className="block font-medium text-[#1A2940] transition-colors hover:text-[#4DA6D9]"
          >
            {lines[0]}
          </a>
        ) : (
          lines.map((line, i) => (
            <p key={i} className="text-[#1A2940]">
              {line}
            </p>
          ))
        )}
      </div>
    </div>
  );
}
