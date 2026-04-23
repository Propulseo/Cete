"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { listDocumentsForClient } from "@/lib/repo/documents.repo";
import { listNotifications } from "@/lib/repo/notifications.repo";
import { BrandName } from "@/components/ui/brand-name";
import { DashboardSummary } from "@/components/features/client/DashboardSummary";
import { CertificateCard } from "@/components/features/client/CertificateCard";
import { NotificationsTicker } from "@/components/features/client/NotificationsTicker";
import type { ClientDocument, Notification } from "@/types/document";

export default function ClientDashboardPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const [docs, notifs] = await Promise.all([
        listDocumentsForClient(user.id),
        listNotifications(),
      ]);
      setDocuments(docs);
      setNotifications(notifs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={loadData} variant="outline">Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Bienvenue, {user.name}
        </h1>
        <p className="text-muted-foreground">
          Retrouvez vos documents, votre notation et vos ressources <BrandName />
        </p>
      </div>

      <div className="space-y-8">
        <CertificateCard userName={user.name} companyName={user.company} />
        <DashboardSummary documents={documents} />
        <NotificationsTicker
          notifications={notifications}
          onMarkAsRead={(id) =>
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            )
          }
        />
      </div>
    </div>
  );
}
