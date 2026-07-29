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
    // Cinq onglets ne tiennent pas sur une ligne à 360px. Le défilement horizontal a été
    // écarté : il cache des onglets, et un glissement latéral pendant qu'on parcourt la
    // page verticalement est désorientant. On replie donc en grille — deux colonnes au
    // téléphone, trois en tablette, une seule ligne à partir de lg. Chaque onglet garde
    // son libellé, rien n'est masqué, et le repère d'état actif passe du soulignement
    // (illisible en grille) à un aplat léger doublé d'un liseré à gauche.
    <div className="border-b bg-card">
      <nav className="grid grid-cols-2 gap-1 p-2 sm:grid-cols-3 lg:flex lg:gap-0 lg:p-0 lg:px-8">
        {tabs.map((tab) => {
          const isActive = tab.exact ? pathname.endsWith(clientId) || pathname.endsWith(`${clientId}/`) : pathname.includes(tab.href.split("/").pop()!);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors lg:min-h-0 lg:rounded-none lg:border-b-2 lg:px-4 lg:py-3 ${
                isActive
                  ? "bg-primary/[0.08] text-primary lg:border-primary lg:bg-transparent"
                  : "text-muted-foreground hover:text-foreground lg:border-transparent lg:hover:border-muted-foreground/30"
              }`}
            >
              {isActive && (
                <span aria-hidden className="absolute inset-y-1.5 left-0 w-[3px] rounded-r bg-primary lg:hidden" />
              )}
              <tab.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
