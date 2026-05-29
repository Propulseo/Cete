"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, ArrowLeft, LogIn } from "lucide-react";
import { BrandName } from "@/components/ui/brand-name";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { getUser } from "@/lib/auth";
import { toast } from "sonner";

function PortailContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        toast.success("Connexion réussie");
        // Route selon le rôle réel du profil (et non l'email).
        const u = await getUser();
        router.push(u?.role === "admin" ? "/admin/dashboard" : "/client/dashboard");
      } else {
        toast.error("Identifiants incorrects", {
          description: "Vérifiez votre email et mot de passe",
        });
      }
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1A2940] to-[#0D5A8A] px-4">
      <div className="w-full max-w-md md:max-w-lg">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <Zap className="h-8 w-8 text-[#E8630A]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Espace <BrandName /></h1>
          <p className="mt-1 text-sm text-white/60">
            Accédez à votre notation et vos ressources
          </p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <LogIn className="h-5 w-5 text-[#1A2940]" />
              Connexion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#4DA6D9] hover:bg-[#1A7AB5]" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Comptes de démonstration
              </p>
              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={() => { setEmail("client@cete.fr"); setPassword("password"); }}
                  className="rounded-lg border p-3 text-left transition-colors hover:border-[#4DA6D9]/30 hover:bg-[#4DA6D9]/5"
                >
                  <p className="text-sm font-medium">Client</p>
                  <p className="text-xs text-muted-foreground">client@cete.fr / password</p>
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail("admin@cete.fr"); setPassword("password"); }}
                  className="rounded-lg border p-3 text-left transition-colors hover:border-[#E8630A]/30 hover:bg-[#E8630A]/5"
                >
                  <p className="text-sm font-medium">Administrateur</p>
                  <p className="text-xs text-muted-foreground">admin@cete.fr / password</p>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au site
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PortailPage() {
  return (
    <AuthProvider>
      <PortailContent />
    </AuthProvider>
  );
}
