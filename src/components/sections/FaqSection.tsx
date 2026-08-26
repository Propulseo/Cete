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
    <section className="section-pad bg-[#F4F9FD]">
      <div className="container-reading">
        <div className="mb-12 text-center">
          <span className="type-kicker mb-4 inline-flex items-center gap-2 rounded-full bg-[#4DA6D9]/[0.12] px-4 py-2 text-[#1A2940]">
            <HelpCircle className="h-4 w-4" />
            {t("badge")}
          </span>
          <h2 className="type-h2-section text-[#1A2940]">
            {t("heading")}
          </h2>
        </div>

        <div className="space-y-[14px]">
          {items.map((item) => (
            <details
              key={item.id}
              className="group rounded-2xl border border-subtle bg-white p-[20px_24px] transition-shadow open:shadow-cete-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h3 className="text-base font-semibold text-[#1A2940]">
                  {item.question}
                </h3>
                <ChevronDown className="h-5 w-5 flex-shrink-0 text-[#4DA6D9] transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-4 text-[15px] leading-[1.75] text-[#4A6580]">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
