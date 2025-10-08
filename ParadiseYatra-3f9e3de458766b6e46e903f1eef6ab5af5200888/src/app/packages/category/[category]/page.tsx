"use client";

import { Suspense, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { LazyHeader } from '@/components/lazy-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Clock, Heart, Filter, SortAsc, SortDesc, Grid, List, ChevronDown, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import Loading from '@/components/ui/loading';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { packagesAPI } from '@/lib/api';
import { Package } from '@/types/package';
import { Destination } from '@/types/destination';
import { urlToCategory } from '@/lib/categoryUtils';
import { Button } from '@/components/ui/button';

// Pagination Component
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) => {
    if (totalPages <= 1) return null;

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
                onClick={() => onPageChange(currentPage - 1)}
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
                            onClick={() => onPageChange(page as number)}
                            className={`px-3 py-2 ${
                                currentPage === page 
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
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:cursor-pointer text-white font-semibold px-3 xl:px-4 py-2 rounded-lg transition-all duration-300 shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed border-0"
            >
                Next
            </Button>
        </div>
    );
};

// Custom Modern Dropdown Component
interface DropdownOption {
    value: string;
    label: string;
}

interface ModernDropdownProps {
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const ModernDropdown = ({ options, value, onChange, placeholder, className = "" }: ModernDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const selectedOption = options.find(option => option.value === value);

    const handleToggle = () => {
        if (!isOpen && buttonRef.current) {
            setButtonRect(buttonRef.current.getBoundingClientRect());
        }
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        setIsOpen(false);
        setButtonRect(null);
    };

    return (
        <>
            <div className={`relative ${className}`}>
                <button
                    ref={buttonRef}
                    type="button"
                    onClick={handleToggle}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-blue-500 hover:bg-blue-50 hover:cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer flex items-center justify-between"
                >
                    <span className="truncate">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                            }`}
                    />
                </button>
            </div>

            {isOpen && buttonRect &&
                createPortal(
                    <AnimatePresence>
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[99998]"
                                onClick={handleClose}
                            />

                            {/* Dropdown Menu - Fixed positioning */}
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="fixed bg-white border border-gray-200 rounded-xl shadow-2xl z-[999999] overflow-hidden"
                                style={{
                                    top: buttonRect.bottom + 4,
                                    left: buttonRect.left,
                                    width: buttonRect.width,
                                    minWidth: '180px'
                                }}
                            >
                                {options.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value);
                                            handleClose();
                                        }}
                                        className="w-full px-4 py-3 text-left text-sm text-blue-500 hover:bg-blue-50 hover:cursor-pointer hover:text-blue-700 transition-colors duration-150 flex items-center justify-between group"
                                    >
                                        <span className="truncate">{option.label}</span>
                                        {value === option.value && (
                                            <Check className="w-4 h-4 text-blue-600 hover:cursor-pointer" />
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        </>
                    </AnimatePresence>,
                    document.body
                )
            }
        </>
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
    const [currentSlide, setCurrentSlide] = useState(0);
    const itemsPerPage = 6;

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

    // Carousel navigation functions
    const nextSlide = () => {
        console.log('Next slide clicked, current:', currentSlide, 'suggestions length:', suggestions.length);
        setCurrentSlide((prev) => 
            prev >= suggestions.length - 3 ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        console.log('Previous slide clicked, current:', currentSlide, 'suggestions length:', suggestions.length);
        setCurrentSlide((prev) => 
            prev <= 0 ? Math.max(0, suggestions.length - 3) : prev - 1
        );
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
                
                // Debug: Log the comparison for troubleshooting
                if (packageRating < minRating) {
                    console.log(`Filtering out ${pkg.title}: rating ${packageRating} < ${minRating}`);
                }
                
                return packageRating >= minRating;
            });
        }

        // Apply price filter
        if (priceFilter !== 'all') {
            if (priceFilter === '0-10000') {
                filtered = filtered.filter(pkg => typeof pkg.price === 'number' && pkg.price < 10000);
            } else if (priceFilter === '10000-20000') {
                filtered = filtered.filter(pkg => typeof pkg.price === 'number' && pkg.price >= 10000 && pkg.price < 20000);
            } else if (priceFilter === '20000-30000') {
                filtered = filtered.filter(pkg => typeof pkg.price === 'number' && pkg.price >= 20000 && pkg.price < 30000);
            } else if (priceFilter === '30000-50000') {
                filtered = filtered.filter(pkg => typeof pkg.price === 'number' && pkg.price >= 30000 && pkg.price < 50000);
            } else if (priceFilter === '50000+') {
                filtered = filtered.filter(pkg => typeof pkg.price === 'number' && pkg.price >= 50000);
            }
        } else {
            // Apply price range filter (for custom range)
            filtered = filtered.filter(pkg =>
                typeof pkg.price === 'number' &&
                pkg.price >= priceRange[0] &&
                pkg.price <= priceRange[1]
            );
        }

        // Apply duration filter
        if (durationFilter !== 'all') {
            if (durationFilter === '1-3') {
                filtered = filtered.filter(pkg => {
                    const duration = pkg.duration || '';
                    return duration.includes('1') || duration.includes('2') || duration.includes('3');
                });
            } else if (durationFilter === '4-6') {
                filtered = filtered.filter(pkg => {
                    const duration = pkg.duration || '';
                    return duration.includes('4') || duration.includes('5') || duration.includes('6');
                });
            } else if (durationFilter === '7-9') {
                filtered = filtered.filter(pkg => {
                    const duration = pkg.duration || '';
                    return duration.includes('7') || duration.includes('8') || duration.includes('9');
                });
            } else if (durationFilter === '10-12') {
                filtered = filtered.filter(pkg => {
                    const duration = pkg.duration || '';
                    return duration.includes('10') || duration.includes('11') || duration.includes('12');
                });
            } else if (durationFilter === '13+') {
                filtered = filtered.filter(pkg => {
                    const duration = pkg.duration || '';
                    const days = parseInt(duration.match(/\d+/)?.[0] || '0');
                    return days >= 13;
                });
            }
        }

        // Apply destination filter
        if (destinationFilter !== 'all') {
            filtered = filtered.filter(pkg => pkg.destination === destinationFilter);
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

        console.log('Setting filtered packages:', { 
            originalCount: packages.length, 
            filteredCount: filtered.length, 
            ratingFilter,
            filteredTitles: filtered.map(p => p.title)
        });
        setFilteredPackages(filtered);
    }, [packages, sortBy, priceRange, durationFilter, destinationFilter, ratingFilter, priceFilter]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [sortBy, priceRange, durationFilter, destinationFilter, ratingFilter, priceFilter]);



    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <LazyHeader />
                <div className="pt-20">
                    <PackagesLoadingSkeleton />
                </div>
            </div>
        );
    }

    if (error || packages.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <LazyHeader />
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
        <div className="min-h-screen bg-gray-50">
            <LazyHeader />
            <div className="pt-20">
                <div className="container mx-auto px-4 py-8">
                    <Suspense fallback={<PackagesLoadingSkeleton />}>
                       
                        {/* Header */}
                        <div className="text-center mb-12 pt-10">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                {category} <span className="text-blue-600">Packages</span>
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                                Discover amazing destinations with our curated tour packages
                            </p>

                        </div>

                        {/* Mobile filter toggle */}
                        <div className="lg:hidden mb-4 -mt-2 flex justify-start">
                            <button
                                onClick={() => setIsFiltersOpen(true)}
                                aria-expanded={isFiltersOpen}
                                aria-controls="filters-panel"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M4 8h16M6 12h12M8 16h8" />
                                </svg>
                                Filters
                            </button>
                        </div>

                        {/* Content with Sidebar */}
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left Sidebar - Filters */}
                            <div className={`lg:w-72 flex-shrink-0 ${isFiltersOpen ? 'block' : 'hidden'} lg:block relative z-50 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-auto lg:z-20`} id="filters-panel">
                                <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                                    {/* Mobile close button */}
                                    <div className="flex justify-between items-center lg:hidden mb-2">
                                        <h3 className="text-base font-semibold text-gray-900">Filters</h3>
                                        <button
                                            onClick={() => setIsFiltersOpen(false)}
                                            aria-label="Close filters"
                                            className="text-gray-500 hover:text-gray-700 p-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                                        </svg>
                                        Filters
                                    </h3>
                                    
                                    {/* Mobile: Collapsible filter sections */}
                                    <div className="space-y-4 lg:space-y-6">
                                        {/* Rating Filter - Compact on mobile */}
                                        <div className="lg:mb-6">
                                            <h4 className="text-gray-700 font-semibold text-sm mb-2 lg:mb-3 uppercase tracking-wide flex items-center">
                                                <span className="w-1 h-4 bg-blue-500 mr-2 rounded-full"></span>
                                                Rating
                                            </h4>
                                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1 lg:gap-0">
                                                {[
                                                    { value: 'all', label: 'Any' },
                                                    { value: '4.5', label: '4.5+' },
                                                    { value: '4.0', label: '4.0+' },
                                                    { value: '3.5', label: '3.5+' },
                                                    { value: '3.0', label: '3.0+' }
                                                ].map((option) => (
                                                    <label key={option.value} className="flex items-center cursor-pointer py-1.5 lg:py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                                                        <input
                                                            type="radio"
                                                            name="rating"
                                                            value={option.value}
                                                            checked={ratingFilter === option.value}
                                                            onChange={(e) => setRatingFilter(e.target.value)}
                                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                        />
                                                        <span className="ml-2 lg:ml-3 text-xs lg:text-sm text-gray-700">{option.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Duration Filter - Compact on mobile */}
                                        <div className="lg:mb-6">
                                            <h4 className="text-gray-700 font-semibold text-sm mb-2 lg:mb-3 uppercase tracking-wide flex items-center">
                                                <span className="w-1 h-4 bg-blue-500 mr-2 rounded-full"></span>
                                                Duration
                                            </h4>
                                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1 lg:gap-0">
                                                {[
                                                    { value: 'all', label: 'Any' },
                                                    { value: '1-3', label: '1-3 Days' },
                                                    { value: '4-6', label: '4-6 Days' },
                                                    { value: '7-9', label: '7-9 Days' },
                                                    { value: '10-12', label: '10-12 Days' },
                                                    { value: '13+', label: '13+ Days' }
                                                ].map((option) => (
                                                    <label key={option.value} className="flex items-center cursor-pointer py-1.5 lg:py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                                                        <input
                                                            type="radio"
                                                            name="duration"
                                                            value={option.value}
                                                            checked={durationFilter === option.value}
                                                            onChange={(e) => setDurationFilter(e.target.value)}
                                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                        />
                                                        <span className="ml-2 lg:ml-3 text-xs lg:text-sm text-gray-700">{option.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price Filter - Compact on mobile */}
                                        <div className="lg:mb-6">
                                            <h4 className="text-gray-700 font-semibold text-sm mb-2 lg:mb-3 uppercase tracking-wide flex items-center">
                                                <span className="w-1 h-4 bg-blue-500 mr-2 rounded-full"></span>
                                                Price
                                            </h4>
                                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1 lg:gap-0">
                                                {[
                                                    { value: 'all', label: 'Any' },
                                                    { value: '0-10000', label: 'Under ₹10K' },
                                                    { value: '10000-20000', label: '₹10K-20K' },
                                                    { value: '20000-30000', label: '₹20K-30K' },
                                                    { value: '30000-50000', label: '₹30K-50K' },
                                                    { value: '50000+', label: 'Above ₹50K' }
                                                ].map((option) => (
                                                    <label key={option.value} className="flex items-center cursor-pointer py-1.5 lg:py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                                                        <input
                                                            type="radio"
                                                            name="price"
                                                            value={option.value}
                                                            checked={priceFilter === option.value}
                                                            onChange={(e) => setPriceFilter(e.target.value)}
                                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                        />
                                                        <span className="ml-2 lg:ml-3 text-xs lg:text-sm text-gray-700">{option.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {destinations.length > 0 && (
                                            <div className="lg:mb-6">
                                                <h4 className="text-gray-700 font-semibold text-sm mb-2 lg:mb-3 uppercase tracking-wide flex items-center">
                                                    <span className="w-1 h-4 bg-blue-500 mr-2 rounded-full"></span>
                                                    Destination
                                                </h4>
                                                <div className="space-y-1 lg:space-y-2 max-h-40 overflow-y-auto">
                                                    {[
                                                        { value: 'all', label: 'Any Destination' },
                                                        ...destinations.map(dest => ({ value: dest, label: dest }))
                                                    ].map((option) => (
                                                        <label key={option.value} className="flex items-center cursor-pointer py-1.5 lg:py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                                                            <input
                                                                type="radio"
                                                                name="destination"
                                                                value={option.value}
                                                                checked={destinationFilter === option.value}
                                                                onChange={(e) => setDestinationFilter(e.target.value)}
                                                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                            />
                                                            <span className="ml-2 lg:ml-3 text-xs lg:text-sm text-gray-700">{option.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => {
                                            setSortBy('rating-desc');
                                            setPriceRange([0, 100000]);
                                            setDurationFilter('all');
                                            setDestinationFilter('all');
                                            setRatingFilter('all');
                                            setPriceFilter('all');
                                        }}
                                        className="w-full bg-gray-100 text-gray-700 py-2.5 lg:py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-xs lg:text-sm font-medium flex items-center justify-center mt-4"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Reset All Filters
                                    </button>
                                </div>
                            </div>

                            {/* Mobile overlay to close filters when clicking outside */}
                            {isFiltersOpen && (
                                <button
                                    onClick={() => setIsFiltersOpen(false)}
                                    aria-label="Close filters overlay"
                                    className="fixed inset-0 bg-black/30 lg:hidden z-40"
                                />
                            )}

                            {/* Main Content */}
                            <div className="flex-1">
                                {/* Results count */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                    <p className="text-sm sm:text-base text-gray-600">
                                        Showing <span className="font-semibold">{startIndex + 1}-{Math.min(endIndex, filteredPackages.length)}</span> of <span className="font-semibold">{filteredPackages.length}</span> results
                                    </p>
                                    <div className="flex items-center text-sm text-gray-500 w-full sm:w-auto">
                                        <span className="mr-2 whitespace-nowrap">Sort by:</span>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                                            className="bg-white border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto text-sm"
                                        >
                                            <option value="rating-desc">Recommended</option>
                                            <option value="price-asc">Price: Low to High</option>
                                            <option value="price-desc">Price: High to Low</option>
                                            <option value="duration-asc">Duration: Short to Long</option>
                                            <option value="duration-desc">Duration: Long to Short</option>
                                        </select>
                                    </div>
                                </div>

                                {filteredPackages.length > 0 ? (
                                    <div className="space-y-6">
                                        {paginatedPackages.map((pkg, index) => (
                                            <div key={pkg._id || index} data-item-type="package" className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group">
                                                <div className="flex flex-col md:flex-row h-full">
                                                    <div className="relative w-full md:w-80 overflow-hidden shadow-sm h-48 sm:h-56 md:h-auto md:aspect-[16/9] flex-shrink-0">
                                                        {getImageUrl(pkg.images?.[0]) ? (
                                                            <Image
                                                                src={getImageUrl(pkg.images?.[0])!}
                                                                alt={pkg.title || `Travel package to ${pkg.destination || 'destination'}`}
                                                                width={320}
                                                                height={180}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                <div className="text-center text-gray-500">
                                                                    <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-sm">Image unavailable</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        <div className="absolute top-3 right-3 flex flex-col items-end space-y-2">
                                                            <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center shadow-sm">
                                                                <span className="text-amber-500 mr-1">
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                    </svg>
                                                                </span>
                                                                <span className="text-gray-700 text-xs font-medium">{pkg.rating || 4.5}</span>
                                                            </div>
                                                            
                                                            <div className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-lg font-medium">
                                                                {pkg.category}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 p-6 flex flex-col">
                                                        <div className="mb-4">
                                                            <div className="flex items-center text-gray-500 text-sm mb-2">
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                {pkg.destination}
                                                            </div>
                                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{pkg.title}</h3>
                                                            <div className="flex items-center text-gray-500 text-sm mb-3">
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <span>{pkg.duration}</span>
                                                            </div>
                                                        </div>

                                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">{pkg.shortDescription || pkg.description}</p>

                                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                                            <div>
                                                                <div className="text-[11px] uppercase tracking-wider text-gray-500">Starting from</div>
                                                                <div className="flex items-baseline text-gray-900">
                                                                    <span className="mr-1 text-sm text-gray-600">₹</span>
                                                                    <span className="text-xl md:text-2xl font-semibold tracking-tight tabular-nums">{(pkg.price || 0).toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <a
                                                                    href={category.toLowerCase() === 'popular destinations' ? `/destinations/${pkg.slug || pkg._id}` : `/itinerary/${pkg.slug || pkg._id}`}
                                                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:cursor-pointer text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow-lg text-sm"
                                                                >
                                                                    View Details
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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
                                    <div className="text-center py-16 bg-white rounded-2xl shadow-md">
                                        <div className="text-gray-300 text-6xl mb-4">🏔️</div>
                                        <h3 className="text-xl font-semibold text-gray-600 mb-3">No packages found</h3>
                                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                                            We couldn't find any packages matching your filters.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSortBy('rating-desc');
                                                setPriceRange([0, 100000]);
                                                setDurationFilter('all');
                                                setDestinationFilter('all');
                                                setRatingFilter('all');
                                                setPriceFilter('all');
                                            }}
                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Suggestions Section */}
                        {suggestions.length > 0 && (
                            <div className="mt-16 pb-10">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
                                        You Might Also Like
                                    </h2>
                                    <p className="text-gray-600">
                                        Discover other amazing places to visit
                                    </p>
                                </div>
                                
                                {/* Mobile: Horizontal scrollable container */}
                                <div className="lg:hidden">
                                    <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory">
                                        {suggestions.map((suggestion, index) => (
                                            <div
                                                key={`suggestion-${suggestion._id || index}`}
                                                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group flex-shrink-0 w-80 flex flex-col snap-start"
                                            >
                                                <div className="relative overflow-hidden h-48">
                                                    {getImageUrl(suggestion.image) ? (
                                                        <Image
                                                            src={getImageUrl(suggestion.image)!}
                                                            alt={suggestion.name}
                                                            width={320}
                                                            height={180}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                            <div className="text-center text-gray-500">
                                                                <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                                <span className="text-sm">Image unavailable</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="absolute top-3 right-3 flex flex-col items-end space-y-2">
                                                        <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center shadow-sm">
                                                            <span className="text-amber-500 mr-1">
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                            </span>
                                                            <span className="text-gray-700 text-xs font-medium">{suggestion.rating || 4.5}</span>
                                                        </div>
                                                        
                                                        <div className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-lg font-medium">
                                                            {suggestion.location}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                                        <div className="text-white text-xs opacity-90 mb-1 flex items-center">
                                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {suggestion.location}
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-white">{suggestion.name}</h3>
                                                    </div>
                                                </div>

                                                <div className="p-4 flex-1 flex flex-col">
                                                    <div className="flex items-center text-gray-500 text-sm mb-3">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>{suggestion.duration || 'Contact for duration'}</span>
                                                    </div>

                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">{suggestion.shortDescription || suggestion.description}</p>

                                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                                                        <div>
                                                            <div className="text-xs text-gray-500">Starting from</div>
                                                            <div className="text-lg font-semibold text-gray-900">
                                                                ₹{suggestion.price?.toLocaleString() || 'Contact for price'}
                                                            </div>
                                                        </div>
                                                        <a
                                                            href={`/destinations/${suggestion.slug || suggestion._id}`}
                                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium flex items-center"
                                                        >
                                                            Explore
                                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                            </svg>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Desktop: Carousel with navigation */}
                                <div className="hidden lg:block">
                                    {/* Navigation controls above carousel */}
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Explore More Destinations</h3>
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={prevSlide}
                                                disabled={currentSlide === 0}
                                                className="bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed border border-gray-200 hover:border-gray-300"
                                                aria-label="Previous suggestions"
                                            >
                                                <ChevronLeft className="w-5 h-5 text-gray-700" />
                                            </button>
                                            
                                            <button
                                                type="button"
                                                onClick={nextSlide}
                                                disabled={currentSlide >= suggestions.length - 3}
                                                className="bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed border border-gray-200 hover:border-gray-300"
                                                aria-label="Next suggestions"
                                            >
                                                <ChevronRight className="w-5 h-5 text-gray-700" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Carousel container */}
                                    <div className="overflow-hidden">
                                        <div 
                                            className="flex transition-transform duration-500 ease-in-out gap-6"
                                            style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
                                        >
                                            {suggestions.map((suggestion, index) => (
                                                <div
                                                    key={suggestion._id}
                                                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group h-full flex flex-col flex-shrink-0 w-1/3"
                                                >
                                                    <div className="relative aspect-[16/9] overflow-hidden">
                                                        {getImageUrl(suggestion.image) ? (
                                                            <Image
                                                                src={getImageUrl(suggestion.image)!}
                                                                alt={suggestion.name}
                                                                width={400}
                                                                height={225}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                <div className="text-center text-gray-500">
                                                                    <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-sm">Image unavailable</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        <div className="absolute top-3 right-3 flex flex-col items-end space-y-2">
                                                            <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center shadow-sm">
                                                                <span className="text-amber-500 mr-1">
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                    </svg>
                                                                </span>
                                                                <span className="text-gray-700 text-xs font-medium">{suggestion.rating || 4.5}</span>
                                                            </div>
                                                            
                                                            <div className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-lg font-medium">
                                                                {suggestion.location}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                                            <div className="text-white text-xs opacity-90 mb-1 flex items-center">
                                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                {suggestion.location}
                                                            </div>
                                                            <h3 className="text-lg font-semibold text-white">{suggestion.name}</h3>
                                                        </div>
                                                    </div>

                                                    <div className="p-4 flex-1 flex flex-col">
                                                        <div className="flex items-center text-gray-500 text-sm mb-3">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span>{suggestion.duration || 'Contact for duration'}</span>
                                                        </div>

                                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">{suggestion.shortDescription || suggestion.description}</p>

                                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                                                            <div>
                                                                <div className="text-xs text-gray-500">Starting from</div>
                                                                <div className="text-lg font-semibold text-gray-900">
                                                                    ₹{suggestion.price?.toLocaleString() || 'Contact for price'}
                                                                </div>
                                                            </div>
                                                            <a
                                                                href={`/destinations/${suggestion.slug || suggestion._id}`}
                                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium flex items-center"
                                                            >
                                                                Explore
                                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                                </svg>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Carousel indicators */}
                                    {suggestions.length > 3 && (
                                        <div className="flex justify-center mt-6 space-x-2">
                                            {Array.from({ length: Math.max(0, suggestions.length - 2) }, (_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentSlide(index)}
                                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                                        currentSlide === index 
                                                            ? 'bg-blue-600 w-8' 
                                                            : 'bg-gray-300 hover:bg-gray-400'
                                                    }`}
                                                    aria-label={`Go to slide ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
