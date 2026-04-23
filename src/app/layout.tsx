import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "CETé - Consortium Experts Techniques Électricité",
    template: "%s | CETé",
  },
  description:
    "Agence de Notation indépendante du risque électrique. Expertise, conseil et formation en sécurité électrique et Travaux Sous Tension (TST). Transformer la vigilance en énergie collective.",
  keywords: [
    "sécurité électrique",
    "risque électrique",
    "TST",
    "Travaux Sous Tension",
    "agence de notation",
    "expertise électrique",
    "formation sécurité",
    "audit électrique",
  ],
  authors: [{ name: "CETé" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://cete-notation.fr",
    siteName: "CETé",
    title: "CETé - Consortium Experts Techniques Électricité",
    description:
      "Agence de Notation indépendante du risque électrique. Transformer la vigilance en énergie collective.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${merriweather.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
