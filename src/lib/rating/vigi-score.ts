// Moteur de notation Vigi-Score — fonction PURE, aucune I/O, aucun Supabase.
// Moule paramétrique : la mécanique est figée et testée ; le BARÈME (critères,
// poids, seuils) vit dans une configuration injectée. Tant que les règles CETé
// n'ont pas été validées par écrit par le client, seule la config d'exemple
// marquée « non définitive » existe (cf. vigi-scale-default.ts).

import type { VigiScoreGrade } from "@/types/client";

export type VigiDimension = "O" | "M" | "T";

export interface VigiScoreCriterion {
  id: string;
  dimension: VigiDimension;
  /** Poids dans la moyenne de sa dimension — la somme n'a pas besoin de faire 100. */
  weight: number;
  /** Libellé affiché à l'expert dans la saisie structurée. */
  label?: string;
  /** Si renseigné : une valeur STRICTEMENT en dessous plafonne la note globale. */
  eliminatoryBelow?: number;
  /** Plafond appliqué en cas d'échec éliminatoire. */
  capIfFailed?: VigiScoreGrade;
}

export interface VigiScaleThreshold {
  /** Premier palier atteint : score >= min → grade (liste triée descendante). */
  min: number;
  grade: VigiScoreGrade;
}

export interface VigiScoreConfig {
  criteria: VigiScoreCriterion[];
  /** worst-of : la plus mauvaise dimension commande. numeric-mean : moyenne des scores. */
  compositeRule: "worst-of" | "numeric-mean";
  scale: VigiScaleThreshold[];
}

/** Valeurs saisies par l'expert, critère par critère, sur 0-100. */
export type VigiScoreInputs = Record<string, number | null | undefined>;

export interface VigiScoreResult {
  o: number | null;
  m: number | null;
  t: number | null;
  grades: { O: VigiScoreGrade | null; M: VigiScoreGrade | null; T: VigiScoreGrade | null };
  vigiScore: VigiScoreGrade | null;
  /** Ids des critères éliminatoires ayant plafonné la note globale. */
  cappedBy: string[];
  incomplete: boolean;
}

const DIMENSIONS: VigiDimension[] = ["O", "M", "T"];
const GRADE_ORDER: VigiScoreGrade[] = ["A", "B", "C", "D"];

function scoreToGrade(score: number, scale: VigiScaleThreshold[]): VigiScoreGrade {
  const sorted = [...scale].sort((a, b) => b.min - a.min);
  for (const step of sorted) {
    if (score >= step.min) return step.grade;
  }
  return sorted[sorted.length - 1].grade;
}

function worseOf(a: VigiScoreGrade, b: VigiScoreGrade): VigiScoreGrade {
  return GRADE_ORDER.indexOf(a) >= GRADE_ORDER.indexOf(b) ? a : b;
}

function averageCriteria(
  criteria: VigiScoreCriterion[],
  inputs: VigiScoreInputs
): number | null {
  let weighted = 0;
  let weights = 0;
  for (const c of criteria) {
    if (c.weight <= 0) continue; // les éliminatoires purs ne notent pas leur dimension
    const v = inputs[c.id];
    if (v === null || v === undefined) return null;
    weighted += v * c.weight;
    weights += c.weight;
  }
  if (weights === 0) return null;
  return Math.round(weighted / weights);
}

/**
 * Calcule la note complète à partir des valeurs de critères. Renvoie
 * `incomplete: true` et `vigiScore: null` tant qu'un critère requis manque.
 */
export function computeVigiScore(
  config: VigiScoreConfig,
  inputs: VigiScoreInputs
): VigiScoreResult {
  const result: VigiScoreResult = {
    o: null,
    m: null,
    t: null,
    grades: { O: null, M: null, T: null },
    vigiScore: null,
    cappedBy: [],
    incomplete: false,
  };

  const dimensionScores: Partial<Record<VigiDimension, number>> = {};
  for (const dim of DIMENSIONS) {
    const criteria = config.criteria.filter((c) => c.dimension === dim);
    // Une dimension sans critère pondéré est incomplète par construction.
    if (criteria.length === 0 || !criteria.some((c) => c.weight > 0)) {
      result.incomplete = true;
      continue;
    }
    const score = averageCriteria(criteria, inputs);
    if (score === null) {
      result.incomplete = true;
      continue;
    }
    dimensionScores[dim] = score;
    result[dim.toLowerCase() as "o" | "m" | "t"] = score;
    result.grades[dim] = scoreToGrade(score, config.scale);
  }

  // Échec éliminatoire : indépendant du calcul moyen, mais exige la valeur.
  let cap: VigiScoreGrade | null = null;
  for (const c of config.criteria) {
    if (c.eliminatoryBelow === undefined || !c.capIfFailed) continue;
    const v = inputs[c.id];
    if (v === null || v === undefined) {
      result.incomplete = true;
      continue;
    }
    if (v < c.eliminatoryBelow) {
      cap = cap ? worseOf(cap, c.capIfFailed) : c.capIfFailed;
      result.cappedBy.push(c.id);
    }
  }

  if (result.incomplete) return result;

  const dims = DIMENSIONS.map((d) => dimensionScores[d]).filter(
    (s): s is number => s !== undefined
  );
  const composite =
    config.compositeRule === "worst-of"
      ? Math.min(...dims)
      : Math.round(dims.reduce((a, b) => a + b, 0) / dims.length);

  let grade = scoreToGrade(composite, config.scale);
  if (cap) grade = worseOf(grade, cap);
  result.vigiScore = grade;
  return result;
}
