"use client";

// AdminSidebar — inner content of the light recessive rail (replaces the dominant
// sky-blue block). Rendered inside both the desktop fixed <aside> and the mobile <Sheet>
// wrapper provided by the admin layout. Brand = real PNG logo on the light rail; nav is
// grouped with quiet eyebrows; the active item is marked by a 3px ink-blue left ledge +
// darkened label (blue as a precise accent, never a surface fill).
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  Settings,
  LogOut,
  Library,
  Building2,
  UserCircle,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Pilotage",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Clients", href: "/admin/clients", icon: Briefcase },
      { label: "Organisations", href: "/admin/organizations", icon: Building2 },
    ],
  },
  {
    title: "Contenu",
    items: [
      { label: "Blog", href: "/admin/blog", icon: FileText },
      { label: "Documents", href: "/admin/documents", icon: FolderOpen },
      { label: "Ressources", href: "/admin/ressources", icon: Library },
    ],
  },
  {
    title: "Compte",
    items: [
      { label: "Équipe", href: "/admin/team", icon: UserCircle },
      { label: "Utilisateurs", href: "/admin/users", icon: Users },
      { label: "Paramètres", href: "/admin/settings", icon: Settings },
    ],
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

interface AdminSidebarProps {
  user: { name: string; email: string };
  onLogout: () => void;
  onNavigate?: () => void;
}

export function AdminSidebar({ user, onLogout, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

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
          <div key={group.title} className="mb-1">
            <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname.endsWith(item.href) ||
                  (item.href !== "/admin/dashboard" && pathname.includes(item.href));
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
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Account */}
      <div className="border-t border-[var(--admin-line)] p-3">
        <div className="mb-2 flex items-center gap-3 px-1">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
            {initialsOf(user.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
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
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
