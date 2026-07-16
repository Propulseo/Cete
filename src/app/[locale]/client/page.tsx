import { redirect } from "@/i18n/navigation";

export default async function ClientRootPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/client/dashboard", locale });
}
