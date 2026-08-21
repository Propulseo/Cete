import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight, BarChart3 } from "lucide-react";
import { buildAlternates, buildOpenGraph, localizedUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ORGANIZATION_ID } from "@/lib/schema";
import type { Locale } from "@/i18n/routing";

// URL de référence citable de l'Observatoire O-M-T (levier GEO : les moteurs
// génératifs citent des sources datées et méthodologiquement décrites).

const STATS = [
  { value: "133", key: "stat1" },
  { value: "43", key: "stat2" },
  { value: "10 108", key: "stat3" },
  { value: "11 000", key: "stat4" },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "observatory.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(locale as Locale, "/observatoire"),
    openGraph: buildOpenGraph(locale as Locale, "/observatoire"),
  };
}

export default async function ObservatoirePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("observatory");
  const tStats = await getTranslations("expertise.omt");

  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name:
      locale === "en"
        ? "Live Working Mastery Observatory (O-M-T)"
        : "Observatoire de la Maîtrise des Travaux Sous Tension (O-M-T)",
    description: t("intro"),
    url: localizedUrl(locale as Locale, "/observatoire"),
    temporalCoverage: "2022/2025",
    spatialCoverage: { "@type": "Country", name: "France" },
    creator: { "@id": ORGANIZATION_ID },
    variableMeasured: STATS.map((s) => `${s.value} ${tStats(s.key)}`),
  };

  const tertiles = [
    { name: t("tertiles.t1Name"), desc: t("tertiles.t1Desc"), color: "#B84D08" },
    { name: t("tertiles.t2Name"), desc: t("tertiles.t2Desc"), color: "#1A7AB5" },
    { name: t("tertiles.t3Name"), desc: t("tertiles.t3Desc"), color: "#0D5A8A" },
  ];

  return (
    <>
      <JsonLd data={dataset} />
      <section className="relative overflow-hidden bg-hero-gradient py-24">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-[12%] h-56 w-56 rounded-full bg-[#4DA6D9]/10 blur-3xl" />
          <div className="absolute bottom-0 right-[15%] h-40 w-40 rounded-full bg-[#1A2940]/15 blur-3xl" />
        </div>
        <div className="relative z-10 container mx-auto max-w-4xl px-4 text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E8630A]/30 bg-[#E8630A]/10 px-4 py-2 text-sm font-medium text-[#E8630A]">
            <BarChart3 className="h-4 w-4" />
            {t("hero.badge")}
          </span>
          <h1 className="font-display text-3xl text-[#1A2940] md:text-5xl">
            {t("hero.heading")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#4A6580]">
            {t("hero.description")}
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <p className="text-lg leading-relaxed text-[#4A6580]">{t("intro")}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#1A2940] via-[#0D5A8A] to-[#1A2940] py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-center font-display text-3xl text-white">
            {t("stats.heading")}
          </h2>
          <p className="mt-2 text-center text-sm text-white/60">{t("stats.period")}</p>
          <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.key}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
              >
                <div className="font-display text-3xl text-white md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm font-medium text-white/60">
                  {tStats(stat.key)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="font-display text-3xl text-[#1A2940]">{t("method.heading")}</h2>
          <div className="mt-3 h-1 w-24 rounded-full bg-[#E8630A]" />
          <ul className="mt-8 space-y-4">
            {(["item1", "item2", "item3"] as const).map((key) => (
              <li key={key} className="flex gap-3 leading-relaxed text-[#4A6580]">
                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#4DA6D9]" />
                {t(`method.${key}`)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#F4F9FD] py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="font-display text-3xl text-[#1A2940]">
            {t("tertiles.heading")}
          </h2>
          <p className="mt-4 text-[#4A6580]">{t("tertiles.description")}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {tertiles.map((tertile) => (
              <div
                key={tertile.name}
                className="rounded-2xl border border-[#DAEEF8] bg-white p-6"
              >
                <h3
                  className="font-display text-xl"
                  style={{ color: tertile.color }}
                >
                  {tertile.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4A6580]">
                  {tertile.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm italic text-[#8AA5BE]">{t("note")}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/expertise"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#1A2940]/20 px-6 py-3 font-medium text-[#1A2940] transition-colors hover:bg-[#1A2940]/10"
            >
              {t("links.method")}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E8630A] px-6 py-3 font-medium text-white transition-colors hover:bg-[#B84D08]"
            >
              {t("links.contact")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
