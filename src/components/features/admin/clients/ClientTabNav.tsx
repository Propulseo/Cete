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
    <div className="border-b bg-card">
      <nav className="flex gap-0 px-8">
        {tabs.map((tab) => {
          const isActive = tab.exact ? pathname.endsWith(clientId) || pathname.endsWith(`${clientId}/`) : pathname.includes(tab.href.split("/").pop()!);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
