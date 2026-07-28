"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LayoutDashboard, Building2, FolderOpen, ClipboardCheck, Share2 } from "lucide-react";

interface ClientTabNavProps {
  clientId: string;
}

export function ClientTabNav({ clientId }: ClientTabNavProps) {
  const t = useTranslations("admin.clients.detail");
  const pathname = usePathname();
  const base = `/admin/clients/${clientId}`;

  const tabs = [
    { label: t("overview"), href: base, icon: LayoutDashboard, exact: true },
    { label: t("company"), href: `${base}/societe`, icon: Building2, exact: false },
    { label: t("documents"), href: `${base}/documents`, icon: FolderOpen, exact: false },
    { label: "Espace client", href: `${base}/espace`, icon: Share2, exact: false },
    { label: t("evaluations"), href: `${base}/evaluations`, icon: ClipboardCheck, exact: false },
  ];

  return (
    // Cinq onglets ne tiennent pas dans 360px. Plutôt que de les replier (on perdrait
    // l'alignement de la règle active) on les rend défilables horizontalement, avec un
    // masque en dégradé à droite qui signale qu'il reste des onglets — sans lui, les deux
    // derniers passaient simplement inaperçus. `scrollbar-none` : la barre native masque
    // la règle des 2px sous les libellés.
    <div className="relative border-b bg-card">
      <nav className="flex gap-0 overflow-x-auto scroll-smooth px-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:px-8 [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => {
          const isActive = tab.exact ? pathname.endsWith(clientId) || pathname.endsWith(`${clientId}/`) : pathname.includes(tab.href.split("/").pop()!);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card to-transparent lg:hidden"
      />
    </div>
  );
}
