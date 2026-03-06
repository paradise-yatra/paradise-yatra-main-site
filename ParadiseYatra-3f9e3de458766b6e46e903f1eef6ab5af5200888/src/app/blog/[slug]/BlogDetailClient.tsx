"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock3 } from "lucide-react";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
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
}

interface BlogDetailClientProps {
  post: BlogPost;
  slug: string;
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

const getImageUrl = (image: string | undefined): string =>
  getOptimizedImageUrl(image || null) || "/images/placeholder-travel.jpg";

const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const BlogDetailClient = ({ post, slug }: BlogDetailClientProps) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const articleContentRef = useRef<HTMLDivElement | null>(null);

  const handleImageError = (
    postId: string,
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = event.target as HTMLImageElement;
    target.src = "/images/placeholder-travel.jpg";
    setImageErrors((prev) => new Set(prev).add(postId));
  };

  const getSafeImageUrl = (image: string, postId: string): string => {
    if (imageErrors.has(postId)) {
      return "/images/placeholder-travel.jpg";
    }

    return getImageUrl(image);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchRelatedPosts = async () => {
      try {
        const response = await fetch(
          `/api/blogs?published=true&limit=4&category=${encodeURIComponent(post.category)}`,
          {
            signal: controller.signal,
            cache: "default",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch similar articles");
        }

        const data = await response.json();
        const allBlogs = Array.isArray(data) ? data : data.blogs || [];
        const related = allBlogs
          .filter((blog: BlogPost) => blog._id !== post._id)
          .slice(0, 3);

        if (isMounted) {
          setRelatedPosts(related);
        }
      } catch (error) {
        if (
          isMounted &&
          !(error instanceof Error && error.name === "AbortError")
        ) {
          console.error("Error fetching similar articles:", error);
        }
      }
    };

    fetchRelatedPosts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [post._id, post.category]);

  useEffect(() => {
    const updateReadingProgress = () => {
      const articleElement = articleContentRef.current;

      if (!articleElement) {
        return;
      }

      const rect = articleElement.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      const articleTop = scrollTop + rect.top;
      const articleHeight = articleElement.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollableDistance = Math.max(articleHeight - viewportHeight, 1);
      const rawProgress = (scrollTop - articleTop) / scrollableDistance;
      const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);

      setReadingProgress(Math.round(clampedProgress * 100));
    };

    updateReadingProgress();

    window.addEventListener("scroll", updateReadingProgress, { passive: true });
    window.addEventListener("resize", updateReadingProgress);

    return () => {
      window.removeEventListener("scroll", updateReadingProgress);
      window.removeEventListener("resize", updateReadingProgress);
    };
  }, []);

