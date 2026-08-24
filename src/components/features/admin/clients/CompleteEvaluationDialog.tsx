"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CompositeRating } from "@/components/features/admin/ui/rating-seal";
import type { Evaluation, VigiScoreGrade } from "@/types/client";
import type { ThreeCScore } from "@/types/shared";
import {
  computeVigiScore,
  type VigiDimension,
  type VigiScoreInputs,
} from "@/lib/rating/vigi-score";
import { EXAMPLE_VIGI_SCALE } from "@/lib/rating/vigi-scale-default";

const VIGI_VAR: Record<string, string> = { A: "--vigi-a-fill", B: "--vigi-b-fill", C: "--vigi-c-fill", D: "--vigi-d-fill" };
const GRADES: VigiScoreGrade[] = ["A", "B", "C", "D"];
const DIMENSION_LABEL: Record<VigiDimension, string> = {
  O: "Organisation (O)",
  M: "Maîtrise (M)",
  T: "Terrain (T)",
};

export interface CompleteResult {
  vigiScore: VigiScoreGrade;
  omtScore: ThreeCScore;
  notes: string;
}

interface CompleteEvaluationDialogProps {
  target: Evaluation | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (result: CompleteResult) => void;
}

/** Saisie de la note (Vigi-Score + 3C) à la clôture d'une évaluation. */
export function CompleteEvaluationDialog({ target, onOpenChange, onSubmit }: CompleteEvaluationDialogProps) {
  const t = useTranslations("admin.clients.evaluations");
  const [vigiScore, setVigiScore] = useState<VigiScoreGrade>("B");
  const [autoEval, setAutoEval] = useState("B");
  const [reqScore, setReqScore] = useState("B");
  const [opScore, setOpScore] = useState("B");
  const [notes, setNotes] = useState("");
  // Moule paramétrique : valeurs saisies critère par critère (texte brut, parsé ensuite).
  const [criteriaValues, setCriteriaValues] = useState<Record<string, string>>({});
  const [overrideReason, setOverrideReason] = useState("");

  useEffect(() => {
    if (target) {
      setVigiScore("B"); setAutoEval("B"); setReqScore("B"); setOpScore("B");
      setNotes(""); setCriteriaValues({}); setOverrideReason("");
    }
  }, [target]);

  const computed = useMemo(() => {
    const inputs: VigiScoreInputs = {};
    for (const c of EXAMPLE_VIGI_SCALE.criteria) {
      const raw = criteriaValues[c.id]?.trim();
      if (raw === undefined || raw === "") { inputs[c.id] = null; continue; }
      const n = Number(raw);
      inputs[c.id] = Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : null;
    }
    return computeVigiScore(EXAMPLE_VIGI_SCALE, inputs);
  }, [criteriaValues]);

  // Dérogation : l'expert garde le dernier mot, mais il doit dire pourquoi.
  const overrideNeeded =
    computed.vigiScore !== null && !computed.incomplete && vigiScore !== computed.vigiScore;

  // Note 3C = lettre A–D, éventuellement suivie de + ou − (ex. "B+", "A-").
  const VALID_3C = /^[A-D][+-]?$/;
  const handleConfirm = () => {
    if (overrideNeeded && !overrideReason.trim()) {
      toast.error("Note différente du calcul assisté : indiquez la justification de la dérogation.");
      return;
    }
    const a = autoEval.trim().toUpperCase();
    const r = reqScore.trim().toUpperCase();
    const o = opScore.trim().toUpperCase();
    if (![a, r, o].every((s) => VALID_3C.test(s))) {
      toast.error("Chaque note 3C doit être une lettre A–D, éventuellement suivie de + ou − (ex. B+).");
      return;
    }
    const finalNotes = overrideNeeded
      ? `${notes}${notes ? "\n" : ""}[Dérogation au calcul assisté : ${overrideReason.trim()}]`
      : notes;
    onSubmit({ vigiScore, omtScore: { autoEvaluation: a, recommandation: r, gestesMetiers: o }, notes: finalNotes });
  };

  const renderCriterionInput = (criterionId: string) => {
    const criterion = EXAMPLE_VIGI_SCALE.criteria.find((c) => c.id === criterionId);
    if (!criterion) return null;
    return (
      <div key={criterion.id} className="space-y-1">
        <Label className="text-xs">{criterion.label ?? criterion.id}</Label>
        <Input
          type="number"
          min={0}
          max={100}
          inputMode="numeric"
          placeholder="0-100"
          value={criteriaValues[criterion.id] ?? ""}
          onChange={(e) => setCriteriaValues((p) => ({ ...p, [criterion.id]: e.target.value }))}
        />
      </div>
    );
  };

  return (
    <Dialog open={!!target} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader><DialogTitle>{t("complete")}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          {/* Calcul assisté — moule paramétrique. Le barème est PROVISOIRE tant que
              les règles CETé n'ont pas été validées (cf. vigi-scale-default.ts). */}
          <div className="space-y-3 rounded-lg border border-dashed border-muted p-3">
            <p className="text-xs font-medium text-muted-foreground">
              Calcul assisté — barème provisoire, en attente de validation CETé
            </p>
            {(Object.keys(DIMENSION_LABEL) as VigiDimension[]).map((dim) => (
              <div key={dim} className="space-y-2">
                <p className="text-xs font-semibold text-foreground">{DIMENSION_LABEL[dim]}</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {EXAMPLE_VIGI_SCALE.criteria.filter((c) => c.dimension === dim).map((c) => renderCriterionInput(c.id))}
                </div>
                <p className="text-xs text-muted-foreground tabular-nums">
                  Score {dim} : {computed[dim.toLowerCase() as "o" | "m" | "t"] ?? "—"}
                  {computed.grades[dim] ? ` → ${computed.grades[dim]}` : ""}
                </p>
              </div>
            ))}
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                Note calculée :{" "}
                <span className="font-bold text-foreground">{computed.vigiScore ?? "incomplète"}</span>
                {computed.cappedBy.length > 0 && " (plafonnée par manquement)"}
              </p>
              <Button
                variant="secondary"
                size="sm"
                disabled={computed.incomplete || computed.vigiScore === null}
                onClick={() => computed.vigiScore && setVigiScore(computed.vigiScore)}
              >
                Appliquer
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("vigiScore")}</Label>
            <div className="flex gap-2">
              {GRADES.map((g) => {
                const selected = vigiScore === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setVigiScore(g)}
                    style={selected ? { backgroundColor: `var(${VIGI_VAR[g]})`, borderColor: `var(${VIGI_VAR[g]})`, color: "#fff" } : undefined}
                    className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-lg font-bold transition-all ${selected ? "ring-2 ring-primary ring-offset-1" : "border-muted text-foreground hover:bg-accent"}`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Trois notes très courtes (« B+ ») : elles tiennent côte à côte même à 360px,
              on garde donc grid-cols-3 et on resserre seulement la gouttière. */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="space-y-2"><Label className="text-xs">{t("autoEval")}</Label><Input value={autoEval} onChange={(e) => setAutoEval(e.target.value)} placeholder="B+" autoCapitalize="characters" /></div>
            <div className="space-y-2"><Label className="text-xs">{t("requirements")}</Label><Input value={reqScore} onChange={(e) => setReqScore(e.target.value)} placeholder="A-" autoCapitalize="characters" /></div>
            <div className="space-y-2"><Label className="text-xs">{t("operational")}</Label><Input value={opScore} onChange={(e) => setOpScore(e.target.value)} placeholder="B" autoCapitalize="characters" /></div>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg bg-secondary/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">{t("compositeRating")}</p>
            <CompositeRating value={`${autoEval[0] ?? ""}${reqScore[0] ?? ""}${opScore[0] ?? ""}`} labels />
          </div>
          {overrideNeeded && (
            <div className="space-y-2 rounded-lg border border-[var(--admin-line)] bg-secondary/60 p-3">
              <Label className="text-xs">Justification de la dérogation (obligatoire)</Label>
              <Textarea rows={2} value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} />
            </div>
          )}
          <div className="space-y-2"><Label>{t("notes")}</Label><Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button onClick={handleConfirm}>{t("complete")}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
