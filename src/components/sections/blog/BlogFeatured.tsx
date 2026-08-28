import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { brandify } from "@/components/ui/brand-name";
import { VideoEmbed } from "@/components/ui/video-embed";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { type BlogPost } from "@/types";

function formatDate(date: string, locale: string) {
  return new Date(date).toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogFeatured({ post }: { post: BlogPost }) {
  const t = useTranslations("blog.featured");
  const locale = useLocale();

  return (
    <section className="bg-white pb-[clamp(48px,6vw,72px)] pt-0">
      <div className="container-page">
        <Link
          href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
          className="group grid overflow-hidden rounded-3xl border border-subtle bg-white shadow-cete-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-cete-lg md:grid-cols-2"
        >
          <div className="relative min-h-[280px] overflow-hidden bg-[#F4F9FD]">
            {post.videoUrl ? (
              <VideoEmbed url={post.videoUrl} title={post.title} />
            ) : (
              <Image
                src={post.imageUrl}
                alt={post.imageAlt ?? post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
          </div>

          <article className="flex flex-col p-[clamp(26px,3.5vw,40px)]">
            <div className="mb-[18px] flex items-center gap-3">
              <span className="rounded-full bg-[#22C55E]/12 px-[13px] py-1.5 text-[0.71875rem] font-bold tracking-[0.06em] text-[#15803D]">
                {post.category}
              </span>
              <span className="text-caption text-[#8AA5BE]">{post.readTime}</span>
            </div>

            <p className="type-kicker mb-3 text-[#E8630A]">{t("label")}</p>
            <h2 className="mb-3.5 font-display text-[clamp(19px,2.2vw,26px)] font-black leading-[1.28] text-[#1A2940] transition-colors group-hover:text-[#E8630A]">
              {post.title}
            </h2>
            <p className="mb-6 text-body-sm leading-[1.7] text-[#4A6580]">
              {brandify(post.excerpt)}
            </p>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3.5 border-t border-[#DAEEF8] pt-5">
              <span className="flex items-center gap-3">
                <span className="bg-grad-ink inline-flex h-[38px] w-[38px] items-center justify-center rounded-full text-xs font-bold text-white">
                  {post.author.split(" ").map((name) => name[0]).join("")}
                </span>
                <span>
                  <span className="block text-note font-semibold text-[#1A2940]">
                    {post.author}
                  </span>
                  <span className="block text-caption text-[#8AA5BE]">
                    {formatDate(post.publishedDate, locale)}
                  </span>
                </span>
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#E8630A]">
                {t("readArticle")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </article>
        </Link>
      </div>
    </section>
  );
}
