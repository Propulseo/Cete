import { Zap, Star, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getPillars } from "@/lib/data-loader";

const iconMap: Record<string, React.ReactNode> = {
  zap: <Zap className="h-8 w-8" />,
  star: <Star className="h-8 w-8" />,
  users: <Users className="h-8 w-8" />,
};

const colorMap: Record<string, string> = {
  blue: "bg-primary text-white",
  yellow: "bg-accent text-accent-foreground",
  green: "bg-green-600 text-white",
};

export function PillarsSection() {
  const pillars = getPillars();

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            En un regard
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Nos trois piliers fondamentaux
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {pillars.map((pillar) => (
            <Card
              key={pillar.id}
              className="group relative overflow-hidden border-none bg-white shadow-lg transition-all hover:shadow-xl"
            >
              <CardContent className="p-8">
                <div
                  className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl ${colorMap[pillar.color]}`}
                >
                  {iconMap[pillar.icon]}
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </CardContent>
              {/* Accent bar */}
              <div
                className={`absolute bottom-0 left-0 h-1 w-full ${
                  pillar.color === "blue"
                    ? "bg-primary"
                    : pillar.color === "yellow"
                    ? "bg-accent"
                    : "bg-green-600"
                }`}
              />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
