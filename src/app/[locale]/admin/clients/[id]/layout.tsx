"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ChevronRight, UserX } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getClientById } from "@/lib/repo/clients.repo";
import type { Client } from "@/types/client";
import { ClientProvider } from "@/components/features/admin/clients/ClientContext";
import { ClientBanner } from "@/components/features/admin/clients/ClientBanner";
import { ClientTabNav } from "@/components/features/admin/clients/ClientTabNav";
import { AdminEmptyState } from "@/components/features/admin/ui/admin-empty-state";
import { Button } from "@/components/ui/button";

export default function ClientDetailLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const t = useTranslations("admin.clients.detail");
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getClientById(params.id).then((c) => {
      if (!cancelled) { setClient(c); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [params.id]);

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" strokeWidth={1.75} /></div>;
  }

  if (!client) {
    return (
      <div className="p-4 lg:p-8">
        <AdminEmptyState
          icon={UserX}
          title={t("notFound")}
          description={t("notFoundMsg")}
          action={<Button variant="outline" onClick={() => router.push("/admin/clients")}>{t("backToList")}</Button>}
        />
      </div>
    );
  }

  return (
    <ClientProvider client={client}>
      <div className="border-b bg-card px-8 py-2">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/admin/dashboard" className="hover:text-foreground">Admin</Link>
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          <Link href="/admin/clients" className="hover:text-foreground">{t("backToList").replace("Retour a la liste", "Clients").replace("[EN] Back to list", "Clients")}</Link>
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span className="font-medium text-foreground">{client.companyName}</span>
        </nav>
      </div>
      <ClientBanner />
      <ClientTabNav clientId={client.id} />
      <div className="p-4 lg:p-8">{children}</div>
    </ClientProvider>
  );
}
