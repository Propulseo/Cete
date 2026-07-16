"use client";

import { useTranslations } from "next-intl";
import { VigiScale } from "./VigiScale";
import { TrustChips } from "./login-trust";

/** Panneau marque (colonne de gauche, desktop). Purement présentationnel. */
export function LoginBrandPanel() {
  const t = useTranslations("connexion.brand");
  return (
    <section className="brand" aria-label={t("panelAria")}>
      {/* Trame réseau électrique en filigrane */}
      <div className="grid-trace" aria-hidden="true">
        <svg viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" fill="none">
          <g stroke="#87C4E8" strokeWidth="1" opacity="0.16">
            <path d="M-20 120 H180 V300 H360 V160 H620" />
            <path d="M-20 520 H120 V420 H300 V620 H520 V480 H620" />
            <path d="M80 -20 V200 H260 V40" />
            <path d="M420 -20 V140 H540 V340 H620" />
            <path d="M-20 700 H200 V560 H400 V740 H620" />
          </g>
          <g fill="#87C4E8" opacity="0.5">
            {[
              [180, 120], [180, 300], [360, 300], [360, 160], [120, 520],
              [120, 420], [300, 420], [300, 620], [520, 620], [520, 480],
              [260, 200], [540, 140], [540, 340], [400, 560],
            ].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" />
            ))}
          </g>
        </svg>
      </div>

      {/* Bulles bleues translucides */}
      <div className="bubbles" aria-hidden="true">
        <span className="bubble b1" />
        <span className="bubble b2" />
        <span className="bubble b3" />
        <span className="bubble b4" />
        <span className="bubble b5" />
      </div>

      {/* Topbar : wordmark + organisme */}
      <header className="topbar">
        <span className="wordmark" role="img" aria-label="CETé">
          CET<sup aria-hidden="true">é</sup>
        </span>
        <span className="mark-rule" aria-hidden="true" />
        <span className="org">
          Consortium Experts
          <br />
          Techniques Électricité
        </span>
      </header>

      {/* Narratif central */}
      <div className="brand-body">
        <p className="eyebrow">
          <span className="dot" aria-hidden="true" />
          {t("eyebrow")}
        </p>
        <p className="brand-title">
          {t("titleLine1")}
          <br />
          <em>{t("titleLine2")}</em>
        </p>
        <p className="brand-sub">{t("sub")}</p>

        {/* Sceau Vigi-Score */}
        <div className="vigi" role="img" aria-label={t("vigiAria")}>
          <VigiScale className="vigi-scale" />
          <div className="vigi-caption">
            <strong>{t("vigiTitle")}</strong>
            {t("vigiCaption")}
          </div>
        </div>
      </div>

      {/* Signaux de confiance */}
      <footer className="trust">
        <TrustChips />
      </footer>
    </section>
  );
}
