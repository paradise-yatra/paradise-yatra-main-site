"use client";

import { Suspense, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Filter, ChevronDown, Check, ChevronLeft, ChevronRight, X, ArrowRight, Heart, Search } from 'lucide-react';
import Loading from '@/components/ui/loading';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

// Pagination Component (Matching the style of packages/[tourType]/[state]/PackagesPageClient)
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
        <div className={`flex items-center justify-center space-x-2 ${className}`}>
            <Button
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-3 xl:px-4 py-2 rounded-lg transition-all duration-300 shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed border-0"
            >
                Previous
            </Button>

            {getPageNumbers().map((page, index) => (
                <div key={index}>
                    {page === '...' ? (
                        <span className="px-3 py-2 text-blue-500 font-bold">...</span>
                    ) : (
                        <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page as number)}
                            className={`px-3 py-2 font-bold ${currentPage === page
                                ? 'bg-blue-600 text-white hover:bg-blue-700 border-0 shadow-md'
                                : 'bg-blue-500 text-white hover:bg-blue-600 border-0'
                                }`}
                        >
                            {page}
                        </Button>
                    )}
                </div>
            ))}

            <Button
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-3 xl:px-4 py-2 rounded-lg transition-all duration-300 shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed border-0"
            >
                Next
            </Button>
        </div>
    );
};

