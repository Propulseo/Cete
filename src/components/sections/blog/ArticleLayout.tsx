import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogCTA } from "@/components/sections/blog";

export interface ArticleMeta {
  title: string;
  titleHighlight?: string;
  metaDescription: string;
  author: { name: string; initials: string; role: string };
  category: string;
  categoryColor: string;
  publishedDate: string;
  readTime: string;
  imageUrl: string;
  imageAlt: string;
  imageCaption?: string;
}

export function ArticleLayout({
  meta,
  children,
}: {
  meta: ArticleMeta;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#1A2940] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 50%, rgba(77,166,217,0.08), transparent 50%),
              radial-gradient(ellipse at 70% 30%, rgba(26,41,64,0.4), transparent 50%)
            `,
          }}
        />
        <div className="absolute top-10 right-20 w-48 h-48 rounded-full bg-[#4DA6D9]/8 blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-[#1A2940]/20 blur-3xl animate-float animation-delay-300" />

        <div className="relative z-10 container mx-auto px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Retour au blog</span>
          </Link>

          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${meta.categoryColor}`} />
              <span className="text-sm font-semibold uppercase tracking-wider text-[#E8630A]">
                {meta.category}
              </span>
              <span className="text-white/20">/</span>
              <span className="text-sm text-white/50 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {meta.readTime}
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-6">
              {meta.title}{" "}
              {meta.titleHighlight && (
                <span className="text-gradient-accent">{meta.titleHighlight}</span>
              )}
            </h1>

            <p className="text-lg md:text-xl text-white/60 max-w-3xl leading-relaxed mb-8">
              {meta.metaDescription}
            </p>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E8630A] flex items-center justify-center text-white font-semibold">
                {meta.author.initials}
              </div>
              <div>
                <p className="text-white font-semibold">{meta.author.name}</p>
                <p className="text-white/40 text-sm flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(meta.publishedDate).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#FFFFFF" />
          </svg>
        </div>
      </section>

      {/* Article Body */}
      <article className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Featured image */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12 shadow-xl shadow-[#1A2940]/10 ring-1 ring-[#DAEEF8]/50">
              <Image
                src={meta.imageUrl}
                alt={meta.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A2940]/20 to-transparent" />
              {meta.imageCaption && (
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs text-white/70 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5 inline-block">
                    {meta.imageCaption}
                  </p>
                </div>
              )}
            </div>

            {children}

            {/* Author bio */}
            <div className="border-t border-[#DAEEF8] pt-10 mt-12">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#E8630A] flex items-center justify-center text-white font-display text-xl shrink-0">
                  {meta.author.initials}
                </div>
                <div>
                  <p className="text-xs text-[#4A6580] uppercase tracking-wider mb-1">Auteur</p>
                  <p className="font-display text-lg text-[#1A2940] mb-1">{meta.author.name}</p>
                  <p className="text-sm text-[#4A6580] leading-relaxed">{meta.author.role}</p>
                </div>
              </div>
            </div>

            {/* Back to blog */}
            <div className="mt-12 pt-8 border-t border-[#DAEEF8] text-center">
              <Button
                asChild
                variant="outline"
                className="border-[#DAEEF8] text-[#1A2940] hover:bg-[#F4F9FD] hover:border-[#4DA6D9]/30"
              >
                <Link href="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux articles
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </article>

      <BlogCTA />
    </>
  );
}

export function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6 mt-12 first:mt-0">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#4DA6D9]/10 text-[#4DA6D9]">
        {icon}
      </div>
      <h2 className="font-display text-xl md:text-2xl text-[#1A2940]">{title}</h2>
    </div>
  );
}
