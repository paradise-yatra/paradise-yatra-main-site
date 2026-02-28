"use client";

import { Suspense, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Filter, ChevronDown, Check, ChevronLeft, ChevronRight, X, ArrowRight, Heart, Search, Users, SearchX } from 'lucide-react';
import Loading from '@/components/ui/loading';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl, getPackagePriceLabel } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Header from '@/components/Header';
import PackageCard from '@/components/ui/PackageCard';
import HorizontalPackageCard from '@/components/ui/HorizontalPackageCard';
import SearchFilterSidebar from '@/components/ui/SearchFilterSidebar';
import SearchHeader from '@/components/ui/SearchHeader';
import { useAuth } from '@/context/AuthContext';
import LoginAlertModal from '@/components/LoginAlertModal';
import Footer from '@/components/Footer';
import CarouselArrows from '@/components/ui/CarouselArrows';
import WhyParadiseDifference from '@/components/WhyParadiseDifference';
import FAQSection from '@/components/FAQSection';

// Helper to format duration display
const formatDurationDisplay = (duration: string) => {
    if (!duration) return 'N/A';
    return duration;
};

// Pagination Component
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const handlePageChange = (page: number) => {
        onPageChange(page);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className={`flex items-center justify-end space-x-2 ${className}`}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="!text-[12px] !font-bold text-[#314594] border-[#dfe1df] rounded-[6px] transition-all !shadow-none whitespace-nowrap disabled:opacity-30 h-9 px-4 hover:!bg-[#314594] hover:!text-white"
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
            </Button>

            <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) => (
                    <div key={index}>
                        {page === '...' ? (
                            <span className="px-2 text-slate-400 font-bold">...</span>
                        ) : (
                            <Button
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(page as number)}
                                className={`w-9 h-9 !p-0 !text-[12px] !font-bold rounded-[6px] transition-all !shadow-none ${currentPage === page
                                    ? '!bg-[#314594] !text-white border-transparent'
                                    : '!bg-white !text-[#000945] border-[#dfe1df] hover:bg-slate-50'
                                    }`}
                            >
                                {page}
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="!text-[12px] !font-bold text-[#314594] border-[#dfe1df] rounded-[6px] transition-all !shadow-none whitespace-nowrap disabled:opacity-30 h-9 px-4 hover:!bg-[#314594] hover:!text-white"
            >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
        </div>
    );
};

