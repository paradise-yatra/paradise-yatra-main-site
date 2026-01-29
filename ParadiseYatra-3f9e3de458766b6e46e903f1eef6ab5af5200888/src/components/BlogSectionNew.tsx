import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
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

    const scrollNext = () => {
        if (carouselRef.current) {
            const card = carouselRef.current.firstElementChild;
            const gap = 24;
            const cardWidth = card ? card.getBoundingClientRect().width : 480;
            const step = cardWidth + gap;

            carouselRef.current.scrollBy({
                left: step,
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
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div className="space-y-6">
                        <h3 className="text-3xl md:text-4xl !font-bold text-slate-900 leading-tight">
                            Journeys, Stories & Insights
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {filters.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`px-6 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${activeFilter === filter.id
                                        ? "border-2 border-slate-900 hover:bg-slate-900 hover:text-white"
                                        : "border border-slate-200 hover:border-slate-900"
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Link
                        href="/blog"
                        className="text-sm font-semibold underline underline-offset-4 hover:opacity-70 transition-opacity"
                    >
                        View all
                    </Link>
                </div>

                {/* Carousel */}
                <div className="relative group">
                    <div
                        ref={carouselRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 snap-x snap-mandatory scroll-smooth"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {blogPosts.map((post) => (
                            <div
                                key={post._id}
                                className="w-[300px] md:w-[420px] lg:w-[480px] flex-shrink-0 snap-start"
                            >
                                <Link href={`/blog/${generateSlug(post.title)}`} className="block group/card h-full">
                                    <div className="relative h-[220px] md:h-[280px] w-full overflow-hidden rounded-lg mb-5">
                                        {post.image ? (
                                            <Image
                                                src={getImageUrl(post.image) || ""}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-4xl">
                                                📝
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-[12px] text-slate-500 font-bold uppercase tracking-wider">
                                            <span>{post.author}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>

                                        </div>
                                        <h4 className="text-xl !font-black leading-snug line-clamp-2 ">
                                            {post.title}
                                        </h4>

                                        <div className="pt-2">
                                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                                Read More
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover/card:translate-x-1" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Next button */}
                    <button
                        onClick={scrollNext}
                        className="absolute right-0 top-1/2 -translate-y-16 translate-x-1/2 w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-xl z-10 hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100 hidden md:flex cursor-pointer"
                        aria-label="Next"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BlogSectionNew;
