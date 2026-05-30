// SurfaceCard — a "true surface" used sparingly (rating hero, panels, list shells), shared
// by admin and client. White fill that lifts by luminance + a single hairline + an
// ultra-subtle shadow. Never border AND heavy shadow. Radius standardised to 10px.
import * as React from "react";
import { cn } from "@/lib/utils";

export function SurfaceCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="surface-card"
      className={cn(
        "rounded-[10px] border border-[var(--admin-line)] bg-card text-card-foreground",
        "shadow-[var(--surface-shadow)]",
        className,
      )}
      {...props}
    />
  );
}

export function SurfaceCardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-[var(--admin-line)] px-5 py-4",
        className,
      )}
      {...props}
    />
  );
}

export function SurfaceCardTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-sm font-semibold tracking-tight text-foreground", className)} {...props} />;
}

export function SurfaceCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-5 py-4", className)} {...props} />;
}
