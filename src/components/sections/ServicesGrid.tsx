import Link from "next/link";
import {
  ClipboardCheck,
  Star,
  Award,
  Bell,
  Users,
  Zap,
  HardHat,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Service } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  "clipboard-check": <ClipboardCheck className="h-6 w-6" />,
  star: <Star className="h-6 w-6" />,
  award: <Award className="h-6 w-6" />,
  bell: <Bell className="h-6 w-6" />,
  users: <Users className="h-6 w-6" />,
  zap: <Zap className="h-6 w-6" />,
  "hard-hat": <HardHat className="h-6 w-6" />,
  "book-open": <BookOpen className="h-6 w-6" />,
};

interface ServicesGridProps {
  services: Service[];
  title?: string;
  subtitle?: string;
}

export function ServicesGrid({ services, title, subtitle }: ServicesGridProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="mb-12 text-center">
            {title && (
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {services.map((service) => (
            <Card
              key={service.id}
              className="group overflow-hidden border-none bg-white shadow-lg transition-all hover:shadow-xl"
            >
              <CardHeader className="pb-4">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  {iconMap[service.icon]}
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <p className="text-sm text-primary font-medium">
                  {service.shortDescription}
                </p>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  {service.description}
                </p>
                <ul className="mb-6 space-y-2">
                  {service.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/contact">En savoir plus</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
