"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Play, Quote, ChevronDown, ChevronUp } from "lucide-react";
import { brandify } from "@/components/ui/brand-name";

export function HomeTestimonials() {
  const t = useTranslations("home.testimonials");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="section-pad relative overflow-hidden bg-gradient-to-b from-[#F4F9FD] to-white">
      {/* Decorative bubbles */}
      <div className="glow-blob absolute left-[10%] top-20 h-[300px] w-[300px]" />
      <div className="glow-blob absolute bottom-20 right-[10%] h-[400px] w-[400px] bg-[#87C4E8]/10" />

      <div className="container-page relative z-10">
        {/* Section header */}
        <div className="mx-auto mb-12 max-w-[660px] text-center">
          <span className="type-kicker mb-4 inline-flex rounded-full bg-[#4DA6D9]/[0.12] px-4 py-2 text-[#1A2940]">
            {t("badge")}
          </span>
          <h2 className="type-h2-section text-[#1A2940]">
            {t("heading")}
          </h2>
        </div>

        {/* Featured testimonial card */}
        <div className="mx-auto max-w-[1100px]">
          <div className="overflow-hidden rounded-3xl border border-subtle bg-white shadow-cete-xl">
            {/* Video + Pull quote row */}
            <div className="grid md:grid-cols-5">
              {/* Video area - 3/5 */}
              <div className="md:col-span-3 relative">
                <div className="bg-grad-ink relative min-h-[300px] overflow-hidden md:aspect-video">
                  {/* Subtle grid texture */}
                  <div
                    className="absolute inset-0 opacity-[0.22]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
                      backgroundSize: "48px 48px",
                    }}
                  />

                  {/* Ambient glow */}
                  <div className="absolute left-1/3 top-1/3 h-72 w-72 rounded-full bg-[#4DA6D9]/15 blur-3xl" />
                  <div className="absolute bottom-1/4 right-1/4 h-52 w-52 rounded-full bg-[#E8630A]/10 blur-3xl" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 group">
                    <div className="relative">
                      {/* Pulse ring */}
                      <span className="absolute inset-[-12px] rounded-full border-2 border-white/20 animate-ping [animation-duration:2.5s]" />
                      <span className="absolute inset-[-12px] rounded-full border border-white/10" />
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E8630A] shadow-[0_18px_44px_-12px_rgba(232,99,10,0.55)] transition-all duration-300 group-hover:scale-105">
                        <Play className="ml-1 h-8 w-8 text-white" fill="white" />
                      </div>
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white/55">
                      {t("viewTestimonial")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pull quote - 2/5 */}
              <div className="flex flex-col justify-center bg-gradient-to-br from-white to-[#F4F9FD] p-7 md:col-span-2 lg:p-10">
                <Quote className="mb-4 h-14 w-14 -scale-x-100 text-[#E8630A]/20" />

                <blockquote className="font-display text-xl italic leading-[1.45] text-[#1A2940] lg:text-[1.35rem]">
                  {brandify(t("pullQuote"))}
                </blockquote>
              </div>
            </div>

            {/* Full text + author */}
            <div className="border-t border-[#DAEEF8] px-7 py-9 lg:px-12">
              <div className="max-w-4xl">
                {/* Expandable text */}
                <div
                  className={`relative overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                    isExpanded ? "max-h-[800px]" : "max-h-[120px]"
                  }`}
                >
                  {[t("paragraph1"), t("paragraph2"), t("paragraph3"), t("paragraph4")].filter(Boolean).map((p, i) => (
                    <p
                      key={i}
                      className="mb-4 leading-[1.7] text-[#4A6580] last:mb-0"
                    >
                      {brandify(p)}
                    </p>
                  ))}

                  {/* Fade when collapsed */}
                  {!isExpanded && (
                    <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsExpanded((v) => !v)}
                  className="group mt-4 flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-[#E8630A] transition-colors hover:text-[#B84D08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8630A] focus-visible:ring-offset-2 sm:min-h-0"
                >
                  {isExpanded ? (
                    <>
                      {t("collapse")}
                      <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                    </>
                  ) : (
                    <>
                      {t("readFull")}
                      <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              {/* Author bar */}
              <div className="mt-8 flex items-center gap-4 border-t border-[#DAEEF8] pt-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-grad-ink text-lg font-bold text-white shadow-cete-md">
                  {t("authorName")
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="font-semibold text-[#1A2940] text-lg">
                    {t("authorName")}
                  </div>
                  <div className="text-[#4A6580]">
                    {t("authorRole")} - {t("authorCompany")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
