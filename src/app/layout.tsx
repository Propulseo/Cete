import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// Root layout is intentionally minimal.
// <html> and <body> are rendered by [locale]/layout.tsx
// so the lang attribute can be set dynamically per locale.
export default function RootLayout({ children }: Props) {
  return children;
}
