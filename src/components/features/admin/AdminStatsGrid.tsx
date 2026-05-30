"use client";

import { Users, CheckCircle, Award, Star, type LucideIcon } from "lucide-react";
import { KpiTile } from "./ui/kpi-tile";
import type { AdminStats } from "@/types/stats";

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  "check-circle": CheckCircle,
  award: Award,
  star: Star,
};

export function AdminStatsGrid({ stats }: { stats: AdminStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.stats.map((stat) => (
        <KpiTile
          key={stat.id}
          label={stat.label}
          value={stat.value}
          trend={stat.trend}
          icon={ICONS[stat.icon]}
        />
      ))}
    </div>
  );
}
