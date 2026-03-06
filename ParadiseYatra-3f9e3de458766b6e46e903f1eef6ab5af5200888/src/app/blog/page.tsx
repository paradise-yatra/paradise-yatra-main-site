"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import Loading from "@/components/ui/loading";
import BlogLandingHero from "@/components/blog/BlogLandingHero";
import { getImageUrl as getOptimizedImageUrl } from "@/lib/utils";

interface BlogPost {
  _id: string;
  slug?: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  image: string;
  category: string;
  readTime: number;
  views: number;
  likes: number;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  publishDate?: string;
  updatedAt?: string;
}

interface HeroSearchResult {
  id: string;
  href: string;
  title: string;
  excerpt: string;
}

const HERO_FALLBACK_IMAGE = "/images/placeholder-travel.jpg";
const HERO_BACKGROUND_IMAGE = "/Blog/Hero/brandon-atchison-ySt4U0bnDO0-unsplash.jpg";

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const getPostSlug = (post: BlogPost): string => {
  return post.slug || generateSlug(post.title);
};

const getImageUrl = (image: string | undefined): string =>
  getOptimizedImageUrl(image || null) || HERO_FALLBACK_IMAGE;

const stripHtml = (value: string): string => value.replace(/<[^>]*>/g, " ");

const getSearchExcerpt = (post: BlogPost): string =>
  stripHtml(post.excerpt || post.content || "")
    .replace(/\s+/g, " ")
    .trim();

