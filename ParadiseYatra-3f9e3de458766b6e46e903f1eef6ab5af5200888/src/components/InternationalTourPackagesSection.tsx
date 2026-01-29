"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DestinationCard from "./DestinationCard";
import { useNavigation } from "@/hooks/useNavigation";

interface InternationalDestination {
    id: number;
    name: string;
    image: string;
    href: string;
}

const InternationalTourPackagesSection = () => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const { navItems, loading } = useNavigation();

    const destinations = useMemo(() => {
        const internationalPackage = navItems.find(item => item.name === "International Tour");
        if (!internationalPackage) return [];

        return internationalPackage.submenu
            .filter((item) => {
                // Ensure India doesn't show in International Tour section
                if (item.name.toLowerCase() === "india") return false;
                // Only show countries that have destinations
                return item.destinations && item.destinations.length > 0;
            })
            .map((item, index) => ({
                id: index + 1,
                name: item.name,
                image: item.destinations?.find(d => d.image)?.image || `https://picsum.photos/400/600?random=${index + 200}`,
                href: item.href
            }));
    }, [navItems]);

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
    }, []);

    const scrollByStep = (direction: number) => {
        if (carouselRef.current) {
            const card = carouselRef.current.querySelector("a");
            const gap = 16; // gap-4 = 16px
            const cardWidth = card ? card.getBoundingClientRect().width : 272;
            const step = cardWidth + gap;

            carouselRef.current.scrollBy({
                left: direction * step,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="bg-white px-4 py-14 text-gray-900 md:px-8 relative overflow-hidden">

            <div className="mx-auto max-w-6xl relative z-10">
                {/* Header with Controls */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="flex-1 flex flex-col gap-2">
                        <span className="text-[#005beb] !font-black uppercase tracking-wider text-xs flex items-center gap-2">
                            <span className="h-px w-8 bg-[#005beb]"></span>
                            World Awaits
                        </span>
                        <h2 className="!text-2xl md:text-3xl !font-bold text-slate-900 leading-tight">
                            Across the World’s Finest Places
                        </h2>
                        <p className="!text-sm !text-slate-600 md:text-base max-w-2xl font-semibold">
                            Embark on extraordinary adventures and discover iconic global destinations with our curated international tour packages.
                        </p>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                        <button
                            onClick={() => scrollByStep(-1)}
                            disabled={!canScrollLeft}
                            className="w-9 h-9 rounded-full border border-blue-100 bg-white shadow-sm flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:border-blue-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed group"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="h-5 w-5 text-slate-700 group-hover:text-[#005beb] transition-colors" />
                        </button>
                        <button
                            onClick={() => scrollByStep(1)}
                            disabled={!canScrollRight}
                            className="w-9 h-9 rounded-full border border-blue-100 bg-white shadow-sm flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:border-blue-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed group"
                            aria-label="Next"
                        >
                            <ChevronRight className="h-5 w-5 text-slate-700 group-hover:text-[#005beb] transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Carousel */}
                <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
                    <div
                        ref={carouselRef}
                        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            scrollSnapType: "x mandatory",
                        }}
                    >
                        {destinations.map((destination) => (
                            <DestinationCard
                                key={destination.id}
                                name={destination.name}
                                image={destination.image}
                                href={destination.href}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InternationalTourPackagesSection;
