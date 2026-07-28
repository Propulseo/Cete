import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AuthProvider } from "@/lib/auth-context";
import { SecureDocumentViewer } from "@/components/features/client/SecureDocumentViewer";
import type { StorageBucket } from "@/lib/supabase/storage";

// Visionneuse lecture seule, hors du layout /client : fenêtre dédiée sans
// barre latérale, et surtout un document dont on maîtrise l'impression de bout
// en bout (cf. src/lib/pdf-render.ts).

const BUCKETS: StorageBucket[] = ["certificates", "contract-documents", "client-documents"];

type Search = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** N'accepte qu'un chemin same-origin (jeux de données de démo). */
function safeLocalPath(value: string | undefined): string | undefined {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return undefined;
  return value;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ViewerPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Search>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;

  const rawBucket = one(sp.b);
  const bucket = BUCKETS.find((b) => b === rawBucket);
  const path = one(sp.p);
  const src = safeLocalPath(one(sp.u));
  const title = one(sp.t) ?? "Document";

  return (
    <AuthProvider>
      <SecureDocumentViewer title={title} bucket={bucket} path={path} src={src} />
    </AuthProvider>
  );
}
