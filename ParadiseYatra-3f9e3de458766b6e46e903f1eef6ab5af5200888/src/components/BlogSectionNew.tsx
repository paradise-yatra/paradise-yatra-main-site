import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CarouselArrows from "./ui/CarouselArrows";
import { getImageUrl } from "@/lib/utils";

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

const BlogSectionNew = () => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [activeFilter, setActiveFilter] = useState("all");
    const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [filters, setFilters] = useState([{ id: "all", label: "All Posts" }]);
    const [loading, setLoading] = useState(true);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScrollState = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener("scroll", updateScrollState);
            window.addEventListener("resize", updateScrollState);
            setTimeout(updateScrollState, 100);

            return () => {
                carousel.removeEventListener("scroll", updateScrollState);
                window.removeEventListener("resize", updateScrollState);
            };
        }
    }, [blogPosts]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const fetchBlogs = async () => {
            try {
                if (!isMounted) return;
                setLoading(true);

                let response;
                try {
                    response = await fetch("/api/blogs?featured=true", {
                        signal: controller.signal,
                        cache: "no-store",
                    });
                    clearTimeout(timeoutId);
                } catch (fetchError) {
                    clearTimeout(timeoutId);
                    if (fetchError instanceof Error && fetchError.name === "AbortError") {
                        if (isMounted) {
                            console.warn("Blog fetch timed out");
                            setLoading(false);
                        }
                        return;
                    }
                    throw fetchError;
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch blogs");
                }

                const data = await response.json();
                let posts: BlogPost[] = [];

                if (Array.isArray(data)) {
                    posts = data;
                } else if (data.blogs && Array.isArray(data.blogs)) {
                    posts = data.blogs;
                }

                if (isMounted) {
                    setAllPosts(posts);
                    setBlogPosts(posts.slice(0, 6));

                    // Extract unique categories
                    const categories = Array.from(
                        new Set(posts.map((post) => post.category).filter(Boolean))
                    );
                    const newFilters = [
                        { id: "all", label: "All Posts" },
                        ...categories.map((cat) => ({ id: cat, label: cat })),
                    ];
                    setFilters(newFilters);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error fetching blogs:", err);
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

    // Handle filtering
    useEffect(() => {
        if (activeFilter === "all") {
            setBlogPosts(allPosts.slice(0, 6));
        } else {
            const filtered = allPosts.filter((post) => post.category === activeFilter);
            setBlogPosts(filtered.slice(0, 6));
        }
    }, [activeFilter, allPosts]);

    const scrollByStep = (direction: number) => {
        if (carouselRef.current) {
            const card = carouselRef.current.firstElementChild;
            const gap = 8; // gap-2 = 8px
            const cardWidth = card ? card.getBoundingClientRect().width : 340;
            const step = cardWidth + gap;

            carouselRef.current.scrollBy({
                left: direction * step,
                behavior: "smooth",
            });
        }
    };

    if (loading) {
        return (
            <section className="bg-white px-4 py-14 md:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="animate-pulse space-y-8">
                        <div className="h-10 w-64 rounded bg-slate-200"></div>
                        <div className="flex gap-6 overflow-hidden">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-[400px] w-[480px] flex-shrink-0 rounded-lg bg-slate-100"
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (allPosts.length === 0 && !loading) return null;

    return (
        <section className="bg-white px-4 py-14 text-gray-900 md:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div className="space-y-4">
                        <span className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#005beb] !font-black">
                            <span className="h-px w-8 bg-[#005beb]"></span>
                            Updates & Insights
                        </span>
                        <h3 className="text-2xl !font-bold leading-tight text-slate-900 md:text-3xl">
                            Journeys, Stories & Tips
                        </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex flex-wrap gap-2">
                            {filters.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`cursor-pointer rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                                        activeFilter === filter.id
                                            ? "bg-[#0b1220] text-white shadow-md"
                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                        <Link
                            href="/blog"
                            className="ml-2 text-xs font-black uppercase tracking-widest text-[#005beb] transition-opacity hover:opacity-70"
                        >
                            View all
                        </Link>
                    </div>
                </div>

                {/* Carousel */}
                <div className="relative group/carousel">
                    <CarouselArrows
                        onPrevious={() => scrollByStep(-1)}
                        onNext={() => scrollByStep(1)}
                        canScrollLeft={canScrollLeft}
                        canScrollRight={canScrollRight}
                    />

                    <div
                        ref={carouselRef}
                        className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-1 pb-8 scrollbar-hide"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {blogPosts.map((post) => (
                            <div
                                key={post._id}
                                className="w-[280px] flex-shrink-0 snap-start md:w-[calc(50%-4px)] lg:w-[calc(25%-6px)]"
                            >
                                <Link
                                    href={`/blog/${getPostSlug(post)}`}
                                    className="group/card block h-full overflow-hidden rounded-[6px] border border-[#d6dbe6] bg-white transition-all duration-300 hover:border-blue-200 hover:shadow-md"
                                >
                                    <div className="relative h-[190px] w-full overflow-hidden">
                                        <div className="pointer-events-none absolute inset-0 z-30 bg-white/10 opacity-10 transition-opacity duration-300 group-hover/card:opacity-100"></div>

                                        {post.image ? (
                                            <Image
                                                src={getImageUrl(post.image) || ""}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-slate-200 text-4xl">
                                                📝
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"></div>
                                    </div>
                                    <div className="space-y-3 p-4">
                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-600">
                                                {post.category || "Travel"}
                                            </span>
                                            <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                            <span>
                                                {new Date(post.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                        <h4
                                            className="text-[15px] !font-bold text-slate-900 transition-colors group-hover/card:text-blue-600 overflow-hidden"
                                            style={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                lineHeight: "1.2",
                                                maxHeight: "2.4em",
                                            }}
                                        >
                                            {post.title}
                                        </h4>
                                        <p className="line-clamp-2 !text-slate-700 text-xs leading-relaxed">
                                            {post.excerpt ||
                                                `${post.content
                                                    .substring(0, 80)
                                                    .replace(/<[^>]*>?/gm, "")}...`}
                                        </p>
                                        <div className="flex items-center justify-between border-t border-dashed border-gray-300 pt-3">
                                            <span className="max-w-[120px] truncate text-[11px] font-bold text-slate-700">
                                                {post.author || "Paradise Yatra"}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase text-slate-900 transition-colors group-hover/card:text-blue-600">
                                                Read
                                                <ArrowRight className="h-3 w-3 transition-transform group-hover/card:translate-x-1" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogSectionNew;
