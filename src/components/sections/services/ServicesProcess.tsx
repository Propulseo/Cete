"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Pencil, Rocket, TrendingUp, Target } from "lucide-react";

export function ServicesProcess() {
  const t = useTranslations("services.process");
  const [activeStep, setActiveStep] = useState(0);

  const processSteps = [
    {
      icon: <Search className="h-6 w-6" />,
      title: t("step1Title"),
      description: t("step1Desc"),
      number: "01",
    },
    {
      icon: <Pencil className="h-6 w-6" />,
      title: t("step2Title"),
      description: t("step2Desc"),
      number: "02",
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: t("step3Title"),
      description: t("step3Desc"),
      number: "03",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: t("step4Title"),
      description: t("step4Desc"),
      number: "04",
    },
  ];

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
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8630A]/30 bg-[#E8630A]/10 px-4 py-2 mb-8">
            <Target className="h-4 w-4 text-[#E8630A]" />
            <span className="text-sm font-medium text-[#E8630A]">{t("badge")}</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1A2940] tracking-wide mb-6">
            {t("heading")}
          </h2>
          <p className="text-lg text-[#4A6580] max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="hidden md:block">
            <div className="relative mb-8">
              <div className="absolute top-8 left-0 right-0 h-1 bg-[#DAEEF8] rounded-full" />
              <div
                className="absolute top-8 left-0 h-1 bg-gradient-to-r from-[#4DA6D9] to-[#1A7AB5] rounded-full transition-all duration-500"
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
                          ? "bg-[#4DA6D9] text-white scale-110 shadow-lg shadow-[#4DA6D9]/30"
                          : index < activeStep
                          ? "bg-[#1A7AB5] text-white"
                          : "bg-[#F4F9FD] text-[#8AA5BE]"
                      }`}
                    >
                      {step.icon}
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-[#E8630A] text-sm font-bold mb-2 block">
                      {step.number}
                    </span>
                    <h3 className="text-[#1A2940] font-bold text-lg mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[#4A6580] text-sm leading-relaxed">
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
                  index === activeStep ? "bg-[#F4F9FD]" : "bg-transparent"
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                    index === activeStep
                      ? "bg-[#4DA6D9] text-white"
                      : "bg-[#F4F9FD] text-[#8AA5BE]"
                  }`}
                >
                  {step.icon}
                </div>
                <div>
                  <span className="text-[#E8630A] text-xs font-bold">{step.number}</span>
                  <h3 className="text-[#1A2940] font-bold">{step.title}</h3>
                  <p className="text-[#4A6580] text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
