"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Video,
  BookOpen,
  ClipboardList,
  Bell,
  User,
  LogOut,
  Zap,
} from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getClientDocuments } from "@/lib/data-loader";

const sidebarItems = [
  { label: "Dashboard", href: "/client", icon: LayoutDashboard },
  { label: "Newsletters", href: "/client?tab=newsletters", icon: FileText },
  { label: "Capsules vidéo", href: "/client?tab=capsules", icon: Video },
  { label: "Guides", href: "/client?tab=guides", icon: BookOpen },
  { label: "Carnets d'appui", href: "/client?tab=carnets", icon: ClipboardList },
];

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user && pathname !== "/client/login") {
      router.push("/client/login");
    }
  }, [user, isLoading, pathname, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  // Show only children for login page
  if (pathname === "/client/login") {
    return <>{children}</>;
  }

  // Require client role for other pages
  if (!user) {
    return null;
  }

  const clientData = getClientDocuments();
  const unreadCount = clientData.notifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
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
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || (item.href === "/client" && pathname === "/client");
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
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
            <Link
              href="/"
              className="mt-2 block text-center text-xs text-muted-foreground hover:text-primary"
            >
              Retour au site
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 bg-secondary">{children}</main>
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </AuthProvider>
  );
}