  return (
    <>
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
        <div className="pointer-events-none fixed left-0 right-0 top-[84px] z-[59] h-[3px] bg-transparent">
          <div
            className="h-full bg-[#155dfc] transition-[width] duration-150 ease-out"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        <main className="bg-white px-5 pb-14 pt-6 md:px-8 md:pb-20 md:pt-8">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mx-auto max-w-[980px]"
          >
            <div ref={articleContentRef}>
              <header className="mx-auto max-w-[860px]">
                <h1 className="w-full !text-[28px] !font-bold !leading-[1.02] tracking-[-0.05em] text-[#000945] md:!text-[52px]">
                  {post.title}
                </h1>

                <p className="mt-5 w-full !text-[14px] !leading-[1.7] !text-[#000945] md:!text-[15px]">
                  {post.excerpt}
                </p>

                <div className="mt-8 flex flex-col gap-4 pb-2 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#efe7df] text-sm font-semibold text-[#000945]">
                      {post.author?.charAt(0) || "P"}
                    </div>
                    <div>
                      <p className="!text-[14px] !font-semibold !leading-none !text-[#000945]">
                        {post.author || "Paradise Yatra"}
                      </p>
                      <p className="mt-1.5 !text-[12px] !leading-none !text-[#000945]">
                        Editorial Contributor
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[#000945] md:gap-6">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <span className="text-[12px] font-medium md:text-[13px]">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      <span className="text-[12px] font-medium md:text-[13px]">
                        {post.readTime || 5} min read
                      </span>
                    </div>
                  </div>
                </div>
              </header>

              <div className="mt-2 overflow-hidden rounded-[6px]">
                <div className="relative h-[260px] md:h-[520px]">
                  <Image
                    src={getSafeImageUrl(post.image, post._id)}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 980px"
                    onError={(event) => handleImageError(post._id, event)}
                  />
                </div>
              </div>

              <div className="mx-auto mt-10 max-w-[860px]">
                <div
                  className="overflow-x-auto !text-[#000945] [&_h1]:!mb-5 [&_h1]:!mt-12 [&_h1]:!text-[34px] [&_h1]:!font-semibold [&_h1]:!leading-[1.08] [&_h1]:tracking-[-0.04em] [&_h1]:!text-[#000945] [&_h2]:!mb-5 [&_h2]:!mt-12 [&_h2]:!text-[30px] [&_h2]:!font-semibold [&_h2]:!leading-[1.1] [&_h2]:tracking-[-0.04em] [&_h2]:!text-[#000945] [&_h3]:!mb-4 [&_h3]:!mt-10 [&_h3]:!text-[24px] [&_h3]:!font-semibold [&_h3]:!leading-[1.16] [&_h3]:!text-[#000945] [&_h4]:!mb-3 [&_h4]:!mt-8 [&_h4]:!text-[20px] [&_h4]:!font-semibold [&_h4]:!text-[#000945] [&_p]:!mb-6 [&_p]:!text-[15px] [&_p]:!leading-[1.9] [&_p]:!text-[#000945] [&_ul]:!mb-6 [&_ul]:!list-disc [&_ul]:!space-y-2 [&_ul]:!pl-6 [&_ol]:!mb-6 [&_ol]:!list-decimal [&_ol]:!space-y-2 [&_ol]:!pl-6 [&_li]:!text-[15px] [&_li]:!leading-[1.85] [&_li]:!text-[#000945] [&_strong]:!text-[#000945] [&_em]:!text-[#000945] [&_span]:!text-[#000945] [&_blockquote]:!my-10 [&_blockquote]:!border-l-[3px] [&_blockquote]:!border-[#000945] [&_blockquote]:!pl-6 [&_blockquote]:!text-[24px] [&_blockquote]:!font-medium [&_blockquote]:!italic [&_blockquote]:!leading-[1.5] [&_blockquote]:!text-[#000945] [&_a]:!text-[#000945] [&_a]:!underline [&_img]:!my-8 [&_img]:!rounded-[18px] [&_table]:!my-8 [&_table]:!w-full [&_table]:!border-collapse [&_th]:!border-b [&_th]:!border-[#dfdfdf] [&_th]:!px-4 [&_th]:!py-3 [&_th]:!text-left [&_th]:!text-sm [&_th]:!font-semibold [&_th]:!text-[#000945] [&_td]:!border-b [&_td]:!border-[#ececec] [&_td]:!px-4 [&_td]:!py-3 [&_td]:!text-sm [&_td]:!text-[#000945]"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </div>

            {relatedPosts.length > 0 && (
              <section className="mx-auto mt-16 max-w-[980px] border-t border-[#e6e6e6] pt-10">
                <h2 className="!text-[28px] !font-bold !leading-none text-[#111111] md:!text-[36px]">
                  Similar Articles
                </h2>

                <div className="mt-6 grid gap-5 md:grid-cols-3">
                  {relatedPosts.map((relatedPost, index) => (
                    <motion.article
                      key={relatedPost._id}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.35, delay: index * 0.06 }}
                    >
                      <Link href={`/blog/${getPostSlug(relatedPost)}`} prefetch>
                        <div className="overflow-hidden rounded-[6px] bg-[#ececec]">
                          <div className="relative aspect-[1.24/1]">
                            <Image
                              src={getSafeImageUrl(
                                relatedPost.image,
                                relatedPost._id
                              )}
                              alt={relatedPost.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 33vw"
                              onError={(event) =>
                                handleImageError(relatedPost._id, event)
                              }
                            />
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#7a7a7a]">
                          <span>{relatedPost.category}</span>
                          <span>.</span>
                          <span>{formatDate(relatedPost.createdAt)}</span>
                          <span>.</span>
                          <span>{relatedPost.readTime || 5} min read</span>
                        </div>

                        <h3 className="mt-2 max-w-[260px] !text-[18px] !font-semibold !leading-[1.2] text-[#111111]">
                          {relatedPost.title}
                        </h3>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              </section>
            )}
          </motion.article>
        </main>
      </div>
    </>
  );
};

export default BlogDetailClient;
