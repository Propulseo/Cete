"use client";

// ThemeToggle — a compact 3-state segmented control (Clair / Système / Sombre) for the admin
// & client sidebars. All three options are visible (clearer than a hidden dropdown in a narrow
// rail) and reflect the user's choice via next-themes. Fully tokenised, so it adapts in dark.
// Renders a same-size placeholder until mounted to avoid a hydration mismatch / layout shift.
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS: { value: string; icon: LucideIcon; label: string }[] = [
  { value: "light", icon: Sun, label: "Clair" },
  { value: "system", icon: Monitor, label: "Système" },
  { value: "dark", icon: Moon, label: "Sombre" },
];

// Hydration-safe "mounted" flag without setState-in-effect: false during SSR + hydration,
// true afterwards. Lets us render a placeholder until next-themes knows the resolved theme.
const noopSubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div
        aria-hidden
        className={cn("h-8 w-full rounded-md border border-[var(--admin-line)]", className)}
      />
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Thème de l'interface"
      className={cn(
        "grid grid-cols-3 gap-1 rounded-md border border-[var(--admin-line)] p-1",
        className,
      )}
    >
      {OPTIONS.map(({ value, icon: Icon, label }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              "flex h-6 items-center justify-center rounded-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--admin-sidebar)]",
              active
                ? "bg-primary/[0.1] text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon className="size-4" strokeWidth={1.75} />
          </button>
        );
      })}
    </div>
  );
}
