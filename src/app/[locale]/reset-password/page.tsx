"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Zap, KeyRound, Loader2 } from "lucide-react";
import { BrandName } from "@/components/ui/brand-name";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const locale = useLocale();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);

  // Le lien de récupération crée une session temporaire (detectSessionInUrl).
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Le mot de passe doit faire au moins 6 caractères");
      return;
    }
    if (password !== confirm) {
      toast.error("Les deux mots de passe ne correspondent pas");
      return;
    }
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Mot de passe réinitialisé");
      router.push(`/${locale}/connexion`);
    } catch {
      toast.error("Lien expiré ou invalide — redemandez un lien de réinitialisation");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1A2940] to-[#0D5A8A] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <Zap className="h-8 w-8 text-[#E8630A]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Espace <BrandName /></h1>
          <p className="mt-1 text-sm text-white/60">Réinitialisation du mot de passe</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <KeyRound className="h-5 w-5 text-[#1A2940]" />
              Nouveau mot de passe
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!ready ? (
              <p className="text-sm text-muted-foreground">
                Ouvrez cette page depuis le lien reçu par email. Si rien ne se passe, redemandez un
                lien de réinitialisation depuis la page de connexion.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pwd">Nouveau mot de passe</Label>
                  <Input
                    id="pwd"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 caractères"
                    minLength={6}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pwd2">Confirmer</Label>
                  <Input
                    id="pwd2"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-[#4DA6D9] hover:bg-[#1A7AB5]" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" strokeWidth={1.75} />}
                  Réinitialiser
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
