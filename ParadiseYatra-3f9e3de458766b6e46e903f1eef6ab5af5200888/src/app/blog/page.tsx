"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, User, ChevronRight, Sparkles, Mail, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/blogs");
        if (!response.ok) throw new Error("Failed to fetch blogs");
        const data = await response.json();
        setBlogPosts(Array.isArray(data) ? data : data.blogs || []);
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

  if (loading) return <Loading size="lg" className="min-h-[400px]" />;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-12 md:pb-16"
    >
      {/* Header with Logo */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Breadcrumb */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 relative">
                  <Image
                    src="/headerLogo.png"
                    alt="Paradise Yatra Logo"
                    onClick={() => {
                      window.location.href = "/";
                    }}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain hover:cursor-pointer hover:scale-105 transition-all duration-300"
                  />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Trusted Travel Experts</p>
                </div>
              </div>
              
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-slate-500">
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-800">Blog</span>
              </nav>
            </div>
            
            {/* Trust Indicators */}
            <div className="hidden md:flex items-center space-x-4 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <span>Verified Content</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs">★</span>
                </div>
                <span>Expert Writers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xs">📍</span>
                </div>
                <span>Local Insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-6 md:py-8">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-medium mb-4 shadow-sm"
          >
            <Sparkles className="w-3 h-3" />
            <span>Travel Insights</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-extrabold mb-3 md:mb-4 text-slate-900 leading-tight"
          >
            Travel Blog & Guides
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base md:text-lg text-slate-600 mb-5 md:mb-6 max-w-2xl mx-auto"
          >
            Discover expert tips, local insights, and guides to make your journey unforgettable.
          </motion.p>
          
          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center items-center gap-3 md:gap-4 mt-5 md:mt-6"
          >
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200">
              <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs">📚</span>
              </div>
              <span className="text-xs font-medium text-slate-700">500+ Travel Guides</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200">
              <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs">⏰</span>
              </div>
              <span className="text-xs font-medium text-slate-700">10+ Years Experience</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200">
              <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xs">👨‍💼</span>
              </div>
              <span className="text-xs font-medium text-slate-700">Local Expert Writers</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-3 sm:px-4 py-8 md:py-12 pb-12 md:pb-16 max-w-6xl">
        {/* Featured Article */}
        {blogPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 md:mb-16"
          >
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">
              Featured Article
            </h2>

            <div className="relative rounded-xl overflow-hidden shadow-lg group">
              <Image
                src={blogPosts[0].image || "/fallback.jpg"}
                alt={blogPosts[0].title}
                width={1200}
                height={600}
                className="w-full h-[220px] sm:h-[300px] md:h-[350px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              {/* Trust Badge */}
              <div className="absolute top-4 right-4">
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <span>Featured & Verified</span>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs bg-blue-600 px-3 py-1 rounded-full font-medium">
                    {blogPosts[0].category}
                  </span>
                  <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    ⭐ 4.9/5 Rating
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 line-clamp-2">
                  {blogPosts[0].title}
                </h3>
                <p className="max-w-2xl text-sm mb-3 md:mb-4 opacity-90 line-clamp-2">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-3 text-xs opacity-80 order-2 sm:order-1">
                    <span>📖 {blogPosts[0].readTime} min read</span>
                    <span>👁️ {blogPosts[0].views || 1000}+ views</span>
                    <span>❤️ {blogPosts[0].likes || 50}+ likes</span>
                  </div>
                  <Link href={`/blog/${generateSlug(blogPosts[0].title)}`} className="order-1 sm:order-2 self-start sm:self-auto">
                    <Button className="bg-blue-600 hover:scale-105 hover:cursor-pointer text-white font-medium px-4 py-2 rounded-lg inline-flex items-center text-sm">
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Credibility Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 md:mb-12 text-center"
        >
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Why Trust Our Travel Guides?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl"><Image src="/local-experience.png" alt="Local Expertise" width={48} height={48} /></span>
                </div>
                <h4 className="font-medium text-slate-900">Local Expertise</h4>
                <p className="text-xs text-slate-600">Written by travel experts with deep local knowledge</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl"><Image src="/validated.png" alt="Verified Information" width={48} height={48} /></span>
                </div>
                <h4 className="font-medium text-slate-900">Verified Information</h4>
                <p className="text-xs text-slate-600">All content is fact-checked and regularly updated</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl"><Image src="/customer-review.png" alt="Real Experiences" width={48} height={48} /></span>
                </div>
                <h4 className="font-medium text-slate-900">Real Experiences</h4>
                <p className="text-xs text-slate-600">Based on actual travel experiences and local insights</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Blog Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-10 md:mb-16"
        >
          <h2 className="text-2xl font-semibold text-slate-900 text-center mb-8">
            Latest Articles
          </h2>

          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(1).map((post) => (
              <motion.article
                key={post._id}
                variants={itemVariants}
                whileHover={{ y: -3 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col border border-slate-100"
              >
                <div className="relative h-36 sm:h-40 overflow-hidden">
                  <Image
                    src={post.image || "/fallback.jpg"}
                    alt={post.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime} min
                    </span>
                  </div>
                </div>

                <div className="p-4 md:p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 md:mb-3 line-clamp-2 leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-sm text-slate-600 mb-3 md:mb-4 flex-grow line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                        {post.author?.charAt(0) || 'A'}
                      </div>
                      <span className="font-medium">{post.author || 'Anonymous'}</span>
                    </div>
                    <Link href={`/blog/${generateSlug(post.title)}`}>
                      <Button variant="ghost" className="text-xs text-blue-600 hover:scale-105 hover:cursor-pointer px-3 py-1 h-auto">
                        Read More →
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-5 md:p-6 text-center shadow-sm max-w-2xl mx-auto"
        >
          <Mail className="w-6 h-6 mx-auto text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-slate-900">
            Get Travel Inspiration
          </h3>
          <p className="text-slate-600 mb-4 max-w-sm mx-auto text-sm">
            Subscribe to receive our latest travel guides and destination highlights directly in your inbox.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex justify-center items-center space-x-4 mb-4 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs">🛡️</span>
              </div>
              <span>No Spam</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs">📅</span>
              </div>
              <span>Weekly Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xs">🎓</span>
              </div>
              <span>Expert Content</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-3 bg-white text-black py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <Button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:scale-105 hover:cursor-pointer text-sm font-medium">
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            We respect your privacy. Unsubscribe anytime.
          </p>
          
          {/* Social Proof */}
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-xs text-slate-500 mb-2">Join 5,000+ travel enthusiasts</p>
            <div className="flex justify-center items-center space-x-1 text-xs text-slate-400">
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
              <span className="ml-1 text-slate-600">4.9/5 from our readers</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BlogPage;
