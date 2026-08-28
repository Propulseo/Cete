"use client";

// NotationExplainer — educational panel on /client/notation. For a rating agency the score
// is the headline deliverable, so the client gets a plain-language key to the Vigi-Score
// scale (A/B/C/D) and the 3C rule that feeds the composite rating. Domain labels come from
// the shared constants (single source of truth), grades from the shared RatingSeal grammar.
import { useTranslations } from "next-intl";
import { RatingSeal } from "@/components/shared/rating-seal";
import {
  SurfaceCard,
  SurfaceCardHeader,
  SurfaceCardTitle,
  SurfaceCardContent,
} from "@/components/shared/surface-card";
import { VIGI_SCORE_LEVELS, THREE_C_CRITERIA } from "@/lib/constants";

const GRADES = ["A", "B", "C", "D"] as const;

export function NotationExplainer() {
  const t = useTranslations("client.notation");

  return (
    <SurfaceCard>
      <SurfaceCardHeader>
        <SurfaceCardTitle>{t("understandTitle")}</SurfaceCardTitle>
      </SurfaceCardHeader>
      <SurfaceCardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">{t("understandIntro")}</p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Vigi-Score scale */}
          <div className="space-y-3">
            <p className="text-label font-medium uppercase tracking-[0.06em] text-muted-foreground">
              {t("scaleTitle")}
            </p>
            <ul className="space-y-2.5">
              {GRADES.map((grade) => (
                <li key={grade} className="flex items-center gap-3">
                  <RatingSeal value={grade} size="md" showGlyph />
                  <span className="text-sm text-foreground">{VIGI_SCORE_LEVELS[grade].label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* The 3C rule */}
          <div className="space-y-3">
            <p className="text-label font-medium uppercase tracking-[0.06em] text-muted-foreground">
              {t("criteriaTitle")}
            </p>
            <ul className="space-y-2.5">
              {THREE_C_CRITERIA.map((criterion) => (
                <li
                  key={criterion.id}
                  className="rounded-[10px] border border-[var(--admin-line)] bg-muted px-3 py-2"
                >
                  <p className="text-sm font-medium text-foreground">{criterion.short}</p>
                  <p className="text-xs text-muted-foreground">{criterion.full}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SurfaceCardContent>
    </SurfaceCard>
  );
}
