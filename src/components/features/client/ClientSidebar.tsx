"use client";

// ClientSidebar — inner content of the light recessive rail, aligned on the admin design
// system (no more dominant sky-blue block). Brand = SVG logo on the light rail; the
// active item is marked by a 3px ink-blue left ledge + darkened label (blue as a precise
// accent, never a surface fill). Rendered inside the desktop fixed <aside> and the mobile
// <Sheet>, both provided by the client layout (which carries the .client-theme scope).
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
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
  ArrowLeft,
  LogOut,
  type LucideIcon,
} from "lucide-react";
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
  onLogout: () => void;
  onNavigate?: () => void;
}

export function ClientSidebar({ user, onLogout, onNavigate }: ClientSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("client.sidebar");

  return (
    <div className="flex h-full flex-col">
      {/* Bandeau de marque. Le logo détouré est inversé en blanc monochrome en mode
          sombre (même traitement que le footer du site) pour rester lisible sur le rail.
          Le pr-14 réserve la place de la croix de fermeture du drawer, absente en desktop
          où le rail est fixe. */}
      <div className="flex h-16 shrink-0 items-center border-b border-[var(--admin-line)] px-5 pr-14 lg:pr-5">
        <Link
          href="/"
          onClick={onNavigate}
          aria-label={t("backToSite")}
          className="inline-flex rounded-sm transition-opacity hover:opacity-80"
        >
          <Image
            src="/assets/brand/logo-cete.png"
            alt="CETé — Agence de notation"
            width={69}
            height={40}
            className="h-8 w-auto dark:brightness-0 dark:invert"
          />
        </Link>
      </div>

      {/* Corps défilant. overscroll-contain : sans lui, arrivé en bout de liste, le
          geste continue sur la page derrière le voile. */}
      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-2">
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
                    href={item.href as "/"}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      // 48px au doigt, densité desktop d'origine à partir de lg.
                      "group relative flex min-h-12 items-center gap-3 rounded-md px-3 text-[15px] transition-colors lg:min-h-0 lg:py-2 lg:text-sm",
                      isActive
                        ? "bg-primary/[0.07] font-medium text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground active:bg-accent",
                    )}
                  >
                    {isActive && (
                      <span aria-hidden className="absolute inset-y-1.5 left-0 w-[3px] rounded-r bg-primary lg:inset-y-1" />
                    )}
                    <item.icon
                      strokeWidth={1.75}
                      className={cn(
                        "size-5 shrink-0 lg:size-[18px]",
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

      {/* Pied fixe — identité, thème, sortie. Épinglé plutôt que placé en fin de liste :
          la déconnexion et le retour au site restent atteignables sans scroller, et
          tombent dans la zone du pouce. */}
      <div className="shrink-0 border-t border-[var(--admin-line)] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:pb-3">
        <div className="mb-2 flex items-center gap-3 px-1">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
            {initialsOf(user.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.company}</p>
          </div>
        </div>
        <ThemeToggle className="mb-1" />
        <Link
          href="/"
          onClick={onNavigate}
          className="group flex min-h-11 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:min-h-0 lg:py-2"
        >
          <ArrowLeft strokeWidth={1.75} className="size-4 shrink-0" />
          <span className="truncate">{t("backToSite")}</span>
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:min-h-0 lg:py-2"
        >
          <LogOut className="size-4 shrink-0" strokeWidth={1.75} />
          <span className="truncate">{t("logout")}</span>
        </button>
      </div>
    </div>
  );
}
