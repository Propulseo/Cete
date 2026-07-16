import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryCTA?: {
    label: string;
    href: string;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
  size?: "default" | "small";
}

export function HeroSection({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  size = "default",
}: HeroSectionProps) {
  const isSmall = size === "small";

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[#002244] ${
        isSmall ? "py-16" : "py-24 md:py-32"
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {subtitle && (
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-accent">
              {subtitle}
            </p>
          )}
          <h1
            className={`font-bold tracking-tight text-white ${
              isSmall ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl lg:text-6xl"
            }`}
          >
            {title}
          </h1>
          {description && (
            <p
              className={`mx-auto mt-6 max-w-2xl text-primary-foreground/80 ${
                isSmall ? "text-base" : "text-lg md:text-xl"
              }`}
            >
              {description}
            </p>
          )}
          {(primaryCTA || secondaryCTA) && (
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {primaryCTA && (
                <Button
                  asChild
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Link href={primaryCTA.href as "/"}>{primaryCTA.label}</Link>
                </Button>
              )}
              {secondaryCTA && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10"
                >
                  <Link href={secondaryCTA.href as "/"}>{secondaryCTA.label}</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
