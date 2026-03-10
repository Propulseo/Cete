import Link from "next/link";
import { Zap, Mail, Phone, MapPin } from "lucide-react";
import { getNavigation, getContactInfo } from "@/lib/data-loader";

export function Footer() {
  const navigation = getNavigation();
  const contact = getContactInfo();

  return (
    <footer className="relative border-t border-[#E2E4E0] bg-[#001a33] text-white overflow-hidden">
      {/* Bubbles pattern overlay */}
      <div className="absolute inset-0 bg-bubbles-pattern opacity-40 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">CETé</span>
                <span className="text-xs text-white/60">
                  Agence de Notation
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Agence de Notation indépendante du risque électrique.
            </p>
            <p className="text-sm font-medium text-[#EC8D19]/80 italic">
              Indépendance. Objectivité. Transparence.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Navigation</h3>
            <nav className="flex flex-col gap-2">
              {navigation.mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-white/55 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Contact</h3>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 text-[#EC8D19]/60" />
                {contact.email}
              </a>
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 text-[#EC8D19]/60" />
                {contact.phone}
              </a>
              <div className="flex items-start gap-2 text-sm text-white/55">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#EC8D19]/60" />
                <span>
                  {contact.address}
                  <br />
                  {contact.city}
                </span>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Légal</h3>
            <nav className="flex flex-col gap-2">
              {navigation.footerNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-white/55 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/40 md:flex-row">
            <p>
              © {new Date().getFullYear()} CETé — Agence de Notation du Risque
              Électrique. Tous droits réservés.
            </p>
            <p className="md:-ml-40">
              Fait avec passion par{" "}
              <a
                href="https://propulseo-site.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/55 transition-colors hover:text-white"
              >
                Propul&apos;SEO
              </a>
            </p>
            <p>
              Fondé par des experts du{" "}
              <span className="text-white/55">SERECT</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
