"use client";

import { useRouter } from "next/navigation";
import { Building2, Edit, Archive, ClipboardCheck, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { useClient } from "./ClientContext";
import { softArchiveClient } from "@/lib/repo/clients.repo";
import { StatusBadge } from "../ui/status-badge";

export function ClientBanner() {
  const client = useClient();
  const t = useTranslations("admin.clients");
  const router = useRouter();
  const primary = client.contacts.find((c) => c.isPrimary);
  const initials = client.companyName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const handleArchive = async () => {
    await softArchiveClient(client.id);
    router.push("/admin/clients");
  };

  return (
    <div className="border-b bg-card px-8 py-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif-display text-2xl font-semibold text-foreground">{client.companyName}</h1>
              <StatusBadge status={client.status}>{t(`status.${client.status}`)}</StatusBadge>
            </div>
            <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{client.siret}</span>
              <span>{client.address.city}</span>
              <Badge variant="secondary">{t(`sectors.${client.sector}`)}</Badge>
              {primary && <span>{primary.firstName} {primary.lastName} &middot; {primary.email}</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/clients/${client.id}/societe`)}>
            <Edit className="mr-1.5 h-3.5 w-3.5" />{t("detail.edit")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleArchive}>
            <Archive className="mr-1.5 h-3.5 w-3.5" />{t("detail.archive")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/clients/${client.id}/evaluations`)}>
            <ClipboardCheck className="mr-1.5 h-3.5 w-3.5" />{t("detail.newEval")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/clients/${client.id}/documents`)}>
            <FileUp className="mr-1.5 h-3.5 w-3.5" />{t("detail.newDoc")}
          </Button>
        </div>
      </div>
    </div>
  );
}
