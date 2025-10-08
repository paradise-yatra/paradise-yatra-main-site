"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, User, Tag, Eye, Heart, Share2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import Link from "next/link";
import Image from "next/image";
import Loading from "@/components/ui/loading";
import { LazyHeader } from "@/components/lazy-components";

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

// Function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

interface BlogDetailClientProps {
  post: BlogPost;
  slug: string;
}

const BlogDetailClient = ({ post, slug }: BlogDetailClientProps) => {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        setLoading(true);
        
        // Fetch all blogs to get related posts
        const allBlogsResponse = await fetch('/api/blogs');
        if (!allBlogsResponse.ok) {
          throw new Error('Failed to fetch blogs');
        }
        
        const allBlogsData = await allBlogsResponse.json();
        const allBlogs = Array.isArray(allBlogsData) ? allBlogsData : (allBlogsData.blogs || []);
        
        // Get related posts (excluding current post)
        const related = allBlogs
          .filter((blog: BlogPost) => blog._id !== post._id)
          .slice(0, 3);
        setRelatedPosts(related);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching related posts:', err);
        setError('Failed to load related posts');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [post._id]);

  if (loading) {
    return <Loading size="lg" className="min-h-[400px]" />;
  }

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt || post.content.substring(0, 160),
            "image": post.image || "/banner.jpeg",
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Paradise Yatra",
              "logo": {
                "@type": "ImageObject",
                "url": "/headerLogo.png"
              }
            },
            "datePublished": new Date(post.createdAt).toISOString(),
            "dateModified": new Date(post.createdAt).toISOString(),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `/blog/${slug}`
            },
            "articleSection": post.category,
            "keywords": [post.category, "Travel", "Adventure", "Travel Tips"],
            "wordCount": post.content.split(' ').length,
            "timeRequired": `PT${post.readTime}M`,
            "inLanguage": "en-US"
          })
        }}
      />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-white/80 mt-16 md:mt-24"
      >
        <LazyHeader />

        <div className="container mx-auto px-3 sm:px-4 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Article Header */}
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="!bg-white rounded-3xl shadow-xl overflow-hidden mb-6 md:mb-8 border border-white/20 mt-6 md:mt-10"
              >
                {/* Hero Image */}
                <div className="relative h-64 md:h-96 overflow-hidden">
                  {post.image && post.image.startsWith('http') ? (
                    <Image 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      width={800}
                      height={400}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-8xl ${post.image && post.image.startsWith('http') ? 'hidden' : ''}`}>
                    {post.image || '📝'}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 text-xs font-bold shadow-md">
                      {post.category}
                    </Badge>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-6 right-6 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="w-10 h-10 p-0 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full"
                    >
                      <Heart className="w-5 h-5 text-white" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="w-10 h-10 p-0 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full"
                    >
                      <Share2 className="w-5 h-5 text-white" />
                    </Button>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-5 md:p-8">
                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6 leading-tight">
                    {post.title}
                  </h1>

                  {/* Meta Information */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-slate-500 mb-6 md:mb-8 pb-5 md:pb-6 border-b border-slate-200">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="font-medium">{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="font-medium">
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="font-medium">{post.readTime} min read</span>
                      </div>
                    </div>
                    <div className="flex items-center sm:mt-0">
                      <Eye className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="font-medium">{post.views || 0} views</span>
                    </div>
                  </div>

                  {/* Article Body */}
                  <div className="prose prose-base md:prose-lg max-w-none">
                    <div 
                      className="text-slate-700 leading-relaxed space-y-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_ul_li]:list-disc [&_ol_li]:list-decimal"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </div>

                  {/* Tags */}
                  <div className="mt-6 md:mt-8 pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-slate-900">Tags:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 text-blue-700 px-3 py-1 text-sm">
                        Travel Tips
                      </Badge>
                      <Badge className="bg-green-100 text-green-700 px-3 py-1 text-sm">
                        {post.category}
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-700 px-3 py-1 text-sm">
                        Adventure
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.article>

              {/* Related Articles */}
              {relatedPosts.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-6 md:mb-8"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedPosts.map((relatedPost, index) => (
                      <Link key={relatedPost._id} href={`/blog/${generateSlug(relatedPost.title)}`}>
                        <motion.article
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ y: -5, scale: 1.02 }}
                          className="group bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 border border-white/20 h-full flex flex-col"
                        >
                        <div className="relative h-40 overflow-hidden">
                          {relatedPost.image && relatedPost.image.startsWith('http') ? (
                            <Image 
                              src={relatedPost.image} 
                              alt={relatedPost.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              width={400}
                              height={300}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-4xl ${relatedPost.image && relatedPost.image.startsWith('http') ? 'hidden' : ''}`}>
                            {relatedPost.image || '📝'}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-1 text-xs font-bold">
                              {relatedPost.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4 flex flex-col h-full">
                          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h3>
                          <p className="text-slate-600 text-sm line-clamp-2 mb-3 flex-grow">
                            {relatedPost.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{relatedPost.author}</span>
                            <span>{relatedPost.readTime} min read</span>
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
                transition={{ duration: 0.8, delay: 0.3 }}
                className="space-y-6"
              >
                {/* Author Info */}
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-white/20 mt-6 md:mt-10">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">About the Author</h3>
                  <div className="flex items-center space-x-3 mb-4">
                    <img src="/headerLogo.png" alt="" className="w-12 h-12 rounded-full" />
                    <div>
                      <h4 className="font-semibold text-slate-900">{post.author}</h4>
                      <p className="text-sm text-slate-600">Travel Expert</p>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Passionate travel writer with years of experience exploring the world&apos;s most beautiful destinations.
                  </p>
                </div>

                {/* Popular Posts */}
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-white/20">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Popular Posts</h3>
                  <div className="space-y-4">
                    {relatedPosts.slice(0, 3).map((popularPost) => (
                      <Link key={popularPost._id} href={`/blog/${generateSlug(popularPost.title)}`}>
                        <div className="flex items-center mb-2 space-x-3 group cursor-pointer">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                            {popularPost.image && popularPost.image.startsWith('http') ? (
                              <Image 
                                src={popularPost.image} 
                                alt={popularPost.title}
                                className="w-full h-full object-cover"
                                width={64}
                                height={64}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <div className={`absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-2xl ${popularPost.image && popularPost.image.startsWith('http') ? 'hidden' : ''}`}>
                              {popularPost.image || '📝'}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                              {popularPost.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">{popularPost.readTime} min read</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Newsletter Signup */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white mb-5 ">
                  <h3 className="text-lg font-bold mb-3">Stay Updated</h3>
                  <p className="text-blue-100 text-sm mb-4">
                    Get the latest travel tips and destination guides delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-white w-full px-3 py-2 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <Button className="w-full text-blue-600 font-semibold rounded-lg hover:bg-gray-100 hover:cursor-pointer hover:scale-105 transition-all duration-300 text-sm">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default BlogDetailClient;
