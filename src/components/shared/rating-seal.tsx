// RatingSeal — the CETé Vigi-Score visual grammar (A/B/C/D), reusable everywhere
// (admin AND client). Sizes: inline-sm | md | lg | hero. The small variant uses a tinted
// background with a colored letter for legibility; md+ use a solid "struck seal" fill with
// white letter. Each grade carries a redundant Lucide glyph (opt-in) so meaning never
// depends on color alone — important for an agency that prints rating reports.
// Reads --vigi-* tokens, defined in both .admin-theme and .client-theme scopes (globals.css).
import * as React from "react";
import { CheckCircle2, TrendingUp, AlertTriangle, OctagonX } from "lucide-react";
import { cn } from "@/lib/utils";
import { THREE_C_CRITERIA } from "@/lib/constants";

export type VigiGrade = "A" | "B" | "C" | "D";

const GRADE_GLYPH: Record<VigiGrade, React.ElementType> = {
  A: CheckCircle2,
  B: TrendingUp,
  C: AlertTriangle,
  D: OctagonX,
};

const GRADE_LABEL: Record<VigiGrade, string> = {
  A: "Conforme — vigilance forte",
  B: "Des progrès sont attendus",
  C: "Alerte",
  D: "Non conforme — risque critique",
};

// CSS custom properties defined in the .admin-theme / .client-theme scopes (globals.css).
const FILL: Record<VigiGrade, string> = {
  A: "var(--vigi-a-fill)",
  B: "var(--vigi-b-fill)",
  C: "var(--vigi-c-fill)",
  D: "var(--vigi-d-fill)",
};
const TINT: Record<VigiGrade, string> = {
  A: "var(--vigi-a-tint)",
  B: "var(--vigi-b-tint)",
  C: "var(--vigi-c-tint)",
  D: "var(--vigi-d-tint)",
};
// Letter/ring/glyph ink. Equals -fill in light mode (small seals render identically), but is
// brightened in dark mode (globals.css) so the colored letter + the redundant glyph stay
// legible on the dark tint / dark card instead of being a dark hue on a dark surface.
const INK: Record<VigiGrade, string> = {
  A: "var(--vigi-a-ink)",
  B: "var(--vigi-b-ink)",
  C: "var(--vigi-c-ink)",
  D: "var(--vigi-d-ink)",
};

const SIZE = {
  "inline-sm": "h-[22px] min-w-[22px] px-1 text-[11px] rounded-[5px]",
  md: "h-7 min-w-7 px-1.5 text-sm rounded-md",
  lg: "h-10 min-w-10 px-2 text-lg rounded-lg",
  hero: "h-16 min-w-16 px-3 text-4xl rounded-xl",
} as const;
type SealSize = keyof typeof SIZE;

function gradeOf(value: string): VigiGrade {
  const c = value.trim().charAt(0).toUpperCase();
  return (["A", "B", "C", "D"].includes(c) ? c : "D") as VigiGrade;
}

/** Libellé métier d'une note (ex. "B" → "Des progrès sont attendus"). */
export function vigiGradeLabel(value: string): string {
  return GRADE_LABEL[gradeOf(value)];
}

interface RatingSealProps {
  value: string; // "A", "B+", "C-", "D"
  size?: SealSize;
  showGlyph?: boolean;
  serif?: boolean;
  className?: string;
}

export function RatingSeal({ value, size = "md", showGlyph, serif, className }: RatingSealProps) {
  const grade = gradeOf(value);
  const modifier = value.trim().slice(1);
  const small = size === "inline-sm";
  const Glyph = GRADE_GLYPH[grade];
  const withGlyph = showGlyph ?? size === "hero";

  const style: React.CSSProperties = small
    ? { backgroundColor: TINT[grade], color: INK[grade], boxShadow: `inset 0 0 0 1px ${INK[grade]}` }
    : {
        backgroundColor: FILL[grade],
        color: "var(--vigi-fg, #fff)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
      };

  return (
    <span
      role="img"
      aria-label={`Vigi-Score ${value} — ${GRADE_LABEL[grade]}`}
      title={GRADE_LABEL[grade]}
      style={style}
      className={cn(
        "relative inline-flex items-center justify-center font-semibold tabular-nums leading-none select-none",
        SIZE[size],
        serif && size === "hero" && "font-serif-display",
        className,
      )}
    >
      <span>
        {grade}
        {modifier && <sup className="ml-px align-super text-[0.5em] font-medium">{modifier}</sup>}
      </span>
      {withGlyph && (
        <Glyph
          aria-hidden
          strokeWidth={2}
          style={{ color: INK[grade] }}
          className={cn(
            "absolute -right-1 -top-1 rounded-full bg-card p-px",
            size === "hero" ? "size-4" : "size-3",
          )}
        />
      )}
    </span>
  );
}

const THREE_C = THREE_C_CRITERIA.map((c) => c.short);

interface CompositeRatingProps {
  value: string; // triple-letter, e.g. "BAB", "AAA", "CCB"
  labels?: boolean;
  className?: string;
}

// CompositeRating — the triple-letter compositeRating (one colour per 3-C dimension).
// Two layouts:
//  • default (labels=false): three connected seal cells — compact, for tables/lists/dashboards.
//  • labels=true: each dimension as a seal directly ABOVE its canonical label, column-aligned,
//    so each letter clearly maps to its criterion (used on the certificate "Notation globale").
export function CompositeRating({ value, labels = false, className }: CompositeRatingProps) {
  const letters = value.trim().toUpperCase().split("").slice(0, 3);

  if (!labels) {
    return (
      <div
        className={cn(
          "inline-flex w-fit overflow-hidden rounded-md ring-1 ring-[var(--admin-line)]",
          className,
        )}
      >
        {letters.map((l, i) => {
          const grade = gradeOf(l);
          return (
            <span
              key={i}
              title={`${THREE_C[i]} — ${GRADE_LABEL[grade]}`}
              style={{ backgroundColor: FILL[grade], color: "var(--vigi-fg,#fff)" }}
              className={cn(
                "flex h-7 w-8 items-center justify-center text-sm font-semibold tabular-nums",
                i > 0 && "border-l border-white/30",
              )}
            >
              {grade}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("grid w-fit grid-cols-3 gap-x-2", className)}>
      {letters.map((l, i) => {
        const grade = gradeOf(l);
        return (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span
              title={`${THREE_C[i]} — ${GRADE_LABEL[grade]}`}
              style={{
                backgroundColor: FILL[grade],
                color: "var(--vigi-fg,#fff)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
              }}
              className="flex size-9 items-center justify-center rounded-md text-base font-semibold tabular-nums"
            >
              {grade}
            </span>
            <span className="max-w-[5.5rem] text-center text-[9px] font-medium uppercase leading-tight tracking-wide text-muted-foreground">
              {THREE_C[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
