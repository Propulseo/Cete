import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFounders } from "@/lib/data-loader";
import { User } from "lucide-react";

export function FoundersGrid() {
  const founders = getFounders();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Nos Fondateurs
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            4 experts passionnés, passeurs de prévention
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {founders.map((founder) => (
            <Card
              key={founder.id}
              className="group overflow-hidden border-none bg-white shadow-lg transition-all hover:shadow-xl"
            >
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Photo placeholder */}
                  <div className="relative h-48 w-full bg-gradient-to-br from-primary to-[#002244] sm:h-auto sm:w-48 sm:flex-shrink-0">
                    <div className="flex h-full items-center justify-center">
                      <User className="h-20 w-20 text-white/50" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <h3 className="text-xl font-bold text-foreground">
                      {founder.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-primary">
                      {founder.role}
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {founder.bio}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {founder.specialties.map((specialty, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
