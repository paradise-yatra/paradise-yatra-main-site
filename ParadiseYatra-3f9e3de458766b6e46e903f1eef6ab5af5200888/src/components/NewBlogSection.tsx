"use client";

import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SkeletonPackageCard } from "@/components/ui/skeleton";
import Skeleton from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

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
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const NewBlogSection = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allBlogPosts, setAllBlogPosts] = useState<BlogPost[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [activeScrollIndex, setActiveScrollIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Update mobile state based on screen size
  useEffect(() => {
    const updateMobileState = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    updateMobileState();
    window.addEventListener("resize", updateMobileState);
    return () => window.removeEventListener("resize", updateMobileState);
  }, []);

  // Handle scroll position for mobile indicators
  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current) return;

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth * 0.85; // 85vw
      const gap = 16; // 4 * 4px gap
      const adjustedCardWidth = cardWidth + gap;
      const newIndex = Math.round(scrollLeft / adjustedCardWidth);
      setActiveScrollIndex(
        Math.min(Math.max(0, newIndex), allBlogPosts.length - 1)
      );
    };

    const container = scrollContainerRef.current;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isMobile, allBlogPosts.length]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/blogs?featured=true");

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();

        // Handle both direct array and object with blogs array
        if (Array.isArray(data)) {
          setAllBlogPosts(data);
          setBlogPosts(data.slice(0, 3)); // Show only first 3 blogs initially
          setError(null);
        } else if (data.blogs && Array.isArray(data.blogs)) {
          setAllBlogPosts(data.blogs);
          setBlogPosts(data.blogs.slice(0, 3));
          setError(null);
        } else {
          console.error("Unexpected data structure:", data);
          setBlogPosts([]);
          setAllBlogPosts([]);
          setError("Invalid data format received");
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs");
        setBlogPosts([]); // Don't show static data, show empty state
        setAllBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Calculate total groups for desktop navigation
  const totalGroups = Math.ceil(allBlogPosts.length / 3);

  // Handle desktop navigation
  const handlePrevious = () => {
    if (isMobile) return;
    const newIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(newIndex);

    const startIndex = newIndex * 3;
    const endIndex = startIndex + 3;
    const newBlogPosts = allBlogPosts.slice(startIndex, endIndex);
    setBlogPosts(newBlogPosts);
  };

  const handleNext = () => {
    if (isMobile) return;
    const newIndex = Math.min(totalGroups - 1, currentIndex + 1);
    setCurrentIndex(newIndex);

    const startIndex = newIndex * 3;
    const endIndex = startIndex + 3;
    const newBlogPosts = allBlogPosts.slice(startIndex, endIndex);
    setBlogPosts(newBlogPosts);
  };

  if (loading) {
    return (
      <section className="section-padding bg-white px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <Skeleton height="2.5rem" width="300px" className="mx-auto mb-4" />
            <Skeleton height="1.25rem" width="200px" className="mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonPackageCard key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Don't render if blogPosts is not an array
  if (!Array.isArray(blogPosts)) {
    return null;
  }

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <Badge className="mb-4 !bg-blue-100 !text-blue-800 !rounded-md hover:bg-blue-100 !px-1 !py-1">
            Travel Insights
          </Badge>
          <h2
            className="text-slate-900 mb-4"
            style={{
              fontSize: "48px",
              fontWeight: 700,
              lineHeight: "48px",
            }}
          >
            Travel Insights & Guides
          </h2>
          <p className="text-[20px] text-slate-600 max-w-3xl mx-auto">
            Discover expert tips, local insights, and comprehensive guides to
            make your journey unforgettable
          </p>
        </div>

        {/* Desktop Pagination */}
        {!isMobile && (
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`w-10 h-10 border rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                currentIndex === 0
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === totalGroups - 1}
              className={`w-10 h-10 border rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                currentIndex === totalGroups - 1
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Packages Container */}
        {isMobile ? (
          // Mobile: Snap-scroll flex layout (match Trending)
          <div className="md:hidden">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-0 pb-4 w-full scrollbar-hide"
              style={{
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {allBlogPosts.map((post) => (
                <div
                  key={post._id}
                  className="pl-4 flex-shrink-0 snap-start h-full basis-[80%] sm:basis-[85%]"
                  style={{ maxWidth: "85%" }}
                >
                  <Link
                    href={`/blog/${generateSlug(post.title)}`}
                    className="block w-full"
                  >
                    <Card className="overflow-hidden hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 border-0">
                      <div className="relative overflow-hidden">
                        <Image
                          src={
                            post.image && getImageUrl(post.image)
                              ? getImageUrl(post.image)!
                              : "/placeholder-blog.jpg"
                          }
                          alt={post.title}
                          width={800}
                          height={400}
                          className="w-full h-64 object-cover"
                          onError={(e) => {
                            console.error("Image failed to load:", post.image);
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className=" !bg-[#3B82F6] text-white">
                            {post.category}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        {/* Publication Details */}
                        <div className="flex items-center text-slate-500 text-sm mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="mr-2">
                            {new Date(post.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <span className="mr-2">•</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{post.readTime} min read</span>
                        </div>

                        {/* Title */}
                        {/* <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3> */}

                        <h3
                          className="text-slate-900 mb-2 group-hover:!text-[#2563EB] transition-colors truncate"
                          style={{
                            fontSize: "20px",
                            fontWeight: 700,
                            lineHeight: "28px",
                            fontFamily:
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                          }}
                        >
                          {post.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {post.excerpt || post.content.substring(0, 150)}...
                        </p>

                        {/* Author Section */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs mr-2">
                              {post.author.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm text-gray-700 font-medium">
                              {post.author}
                            </span>
                          </div>

                          <Button
                            variant="outline"
                            className="hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
                          >
                            Read More
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>

            {/* Mobile scroll indicators */}
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {allBlogPosts.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ease-in-out ${
                      index === activeScrollIndex
                        ? "bg-blue-600 w-8"
                        : "bg-gray-300 w-2 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
              <div className="ml-4 text-xs text-gray-500 flex items-center">
                <span>Swipe to explore more</span>
              </div>
            </div>
          </div>
        ) : (
          // Desktop: grid layout
          <div className="hidden md:block">
            <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <div key={post._id} className="h-full flex flex-col">
                  <Link
                    href={`/blog/${generateSlug(post.title)}`}
                    className="block h-full"
                  >
                    <Card className="overflow-hidden hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 transform hover:-translate-y-1 group h-full border-[1px] border-[#E5E5E5]">
                      <div className="relative overflow-hidden">
                        <Image
                          src={
                            post.image && getImageUrl(post.image)
                              ? getImageUrl(post.image)!
                              : "/placeholder-blog.jpg"
                          }
                          alt={post.title}
                          width={800}
                          height={400}
                          className="w-full h-[192px] object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            console.error("Image failed to load:", post.image);
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes("unsplash.com")) {
                              target.src =
                                "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                            }
                          }}
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="!bg-blue-500 text-white rounded-md">
                            {post.category}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        {/* Publication Details */}
                        <div className="flex items-center text-slate-500 text-sm mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="mr-2">
                            {new Date(post.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <span className="mr-2">•</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{post.readTime} min read</span>
                        </div>

                        {/* Title */}
                        {/* <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3> */}

                        <h3
                          className="text-slate-900 mb-2 group-hover:!text-[#2563EB] transition-colors line-clamp-2"
                          style={{
                            fontSize: "20px",
                            fontWeight: 700,
                            lineHeight: "28px",
                            fontFamily:
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                          }}
                        >
                          {post.title}
                        </h3>

                        {/* Description */}
                        <p
                          className="text-[#475569] text-sm mb-4 line-clamp-3"
                          style={{
                            fontSize: "16px",
                            lineHeight: "26px",
                            fontWeight: 400,
                          }}
                        >
                          {post.excerpt || post.content.substring(0, 150)}...
                        </p>

                        {/* Author Section */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {/* <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs mr-2">
                              {post.author.charAt(0).toUpperCase()}
                            </div> */}

                            <Image
                              src="/l1.webp"
                              alt="author"
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                            <span className="text-sm text-gray-700 font-medium">
                              {post.author}
                            </span>
                          </div>

                          <Button
                            variant="outline"
                            className="py-2 px-4 hover:bg-blue-50 border-[1px] border-[#E5E5E5]   text-[#0A0A0A] hover:border-blue-500 hover:text-blue-600"
                            style={{
                              fontSize: "12px",
                              fontWeight: 500,
                              lineHeight: "16px",
                              fontFamily:
                                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            }}
                          >
                            Read More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {blogPosts.length === 0 && !loading && (
          <div className="text-center">
            <p className="text-gray-500">
              {error
                ? "Failed to load blog posts."
                : "No featured blog posts available."}
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/blog">
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8">
              View All Blog Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewBlogSection;
