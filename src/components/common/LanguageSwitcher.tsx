"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common.languageSwitcher");

  function switchLocale(next: Locale) {
    if (next === locale) return;
    router.replace(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { pathname: pathname as any },
      { locale: next }
    );
  }

  return (
    <div
      className="flex items-center gap-1 rounded-lg bg-[#4DA6D9]/[0.08] p-1"
      role="group"
      aria-label={t("label")}
    >
      <button
        onClick={() => switchLocale("fr")}
        className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-[11px] py-[7px] text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8630A] lg:min-h-0 lg:min-w-0 ${
          locale === "fr"
            ? "bg-[#1A2940] text-white"
            : "text-[#4A6580] hover:text-[#1A2940]"
        }`}
        aria-current={locale === "fr" ? "true" : undefined}
      >
        {t("fr")}
      </button>
      <button
        onClick={() => switchLocale("en")}
        className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-[11px] py-[7px] text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8630A] lg:min-h-0 lg:min-w-0 ${
          locale === "en"
            ? "bg-[#1A2940] text-white"
            : "text-[#4A6580] hover:text-[#1A2940]"
        }`}
        aria-current={locale === "en" ? "true" : undefined}
      >
        {t("en")}
      </button>
    </div>
  );
}
