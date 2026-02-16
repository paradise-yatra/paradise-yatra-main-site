"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import Loading from "@/components/ui/loading";
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

const getImageUrl = (image: string | undefined): string => getOptimizedImageUrl(image || null) || "/fallback.jpg";

const stripHtml = (value: string): string => value.replace(/<[^>]*>/g, " ");

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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (postId: string, e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/fallback.jpg";
    setImageErrors((prev) => new Set(prev).add(postId));
  };

  const getSafeImageUrl = (post: BlogPost): string => {
    if (imageErrors.has(post._id)) {
      return "/fallback.jpg";
    }
    return getImageUrl(post.image);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Reduced to 8 seconds

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
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            if (isMounted) {
              console.warn('Blog fetch timed out');
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

        // Sort by createdAt (latest first)
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

  // Extract unique categories with counts
  const categoriesWithCounts = useMemo(() => {
    const categoryMap = new Map<string, number>();
    blogPosts.forEach((post) => {
      if (post.category) {
        categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1);
      }
    });
    return Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [blogPosts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    const query = normalizeText(searchQuery);

    return blogPosts.filter((post) => {
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      if (!query) return matchesCategory;

      const searchableText = normalizeText(
        [
          post.title,
          post.excerpt,
          post.author,
          post.category,
          stripHtml(post.content || ""),
        ].join(" ")
      );

      const matchesSearch = searchableText.includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [blogPosts, selectedCategory, searchQuery]);

  // Get featured post from filtered posts
  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  // Get all other posts for the grid (exclude featured)
  const gridPosts = filteredPosts.slice(1);

  if (loading) return <Loading size="lg" className="min-h-[400px]" />;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
        {/* Header Section */}
        <header className="mb-12 md:mb-14 relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-blue-50/40 to-slate-100 p-6 md:p-6 shadow-sm">
          <div className="absolute -top-16 -right-20 h-56 w-56 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-200/30 blur-3xl" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-700 !font-semibold !text-xs tracking-widest uppercase">
              Read Our Blog
            </span>
            <h1 className="!text-3xl md:!text-5xl !font-extrabold mt-3 mb-3 tracking-tight text-slate-900">
              Travel Blog & Guides
            </h1>
            <p className="!text-sm md:!text-base !text-slate-600 max-w-2xl">
              Discover expert tips, local insights, and guides to make your journey unforgettable.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white/90 px-3 py-1.5 text-slate-600 border border-slate-200">
                {blogPosts.length} total articles
              </span>
              <span className="rounded-full bg-white/90 px-3 py-1.5 text-slate-600 border border-slate-200">
                {filteredPosts.length} matching results
              </span>
            </div>
          </motion.div>
        </header>

        {/* Featured Post - Large Card with Glass Effect */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group cursor-pointer overflow-hidden rounded-3xl mb-14 md:mb-16 min-h-[500px] md:aspect-[21/9] md:min-h-0 border border-slate-200 shadow-lg"
          >
            <Link
              href={`/blog/${getPostSlug(featuredPost)}`}
              prefetch={true}
            >
              <div className="relative w-full h-full min-h-[500px] md:min-h-[450px]">
                <Image
                  src={getSafeImageUrl(featuredPost)}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1280px"
                  onError={(e) => handleImageError(featuredPost._id, e)}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                {/* Glass Effect Overlay - Positioned at bottom */}
                <div className="absolute left-0 right-0 bottom-0 p-2 md:p-4 lg:p-6 z-10">
                  <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl text-white relative">
                    {/* Arrow Icon - Responsive positioning */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 lg:top-8 lg:right-8">
                      <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 font-light opacity-80" />
                    </div>

                    <div className="max-w-3xl pr-8 sm:pr-10 md:pr-12 lg:pr-16">
                      <h2 className="!text-lg sm:!text-xl md:!text-2xl lg:!text-3xl !font-bold mb-2 md:mb-3 leading-tight">
                        {featuredPost.title}
                      </h2>
                      <p className="!text-xs sm:!text-sm !text-white/80 mb-4 md:mb-6 hidden md:block line-clamp-2">
                        {featuredPost.excerpt}
                      </p>

                      {/* Author and Date */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center font-semibold text-white text-xs sm:text-sm md:text-base">
                            {featuredPost.author?.charAt(0) || "P"}
                          </div>
                          <div>
                            <p className="!text-xs sm:!text-sm !text-white !font-semibold">{featuredPost.author || "Paradise Yatra"}</p>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/70 mt-0.5">
                              <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              <span>
                                {new Date(
                                  featuredPost.createdAt || featuredPost.publishDate || new Date().toISOString()
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Category Tags */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 md:ml-auto">
                          {featuredPost.category && (
                            <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-white/10 rounded-full text-[9px] sm:text-[10px] font-medium tracking-wide border border-white/20 uppercase">
                              {featuredPost.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Category Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-4 md:p-5 shadow-sm">
          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`text-xs md:text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all ${selectedCategory === "All"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              All
            </button>
            {categoriesWithCounts.map(({ category, count }) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs md:text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap transition-all ${selectedCategory === category
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {category}
                {count > 0 && (
                  <span className={`ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded ${selectedCategory === category ? "bg-white/20 text-white" : "bg-indigo-50 text-blue-600"}`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search blog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {error}
          </div>
        )}

        {/* Blog Post Grid */}
        {gridPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {gridPosts.map((post, index) => {
                return (
                  <motion.article
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    className="group cursor-pointer rounded-2xl border border-slate-200 p-2  hover:-translate-y-1 transition-all"
                  >
                    <Link
                      href={`/blog/${getPostSlug(post)}`}
                      prefetch={true}
                    >
                      {/* Image */}
                      <div className="overflow-hidden rounded-xl mb-4 aspect-[4/3] relative">
                        <Image
                          src={getSafeImageUrl(post)}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading={index < 6 ? "eager" : "lazy"} // Load first 6 images eagerly
                          onError={(e) => handleImageError(post._id, e)}
                        />
                      </div>

                      {/* Content */}
                      <div className="space-y-3 px-1 pb-1">
                        {/* Category + Date */}
                        <div className="flex items-center justify-between">
                          <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 !text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                            {post.category}
                          </span>
                          <span className="!text-[10px] !text-slate-400 font-medium">
                            {new Date(
                              post.createdAt || post.publishDate || post.updatedAt || new Date().toISOString()
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="!text-lg md:!text-xl text-slate-900 !font-bold group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="!text-sm !text-slate-500 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>

                        {/* Author and Read Time */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-semibold text-xs">
                              {post.author?.charAt(0) || "A"}
                            </div>
                            <span className="text-xs font-semibold text-slate-700">
                              {post.author || "Paradise Yatra"}
                            </span>
                          </div>
                          <span className="!text-[10px] !text-slate-500 font-semibold uppercase tracking-wider">
                            {post.readTime || 5} min read
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>

            {/* Results Count and Load More */}
            <div className="mt-14 text-center">
              <p className="!text-xs !text-slate-400 mb-6">
                Showing {gridPosts.length} of {Math.max(filteredPosts.length - 1, 0)} results
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-dashed border-slate-300 bg-white">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 text-lg font-medium mb-2">No articles found</p>
            <p className="text-slate-400 text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </main>

      {/* Bottom Spacing */}
      <div className="h-16" />
    </div>
  );
};

export default BlogPage;
