"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, User, Tag, Eye, Heart, Share2, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import Loading from "@/components/ui/loading";

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
}

// Function to generate slug from title
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

const getImageUrl = (image: string | undefined): string => {
  if (!image) return "/fallback.jpg";
  if (image.startsWith("http")) return image;
  if (image.startsWith("/")) return image;
  return `https://res.cloudinary.com/dwuwpxu0y/image/upload/${image}`;
};

interface BlogDetailClientProps {
  post: BlogPost;
  slug: string;
}

const BlogDetailClient = ({ post, slug }: BlogDetailClientProps) => {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false); // Changed to false - don't block page
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (postId: string, e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/fallback.jpg";
    setImageErrors((prev) => new Set(prev).add(postId));
  };

  const getSafeImageUrl = (image: string, postId: string): string => {
    if (imageErrors.has(postId)) {
      return "/fallback.jpg";
    }
    return getImageUrl(image);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout (reduced since it's not blocking)

    const fetchRelatedPosts = async () => {
      try {
        if (!isMounted) return;
        setLoadingRelated(true); // Only show loading for related posts section

        let allBlogsResponse;
        try {
          // Fetch a few blogs from the same category to get related posts (reduced limit for faster load)
          allBlogsResponse = await fetch(`/api/blogs?published=true&limit=6&category=${post.category}`, {
            signal: controller.signal,
            cache: 'default', // Use cache to reduce requests
          });
          clearTimeout(timeoutId);
        } catch (fetchError) {
          clearTimeout(timeoutId);
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            if (isMounted) {
              console.warn('Related posts fetch timed out');
              setLoadingRelated(false);
            }
            return;
          }
          throw fetchError;
        }

        if (!allBlogsResponse.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const allBlogsData = await allBlogsResponse.json();
        const allBlogs = Array.isArray(allBlogsData)
          ? allBlogsData
          : allBlogsData.blogs || [];

        // Get related posts (excluding current post)
        const related = allBlogs
          .filter((blog: BlogPost) => blog._id !== post._id)
          .slice(0, 3);

        if (isMounted) {
          setRelatedPosts(related);
          setError(null);
          setLoadingRelated(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching related posts:", err);
          setLoadingRelated(false);
          // Don't set error - just don't show related posts
        }
      }
    };

    fetchRelatedPosts();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [post._id, post.category]);

  // Don't block page render - show content immediately
  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt || post.content.substring(0, 160),
            image: getImageUrl(post.image),
            author: {
              "@type": "Person",
              name: post.author,
            },
            publisher: {
              "@type": "Organization",
              name: "Paradise Yatra",
              logo: {
                "@type": "ImageObject",
                url: "/headerLogo.png",
              },
            },
            datePublished: new Date(post.createdAt).toISOString(),
            dateModified: new Date(post.createdAt).toISOString(),
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `/blog/${slug}`,
            },
            articleSection: post.category,
            keywords: [post.category, "Travel", "Adventure", "Travel Tips"],
            wordCount: post.content.split(" ").length,
            timeRequired: `PT${post.readTime}M`,
            inLanguage: "en-US",
          }),
        }}
      />

      <div className="min-h-screen bg-white">
        <Header />

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 md:py-12">
          {/* Back Button */}
          <Link href="/blog">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-6 md:mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Blog</span>
            </motion.button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Article Header */}
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg overflow-hidden mb-8 md:mb-12"
              >
                {/* Hero Image */}
                <div className="relative w-full h-[250px] md:h-[400px] lg:h-[450px] overflow-hidden rounded-lg">
                  <Image
                    src={getSafeImageUrl(post.image, post._id)}
                    alt={post.title}
                    fill
                    className="object-cover rounded-lg"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                    onError={(e) => handleImageError(post._id, e)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-5 md:p-8">
                  {/* Title */}
                  <h1 className="!text-2xl md:!text-3xl lg:!text-4xl !font-black !text-slate-900 mb-4 md:mb-6 leading-tight tracking-tight">
                    {post.title}
                  </h1>

                  {/* Meta Information */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 !text-xs md:!text-sm !text-slate-600">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center !font-bold text-[10px]">
                          {post.author?.charAt(0) || "P"}
                        </div>
                        <span className="!font-bold !text-slate-700">{post.author || "Paradise Yatra"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="!font-medium">
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="!font-medium">{post.readTime || 5} min read</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">{post.views || 0}</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{post.likes || 0}</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Article Body */}
                  <div className="prose prose-md max-w-none">
                    <div
                      className="!text-slate-800 !leading-relaxed space-y-6 [&_h2]:!text-lg md:[&_h2]:!text-xl [&_h2]:!font-bold [&_h2]:!text-slate-900 [&_h2]:!mt-8 [&_h2]:!mb-4 [&_h3]:!text-base md:[&_h3]:!text-lg [&_h3]:!font-bold [&_h3]:!text-slate-900 [&_h3]:!mt-6 [&_h3]:!mb-3 [&_p]:!mb-4 [&_p]:!leading-relaxed [&_p]:!text-sm md:[&_p]:!text-base [&_p]:!text-slate-600 [&_ul]:!list-disc [&_ul]:!pl-6 [&_ul]:!space-y-2 [&_ol]:!list-decimal [&_ol]:!pl-6 [&_ol]:!space-y-2 [&_li]:!mb-2 [&_li]:!text-sm md:[&_li]:!text-base [&_li]:!text-slate-600 [&_a]:!text-blue-600 [&_a]:!underline [&_a]:!hover:text-blue-700 [&_img]:!rounded-lg [&_img]:!my-6 [&_blockquote]:!border-l-4 [&_blockquote]:!border-blue-600 [&_blockquote]:!pl-4 [&_blockquote]:!italic [&_blockquote]:!text-slate-600 [&_blockquote]:!my-6"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </div>
                </div>
              </motion.article>

              {/* Related Articles */}
              {loadingRelated && (
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-8"
                >
                  <h2 className="text-2xl md:text-3xl !font-extrabold text-slate-900 mb-6 md:mb-8 tracking-tight">
                    Related Articles
                  </h2>
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </motion.section>
              )}
              {!loadingRelated && relatedPosts.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-8"
                >
                  <h2 className="text-2xl md:text-3xl !font-extrabold text-slate-900 mb-6 md:mb-8 tracking-tight">
                    Related Articles
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {relatedPosts.map((relatedPost, index) => (
                      <Link
                        key={relatedPost._id}
                        href={`/blog/${getPostSlug(relatedPost)}`}
                        prefetch={true}
                      >
                        <motion.article
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="group cursor-pointer"
                        >
                          {/* Image */}
                          <div className="overflow-hidden rounded-lg mb-4 aspect-[4/3] relative">
                            <Image
                              src={getSafeImageUrl(relatedPost.image, relatedPost._id)}
                              alt={relatedPost.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-lg"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                              onError={(e) => handleImageError(relatedPost._id, e)}
                            />
                          </div>

                          {/* Content */}
                          <div className="space-y-2 p-2">
                            <span className="text-blue-600 text-[9px] font-black uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">
                              {relatedPost.category}
                            </span>
                            <h3 className="!text-base text-slate-900 !font-bold group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                              {relatedPost.title}
                            </h3>
                            <p className="!text-xs !text-slate-600 line-clamp-2 leading-relaxed opacity-90">
                              {relatedPost.excerpt}
                            </p>
                            <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-200">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center !font-bold text-[9px]">
                                  {relatedPost.author?.charAt(0) || "A"}
                                </div>
                                <span className="text-[10px] !font-bold text-slate-600">
                                  {relatedPost.author || "Paradise Yatra"}
                                </span>
                              </div>
                              <span className="text-[9px] text-slate-400 !font-bold uppercase tracking-tighter">
                                {relatedPost.readTime || 5} min
                              </span>
                            </div>
                          </div>
                        </motion.article>
                      </Link>
                    ))}
                  </div>
                </motion.section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-6 sticky top-24"
              >
                {/* Author Info */}
                <div className="bg-white rounded-lg p-6 border border-slate-200">
                  <h3 className="!text-lg !font-bold text-slate-900 mb-4">
                    About the Author
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-semibold text-lg">
                      {post.author?.charAt(0) || "P"}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {post.author || "Paradise Yatra"}
                      </h4>
                      <p className="text-sm !text-slate-500">Travel Expert</p>
                    </div>
                  </div>
                  <p className="!text-slate-600 text-sm leading-relaxed">
                    Passionate travel writer with years of experience exploring
                    the world&apos;s most beautiful destinations.
                  </p>
                </div>

                {/* Popular Posts */}
                <div className="bg-white rounded-lg p-6 border border-slate-200">
                  <h3 className="!text-lg !font-bold text-slate-900 mb-4">
                    Popular Posts
                  </h3>
                  {loadingRelated ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {relatedPosts.slice(0, 3).map((popularPost) => (
                        <Link
                          key={popularPost._id}
                          href={`/blog/${getPostSlug(popularPost)}`}
                          prefetch={true}
                        >
                          <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={getSafeImageUrl(popularPost.image, popularPost._id)}
                                alt={popularPost.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                sizes="56px"
                                onError={(e) => handleImageError(popularPost._id, e)}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm leading-tight">
                                {popularPost.title}
                              </h4>
                              <p className="text-xs text-slate-500 mt-1">
                                {popularPost.readTime || 5} min read
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Newsletter Signup */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
                  <h3 className="!text-lg !font-bold mb-2">Stay Updated</h3>
                  <p className="!text-blue-100 !text-sm mb-4">
                    Get the latest travel tips and destination guides delivered
                    to your inbox.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-white/10 backdrop-blur-sm border border-white/20 w-full px-4 py-2.5 rounded-lg text-white placeholder:text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <Button className="w-full !bg-white !text-blue-600 !font-semibold rounded-lg hover:bg-white/90 hover:scale-105 transition-all duration-300 text-sm">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetailClient;
