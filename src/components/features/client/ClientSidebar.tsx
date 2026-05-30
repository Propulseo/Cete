"use client";

// ClientSidebar — inner content of the light recessive rail, aligned on the admin design
// system (no more dominant sky-blue block). Brand = real PNG logo on the light rail; the
// active item is marked by a 3px ink-blue left ledge + darkened label (blue as a precise
// accent, never a surface fill). Rendered inside the desktop fixed <aside> and the mobile
// <Sheet>, both provided by the client layout (which carries the .client-theme scope).
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Award,
  FolderOpen,
  FileText,
  Video,
  BookOpen,
  ClipboardList,
  Library,
  UserCircle,
  Bell,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/auth";

// Item / group title keys map 1:1 onto messages.client.sidebar.* — typed as unions so the
// localized `t()` calls stay type-checked against the message catalog.
type ItemKey =
  | "dashboard"
  | "notation"
  | "myDocuments"
  | "newsletters"
  | "capsules"
  | "guides"
  | "carnets"
  | "resources"
  | "profile";
type GroupKey = "groupOverview" | "groupContent" | "groupLibrary" | "groupAccount";

interface NavItem {
  key: ItemKey;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  titleKey: GroupKey;
  items: NavItem[];
}

// Grouped navigation, aligned on the admin sidebar grammar (quiet eyebrows + sections).
// Order follows the client mental model: overview & rating first, then the CETé-produced
// content, then the reference library, then the account.
const navGroups: NavGroup[] = [
  {
    titleKey: "groupOverview",
    items: [
      { key: "dashboard", href: "/client/dashboard", icon: LayoutDashboard },
      { key: "notation", href: "/client/notation", icon: Award },
      { key: "myDocuments", href: "/client/documents", icon: FolderOpen },
    ],
  },
  {
    titleKey: "groupContent",
    items: [
      { key: "newsletters", href: "/client/newsletters", icon: FileText },
      { key: "capsules", href: "/client/capsules", icon: Video },
      { key: "guides", href: "/client/guides", icon: BookOpen },
      { key: "carnets", href: "/client/carnets", icon: ClipboardList },
    ],
  },
  {
    titleKey: "groupLibrary",
    items: [{ key: "resources", href: "/client/ressources", icon: Library }],
  },
  {
    titleKey: "groupAccount",
    items: [{ key: "profile", href: "/client/profile", icon: UserCircle }],
  },
];

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

interface ClientSidebarProps {
  user: Profile;
  unreadCount: number;
  onLogout: () => void;
  onNavigate?: () => void;
}

export function ClientSidebar({ user, unreadCount, onLogout, onNavigate }: ClientSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("client.sidebar");

  return (
    <div className="flex h-full flex-col">
      {/* Brand masthead — in dark mode the PNG sits on a light plaque (L2) so its dark
          baseline "Consortium…" stays legible on the dark rail. */}
      <div className="flex h-16 items-center border-b border-[var(--admin-line)] px-5">
        <span className="inline-flex dark:rounded-md dark:bg-[#F4F9FD] dark:px-2 dark:py-1.5">
          <Image
            src="/assets/brand/logo-cete-adn.png"
            alt="CETé — Agence de notation"
            width={160}
            height={40}
            priority
            className="h-8 w-auto"
          />
        </span>
      </div>

      {/* Grouped navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {navGroups.map((group) => (
          <div key={group.titleKey} className="mb-1">
            <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">
              {t(group.titleKey)}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname.endsWith(item.href) ||
                  (item.href !== "/client/dashboard" && pathname.includes(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary/[0.07] font-medium text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    {isActive && (
                      <span aria-hidden className="absolute inset-y-1 left-0 w-[3px] rounded-r bg-primary" />
                    )}
                    <item.icon
                      strokeWidth={1.75}
                      className={cn(
                        "size-[18px] shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                      )}
                    />
                    <span className="truncate">{t(item.key)}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Notifications */}
      {unreadCount > 0 && (
        <div className="border-t border-[var(--admin-line)] p-3">
          <div className="flex items-center gap-2.5 rounded-md bg-accent px-3 py-2.5">
            <Bell className="size-4 shrink-0 text-primary" strokeWidth={1.75} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{t("notifications")}</p>
              <p className="truncate text-xs text-muted-foreground">{t("unread", { count: unreadCount })}</p>
            </div>
            <Badge variant="secondary" className="tabular-nums">{unreadCount}</Badge>
          </div>
        </div>
      )}

      {/* Account */}
      <div className="border-t border-[var(--admin-line)] p-3">
        <div className="mb-2 flex items-center gap-3 px-1">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
            {initialsOf(user.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.company}</p>
          </div>
        </div>
        <ThemeToggle className="mb-2" />
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={onLogout}
        >
          <LogOut className="mr-2 size-4" />
          {t("logout")}
        </Button>
      </div>
    </div>
  );
}
