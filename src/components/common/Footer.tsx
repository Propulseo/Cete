import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Mail } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { getNavigation } from "@/lib/data-loader";
import { loadContactInfo } from "@/lib/vitrine-data";

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-white">
      {children}
      <span className="mt-2 block h-0.5 w-8 rounded-full bg-[#E8630A]" />
    </h3>
  );
}

const linkClass =
  "inline-flex items-center py-1 text-sm text-white/70 transition-colors hover:text-white";

export async function Footer() {
  const t = await getTranslations("common.footer");
  const locale = (await getLocale()) as "fr" | "en";
  const navigation = getNavigation(locale);
  const contact = await loadContactInfo(locale);

  return (
    <footer className="relative border-t border-white/10 bg-[#1A2940] text-white overflow-hidden">
      {/* Motif de bulles : assez discret pour ne pas gêner la lecture du texte. */}
      <div className="absolute inset-0 bg-bubbles-pattern opacity-25 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-12 py-14 md:py-16">
        {/* 2 colonnes dès le mobile : empiler les 4 blocs rendait le footer

            interminable. La marque garde plus de large que les colonnes de liens. */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-[1.7fr_1fr_1fr_1fr] lg:gap-12">
          {/* Marque */}
          <div className="col-span-2 space-y-4 lg:col-span-1 lg:max-w-xs">
            <Link href="/" aria-label={t("logoAriaLabel")} className="inline-block">
              <Image
                src="/assets/brand/logo-cete.svg"
                alt={t("logoAlt")}
                height={80}
                width={138}
                className="h-16 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/70">{t("tagline")}</p>
            {/* #F59542 (orange clair de la charte) : l'orange vif ne passait pas
                le contraste AA sur le bleu nuit. */}
            <p className="text-sm font-medium italic text-[#F59542]">{t("motto")}</p>
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
          <div className="col-span-2 lg:col-span-1">
            <FooterHeading>{t("contact")}</FooterHeading>
            <a href={`mailto:${contact.email}`} className={`${linkClass} gap-2`}>
              <Mail className="h-4 w-4 flex-shrink-0 text-[#F59542]" />
              {contact.email}
            </a>
          </div>
        </div>

        {/* Bas de page */}
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/65 md:flex-row md:items-center md:justify-between md:gap-6">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <p>
            {t("madeBy")}{" "}
            <a
              href="https://propulseo-site.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
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
