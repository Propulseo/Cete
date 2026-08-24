"use client";

// ContactRequestDetail — dialogue de lecture d'une demande. Actions de statut et
// réponse mailto ; aucune logique réseau (le parent porte onStatusChange).

import { Archive, CheckCheck, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ContactRequest, ContactRequestStatus } from "@/types/contact-request";

const KIND_LABEL: Record<ContactRequest["kind"], string> = {
  contact: "Message de contact",
  evaluation: "Demande d'évaluation",
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(iso));
}

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}

interface ContactRequestDetailProps {
  request: ContactRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: ContactRequestStatus) => void;
}

export function ContactRequestDetail({
  request,
  open,
  onOpenChange,
  onStatusChange,
}: ContactRequestDetailProps) {
  if (!request) return null;
  const p = request.payload;

  const mailto = `mailto:${request.email}?subject=${encodeURIComponent("Votre demande auprès de CETé")}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{request.company}</DialogTitle>
          <DialogDescription>
            {KIND_LABEL[request.kind]} · {formatDate(request.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <Field label="Nom" value={request.name} />
          <Field label="Téléphone" value={request.phone} />
          <div className="sm:col-span-2">
            <dt className="text-xs text-muted-foreground">Email</dt>
            <dd className="text-sm">
              <a href={mailto} className="text-primary underline-offset-4 hover:underline">
                {request.email}
              </a>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <Field label="Sujet" value={request.subject} />
          </div>
          <div className="sm:col-span-2">
            <Field label="Message" value={request.message} />
          </div>
        </dl>

        {request.kind === "evaluation" && p && (
          <div className="rounded-[10px] border border-[var(--admin-line)] bg-secondary/40 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Détails de l&apos;évaluation
            </p>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              <Field label="Fonction du contact" value={p.contactRole} />
              <Field label="SIREN" value={p.siren} />
              <Field label="Secteur" value={p.sector} />
              <Field label="Effectif" value={p.employees} />
              <Field label="Type d'évaluation" value={p.evaluationType} />
              <Field label="Sites concernés" value={p.sites} />
              <div className="sm:col-span-2">
                <Field label="Précisions" value={p.details} />
              </div>
            </dl>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" asChild>
            <a href={mailto}>
              <Mail strokeWidth={1.75} className="mr-2 size-4" />
              Répondre
            </a>
          </Button>
          {request.status !== "archived" && (
            <Button
              variant="ghost"
              onClick={() => onStatusChange(request.id, "archived")}
            >
              <Archive strokeWidth={1.75} className="mr-2 size-4" />
              Archiver
            </Button>
          )}
          {request.status === "new" && (
            <Button onClick={() => onStatusChange(request.id, "handled")}>
              <CheckCheck strokeWidth={1.75} className="mr-2 size-4" />
              Marquer traitée
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
