import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toaster } from "@/components/ui/sonner";
import "@/app/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://cete-notation.fr";

  return {
    title: {
      default: "CETé - Consortium Experts Techniques Électricité",
      template: "%s | CETé",
    },
    description: isEn
      ? "Independent Electrical Risk Rating Agency. Expertise, consulting and training in electrical safety and Live Working (TST)."
      : "Agence de Notation indépendante du risque électrique. Expertise, conseil et formation en sécurité électrique et Travaux Sous Tension (TST).",
    keywords: isEn
      ? ["electrical safety", "electrical risk", "TST", "Live Working", "rating agency", "electrical expertise", "safety training", "electrical audit"]
      : ["sécurité électrique", "risque électrique", "TST", "Travaux Sous Tension", "agence de notation", "expertise électrique", "formation sécurité", "audit électrique"],
    authors: [{ name: "CETé" }],
    openGraph: {
      type: "website",
      locale: isEn ? "en_US" : "fr_FR",
      alternateLocale: isEn ? "fr_FR" : "en_US",
      url: `${siteUrl}/${locale}`,
      siteName: "CETé",
    },
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        fr: `${siteUrl}/fr`,
        en: `${siteUrl}/en`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "fr" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${merriweather.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">{children}</div>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
