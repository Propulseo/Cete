"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { Source_Serif_4 } from "next/font/google";
import { Menu } from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AdminSidebar } from "@/components/features/admin/AdminSidebar";

// Source Serif 4 — institutional display serif, scoped to the admin theme only
// (the public site keeps Merriweather). Exposed as --font-source-serif and consumed
// by the .font-serif-display utility / --font-serif-display token.
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

// Shared scope classes applied to the in-flow wrapper AND to the portalled mobile Sheet,
// so admin tokens + the serif font reach the drawer even though it renders in a portal.
const adminScope = `admin-theme ${sourceSerif.variable}`;

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoggingOut = useRef(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin") && !isLoggingOut.current) {
      router.push("/connexion");
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    isLoggingOut.current = true;
    await logout();
    router.replace("/");
  };

  if (isLoading) {
    return (
      <div className={`${adminScope} flex min-h-screen items-center justify-center bg-background`}>
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  const sidebarUser = { name: user.name, email: user.email };

  return (
    <div className={`${adminScope} flex min-h-screen bg-background text-foreground`}>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[var(--admin-line)] bg-[var(--admin-sidebar)]">
          <AdminSidebar user={sidebarUser} onLogout={handleLogout} />
        </aside>
      </div>

      {/* Tablet/mobile drawer (portalled — carries the admin scope explicitly) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className={`${adminScope} w-[min(86vw,320px)] border-r border-[var(--admin-line)] bg-[var(--admin-sidebar)] p-0 sm:max-w-none`}
        >
          {/* Radix exige un titre sur le contenu du dialog : sans lui, le lecteur
              d'écran annonce un panneau anonyme (et la console émet un avertissement). */}
          <SheetTitle className="sr-only">Navigation admin</SheetTitle>
          <AdminSidebar user={sidebarUser} onLogout={handleLogout} onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* min-w-0 : un enfant de flex a `min-width:auto` par défaut, donc un contenu
          large (table, titre non coupé) élargit le <main> et fait déborder toute la
          page horizontalement. overflow-x-clip en filet de sécurité — `clip` et non
          `hidden`, qui créerait un conteneur de défilement et casserait le sticky de
          la barre du haut. */}
      <main className="min-w-0 flex-1 overflow-x-clip lg:ml-64">
        <div className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-[var(--admin-line)] bg-card px-4 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          {/* Le logo de la topbar ramène à la vitrine — seul geste « accueil » quand le
              drawer est fermé. */}
          <Link
            href="/"
            aria-label="Retour au site"
            className="inline-flex rounded-sm transition-opacity hover:opacity-80"
          >
            <Image
              src="/assets/brand/logo-cete.png"
              alt="CETé — Agence de notation"
              width={49}
              height={28}
              className="h-7 w-auto dark:brightness-0 dark:invert"
            />
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider bodyClass={adminScope}>
      <AuthProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </AuthProvider>
    </ThemeProvider>
  );
}
