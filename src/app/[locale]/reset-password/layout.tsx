import type { Metadata } from "next";

// La page reset-password est un client component : le metadata (noindex) vit
// dans ce layout serveur. Page transactionnelle (session temporaire Supabase).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Reset password" : "Réinitialisation du mot de passe",
    robots: { index: false, follow: false },
  };
}

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
