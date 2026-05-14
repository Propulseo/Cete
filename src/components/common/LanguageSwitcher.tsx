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
    <div className="flex items-center gap-1" role="group" aria-label={t("label")}>
      <button
        onClick={() => switchLocale("fr")}
        className={`px-2 py-1 text-xs font-semibold rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4DA6D9] ${
          locale === "fr"
            ? "bg-[#4DA6D9] text-white"
            : "text-[#4A6580] hover:text-[#1A2940]"
        }`}
        aria-current={locale === "fr" ? "true" : undefined}
      >
        {t("fr")}
      </button>
      <span className="text-[#8AA5BE] text-xs">/</span>
      <button
        onClick={() => switchLocale("en")}
        className={`px-2 py-1 text-xs font-semibold rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4DA6D9] ${
          locale === "en"
            ? "bg-[#4DA6D9] text-white"
            : "text-[#4A6580] hover:text-[#1A2940]"
        }`}
        aria-current={locale === "en" ? "true" : undefined}
      >
        {t("en")}
      </button>
    </div>
  );
}
