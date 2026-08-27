"use client";

// ContactRequestTable — présentation pure : aucune requête réseau, tout vient du parent.

import {
  DataTable,
  DataThead,
  DataTh,
  DataTbody,
  DataTr,
  DataTd,
} from "@/components/shared/data-table";
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge";
import { MailWarning } from "lucide-react";
import type { ContactRequest, ContactRequestStatus } from "@/types/contact-request";

const KIND_LABEL: Record<ContactRequest["kind"], string> = {
  contact: "Message",
  evaluation: "Évaluation",
};

const STATUS_LABEL: Record<ContactRequestStatus, string> = {
  new: "Nouvelle",
  handled: "Traitée",
  archived: "Archivée",
};

const STATUS_TONE: Record<ContactRequestStatus, StatusTone> = {
  new: "warn",
  handled: "pos",
  archived: "neutral",
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

interface ContactRequestTableProps {
  requests: ContactRequest[];
  onSelect: (request: ContactRequest) => void;
}

export function ContactRequestTable({ requests, onSelect }: ContactRequestTableProps) {
  return (
    <DataTable>
      <DataThead>
        <DataTr>
          <DataTh>Date</DataTh>
          <DataTh>Type</DataTh>
          <DataTh>Société</DataTh>
          <DataTh>Contact</DataTh>
          <DataTh>Statut</DataTh>
        </DataTr>
      </DataThead>
      <DataTbody>
        {requests.map((r) => (
          <DataTr key={r.id} onClick={() => onSelect(r)} className="cursor-pointer">
            <DataTd className="tabular-nums whitespace-nowrap text-muted-foreground">
              <span className="flex items-center gap-2">
                {r.status === "new" && (
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-admin-urgent" />
                )}
                {formatDate(r.createdAt)}
              </span>
            </DataTd>
            <DataTd className="whitespace-nowrap">{KIND_LABEL[r.kind]}</DataTd>
            <DataTd className="font-medium">{r.company}</DataTd>
            <DataTd>
              <span className="block">{r.name}</span>
              <span className="block text-xs text-muted-foreground">{r.email}</span>
            </DataTd>
            <DataTd className="whitespace-nowrap">
              <span className="inline-flex items-center gap-1.5">
                <StatusBadge tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</StatusBadge>
                {!r.emailSent && r.emailError && (
                  <span title={`Notification email non envoyée : ${r.emailError}`}>
                    <MailWarning className="size-4 text-admin-urgent" aria-hidden />
                  </span>
                )}
              </span>
            </DataTd>
          </DataTr>
        ))}
      </DataTbody>
    </DataTable>
  );
}
