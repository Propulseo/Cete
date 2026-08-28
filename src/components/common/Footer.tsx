import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Mail } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { getNavigation } from "@/lib/data-loader";
import { loadContactInfo } from "@/lib/vitrine-data";

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-5 font-sans text-[0.75rem] font-bold uppercase tracking-[0.12em] text-white">
      {children}
    </h3>
  );
}

// min-h-11 (44px) = cible tactile mobile ; sm:min-h-0 + sm:py-1 restaure la
// densité d'origine sur grand écran, où le pointeur est précis.
const linkClass =
  "inline-flex min-h-11 items-center py-2 text-body leading-6 text-[#8AA5BE] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#87C4E8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A2940] sm:min-h-0 sm:py-1";

export async function Footer() {
  const t = await getTranslations("common.footer");
  const locale = (await getLocale()) as "fr" | "en";
  const navigation = getNavigation(locale);
  const contact = await loadContactInfo(locale);

  return (
    <footer className="relative overflow-hidden border-t border-[rgba(135,196,232,0.15)] bg-[#1A2940] text-[#8AA5BE]">
      {/* Motif de bulles : assez discret pour ne pas gêner la lecture du texte. */}
      <div className="pointer-events-none absolute inset-0 bg-bubbles-pattern opacity-[0.18]" />

      <div className="container-wide relative z-10 py-14 md:py-16">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[44px]">
          {/* Marque */}
          <div className="space-y-5">
            <Link href="/" aria-label={t("logoAriaLabel")} className="inline-block">
              <Image
                src="/assets/brand/logo-cete.png"
                alt={t("logoAlt")}
                height={80}
                width={138}
                className="h-16 w-auto brightness-0 invert"
              />
            </Link>
            <p className="max-w-[280px] text-body leading-7 text-[#8AA5BE]">
              {t("tagline")}
            </p>
            <p className="text-body font-semibold text-[#87C4E8]">{t("motto")}</p>
          </div>

          {/* Navigation */}
          <div>
            <FooterHeading>{t("navigation")}</FooterHeading>
            <nav className="flex flex-col gap-1">
              {navigation.mainNav.map((item) => (
                <Link key={item.href} href={item.href as "/"} className={linkClass}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Légal */}
          <div>
            <FooterHeading>{t("legal")}</FooterHeading>
            <nav className="flex flex-col gap-1">
              {navigation.footerNav.map((item) => (
                <Link key={item.href} href={item.href as "/"} className={linkClass}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <FooterHeading>{t("contact")}</FooterHeading>
            <a href={`mailto:${contact.email}`} className={`${linkClass} gap-2`}>
              <Mail className="h-4 w-4 flex-shrink-0 text-[#87C4E8]" />
              {contact.email}
            </a>
          </div>
        </div>

        {/* Bas de page */}
        <div className="mt-12 flex flex-col gap-2 border-t border-[rgba(135,196,232,0.15)] pt-6 text-xs text-[#8AA5BE] md:flex-row md:items-center md:justify-between md:gap-6">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <p>
            {t("madeBy")}{" "}
            <a
              href="https://propulseo-site.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#87C4E8] underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#87C4E8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A2940]"
            >
              Propul&apos;SEO
            </a>
          </p>
          <p>{t("foundedBy")}</p>
        </div>
      </div>
    </footer>
  );
}
