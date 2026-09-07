"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ClipboardList, MessageSquare } from "lucide-react";
import type { ContactInfo } from "@/types/contact";
import type { PageOverridesMap } from "@/types";
import { resolveText } from "@/lib/page-content/resolve";
import { ContactForm } from "@/components/sections/ContactForm";
import { EvaluationForm } from "@/components/sections/EvaluationForm";
import { ContactSidebar } from "@/components/sections/contact/ContactSidebar";

type TabId = "evaluation" | "contact";

interface ContactMainProps {
  contact: ContactInfo;
  overrides: PageOverridesMap;
  locale: "fr" | "en";
}

export function ContactMain({ contact, overrides, locale }: ContactMainProps) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("type") === "contact" ? "contact" : "evaluation";

  return <ContactMainInner initialTab={initialTab} contact={contact} overrides={overrides} locale={locale} />;
}

function ContactMainInner({
  initialTab,
  contact,
  overrides,
  locale,
}: {
  initialTab: TabId;
  contact: ContactInfo;
  overrides: PageOverridesMap;
  locale: "fr" | "en";
}) {
  const t = useTranslations("contact.main");
  const rt = (key: string) => resolveText(overrides, `sidebar.${key}`, t(key), locale);
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  const tabs = [
    { id: "evaluation" as const, label: t("tabEvaluation"), icon: ClipboardList },
    { id: "contact" as const, label: t("tabQuestion"), icon: MessageSquare },
  ];

  return (
    <section className="section-pad bg-white">
      <div className="container-page">
        {/* Tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-[11px] px-5 py-3 text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? "bg-[#1A2940] text-white"
                    : "bg-[#F4F9FD] text-[#4A6580] hover:text-[#1A2940]"
                }`}
              >
                <tab.icon className={`h-4 w-4 ${isActive ? "text-[#E8630A]" : ""}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* min-w-0 : un enfant de grid a min-width:auto et refuserait de passer
            sous la largeur de son contenu, débordant l'écran en mobile. */}
        <div className="grid items-start gap-[clamp(28px,3.5vw,44px)] md:grid-cols-[1.4fr_0.6fr]">
          <div className="min-w-0">
            {activeTab === "evaluation" ? <EvaluationForm /> : <ContactForm />}
          </div>

          <ContactSidebar contact={contact} t={rt} />
        </div>
      </div>
    </section>
  );
}
