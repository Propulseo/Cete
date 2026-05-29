"use client";

import { Users, CalendarClock, Activity, CheckCircle, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { KpiTile } from "../ui/kpi-tile";

interface ClientKpiCardsProps {
  activeCount: number;
  scheduledEvals: number;
  inProgressEvals: number;
  completedEvals: number;
}

const kpis: { key: "kpiActive" | "kpiScheduled" | "kpiInProgress" | "kpiCompleted"; icon: LucideIcon }[] = [
  { key: "kpiActive", icon: Users },
  { key: "kpiScheduled", icon: CalendarClock },
  { key: "kpiInProgress", icon: Activity },
  { key: "kpiCompleted", icon: CheckCircle },
];

export function ClientKpiCards({ activeCount, scheduledEvals, inProgressEvals, completedEvals }: ClientKpiCardsProps) {
  const t = useTranslations("admin.clients.list");
  const values = [activeCount, scheduledEvals, inProgressEvals, completedEvals];

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kpis.map((kpi, i) => (
        <KpiTile key={kpi.key} label={t(kpi.key)} value={values[i]} icon={kpi.icon} />
      ))}
    </div>
  );
}
