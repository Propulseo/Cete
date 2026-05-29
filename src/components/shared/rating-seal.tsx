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
    ? { backgroundColor: TINT[grade], color: FILL[grade], boxShadow: `inset 0 0 0 1px ${FILL[grade]}` }
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
          style={{ color: FILL[grade] }}
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

// CompositeRating — the triple-letter compositeRating rendered as three connected
// seal cells (one colour per 3-C dimension), optionally captioned with the canonical labels.
export function CompositeRating({ value, labels = false, className }: CompositeRatingProps) {
  const letters = value.trim().toUpperCase().split("").slice(0, 3);
  return (
    <div className={cn("inline-flex flex-col gap-1", className)}>
      <div className="inline-flex overflow-hidden rounded-md ring-1 ring-[var(--admin-line)]">
        {letters.map((l, i) => {
          const grade = gradeOf(l);
          return (
            <span
              key={i}
              title={THREE_C[i]}
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
      {labels && (
        <div className="grid grid-cols-3 gap-1 text-[9px] uppercase tracking-wide text-muted-foreground">
          {THREE_C.map((c) => (
            <span key={c} className="text-center leading-tight">
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
