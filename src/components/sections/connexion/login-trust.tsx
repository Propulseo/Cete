import type { ReactNode } from "react";

/** Signaux de confiance affichés sur le panneau marque (desktop + en-tête mobile). */
const TRUST: { label: string; path: ReactNode }[] = [
  {
    label: "Organisme indépendant",
    path: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  },
  {
    label: "Notation A · B · C · D",
    path: (
      <>
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M21 7v6h-6" />
      </>
    ),
  },
  {
    label: "Accès sécurisé",
    path: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
  },
];

/** Rend les pastilles de confiance (le parent fournit le conteneur .trust / .mh-trust). */
export function TrustChips() {
  return (
    <>
      {TRUST.map((t) => (
        <span className="chip" key={t.label}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {t.path}
          </svg>
          {t.label}
        </span>
      ))}
    </>
  );
}
