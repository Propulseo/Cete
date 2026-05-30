"use client";

import { useState } from "react";

const ACCOUNTS = [
  {
    role: "Client",
    email: "client@cete.fr",
    badge: "client" as const,
    label: "Pré-remplir le compte client : client@cete.fr",
    icon: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
  },
  {
    role: "Administrateur",
    email: "admin@cete.fr",
    badge: "admin" as const,
    label: "Pré-remplir le compte administrateur : admin@cete.fr",
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
];

const DEMO_PASSWORD = "password";

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
);

/** Comptes de démonstration repliables. `onFill` injecte les identifiants dans le formulaire. */
export function DemoAccounts({ onFill }: { onFill: (email: string, password: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`demo${open ? " open" : ""}`}>
      <button
        type="button"
        className="demo-toggle"
        aria-expanded={open}
        aria-controls="demoBody"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="dt-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          Comptes de démonstration
        </span>
        <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div className="demo-body" id="demoBody" role="region" aria-label="Identifiants de démonstration">
        <div className="demo-body-inner">
          <div className="demo-cards">
            {ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                className="demo-card"
                aria-label={acc.label}
                onClick={() => onFill(acc.email, DEMO_PASSWORD)}
              >
                <span className="dc-head">
                  <span className={`dc-badge ${acc.badge}`} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {acc.icon}
                    </svg>
                  </span>
                  <span className="dc-role">{acc.role}</span>
                </span>
                <span className="dc-mail">{acc.email}</span>
                <span className="dc-fill" aria-hidden="true">
                  Remplir
                  <Arrow />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
