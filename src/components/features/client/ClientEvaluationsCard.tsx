"use client";

import { useEffect, useState } from "react";
import { CalendarClock, MapPin } from "lucide-react";
import { useLocale } from "next-intl";
import { listEvaluationsByClientId } from "@/lib/repo/evaluations.repo";
import type { Evaluation } from "@/types/client";
import {
  SurfaceCard,
  SurfaceCardHeader,
  SurfaceCardTitle,
  SurfaceCardContent,
} from "@/components/shared/surface-card";
import { RatingSeal, CompositeRating } from "@/components/shared/rating-seal";

const STATUS_LABEL: Record<Evaluation["status"], string> = {
  scheduled: "Planifiée",
  in_progress: "En cours",
  completed: "Réalisée",
  cancelled: "Annulée",
};

/** Liste des évaluations du client (visite, statut, note). RLS : le client ne voit que les siennes. */
export function ClientEvaluationsCard({ clientId }: { clientId: string }) {
  const locale = useLocale();
  const dateLocale = locale === "fr" ? "fr-FR" : "en-GB";
  const [evals, setEvals] = useState<Evaluation[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listEvaluationsByClientId(clientId)
      .then((e) => { if (!cancelled) { setEvals(e.sort((a, b) => b.visitDate.localeCompare(a.visitDate))); } })
      .catch(() => { if (!cancelled) setEvals([]); })
      .finally(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, [clientId]);

  if (loaded && evals.length === 0) return null;

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(dateLocale, { day: "numeric", month: "short", year: "numeric" });

  return (
    <SurfaceCard>
      <SurfaceCardHeader>
        <SurfaceCardTitle>Mes évaluations</SurfaceCardTitle>
      </SurfaceCardHeader>
      <SurfaceCardContent className="space-y-3">
        {evals.map((ev) => (
          <div
            key={ev.id}
            className="flex items-center gap-4 rounded-lg border border-[var(--admin-line)] p-3"
          >
            {ev.vigiScore ? (
              <RatingSeal value={ev.vigiScore} size="lg" />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 text-[10px] text-muted-foreground">
                N/A
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">{ev.siteName}</p>
              <p className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><CalendarClock className="size-3" strokeWidth={1.75} />{fmt(ev.visitDate)}</span>
                <span className="hidden items-center gap-1 sm:flex"><MapPin className="size-3" strokeWidth={1.75} />{ev.siteAddress}</span>
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-xs font-medium text-muted-foreground">{STATUS_LABEL[ev.status]}</span>
              {ev.compositeRating && <CompositeRating value={ev.compositeRating} />}
            </div>
          </div>
        ))}
      </SurfaceCardContent>
    </SurfaceCard>
  );
}
