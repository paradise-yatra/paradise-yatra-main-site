"use client";

import { Suspense, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Filter, ChevronDown, Check, ChevronLeft, ChevronRight, X, ArrowRight, Star } from 'lucide-react';
import Loading from '@/components/ui/loading';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { urlToCategory } from '@/lib/categoryUtils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Header from '@/components/Header';
import { Package } from '@/types/package';
import { Destination } from '@/types/destination';
import { packagesAPI } from '@/lib/api';
import PackageCard from '@/components/ui/PackageCard';
import HorizontalPackageCard from '@/components/ui/HorizontalPackageCard';
import SearchFilterSidebar from '@/components/ui/SearchFilterSidebar';
import SearchHeader from '@/components/ui/SearchHeader';
import { useAuth } from '@/context/AuthContext';
import LoginAlertModal from '@/components/LoginAlertModal';
import CarouselArrows from '@/components/ui/CarouselArrows';

// Helper to format category title (capitalize each word)
const formatCategoryTitle = (value: string) => {
    if (!value) return '';
    return value
        .split(' ')
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

// Helper to format duration display (e.g. 4N/5D -> 4 Days, 5 Nights)
const formatDurationDisplay = (duration: string) => {
    if (!duration) return '';

    // Match patterns like "4N/5D", "4 N / 5 D", case-insensitive
    const nightsDaysMatch = duration.match(/^\s*(\d+)\s*N\s*\/\s*(\d+)\s*D\s*$/i);
    if (nightsDaysMatch) {
        const nights = nightsDaysMatch[1];
        const days = nightsDaysMatch[2];
        return `${nights}N/${days}D`;
    }

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
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:cursor-pointer text-white font-semibold px-3 xl:px-4 py-2 rounded-lg transition-all duration-300 shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed border-0"
            >
                Previous
            </Button>

            {getPageNumbers().map((page, index) => (
                <div key={index}>
                    {page === '...' ? (
                        <span className="px-3 py-2 text-blue-500 hover:cursor-pointer">...</span>
                    ) : (
                        <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page as number)}
                            className={`px-3 py-2 ${currentPage === page
                                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer border-0'
                                : 'bg-blue-500 text-white hover:bg-blue-600 hover:cursor-pointer border-0'
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
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:cursor-pointer text-white font-semibold px-3 xl:px-4 py-2 rounded-lg transition-all duration-300 shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed border-0"
            >
                Next
            </Button>
        </div>
    );
};


// Loading skeleton component
const PackagesLoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">

            {/* Header skeleton */}
            <div className="text-center mb-8">
                <div className="h-10 bg-gray-200 rounded w-80 mx-auto mb-4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-64 mx-auto mb-6 animate-pulse"></div>
            </div>

            {/* Main content skeleton */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Filter sidebar skeleton */}
                <div className="lg:w-72">
                    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                        <div className="h-6 bg-gray-200 rounded w-24 mb-6 animate-pulse"></div>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="mb-6">
                                <div className="h-4 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
                                <div className="space-y-2">
                                    {[1, 2, 3, 4].map((j) => (
                                        <div key={j} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                    </div>
                </div>

                {/* Results skeleton */}
                <div className="flex-1">
                    <div className="grid gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-80 h-48 bg-gray-200 animate-pulse"></div>
                                    <div className="p-6 flex-1">
                                        <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-6 w-1/2 animate-pulse"></div>
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                                            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);



interface CategoryPageProps {
    params: Promise<{
        category: string;
    }>;
}

type SortOption = 'price-asc' | 'price-desc' | 'rating-desc' | 'duration-asc' | 'duration-desc';
type ViewMode = 'grid' | 'list';

export default function CategoryPage({ params }: CategoryPageProps) {
    const [packages, setPackages] = useState<Package[]>([]);
    const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('rating-desc');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
    const [durationFilter, setDurationFilter] = useState<string>('all');
    const [destinationFilter, setDestinationFilter] = useState<string>('all');
    const [ratingFilter, setRatingFilter] = useState<string>('all');
    const [priceFilter, setPriceFilter] = useState<string>('all');
    const [suggestions, setSuggestions] = useState<Destination[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    // Carousel state
    const carouselRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
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

    // Get color scheme based on category
    const getCategoryColors = (category: string) => {
        const categoryLower = category.toLowerCase();

        if (categoryLower.includes('trending')) {
            return {
                primary: 'blue',
                primaryClass: 'text-blue-600',
                buttonClass: 'bg-blue-600 hover:bg-blue-700',
                radioClass: 'text-blue-600 focus:ring-blue-500'
            };
        } else if (categoryLower.includes('popular')) {
            return {
                primary: 'green',
                primaryClass: 'text-green-600',
                buttonClass: 'bg-green-600 hover:bg-green-700',
                radioClass: 'text-green-600 focus:ring-green-500'
            };
        } else if (categoryLower.includes('adventure')) {
            return {
                primary: 'orange',
                primaryClass: 'text-orange-600',
                buttonClass: 'bg-orange-600 hover:bg-orange-700',
                radioClass: 'text-orange-600 focus:ring-orange-500'
            };
        } else if (categoryLower.includes('premium')) {
            return {
                primary: 'purple',
                primaryClass: 'text-purple-600',
                buttonClass: 'bg-purple-600 hover:bg-purple-700',
                radioClass: 'text-purple-600 focus:ring-purple-500'
            };
        } else if (categoryLower.includes('budget')) {
            return {
                primary: 'emerald',
                primaryClass: 'text-emerald-600',
                buttonClass: 'bg-emerald-600 hover:bg-emerald-700',
                radioClass: 'text-emerald-600 focus:ring-emerald-500'
            };
        } else {
            // Default purple for other categories
            return {
                primary: 'purple',
                primaryClass: 'text-purple-600',
                buttonClass: 'bg-purple-600 hover:bg-purple-700',
                radioClass: 'text-purple-600 focus:ring-purple-500'
            };
        }
    };

    const colors = getCategoryColors(category);

    // Get unique destinations and durations for filters
    const destinations = Array.from(new Set(packages.map(pkg => pkg.destination).filter(Boolean))).sort();
    const durations = Array.from(new Set(packages.map(pkg => pkg.duration).filter(Boolean))).sort();

    // Update scroll buttons state
    const updateScrollState = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener("scroll", updateScrollState);
            updateScrollState(); // Initial check
            window.addEventListener("resize", updateScrollState);
        }
        return () => {
            if (carousel) {
                carousel.removeEventListener("scroll", updateScrollState);
            }
            window.removeEventListener("resize", updateScrollState);
        };
    }, [suggestions]);

    const scrollByStep = (direction: number) => {
        if (carouselRef.current) {
            const scrollAmount = 300; // Approx card width + gap
            carouselRef.current.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
        }
    };

    // Pagination calculations
    const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPackages = filteredPackages.slice(startIndex, endIndex);

    // Debug: Log when filteredPackages changes
    console.log('Rendering with filtered packages:', {
        filteredCount: filteredPackages.length,
        paginatedCount: paginatedPackages.length,
        currentPage,
        ratingFilter
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resolvedParams = await params;
                const decodedCategory = urlToCategory(resolvedParams.category);
                setCategory(decodedCategory);

                setLoading(true);
                setError(null);

                // Use destinations API for Popular Destinations, packages API for others
                // Map "Popular Destinations" to "Popular Packages" for backend compatibility
                const categoryForAPI = decodedCategory.toLowerCase() === 'popular destinations'
                    ? 'Popular Packages'
                    : decodedCategory;

                const response = decodedCategory.toLowerCase() === 'popular destinations'
                    ? await fetch('/api/destinations').then(res => res.json())
                    : await packagesAPI.getByCategory(categoryForAPI, { limit: 100 });

                // Handle response data properly
                let packagesData: Package[] = [];

                if (decodedCategory.toLowerCase() === 'popular destinations') {
                    // Destinations API returns { destinations: [...] }
                    if (response && response.destinations && Array.isArray(response.destinations)) {
                        // Transform destinations to package format
                        packagesData = response.destinations.map((dest: Destination) => ({
                            _id: dest._id,
                            title: dest.name,
                            slug: dest.slug,
                            description: dest.description,
                            shortDescription: dest.shortDescription,
                            price: dest.price,
                            destination: dest.location,
                            duration: dest.duration,
                            category: dest.category,
                            rating: typeof dest.rating === 'string' ? parseFloat(dest.rating) : (dest.rating || 0),
                            images: dest.image ? [dest.image] : [],
                            tourType: dest.tourType,
                            country: dest.country,
                            state: dest.state,
                            highlights: dest.highlights,
                            inclusions: dest.inclusions,
                            exclusions: dest.exclusions,
                            itinerary: dest.itinerary,
                            isActive: dest.isActive,
                            isTrending: dest.isTrending,
                            visitCount: dest.visitCount,
                            createdAt: dest.createdAt,
                            updatedAt: dest.updatedAt
                        }));
                    }
                } else {
                    // Packages API returns array or { data: [...] }
                    if (Array.isArray(response)) {
                        packagesData = response;
                    } else if (response && response.data && Array.isArray(response.data)) {
                        packagesData = response.data;
                    }

                    // Ensure ratings are properly converted to numbers
                    packagesData = packagesData.map(pkg => ({
                        ...pkg,
                        rating: typeof pkg.rating === 'string' ? parseFloat(pkg.rating) : (pkg.rating || 0)
                    }));
                }

                if (!Array.isArray(packagesData)) {
                    throw new Error('Invalid data format received from API');
                }

                // Filter out packages without required fields
                const validPackages = packagesData.filter(pkg =>
                    pkg.title &&
                    pkg.price &&
                    pkg.destination &&
                    pkg.duration
                );

                if (validPackages.length === 0) {
                    setError(`No packages found in the ${decodedCategory} category`);
                    setPackages([]);
                    setFilteredPackages([]);
                    return;
                }

                setPackages(validPackages);
                setFilteredPackages(validPackages);

                // Set price range based on actual data
                if (validPackages.length > 0) {
                    const prices = validPackages.map((pkg: Package) => pkg.price).filter(price => typeof price === 'number');
                    if (prices.length > 0) {
                        const minPrice = Math.min(...prices);
                        const maxPrice = Math.max(...prices);
                        setPriceRange([minPrice, maxPrice]);
                    }
                }

                // Fetch suggestions from other sections (destinations)
                try {
                    const suggestionsResponse = await fetch('/api/destinations?limit=9');
                    if (suggestionsResponse.ok) {
                        const suggestionsData = await suggestionsResponse.json();
                        if (suggestionsData && suggestionsData.destinations && Array.isArray(suggestionsData.destinations)) {
                            setSuggestions(suggestionsData.destinations.slice(0, 9));
                        }
                    }
                } catch (err) {
                    console.error('Error fetching suggestions:', err);
                }

            } catch (err) {
                console.error('Error fetching packages:', err);
                setError('Failed to load packages');
                setPackages([]);
                setFilteredPackages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params]);

    // Apply filters and sorting
    useEffect(() => {
        if (!Array.isArray(packages) || packages.length === 0) {
            setFilteredPackages([]);
            return;
        }

        let filtered = [...packages];

        // Apply rating filter
        if (ratingFilter !== 'all') {
            const minRating = parseFloat(ratingFilter);
            filtered = filtered.filter(pkg => {
                // Ensure rating is a number and handle string values
                const packageRating = typeof pkg.rating === 'string'
                    ? parseFloat(pkg.rating)
                    : (pkg.rating || 0);

                return packageRating >= minRating;
            });
        }

        // Apply price filter
        if (priceFilter !== 'all') {
            if (priceFilter === '0-1000') {
                filtered = filtered.filter(pkg => typeof pkg.price === 'number' && pkg.price >= 0 && pkg.price <= 1000);
            } else if (priceFilter === '1000-2500') {
                filtered = filtered.filter(pkg => typeof pkg.price === 'number' && pkg.price >= 1000 && pkg.price <= 2500);
            } else if (priceFilter === '2500-5000') {
                filtered = filtered.filter(pkg => typeof pkg.price === 'number' && pkg.price >= 2500 && pkg.price <= 5000);
            } else if (priceFilter === '5000+') {
                filtered = filtered.filter(pkg => typeof pkg.price === 'number' && pkg.price >= 5000);
            }
        }

        // Apply duration filter
        if (durationFilter !== 'all') {
            // Helper function to extract days from duration string
            const extractDays = (duration: string): number => {
                if (!duration) return 0;
                // Try to match patterns like "10 Days", "10D", "10 Days, 9 Nights", etc.
                const match = duration.match(/(\d+)\s*(?:Days?|D)/i);
                if (match) {
                    return parseInt(match[1], 10);
                }
                // Fallback: try to get first number
                const firstNumber = duration.match(/\d+/);
                return firstNumber ? parseInt(firstNumber[0], 10) : 0;
            };

            filtered = filtered.filter(pkg => {
                const days = extractDays(pkg.duration || '');

                switch (durationFilter) {
                    case '1-3':
                        return days >= 1 && days <= 3;
                    case '4-6':
                        return days >= 4 && days <= 6;
                    case '7-9':
                        return days >= 7 && days <= 9;
                    case '10-12':
                        return days >= 10 && days <= 12;
                    case '13+':
                        return days >= 13;
                    default:
                        return true;
                }
            });
        }

        // Apply destination filter
        if (destinationFilter !== 'all') {
            filtered = filtered.filter(pkg => {
                const pkgDestination = (pkg.destination || '').toLowerCase().trim();
                const filterDestination = destinationFilter.toLowerCase().trim();
                // Check for exact match or if the destination contains the filter value
                return pkgDestination === filterDestination || pkgDestination.includes(filterDestination);
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return (a.price || 0) - (b.price || 0);
                case 'price-desc':
                    return (b.price || 0) - (a.price || 0);
                case 'rating-desc':
                    return (b.rating || 0) - (a.rating || 0);
                case 'duration-asc':
                    return (a.duration || '').localeCompare(b.duration || '');
                case 'duration-desc':
                    return (b.duration || '').localeCompare(a.duration || '');
                default:
                    return 0;
            }
        });

        setFilteredPackages(filtered);
    }, [packages, sortBy, durationFilter, destinationFilter, ratingFilter, priceFilter]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [sortBy, priceRange, durationFilter, destinationFilter, ratingFilter, priceFilter]);



    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="pt-20">
                    <PackagesLoadingSkeleton />
                </div>
            </div>
        );
    }

    if (error || packages.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="pt-20">
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
                            <div className="text-gray-300 text-6xl mb-4">📦</div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-3">
                                {error ? 'Failed to load packages' : 'No packages found'}
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">
                                {error || `We couldn't find any packages in the ${category} category.`}
                            </p>
                            <Link href="/">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div>
                <Suspense fallback={<PackagesLoadingSkeleton />}>
                    {/* Header Section */}
                    <SearchHeader
                        title={<><span className="text-blue-600"> {formatCategoryTitle(category)}</span> Packages</>}
                        subtitle="Discover amazing destinations around the world with our handpicked collection of premium travel packages"
                    />

                    {/* Main Content */}
                    <section className="py-8 px-4 md:px-8">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex flex-col lg:flex-row gap-6 ">
                                {/* Mobile Filter Button */}
                                <div className="lg:hidden mb-4">
                                    <Button
                                        onClick={() => setIsFiltersOpen(true)}
                                        variant="outline"
                                        className="w-full border border-slate-300 text-slate-900 hover:bg-slate-50 hover:text-slate-900"
                                    >
                                        <Filter className="mr-2 h-4 w-4 text-slate-900" />
                                        Filters
                                    </Button>
                                </div>

                                {/* Filters Sidebar - Desktop */}
                                <aside className="hidden lg:block w-80 flex-shrink-0">
                                    <Card className="sticky top-24 border border-slate-200 shadow-sm overflow-hidden">
                                        <SearchFilterSidebar
                                            durationFilter={durationFilter}
                                            setDurationFilter={setDurationFilter}
                                            priceFilter={priceFilter}
                                            setPriceFilter={setPriceFilter}
                                            onClearFilters={() => {
                                                setDurationFilter('all');
                                                setPriceFilter('all');
                                                setSortBy('rating-desc');
                                            }}
                                        />
                                    </Card>
                                </aside>

                                {/* Packages List */}
                                <div className="flex-1">
                                    {/* Sort and Count Header */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                        <p className="!text-sm font-bold !text-slate-600">
                                            Showing {startIndex + 1}-{Math.min(endIndex, filteredPackages.length)} of {filteredPackages.length} results
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-slate-700">Sort By:</span>
                                            <Select
                                                value={sortBy === 'rating-desc' ? 'Recommended' : sortBy === 'price-asc' ? 'Price-asc' : sortBy === 'price-desc' ? 'Price-desc' : sortBy === 'duration-asc' ? 'Duration-asc' : 'Rating-desc'}
                                                onValueChange={(value) => setSortBy(value as SortOption)}
                                            >
                                                <SelectTrigger className="w-[200px] bg-white border-slate-200 font-medium text-slate-700">
                                                    <SelectValue placeholder="Sort By" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="rating-desc">Recommended</SelectItem>
                                                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                                    <SelectItem value="duration-asc">Duration</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Package Cards List */}
                                    {filteredPackages.length > 0 ? (
                                        <div className="space-y-6">
                                            {paginatedPackages.map((pkg, index) => (
                                                <HorizontalPackageCard
                                                    key={pkg._id || index}
                                                    id={pkg._id}
                                                    title={pkg.title}
                                                    destination={pkg.destination}
                                                    duration={pkg.duration}
                                                    description={pkg.shortDescription || pkg.description || ""}
                                                    price={pkg.price}
                                                    image={pkg.images?.[0] || ""}
                                                    detailUrl={category.toLowerCase() === 'popular destinations' ? `/destinations/${pkg.slug || pkg._id}` : `/itinerary/${pkg.slug || pkg._id}`}
                                                    isInWishlist={isInWishlist(pkg._id)}
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
                                            <p className="!text-gray-500 !font-semibold max-w-md mx-auto mb-6">
                                                We couldn't find any packages matching your filters.
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setDurationFilter('all');
                                                    setPriceFilter('all');
                                                    setSortBy('rating-desc');
                                                }}
                                                className="bg-blue-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Clear Filters
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* You Might Also Like Section */}
                    {suggestions.length > 0 && (
                        <section className="py-16 bg-slate-50 px-4 md:px-8">
                            <div className="max-w-6xl mx-auto">
                                <div className="mb-10 flex items-end justify-between">
                                    <div className="text-center md:text-left w-full md:w-auto">
                                        <h2 className="!text-2xl md:text-3xl !font-bold !text-slate-900 mb-4">
                                            You Might Also Like
                                        </h2>
                                        <p className="!text-sm !text-slate-600 md:text-base max-w-2xl font-semibold">
                                            Explore more amazing destinations and create unforgettable memories
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 md:gap-4 hidden md:flex">
                                    </div>
                                </div>

                                {/* Carousel */}
                                <div className="relative -mx-4 px-4 md:mx-0 md:px-0 group/carousel">
                                    <CarouselArrows
                                        onPrevious={() => scrollByStep(-1)}
                                        onNext={() => scrollByStep(1)}
                                        canScrollLeft={canScrollLeft}
                                        canScrollRight={canScrollRight}
                                    />
                                    <div
                                        ref={carouselRef}
                                        className="flex gap-2 overflow-x-auto scroll-smooth pb-8 pt-2 scrollbar-hide px-2"
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
                                                duration={pkg.duration || 'Flexible'}
                                                title={pkg.name}
                                                price={pkg.price || 0}
                                                image={getImageUrl(pkg.image) || `https://picsum.photos/800/500?random=${index + 50}`}
                                                slug={pkg.slug || pkg._id}
                                                hrefPrefix="/destinations"
                                                themeColor="#005beb"
                                                priceLabel="Per Person"
                                                isInWishlist={isInWishlist(pkg._id)}
                                                onWishlistToggle={handleWishlistToggle}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Mobile Filter Dialog */}
                    {/* Mobile Filter Dialog */}
                    <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                        <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 overflow-hidden">
                            <SearchFilterSidebar
                                durationFilter={durationFilter}
                                setDurationFilter={setDurationFilter}
                                priceFilter={priceFilter}
                                setPriceFilter={setPriceFilter}
                                onClearFilters={() => {
                                    setDurationFilter('all');
                                    setPriceFilter('all');
                                    setSortBy('rating-desc');
                                }}
                                onClose={() => setIsFiltersOpen(false)}
                                onApply={() => setIsFiltersOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </Suspense>
            </div >
            <LoginAlertModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} theme="blue" />
        </div >
    );
}
