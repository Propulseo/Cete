import { Shield, Lock, Heart, Target } from "lucide-react";
import { getValues } from "@/lib/data-loader";

const iconMap: Record<string, React.ReactNode> = {
  shield: <Shield className="h-6 w-6" />,
  lock: <Lock className="h-6 w-6" />,
  heart: <Heart className="h-6 w-6" />,
  target: <Target className="h-6 w-6" />,
};

export function ValuesSection() {
  const values = getValues();

  return (
    <section className="bg-secondary py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Notre ADN : Indépendance & Confidentialité
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Les valeurs qui guident notre engagement quotidien
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.id}
              className="group rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
                {iconMap[value.icon]}
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground">
                {value.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
