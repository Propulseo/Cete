"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Video,
  BookOpen,
  ClipboardList,
  Bell,
  User,
  UserCircle,
  LogOut,
  Zap,
  Library,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/types/auth";

const navItems = [
  { label: "Tableau de bord", href: "/client/dashboard", icon: LayoutDashboard },
  { label: "Newsletters", href: "/client/newsletters", icon: FileText },
  { label: "Capsules vidéo", href: "/client/capsules", icon: Video },
  { label: "Guides pratiques", href: "/client/guides", icon: BookOpen },
  { label: "Carnets d'appui", href: "/client/carnets", icon: ClipboardList },
  { label: "Ressources", href: "/client/ressources", icon: Library },
];

interface ClientSidebarProps {
  user: Profile;
  unreadCount: number;
  onLogout: () => void;
}

export function ClientSidebar({ user, unreadCount, onLogout }: ClientSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-accent" />
          </div>
          <span className="text-lg font-bold text-primary">Espace Client</span>
        </div>

        {/* User Info */}
        <div className="border-b p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-medium text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.company}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-4 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}

          {/* Profile link */}
          <div className="pt-4">
            <Link
              href="/client/profile"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                pathname === "/client/profile"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <UserCircle className="h-5 w-5" />
              Mon profil
            </Link>
          </div>
        </nav>

        {/* Notifications */}
        {unreadCount > 0 && (
          <div className="border-t p-4">
            <div className="flex items-center gap-2 rounded-lg bg-accent/10 p-3">
              <Bell className="h-5 w-5 text-accent" />
              <div className="flex-1">
                <p className="text-sm font-medium">Notifications</p>
                <p className="text-xs text-muted-foreground">{unreadCount} non lue(s)</p>
              </div>
              <Badge variant="destructive">{unreadCount}</Badge>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="border-t p-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:bg-secondary hover:text-foreground"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>
    </aside>
  );
}
