// BARÈME PROVISOIRE — NE PAS PRODUIRE AVEC CE FICHIER EN L'ÉTAT.
//
// Les règles de calcul du Vigi-Score appartiennent à CETé (Tâche 9.1 du plan :
// 6 questions fermées posées au client). Tant que `RULES_VALIDATED_BY_CLIENT`
// vaut false, le garde-fou `lint-placeholders` interdit tout build de production
// pointant sur le domaine réel. Quand les règles arrivent : remplacer la config,
// passer le flag à true avec la référence du doc de validation.

import type { VigiScoreConfig } from "./vigi-score";

export const RULES_VALIDATED_BY_CLIENT = false;

/** Barème d'EXEMPLE : démontre la mécanique, ne reflète aucune règle CETé. */
export const EXAMPLE_VIGI_SCALE: VigiScoreConfig = {
  criteria: [
    { id: "o1", dimension: "O", weight: 60, label: "Organisation — processus documentés" },
    { id: "o2", dimension: "O", weight: 40, label: "Organisation — compétences internes" },
    { id: "m1", dimension: "M", weight: 100, label: "Maîtrise — exigences du métier" },
    { id: "t1", dimension: "T", weight: 100, label: "Terrain — réalisations" },
    {
      id: "secu",
      dimension: "T",
      weight: 0,
      label: "Manquement sécurité majeur (0-39 = éliminatoire)",
      eliminatoryBelow: 40,
      capIfFailed: "C",
    },
  ],
  compositeRule: "worst-of",
  scale: [
    { min: 80, grade: "A" },
    { min: 60, grade: "B" },
    { min: 40, grade: "C" },
    { min: 0, grade: "D" },
  ],
};
