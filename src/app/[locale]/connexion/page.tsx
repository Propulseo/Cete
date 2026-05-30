"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { LoginBrandPanel } from "@/components/sections/connexion/LoginBrandPanel";
import { LoginMobileHead } from "@/components/sections/connexion/LoginMobileHead";
import { DemoAccounts } from "@/components/sections/connexion/DemoAccounts";
import "./connexion.css";

const EYE = (
  <>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </>
);
const EYE_OFF = (
  <>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M6.61 6.61A18.45 18.45 0 0 0 2 12s3.5 8 10 8a9.12 9.12 0 0 0 5.39-1.61" />
    <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
    <path d="m2 2 20 20" />
  </>
);

function PortailContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const locale = useLocale();
  const { login } = useAuth();

  const handleForgot = async () => {
    if (!email) {
      toast.error("Saisissez d'abord votre email");
      return;
    }
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/${locale}/reset-password`,
      });
      if (error) throw error;
      toast.success("Lien de réinitialisation envoyé", {
        description: "Consultez votre boîte email.",
      });
    } catch {
      toast.error("Impossible d'envoyer le lien de réinitialisation");
    }
  };

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

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    emailRef.current?.focus();
  };

  return (
    <div className="cete-login">
      <main className="shell">
        <LoginBrandPanel />

        <section className="panel" aria-label="Connexion à l'Espace CETé">
          <LoginMobileHead />

          <div className="panel-inner">
            <Link className="back-link" href="/" aria-label="Retour au site public">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              Retour au site
            </Link>

            <div className="form-head">
              <h1>
                Espace{" "}
                <span aria-hidden="true">
                  CET<span className="wm-sup">é</span>
                </span>
                <span className="sr-only">CETé</span>
              </h1>
              <p>Accédez à votre notation et vos ressources.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="email">Email</label>
                <div className="input-wrap">
                  <svg className="lead" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 6L2 7" />
                  </svg>
                  <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="votre@email.fr"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="field password">
                <label htmlFor="password">Mot de passe</label>
                <div className="input-wrap">
                  <svg className="lead" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-pw"
                    aria-controls="password"
                    aria-pressed={showPassword}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {showPassword ? EYE_OFF : EYE}
                    </svg>
                  </button>
                </div>
              </div>

              <div className="row-between">
                <label className="remember" htmlFor="remember">
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Se souvenir de moi
                </label>
                <button type="button" className="forgot" onClick={handleForgot}>
                  Mot de passe oublié ?
                </button>
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="btn-spinner" aria-hidden="true" />
                    Connexion en cours…
                  </>
                ) : (
                  <>
                    Se connecter
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <DemoAccounts onFill={fillDemo} />

            <p className="legal">
              En vous connectant, vous acceptez nos{" "}
              {/* TODO: lier aux pages légales réelles quand elles existeront */}
              <a href="#">conditions d&apos;utilisation</a> et notre{" "}
              <a href="#">politique de confidentialité</a>.
            </p>
          </div>
        </section>
      </main>
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
