"use client";

import { Link, usePathname } from "@/i18n/navigation";
import Image from "next/image";
import type { Pathnames } from "@/i18n/routing";
import { useState } from "react";
import { Menu, User } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { getNavigation } from "@/lib/data-loader";

export function Header() {
  const t = useTranslations("common.header");
  const tLang = useTranslations("common.languageSwitcher");
  const locale = useLocale() as "fr" | "en";
  const [isOpen, setIsOpen] = useState(false);
  const navigation = getNavigation(locale);
  // Le bouton "Demander une évaluation" couvre déjà le besoin : on retire
  // le lien Contact de la navigation du header (il reste présent dans le footer).
  const mainNav = navigation.mainNav.filter((item) => item.href !== "/contact");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#DAEEF8]/90 via-[#F4F9FD]/90 to-[#DAEEF8]/90 backdrop-blur-md border-b border-[#4DA6D9]/[0.18]">
      <div className="container-wide flex h-[76px] items-center justify-between">
        {/* Logo */}
        <Link href="/" aria-label={t("logoAriaLabel")}>
          <Image
            src="/assets/brand/logo-cete.png"
            alt={t("logoAlt")}
            height={80}
            width={139}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center lg:flex lg:gap-[30px] xl:ml-28">
          {mainNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href as "/"}
                className={`relative py-1 text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:bg-[#E8630A] after:transition-all after:duration-300 ${
                  isActive
                    ? "text-[#1A2940] after:w-full"
                    : "text-[#4A6580] after:w-0 hover:text-[#1A2940] hover:after:w-full"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Buttons + Language */}
        <div className="hidden items-center gap-2 lg:flex xl:gap-3">
          <LanguageSwitcher />
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-[#4DA6D9]/40 text-[#4DA6D9] hover:border-[#4DA6D9] hover:bg-[#DAEEF8] xl:h-11"
          >
            <Link
              href="/connexion"
              title={t("clientArea")}
              aria-label={t("clientArea")}
            >
              <User className="h-5 w-5 xl:mr-2" />
              <span className="hidden xl:inline">{t("clientArea")}</span>
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-[#E8630A] text-white shadow-sm hover:bg-[#B84D08] hover:shadow-md hover:shadow-[#E8630A]/20 transition-all xl:h-11"
          >
            <Link href="/contact">{t("requestEvaluation")}</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="size-11 text-[#1A2940]">
              <Menu className="h-6 w-6" />
              <span className="sr-only">{t("menu")}</span>
            </Button>
          </SheetTrigger>
          {/* Panneau en trois bandes : marque + fermeture / navigation défilante /
              actions en pied. Les deux CTA vivent en bas parce que c'est là que tombe
              le pouce sur un grand téléphone — et parce que « Demander une évaluation »
              est la conversion du site, elle ne doit pas se mériter au scroll. */}
          <SheetContent
            side="right"
            className="w-[min(88vw,340px)] gap-0 border-l-[#4DA6D9]/15 bg-[#F4F9FD] p-0 sm:max-w-none"
          >
            <SheetHeader className="border-b-[#4DA6D9]/15">
              <SheetTitle className="sr-only">{t("menu")}</SheetTitle>
              <Image
                src="/assets/brand/logo-cete.png"
                alt={t("logoAlt")}
                height={80}
                width={139}
                className="h-10 w-auto"
              />
            </SheetHeader>

            <SheetBody>
              <nav className="px-3 py-3">
                {mainNav.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href as "/"}
                      onClick={() => setIsOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative flex min-h-[52px] items-center rounded-lg px-4 text-[1.0625rem] transition-colors ${
                        isActive
                          ? "bg-[#4DA6D9]/[0.10] font-semibold text-[#1A2940]"
                          : "font-medium text-[#4A6580] active:bg-[#4DA6D9]/[0.06]"
                      }`}
                    >
                      {/* Repère d'état actif : un liseré vertical, comme dans les
                          portails — plus lisible qu'une pastille qui décale le libellé. */}
                      {isActive && (
                        <span
                          aria-hidden
                          className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-[#4DA6D9]"
                        />
                      )}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetBody>

            <SheetFooter className="gap-3 border-t-[#4DA6D9]/15 px-4 pt-4">
              <Button
                asChild
                className="h-12 w-full bg-[#E8630A] text-base text-white shadow-sm hover:bg-[#B84D08]"
              >
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  {t("requestEvaluation")}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 w-full border-[#4DA6D9]/40 text-base text-[#1A7AB5] hover:bg-[#DAEEF8]"
              >
                <Link href="/connexion" onClick={() => setIsOpen(false)}>
                  <User className="mr-2 h-4 w-4" />
                  {t("clientArea")}
                </Link>
              </Button>
              <div className="flex items-center justify-between border-t border-[#4DA6D9]/15 pt-3">
                <span className="text-xs font-medium uppercase tracking-[0.06em] text-[#8AA5BE]">
                  {tLang("short")}
                </span>
                <LanguageSwitcher />
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
