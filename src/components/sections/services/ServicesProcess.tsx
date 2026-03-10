"use client";

import { useEffect, useState } from "react";
import { Search, Pencil, Rocket, TrendingUp, Target } from "lucide-react";

const processSteps = [
  {
    icon: <Search className="h-6 w-6" />,
    title: "Diagnostic",
    description: "Analyse approfondie de votre situation actuelle et identification des besoins",
    number: "01",
  },
  {
    icon: <Pencil className="h-6 w-6" />,
    title: "Conception",
    description: "Élaboration d'un plan d'action sur mesure adapté à vos enjeux",
    number: "02",
  },
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "Déploiement",
    description: "Mise en œuvre accompagnée des solutions avec support terrain",
    number: "03",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Suivi",
    description: "Mesure des résultats et optimisation continue des performances",
    number: "04",
  },
];

export function ServicesProcess() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % processSteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EC8D19]/30 bg-[#EC8D19]/10 px-4 py-2 mb-8">
            <Target className="h-4 w-4 text-[#EC8D19]" />
            <span className="text-sm font-medium text-[#EC8D19]">Méthodologie</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#001a33] tracking-wide mb-6">
            NOTRE{" "}
            <span className="text-[#EC8D19]">APPROCHE</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Un accompagnement structuré en 4 étapes pour des résultats durables
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="hidden md:block">
            <div className="relative mb-8">
              <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 rounded-full" />
              <div
                className="absolute top-8 left-0 h-1 bg-gradient-to-r from-[#EC8D19] to-[#D07D15] rounded-full transition-all duration-500"
                style={{ width: `${((activeStep + 1) / processSteps.length) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-4 gap-6">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer transition-all duration-500 ${
                    index <= activeStep ? "opacity-100" : "opacity-40"
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="flex justify-center mb-6">
                    <div
                      className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                        index === activeStep
                          ? "bg-[#EC8D19] text-white scale-110 shadow-lg shadow-[#EC8D19]/30"
                          : index < activeStep
                          ? "bg-[#001a33] text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step.icon}
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-[#EC8D19] text-sm font-bold mb-2 block">
                      {step.number}
                    </span>
                    <h3 className="text-[#001a33] font-bold text-lg mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:hidden space-y-6">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${
                  index === activeStep ? "bg-gray-50" : "bg-transparent"
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                    index === activeStep
                      ? "bg-[#EC8D19] text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.icon}
                </div>
                <div>
                  <span className="text-[#EC8D19] text-xs font-bold">{step.number}</span>
                  <h3 className="text-[#001a33] font-bold">{step.title}</h3>
                  <p className="text-gray-500 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
