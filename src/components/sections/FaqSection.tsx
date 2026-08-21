import { getTranslations } from "next-intl/server";
import { ChevronDown, HelpCircle } from "lucide-react";
import type { FaqItem } from "@/data/faq";

// Section FAQ partagée (server component, zéro JS client) : <details>/<summary>
// natifs — contenu 100 % présent dans le HTML SSR, extractible par les moteurs
// génératifs. Le balisage FAQPage est émis par la page via faqJsonLd() à partir
// des mêmes données.
export async function FaqSection({ items }: { items: FaqItem[] }) {
  const t = await getTranslations("faq");

  return (
    <section className="bg-[#F4F9FD] py-20">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E8630A]/30 bg-[#E8630A]/10 px-4 py-2 text-sm font-medium text-[#E8630A]">
            <HelpCircle className="h-4 w-4" />
            {t("badge")}
          </span>
          <h2 className="mt-6 font-display text-3xl text-[#1A2940] md:text-4xl">
            {t("heading")}
          </h2>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#E8630A]" />
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <details
              key={item.id}
              className="group rounded-2xl border border-[#DAEEF8] bg-white px-6 py-5 transition-shadow open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h3 className="font-display text-lg text-[#1A2940]">
                  {item.question}
                </h3>
                <ChevronDown className="h-5 w-5 flex-shrink-0 text-[#4DA6D9] transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-4 leading-relaxed text-[#4A6580]">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
