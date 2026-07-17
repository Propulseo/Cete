"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ClipboardList, MessageSquare } from "lucide-react";
import type { ContactInfo } from "@/types/contact";
import { ContactForm } from "@/components/sections/ContactForm";
import { EvaluationForm } from "@/components/sections/EvaluationForm";
import { ContactSidebar } from "@/components/sections/contact/ContactSidebar";

type TabId = "evaluation" | "contact";

export function ContactMain({ contact }: { contact: ContactInfo }) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("type") === "contact" ? "contact" : "evaluation";

  return <ContactMainInner initialTab={initialTab} contact={contact} />;
}

function ContactMainInner({ initialTab, contact }: { initialTab: TabId; contact: ContactInfo }) {
  const t = useTranslations("contact.main");
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  const tabs = [
    { id: "evaluation" as const, label: t("tabEvaluation"), icon: ClipboardList },
    { id: "contact" as const, label: t("tabQuestion"), icon: MessageSquare },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-xl bg-[#F4F9FD] border border-[#DAEEF8] p-1.5 gap-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-white text-[#1A2940] shadow-sm"
                      : "text-[#4A6580] hover:text-[#1A2940]"
                  }`}
                >
                  <tab.icon className={`h-4 w-4 ${isActive ? "text-[#E8630A]" : ""}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* min-w-0 : un enfant de grid a min-width:auto et refuserait de passer
            sous la largeur de son contenu, débordant l'écran en mobile. */}
        <div className="grid gap-12 md:grid-cols-2">
          <div className="min-w-0">
            {activeTab === "evaluation" ? <EvaluationForm /> : <ContactForm />}
          </div>

          <ContactSidebar contact={contact} t={t} />
        </div>
      </div>
    </section>
  );
}
