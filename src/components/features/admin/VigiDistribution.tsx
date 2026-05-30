"use client";

// VigiDistribution — the dashboard's rating hero. Replaces the fake "Rating moyen: BB+".
// Shows the REAL Vigi-Score distribution (A/B/C/D) of completed evaluations as a single
// segmented bar with counts and a plain-language readout. No invented average grade.
import { useMemo } from "react";
import { ShieldCheck } from "lucide-react";
import type { Evaluation } from "@/types/client";
import { AdminCard } from "./ui/admin-card";
import { AdminEmptyState } from "./ui/admin-empty-state";

const GRADES = ["A", "B", "C", "D"] as const;
type Grade = (typeof GRADES)[number];

const FILL: Record<Grade, string> = {
  A: "var(--vigi-a-fill)",
  B: "var(--vigi-b-fill)",
  C: "var(--vigi-c-fill)",
  D: "var(--vigi-d-fill)",
};
const LABEL: Record<Grade, string> = {
  A: "Conforme",
  B: "Progrès attendus",
  C: "Alerte",
  D: "Non conforme",
};

export function VigiDistribution({ evaluations }: { evaluations: Evaluation[] }) {
  const { counts, total } = useMemo(() => {
    const counts: Record<Grade, number> = { A: 0, B: 0, C: 0, D: 0 };
    let total = 0;
    for (const e of evaluations) {
      if (e.status === "completed" && e.vigiScore) {
        counts[e.vigiScore] += 1;
        total += 1;
      }
    }
    return { counts, total };
  }, [evaluations]);

  const today = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  const conformes = counts.A + counts.B;
  const alerte = counts.C + counts.D;

  return (
    <AdminCard className="overflow-hidden">
      {/* top accent rule — the only blue "frame" on the screen */}
      <div className="h-[3px] w-full bg-primary" />
      <div className="px-5 py-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-serif-display text-lg font-semibold text-foreground">
              Notation du portefeuille
            </h2>
            <p className="text-sm text-muted-foreground">
              Répartition Vigi-Score des sites évalués · au {today}
            </p>
          </div>
          <ShieldCheck className="size-5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        </div>

        {total === 0 ? (
          <AdminEmptyState
            icon={ShieldCheck}
            title="Aucune évaluation complétée"
            description="La répartition Vigi-Score s'affichera dès la première notation."
            className="border-0 py-6 shadow-none"
          />
        ) : (
          <>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
              {GRADES.map((g) =>
                counts[g] > 0 ? (
                  <div
                    key={g}
                    style={{ width: `${(counts[g] / total) * 100}%`, backgroundColor: FILL[g] }}
                  />
                ) : null,
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {GRADES.map((g) => (
                <div key={g} className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: FILL[g] }} />
                  <span className="text-sm font-semibold tabular-nums text-foreground">{counts[g]}</span>
                  <span className="text-xs text-muted-foreground">{LABEL[g]}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium tabular-nums text-foreground">{conformes}</span> conformes (A-B) ·{" "}
              <span className="font-medium tabular-nums text-foreground">{alerte}</span> en alerte (C-D) ·{" "}
              <span className="tabular-nums">{total}</span> sites notés
            </p>
          </>
        )}
      </div>
    </AdminCard>
  );
}
