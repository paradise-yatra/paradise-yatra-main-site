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
                // Fetch the 'honeymoon' tag specifically to get its curated packages
                const response = await fetch("/api/tags/slug/honeymoon", { cache: 'no-store' });

                if (!response.ok) {
                    throw new Error("Failed to fetch honeymoon packages");
                }

                const json = await response.json();
                const packagesData = (json.success && json.data && json.data.packages) ? json.data.packages : [];

                // Map to HoneymoonPackage format
                const mappedPackages: HoneymoonPackage[] = packagesData.map((pkg: any) => ({
                    id: pkg._id,
                    destination: pkg.location || pkg.destination || "India",
                    duration: pkg.duration || "5N/6D",
                    title: pkg.name || pkg.title || "Honeymoon Package",
                    price: pkg.price || 0,
                    image: getImageUrl(pkg.image),
                    slug: pkg.slug || pkg._id,
                }));

                setPackages(mappedPackages);
            } catch (error) {
                console.error("Error fetching honeymoon packages:", error);
                setPackages([]);
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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
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

                    <Link
                        href="/package/theme/honeymoon"
                        className="group flex items-center gap-2 text-[#ff1493] font-bold text-sm bg-pink-50 hover:bg-[#ff1493] hover:text-white px-6 py-3 rounded-xl transition-all duration-300 w-fit shrink-0"
                    >
                        View All Packages
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
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
                                hrefPrefix="/package"
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
