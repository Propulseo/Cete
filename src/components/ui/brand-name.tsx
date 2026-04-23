import type { ReactNode } from "react";

export function BrandName({ className }: { className?: string } = {}) {
  return (
    <span className={className}>
      CET<span className="text-[0.75em] align-super">é</span>
    </span>
  );
}

export function brandify(text: string): ReactNode {
  const parts = text.split(/(CETé)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    part === "CETé" ? <BrandName key={i} /> : part
  );
}
