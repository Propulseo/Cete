import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { brandify } from "@/components/ui/brand-name";
import { VideoEmbed } from "@/components/ui/video-embed";
import { Clock } from "lucide-react";
import { useLocale } from "next-intl";
import { type BlogPost } from "@/types";

function formatDate(date: string, locale: string) {
  return new Date(date).toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BlogCard({ post }: { post: BlogPost }) {
  const locale = useLocale();

  return (
    <Link
      href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-subtle bg-white shadow-cete-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-cete-lg"
    >
      <div className="relative aspect-video overflow-hidden bg-[#F4F9FD]">
        {post.videoUrl ? (
          <VideoEmbed url={post.videoUrl} title={post.title} />
        ) : (
          <Image
            src={post.imageUrl}
            alt={post.imageAlt ?? post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
      </div>

      <article className="flex flex-1 flex-col px-[22px] py-6">
        <span className="mb-3.5 inline-flex self-start rounded-full bg-[#4DA6D9]/14 px-3 py-1.5 text-label font-bold tracking-[0.06em] text-[#0D5A8A]">
          {post.category}
        </span>
        <h3 className="mb-3 font-display text-[1.0625rem] font-bold leading-[1.35] text-[#1A2940] transition-colors group-hover:text-[#E8630A]">
          {post.title}
        </h3>
        <p className="line-clamp-3 flex-1 text-note leading-[1.65] text-[#4A6580]">
          {brandify(post.excerpt)}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#DAEEF8] pt-4 text-caption text-[#8AA5BE]">
          <span>{formatDate(post.publishedDate, locale)}</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
        </div>
      </article>
    </Link>
  );
}
