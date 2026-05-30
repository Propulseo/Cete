import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { type BlogPost } from "@/types";
import { brandify } from "@/components/ui/brand-name";
import { VideoEmbed } from "@/components/ui/video-embed";

export function BlogFeatured({ post }: { post: BlogPost }) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8630A]">
            À la une
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-[#E8630A]/30 to-transparent" />
        </div>

        <Link href={`/blog/${post.slug}`} className="group block">
          <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Media - 7 columns */}
            <div className="md:col-span-7">
              {post.videoUrl ? (
                <VideoEmbed url={post.videoUrl} title={post.title} />
              ) : (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-[#1A2940]/10 ring-1 ring-[#DAEEF8]/50">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A2940]/20 to-transparent" />
                </div>
              )}
            </div>

            {/* Content - 5 columns */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full ${post.categoryColor}`}
                />
                <span className="text-sm font-semibold uppercase tracking-wider text-[#4A6580]">
                  {post.category}
                </span>
                <span className="text-[#DAEEF8]">/</span>
                <span className="text-sm text-[#4A6580] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </div>

              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-[#1A2940] leading-snug group-hover:text-[#E8630A] transition-colors duration-300">
                {post.title}
              </h2>

              <p className="text-[#4A6580] leading-relaxed text-lg">
                {brandify(post.excerpt)}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-[#DAEEF8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#4DA6D9] flex items-center justify-center text-white font-semibold text-sm">
                    {post.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A2940]">
                      {post.author}
                    </p>
                    <p className="text-xs text-[#4A6580] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.publishedDate).toLocaleDateString(
                        "fr-FR",
                        { day: "numeric", month: "long", year: "numeric" }
                      )}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#E8630A] group-hover:gap-3 transition-all duration-300">
                  Lire l&apos;article
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
