"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  Settings,
  LogOut,
  Zap,
  Library,
  Building2,
  UserCircle,
} from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Documents", href: "/admin/documents", icon: FolderOpen },
  { label: "Ressources", href: "/admin/ressources", icon: Library },
  { label: "Organisations", href: "/admin/organizations", icon: Building2 },
  { label: "Équipe", href: "/admin/team", icon: UserCircle },
  { label: "Utilisateurs", href: "/admin/users", icon: Users },
  { label: "Paramètres", href: "/admin/settings", icon: Settings },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/connexion");
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/connexion");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-primary text-primary-foreground">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <Zap className="h-5 w-5 text-accent" />
            </div>
            <span className="text-lg font-bold">CETé Admin</span>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-4">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="mb-3 text-sm">
              <p className="font-medium">{user.name}</p>
              <p className="text-white/50">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-white/70 hover:bg-white/5 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>

      <main className="ml-64 flex-1 bg-secondary">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
