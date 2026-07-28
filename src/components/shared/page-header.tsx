// PageHeader — shared page masthead (admin AND client): serif title (Source Serif 4),
// muted subtitle, and an optional actions slot. Generous vertical rhythm before content.
// Requires the serif font var + tokens to be in scope (.admin-theme / .client-theme).
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        <h1 className="font-serif-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {/* Sous `sm`, les actions passent en pleine largeur plutôt que de comprimer le titre
          — `[&>*]:flex-1` pour que deux boutons se partagent la ligne à parts égales. */}
      {actions && (
        <div className="flex shrink-0 items-center gap-2 [&>*]:flex-1 sm:[&>*]:flex-none">{actions}</div>
      )}
    </div>
  );
}
