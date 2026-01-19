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

interface BlogPost {
  _id: string;
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

const getImageUrl = (image: string | undefined): string => {
  if (!image) return "/fallback.jpg";
  if (image.startsWith("http")) return image;
  if (image.startsWith("/")) return image;
  return `https://res.cloudinary.com/dwuwpxu0y/image/upload/${image}`;
};

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
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/blogs?published=true&limit=100");
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

        setBlogPosts(blogsArray);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load blogs");
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
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
    return blogPosts.filter((post) => {
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [blogPosts, selectedCategory, searchQuery]);

  // Get featured post (first one)
  const featuredPost = blogPosts.length > 0 ? blogPosts[0] : null;
  // Get all other posts for the grid (exclude featured)
  const gridPosts = filteredPosts.slice(1);

  if (loading) return <Loading size="lg" className="min-h-[400px]" />;

  return (
    <div className="min-h-screen bg-white pt-16">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-12">
        {/* Header Section */}
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-blue-600 !font-semibold !text-xs tracking-widest uppercase">
              Read Our Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-4 tracking-tight text-slate-900">
             Travel Blog & Guides
            </h1>
            <p className="!text-lg !text-slate-500 max-w-2xl">
            Discover expert tips, local insights, and guides to make your journey unforgettable.
            </p>
          </motion.div>
        </header>

        {/* Featured Post - Large Card with Glass Effect */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group cursor-pointer overflow-hidden rounded-2xl mb-16 min-h-[500px] md:aspect-[21/9] md:min-h-0"
          >
            <Link href={`/blog/${generateSlug(featuredPost.title)}`}>
              <div className="relative w-full h-full min-h-[500px] md:min-h-[450px]">
                <Image
                  src={getSafeImageUrl(featuredPost)}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1280px"
                  onError={(e) => handleImageError(featuredPost._id, e)}
                />
                
                {/* Glass Effect Overlay - Positioned at bottom */}
                <div className="absolute left-0 right-0 bottom-0 p-2 md:p-4 lg:p-6 z-10">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl text-white relative">
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-slate-200 pb-2">
          {/* Category Filters */}
          <div className="flex items-center gap-8 overflow-x-auto w-full md:w-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`text-sm font-semibold pb-4 whitespace-nowrap transition-colors ${
                selectedCategory === "All"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              All
            </button>
            {categoriesWithCounts.map(({ category, count }) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-sm font-medium pb-4 whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {category}
                {count > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-indigo-50 text-blue-600 text-[10px] font-bold rounded">
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72 mb-4 md:mb-0">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search blog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-full px-5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Blog Post Grid */}
        {gridPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {gridPosts.map((post, index) => {
                return (
                  <motion.article
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    className="group cursor-pointer"
                  >
                    <Link href={`/blog/${generateSlug(post.title)}`}>
                      {/* Image */}
                      <div className="overflow-hidden rounded-2xl mb-5 aspect-[4/3] relative">
                        <Image
                          src={getSafeImageUrl(post)}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onError={(e) => handleImageError(post._id, e)}
                        />
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        {/* Category */}
                        <span className="!text-blue-600 text-[10px] font-bold uppercase tracking-widest">
                          {post.category}
                        </span>

                        {/* Title */}
                        <h3 className="!text-xl text-slate-900 !font-bold group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="!text-sm !text-slate-500 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>

                        {/* Author and Read Time */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-semibold text-xs">
                              {post.author?.charAt(0) || "A"}
                            </div>
                            <span className="text-xs font-semibold text-slate-700">
                              {post.author || "Paradise Yatra"}
                            </span>
                          </div>
                          <span className="!text-[10px] !text-slate-400 font-medium">
                            {post.readTime || 5}min read
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>

            {/* Results Count and Load More */}
            <div className="mt-20 text-center">
              <p className="!text-xs !text-slate-400 mb-6">
                Showing {gridPosts.length} of {blogPosts.length - 1} results
              </p>
              {gridPosts.length < blogPosts.length - 1 && (
                <button className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold text-sm hover:scale-105 transition-transform">
                  Load More Articles
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
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
