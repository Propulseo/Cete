import Script from "next/script";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd } from "@/lib/schema";
import type { Locale } from "@/i18n/routing";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Script
        id="umami-analytics"
        src="https://stats.propulseo-site.com/script.js"
        strategy="afterInteractive"
        data-website-id="5d5d1d6f-72ce-4d74-a84d-7566442e39ee"
        data-domains="cet-notation.com,www.cet-notation.com"
        data-exclude-search="true"
        data-exclude-hash="true"
        data-do-not-track="true"
      />
      <JsonLd data={organizationJsonLd(locale as Locale)} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
