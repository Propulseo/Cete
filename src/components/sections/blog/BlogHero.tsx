import { Newspaper } from "lucide-react";
import { useTranslations } from "next-intl";

export function BlogHero({ count }: { count?: number }) {
  const t = useTranslations("blog.hero");

  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="glow-blob absolute left-[8%] top-5 h-80 w-80" />

      <div className="container-reading relative z-10 pt-[clamp(24px,2.5vw,40px)] pb-[clamp(44px,5vw,72px)] text-center">
        <p className="type-kicker mb-6 inline-flex items-center gap-[9px] rounded-full border border-[#4DA6D9]/35 bg-white/65 px-[18px] py-[9px] text-[#1A7AB5] backdrop-blur-sm animate-slide-up">
          <span className="h-2 w-2 rounded-full bg-[#E8630A] shadow-[0_0_0_3px_rgba(232,99,10,0.18)]" />
          {t("badge")}
        </p>

        <h1 className="mb-5 font-display text-[clamp(30px,4.4vw,56px)] font-black uppercase leading-[1.06] text-[#1A2940] animate-slide-up animation-delay-100">
          {t("headingStart")} &amp; {t("headingEnd")}
        </h1>
        <p className="mx-auto mb-[22px] max-w-[660px] text-lead leading-[1.75] text-[#4A6580] animate-slide-up animation-delay-200">
          {t("description")}
        </p>

        {typeof count === "number" && count > 0 && (
          <p className="inline-flex items-center gap-[9px] text-note font-semibold text-[#0D5A8A] animate-slide-up animation-delay-300">
            <Newspaper className="h-4 w-4" />
            {t("count", { count })}
          </p>
        )}
      </div>
    </section>
  );
}
