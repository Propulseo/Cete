// KpiTile — a "ledger stat" shared by admin and client: uppercase eyebrow label, large
// tabular value, and a tokenised trend indicator (no hardcoded text-green-500/red-500).
// De-emphasised monochrome icon, no coloured backing plate.
import * as React from "react";
import { ArrowUpRight, ArrowDownRight, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiTileProps {
  label: string;
  value: React.ReactNode;
  trend?: string; // "+12%", "stable", "-3%"
  icon?: LucideIcon;
  className?: string;
}

export function KpiTile({ label, value, trend, icon: Icon, className }: KpiTileProps) {
  const up = trend?.startsWith("+");
  const down = trend?.startsWith("-");
  const TrendIcon = up ? ArrowUpRight : down ? ArrowDownRight : Minus;
  const trendColor = up ? "text-admin-pos" : down ? "text-admin-neg" : "text-admin-stable";

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-[10px] border border-[var(--admin-line)] bg-card px-5 py-4",
        "shadow-[var(--surface-shadow)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-label font-medium uppercase tracking-[0.06em] text-muted-foreground">
          {label}
        </span>
        {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />}
      </div>
      <div className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">{value}</div>
      {trend && (
        <div className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}>
          <TrendIcon className="size-3.5" strokeWidth={2} />
          <span className="tabular-nums">{trend}</span>
        </div>
      )}
    </div>
  );
}