const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const handleImageError = (
    postId: string,
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = event.target as HTMLImageElement;
    target.src = HERO_FALLBACK_IMAGE;
    setImageErrors((prev) => new Set(prev).add(postId));
  };

  const handleHeroImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = event.target as HTMLImageElement;
    target.src = HERO_FALLBACK_IMAGE;
  };

  const getSafeImageUrl = (post: BlogPost | null): string => {
    if (!post) {
      return HERO_FALLBACK_IMAGE;
    }

    if (imageErrors.has(post._id)) {
      return HERO_FALLBACK_IMAGE;
    }

    return getImageUrl(post.image);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const fetchBlogs = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);

        let response;
        try {
          response = await fetch("/api/blogs?published=true&limit=24", {
            signal: controller.signal,
            cache: "no-store",
          });
          clearTimeout(timeoutId);
        } catch (fetchError) {
          clearTimeout(timeoutId);
          if (fetchError instanceof Error && fetchError.name === "AbortError") {
            if (isMounted) {
              console.warn("Blog fetch timed out");
              setError("Request timeout - please refresh the page");
              setBlogPosts([]);
              setLoading(false);
            }
            return;
          }
          throw fetchError;
        }

        if (!response.ok) throw new Error("Failed to fetch blogs");
        const data = await response.json();

        let blogsArray: BlogPost[] = [];
        if (Array.isArray(data)) {
          blogsArray = data;
        } else if (data.blogs && Array.isArray(data.blogs)) {
          blogsArray = data.blogs;
        }

        blogsArray.sort((a, b) => {
          const dateA = new Date(
            a.publishDate || a.createdAt || a.updatedAt || 0
          ).getTime();
          const dateB = new Date(
            b.publishDate || b.createdAt || b.updatedAt || 0
          ).getTime();
          return dateB - dateA;
        });

        if (isMounted) {
          setBlogPosts(blogsArray);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          setError("Failed to load blogs");
          setBlogPosts([]);
          setLoading(false);
        }
      }
    };

    fetchBlogs();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const query = normalizeText(deferredSearchQuery);

    return blogPosts.filter((post) => {
      if (!query) return true;

      const searchableText = normalizeText([post.title, getSearchExcerpt(post)].join(" "));

      return searchableText.includes(query);
    });
  }, [blogPosts, deferredSearchQuery]);

  const heroSearchResults = useMemo<HeroSearchResult[]>(() => {
    const query = normalizeText(deferredSearchQuery);
    if (!query) return [];

    return filteredPosts.slice(0, 6).map((post) => ({
      id: post._id,
      href: `/blog/${getPostSlug(post)}`,
      title: post.title,
      excerpt: getSearchExcerpt(post),
    }));
  }, [deferredSearchQuery, filteredPosts]);

  const latestPost = blogPosts[0] ?? null;
  const popularPosts = filteredPosts.slice(0, 4);
  const popularLeadPost = popularPosts[0] ?? null;
  const popularSidePosts = popularPosts.slice(1, 4);
  const featuredStripPosts = filteredPosts.filter(
    (post) => !popularPosts.some((popularPost) => popularPost._id === post._id)
  );

  const scrollToResults = () => {
    const resultsSection = document.getElementById("blog-results");
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) return <Loading size="lg" className="min-h-[400px]" />;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pb-16">
        <BlogLandingHero
          post={latestPost}
          imageSrc={HERO_BACKGROUND_IMAGE}
          searchQuery={searchQuery}
          searchResults={heroSearchResults}
          resultCount={filteredPosts.length}
          onSearchChange={setSearchQuery}
          onSearchSubmit={scrollToResults}
          onImageError={handleHeroImageError}
        />

        <section id="blog-results" className="relative z-10 pt-10 md:pt-14">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            {error && (
              <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {error}
              </div>
            )}

            {popularLeadPost ? (
              <section className="py-3 md:py-4">
                <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
                  <div className="md:pb-0.5">
                    <h2 className="!m-0 !text-[24px] !font-bold !leading-none tracking-[-0.04em] text-[#000945] md:!text-[36px]">
                      Popular Articles
                    </h2>
                  </div>
                  <div className="max-w-[320px] md:pt-1.5">
                    <p className="!text-[13px] !leading-[1.45] !text-[#000945]">
                      Browse standout stories, planning tips, and destination
                      features from the Paradise Yatra journal.
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:gap-8 lg:items-start">
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="group"
                  >
                    <Link href={`/blog/${getPostSlug(popularLeadPost)}`} prefetch>
                      <div className="relative mb-5 h-[260px] overflow-hidden rounded-[6px] bg-[#e5e5e5] md:h-[300px] lg:h-[420px]">
                        <Image
                          src={getSafeImageUrl(popularLeadPost)}
                          alt={popularLeadPost.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 58vw"
                          priority
                          onError={(event) =>
                            handleImageError(popularLeadPost._id, event)
                          }
                        />
                      </div>

                      <h3 className="max-w-[680px] !text-[24px] !font-semibold !leading-[1.14] tracking-[-0.03em] !text-[#000945] md:!text-[30px]">
                        {popularLeadPost.title}
                      </h3>
                      <p className="mt-3 max-w-[640px] line-clamp-2 !text-[14px] !leading-6 !text-[#000945]">
                        {popularLeadPost.excerpt}
                      </p>
                    </Link>
                  </motion.article>

                  <div className="space-y-3">
                    {popularSidePosts.map((post, index) => (
                      <motion.article
                        key={post._id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06, duration: 0.35 }}
                        className="group"
                      >
                        <Link
                          href={`/blog/${getPostSlug(post)}`}
                          prefetch
                          className="grid grid-cols-[104px_1fr] gap-4 md:grid-cols-[132px_1fr] md:gap-5"
                        >
                          <div className="relative aspect-square overflow-hidden rounded-[6px] bg-[#e5e5e5]">
                            <Image
                              src={getSafeImageUrl(post)}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="128px"
                              onError={(event) => handleImageError(post._id, event)}
                            />
                          </div>
                          <div className="flex min-h-full flex-col justify-center">
                            <h4 className="line-clamp-2 !text-[18px] !font-semibold !leading-[1.18] tracking-[-0.025em] !text-[#000945] md:!text-[22px]">
                              {post.title}
                            </h4>
                            <p className="mt-2 line-clamp-2 !text-[13px] !leading-[1.45] !text-[#000945] md:!text-sm">
                              {post.excerpt}
                            </p>
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                </div>
              </section>
            ) : (
              <div className="rounded-[28px] border border-dashed border-[#d9cfbb] bg-[#fbf8f1] px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#eef2de]">
                  <Search className="h-8 w-8 text-[#718441]" />
                </div>
                <p className="!text-lg !font-medium text-[#2a301d]">
                  No articles found
                </p>
                <p className="mt-2 !text-sm text-[#7b705f]">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}

            {featuredStripPosts.length > 0 && (
              <section className="pt-12 md:pt-16">
                <div className="mb-6 md:mb-8">
                  <h3 className="!text-[24px] !font-bold !leading-none tracking-[-0.04em] text-[#000945] md:!text-[36px]">
                    More Stories
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:gap-x-6 md:gap-y-8 xl:grid-cols-4">
                  {featuredStripPosts.map((post, index) => (
                    <motion.article
                      key={post._id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.35 }}
                    >
                      <Link href={`/blog/${getPostSlug(post)}`} prefetch className="block">
                        <div className="relative mb-4 aspect-[1/0.82] overflow-hidden rounded-[6px] bg-[#e5e5e5]">
                          <Image
                            src={getSafeImageUrl(post)}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                            onError={(event) => handleImageError(post._id, event)}
                          />
                        </div>

                        <h4 className="line-clamp-2 !text-[18px] !font-semibold !leading-[1.16] tracking-[-0.03em] !text-[#000945] md:!text-[22px]">
                          {post.title}
                        </h4>

                        <div className="mt-3">
                          <span className="inline-flex rounded-full border border-[#d6d6d6] bg-white px-3 py-1 text-[11px] font-medium text-[#000945]">
                            {new Date(
                              post.createdAt ||
                                post.publishDate ||
                                post.updatedAt ||
                                new Date().toISOString()
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              </section>
            )}

          </div>
        </section>
      </main>
    </div>
  );
};

export default BlogPage;
