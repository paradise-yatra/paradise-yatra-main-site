"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowRight, MapPin } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface TrendingPackage {
    id: string | number;
    destination: string;
    duration: string;
    title: string;
    price: number;
    image: string;
    slug: string;
}

// Robust helper to extract ID from any format
const getPackageId = (item: any): string => {
    if (!item) return "";
    if (typeof item === 'string') return item;
    if (typeof item === 'object') {
        const id = item._id || item.id;
        if (id && typeof id === 'object' && id.$oid) return id.$oid;
        if (id) return String(id);
    }
    return "";
};

const TrendingPackagesSection = () => {
    const [packages, setPackages] = useState<TrendingPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef<HTMLDivElement>(null);
    const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        const fetchTrendingData = async () => {
            try {
                setLoading(true);
                // 1. Fetch all tags to find the trending tag
                const tagsRes = await fetch("/api/tags");
                const tagsData = await tagsRes.json();

                const allTags = Array.isArray(tagsData) ? tagsData : (tagsData.data || []);
                const success = Array.isArray(tagsData) || tagsData.success;

                if (!tagsRes.ok || !success) {
                    console.error("Failed to fetch tags", tagsData);
                    return;
                }

                const trendingTag = allTags.find((tag: any) =>
                    tag.slug.toLowerCase().includes("trending") ||
                    tag.name.toLowerCase().includes("trending")
                );

                if (!trendingTag || !trendingTag.packages || trendingTag.packages.length === 0) {
                    console.warn("Trending tag not found or has no packages", trendingTag);
                    setPackages([]);
                    setLoading(false);
                    return;
                }

                // 2. Fetch all possible data sources to match IDs
                let matchedPackages = [];

                if (typeof trendingTag.packages[0] === 'object') {
                    matchedPackages = trendingTag.packages;
                } else {
                    // It's an array of IDs, we need to fetch all possible sources
                    const [packagesRes, holidayRes, destinationsRes, fixedRes] = await Promise.all([
                        fetch("/api/packages?limit=100"),
                        fetch("/api/holiday-types?limit=100"),
                        fetch("/api/destinations?limit=100"),
                        fetch("/api/fixed-departures?limit=100")
                    ]);

                    const [packagesData, holidayData, destinationsData, fixedData] = await Promise.all([
                        packagesRes.json().catch(() => ({})),
                        holidayRes.json().catch(() => ([])),
                        destinationsRes.json().catch(() => ({})),
                        fixedRes.json().catch(() => ({}))
                    ]);

                    const normalize = (data: any) => {
                        if (!data) return [];
                        if (Array.isArray(data)) return data;
                        if (data.data && Array.isArray(data.data)) return data.data;
                        if (data.packages) return data.packages;
                        if (data.destinations) return data.destinations;
                        if (data.fixedDepartures) return data.fixedDepartures;
                        if (data.holidayTypes) return data.holidayTypes;
                        return [];
                    };

                    const allItems = [
                        ...normalize(packagesData),
                        ...normalize(holidayData),
                        ...normalize(destinationsData),
                        ...normalize(fixedData)
                    ];

                    // Normalize tagged package IDs to ensure consistent matching
                    const taggedIds = (trendingTag.packages || []).map((p: any) => getPackageId(p)).filter((id: string) => id !== "");

                    matchedPackages = allItems.filter((item: any) => {
                        const itemId = getPackageId(item);
                        return itemId && taggedIds.includes(itemId);
                    });

                    // Remove duplicates based on ID
                    matchedPackages = Array.from(new Map(matchedPackages.map((pkg: any) => [getPackageId(pkg), pkg])).values());
                }

                // 3. Map to TrendingPackage format
                const mappedPackages: TrendingPackage[] = matchedPackages.map((pkg: any, index: number) => {
                    const pkgId = getPackageId(pkg) || `pkg-${index}`;
                    return {
                        id: pkgId,
                        destination: pkg.destination || pkg.location || pkg.state || pkg.title || "India",
                        duration: pkg.duration || "5N/6D",
                        title: pkg.title || pkg.name || "Exciting Tour",
                        price: typeof pkg.price === 'string' ? parseInt(pkg.price.replace(/[^\d]/g, '')) : (pkg.price || 0),
                        image: getImageUrl(pkg.images?.[0] || pkg.image || pkg.thumbnail) || `https://picsum.photos/800/500?random=${index + 140}`,
                        slug: pkg.slug || pkgId,
                    };
                });

                setPackages(mappedPackages);
            } catch (error) {
                console.error("Error fetching trending packages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingData();
    }, []);

    // Get the max scroll width
    const getMaxScroll = useCallback(() => {
        if (!carouselRef.current) return 0;
        return carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
    }, []);

    const getStep = useCallback(() => {
        if (!carouselRef.current) return 0;
        const card = carouselRef.current.querySelector("article");
        if (!card) return 0;
        const gap = 24; // gap-6 = 24px
        return card.getBoundingClientRect().width + gap;
    }, []);

    // Auto-scroll functionality
    const startAutoScroll = useCallback(() => {
        if (autoScrollRef.current) {
            clearInterval(autoScrollRef.current);
        }

        autoScrollRef.current = setInterval(() => {
            if (!carouselRef.current || isHovered) return;

            const maxScroll = getMaxScroll();
            if (maxScroll <= 0) return;

            const currentScroll = carouselRef.current.scrollLeft;

            // Stop scrolling when reaching the end
            if (currentScroll >= maxScroll - 1) {
                stopAutoScroll();
                // Optional: Wait 2 seconds then restart from beginning
                setTimeout(() => {
                    if (carouselRef.current && !isHovered) {
                        carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
                        startAutoScroll();
                    }
                }, 2000);
            } else {
                // Smooth scroll
                carouselRef.current.scrollLeft += 1;
            }
        }, 20);
    }, [isHovered, getMaxScroll]);

    const stopAutoScroll = useCallback(() => {
        if (autoScrollRef.current) {
            clearInterval(autoScrollRef.current);
            autoScrollRef.current = null;
        }
    }, []);

    // Start/stop auto-scroll based on hover state and package availability
    useEffect(() => {
        if (packages.length > 0) {
            if (isHovered) {
                stopAutoScroll();
            } else {
                startAutoScroll();
            }
        }

        const handleTouchStart = () => stopAutoScroll();
        const handleTouchEnd = () => {
            if (!isHovered) {
                // Wait a bit after touch ends before restarting auto-scroll
                setTimeout(startAutoScroll, 2000);
            }
        };

        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
            carousel.addEventListener('touchend', handleTouchEnd, { passive: true });
        }

        return () => {
            stopAutoScroll();
            if (carousel) {
                carousel.removeEventListener('touchstart', handleTouchStart);
                carousel.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [isHovered, startAutoScroll, stopAutoScroll, packages]);

    const handlePrev = () => {
        if (isScrolling || !carouselRef.current) return;
        setIsScrolling(true);

        const step = getStep();
        carouselRef.current.scrollBy({ left: -step, behavior: "smooth" });

        setTimeout(() => setIsScrolling(false), 500);
    };

    // Manual next button click
    const handleNext = () => {
        if (isScrolling || !carouselRef.current) return;
        setIsScrolling(true);

        const step = getStep();
        const maxScroll = getMaxScroll();
        const currentScroll = carouselRef.current.scrollLeft;

        // If we're near the end, loop back to start
        if (currentScroll >= maxScroll - 10) {
            carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
            carouselRef.current.scrollBy({ left: step, behavior: "smooth" });
        }

        setTimeout(() => setIsScrolling(false), 500);
    };

    if (loading) {
        return (
            <section className="bg-white px-4 pb-20 pt-12 text-gray-900 md:px-8 relative overflow-hidden">
                <div className="mx-auto max-w-6xl relative z-10">
                    <div className="flex flex-col gap-8 md:flex-row md:items-center">
                        <div className="flex flex-col gap-3 md:w-[30%] animate-pulse">
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            <div className="h-10 w-64 bg-gray-200 rounded"></div>
                            <div className="h-20 w-full bg-gray-200 rounded"></div>
                        </div>
                        <div className="md:w-[70%] flex gap-6 overflow-hidden">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="min-w-[265px] h-96 bg-gray-100 rounded-lg animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (packages.length === 0) return null;

    return (
        <section className="bg-white px-4 pb-20 pt-12 text-gray-900 md:px-8 relative overflow-hidden">
            <div className="mx-auto max-w-6xl relative z-10">
                <div className="flex flex-col gap-8 md:flex-row md:items-center">
                    {/* Left side - Header */}
                    <div className="flex flex-col gap-3 md:w-[30%]">
                        <div className="flex items-center gap-2">
                            <span className="h-px w-8 bg-[#005beb]"></span>
                            <span className="text-[#005beb] !font-black uppercase tracking-wider text-xs">
                                Trending Now
                            </span>
                        </div>

                        <h3 className="!text-2xl md:text-3xl !font-bold text-slate-900 leading-tight">
                            What Everyone's <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005beb] to-[#0080ff]">
                                Booking
                            </span>
                        </h3>

                        <p className="!text-sm !text-slate-600 md:text-base !font-semibold leading-relaxed">
                            Explore the hottest travel experiences
                            everyone is booking right now - handpicked
                            for value, comfort, and unforgettable
                            memories.
                        </p>

                        <div className="flex mt-2 mb-4 md:mt-4 md:mb-0">
                            <Link href="packages/category/Trending%20Destinations" className="px-5 py-2.5 md:px-6 md:py-3 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 group shadow-sm">
                                View All Deals
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Right side - Carousel */}
                    <div
                        className="md:w-[70%] relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div
                            ref={carouselRef}
                            className="flex gap-6 overflow-x-auto pb-8 pt-4 scrollbar-hide px-2 touch-auto"
                            style={{
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                                scrollSnapType: "x proximity",
                                WebkitOverflowScrolling: "touch"
                            }}
                        >
                            {/* Dynamic Cards */}
                            {packages.map((pkg, index) => (
                                <Link href={`/itinerary/${pkg.slug}`} key={`${pkg.id}-${index}`} className="block flex-shrink-0">
                                    <article
                                        className="group cursor-pointer bg-white rounded-lg overflow-hidden border border-gray-200 scroll-snap-align-center md:scroll-snap-align-start transition-all duration-300 relative w-[260px] min-w-[260px] md:w-[265px] md:min-w-[265px] max-w-[260px] md:max-w-[265px]"
                                    >
                                        {/* White hover overlay */}
                                        <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none"></div>

                                        <div className="relative h-64 w-full overflow-hidden">
                                            <Image
                                                src={pkg.image}
                                                alt={pkg.destination}
                                                fill
                                                className="object-cover transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>

                                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                                <div className="flex items-center gap-1.5 mb-1.5 opacity-90">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    <span className="text-xs font-medium tracking-wide uppercase">{pkg.destination}</span>
                                                </div>
                                                <h4 className="text-lg font-bold leading-snug line-clamp-2 text-shadow-sm">
                                                    {pkg.title}
                                                </h4>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-700 font-bold uppercase tracking-wide">Duration</span>
                                                    <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#005beb]"></div>
                                                        {pkg.duration}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs text-slate-700 font-bold uppercase tracking-wide">Starts from</span>
                                                    <span className="text-lg font-black text-[#005beb]">
                                                        ₹{pkg.price.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-dashed border-gray-200 flex items-center justify-between">
                                                <span className="text-xs text-slate-900 font-bold">Per Person</span>
                                                <button className="text-sm font-bold text-slate-900 group-hover:text-[#005beb] transition-colors flex items-center gap-2">
                                                    View Deal <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>

                        {/* Navigation button */}
                        <div className="flex items-center gap-2 mt-4 md:absolute md:-bottom-12 md:right-0">
                            <button
                                onClick={handlePrev}
                                className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 bg-white/80 backdrop-blur-sm shadow-sm transition-all text-slate-700"
                                aria-label="Previous destination"
                            >
                                <ChevronRight className="h-5 w-5 rotate-180" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 bg-white/80 backdrop-blur-sm shadow-sm transition-all text-slate-700"
                                aria-label="Next destination"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default TrendingPackagesSection;

