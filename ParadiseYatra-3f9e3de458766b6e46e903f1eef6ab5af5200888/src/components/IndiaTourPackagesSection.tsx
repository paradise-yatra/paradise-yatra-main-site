"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import DestinationCard from "./DestinationCard";
import { useNavigation } from "@/hooks/useNavigation";
import CarouselArrows from "./ui/CarouselArrows";

interface IndiaDestination {
    id: number;
    name: string;
    image: string;
    href: string;
}

const IndiaTourPackagesSection = () => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const { navItems, loading } = useNavigation();

    const destinations = useMemo(() => {
        const indiaPackage = navItems.find(item => item.name === "India Tour Package");
        if (!indiaPackage) return [];

        return indiaPackage.submenu.map((item, index) => ({
            id: index + 1,
            name: item.name,
            image: item.destinations?.find(d => d.image)?.image || `https://picsum.photos/400/600?random=${index + 100}`,
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
        <section className="bg-white py-14 px-4 text-gray-900 md:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Header with Controls */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="flex-1 flex flex-col gap-2">
                        <span className="text-[#005beb] font-black uppercase tracking-wider text-xs flex items-center gap-2">
                            <span className="h-px w-8 bg-[#005beb]"></span>
                            Incredible India
                        </span>
                        <h2 className="!text-2xl !font-bold text-slate-900 md:text-3xl">
                            Signature Destinations Of India
                        </h2>
                        <p className="!text-sm !text-slate-600 md:text-base max-w-2xl font-semibold">
                            Discover the soul of Incredible India through our handpicked collection of iconic landmarks and cultural wonders.
                        </p>
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
        </section >
    );
};

export default IndiaTourPackagesSection;
