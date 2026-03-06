"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: number;
  createdAt?: string;
  publishDate?: string;
  updatedAt?: string;
}

interface BlogLandingHeroProps {
  post: BlogPost | null;
  imageSrc: string;
  searchQuery: string;
  searchResults: Array<{
    id: string;
    href: string;
    title: string;
    excerpt: string;
  }>;
  resultCount: number;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onImageError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export default function BlogLandingHero({
  post,
  imageSrc,
  searchQuery,
  searchResults,
  resultCount,
  onSearchChange,
  onSearchSubmit,
  onImageError,
}: BlogLandingHeroProps) {
  const title = "Explore. Plan. Travel Better.";
  const excerpt =
    "Discover expert tips, local insights, and guides to make your journey unforgettable.";
  const hasQuery = searchQuery.trim().length > 0;

  return (
    <section className="relative z-20 overflow-visible bg-white text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={post?.title || "Travel blog hero background"}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            onError={onImageError}
          />
          <div className="absolute inset-0 bg-[linear-gradient(96deg,rgba(12,17,13,0.86)_0%,rgba(21,36,18,0.72)_34%,rgba(46,69,29,0.46)_58%,rgba(117,66,21,0.28)_100%)]" />
          <div className="absolute inset-0 bg-black/26" />
        </div>
      </div>

      <div className="relative mx-auto flex min-h-[460px] max-w-6xl flex-col justify-center px-4 py-16 md:min-h-[540px] md:px-6 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="font-unbounded max-w-4xl !text-4xl !font-medium leading-[1.02] tracking-[-0.04em] text-white md:!text-6xl">
            {title}
          </h1>

          <p className="mt-5 max-w-2xl !text-sm !font-normal !leading-7 text-white/80 md:!text-base">
            {excerpt}
          </p>

          <div className="relative mt-8 w-full max-w-2xl">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onSearchSubmit();
              }}
            >
              <label className="relative block flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search blog titles and excerpts..."
                  className="h-12 w-full rounded-[6px] border border-transparent bg-white px-11 pr-24 text-sm text-slate-900 outline-none transition focus:border-transparent focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                />
                {hasQuery && (
                  <span className="pointer-events-none absolute right-3 top-1/2 inline-flex -translate-y-1/2 rounded-full border border-[#d9e0f2] bg-[#f6f8ff] px-2.5 py-1 text-[11px] font-semibold text-[#000945]">
                    {resultCount} result{resultCount === 1 ? "" : "s"}
                  </span>
                )}
              </label>
            </form>

            {hasQuery && (
              <div className="absolute left-0 right-0 top-full z-20 mt-3 overflow-hidden rounded-[18px] border border-white/70 bg-white/95 text-[#000945] shadow-[0_18px_60px_rgba(0,9,69,0.18)] backdrop-blur-xl">
                {searchResults.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between border-b border-[#e8ecf6] px-4 py-3">
                      <p className="!m-0 !text-[11px] !font-semibold uppercase tracking-[0.16em] text-[#4a5b88]">
                        Matching Articles
                      </p>
                      <button
                        type="button"
                        onClick={onSearchSubmit}
                        className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.16em] text-[#000945] transition hover:text-[#155dfc]"
                      >
                        View all
                      </button>
                    </div>

                    <div className="max-h-[360px] overflow-y-auto p-2">
                      {searchResults.map((result) => (
                        <Link
                          key={result.id}
                          href={result.href}
                          className="block rounded-[14px] px-3 py-3 transition hover:bg-[#f5f7ff]"
                        >
                          <h3 className="line-clamp-2 !text-sm !font-semibold !leading-[1.35] !text-[#000945]">
                            {result.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 !text-xs !leading-5 !text-[#556381]">
                            {result.excerpt}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-5">
                    <p className="!m-0 !text-sm !font-semibold !text-[#000945]">
                      No matching blog articles found.
                    </p>
                    <p className="mt-1 !text-xs !leading-5 !text-[#556381]">
                      Try a different keyword from the blog title or excerpt.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
