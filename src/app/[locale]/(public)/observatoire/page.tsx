import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AlertTriangle, ArrowRight, BarChart3, Minus, Trophy } from "lucide-react";
import { buildAlternates, buildOpenGraph, localizedUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ORGANIZATION_ID } from "@/lib/schema";
import type { Locale } from "@/i18n/routing";

const STATS = [
  { value: "133", key: "stat1", highlight: false },
  { value: "43", key: "stat2", highlight: false },
  { value: "10 108", key: "stat3", highlight: false },
  { value: "11 000", key: "stat4", highlight: true },
] as const;

const methodKeys = ["item1", "item2", "item3"] as const;

const tertileStyles = {
  vulnerable: {
    icon: AlertTriangle,
    border: "border-[#EF4444]/28",
    iconClass: "bg-[#EF4444]/12 text-[#B91C1C]",
    shadow: "shadow-[0_12px_32px_-26px_rgba(185,28,28,0.35)]",
  },
  middle: {
    icon: Minus,
    border: "border-[#F97316]/28",
    iconClass: "bg-[#F97316]/13 text-[#C2410C]",
    shadow: "shadow-[0_12px_32px_-26px_rgba(194,65,12,0.3)]",
  },
  talent: {
    icon: Trophy,
    border: "border-[#22C55E]/30",
    iconClass: "bg-[#22C55E]/13 text-[#15803D]",
    shadow: "shadow-[0_12px_32px_-26px_rgba(21,128,61,0.3)]",
  },
};

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
    variableMeasured: STATS.map((stat) => `${stat.value} ${tStats(stat.key)}`),
  };

  const tertiles = [
    { name: t("tertiles.t1Name"), desc: t("tertiles.t1Desc"), tone: "vulnerable" },
    { name: t("tertiles.t2Name"), desc: t("tertiles.t2Desc"), tone: "middle" },
    { name: t("tertiles.t3Name"), desc: t("tertiles.t3Desc"), tone: "talent" },
  ] as const;

  return (
    <>
      <JsonLd data={dataset} />
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="glow-blob absolute left-[8%] top-5 h-80 w-80" />
        <div className="container-reading relative z-10 pt-[clamp(24px,2.5vw,40px)] pb-[clamp(44px,5vw,72px)] text-center">
          <p className="type-kicker mb-6 inline-flex items-center gap-[9px] rounded-full border border-[#4DA6D9]/35 bg-white/65 px-[18px] py-[9px] text-[#1A7AB5] backdrop-blur-sm">
            <BarChart3 className="h-[15px] w-[15px]" />
            {t("hero.badge")}
          </p>
          <h1 className="mb-5 font-display text-[clamp(27px,3.8vw,50px)] font-black uppercase leading-[1.1] text-[#1A2940]">
            {t("hero.heading")}
          </h1>
          <p className="mx-auto max-w-[660px] text-[16.5px] leading-[1.75] text-[#4A6580]">
            {t("hero.description")}
          </p>
        </div>
      </section>

      <section className="bg-white pb-[clamp(48px,6vw,72px)] pt-0">
        <div className="container-reading">
          <p className="rounded-[18px] border border-[#E8630A]/25 bg-[#F4F9FD] p-[clamp(26px,3.5vw,38px)] text-base leading-[1.8] text-[#4A6580]">
            {t("intro")}
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#1A2940] py-[clamp(48px,6vw,80px)]">
        <div className="glow-blob absolute -right-10 -top-[70px] h-[340px] w-[340px]" />
        <div className="container-page relative z-10">
          <div className="mb-9 flex flex-wrap items-baseline justify-between gap-3.5">
            <h2 className="font-display text-[clamp(22px,2.8vw,34px)] font-black text-white">
              {t("stats.heading")}
            </h2>
            <p className="type-kicker text-[#87C4E8]">{t("stats.period")}</p>
          </div>
          <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <article
                key={stat.key}
                className={`rounded-[18px] border px-6 py-7 ${
                  stat.highlight
                    ? "border-[#E8630A]/40 bg-[#E8630A]/14"
                    : "border-on-dark bg-white/[0.06]"
                }`}
              >
                <p className="type-chiffre-cle text-[40px] text-white">{stat.value}</p>
                <p className={`mt-2.5 text-[13.5px] ${stat.highlight ? "text-[#FCD9BE]" : "text-[#8AA5BE]"}`}>
                  {tStats(stat.key)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-[clamp(52px,6.5vw,88px)]">
        <div className="container-reading max-w-[1000px]">
          <h2 className="mb-[34px] font-display text-[clamp(24px,3vw,36px)] font-black text-[#1A2940]">
            {t("method.heading")}
          </h2>
          <ol className="grid gap-[18px]">
            {methodKeys.map((key, index) => (
              <li key={key} className="flex gap-[18px] rounded-[18px] border border-[#4DA6D9]/22 bg-[#F4F9FD] px-[26px] py-6">
                <span className={`inline-flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[11px] text-[13px] font-bold ${index === 2 ? "bg-[#E8630A] text-white" : "border border-[#4DA6D9]/30 bg-white text-[#0D5A8A]"}`}>
                  {index + 1}
                </span>
                <span className="text-[15.5px] leading-[1.75] text-[#4A6580]">
                  {t(`method.${key}`)}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#F4F9FD] py-[clamp(52px,6.5vw,88px)]">
        <div className="container-page">
          <div className="mx-auto mb-10 max-w-[700px] text-center">
            <h2 className="mb-3.5 font-display text-[clamp(24px,3vw,36px)] font-black text-[#1A2940]">
              {t("tertiles.heading")}
            </h2>
            <p className="text-base leading-[1.7] text-[#4A6580]">{t("tertiles.description")}</p>
          </div>

          <div className="mb-10 grid gap-[22px] md:grid-cols-3">
            {tertiles.map((tertile) => {
              const style = tertileStyles[tertile.tone];
              const Icon = style.icon;

              return (
                <article key={tertile.name} className={`rounded-[18px] border bg-white px-[26px] py-7 ${style.border} ${style.shadow}`}>
                  <span className={`mb-[18px] inline-flex h-11 w-11 items-center justify-center rounded-[13px] ${style.iconClass}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="type-h3-card mb-2.5 text-[#1A2940]">{tertile.name}</h3>
                  <p className="text-[14.5px] leading-[1.7] text-[#4A6580]">{tertile.desc}</p>
                </article>
              );
            })}
          </div>

          <p className="mx-auto mb-8 max-w-[640px] text-center text-[14.5px] leading-[1.7] text-[#8AA5BE]">
            {t("note")}
          </p>
          <div className="flex flex-col justify-center gap-3.5 sm:flex-row">
            <Link href="/expertise" className="bg-grad-blue shadow-cete-lg inline-flex h-12 items-center justify-center gap-2.5 rounded-xl px-7 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5 hover:text-white">
              {t("links.method")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="shadow-cta inline-flex h-12 items-center justify-center rounded-xl bg-[#E8630A] px-7 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#B84D08] hover:text-white">
              {t("links.contact")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
