"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Heart } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import LoginAlertModal from "./LoginAlertModal";
import CarouselArrows from "./ui/CarouselArrows";

interface LuxuryPackage {
    _id: string;
    destination: string;
    duration: string;
    title: string;
    price: number;
    images: string[];
    slug: string;
    shortDescription?: string;
}

const LuxuryPackagesSection = () => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [packages, setPackages] = useState<LuxuryPackage[]>([]);
    const [loading, setLoading] = useState(true);
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

    const updateScrollState = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        const fetchLuxuryPackages = async () => {
            try {
                setLoading(true);
                // Fetch the 'luxury' tag specifically to get its curated packages from the all-packages system
                const response = await fetch("/api/tags/slug/luxury", { cache: 'no-store' });

                if (!response.ok) {
                    throw new Error("Failed to fetch luxury packages");
                }

                const json = await response.json();
                const packagesData = (json.success && json.data && json.data.packages) ? json.data.packages : [];

                // Map to LuxuryPackage format with fallbacks
                const mappedPackages: LuxuryPackage[] = packagesData.map((pkg: any) => ({
                    _id: pkg._id,
                    destination: pkg.location || pkg.destination || pkg.state || pkg.country || "India",
                    duration: pkg.duration || "5N/6D",
                    title: pkg.name || pkg.title || "Luxury Package",
                    price: pkg.price || 0,
                    images: pkg.image ? [pkg.image] : (pkg.images || []),
                    slug: pkg.slug || pkg._id,
                    shortDescription: pkg.shortDescription || "",
                }));

                setPackages(mappedPackages);

            } catch (error) {
                console.error("Error fetching luxury packages:", error);
                setPackages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLuxuryPackages();
    }, []);

    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener("scroll", updateScrollState);
            window.addEventListener("resize", updateScrollState);
            // Initial update
            setTimeout(updateScrollState, 100);

            return () => {
                carousel.removeEventListener("scroll", updateScrollState);
                window.removeEventListener("resize", updateScrollState);
            };
        }
    }, [packages]); // Re-run when packages load

    const scrollByStep = (direction: number) => {
        if (carouselRef.current) {
            const card = carouselRef.current.querySelector("article");
            const gap = 24; // gap-6 = 24px
            const cardWidth = card ? card.getBoundingClientRect().width : 254;
            const step = cardWidth + gap;

            carouselRef.current.scrollBy({
                left: direction * step,
                behavior: "smooth",
            });
        }
    };

    // Fallback image if needed
    const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

    if (loading) {
        // Render a simple loading state or skeleton if desired, 
        // effectively keeping the section height but empty or with logic
        return (
            <section
                className="px-4 py-14 text-gray-900 md:px-8 relative z-20 overflow-hidden min-h-[600px]"
                style={{
                    backgroundImage:
                        "url('https://res.cloudinary.com/dwuwpxu0y/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_1200/v1769086965/10491807_4443133_bi9gii.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative mx-auto flex max-w-6xl flex-col gap-10">
                    {/* Header matches structure */}
                    <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between mb-6">
                        <div className="h-8 w-64 bg-white/20 animate-pulse rounded"></div>
                    </div>
                </div>
            </section>
        )
    }

    if (packages.length === 0) {
        return (
            <section
                className="px-4 py-14 text-gray-900 md:px-8 relative z-20 overflow-hidden min-h-[600px]"
                style={{
                    backgroundImage:
                        "url('https://res.cloudinary.com/dwuwpxu0y/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_1200/v1769086965/10491807_4443133_bi9gii.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative mx-auto flex max-w-6xl flex-col gap-10 items-center justify-center h-full pt-20">
                    <h3
                        className="text-2xl !font-bold text-white md:text-3xl text-center"
                        style={{ fontFamily: "'Orange Avenue', serif" }}
                    >
                        No luxury packages available at the moment
                    </h3>
                </div>
            </section>
        );
    }

    return (
        <section
            className="px-4 py-14 text-gray-900 md:px-8 relative z-20 overflow-hidden min-h-[600px]"
            style={{
                backgroundImage:
                    "url('https://res.cloudinary.com/dwuwpxu0y/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_1200/v1769086965/10491807_4443133_bi9gii.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative mx-auto flex max-w-6xl flex-col gap-10">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-2">
                    <div className="flex flex-col gap-1">
                        <span
                            className="text-amber-400 font-black tracking-wider text-xs uppercase flex items-center gap-2"
                            style={{ fontFamily: "'Orange Avenue', serif" }}
                        >
                            <span className="h-px w-8 bg-amber-400"></span>
                            Luxury Special
                        </span>

                        <h3
                            className="!text-2xl !font-black text-white md:text-3xl"
                            style={{ fontFamily: "'Orange Avenue', serif" }}
                        >
                            Journeys of Royal Indulgence
                        </h3>
                        <p
                            className="!text-sm !text-white md:!text-md font-bold"
                            style={{ fontFamily: "'Orange Avenue', serif" }}
                        >
                            Experience the ultimate in travel excellence with our handpicked collection of elite escapes.
                        </p>
                    </div>

                    <Link
                        href="/package/theme/luxury"
                        className="group flex items-center gap-2 text-white font-bold text-sm bg-amber-600/20 hover:bg-amber-600 border border-amber-500/30 px-6 py-3 rounded-xl transition-all duration-300 w-fit shrink-0"
                        style={{ fontFamily: "'Orange Avenue', serif" }}
                    >
                        View All Luxury
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Carousel */}
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
                        className="flex gap-2 overflow-x-auto scroll-smooth py-2 scrollbar-hide px-2"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            scrollSnapType: "x mandatory",
                        }}
                    >
                        {packages.map((pkg) => (
                            <Link href={`/package/${pkg.slug || pkg._id}`} key={pkg._id} className="block h-full">
                                <article
                                    className="group cursor-pointer bg-white rounded-lg overflow-hidden border border-gray-100 scroll-snap-align-center md:scroll-snap-align-start transition-all duration-300 hover:shadow-xl relative w-[260px] min-w-[260px] md:w-[265px] md:min-w-[265px] max-w-[260px] md:max-w-[265px] h-full flex flex-col"
                                >
                                    {/* White hover overlay */}
                                    <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none"></div>

                                    <div className="relative h-64 w-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src={getImageUrl(pkg.images?.[0]) || FALLBACK_IMAGE}
                                            alt={pkg.destination || pkg.title}
                                            fill
                                            className="object-cover transition-transform duration-700"
                                        />
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                                        {/* Wishlist Button */}
                                        <button
                                            onClick={(e) => handleWishlistToggle(e, pkg._id)}
                                            className="absolute top-3 right-3 z-40 p-2 rounded-full bg-white border border-white/30 hover:bg-white transition-all shadow-sm group/heart"
                                        >
                                            <Heart
                                                className={`w-4 h-4 transition-colors ${isInWishlist(pkg._id) ? "fill-amber-600 text-amber-600" : "text-amber-600"}`}
                                            />
                                        </button>

                                        {/* Content on Image */}
                                        <div className="absolute bottom-4 left-4 right-4 text-white">
                                            <div className="flex items-center gap-1.5 mb-1.5 opacity-90">
                                                <MapPin className="h-3.5 w-3.5 text-amber-600" />
                                                <span className="text-xs !font-medium text-white tracking-wide uppercase" style={{ fontFamily: "'Orange Avenue', serif" }}>{pkg.destination}</span>
                                            </div>
                                            <h4 className="!text-lg !font-bold leading-snug line-clamp-2 text-shadow-sm" style={{ fontFamily: "'Orange Avenue', serif" }}>
                                                {pkg.title}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex items-center justify-between mb-4 mt-auto">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-700 font-bold uppercase tracking-wide" style={{ fontFamily: "'Orange Avenue', serif" }}>Duration</span>
                                                <span className="text-sm font-bold text-slate-900 flex items-center gap-1" style={{ fontFamily: "'Orange Avenue', serif" }}>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600"></div>
                                                    {pkg.duration}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-slate-700 font-bold uppercase tracking-wide" style={{ fontFamily: "'Orange Avenue', serif" }}>Starts from</span>
                                                <span className="text-lg !font-black text-amber-600" style={{ fontFamily: "'Orange Avenue', serif" }}>
                                                    ₹{pkg.price.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-dashed border-gray-300 flex items-center justify-between">
                                            <span className="text-xs text-slate-700 !font-black" style={{ fontFamily: "'Orange Avenue', serif" }}>Per Person</span>
                                            <button className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors flex items-center gap-2" style={{ fontFamily: "'Orange Avenue', serif" }}>
                                                View Deal <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <LoginAlertModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} theme="blue" />
        </section >
    );
};

export default LuxuryPackagesSection;
