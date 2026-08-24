import { describe, expect, it } from "vitest";
import {
  computeVigiScore,
  type VigiScoreConfig,
} from "./vigi-score";

/**
 * Tests de la MÉCANIQUE de notation (moule paramétrique), avec un barème d'exemple
 * explicitement provisoire. Quand les règles CETé arriveront, seule la config
 * change — ces tests restent la spécification du moteur.
 */

const config: VigiScoreConfig = {
  criteria: [
    { id: "o1", dimension: "O", weight: 60 },
    { id: "o2", dimension: "O", weight: 40 },
    { id: "m1", dimension: "M", weight: 100 },
    { id: "t1", dimension: "T", weight: 100 },
    // Critère éliminatoire : en dessous de 40, plafonne la note globale à C.
    {
      id: "secu",
      dimension: "T",
      weight: 0,
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

const all = (values: Record<string, number>) => values as never;

describe("computeVigiScore — moyenne pondérée par dimension", () => {
  it("calcule O = 60×85 + 40×55 = 73 → B", () => {
    const r = computeVigiScore(config, all({ o1: 85, o2: 55, m1: 70, t1: 70, secu: 90 }));
    expect(r.o).toBe(73);
    expect(r.grades.O).toBe("B");
  });

  it("gère des poids non normalisés (somme ≠ 100)", () => {
    const r = computeVigiScore(config, all({ o1: 100, o2: 50, m1: 50, t1: 50, secu: 90 }));
    // 100×0.6 + 50×0.4 = 80
    expect(r.o).toBe(80);
  });
});

describe("computeVigiScore — règle composite", () => {
  it("worst-of : la plus mauvaise des trois dimensions commande", () => {
    const r = computeVigiScore(config, all({ o1: 90, o2: 90, m1: 90, t1: 30, secu: 90 }));
    expect(r.vigiScore).toBe("D");
  });

  it("worst-of : toutes bonnes → A", () => {
    const r = computeVigiScore(config, all({ o1: 95, o2: 95, m1: 85, t1: 80, secu: 90 }));
    expect(r.vigiScore).toBe("A");
  });
});

describe("computeVigiScore — seuils et cas limites", () => {
  it("un score exactement sur un seuil prend la note du dessus", () => {
    const r = computeVigiScore(config, all({ o1: 100, o2: 100, m1: 100, t1: 60, secu: 90 }));
    // t = 60 → limite exacte B
    expect(r.grades.T).toBe("B");
  });
});

describe("computeVigiScore — critères éliminatoires", () => {
  it("plafonne la note globale malgré une bonne moyenne", () => {
    const r = computeVigiScore(config, all({ o1: 95, o2: 95, m1: 95, t1: 95, secu: 35 }));
    expect(r.cappedBy).toContain("secu");
    expect(r.vigiScore).toBe("C");
  });
});

describe("computeVigiScore — critères manquants", () => {
  it("incomplete=true et pas de note tant qu'un critère manque", () => {
    const r = computeVigiScore(config, { o1: 80, o2: null, m1: 70, t1: 70, secu: 90 } as never);
    expect(r.incomplete).toBe(true);
    expect(r.vigiScore).toBeNull();
  });

  it("le critère éliminatoire manquant rend aussi le calcul incomplet", () => {
    const r = computeVigiScore(config, { o1: 80, o2: 80, m1: 70, t1: 70 } as never);
    expect(r.incomplete).toBe(true);
    expect(r.vigiScore).toBeNull();
  });
});
