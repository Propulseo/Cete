import { Mail, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function BlogCTA() {
  const t = useTranslations("blog.cta");
  return (
    <section className="py-24 bg-gradient-to-br from-[#1A2940] via-[#0D5A8A] to-[#1A2940] relative overflow-hidden">
      <div className="absolute top-10 left-10 w-64 h-64 bg-[#4DA6D9]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#1A2940]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E8630A] mb-8 animate-pulse-glow">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-6">
            {t("heading")}
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
            {t("description")}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#E8630A] text-white hover:bg-[#B84D08] text-lg px-10 py-6 font-semibold rounded-xl shadow-lg shadow-[#E8630A]/20 hover:shadow-xl hover:shadow-[#E8630A]/30 transition-all duration-300"
          >
            <Link href="/contact">
              {t("subscribe")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
