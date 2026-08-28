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
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="glow-blob absolute right-[8%] top-5 h-[300px] w-[300px]" />
        <div className="container-reading relative z-10 pt-[clamp(24px,2.5vw,40px)] pb-[clamp(44px,5vw,72px)] text-center">
          <p className="type-kicker mb-6 inline-flex items-center gap-[9px] rounded-full border border-[#4DA6D9]/35 bg-white/65 px-[18px] py-[9px] text-[#1A7AB5] backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#E8630A] shadow-[0_0_0_3px_rgba(232,99,10,0.18)]" />
            {t("hero.badge")}
          </p>
          <h1 className="mb-5 font-display text-[clamp(28px,4vw,52px)] font-black uppercase leading-[1.08] text-[#1A2940]">
            {t("hero.heading")}
          </h1>
          <p className="mx-auto max-w-[660px] text-lead leading-[1.75] text-[#4A6580]">
            {t("hero.description")}
          </p>
        </div>
      </section>

      <section className="bg-[#F4F9FD] py-[clamp(48px,6vw,80px)]">
        <div className="container-page max-w-[1160px]">
          <dl className="grid gap-5 md:grid-cols-2">
            {entries.map((entry) => (
              <div
                key={entry.id}
                id={entry.id}
                className="shadow-cete-sm scroll-mt-28 rounded-[18px] border border-subtle bg-white px-6 py-[26px] transition-all duration-300 hover:-translate-y-0.5 hover:border-strong hover:shadow-cete-lg"
              >
                <dt className="mb-3 flex flex-wrap items-baseline gap-2.5 font-display text-[1.1875rem] font-black text-[#1A2940]">
                  {entry.term}
                  {entry.expansion && (
                    <span className="font-sans text-note font-medium text-[#4A6580]">
                      — {entry.expansion}
                    </span>
                  )}
                </dt>
                <dd className="text-body-sm leading-[1.7] text-[#4A6580]">
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
