import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export function BlogCTA() {
  const t = useTranslations("blog.cta");

  return (
    <section className="bg-grad-ink relative overflow-hidden py-[clamp(56px,7vw,96px)]">
      <div className="glow-blob absolute right-[12%] top-[-60px] h-[300px] w-[300px]" />
      <div className="absolute bottom-[-80px] left-[8%] h-[300px] w-[300px] rounded-full bg-[#E8630A]/10 blur-[80px]" />

      <div className="container-reading relative z-10 text-center">
        <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4DA6D9]/20 text-[#87C4E8]">
          <Mail className="h-6 w-6" />
        </span>
        <h2 className="mb-[18px] font-display text-[clamp(26px,3.6vw,44px)] font-black uppercase leading-[1.1] text-white">
          {t("heading")}
        </h2>
        <p className="mx-auto mb-9 max-w-[560px] text-[16.5px] leading-[1.7] text-[#8AA5BE]">
          {t("description")}
        </p>
        <Button
          asChild
          size="lg"
          className="shadow-cta h-12 rounded-xl bg-[#E8630A] px-[30px] text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#B84D08]"
        >
          <Link href="/contact">
            {t("subscribe")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
