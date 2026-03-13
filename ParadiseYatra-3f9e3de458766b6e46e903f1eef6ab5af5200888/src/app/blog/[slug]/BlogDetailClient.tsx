"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock3 } from "lucide-react";
import Header from "@/components/Header";
import FAQSection from "@/components/FAQSection";
import Image from "next/image";
import Link from "next/link";
import { BLOG_CARD_IMAGE_OPTIONS, BLOG_HERO_IMAGE_OPTIONS } from "@/lib/blogImageOptions";
import { getImageUrl as getOptimizedImageUrl } from "@/lib/utils";
import { preserveRichTextSpacing } from "@/lib/richText";

interface BlogFAQ {
  question: string;
  answer: string;
  order?: number;
}

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
  faqs?: BlogFAQ[];
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

type BlogImageVariant = "hero" | "card";

const getImageUrl = (
  image: string | undefined,
  variant: BlogImageVariant = "card"
): string =>
  getOptimizedImageUrl(
    image || null,
    variant === "hero" ? BLOG_HERO_IMAGE_OPTIONS : BLOG_CARD_IMAGE_OPTIONS
  ) || "/images/placeholder-travel.jpg";

const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

const BlogDetailClient = ({ post, slug }: BlogDetailClientProps) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [enableProgress, setEnableProgress] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const articleContentRef = useRef<HTMLDivElement | null>(null);
  const progressRafRef = useRef<number | null>(null);
  const progressLastRef = useRef(0);
  const progressMetricsRef = useRef({ top: 0, height: 1, viewport: 1 });
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const handleImageError = (
    postId: string,
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = event.target as HTMLImageElement;
    target.src = "/images/placeholder-travel.jpg";
    setImageErrors((prev) => new Set(prev).add(postId));
  };

  const getSafeImageUrl = (
    image: string,
    postId: string,
    variant: BlogImageVariant = "card"
  ): string => {
    if (imageErrors.has(postId)) {
      return "/images/placeholder-travel.jpg";
    }

    return getImageUrl(image, variant);
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
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      if (isMobile) {
        setEnableProgress(false);
        return;
      }
      setEnableProgress(true);
    }

    const measure = () => {
      const articleElement = articleContentRef.current;
      if (!articleElement) return;

      const rect = articleElement.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      progressMetricsRef.current = {
        top: scrollTop + rect.top,
        height: articleElement.offsetHeight,
        viewport: window.innerHeight,
      };
    };

    const updateReadingProgress = () => {
      if (progressRafRef.current !== null) return;
      progressRafRef.current = window.requestAnimationFrame(() => {
        progressRafRef.current = null;
        const { top, height, viewport } = progressMetricsRef.current;
        const scrollTop = window.scrollY || window.pageYOffset;
        const scrollableDistance = Math.max(height - viewport, 1);
        const rawProgress = (scrollTop - top) / scrollableDistance;
        const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);
        const nextValue = Math.round(clampedProgress * 100);

        if (nextValue !== progressLastRef.current) {
          progressLastRef.current = nextValue;
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${nextValue}%`;
          }
        }
      });
    };

    const handleResize = () => {
      measure();
      updateReadingProgress();
    };

    measure();
    updateReadingProgress();

    window.addEventListener("scroll", updateReadingProgress, { passive: true });
    window.addEventListener("resize", handleResize);

    const measureTimeout = window.setTimeout(measure, 400);

    return () => {
      window.removeEventListener("scroll", updateReadingProgress);
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(measureTimeout);
      if (progressRafRef.current !== null) {
        window.cancelAnimationFrame(progressRafRef.current);
      }
    };
  }, []);

  const faqItems = (post.faqs || [])
    .filter((faq) => faq.question && faq.answer)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }));
  const hasFaqs = faqItems.length > 0;
  const showProgress = hasMounted && enableProgress;

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
            image: getImageUrl(post.image, "hero"),
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
      {hasFaqs && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqItems.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      )}

      <div className="min-h-screen bg-white">
        <Header />
        {showProgress && (
          <div className="pointer-events-none fixed left-0 right-0 top-[84px] z-[59] h-[3px] bg-transparent">
            <div
              ref={progressBarRef}
              className="h-full bg-[#155dfc] transition-[width] duration-150 ease-out will-change-[width]"
              style={{ width: "0%" }}
            />
          </div>
        )}

        <main className="bg-white px-5 pb-14 pt-6 md:px-8 md:pb-20 md:pt-8">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mx-auto max-w-[980px]"
          >
            <div ref={articleContentRef}>
              <header className="mx-auto max-w-[860px]">
                <h1 className="w-full !text-[28px] !font-[900] !leading-[1.02] tracking-[-0.05em] text-[#000945] md:!text-[52px]">
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

              <div className="mt-2 -mx-5 w-[calc(100%+2.5rem)] overflow-hidden rounded-none md:mx-0 md:w-full md:rounded-[18px]">
                <div className="relative aspect-video w-full">
                  <Image
                    src={getSafeImageUrl(post.image, post._id, "hero")}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                    onError={(event) => handleImageError(post._id, event)}
                  />
                </div>
              </div>

              <div className="mx-auto mt-10 max-w-[860px]">
                <div
                  suppressHydrationWarning
                  className="blog-content overflow-x-auto !text-[#000945] [&_h1]:!m-0 [&_h1]:!text-[34px] [&_h1]:!font-semibold [&_h1]:!leading-[1.08] [&_h1]:tracking-[-0.04em] [&_h1]:!text-[#000945] [&_h2]:!m-0 [&_h2]:!text-[24px] md:[&_h2]:!text-[30px] [&_h2]:!font-bold [&_h2]:!leading-[1.1] [&_h2]:tracking-[-0.04em] [&_h2]:!text-[#000945] [&_h3]:!m-0 [&_h3]:!text-[20px] md:[&_h3]:!text-[24px] [&_h3]:!font-bold [&_h3]:!leading-[1.16] [&_h3]:!text-[#000945] [&_h4]:!m-0 [&_h4]:!text-[20px] [&_h4]:!font-semibold [&_h4]:!text-[#000945] [&_p]:!m-0 [&_p]:!text-[15px] [&_p]:!leading-[1.9] [&_p]:!text-[#000945] [&_ul]:!m-0 [&_ul]:!list-disc [&_ul]:!pl-6 [&_ol]:!m-0 [&_ol]:!list-decimal [&_ol]:!pl-6 [&_li]:!m-0 [&_li]:!text-[15px] [&_li]:!leading-[1.85] [&_li]:!text-[#000945] [&_li_p]:!m-0 [&_strong]:!text-[#000945] [&_em]:!text-[#000945] [&_span]:!text-[#000945] [&_blockquote]:!m-0 [&_blockquote]:!border-l-[3px] [&_blockquote]:!border-[#000945] [&_blockquote]:!pl-6 [&_blockquote]:!text-[24px] [&_blockquote]:!font-medium [&_blockquote]:!italic [&_blockquote]:!leading-[1.5] [&_blockquote]:!text-[#000945] [&_a]:!text-[#155dfc] [&_a]:!underline [&_img]:!my-0 [&_img]:!rounded-[18px] [&_table]:!m-0 [&_table]:!w-full [&_table]:!border-collapse [&_th]:!border-b [&_th]:!border-[#dfdfdf] [&_th]:!px-4 [&_th]:!py-3 [&_th]:!text-left [&_th]:!text-sm [&_th]:!font-semibold [&_th]:!text-[#000945] [&_td]:!border-b [&_td]:!border-[#ececec] [&_td]:!px-4 [&_td]:!py-3 [&_td]:!text-sm [&_td]:!text-[#000945]"
                  dangerouslySetInnerHTML={{ __html: preserveRichTextSpacing(post.content) }}
                />
              </div>
            </div>

            {hasFaqs && (
              <div className="mt-16">
                <FAQSection faqs={faqItems} />
              </div>
            )}

            {relatedPosts.length > 0 && (
              <section className="mx-auto mt-16 max-w-[980px] border-t border-[#e6e6e6] pt-10">
                <h2 className="!text-[28px] !font-bold !leading-none text-[#111111] md:!text-[36px]">
                  You Might Like
                </h2>
                <p className="mt-3 !text-[14px] !leading-[1.7] !text-[#666666] md:!text-[15px]">
                  More {post.category} reads from the Paradise Yatra blog.
                </p>

                <div className="mt-6 grid gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((relatedPost, index) => (
                    <motion.article
                      key={relatedPost._id}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.35, delay: index * 0.06 }}
                      className="w-full"
                    >
                      <Link href={`/blog/${getPostSlug(relatedPost)}`} prefetch className="block h-full">
                        <div className="relative mb-4 aspect-[1/0.82] overflow-hidden rounded-[6px] bg-[#e5e5e5]">
                          <Image
                            src={getSafeImageUrl(
                              relatedPost.image,
                              relatedPost._id
                            )}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onError={(event) =>
                              handleImageError(relatedPost._id, event)
                            }
                          />
                        </div>

                        <h3 className="line-clamp-2 !text-[18px] !font-semibold !leading-[1.16] tracking-[-0.03em] !text-[#000945] md:!text-[22px]">
                          {relatedPost.title}
                        </h3>

                        <div className="mt-3">
                          <span className="inline-flex rounded-full border border-[#d6d6d6] bg-white px-3 py-1 text-[11px] font-medium text-[#000945]">
                            {new Date(relatedPost.createdAt).toLocaleDateString("en-US", {
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
          </motion.article>
        </main>
      </div>
    </>
  );
};

export default BlogDetailClient;
