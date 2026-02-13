"use client";

import { Suspense, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Filter, ChevronDown, Check, ChevronLeft, ChevronRight, X, ArrowRight, Heart, Search, Tag as TagIcon } from 'lucide-react';
import Loading from '@/components/ui/loading';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl, getPackagePriceLabel } from '@/lib/utils';
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
import CarouselArrows from '@/components/ui/CarouselArrows';

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
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
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
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-3 xl:px-4 py-2 rounded-lg transition-all duration-300 shadow-lg disabled:opacity-50 border-0"
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
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-3 xl:px-4 py-2 rounded-lg transition-all duration-300 shadow-lg disabled:opacity-50 border-0"
            >
                Next
            </Button>
        </div>
    );
};

const ThemeLoadingSkeleton = () => (
    <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="pt-24">
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
    </div>
);

export default function ThemePackagesPageClient({ slug }: { slug: string }) {
    const [tagData, setTagData] = useState<any>(null);
    const [allItems, setAllItems] = useState<any[]>([]);
    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // Filter & Pagination state
    const [durationFilter, setDurationFilter] = useState<string>('all');
    const [priceFilter, setPriceFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('recommended');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Carousel state
    const carouselRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const { user, toggleWishlist, isInWishlist } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const capitalize = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

    useEffect(() => {
        const fetchThemeData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/tags/slug/${slug}`, { cache: 'no-store' });
                if (!response.ok) throw new Error('Theme not found');

                const json = await response.json();
                if (json.success && json.data) {
                    setTagData(json.data);
                    setAllItems(json.data.packages || []);
                    setFilteredItems(json.data.packages || []);
                }

                // Fetch suggestions from same source as package detail page
                const sugRes = await fetch(`/api/all-packages?limit=24&isActive=true`, { cache: 'no-store' });
                if (sugRes.ok) {
                    const sugData = await sugRes.json();
                    const suggestionsArray = Array.isArray(sugData)
                        ? sugData
                        : Array.isArray(sugData?.packages)
                            ? sugData.packages
                            : [];

                    const currentThemePackageIds = new Set(
                        (json?.data?.packages || []).map((pkg: any) => pkg?._id).filter(Boolean)
                    );

                    setSuggestions(
                        suggestionsArray
                            .filter((pkg: any) => pkg?.isActive !== false && !currentThemePackageIds.has(pkg?._id))
                            .slice(0, 9)
                    );
                }
            } catch (err) {
                console.error('Error fetching theme:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchThemeData();
    }, [slug]);

    useEffect(() => {
        let filtered = [...allItems];

        if (durationFilter !== 'all') {
            const extractDays = (d: string) => {
                const m = d.match(/(\d+)\s*(?:Days?|D)/i);
                return m ? parseInt(m[1]) : 0;
            };
            filtered = filtered.filter(item => {
                const days = extractDays(item.duration || '');
                if (durationFilter === '1-3') return days >= 1 && days <= 3;
                if (durationFilter === '4-6') return days >= 4 && days <= 6;
                if (durationFilter === '7-9') return days >= 7 && days <= 9;
                if (durationFilter === '10-12') return days >= 10 && days <= 12;
                if (durationFilter === '13+') return days >= 13;
                return true;
            });
        }

        if (priceFilter !== 'all') {
            filtered = filtered.filter(item => {
                const p = item.price;
                if (priceFilter === '0-10000') return p <= 10000;
                if (priceFilter === '10000-20000') return p > 10000 && p <= 20000;
                if (priceFilter === '20000-35000') return p > 20000 && p <= 35000;
                if (priceFilter === '35000-50000') return p > 35000 && p <= 50000;
                if (priceFilter === '50000+') return p > 50000;
                return true;
            });
        }

        filtered.sort((a, b) => {
            if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
            if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
            return 0;
        });

        setFilteredItems(filtered);
        setCurrentPage(1);
    }, [allItems, durationFilter, priceFilter, sortBy]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

    if (loading) return <ThemeLoadingSkeleton />;

    if (!tagData) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Header />
                <div className="flex flex-col items-center justify-center h-[70vh]">
                    <h2 className="text-2xl font-bold text-slate-800">Theme Not Found</h2>
                    <p className="text-slate-600 mt-2">The requested package theme doesn't exist.</p>
                    <Link href="/package" className="mt-6 text-blue-600 font-bold hover:underline">Back to All Packages</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />

            <main className="flex-grow">
                <SearchHeader
                    title={<>{capitalize(tagData.name)} <span className="text-blue-600">Packages</span></>}
                    subtitle={tagData.description || `Discover our handpicked ${capitalize(tagData.name)} tour packages curated for an authentic and unforgettable experience.`}
                />

                <section className="py-8 px-4 md:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Sidebar Filters */}
                            <aside className="lg:w-80 flex-shrink-0">
                                <div className="lg:sticky lg:top-24">
                                    <div className="lg:hidden mb-4">
                                        <Button
                                            onClick={() => setIsFiltersOpen(true)}
                                            variant="outline"
                                            className="w-full border border-slate-300 text-slate-900 hover:bg-slate-50"
                                        >
                                            <Filter className="mr-2 h-4 w-4" /> Filters
                                        </Button>
                                    </div>

                                    <Card className="hidden lg:block border border-slate-200 shadow-sm overflow-hidden p-0 bg-white">
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
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <p className="!text-sm !font-bold !text-slate-600">
                                        Showing {filteredItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} {capitalize(tagData.name)} results
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-slate-700">Sort By:</span>
                                        <Select
                                            value={
                                                sortBy === 'recommended' ? 'Recommended' :
                                                    sortBy === 'price-asc' ? 'Price: Low to High' :
                                                        sortBy === 'price-desc' ? 'Price: High to Low' : 'Recommended'
                                            }
                                            onValueChange={(value) => {
                                                if (value === 'Recommended') setSortBy('recommended');
                                                else if (value === 'Price: Low to High') setSortBy('price-asc');
                                                else if (value === 'Price: High to Low') setSortBy('price-desc');
                                            }}
                                        >
                                            <SelectTrigger className="w-[200px] bg-white border-slate-200 font-medium text-slate-700 rounded-lg shadow-sm">
                                                <SelectValue placeholder="Sort By" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Recommended">Recommended</SelectItem>
                                                <SelectItem value="Price: Low to High">Price: Low to High</SelectItem>
                                                <SelectItem value="Price: High to Low">Price: High to Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {filteredItems.length > 0 ? (
                                    <div className="space-y-6">
                                        {paginatedItems.map((pkg) => (
                                            <HorizontalPackageCard
                                                key={pkg._id}
                                                id={pkg._id}
                                                title={pkg.name}
                                                destination={pkg.location}
                                                duration={pkg.duration}
                                                description={pkg.shortDescription || pkg.description}
                                                price={pkg.price}
                                                priceLabel={getPackagePriceLabel(pkg.priceType)}
                                                image={pkg.image}
                                                detailUrl={`/package/${pkg.slug || pkg._id}`}
                                                isInWishlist={isInWishlist(pkg._id)}
                                                onWishlistToggle={(e) => {
                                                    e.preventDefault();
                                                    if (!user) setIsLoginModalOpen(true);
                                                    else toggleWishlist(pkg._id);
                                                }}
                                            />
                                        ))}

                                        {totalPages > 1 && (
                                            <div className="mt-10">
                                                <Pagination
                                                    currentPage={currentPage}
                                                    totalPages={totalPages}
                                                    onPageChange={setCurrentPage}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm mx-1">
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full mb-6">
                                            <Search className="w-10 h-10 !text-slate-300" />
                                        </div>
                                        <h3 className="!text-2xl !font-black !text-slate-900 mb-2">No Packages Found</h3>
                                        <p className="!text-slate-500 !font-bold max-w-sm mx-auto">We couldn't find any packages matching your current filters.</p>
                                        <Button
                                            onClick={() => { setDurationFilter('all'); setPriceFilter('all'); }}
                                            className="mt-8 bg-blue-600 hover:bg-blue-700 !px-8 !py-6 !text-lg !font-black rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                                        >
                                            Clear All Filters
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                    <section className="!bg-white px-4 py-16 text-gray-900 md:px-8 relative z-20 overflow-hidden border-t border-slate-100">
                        <div className="mx-auto flex max-w-6xl flex-col gap-10 relative z-10">
                            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-2">
                                <div className="flex flex-col gap-1 px-1">
                                    <h3 className="!text-2xl md:!text-3xl !font-bold !text-slate-900 !leading-tight flex items-center gap-3 flex-wrap">
                                        You Might Also Like
                                    </h3>
                                    <p className="!text-sm !text-slate-600 md:!text-base !max-w-2xl !font-semibold">
                                        Explore our popular packages and create unforgettable memories
                                    </p>
                                </div>
                            </div>

                            <div className="relative group/carousel">
                                <CarouselArrows
                                    onPrevious={() => carouselRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                                    onNext={() => carouselRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                                    canScrollLeft={canScrollLeft}
                                    canScrollRight={canScrollRight}
                                />
                                <div
                                    ref={carouselRef}
                                    className="flex gap-4 overflow-x-auto scroll-smooth pb-8 scrollbar-hide px-2"
                                    style={{
                                        scrollbarWidth: "none",
                                        msOverflowStyle: "none",
                                        scrollSnapType: "x mandatory",
                                    }}
                                >
                                    {suggestions.map((pkg, idx) => (
                                        <PackageCard
                                            key={`${pkg._id}-${idx}`}
                                            id={pkg._id}
                                            title={pkg.name}
                                            destination={pkg.location}
                                            image={getImageUrl(pkg.image) || pkg.image || ''}
                                            duration={pkg.duration}
                                            price={pkg.price || 0}
                                            slug={pkg.slug || pkg._id}
                                            hrefPrefix="/package"
                                            themeColor="#005beb"
                                            priceLabel={getPackagePriceLabel(pkg.priceType)}
                                            isInWishlist={isInWishlist(pkg._id)}
                                            onWishlistToggle={(e) => {
                                                e.preventDefault();
                                                if (!user) setIsLoginModalOpen(true);
                                                else toggleWishlist(pkg._id);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="!text-xl !font-black !text-slate-900">Filters</DialogTitle>
                    </DialogHeader>
                    <div className="flex-grow overflow-y-auto px-0">
                        <div className="p-6 pt-2">
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
                                onClose={() => setIsFiltersOpen(false)}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <LoginAlertModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} theme="blue" />
        </div>
    );
}
