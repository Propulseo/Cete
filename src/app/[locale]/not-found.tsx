import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

// 404 localisée rendue dans le layout [locale] (html/body + provider intl).
// Les URLs inconnues y arrivent via le catch-all [...rest]/page.tsx.
export default async function NotFound() {
  const t = await getTranslations("notFound");

  const links = [
    { href: "/expertise", label: t("linkExpertise") },
    { href: "/services", label: t("linkServices") },
    { href: "/blog", label: t("linkBlog") },
    { href: "/contact", label: t("linkContact") },
  ] as const;

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-[#F4F9FD] px-4 py-24 text-center">
      <p className="font-display text-8xl font-bold text-[#4DA6D9]">404</p>
      <h1 className="mt-6 font-display text-3xl text-[#1A2940] md:text-4xl">
        {t("title")}
      </h1>
      <div className="mt-4 h-1 w-24 rounded-full bg-[#E8630A]" />
      <p className="mt-6 max-w-md text-lg text-[#4A6580]">{t("description")}</p>
      <Link
        href="/"
        className="mt-10 rounded-full bg-[#1A7AB5] px-8 py-3 font-medium text-white transition-colors hover:bg-[#0D5A8A]"
      >
        {t("backHome")}
      </Link>
      <p className="mt-12 text-sm font-medium uppercase tracking-wide text-[#8AA5BE]">
        {t("linksLabel")}
      </p>
      <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[#1A7AB5] underline-offset-4 hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
