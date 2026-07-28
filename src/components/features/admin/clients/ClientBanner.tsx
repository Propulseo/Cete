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

  const actions = [
    { key: "edit", icon: Edit, label: t("detail.edit"), onClick: () => router.push(`/admin/clients/${client.id}/societe`) },
    { key: "archive", icon: Archive, label: t("detail.archive"), onClick: handleArchive },
    { key: "eval", icon: ClipboardCheck, label: t("detail.newEval"), onClick: () => router.push(`/admin/clients/${client.id}/evaluations`) },
    { key: "doc", icon: FileUp, label: t("detail.newDoc"), onClick: () => router.push(`/admin/clients/${client.id}/documents`) },
  ];

  return (
    // Trois blocs empilés sous `lg` : identité, méta repliable, actions en grille 2×2.
    // La rangée de quatre boutons et la ligne de méta séparée par des gap-4 débordaient
    // largement d'un écran de téléphone.
    <div className="border-b bg-card px-4 py-4 lg:px-8 lg:py-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary sm:size-14 sm:text-lg">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="font-serif-display text-xl font-semibold text-foreground sm:text-2xl">{client.companyName}</h1>
              <StatusBadge status={client.status}>{t(`status.${client.status}`)}</StatusBadge>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5 shrink-0" />{client.siret}</span>
              <span>{client.address.city}</span>
              <Badge variant="secondary">{t(`sectors.${client.sector}`)}</Badge>
              {primary && (
                <span className="min-w-0 break-words">
                  {primary.firstName} {primary.lastName} &middot; {primary.email}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:shrink-0">
          {actions.map((a) => (
            <Button key={a.key} variant="outline" size="sm" onClick={a.onClick} className="justify-start lg:justify-center">
              <a.icon className="mr-1.5 h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{a.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
