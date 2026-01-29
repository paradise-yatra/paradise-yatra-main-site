"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, MapPin } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface HoneymoonPackage {
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

const HoneymoonPackages = () => {
    const [packages, setPackages] = useState<HoneymoonPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    useEffect(() => {
        const fetchHoneymoonData = async () => {
            try {
                setLoading(true);
                // 1. Fetch all tags to find the honeymoon tag
                const tagsRes = await fetch("/api/tags");
                const tagsData = await tagsRes.json();

                const allTags = Array.isArray(tagsData) ? tagsData : (tagsData.data || []);
                const success = Array.isArray(tagsData) || tagsData.success;

                if (!tagsRes.ok || !success) {
                    console.error("Failed to fetch tags", tagsData);
                    return;
                }

                const honeymoonTag = allTags.find((tag: any) =>
                    tag.slug.toLowerCase().includes("honeymoon") ||
                    tag.name.toLowerCase().includes("honeymoon")
                );

                if (!honeymoonTag || !honeymoonTag.packages || honeymoonTag.packages.length === 0) {
                    console.warn("Honeymoon tag not found or has no packages", honeymoonTag);
                    setPackages([]);
                    setLoading(false);
                    return;
                }

                // 2. Fetch all possible data sources to match IDs
                let matchedPackages = [];

                if (typeof honeymoonTag.packages[0] === 'object') {
                    matchedPackages = honeymoonTag.packages;
                } else {
                    // It's an array of IDs, we need to fetch all possible sources
                    // especially since some items are in holiday-types or destinations
                    const [packagesRes, holidayRes, destinationsRes, fixedRes] = await Promise.all([
                        fetch("/api/packages"),
                        fetch("/api/holiday-types"),
                        fetch("/api/destinations"),
                        fetch("/api/fixed-departures")
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
                    const taggedIds = (honeymoonTag.packages || []).map((p: any) => getPackageId(p)).filter((id: string) => id !== "");

                    matchedPackages = allItems.filter((item: any) => {
                        const itemId = getPackageId(item);
                        return itemId && taggedIds.includes(itemId);
                    });

                    // Remove duplicates based on ID
                    matchedPackages = Array.from(new Map(matchedPackages.map((pkg: any) => [getPackageId(pkg), pkg])).values());
                }

                // 3. Map to HoneymoonPackage format
                const mappedPackages: HoneymoonPackage[] = matchedPackages.map((pkg: any, index: number) => {
                    const pkgId = getPackageId(pkg) || `pkg-${index}`;
                    return {
                        id: pkgId,
                        destination: pkg.destination || pkg.location || pkg.state || pkg.title || "India",
                        duration: pkg.duration || "5N/6D",
                        title: pkg.title || pkg.name || "Romantic Getaway",
                        price: typeof pkg.price === 'string' ? parseInt(pkg.price.replace(/[^\d]/g, '')) : (pkg.price || 0),
                        image: getImageUrl(pkg.images?.[0] || pkg.image || pkg.thumbnail) || `https://picsum.photos/800/500?random=${index + 50}`,
                        slug: pkg.slug || pkgId,
                    };
                });

                setPackages(mappedPackages);
            } catch (error) {
                console.error("Error fetching honeymoon packages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHoneymoonData();
    }, []);

    // Update scroll buttons state
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
            updateScrollState();

            return () => {
                carousel.removeEventListener("scroll", updateScrollState);
                window.removeEventListener("resize", updateScrollState);
            };
        }
    }, [packages]); // Re-check when packages are loaded

    const scrollByStep = (direction: number) => {
        if (carouselRef.current) {
            const card = carouselRef.current.querySelector("article");
            const gap = 24; // Corresponds to gap-6
            const cardWidth = card ? card.getBoundingClientRect().width : 290;
            const step = cardWidth + gap;

            carouselRef.current.scrollBy({
                left: direction * step,
                behavior: "smooth",
            });
        }
    };

    if (loading) {
        return (
            <section className="bg-white px-4 py-16 text-gray-900 md:px-8 relative z-20">
                <div className="mx-auto flex max-w-6xl flex-col gap-10">
                    <div className="flex animate-pulse flex-col gap-4">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        <div className="h-8 w-64 bg-gray-200 rounded"></div>
                        <div className="h-4 w-96 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex gap-6 overflow-hidden">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="min-w-[265px] h-96 bg-gray-100 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (packages.length === 0) return null;

    return (
        <section className="!bg-white px-4 py-16 text-gray-900 md:px-8 relative z-20 overflow-hidden">
            {/* Decorative background elements */}

            <div className="mx-auto flex max-w-6xl flex-col gap-10 relative z-10">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-2">
                    <div className="flex flex-col gap-1">
                        <span className="text-[#ff1493] font-black tracking-wider text-xs uppercase flex items-center gap-2">
                            <span className="h-px w-8 bg-[#ff1493]"></span>
                            Romantic Getaways
                        </span>
                        <h3 className="!text-2xl md:text-3xl !font-bold text-slate-900 leading-tight flex items-center gap-3 flex-wrap">
                            Where Love Takes You

                        </h3>

                        <p className="!text-sm !text-slate-600 md:text-base max-w-2xl font-semibold">
                            Curated romantic escapes with luxury stays, candlelit dinners and unforgettable moments.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* <Link href="/packages/honeymoon" className="hidden md:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-[#ff1493] bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors border border-pink-200">
                            View All
                        </Link> */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => scrollByStep(-1)}
                                disabled={!canScrollLeft}
                                className="w-10 h-10 rounded-full border border-pink-100 bg-white shadow-sm flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-pink-50 hover:border-pink-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed group"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="h-5 w-5 text-slate-700 group-hover:text-[#ff1493] transition-colors" />
                            </button>
                            <button
                                onClick={() => scrollByStep(1)}
                                disabled={!canScrollRight}
                                className="w-10 h-10 rounded-full border border-pink-100 bg-white shadow-sm flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-pink-50 hover:border-pink-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed group"
                                aria-label="Next"
                            >
                                <ChevronRight className="h-5 w-5 text-slate-700 group-hover:text-[#ff1493] transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Carousel */}
                <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
                    <div
                        ref={carouselRef}
                        className="flex gap-6 overflow-x-auto scroll-smooth pb-8 pt-2 scrollbar-hide px-2"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            scrollSnapType: "x mandatory",
                        }}
                    >
                        {packages.map((pkg, index) => (
                            <Link href={`/destinations/${pkg.slug}`} key={`${pkg.id}-${index}`} className="block">
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
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>

                                        {/* Content on Image */}
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
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff1493]"></div>
                                                    {pkg.duration}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-slate-700 font-bold uppercase tracking-wide">Starts from</span>
                                                <span className="!text-lg font-black text-[#ff1493]">
                                                    ₹{pkg.price.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-dashed border-gray-200 flex items-center justify-between">
                                            <span className="text-xs text-slate-700 font-bold">Per Couple</span>
                                            <button className="text-sm font-semibold text-slate-900 group-hover:text-[#ff1493] transition-colors flex items-center gap-2">
                                                View Details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HoneymoonPackages;
