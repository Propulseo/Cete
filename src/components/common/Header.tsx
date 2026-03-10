"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getNavigation } from "@/lib/data-loader";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = getNavigation();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-[72px] items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4DA6D9] transition-shadow group-hover:shadow-md group-hover:shadow-[#4DA6D9]/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl tracking-wide text-[#1A2940]">
              CETé
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.15em] text-[#4A6580] sm:block">
              Agence de Notation
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
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

      {/* Branded bottom line */}
      <div className="h-[2px] bg-gradient-to-r from-[#4DA6D9] via-[#1A7AB5] to-[#4DA6D9]/20" />
    </header>
  );
}