const PackagesLoadingSkeleton = () => (
    <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-80 hidden lg:block">
                    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-32 mt-0.5 border border-slate-100 h-[600px] animate-pulse"></div>
                </aside>
                <div className="flex-1">
                    <div className="grid gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden h-64 animate-pulse border border-slate-100"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

interface DedicatedPackagesPageClientProps {
    tourType: 'india' | 'international';
    state?: string;
    country?: string;
}

export default function DedicatedPackagesPageClient({ tourType, state, country }: DedicatedPackagesPageClientProps) {
    const [allItems, setAllItems] = useState<any[]>([]);
    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // Carousel state for suggestions
    const carouselRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Filter states
    const [durationFilter, setDurationFilter] = useState<string>('all');
    const [priceFilter, setPriceFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('recommended');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Wishlist functionality
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
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Build query string
                const params = new URLSearchParams();
                params.append('tourType', tourType);
                params.append('isActive', 'true');
                params.append('limit', '100');
                if (state) params.append('state', state);
                if (country) params.append('country', country);

                // Fetch filtered packages from all-packages
                const packagesResponse = await fetch(`/api/all-packages?${params.toString()}`, { cache: 'no-store' });
                if (!packagesResponse.ok) throw new Error('Failed to fetch packages');

                const packagesData = await packagesResponse.json();
                const packages = packagesData.packages || [];

                setAllItems(packages);
                setFilteredItems(packages);

                // Fetch suggestions from the same source as /package/[slug]
                const suggestionsResponse = await fetch(`/api/all-packages?limit=24&isActive=true`, { cache: 'no-store' });
                if (suggestionsResponse.ok) {
                    const suggestionsData = await suggestionsResponse.json();
                    const suggestionsArray = Array.isArray(suggestionsData)
                        ? suggestionsData
                        : Array.isArray(suggestionsData?.packages)
                            ? suggestionsData.packages
                            : [];

                    const currentPackageIds = new Set(
                        packages.map((pkg: any) => pkg?._id).filter(Boolean)
                    );

                    setSuggestions(
                        suggestionsArray
                            .filter((pkg: any) => pkg?.isActive !== false && !currentPackageIds.has(pkg?._id))
                            .slice(0, 9)
                    );
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching packages:', error);
                setError('Failed to load packages');
                setLoading(false);
            }
        };

        fetchData();
    }, [tourType, state, country]);

    // Filter items based on selected filters
    useEffect(() => {
        let filtered = [...allItems];

        // Filter by duration
        if (durationFilter !== 'all') {
            const extractDays = (duration: string): number => {
                if (!duration) return 0;
                const match = duration.match(/(\d+)\s*(?:Days?|D)/i);
                if (match) return parseInt(match[1], 10);
                const firstNumber = duration.match(/\d+/);
                return firstNumber ? parseInt(firstNumber[0], 10) : 0;
            };

            filtered = filtered.filter(item => {
                const days = extractDays(item.duration || '');
                switch (durationFilter) {
                    case '1-3': return days >= 1 && days <= 3;
                    case '4-6': return days >= 4 && days <= 6;
                    case '7-9': return days >= 7 && days <= 9;
                    case '10-12': return days >= 10 && days <= 12;
                    case '13+': return days >= 13;
                    default: return true;
                }
            });
        }

        // Filter by price
        if (priceFilter !== 'all') {
            filtered = filtered.filter(item => {
                const price = item.price;
                switch (priceFilter) {
                    case '0-10000': return price >= 0 && price <= 10000;
                    case '10000-20000': return price > 10000 && price <= 20000;
                    case '20000-35000': return price > 20000 && price <= 35000;
                    case '35000-50000': return price > 35000 && price <= 50000;
                    case '50000+': return price > 50000;
                    default: return true;
                }
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc': return (a.price || 0) - (b.price || 0);
                case 'price-desc': return (b.price || 0) - (a.price || 0);
                case 'duration-asc': return (a.duration || '').localeCompare(b.duration || '');
                default: return 0;
            }
        });

        setFilteredItems(filtered);
        setCurrentPage(1);
    }, [allItems, durationFilter, priceFilter, sortBy]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    // Carousel scroll handling for suggestions
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
            setTimeout(updateScrollState, 500);
            return () => {
                carousel.removeEventListener("scroll", updateScrollState);
                window.removeEventListener("resize", updateScrollState);
            };
        }
    }, [suggestions]);

    const scrollByStep = (direction: number) => {
        if (carouselRef.current) {
            const card = carouselRef.current.querySelector("article");
            const gap = 24;
            const cardWidth = card ? card.getBoundingClientRect().width : 290;
            const step = cardWidth + gap;
            carouselRef.current.scrollBy({ left: direction * step, behavior: "smooth" });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Header />
                <div className="pt-24">
                    <PackagesLoadingSkeleton />
                </div>
            </div>
        );
    }

    const locationLabel = state || country || 'Travel';
    const formattedLocation = locationLabel.charAt(0).toUpperCase() + locationLabel.slice(1).replace(/-/g, ' ');
    const tourTypeLabel = 'Tour';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-plus-jakarta-sans">
            <Header />

            <main className="flex-grow pt-0 bg-white">

                {/* Hero Section */}
                <section className="relative flex flex-col md:flex-row w-full md:h-[496px] md:overflow-hidden items-center justify-center bg-white md:bg-transparent">
                    <div className="md:hidden w-full px-4 pt-6 pb-2 bg-white text-left z-10 flex-shrink-0">
                        <h1 className="!text-[28px] !font-black text-slate-800 font-plus-jakarta-sans tracking-tight leading-tight">
                            {tourTypeLabel} Packages in <span className="text-[#000945]">{formattedLocation}</span>
                        </h1>
                    </div>

                    {/* Image Container */}
                    <div className="relative w-full h-[230.4px] md:absolute md:inset-0 md:h-auto flex-shrink-0">
                        <Image
                            src={formattedLocation.toLowerCase().includes('sikkim') || formattedLocation.toLowerCase().includes('gangtok') || formattedLocation.toLowerCase().includes('kalimpong') ? '/hero/sikkim-hero-v3.png' : "https://images.unsplash.com/photo-1544735716-a9ff2824d7c1?q=80&w=2070&auto=format&fit=crop"}
                            alt={`${formattedLocation} Tourism`}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Centered Hub (Hidden on mobile since highlights are hidden) */}
                    <div className="hidden md:block max-w-6xl w-full mx-auto px-4 md:px-8 relative z-30">
                        <div className="flex flex-col items-center max-w-5xl mx-auto w-full">
                            <Card className="bg-white rounded-[6px] shadow-none border border-slate-100 overflow-hidden w-full md:h-[150px] flex items-center">
                                <CardContent className="p-0 md:p-6 w-full h-full flex flex-col justify-center items-center">
                                    {/* Desktop Heading */}
                                    <h1 className="hidden md:block !text-xl md:!text-[44px] !font-black text-slate-800 mb-4 text-center font-plus-jakarta-sans tracking-tight leading-tight">
                                        {tourTypeLabel} Packages in <span className="text-[#000945]">{formattedLocation}</span>
                                    </h1>

                                    <div className="hidden md:flex flex-nowrap items-center justify-center gap-x-6 lg:gap-x-12 w-full px-2 md:px-4 overflow-x-auto no-scrollbar">
                                        <div className="flex items-center gap-3 group flex-shrink-0">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
                                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                            </div>
                                            <span className="text-[#000945] font-medium text-[12px] md:text-[15px] tracking-tight whitespace-nowrap">Best pricing</span>
                                        </div>

                                        <div className="flex items-center gap-3 group flex-shrink-0">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
                                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                            </div>
                                            <span className="text-[#000945] font-medium text-[12px] md:text-[15px] tracking-tight whitespace-nowrap">Private cab included</span>
                                        </div>

                                        <div className="flex items-center gap-3 group flex-shrink-0">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
                                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                            </div>
                                            <span className="text-[#000945] font-medium text-[12px] md:text-[15px] tracking-tight whitespace-nowrap">Handpicked hotels</span>
                                        </div>

                                        <div className="flex items-center gap-3 group flex-shrink-0">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
                                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                            </div>
                                            <span className="text-[#000945] font-medium text-[12px] md:text-[15px] tracking-tight whitespace-nowrap">Local expert support</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Main Content Area */}
                <section className="py-8 md:py-16 px-4 md:px-8 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-6 text-left">
                            <h2 className="!text-[24px] md:!text-[36px] !font-bold text-[#000945] mb-2">
                                Handpicked Curated Journeys
                            </h2>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-0 lg:gap-8">

                            {/* Sidebar Filters */}
                            <aside className="hidden lg:block lg:w-80 flex-shrink-0">
                                <div className="lg:sticky lg:top-32 lg:mt-0.5">

                                    <Card className="hidden lg:block border border-[#dfe1df] shadow-none overflow-hidden p-0 bg-white rounded-[24px]">
                                        <SearchFilterSidebar
                                            durationFilter={durationFilter}
                                            setDurationFilter={setDurationFilter}
                                            priceFilter={priceFilter}
                                            setPriceFilter={setPriceFilter}
                                            onClearFilters={() => {
                                                setDurationFilter('all');
                                                setPriceFilter('all');
                                                setSortBy('recommended');
                                            }}
                                        />
                                    </Card>
                                </div>
                            </aside>

                            {/* Package Content */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between lg:justify-end gap-3 mb-6 md:mb-8">
                                    <button
                                        onClick={() => setIsFiltersOpen(true)}
                                        className="lg:hidden flex items-center justify-center h-9 rounded-[6px] border border-slate-200 bg-white text-slate-900 font-medium text-xs px-6 shadow-none"
                                        style={{ boxShadow: 'none' }}
                                    >
                                        <Filter className="mr-2 h-3.5 w-3.5 text-slate-500" />
                                        Filters
                                    </button>

                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <span className="hidden sm:inline text-sm font-medium text-slate-500">Sort by:</span>
                                        <Select
                                            value={sortBy}
                                            onValueChange={setSortBy}
                                        >
                                            <SelectTrigger
                                                className="w-[140px] bg-white border-slate-200 font-medium text-slate-900 rounded-[6px] h-9 text-xs px-4 shadow-none !shadow-none"
                                                style={{ boxShadow: 'none' }}
                                            >
                                                <SelectValue placeholder="Recommended" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                                <SelectItem value="recommended">Recommended</SelectItem>
                                                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                                <SelectItem value="duration-asc">Duration</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {filteredItems.length > 0 ? (
                                    <div className="space-y-6">
                                        {paginatedItems.map((item) => (
                                            <HorizontalPackageCard
                                                key={item._id}
                                                id={item._id}
                                                title={item.name}
                                                destination={item.location}
                                                duration={item.duration}
                                                description={item.shortDescription || item.description}
                                                price={item.price}
                                                priceLabel={getPackagePriceLabel(item.priceType)}
                                                image={item.image}
                                                detailUrl={`/package/${item.slug || item._id}`}
                                                isInWishlist={isInWishlist(item._id)}
                                                onWishlistToggle={handleWishlistToggle}
                                            />
                                        ))}

                                        {totalPages > 1 && (
                                            <div className="mt-12">
                                                <Pagination
                                                    currentPage={currentPage}
                                                    totalPages={totalPages}
                                                    onPageChange={setCurrentPage}
                                                    className="mt-6"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-white rounded-[6px] border border-[#dfe1df] shadow-none">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5">
                                            <SearchX className="w-8 h-8 text-[#000945] opacity-20" />
                                        </div>
                                        <h3 className="!text-xl !font-bold text-[#000945] mb-2">No packages found</h3>
                                        <p className="!text-[#000945]/70 !text-sm font-medium max-w-sm mx-auto mb-8">
                                            We couldn't find any packages for {formattedLocation} matching your filters.
                                        </p>
                                        <Button
                                            onClick={() => {
                                                setDurationFilter('all');
                                                setPriceFilter('all');
                                                setSortBy('recommended');
                                            }}
                                            className="!bg-white !text-[#155dfc] font-bold py-2 px-8 rounded-[6px] h-auto text-sm transition-all !border !border-[#dfe1df] !shadow-none hover:bg-slate-50"
                                        >
                                            Clear All Filters
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <WhyParadiseDifference />
                <FAQSection destination={state || country} tourType={tourType} />

                {suggestions.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="!bg-white px-4 py-6 text-gray-900 md:px-8 relative z-20"
                    >
                        <div className="mx-auto flex max-w-6xl flex-col gap-6 relative z-10">
                            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-2">
                                <div className="flex flex-col gap-1">
                                    <h3 className="!text-[24px] md:!text-[36px] !font-bold !text-[#000945] !leading-tight tracking-tight">
                                        You Might Also Like
                                    </h3>
                                    <p className="!text-sm !text-slate-500 md:!text-base !max-w-2xl !font-medium">
                                        Explore more amazing packages and create unforgettable memories
                                    </p>
                                </div>
                            </div>

                            <div className="relative -mx-4 px-4 md:mx-0 md:px-0 group/carousel">
                                <CarouselArrows
                                    onPrevious={() => scrollByStep(-1)}
                                    onNext={() => scrollByStep(1)}
                                    canScrollLeft={canScrollLeft}
                                    canScrollRight={canScrollRight}
                                />
                                <div
                                    ref={carouselRef}
                                    className="flex gap-6 overflow-x-auto scroll-smooth pb-8 pt-2 scrollbar-hide px-2"
                                    style={{
                                        scrollbarWidth: "none",
                                        msOverflowStyle: "none",
                                        scrollSnapType: "x mandatory",
                                    }}
                                >
                                    {suggestions.map((pkg, index) => (
                                        <PackageCard
                                            key={`${pkg._id}-${index}`}
                                            id={pkg._id}
                                            destination={pkg.location}
                                            duration={pkg.duration}
                                            title={pkg.name}
                                            price={pkg.price || 0}
                                            image={getImageUrl(pkg.image) || `https://picsum.photos/800/500?random=${index + 50}`}
                                            slug={pkg.slug || pkg._id}
                                            hrefPrefix="/package"
                                            themeColor="#005beb"
                                            priceLabel={getPackagePriceLabel(pkg.priceType)}
                                            isInWishlist={isInWishlist(pkg._id)}
                                            onWishlistToggle={handleWishlistToggle}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.section>
                )}
            </main>

            <Footer />

            {/* Mobile Filter Dialog */}
            <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-8 pb-4">
                        <DialogTitle className="!text-xl !font-bold !text-[#000945]">Filters</DialogTitle>
                    </DialogHeader>
                    <div className="flex-grow overflow-y-auto px-0">
                        <div className="p-8 pt-0">
                            <SearchFilterSidebar
                                durationFilter={durationFilter}
                                setDurationFilter={setDurationFilter}
                                priceFilter={priceFilter}
                                setPriceFilter={setPriceFilter}
                                onClearFilters={() => {
                                    setDurationFilter('all');
                                    setPriceFilter('all');
                                    setSortBy('recommended');
                                }}
                                onApply={() => setIsFiltersOpen(false)}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <LoginAlertModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} theme="blue" />
        </div>
    );
}
