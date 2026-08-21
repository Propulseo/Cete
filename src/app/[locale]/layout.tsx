import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { OG_IMAGE, siteUrl } from "@/lib/seo";
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

// Le layout ne définit AUCUN alternates : un canonical hérité identique sur
// toutes les pages les déclarerait duplicatas de la home. Chaque page publique
// construit son canonical/hreflang auto-référent via buildAlternates (src/lib/seo).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "CETé - Consortium Experts Techniques Électricité",
      template: "%s | CETé",
    },
    description: isEn
      ? "Independent Electrical Risk Rating Agency. Expertise, consulting and training in electrical safety and Live Working (TST)."
      : "Agence de Notation indépendante du risque électrique. Expertise, conseil et formation en sécurité électrique et Travaux Sous Tension (TST).",
    authors: [{ name: "CETé" }],
    openGraph: {
      type: "website",
      locale: isEn ? "en_US" : "fr_FR",
      alternateLocale: isEn ? "fr_FR" : "en_US",
      siteName: "CETé",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
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
