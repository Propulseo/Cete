"use client";

import { useEffect, useState } from "react";

const GRADES = ["A", "B", "C", "D"] as const;
// Parcours d'introduction A -> D -> retour, puis stabilisation définitive sur A (index 0).
const SEQUENCE = [1, 2, 3, 2, 1, 0];

/**
 * Sceau Vigi-Score : les 4 pastilles A·B·C·D. Une seule animation d'introduction
 * (autorité tranquille), puis figé sur A. Inerte si l'utilisateur préfère réduire
 * les animations. `aria-hidden` car le sens est porté par le libellé du conteneur.
 */
export function VigiScale({ className }: { className?: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let step = 0;
    const id = window.setInterval(() => {
      setActive(SEQUENCE[step]);
      step += 1;
      if (step >= SEQUENCE.length) window.clearInterval(id);
    }, 900);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={className} aria-hidden="true">
      {GRADES.map((grade, i) => (
        <span
          key={grade}
          className={`vs${i === active ? " is-active" : ""}`}
          data-g={grade}
        >
          {grade}
        </span>
      ))}
    </div>
  );
}
