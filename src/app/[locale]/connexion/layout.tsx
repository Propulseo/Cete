import type { Metadata } from "next";

// La page connexion est un client component : le metadata (noindex) vit dans ce
// layout serveur. Page d'authentification sans valeur de recherche.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Sign in" : "Connexion",
    robots: { index: false, follow: false },
  };
}

export default function ConnexionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
