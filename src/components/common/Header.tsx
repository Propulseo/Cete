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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#001a33] transition-shadow group-hover:shadow-md group-hover:shadow-[#001a33]/20">
            <Zap className="h-5 w-5 text-[#EC8D19]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl tracking-wide text-[#001a33]">
              CETé
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.15em] text-[#6A6D6A] sm:block">
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
                className={`relative py-1 text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:bg-[#EC8D19] after:transition-all after:duration-300 ${
                  isActive
                    ? "text-[#001a33] after:w-full"
                    : "text-[#2A2D2A]/65 after:w-0 hover:text-[#001a33] hover:after:w-full"
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
            className="border-[#001a33]/15 text-[#001a33] hover:border-[#001a33]/30 hover:bg-[#001a33]/5"
          >
            <Link href="/connexion">Espace Client</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-[#EC8D19] text-white shadow-sm hover:bg-[#D07D15] hover:shadow-md hover:shadow-[#EC8D19]/20 transition-all"
          >
            <Link href="/contact">Demander une évaluation</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-[#001a33]">
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
                        ? "text-[#001a33]"
                        : "text-[#2A2D2A]/70 hover:text-[#001a33]"
                    }`}
                  >
                    {isActive && (
                      <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#EC8D19]" />
                    )}
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="border-[#001a33]/15 text-[#001a33]"
                >
                  <Link href="/connexion" onClick={() => setIsOpen(false)}>
                    Espace Client
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-[#EC8D19] text-white hover:bg-[#D07D15]"
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
      <div className="h-[2px] bg-gradient-to-r from-[#001a33] via-[#EC8D19] to-[#001a33]/20" />
    </header>
  );
}
