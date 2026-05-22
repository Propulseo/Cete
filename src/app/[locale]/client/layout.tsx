"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { getUnreadCount } from "@/lib/repo/notifications.repo";
import { ClientSidebar } from "@/components/features/client/ClientSidebar";

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const t = useTranslations("client");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/connexion");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      getUnreadCount().then(setUnreadCount).catch(() => setUnreadCount(0));
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/connexion");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">{t("states.loading")}</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <ClientSidebar user={user} unreadCount={unreadCount} onLogout={handleLogout} />
      <main className="ml-64 flex-1 bg-secondary">{children}</main>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </AuthProvider>
  );
}
