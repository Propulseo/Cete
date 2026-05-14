"use client";

import { useState, useEffect } from "react";
import { User, Mail, Building2, Shield, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandName } from "@/components/ui/brand-name";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { listDocumentsForClient } from "@/lib/repo/documents.repo";

export default function ProfilePage() {
  const { user } = useAuth();
  const [totalDocs, setTotalDocs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    listDocumentsForClient(user.id)
      .then((docs) => setTotalDocs(docs.length))
      .catch(() => setTotalDocs(0))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Mon profil</h1>
        <p className="text-sm text-muted-foreground">
          Votre compte et votre organisation
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                <User className="h-8 w-8" />
              </div>
              <div>
                <p className="text-lg font-semibold">{user.name}</p>
                <Badge variant="secondary">Client</Badge>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              {user.company && (
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{user.company}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>ID Client : {user.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Votre abonnement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-primary/5 p-4">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <>
                  <p className="text-2xl font-bold text-primary">{totalDocs}</p>
                  <p className="text-sm text-muted-foreground">documents accessibles</p>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Votre espace client vous donne accès aux newsletters, capsules vidéo,
              guides pratiques et carnets d&apos;appui <BrandName />. Contactez votre
              référent pour toute question sur votre notation ou vos ressources.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
