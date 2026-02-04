import Link from "next/link";
import { Zap, Mail, Phone, MapPin } from "lucide-react";
import { getNavigation, getContactInfo } from "@/lib/data-loader";

export function Footer() {
  const navigation = getNavigation();
  const contact = getContactInfo();

  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">CETé</span>
                <span className="text-xs text-primary-foreground/70">
                  Conseil Expertise Technique
                </span>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/70">
              Agence de Notation indépendante du risque électrique.
              Transformer la vigilance en énergie collective.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Navigation</h3>
            <nav className="flex flex-col gap-2">
              {navigation.mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-accent"
              >
                <Mail className="h-4 w-4" />
                {contact.email}
              </a>
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-accent"
              >
                <Phone className="h-4 w-4" />
                {contact.phone}
              </a>
              <div className="flex items-start gap-2 text-sm text-primary-foreground/70">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
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
            <h3 className="text-lg font-semibold">Légal</h3>
            <nav className="flex flex-col gap-2">
              {navigation.footerNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-primary-foreground/50 md:flex-row">
            <p>
              © {new Date().getFullYear()} CETé - Conseil Expertise Technique
              Électricité. Tous droits réservés.
            </p>
            <p>
              Fondé par des experts du{" "}
              <span className="text-primary-foreground/70">SERECT</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
