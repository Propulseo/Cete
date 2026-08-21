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
      <JsonLd data={organizationJsonLd(locale as Locale)} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
