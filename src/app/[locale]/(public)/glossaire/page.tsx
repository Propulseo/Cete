import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getGlossary } from "@/data/glossary";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "glossary.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(locale as Locale, "/glossaire"),
    openGraph: buildOpenGraph(locale as Locale, "/glossaire"),
  };
}

export default async function GlossairePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "glossary" });
  const entries = getGlossary(locale as Locale);

  const definedTermSet = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: t("meta.title"),
    hasDefinedTerm: entries.map((entry) => ({
      "@type": "DefinedTerm",
      name: entry.expansion ? `${entry.term} (${entry.expansion})` : entry.term,
      description: entry.definition,
    })),
  };

  return (
    <>
      <JsonLd data={definedTermSet} />
      <section className="relative overflow-hidden bg-hero-gradient py-24">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-[12%] h-56 w-56 rounded-full bg-[#4DA6D9]/10 blur-3xl" />
          <div className="absolute bottom-0 left-[18%] h-40 w-40 rounded-full bg-[#1A2940]/15 blur-3xl" />
        </div>
        <div className="relative z-10 container mx-auto max-w-4xl px-4 text-center">
          <span className="mb-6 inline-flex items-center rounded-full border border-[#E8630A]/30 bg-[#E8630A]/10 px-4 py-2 text-sm font-medium text-[#E8630A]">
            {t("hero.badge")}
          </span>
          <h1 className="font-display text-4xl text-[#1A2940] md:text-5xl lg:text-6xl">
            {t("hero.heading")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#4A6580]">
            {t("hero.description")}
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <dl className="space-y-10">
            {entries.map((entry) => (
              <div
                key={entry.id}
                id={entry.id}
                className="scroll-mt-28 border-b border-[#DAEEF8] pb-8 last:border-b-0"
              >
                <dt>
                  <h2 className="font-display text-2xl text-[#1A2940]">
                    {entry.term}
                    {entry.expansion && (
                      <span className="ml-2 text-lg font-normal text-[#4A6580]">
                        — {entry.expansion}
                      </span>
                    )}
                  </h2>
                </dt>
                <dd className="mt-3 leading-relaxed text-[#4A6580]">
                  {entry.definition}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