const PackagesLoadingSkeleton = () => (
    <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-80 hidden lg:block">
                    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 border border-slate-100 h-[600px] animate-pulse"></div>
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

export default function PackagePageClient() {
    const [allItems, setAllItems] = useState<any[]>([]);
    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Carousel state for suggestions
    const carouselRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Filter states
    const [durationFilter, setDurationFilter] = useState<string>('all');
    const [priceFilter, setPriceFilter] = useState<string>('all');
    const [tourTypeFilter, setTourTypeFilter] = useState<string>('all');
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

                // Fetch all packages
                const packagesResponse = await fetch('/api/all-packages?limit=100', { cache: 'no-store' });
                if (!packagesResponse.ok) throw new Error('Failed to fetch packages');

                const packagesData = await packagesResponse.json();
                const packages = packagesData.packages || [];

                setAllItems(packages);
                setFilteredItems(packages);

                // Fetch suggestions (from destinations API like in PackagesPageClient)
                const suggestionsResponse = await fetch(`/api/destinations?limit=9`, { cache: 'no-store' });
                if (suggestionsResponse.ok) {
                    const suggestionsData = await suggestionsResponse.json();
                    if (suggestionsData && suggestionsData.destinations && Array.isArray(suggestionsData.destinations)) {
                        setSuggestions(suggestionsData.destinations.slice(0, 9));
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching packages:', error);
                setError('Failed to load packages');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter items based on selected filters
    useEffect(() => {
        let filtered = [...allItems];

        // Filter by tour type
        if (tourTypeFilter !== 'all') {
            filtered = filtered.filter(item => item.tourType === tourTypeFilter);
        }

        // Filter by duration
        if (durationFilter !== 'all') {
            const extractDays = (duration: string): number => {
                if (!duration) return 0;
                const match = duration.match(/(\d+)\s*(?:Days?|D)/i);
                if (match) {
                    return parseInt(match[1], 10);
                }
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
    }, [allItems, durationFilter, priceFilter, tourTypeFilter, sortBy]);

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

            carouselRef.current.scrollBy({
                left: direction * step,
                behavior: "smooth",
            });
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

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />

            <main className="flex-grow">
                {/* Same Header Design as PackagesPageClient */}
                <SearchHeader
                    title={<>Explore All <span className="text-blue-600">Packages</span></>}
                    subtitle="Discover handpicked premium tour packages curated for comfort, luxury, and authentic local adventures across the globe."
                />

                <div>
                    <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                        <span className="text-blue-600">Package</span>
                    </div>
                </div>

                {/* Main Content Area - Matching horizontal card layout */}
                <section className="py-8 px-4 md:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-6">

                            {/* Sidebar Filters */}
                            <aside className="lg:w-80 flex-shrink-0">
                                <div className="lg:sticky lg:top-24">
                                    {/* Mobile Filter Button */}
                                    <div className="lg:hidden mb-4">
                                        <Button
                                            onClick={() => setIsFiltersOpen(true)}
                                            variant="outline"
                                            className="w-full border border-slate-300 text-slate-900 hover:bg-slate-50"
                                        >
                                            <Filter className="mr-2 h-4 w-4" />
                                            Filters
                                        </Button>
                                    </div>

                                    {/* Desktop Filters Sidebar */}
                                    <Card className="hidden lg:block border border-slate-200 shadow-sm overflow-hidden p-0 bg-white">
                                        <div className="p-6 pb-2">
                                            <h3 className="!text-sm !font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                                Tour Type
                                            </h3>
                                            <div className="space-y-1 mb-6">
                                                {[
                                                    { id: 'all', label: 'All Packages' },
                                                    { id: 'india', label: 'India' },
                                                    { id: 'international', label: 'International' },
                                                ].map((type) => (
                                                    <button
                                                        key={type.id}
                                                        onClick={() => setTourTypeFilter(type.id)}
                                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-all ${tourTypeFilter === type.id
                                                            ? 'bg-blue-50 text-blue-700'
                                                            : 'text-slate-600 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        {type.label}
                                                        {tourTypeFilter === type.id && <Check className="w-4 h-4" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <SearchFilterSidebar
                                            durationFilter={durationFilter}
                                            setDurationFilter={setDurationFilter}
                                            priceFilter={priceFilter}
                                            setPriceFilter={setPriceFilter}
                                            onClearFilters={() => {
                                                setDurationFilter('all');
                                                setPriceFilter('all');
                                                setTourTypeFilter('all');
                                                setSortBy('recommended');
                                            }}
                                        />
                                    </Card>
                                </div>
                            </aside>

                            {/* Package Content */}
                            <div className="flex-1">
                                {/* Sort and Count Header */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <p className="!text-sm font-bold !text-slate-600">
                                        Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length} results
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-slate-700">Sort By:</span>
                                        <Select
                                            value={
                                                sortBy === 'recommended' ? 'Recommended' :
                                                    sortBy === 'price-asc' ? 'Price: Low to High' :
                                                        sortBy === 'price-desc' ? 'Price: High to Low' :
                                                            sortBy === 'duration-asc' ? 'Duration' : 'Recommended'
                                            }
                                            onValueChange={(value) => {
                                                if (value === 'Recommended') setSortBy('recommended');
                                                else if (value === 'Price: Low to High') setSortBy('price-asc');
                                                else if (value === 'Price: High to Low') setSortBy('price-desc');
                                                else if (value === 'Duration') setSortBy('duration-asc');
                                            }}
                                        >
                                            <SelectTrigger className="w-[200px] bg-white border-slate-200 font-medium text-slate-700">
                                                <SelectValue placeholder="Sort By" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Recommended">Recommended</SelectItem>
                                                <SelectItem value="Price: Low to High">Price: Low to High</SelectItem>
                                                <SelectItem value="Price: High to Low">Price: High to Low</SelectItem>
                                                <SelectItem value="Duration">Duration</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Package Cards List */}
                                {filteredItems.length > 0 ? (
                                    <div className="space-y-6">
                                        {paginatedItems.map((item, index) => (
                                            <HorizontalPackageCard
                                                key={item._id}
                                                id={item._id}
                                                title={item.name}
                                                destination={item.location}
                                                duration={item.duration}
                                                description={item.shortDescription || item.description}
                                                price={item.price}
                                                image={item.image}
                                                detailUrl={`/package/${item.slug || item._id}`}
                                                isInWishlist={isInWishlist(item._id)}
                                                onWishlistToggle={handleWishlistToggle}
                                            />
                                        ))}

                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="mt-8">
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
                                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                                        <div className="text-gray-300 text-6xl mb-4">🏔️</div>
                                        <h3 className="!text-xl !font-semibold text-gray-600 mb-3">No packages found</h3>
                                        <p className="!text-gray-500 font-semibold max-w-md mx-auto mb-6">
                                            We couldn't find any packages matching your filters.
                                        </p>
                                        <Button
                                            onClick={() => {
                                                setDurationFilter('all');
                                                setPriceFilter('all');
                                                setTourTypeFilter('all');
                                                setSortBy('recommended');
                                            }}
                                            className="bg-blue-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Clear Filters
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* Mobile Filter Dialog */}
            <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="!text-xl !font-black !text-slate-900">Filters</DialogTitle>
                    </DialogHeader>
                    <div className="flex-grow overflow-y-auto px-0">
                        <div className="p-6 pt-2">
                            <h3 className="!text-xs !font-black !text-slate-400 !uppercase !tracking-widest !mb-4">Tour Category</h3>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {[
                                    { id: 'all', label: 'All' },
                                    { id: 'india', label: 'Domestic' },
                                    { id: 'international', label: 'International' },
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setTourTypeFilter(type.id)}
                                        className={`flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold transition-all border ${tourTypeFilter === type.id
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                            : 'bg-white text-slate-600 border-slate-200'
                                            }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>

                            <SearchFilterSidebar
                                durationFilter={durationFilter}
                                setDurationFilter={setDurationFilter}
                                priceFilter={priceFilter}
                                setPriceFilter={setPriceFilter}
                                onClearFilters={() => {
                                    setDurationFilter('all');
                                    setPriceFilter('all');
                                    setTourTypeFilter('all');
                                    setSortBy('recommended');
                                }}
                                onClose={() => setIsFiltersOpen(false)}
                                onApply={() => setIsFiltersOpen(false)}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Footer />
            <LoginAlertModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} theme="blue" />
        </div>
    );
}
