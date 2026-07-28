"use client";

import { useRouter } from "next/navigation";
import { Eye, Archive, Trash2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import type { Client } from "@/types/client";
import { StatusBadge } from "../ui/status-badge";
import {
  DataTable,
  DataThead,
  DataTh,
  DataTbody,
  DataTr,
  DataTd,
} from "@/components/shared/data-table";
import { RecordCard, RecordCardList } from "@/components/shared/record-card";

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

  if (clients.length === 0) {
    return (
      <div className="rounded-[10px] border border-[var(--admin-line)] bg-card p-8 text-center text-sm text-muted-foreground">
        {t("list.empty")}
      </div>
    );
  }

  // Actions d'une ligne / d'une fiche. Elles remplacent l'ancien menu <details> : celui-ci
  // était positionné en absolu dans une cellule d'un conteneur `overflow-hidden`, donc
  // rogné — inatteignable sur mobile, et coupé pour les dernières lignes sur desktop.
  const rowActions = (c: Client) => (
    <>
      <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/clients/${c.id}`)} aria-label={t("list.view")}>
        <Eye className="h-4 w-4" strokeWidth={1.75} />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onArchive(c.id)} aria-label={t("list.archive")}>
        <Archive className="h-4 w-4" strokeWidth={1.75} />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onDelete(c.id)} aria-label={t("list.delete")}>
        <Trash2 className="h-4 w-4 text-destructive" strokeWidth={1.75} />
      </Button>
    </>
  );

  return (
    <>
      {/* Vue tableau — à partir de lg, là où six colonnes restent lisibles */}
      <div className="hidden lg:block">
        <DataTable>
          <DataThead>
            <tr>
              <DataTh>{t("list.colCompany")}</DataTh>
              <DataTh>{t("list.colSector")}</DataTh>
              <DataTh>{t("list.colStatus")}</DataTh>
              <DataTh>{t("list.colEvals")}</DataTh>
              <DataTh>{t("list.colUpdated")}</DataTh>
              <DataTh className="text-right">{t("list.colActions")}</DataTh>
            </tr>
          </DataThead>
          <DataTbody>
            {clients.map((c) => (
              <DataTr key={c.id} className="cursor-pointer" onClick={() => router.push(`/admin/clients/${c.id}`)}>
                <DataTd>
                  <p className="font-medium text-foreground">{c.companyName}</p>
                  <p className="text-xs text-muted-foreground">{c.address.city} &middot; {c.siret}</p>
                </DataTd>
                <DataTd><Badge variant="secondary">{t(`sectors.${c.sector}`)}</Badge></DataTd>
                <DataTd><StatusBadge status={c.status}>{t(`status.${c.status}`)}</StatusBadge></DataTd>
                <DataTd className="text-sm tabular-nums text-muted-foreground">{evalCounts[c.id] ?? 0}</DataTd>
                <DataTd className="text-sm tabular-nums text-muted-foreground">{fmtDate(c.updatedAt)}</DataTd>
                <DataTd className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">{rowActions(c)}</div>
                </DataTd>
              </DataTr>
            ))}
          </DataTbody>
        </DataTable>
      </div>

      {/* Vue fiches — mobile et tablette */}
      <RecordCardList className="lg:hidden">
        {clients.map((c) => (
          <RecordCard
            key={c.id}
            onActivate={() => router.push(`/admin/clients/${c.id}`)}
            activateLabel={`${t("list.view")} — ${c.companyName}`}
            icon={
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Building2 className="size-4" strokeWidth={1.75} />
              </div>
            }
            title={c.companyName}
            subtitle={`${c.address.city} · ${c.siret}`}
            badges={
              <>
                <StatusBadge status={c.status}>{t(`status.${c.status}`)}</StatusBadge>
                <Badge variant="secondary">{t(`sectors.${c.sector}`)}</Badge>
              </>
            }
            fields={[
              { label: t("list.colEvals"), value: <span className="tabular-nums">{evalCounts[c.id] ?? 0}</span> },
              { label: t("list.colUpdated"), value: <span className="tabular-nums">{fmtDate(c.updatedAt)}</span> },
            ]}
            actions={rowActions(c)}
          />
        ))}
      </RecordCardList>
    </>
  );
}
