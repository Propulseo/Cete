"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function ClientLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = login(email, password);

    if (user) {
      if (user.role === "client") {
        toast.success("Connexion réussie", {
          description: `Bienvenue ${user.name}`,
        });
        router.push("/client");
      } else {
        toast.error("Accès refusé", {
          description: "Utilisez la page de connexion admin",
        });
      }
    } else {
      toast.error("Erreur de connexion", {
        description: "Email ou mot de passe incorrect",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-secondary px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-8 w-8 text-accent" />
          </div>
          <CardTitle className="text-2xl">Espace Client</CardTitle>
          <p className="text-sm text-muted-foreground">
            Accédez à vos ressources et documents
          </p>
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 rounded-lg bg-secondary p-4">
            <p className="mb-2 text-sm font-medium text-foreground">
              Compte de démonstration :
            </p>
            <p className="text-xs text-muted-foreground">
              Email : demo@cete.fr
              <br />
              Mot de passe : Cete2026
            </p>
          </div>

          <div className="mt-6 text-center">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à l&apos;accueil
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
