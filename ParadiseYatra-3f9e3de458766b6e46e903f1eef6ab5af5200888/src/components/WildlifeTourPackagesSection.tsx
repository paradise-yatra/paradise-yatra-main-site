"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DestinationCard from "./DestinationCard";

interface SeasonalPackage {
    id: number;
    name: string;
    image: string;
    href: string;
}

const SEASONAL_PACKAGES: SeasonalPackage[] = [
    {
        id: 1,
        name: "Summer Escapes",
        image: "https://images.unsplash.com/photo-1586902197503-e71026292412?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        href: "/coming-soon",
    },
    {
        id: 2,
        name: "Winter Wonders",
        image: "https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        href: "/coming-soon",
    },
    {
        id: 3,
        name: "Monsoon Magic",
        image: "https://images.unsplash.com/photo-1562979314-bee7453e911c?q=80&w=280&h=420&auto=format&fit=crop",
        href: "/coming-soon",
    },
    {
        id: 4,
        name: "Spring Blossoms",
        image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=280&h=420&auto=format&fit=crop",
        href: "/coming-soon",
    },
    {
        id: 5,
        name: "Autumn Glow",
        image: "https://images.unsplash.com/photo-1471958680802-1345a694ba6d?q=80&w=280&h=420&auto=format&fit=crop",
        href: "/coming-soon",
    },
    {
        id: 6,
        name: "Festive Season",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=280&h=420&auto=format&fit=crop",
        href: "/coming-soon",
    },
];

const WildlifeTourPackagesSection = () => {
    const carouselRef = useRef<HTMLDivElement>(null);
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
                {/* Header Style matching India Tour Package */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="flex-1 flex flex-col gap-2">
                        <span className="text-[#005beb] font-black uppercase tracking-wider text-xs flex items-center gap-2">
                            <span className="h-px w-8 bg-[#005beb]"></span>
                            Timeless Moments
                        </span>
                        <h2 className="!text-2xl !font-bold text-slate-900 md:text-3xl">
                            The Seasonal Travel Collection
                        </h2>
                        <p className="!text-sm !text-slate-600 md:text-base max-w-2xl font-semibold">
                            Explore the beauty of India through our handpicked journeys, curated for the perfect weather and peak seasonal experiences.
                        </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <button
                            onClick={() => scrollByStep(-1)}
                            disabled={!canScrollLeft}
                            className="w-9 h-9 rounded-full border border-slate-200 bg-white/95 shadow-md flex items-center justify-center cursor-pointer transition-all duration-120 hover:scale-105 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="h-5 w-5 text-slate-700" />
                        </button>
                        <button
                            onClick={() => scrollByStep(1)}
                            disabled={!canScrollRight}
                            className="w-9 h-9 rounded-full border border-slate-200 bg-white/95 shadow-md flex items-center justify-center cursor-pointer transition-all duration-120 hover:scale-105 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
                            aria-label="Next"
                        >
                            <ChevronRight className="h-5 w-5 text-slate-700" />
                        </button>
                    </div>
                </div>

                {/* Carousel */}
                <div className="relative">
                    <div
                        ref={carouselRef}
                        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            scrollSnapType: "x mandatory",
                        }}
                    >
                        {SEASONAL_PACKAGES.map((category: SeasonalPackage) => (
                            <DestinationCard
                                key={category.id}
                                name={category.name}
                                image={category.image}
                                href={category.href}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WildlifeTourPackagesSection;
