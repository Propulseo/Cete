"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getNavigation } from "@/lib/data-loader";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = getNavigation();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#DAEEF8]/90 via-[#F4F9FD]/90 to-[#DAEEF8]/90 backdrop-blur-md border-b border-[#4DA6D9]/10">
      <div className="max-w-[1400px] mx-auto flex h-[72px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" aria-label="Retour à l'accueil CETé">
          <Image
            src="/assets/brand/logo-cete-adn.png"
            alt="CETé ADN — Agence de Notation du Risque Électrique"
            height={48}
            width={200}
            priority
            className="h-16 w-auto sm:h-20"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex ml-28">
          {navigation.mainNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
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

        {/* CTA Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-[#4DA6D9]/30 text-[#4DA6D9] hover:border-[#4DA6D9] hover:bg-[#DAEEF8]"
          >
            <Link href="/connexion">Espace Client</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-[#E8630A] text-white shadow-sm hover:bg-[#B84D08] hover:shadow-md hover:shadow-[#E8630A]/20 transition-all"
          >
            <Link href="/contact">Demander une évaluation</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-[#1A2940]">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 pt-8">
              {navigation.mainNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors ${
                      isActive
                        ? "text-[#1A2940]"
                        : "text-[#4A6580] hover:text-[#1A2940]"
                    }`}
                  >
                    {isActive && (
                      <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#4DA6D9]" />
                    )}
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="border-[#4DA6D9]/30 text-[#4DA6D9]"
                >
                  <Link href="/connexion" onClick={() => setIsOpen(false)}>
                    Espace Client
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-[#E8630A] text-white hover:bg-[#B84D08]"
                >
                  <Link href="/contact" onClick={() => setIsOpen(false)}>
                    Demander une évaluation
                  </Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Subtle branded bottom line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#4DA6D9]/30 to-transparent" />
    </header>
  );
}
