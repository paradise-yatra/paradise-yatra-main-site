"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

interface CarouselArrowsProps {
    onPrevious: () => void;
    onNext: () => void;
    canScrollLeft: boolean;
    canScrollRight: boolean;
    variant?: 'default' | 'compact';
}

const CarouselArrows: React.FC<CarouselArrowsProps> = ({
    onPrevious,
    onNext,
    canScrollLeft,
    canScrollRight,
    variant = 'default'
}) => {
    const isCompact = variant === 'compact';

    const buttonClasses = isCompact
        ? "w-10 h-10 rounded-full border border-blue-100 bg-white shadow-sm flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:border-blue-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed group"
        : "absolute top-[48%] -translate-y-1/2 z-40 w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-500 bg-white hidden md:flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-slate-100 group-hover/carousel:opacity-100 disabled:opacity-0 disabled:pointer-events-none shadow-slate-200/50";

    const iconClasses = isCompact
        ? "h-5 w-5 text-slate-700 group-hover:text-blue-600 transition-colors"
        : "h-5 w-5 md:h-6 md:w-6 text-slate-900";

    if (isCompact) {
        // Compact variant for "You Might Also Like" sections
        return (
            <div className="flex gap-2">
                <button
                    onClick={onPrevious}
                    disabled={!canScrollLeft}
                    className={buttonClasses}
                    aria-label="Previous"
                >
                    <ArrowLeft className={iconClasses} />
                </button>
                <button
                    onClick={onNext}
                    disabled={!canScrollRight}
                    className={buttonClasses}
                    aria-label="Next"
                >
                    <ArrowRight className={iconClasses} />
                </button>
            </div>
        );
    }

    // Default variant for main carousels (floating arrows)
    return (
        <>
            <button
                onClick={onPrevious}
                disabled={!canScrollLeft}
                className={`${buttonClasses} left-0 md:-left-6`}
                aria-label="Previous"
            >
                <ArrowLeft className={iconClasses} />
            </button>

            <button
                onClick={onNext}
                disabled={!canScrollRight}
                className={`${buttonClasses} right-0 md:-right-6`}
                aria-label="Next"
            >
                <ArrowRight className={iconClasses} />
            </button>
        </>
    );
};

export default CarouselArrows;
