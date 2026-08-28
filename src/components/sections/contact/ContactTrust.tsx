"use client";

import { useTranslations } from "next-intl";
import { Shield, Lock, Clock } from "lucide-react";

export function ContactTrust() {
  const t = useTranslations("contact.trust");

  const trustItems = [
    {
      icon: Shield,
      title: t("item1Title"),
      description: t("item1Desc"),
    },
    {
      icon: Lock,
      title: t("item2Title"),
      description: t("item2Desc"),
    },
    {
      icon: Clock,
      title: t("item3Title"),
      description: t("item3Desc"),
    },
  ];

  return (
    <section className="section-pad bg-white">
      <div className="container-page">
        <div className="grid gap-[22px] md:grid-cols-3">
          {trustItems.map((item, i) => {
            const isLast = i === trustItems.length - 1;
            return (
              <div
                key={item.title}
                className={`flex h-full flex-col rounded-[18px] border p-[28px_26px] transition-all duration-300 hover:-translate-y-[5px] hover:shadow-cete-lg ${
                  isLast
                    ? "bg-[linear-gradient(180deg,#FDF3EC,#fff_45%)] border-[rgba(232,99,10,0.22)] hover:border-[#E8630A]"
                    : "bg-grad-card border-subtle hover:border-strong"
                }`}
              >
                <div
                  className={`mb-[18px] flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[13px] ${
                    isLast ? "bg-[rgba(232,99,10,0.14)] text-[#B84D08]" : "bg-[rgba(77,166,217,0.14)] text-[#0D5A8A]"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="type-h3-card mb-2 text-[#1A2940]">{item.title}</h3>
                <p className="text-[0.875rem] leading-[1.65] text-[#4A6580]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
