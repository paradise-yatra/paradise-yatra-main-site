"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Heart } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import LoginAlertModal from "./LoginAlertModal";
import PackageCard from "./ui/PackageCard";
import CarouselArrows from "./ui/CarouselArrows";

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
        const fetchTrendingData = async () => {
            try {
                setLoading(true);
                // Fetch the 'trending' tag specifically to get its curated packages
                const response = await fetch("/api/tags/slug/trending", { cache: 'no-store' });

                if (!response.ok) {
                    throw new Error("Failed to fetch trending packages");
                }

                const json = await response.json();
                const packagesData = (json.success && json.data && json.data.packages) ? json.data.packages : [];

                // Map to TrendingPackage format
                const mappedPackages: TrendingPackage[] = packagesData.map((pkg: any) => ({
                    id: pkg._id,
                    destination: pkg.location || pkg.destination || "India",
                    duration: pkg.duration || "5N/6D",
                    title: pkg.name || pkg.title || "Trending Package",
                    price: pkg.price || 0,
                    image: getImageUrl(pkg.image),
                    slug: pkg.slug || pkg._id,
                }));

                setPackages(mappedPackages);
            } catch (error) {
                console.error("Error fetching trending packages:", error);
                setPackages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingData();
    }, []);

    // Update scroll buttons state
    const updateScrollState = useCallback(() => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setCanScrollLeft(scrollLeft > 5); // Small buffer
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
        }
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
            carousel.addEventListener("scroll", updateScrollState);
            window.addEventListener("resize", updateScrollState);
            updateScrollState();
        }

        return () => {
            stopAutoScroll();
            if (carousel) {
                carousel.removeEventListener('touchstart', handleTouchStart);
                carousel.removeEventListener('touchend', handleTouchEnd);
                carousel.removeEventListener("scroll", updateScrollState);
                window.removeEventListener("resize", updateScrollState);
            }
        };
    }, [isHovered, startAutoScroll, stopAutoScroll, packages, updateScrollState]);

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
                            <Link href="/package/theme/trending" className="px-5 py-2.5 md:px-6 md:py-3 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 group shadow-sm">
                                View All Deals
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Right side - Carousel */}
                    <div
                        className="md:w-[70%] relative group/carousel"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Floating Navigation Buttons */}
                        <CarouselArrows
                            onPrevious={handlePrev}
                            onNext={handleNext}
                            canScrollLeft={canScrollLeft}
                            canScrollRight={canScrollRight}
                        />

                        <div
                            ref={carouselRef}
                            className="flex gap-2 overflow-x-auto pb-8 pt-4 scrollbar-hide px-2 touch-auto"
                            style={{
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                                scrollSnapType: "x proximity",
                                WebkitOverflowScrolling: "touch"
                            }}
                        >
                            {/* Dynamic Cards */}
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
                                    hrefPrefix="/package"
                                    themeColor="#005beb"
                                    priceLabel="Per Person"
                                    isInWishlist={isInWishlist(String(pkg.id))}
                                    onWishlistToggle={handleWishlistToggle}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <LoginAlertModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} theme="blue" />
        </section >
    );
};

export default TrendingPackagesSection;

