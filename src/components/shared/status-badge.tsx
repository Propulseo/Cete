// StatusBadge — tokenised status pill shared across admin AND client entities (documents,
// evaluations, certificates, articles...). A neutral pill + a coloured dot whose tone comes
// from admin tokens — no raw Tailwind palette. Pass `status` for the built-in mapping, or `tone`.
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StatusTone = "pos" | "warn" | "info" | "neutral";

const DOT: Record<StatusTone, string> = {
  pos: "bg-admin-pos",
  warn: "bg-admin-urgent",
  info: "bg-primary",
  neutral: "bg-admin-stable",
};

const TONE_BY_STATUS: Record<string, StatusTone> = {
  // positive / done
  active: "pos",
  completed: "pos",
  published: "pos",
  signed: "pos",
  valide: "pos",
  // informational / upcoming
  onboarding: "info",
  scheduled: "info",
  sent: "info",
  // attention / in flight
  paused: "warn",
  in_progress: "warn",
  draft: "warn",
  pending: "warn",
  expire: "warn",
  // muted / closed
  archived: "neutral",
  cancelled: "neutral",
  inactive: "neutral",
  revoque: "neutral",
};

export function statusTone(status: string): StatusTone {
  return TONE_BY_STATUS[status] ?? "neutral";
}

interface StatusBadgeProps {
  status?: string;
  tone?: StatusTone;
  children: ReactNode;
  className?: string;
}

export function StatusBadge({ status, tone, children, className }: StatusBadgeProps) {
  const t = tone ?? statusTone(status ?? "");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground",
        className,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", DOT[t])} />
      {children}
    </span>
  );
}
