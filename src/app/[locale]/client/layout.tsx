"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { Source_Serif_4 } from "next/font/google";
import { Menu, Building2 } from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { EmptyState } from "@/components/shared/empty-state";
import { ClientSidebar } from "@/components/features/client/ClientSidebar";

// Source Serif 4 — same institutional display serif as the admin area, scoped to the
// client theme. Exposed as --font-source-serif and consumed by .font-serif-display.
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

// Scope class applied to the in-flow wrapper AND the portalled mobile Sheet, so client
// tokens + the serif font reach the drawer even though it renders in a portal.
const clientScope = `client-theme ${sourceSerif.variable}`;

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const t = useTranslations("client");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoggingOut = useRef(false);

  useEffect(() => {
    if (!isLoading && !user && !isLoggingOut.current) {
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
      <div className={`${clientScope} flex min-h-screen items-center justify-center bg-background`}>
        <div className="text-muted-foreground">{t("states.loading")}</div>
      </div>
    );
  }

  if (!user) return null;

  // Compte client non rattaché à une entreprise (profiles.client_id NULL) : la RLS ne
  // renverra que le contenu « global », donnant l'illusion d'un portail vide. On affiche
  // un message explicite plutôt qu'un espace incompréhensiblement vide.
  const isOrphan = user.role === "client" && !user.clientId;

  return (
    <div className={`${clientScope} flex min-h-screen bg-background text-foreground`}>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[var(--admin-line)] bg-[var(--admin-sidebar)]">
          <ClientSidebar user={user} onLogout={handleLogout} />
        </aside>
      </div>

      {/* Tablet/mobile drawer (portalled — carries the client scope explicitly) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className={`${clientScope} w-64 border-r border-[var(--admin-line)] bg-[var(--admin-sidebar)] p-0`}
        >
          <ClientSidebar
            user={user}
            onLogout={handleLogout}
            onNavigate={() => setSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-[var(--admin-line)] bg-card px-4 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="inline-flex">
            <Image
              src="/assets/brand/logo-cete.png"
              alt="CETé — Agence de notation"
              width={49}
              height={28}
              className="h-7 w-auto dark:brightness-0 dark:invert"
            />
          </span>
        </div>
        {isOrphan ? (
          <div className="p-4 lg:p-8">
            <EmptyState
              icon={Building2}
              title={t("orphan.title")}
              description={t("orphan.description")}
            />
            <p className="mt-3 text-center text-xs text-muted-foreground">{t("orphan.hint")}</p>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider bodyClass={clientScope}>
      <AuthProvider>
        <ClientLayoutContent>{children}</ClientLayoutContent>
      </AuthProvider>
    </ThemeProvider>
  );
}
