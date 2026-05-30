"use client";

import { useMemo, useState } from "react";
import { type BlogPost } from "@/types";
import { BlogCard } from "./BlogCard";

const ALL = "Tous";

export function BlogFilter({ posts }: { posts: BlogPost[] }) {
  const [active, setActive] = useState<string>(ALL);

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => set.add(p.category));
    return [ALL, ...Array.from(set)];
  }, [posts]);

  const filtered = active === ALL ? posts : posts.filter((p) => p.category === active);

  return (
    <section className="relative overflow-hidden bg-[#F4F9FD] py-16 md:py-20">
      <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#4DA6D9]/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-6 lg:px-8">
        {/* Header + filter chips */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-2xl text-[#1A2940] md:text-3xl">
              Derniers articles
            </h2>
            <div className="hidden h-px flex-1 bg-[#DAEEF8] md:block" />
          </div>

          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = cat === active;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActive(cat)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "border-transparent bg-[#1A2940] text-white shadow-sm"
                        : "border-[#DAEEF8] bg-white text-[#4A6580] hover:border-[#4DA6D9]/40 hover:text-[#1A2940]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {filtered.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-[#4A6580]">
            Aucun article dans cette catégorie pour le moment.
          </p>
        )}
      </div>
    </section>
  );
}
