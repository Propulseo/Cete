import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { type BlogPost } from "@/types";

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="py-16 md:py-20 bg-[#F4F9FD] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#4DA6D9]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-12">
          <h2 className="font-display text-2xl md:text-3xl text-[#1A2940]">
            Derniers articles
          </h2>
          <div className="flex-1 h-px bg-[#DAEEF8]" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="h-full bg-white rounded-2xl border border-[#DAEEF8] overflow-hidden hover:shadow-xl hover:shadow-[#1A2940]/[0.06] hover:border-transparent transition-all duration-500">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A2940]/30 via-transparent to-transparent" />
                  {/* Category badge on image */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm">
                    <span
                      className={`w-2 h-2 rounded-full ${post.categoryColor}`}
                    />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#1A2940]">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 space-y-4 flex flex-col flex-1">
                  <h3 className="font-display text-xl md:text-2xl text-[#1A2940] leading-snug group-hover:text-[#E8630A] transition-colors duration-300">
                    {post.title}
                  </h3>

                  <p className="text-[#4A6580] leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-[#DAEEF8]/60">
                    <div className="flex items-center gap-4 text-xs text-[#4A6580]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.publishedDate).toLocaleDateString(
                          "fr-FR",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#E8630A] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
