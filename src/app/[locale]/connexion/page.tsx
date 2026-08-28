"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { getUser } from "@/lib/auth";
import { requestPasswordResetAction } from "@/app/actions/auth";
import { LoginBrandPanel } from "@/components/sections/connexion/LoginBrandPanel";
import { LoginMobileHead } from "@/components/sections/connexion/LoginMobileHead";
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
  const t = useTranslations("connexion");
  const { login } = useAuth();

  const handleForgot = async () => {
    const value = email.trim();
    if (!value) {
      toast.error(t("toast.emailFirst"));
      return;
    }
    try {
      // Côté serveur : seuls les comptes déjà inscrits ET actifs reçoivent un lien.
      // On ne passe que la locale ; l'URL de retour est construite côté serveur.
      const { ok } = await requestPasswordResetAction(value, locale);
      if (ok) {
        toast.success(t("toast.resetSent"), {
          description: t("toast.resetSentDesc"),
        });
      } else {
        toast.error(t("toast.resetNoAccount"), {
          description: t("toast.resetNoAccountDesc"),
        });
      }
    } catch {
      toast.error(t("toast.resetError"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success(t("toast.loginSuccess"));
        // Route selon le rôle réel du profil (et non l'email). Le router i18n
        // conserve la locale courante dans l'URL de destination.
        const u = await getUser();
        router.push(u?.role === "admin" ? "/admin/dashboard" : "/client/dashboard");
      } else {
        toast.error(t("toast.loginInvalid"), {
          description: t("toast.loginInvalidDesc"),
        });
      }
    } catch {
      toast.error(t("toast.loginError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cete-login">
      <main className="shell">
        <LoginBrandPanel />

        <section className="panel" aria-label={t("sectionAria")}>
          <LoginMobileHead />

          <div className="panel-inner">
            <Link className="back-link" href="/" aria-label={t("backToSiteAria")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              {t("backToSite")}
            </Link>

            <div className="form-head">
              <h1>{t("heading")}</h1>
              <p>{t("subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="email">{t("emailLabel")}</label>
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
                    placeholder={t("emailPlaceholder")}
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="field password">
                <label htmlFor="password">{t("passwordLabel")}</label>
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
                    aria-label={showPassword ? t("hidePassword") : t("showPassword")}
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
                  {t("remember")}
                </label>
                <button type="button" className="forgot" onClick={handleForgot}>
                  {t("forgot")}
                </button>
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="btn-spinner" aria-hidden="true" />
                    {t("submitLoading")}
                  </>
                ) : (
                  <>
                    {t("submit")}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>


            <p className="legal">
              {/* TODO: lier aux pages légales réelles quand elles existeront */}
              {t.rich("legal", {
                terms: (chunks) => <a href="#">{chunks}</a>,
                privacy: (chunks) => <a href="#">{chunks}</a>,
              })}
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
