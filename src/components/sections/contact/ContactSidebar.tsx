"use client";

import {
  Mail,
  MessageCircle,
  FileSearch,
  Handshake,
} from "lucide-react";
import type { ContactInfo } from "@/types";

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
      <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[11px] bg-[rgba(77,166,217,0.25)]">
        <Icon className="h-[18px] w-[18px] text-[#87C4E8]" />
      </div>
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-[#87C4E8]">
          {label}
        </span>
        {href ? (
          <a
            href={href}
            className="flex min-h-11 items-center font-medium text-white transition-colors hover:text-[#E8630A] sm:min-h-0 sm:block"
          >
            {lines[0]}
          </a>
        ) : (
          lines.map((line, i) => (
            <p key={i} className="text-white">
              {line}
            </p>
          ))
        )}
      </div>
    </div>
  );
}

interface ProcessStep {
  icon: React.ComponentType<{ className?: string }>;
  number: string;
  title: string;
  description: string;
}

interface ContactSidebarProps {
  contact: ContactInfo;
  t: (key: string) => string;
}

export function ContactSidebar({ contact, t }: ContactSidebarProps) {
  const processSteps: ProcessStep[] = [
    {
      icon: MessageCircle,
      number: "01",
      title: t("step1Title"),
      description: t("step1Desc"),
    },
    {
      icon: FileSearch,
      number: "02",
      title: t("step2Title"),
      description: t("step2Desc"),
    },
    {
      icon: Handshake,
      number: "03",
      title: t("step3Title"),
      description: t("step3Desc"),
    },
  ];

  const serviceChips = [t("chipVigiScore"), t("chipDPS"), t("chipCoaching"), t("chipVeille")];

  return (
    <div className="space-y-[22px]">
      {/* Info Cards — variante encre (fiche §07) */}
      <div className="rounded-[20px] border border-on-dark bg-grad-ink p-[26px_28px] shadow-cete-lg">
        <h3 className="mb-[18px] text-xs font-bold uppercase tracking-[0.14em] text-[#87C4E8]">
          {t("coordinates")}
        </h3>
        <div className="space-y-4">
          {/* Pas d'horaires d'ouverture : structure d'expertise sans accueil
              bureau — un affichage d'horaires serait trompeur. */}
          <InfoRow
            icon={Mail}
            label={t("emailLabel")}
            value={contact.email}
            href={`mailto:${contact.email}`}
          />
        </div>
      </div>

      {/* Mini Process */}
      <div className="rounded-[20px] border border-subtle bg-[#F4F9FD] p-[28px_26px]">
        <h3 className="mb-[22px] text-xs font-bold uppercase tracking-[0.14em] text-[#1A7AB5]">
          {t("howItWorks")}
        </h3>
        <div className="space-y-5">
          {processSteps.map((step, i) => {
            const isFinal = i === processSteps.length - 1;
            return (
              <div key={step.number} className="flex items-start gap-[14px]">
                <div className="relative flex-shrink-0">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-[11px] ${
                      isFinal
                        ? "bg-[#E8630A] text-white"
                        : "border border-[rgba(77,166,217,0.3)] bg-white text-[#0D5A8A]"
                    }`}
                  >
                    <step.icon className="h-4 w-4" />
                  </div>
                  {i < processSteps.length - 1 && (
                    <div className="absolute left-1/2 top-9 h-4 w-px -translate-x-1/2 bg-[rgba(77,166,217,0.3)]" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#E8630A]">
                    {step.number}
                  </span>
                  <h4 className="text-[14.5px] font-semibold text-[#1A2940]">
                    {step.title}
                  </h4>
                  <p className="text-[13.5px] leading-[1.6] text-[#4A6580]">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Chips */}
      <div className="flex flex-wrap gap-2">
        {serviceChips.map((chip) => (
          <span
            key={chip}
            className="rounded-full bg-[rgba(77,166,217,0.12)] px-4 py-1.5 text-[12.5px] font-bold uppercase tracking-[0.12em] text-[#1A2940]"
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}
