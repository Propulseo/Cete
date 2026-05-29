// QuickAction — a card-less / ghost action row shared by admin and client. The single
// primary action per view gets the solid ink-blue fill; the rest stay quiet. No coloured
// icon tiles.
import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description?: string;
  primary?: boolean;
  className?: string;
}

export function QuickAction({
  href,
  icon: Icon,
  title,
  description,
  primary,
  className,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-[10px] border px-4 py-3 transition-colors",
        primary
          ? "border-transparent bg-primary text-primary-foreground hover:opacity-95"
          : "border-[var(--admin-line)] bg-card hover:bg-[var(--admin-sidebar-hover)]",
        className,
      )}
    >
      <Icon
        className={cn("size-5 shrink-0", primary ? "text-primary-foreground" : "text-muted-foreground")}
        strokeWidth={1.75}
      />
      <span className="min-w-0 flex-1">
        <span className={cn("block text-sm font-medium", primary ? "text-primary-foreground" : "text-foreground")}>
          {title}
        </span>
        {description && (
          <span className={cn("block text-xs", primary ? "text-primary-foreground/80" : "text-muted-foreground")}>
            {description}
          </span>
        )}
      </span>
      <ChevronRight
        className={cn(
          "size-4 shrink-0 transition-transform group-hover:translate-x-0.5",
          primary ? "text-primary-foreground/80" : "text-muted-foreground",
        )}
      />
    </Link>
  );
}
