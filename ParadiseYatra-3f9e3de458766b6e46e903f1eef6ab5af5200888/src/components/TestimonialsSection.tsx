"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
    id: number;
    destination: string;
    video: string; // Video is now required
    quote?: string;
    isCouple?: boolean;
    coupleName?: string;
}

const TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        destination: "Mussoorie",
        video: "https://res.cloudinary.com/dwuwpxu0y/video/upload/v1767783817/Video_Testimonial_9_rjvcfy.mp4",
        quote: '"Got back from Vietnam"',
    },
    {
        id: 2,
        destination: "Kerala",
        video: "https://res.cloudinary.com/dwuwpxu0y/video/upload/v1767782676/Video_Testimonial_5_cmw9wg.mp4",
        isCouple: true,
        coupleName: "Roobal & Anjali",
    },
    {
        id: 3,
        destination: "Kerala",
        video: "https://res.cloudinary.com/dwuwpxu0y/video/upload/v1767782300/Video_Testimonial_3_fisxcc.mp4",
        quote: "I'm here today in Bali.",
    },
    {
        id: 4,
        destination: "Goa",
        video: "https://res.cloudinary.com/dwuwpxu0y/video/upload/v1767763881/Sardar_Ji_Review_xjorqh.mp4",
        isCouple: true,
        coupleName: "Pranav & Anjali",
    },
    {
        id: 5,
        destination: "Shimla",
        video: "https://res.cloudinary.com/dwuwpxu0y/video/upload/v1767783726/Video_Testimonial_8_n20d0f.mp4",
    },
];

const TestimonialsSection = () => {
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
            const card = carouselRef.current.querySelector(".flex-shrink-0");
            const gap = 24;
            const cardWidth = card ? card.getBoundingClientRect().width : 280;
            const step = cardWidth + gap;

            carouselRef.current.scrollBy({
                left: direction * step,
                behavior: "smooth",
            });
        }
    };

    return (
        <section
            className="py-8 md:py-10 px-4 md:px-8 overflow-hidden relative"
            style={{
                backgroundImage:
                    "url('https://res.cloudinary.com/dwuwpxu0y/image/upload/v1769064117/1329_qnfgyd.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Header Area */}
            <div className="relative z-10 max-w-6xl mx-auto w-full text-center mb-12 px-4">
                <div className="inline-flex items-center gap-3 mb-6">
                    <span className="h-px w-6 md:w-10 bg-blue-400/60"></span>
                    <span className="text-blue-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">
                        Voices of Our Travelers
                    </span>
                    <span className="h-px w-6 md:w-10 bg-blue-400/60"></span>
                </div>

                <h2 className="!text-xl md:!text-3xl !font-unbounded !font-black tracking-tight text-white mb-6 drop-shadow-2xl leading-[1.1]">
                    Moments Shared <br className="md:hidden" /> by Travelers{" "}
                    <span className="relative inline-block ml-1">
                        <span className="relative z-10 text-rose-500 animate-pulse">❤️</span>
                        <span className="absolute inset-0 blur-2xl bg-rose-500/40 -z-10"></span>
                    </span>
                </h2>

                <p className="max-w-2xl mx-auto !text-white/70 !text-sm md:!text-base font-medium leading-relaxed mb-10">
                    Witness the joy and unforgettable memories created by our guests. Real stories, real emotions, and timeless journeys captured through their lenses.
                </p>

                {/* Metrics / Trust Signals (Keep commented for now or style subtly if needed) */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Trust signals could go here */}
                </div>
            </div>

            {/* Carousel */}
            <div className="relative z-10 max-w-6xl mx-auto w-full">
                <button
                    onClick={() => scrollByStep(-1)}
                    disabled={!canScrollLeft}
                    className="absolute left-0 top-[40%] -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-gray-800 -ml-4 lg:-ml-8 cursor-pointer border border-gray-200 disabled:opacity-40"
                    aria-label="Previous"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>

                <div
                    ref={carouselRef}
                    className="flex overflow-x-auto scrollbar-hide gap-6 pb-8 px-4 snap-x snap-mandatory scroll-smooth"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {TESTIMONIALS.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="flex-shrink-0 w-[240px] md:w-[280px]  snap-center flex flex-col items-center"
                        >
                            <div className="relative h-[400px] md:h-[480px] w-full rounded-lg overflow-hidden shadow-xl cursor-pointer border-2 border-dashed border-white" style={{ isolation: 'isolate', WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}>
                                <video
                                    src={testimonial.video}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover rounded-[inherit] z-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 z-10"></div>
                            </div>

                            {/* Name and destination */}
                            <div className="mt-4 text-center">

                                <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wide">
                                    {testimonial.destination}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => scrollByStep(1)}
                    disabled={!canScrollRight}
                    className="absolute right-0 top-[40%] -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-gray-800 -mr-4 lg:-mr-8 cursor-pointer border border-gray-200 disabled:opacity-40"
                    aria-label="Next"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>
        </section>
    );
};

export default TestimonialsSection;
