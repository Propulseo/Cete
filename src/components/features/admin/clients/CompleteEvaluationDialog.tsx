"use client";

import { useState, useEffect } from "react";
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

const VIGI_VAR: Record<string, string> = { A: "--vigi-a-fill", B: "--vigi-b-fill", C: "--vigi-c-fill", D: "--vigi-d-fill" };
const GRADES: VigiScoreGrade[] = ["A", "B", "C", "D"];

// Le moteur de calcul assisté (src/lib/rating/) existe et est testé, mais reste
// MASQUÉ tant que CETé n'a pas validé ses règles de notation (plan Tâche 9.1,
// décision du 26/08 : ne rien montrer d'inventé au client ni à l'expert).
// Réintégration prévue : brancher ici computeVigiScore + EXAMPLE_VIGI_SCALE
// remplacés par le barème validé, avec dérogation justifiée.

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

  useEffect(() => {
    if (target) { setVigiScore("B"); setAutoEval("B"); setReqScore("B"); setOpScore("B"); setNotes(""); }
  }, [target]);

  // Note 3C = lettre A–D, éventuellement suivie de + ou − (ex. "B+", "A-").
  const VALID_3C = /^[A-D][+-]?$/;
  const handleConfirm = () => {
    const a = autoEval.trim().toUpperCase();
    const r = reqScore.trim().toUpperCase();
    const o = opScore.trim().toUpperCase();
    if (![a, r, o].every((s) => VALID_3C.test(s))) {
      toast.error("Chaque note 3C doit être une lettre A–D, éventuellement suivie de + ou − (ex. B+).");
      return;
    }
    onSubmit({ vigiScore, omtScore: { autoEvaluation: a, recommandation: r, gestesMetiers: o }, notes });
  };

  return (
    <Dialog open={!!target} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{t("complete")}</DialogTitle></DialogHeader>
        <div className="space-y-4">
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
