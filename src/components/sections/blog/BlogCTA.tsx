import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BlogCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#001a33] via-[#002244] to-[#001a33] relative overflow-hidden">
      <div className="absolute top-10 left-10 w-64 h-64 bg-[#EC8D19]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#001a33]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#EC8D19] mb-8 animate-pulse-glow">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-6">
            RESTEZ INFORMÉ
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
            Recevez nos analyses et décryptages directement dans votre boîte
            mail. Une veille experte sur le risque électrique.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#EC8D19] text-white hover:bg-[#D07D15] text-lg px-10 py-6 font-semibold rounded-xl shadow-lg shadow-[#EC8D19]/20 hover:shadow-xl hover:shadow-[#EC8D19]/30 transition-all duration-300"
          >
            <Link href="/contact">
              S&apos;inscrire à la newsletter
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
