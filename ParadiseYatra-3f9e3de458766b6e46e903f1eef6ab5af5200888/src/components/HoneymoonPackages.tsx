"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Heart } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import LoginAlertModal from "./LoginAlertModal";
import PackageCard from "./ui/PackageCard";
import CarouselArrows from "./ui/CarouselArrows";

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

    const { user, toggleWishlist: contextToggleWishlist, isInWishlist } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const handleWishlistToggle = (e: React.MouseEvent, pkgId: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            setIsLoginModalOpen(true);
            return;
        }

        contextToggleWishlist(pkgId);
    };

    useEffect(() => {
        const fetchHoneymoonData = async () => {
            try {
                setLoading(true);
                // 1. Fetch all tags to find the honeymoon tag
                const tagsRes = await fetch("/api/tags", { cache: 'no-store' });
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
                        fetch("/api/packages", { cache: 'no-store' }),
                        fetch("/api/holiday-types", { cache: 'no-store' }),
                        fetch("/api/destinations", { cache: 'no-store' }),
                        fetch("/api/fixed-departures", { cache: 'no-store' })
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
                <div className="flex flex-col gap-1">
                    <span className="text-[#ff1493] font-black tracking-wider text-xs uppercase flex items-center gap-2">
                        <span className="h-px w-8 bg-[#ff1493]"></span>
                        Honeymoon Packages
                    </span>
                    <h3 className="!text-2xl md:text-3xl !font-bold text-slate-900 leading-tight flex items-center gap-3 flex-wrap">
                        Where Love Takes You
                    </h3>

                    <p className="!text-sm !text-slate-600 md:text-base max-w-2xl font-semibold">
                        Curated romantic escapes with luxury stays, candlelit dinners and unforgettable moments.
                    </p>
                </div>

                {/* Carousel wrapper inside max-width container */}
                <div className="relative group/carousel">
                    {/* Floating Navigation Buttons */}
                    <CarouselArrows
                        onPrevious={() => scrollByStep(-1)}
                        onNext={() => scrollByStep(1)}
                        canScrollLeft={canScrollLeft}
                        canScrollRight={canScrollRight}
                    />

                    <div
                        ref={carouselRef}
                        className="flex gap-2 overflow-x-auto scroll-smooth pb-8 pt-2 scrollbar-hide"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            scrollSnapType: "x mandatory",
                        }}
                    >

                        {packages.map((pkg, index) => (
                            <PackageCard
                                key={`${pkg.id}-${index}`}
                                id={pkg.id}
                                destination={pkg.destination}
                                duration={pkg.duration}
                                title={pkg.title}
                                price={pkg.price}
                                image={pkg.image}
                                slug={pkg.slug}
                                hrefPrefix="/destinations"
                                themeColor="#ff1493"
                                priceLabel="Per Couple"
                                isInWishlist={isInWishlist(String(pkg.id))}
                                onWishlistToggle={handleWishlistToggle}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <LoginAlertModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} theme="pink" />
        </section>
    );
};

export default HoneymoonPackages;
