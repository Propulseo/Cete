"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, Eye, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import type { Client } from "@/types/client";
import { StatusBadge } from "../ui/status-badge";

interface ClientsTableProps {
  clients: Client[];
  evalCounts: Record<string, number>;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ClientsTable({ clients, evalCounts, onArchive, onDelete }: ClientsTableProps) {
  const t = useTranslations("admin.clients");
  const router = useRouter();

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="overflow-hidden rounded-[10px] border bg-card">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-secondary/50">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">{t("list.colCompany")}</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">{t("list.colSector")}</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">{t("list.colStatus")}</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">{t("list.colEvals")}</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">{t("list.colUpdated")}</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">{t("list.colActions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {clients.map((c) => (
            <tr key={c.id} className="cursor-pointer hover:bg-secondary/30" onClick={() => router.push(`/admin/clients/${c.id}`)}>
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{c.companyName}</p>
                <p className="text-xs text-muted-foreground">{c.address.city} &middot; {c.siret}</p>
              </td>
              <td className="px-4 py-3"><Badge variant="secondary">{t(`sectors.${c.sector}`)}</Badge></td>
              <td className="px-4 py-3"><StatusBadge status={c.status}>{t(`status.${c.status}`)}</StatusBadge></td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{evalCounts[c.id] ?? 0}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{fmtDate(c.updatedAt)}</td>
              <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="relative inline-block">
                  <details className="group">
                    <summary className="list-none"><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></summary>
                    <div className="absolute right-0 z-10 mt-1 w-44 rounded-md border bg-popover py-1 shadow-lg">
                      <button className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/50" onClick={() => router.push(`/admin/clients/${c.id}`)}>
                        <Eye className="h-4 w-4" /> {t("list.view")}
                      </button>
                      <button className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/50" onClick={() => onArchive(c.id)}>
                        <Archive className="h-4 w-4" /> {t("list.archive")}
                      </button>
                      <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-secondary/50" onClick={() => onDelete(c.id)}>
                        <Trash2 className="h-4 w-4" /> {t("list.delete")}
                      </button>
                    </div>
                  </details>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {clients.length === 0 && (
        <div className="p-8 text-center text-sm text-muted-foreground">{t("list.empty")}</div>
      )}
    </div>
  );
}
