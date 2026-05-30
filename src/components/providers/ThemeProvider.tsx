"use client";

// ThemeProvider — scopes next-themes to the admin & client areas ONLY (mounted in their
// layouts, never in the root or public layouts), so the public showcase site always stays
// light and the toggle has no effect on it.
//
// next-themes applies the `.dark` class on <html>. Our dark tokens live under scoped
// selectors (.dark .admin-theme / .dark .client-theme in globals.css), so even if the
// `.dark` class lingers on <html> after navigating back to the public site, the public DOM
// — which carries no theme-scope class — receives zero dark overrides. The Tailwind `dark:`
// variant is likewise scoped (globals.css @custom-variant) to the same theme classes.
//
// P1 (portal scope): Radix overlays (Dialog/Sheet/Popover) and the root Sonner toaster render
// OUTSIDE the in-flow .admin-theme/.client-theme wrapper (they portal to <body>). We therefore
// mirror the scope class — and the Source Serif font variable — onto <body> while the area is
// mounted, so those portals inherit the scoped tokens + the `.dark` cascade. Cleaned up on
// unmount so the public site never keeps the scope.
import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  /** Scope class(es) to mirror onto <body>, e.g. `admin-theme ${sourceSerif.variable}`. */
  bodyClass: string;
  children: React.ReactNode;
}

export function ThemeProvider({ bodyClass, children }: ThemeProviderProps) {
  useEffect(() => {
    const body = document.body;
    // Only remove on cleanup the classes we actually added (don't strip pre-existing ones).
    const added = bodyClass
      .split(/\s+/)
      .filter(Boolean)
      .filter((c) => !body.classList.contains(c));
    body.classList.add(...added);
    return () => body.classList.remove(...added);
  }, [bodyClass]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      themes={["light", "dark"]}
      storageKey="cete-theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
