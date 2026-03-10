"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, RotateCcw, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getSettings, updateSettings, resetSettings } from "@/lib/repo/settings.repo";
import type { ContactInfo } from "@/types/contact";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSettings();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const set = (key: keyof ContactInfo, value: string) =>
    setSettings((prev) => prev ? { ...prev, [key]: value } : prev);

  const handleSave = async () => {
    if (!settings) return;
    try {
      await updateSettings(settings);
      toast.success("Paramètres enregistrés");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'enregistrement");
    }
  };

  const handleReset = async () => {
    try {
      await resetSettings();
      const data = await getSettings();
      setSettings(data);
      toast.success("Paramètres réinitialisés");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la réinitialisation");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error ?? "Paramètres introuvables"}</p>
        <Button onClick={loadData} variant="outline">Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
          <p className="text-muted-foreground">Configuration de l&apos;agence de notation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Réinitialiser
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations entreprise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nom de l&apos;entreprise</Label>
              <Input value={settings.company} onChange={(e) => set("company", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Adresse</Label>
              <Input value={settings.address} onChange={(e) => set("address", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Ville</Label>
              <Input value={settings.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Pays</Label>
              <Input value={settings.country} onChange={(e) => set("country", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input value={settings.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={settings.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Site web</Label>
              <Input value={settings.website} onChange={(e) => set("website", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Horaires d&apos;ouverture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const).map((day) => {
                const labels: Record<string, string> = {
                  monday: "Lundi", tuesday: "Mardi", wednesday: "Mercredi",
                  thursday: "Jeudi", friday: "Vendredi", saturday: "Samedi", sunday: "Dimanche",
                };
                return (
                  <div key={day} className="space-y-1">
                    <Label className="text-xs">{labels[day]}</Label>
                    <Input
                      value={settings.businessHours[day]}
                      onChange={(e) =>
                        setSettings((prev) =>
                          prev
                            ? { ...prev, businessHours: { ...prev.businessHours, [day]: e.target.value } }
                            : prev
                        )
                      }
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
