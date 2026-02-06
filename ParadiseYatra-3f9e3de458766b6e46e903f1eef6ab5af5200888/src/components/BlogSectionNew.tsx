import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CarouselArrows from "./ui/CarouselArrows";
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
                        cache: 'default', // Use cache to reduce requests
                    });
                    clearTimeout(timeoutId);
                } catch (fetchError) {
                    clearTimeout(timeoutId);
                    if (fetchError instanceof Error && fetchError.name === 'AbortError') {
                        if (isMounted) {
                            console.warn('Blog fetch timed out');
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
                    const categories = Array.from(new Set(posts.map((post) => post.category).filter(Boolean)));
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
                        <div className="h-10 w-64 bg-slate-200 rounded"></div>
                        <div className="flex gap-6 overflow-hidden">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-[480px] flex-shrink-0 h-[400px] bg-slate-100 rounded-lg"></div>
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
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                    <div className="space-y-4">
                        <span className="text-[#005beb] !font-black uppercase tracking-wider text-xs flex items-center gap-2">
                            <span className="h-px w-8 bg-[#005beb]"></span>
                            Updates & Insights
                        </span>
                        <h3 className="text-2xl md:text-3xl !font-bold text-slate-900 leading-tight">
                            Journeys, Stories & Tips
                        </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex flex-wrap gap-2">
                            {filters.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`px-4 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer ${activeFilter === filter.id
                                        ? "bg-slate-900 text-white shadow-md"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                        <Link
                            href="/blog"
                            className="text-xs font-black uppercase tracking-widest text-[#005beb] hover:opacity-70 transition-opacity ml-2"
                        >
                            View all
                        </Link>
                    </div>
                </div>

                {/* Carousel */}
                {/* Content Area */}
                <div className="relative group/carousel">
                    <CarouselArrows
                        onPrevious={() => scrollByStep(-1)}
                        onNext={() => scrollByStep(1)}
                        canScrollLeft={canScrollLeft}
                        canScrollRight={canScrollRight}
                    />

                    <div
                        ref={carouselRef}
                        className="flex gap-2 overflow-x-auto scroll-smooth scrollbar-hide pb-8 snap-x snap-mandatory px-1"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {blogPosts.map((post) => (
                            <div
                                key={post._id}
                                className="w-[280px] md:w-[calc(50%-4px)] lg:w-[calc(25%-6px)] flex-shrink-0 snap-start"
                            >
                                <Link href={`/blog/${generateSlug(post.title)}`} className="block group/card h-full bg-white rounded-lg overflow-hidden border border-gray-300 transition-all duration-300 hover:border-blue-200 hover:shadow-md">
                                    <div className="relative h-[180px] w-full overflow-hidden">
                                        {/* White hover overlay */}
                                        <div className="absolute inset-0 bg-white/10 opacity-10 group-hover/card:opacity-100 transition-opacity duration-300 z-30 pointer-events-none"></div>

                                        {post.image ? (
                                            <Image
                                                src={getImageUrl(post.image) || ""}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-4xl">
                                                📝
                                            </div>
                                        )}
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                            <span className="text-blue-600 px-2 py-0.5 bg-blue-50 rounded-full">{post.category || "Travel"}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <h4 className="text-base !font-bold leading-snug line-clamp-2 text-slate-900 group-hover/card:text-blue-600 transition-colors min-h-[44px]">
                                            {post.title}
                                        </h4>
                                        <p className="!text-slate-700 text-xs line-clamp-2 leading-relaxed">
                                            {post.excerpt || post.content.substring(0, 80).replace(/<[^>]*>?/gm, '') + '...'}
                                        </p>
                                        <div className="pt-3 flex items-center justify-between border-t border-dashed border-gray-300">
                                            <span className="text-[11px] font-bold text-slate-600 truncate max-w-[100px]">{post.author}</span>
                                            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-slate-900 group-hover/card:text-blue-600 transition-colors">
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
