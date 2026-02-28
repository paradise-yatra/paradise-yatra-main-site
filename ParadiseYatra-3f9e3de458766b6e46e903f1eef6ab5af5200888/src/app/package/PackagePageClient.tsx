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

const stripHtmlTags = (value: string = "") =>
    value
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/\s+/g, " ")
        .trim();

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

                // Fetch suggestions
                const suggestionsResponse = await fetch(`/api/all-packages?limit=9`, { cache: 'no-store' });
                if (suggestionsResponse.ok) {
                    const suggestionsData = await suggestionsResponse.json();
                    if (suggestionsData && suggestionsData.packages && Array.isArray(suggestionsData.packages)) {
                        setSuggestions(suggestionsData.packages);
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

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                (item.name && item.name.toLowerCase().includes(query)) ||
                (item.location && item.location.toLowerCase().includes(query)) ||
                (item.description && stripHtmlTags(item.description).toLowerCase().includes(query)) ||
                (item.state && item.state.toLowerCase().includes(query)) ||
                (item.country && item.country.toLowerCase().includes(query))
            );
        }

        // Filter by tour type
        if (tourTypeFilter !== 'all') {
            filtered = filtered.filter(item => item.tourType === tourTypeFilter);
        }

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
    }, [allItems, searchQuery, durationFilter, priceFilter, tourTypeFilter, sortBy]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

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
        <div className="min-h-screen bg-slate-50 flex flex-col font-plus-jakarta-sans">
            <Header />

            <main className="flex-grow pt-0">

                {/* Hero Section */}
                <section className="relative flex flex-col md:flex-row w-full md:h-[496px] md:overflow-hidden items-center justify-center bg-white md:bg-transparent">
                    <div className="md:hidden w-full px-4 pt-6 pb-2 bg-white text-left z-10 flex-shrink-0">
                        <h1 className="!text-[28px] !font-black text-slate-800 font-plus-jakarta-sans tracking-tight leading-tight">
                            Explore All <span className="text-[#000945]">Premium Packages</span>
                        </h1>
                    </div>

                    {/* Image Container */}
                    <div className="relative w-full h-[230.4px] md:absolute md:inset-0 md:h-auto flex-shrink-0">
                        <Image
                            src="/hero/sikkim-hero-v3.png"
                            alt="Paradise Yatra Packages"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Centered Hub (Hidden on mobile since highlights are hidden) */}
                    <div className="hidden md:block max-w-6xl w-full mx-auto px-4 md:px-8 relative z-30">
                        <div className="flex flex-col items-center max-w-4xl mx-auto w-full">
                            <Card className="bg-white rounded-[6px] shadow-none border border-slate-100 overflow-hidden w-full md:h-[150px] flex items-center">
                                <CardContent className="p-0 md:p-6 w-full h-full flex flex-col justify-center items-center">
                                    {/* Desktop Heading */}
                                    <h1 className="hidden md:block !text-xl md:!text-[44px] !font-black text-slate-800 mb-4 text-center font-plus-jakarta-sans tracking-tight leading-tight">
                                        Explore All <span className="text-[#000945]">Premium Packages</span>
                                    </h1>

                                    <div className="hidden md:flex flex-nowrap items-center justify-center gap-x-6 lg:gap-x-12 w-full px-2 md:px-4 overflow-x-auto no-scrollbar">
                                        <div className="flex items-center gap-3 group flex-shrink-0">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
                                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                            </div>
                                            <span className="text-[#000945] font-medium text-[12px] md:text-[15px] tracking-tight whitespace-nowrap">Snow views available</span>
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
                <section className="py-8 md:py-20 px-4 md:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-8">

                            {/* Sidebar Filters */}
                            <aside className="lg:w-80 flex-shrink-0">
                                <div className="lg:sticky lg:top-32 lg:mt-0.5">

                                    <Card className="hidden lg:block border border-[#dfe1df] shadow-none overflow-hidden p-0 bg-white rounded-[24px]">
                                        <div className="p-8 pb-2">
                                            <h3 className="!text-xs !font-black text-slate-400 uppercase tracking-widest mb-4">Tour Category</h3>
                                            <div className="space-y-1 mb-6">
                                                {[
                                                    { id: 'all', label: 'All Packages' },
                                                    { id: 'india', label: 'India' },
                                                    { id: 'international', label: 'International' },
                                                ].map((type) => (
                                                    <button
                                                        key={type.id}
                                                        onClick={() => setTourTypeFilter(type.id)}
                                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${tourTypeFilter === type.id
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
                                <div className="flex items-center justify-between lg:justify-end gap-3 mb-6 md:mb-8">
                                    <Button
                                        onClick={() => setIsFiltersOpen(true)}
                                        variant="outline"
                                        className="lg:hidden flex items-center justify-center h-9 rounded-full border-slate-200 text-slate-900 hover:bg-slate-50 font-medium text-xs px-6"
                                    >
                                        <Filter className="mr-2 h-3.5 w-3.5" />
                                        Filters
                                    </Button>

                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <span className="hidden sm:inline text-sm font-medium text-slate-500">Sort by:</span>
                                        <Select value={sortBy} onValueChange={setSortBy}>
                                            <SelectTrigger className="w-[140px] bg-white border-slate-200 font-medium text-slate-900 rounded-full h-9 text-xs px-4">
                                                <SelectValue placeholder="Recommended" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
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
                                            We couldn't find any packages matching your filters or search query.
                                        </p>
                                        <Button
                                            onClick={() => {
                                                setDurationFilter('all');
                                                setPriceFilter('all');
                                                setTourTypeFilter('all');
                                                setSearchQuery("");
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
            </main>

            <Footer />

            <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-[6px]">
                    <DialogHeader className="p-8 pb-4">
                        <DialogTitle className="!text-xl !font-bold !text-[#000945]">Filters</DialogTitle>
                    </DialogHeader>
                    <div className="flex-grow overflow-y-auto px-0">
                        <div className="p-8 pt-0">
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
                                        className={`flex items-center justify-center px-4 py-3 rounded-[6px] text-sm font-bold transition-all border ${tourTypeFilter === type.id
                                            ? 'bg-blue-50 text-blue-700 border-blue-100 shadow-sm'
                                            : 'bg-white text-slate-600 border-[#dfe1df]'
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
