"use client";

import { useMemo, useState } from "react";
import { BlogCard } from "./BlogCard";
import { useTranslations } from "next-intl";
import { type BlogPost } from "@/types";

const ALL = "__all__";

export function BlogFilter({ posts }: { posts: BlogPost[] }) {
  const t = useTranslations("blog.filter");
  const [active, setActive] = useState<string>(ALL);

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((post) => set.add(post.category));
    return [ALL, ...Array.from(set)];
  }, [posts]);

  const filtered = active === ALL ? posts : posts.filter((post) => post.category === active);

  return (
    <section className="bg-[#F4F9FD] py-[clamp(48px,6vw,80px)]">
      <div className="container-page">
        <div className="mb-9 flex flex-wrap items-center justify-between gap-[18px]">
          <h2 className="font-display text-[clamp(22px,2.6vw,32px)] font-black text-[#1A2940]">
            {t("latest")}
          </h2>

          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = category === active;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActive(category)}
                    className={`min-h-11 rounded-full border px-[18px] py-[9px] text-note font-semibold transition-colors sm:min-h-0 ${
                      isActive
                        ? "border-[#1A2940] bg-[#1A2940] text-white"
                        : "border-[#4DA6D9]/35 bg-white text-[#4A6580] hover:border-[#E8630A] hover:text-[#1A2940]"
                    }`}
                  >
                    {category === ALL ? t("all") : category}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-[22px] md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-[#4A6580]">{t("empty")}</p>
        )}
      </div>
    </section>
  );
}
