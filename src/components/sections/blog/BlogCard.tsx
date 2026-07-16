import Image from "next/image";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { type BlogPost } from "@/types";
import { brandify } from "@/components/ui/brand-name";
import { VideoEmbed } from "@/components/ui/video-embed";

function CategoryBadge({ post }: { post: BlogPost }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
      <span className={`w-2 h-2 rounded-full ${post.categoryColor}`} />
      <span className="text-xs font-semibold uppercase tracking-wider text-[#1A2940]">
        {post.category}
      </span>
    </div>
  );
}

export function BlogCard({ post }: { post: BlogPost }) {
  const locale = useLocale();
  return (
    <Link
      href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
      className="group"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#DAEEF8] bg-white transition-all duration-500 hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-[#1A2940]/[0.07]">
        {/* Media */}
        {post.videoUrl ? (
          <div className="p-4 pb-0">
            <VideoEmbed url={post.videoUrl} title={post.title} />
          </div>
        ) : (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.imageAlt ?? post.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A2940]/30 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <CategoryBadge post={post} />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col space-y-4 p-6 md:p-8">
          {post.videoUrl && (
            <div>
              <CategoryBadge post={post} />
            </div>
          )}

          <h3 className="font-display text-xl md:text-2xl text-[#1A2940] leading-snug transition-colors duration-300 group-hover:text-[#E8630A]">
            {post.title}
          </h3>

          <p className="line-clamp-3 flex-1 leading-relaxed text-[#4A6580]">
            {brandify(post.excerpt)}
          </p>

          <div className="flex items-center justify-between border-t border-[#DAEEF8]/60 pt-4">
            <div className="flex items-center gap-4 text-xs text-[#4A6580]">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {post.publishedDate
                  ? new Date(post.publishedDate).toLocaleDateString(
                      locale === "en" ? "en-GB" : "fr-FR",
                      { day: "numeric", month: "short", year: "numeric" },
                    )
                  : "—"}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-[#E8630A] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
          </div>
        </div>
      </article>
    </Link>
  );
}
