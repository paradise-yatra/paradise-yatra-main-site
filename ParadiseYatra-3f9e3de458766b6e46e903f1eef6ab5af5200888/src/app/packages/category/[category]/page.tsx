"use client";

import { Suspense, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { LazyHeader } from '@/components/lazy-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Clock, Heart, Filter, SortAsc, SortDesc, Grid, List, ChevronDown, Check, ChevronLeft, ChevronRight, X, ArrowRight } from 'lucide-react';
import Loading from '@/components/ui/loading';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { packagesAPI } from '@/lib/api';
import { Package } from '@/types/package';
import { Destination } from '@/types/destination';
import { urlToCategory } from '@/lib/categoryUtils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
        const days = nightsDaysMatch[1];
        const nights = nightsDaysMatch[2];
        return `${days} Days, ${nights} Nights`;
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
                onClick={() => handlePageChange(currentPage + 1)}
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
    const [mobileSuggestionIndex, setMobileSuggestionIndex] = useState(0);
    const prevSlideRef = useRef(0);
    const [newCardIndex, setNewCardIndex] = useState<number | null>(null);
    const mobileScrollRef = useRef<HTMLDivElement>(null);
    const isScrollingProgrammatically = useRef(false);
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

    // Carousel navigation functions - shift one by one
    const nextSlide = () => {
        if (currentSlide < suggestions.length - 5) {
            prevSlideRef.current = currentSlide;
            setNewCardIndex(4); // New card appears at rightmost position (index 4)
            setCurrentSlide(currentSlide + 1);
        }
    };

    // Calculate total desktop dots
    const totalDesktopDots = Math.max(0, suggestions.length - 4);

    const prevSlide = () => {
        if (currentSlide > 0) {
            prevSlideRef.current = currentSlide;
            setNewCardIndex(0); // New card appears at leftmost position (index 0)
            setCurrentSlide(currentSlide - 1);
        }
    };

    // Handle dot click for desktop suggestions
    const handleDesktopDotClick = (index: number) => {
        if (index === currentSlide) return;
        setNewCardIndex(index < currentSlide ? 0 : 4);
        setCurrentSlide(index);
    };

    // Handle dot click for mobile suggestions
    const handleMobileDotClick = (index: number) => {
        if (mobileScrollRef.current) {
            const container = mobileScrollRef.current;
            const itemElement = container.firstElementChild as HTMLElement;
            if (itemElement) {
                const itemWidth = itemElement.offsetWidth + 16; // 16px gap
                isScrollingProgrammatically.current = true;

                container.scrollTo({
                    left: index * itemWidth,
                    behavior: 'smooth'
                });

                setMobileSuggestionIndex(index);

                // Reset the flag after scroll animation completes
                setTimeout(() => {
                    isScrollingProgrammatically.current = false;
                }, 500);
            }
        }
    };

    // Mobile scroll handler for suggestions
    useEffect(() => {
        if (!mobileScrollRef.current) return;

        const container = mobileScrollRef.current;
        let scrollTimeout: NodeJS.Timeout;

        const handleScroll = () => {
            if (isScrollingProgrammatically.current) return;

            clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(() => {
                const scrollLeft = container.scrollLeft;
                const itemElement = container.firstElementChild as HTMLElement;

                if (itemElement) {
                    const itemWidth = itemElement.offsetWidth + 16; // 16px gap
                    const newIndex = Math.round(scrollLeft / itemWidth);

                    if (newIndex !== mobileSuggestionIndex && newIndex >= 0 && newIndex < suggestions.length) {
                        setMobileSuggestionIndex(newIndex);
                    }
                }
            }, 50);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            container.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [mobileSuggestionIndex, suggestions.length]);

    // Clear newCardIndex after animation completes
    useEffect(() => {
        if (newCardIndex !== null) {
            const timer = setTimeout(() => {
                setNewCardIndex(null);
                prevSlideRef.current = currentSlide;
            }, 400); // After animation completes
            return () => clearTimeout(timer);
        }
    }, [newCardIndex, currentSlide]);

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
        <div className="min-h-screen bg-slate-50">
            <LazyHeader />
            <div className="pt-20 md:pt-28">
                <Suspense fallback={<PackagesLoadingSkeleton />}>
                    {/* Header Section */}
                    <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto text-center">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
                                {formatCategoryTitle(category)} Packages
                            </h1>
                            <p className="text-md sm:text-xl !text-slate-600 max-w-3xl mx-auto">
                                Discover amazing destinations around the world with our handpicked collection of premium travel packages
                            </p>
                        </div>
                    </section>

                    {/* Main Content */}
                    <section className="py-8 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto">
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
                                    <Card className="sticky top-24 flex flex-col h-[calc(100vh-8rem)] border border-slate-200 shadow-sm">
                                        <div className="p-6 pb-4 flex-shrink-0">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-6 bg-blue-600 rounded"></div>
                                                <h2 className="!text-xl font-bold text-slate-900">Filters</h2>
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto px-6">
                                            {/* Rating Filter */}
                                            <div className="mb-6">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-1 h-4 bg-blue-600 rounded"></div>
                                                    <Label className="text-sm font-semibold text-slate-700">RATING</Label>
                                                </div>
                                                <RadioGroup value={ratingFilter} onValueChange={(value) => setRatingFilter(value)}>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="all" id="rating-any" />
                                                            <Label htmlFor="rating-any" className="text-sm text-slate-600 cursor-pointer">Any</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="4.5" id="rating-4.5" />
                                                            <Label htmlFor="rating-4.5" className="text-sm text-slate-600 cursor-pointer">4.5+</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="4.0" id="rating-4.0" />
                                                            <Label htmlFor="rating-4.0" className="text-sm text-slate-600 cursor-pointer">4.0+</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="3.5" id="rating-3.5" />
                                                            <Label htmlFor="rating-3.5" className="text-sm text-slate-600 cursor-pointer">3.5+</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="3.0" id="rating-3.0" />
                                                            <Label htmlFor="rating-3.0" className="text-sm text-slate-600 cursor-pointer">3.0+</Label>
                                                        </div>
                                                    </div>
                                                </RadioGroup>
                                            </div>

                                            {/* Duration Filter */}
                                            <div className="mb-6">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-1 h-4 bg-blue-600 rounded"></div>
                                                    <Label className="text-sm font-semibold text-slate-700">DURATION</Label>
                                                </div>
                                                <RadioGroup value={durationFilter} onValueChange={(value) => setDurationFilter(value)}>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="all" id="duration-any" />
                                                            <Label htmlFor="duration-any" className="text-sm text-slate-600 cursor-pointer">Any</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="1-3" id="duration-1-3" />
                                                            <Label htmlFor="duration-1-3" className="text-sm text-slate-600 cursor-pointer">1-3 Days</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="4-6" id="duration-4-6" />
                                                            <Label htmlFor="duration-4-6" className="text-sm text-slate-600 cursor-pointer">4-6 Days</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="7-9" id="duration-7-9" />
                                                            <Label htmlFor="duration-7-9" className="text-sm text-slate-600 cursor-pointer">7-9 Days</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="10-12" id="duration-10-12" />
                                                            <Label htmlFor="duration-10-12" className="text-sm text-slate-600 cursor-pointer">10-12 Days</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="13+" id="duration-13+" />
                                                            <Label htmlFor="duration-13+" className="text-sm text-slate-600 cursor-pointer">13+ Days</Label>
                                                        </div>
                                                    </div>
                                                </RadioGroup>
                                            </div>

                                            {/* Price Filter */}
                                            <div className="mb-6">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-1 h-4 bg-blue-600 rounded"></div>
                                                    <Label className="text-sm font-semibold text-slate-700">PRICE</Label>
                                                </div>
                                                <RadioGroup value={priceFilter} onValueChange={(value) => setPriceFilter(value)}>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="all" id="price-any" />
                                                            <Label htmlFor="price-any" className="text-sm text-slate-600 cursor-pointer">Any</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="0-1000" id="price-0-1000" />
                                                            <Label htmlFor="price-0-1000" className="text-sm text-slate-600 cursor-pointer">₹ 0 - ₹ 1,000</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="1000-2500" id="price-1000-2500" />
                                                            <Label htmlFor="price-1000-2500" className="text-sm text-slate-600 cursor-pointer">₹ 1,000 - ₹ 2,500</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="2500-5000" id="price-2500-5000" />
                                                            <Label htmlFor="price-2500-5000" className="text-sm text-slate-600 cursor-pointer">₹ 2,500 - ₹ 5,000</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="5000+" id="price-5000+" />
                                                            <Label htmlFor="price-5000+" className="text-sm text-slate-600 cursor-pointer">₹ 5,000+</Label>
                                                        </div>
                                                    </div>
                                                </RadioGroup>
                                            </div>

                                            {/* Destination Filter */}
                                            {destinations.length > 0 && (
                                                <div className="mb-6">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="w-1 h-4 bg-blue-600 rounded"></div>
                                                        <Label className="text-sm font-semibold text-slate-700">DESTINATION</Label>
                                                    </div>
                                                    <RadioGroup value={destinationFilter} onValueChange={(value) => setDestinationFilter(value)}>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="all" id="destination-any" />
                                                                <Label htmlFor="destination-any" className="text-sm text-slate-600 cursor-pointer">Any</Label>
                                                            </div>
                                                            {destinations.map((dest) => (
                                                                <div key={dest} className="flex items-center space-x-2">
                                                                    <RadioGroupItem value={dest} id={`destination-${dest}`} />
                                                                    <Label htmlFor={`destination-${dest}`} className="text-sm text-slate-600 cursor-pointer">{dest}</Label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </RadioGroup>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 pt-4 flex-shrink-0 border-t border-slate-200">
                                            <Button 
                                                variant="outline" 
                                                className="w-full"
                                                onClick={() => {
                                                    setSortBy('rating-desc');
                                                    setPriceRange([0, 100000]);
                                                    setDurationFilter('all');
                                                    setDestinationFilter('all');
                                                    setRatingFilter('all');
                                                    setPriceFilter('all');
                                                }}
                                            >
                                                Clear All Filters
                                            </Button>
                                        </div>
                                    </Card>
                                </aside>

                                {/* Packages List */}
                                <div className="flex-1">
                                    {/* Sort and Count Header */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                        <p className="text-sm !text-slate-600">
                                            Showing {startIndex + 1}-{Math.min(endIndex, filteredPackages.length)} of {filteredPackages.length} results
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-slate-600">Sort by:</span>
                                            <Select 
                                                value={sortBy === 'rating-desc' ? 'recommended' : sortBy === 'price-asc' ? 'price-low' : sortBy === 'price-desc' ? 'price-high' : sortBy === 'duration-asc' ? 'duration' : 'recommended'} 
                                                onValueChange={(value) => {
                                                    if (value === 'recommended') setSortBy('rating-desc');
                                                    else if (value === 'price-low') setSortBy('price-asc');
                                                    else if (value === 'price-high') setSortBy('price-desc');
                                                    else if (value === 'rating') setSortBy('rating-desc');
                                                    else if (value === 'duration') setSortBy('duration-asc');
                                                }}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Sort by" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="recommended">Recommended</SelectItem>
                                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                                    <SelectItem value="rating">Highest Rated</SelectItem>
                                                    <SelectItem value="duration">Duration</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Package Cards List */}
                                    {filteredPackages.length > 0 ? (
                                        <div className="space-y-6">
                                            {paginatedPackages.map((pkg, index) => (
                                                <Card key={pkg._id || index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                                                    <Link href={category.toLowerCase() === 'popular destinations' ? `/destinations/${pkg.slug || pkg._id}` : `/itinerary/${pkg.slug || pkg._id}`} className="block">
                                                        <div className="flex flex-col md:flex-row">
                                                            {/* Image */}
                                                            <div className="relative w-full md:w-80 h-48 md:h-auto overflow-hidden flex-shrink-0" style={{ minHeight: '200px' }}>
                                                                {getImageUrl(pkg.images?.[0]) ? (
                                                                    <Image
                                                                        src={getImageUrl(pkg.images?.[0])!}
                                                                        alt={pkg.title || `Travel package to ${pkg.destination || 'destination'}`}
                                                                        width={320}
                                                                        height={200}
                                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
                            
                                                                <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                                    <span className="text-white text-sm font-semibold">{pkg.rating || 4.5}</span>
                                                                </div>
                                                            </div>

                                                            {/* Content */}
                                                            <div className="flex-1 p-4 md:p-6">
                                                                <div className="flex items-start gap-3 mb-2">
                                                                    <div className="flex items-center gap-1 text-slate-600 text-sm">
                                                                        <MapPin className="h-4 w-4" />
                                                                        <span>{pkg.destination}</span>
                                                                    </div>
                                                                </div>
                                                                
                                                                <h3 className="!text-xl md:text-2xl !font-bold text-slate-900 mb-2">
                                                                    {pkg.title}
                                                                </h3>
                                                                
                                                                <div className="flex items-center gap-2 mb-2">
                                                                <div className="flex items-center gap-1 text-slate-600">
                                                                    <Clock className="h-4 w-4" />
                                                                    <span className="text-sm">
                                                                        {formatDurationDisplay(pkg.duration || '')}
                                                                    </span>
                                                                </div>
                                                                </div>

                                                                <p className="!text-slate-600 text-sm mb-3 line-clamp-2">
                                                                    {pkg.shortDescription || pkg.description || `Discover ${pkg.destination}, a beautiful destination with amazing experiences and unforgettable memories.`}
                                                                </p>

                                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                                                    <div>
                                                                        <p className="text-xs !text-slate-500 mb-1">STARTING FROM</p>
                                                                        <p className="!text-xl md:text-2xl !font-bold !text-blue-600">₹ {(pkg.price || 0).toLocaleString()}</p>
                                                                    </div>
                                                                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm">
                                                                        View Details
                                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </Card>
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
                        </div>
                    </section>

                    {/* You Might Also Like Section */}
                    {suggestions.length > 0 && (
                        <section className="py-16 bg-slate-50 px-4 sm:px-6 lg:px-8">
                            <div className="max-w-7xl mx-auto">
                                <div className="text-center mb-12">
                                    <h2 className="!text-3xl sm:text-4xl !font-bold !text-slate-900 mb-4">
                                        You Might Also Like
                                    </h2>
                                    <p className="text-md md:text-lg !text-slate-600 max-w-2xl mx-auto">
                                        Explore more amazing destinations and create unforgettable memories
                                    </p>
                                </div>
                                
                                {/* Mobile: Horizontal scrollable container */}
                                <div className="lg:hidden">
                                    <div 
                                        ref={mobileScrollRef}
                                        className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory"
                                        style={{ scrollBehavior: 'smooth' }}
                                    >
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
                                                        <h3 className="text-lg !font-semibold text-white">{formatCategoryTitle(suggestion.name || '')}</h3>
                                                    </div>
                                                </div>

                                                <div className="p-4 flex-1 flex flex-col">
                                                    <div className="flex items-center !text-gray-500 !text-sm mb-3">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>
                                                            {suggestion.duration
                                                                ? formatDurationDisplay(suggestion.duration)
                                                                : 'Contact for duration'}
                                                        </span>
                                                    </div>

                                                    <p className="!text-gray-600 !text-sm mb-4 line-clamp-2 leading-relaxed flex-1">{suggestion.shortDescription || suggestion.description}</p>

                                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                                                        <div>
                                                            <div className="!text-xs !text-gray-500">Starting from</div>
                                                            <div className="!text-lg !font-semibold !text-gray-900">
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

                                    {/* Mobile Dot Pagination */}
                                    {suggestions.length > 1 && (
                                        <div className="flex justify-center items-center gap-2 mt-3">
                                            {suggestions.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleMobileDotClick(index)}
                                                    className={`pagination-dot ${mobileSuggestionIndex === index ? 'mobile-active' : ''}`}
                                                    aria-label={`Go to suggestion ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Desktop: 5 cards grid with pagination */}
                                <div className="hidden lg:block">
                                    <style jsx global>{`
                                        @keyframes fadeInSoft {
                                            from { opacity: 0; transform: translateY(10px); }
                                            to { opacity: 1; transform: translateY(0); }
                                        }
                                        .card-new {
                                            animation: fadeInSoft 0.4s ease-out;
                                        }
                                        .pagination-dot {
                                            width: 8px;
                                            height: 8px;
                                            border-radius: 50%;
                                            background-color: #cbd5e1;
                                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                                            cursor: pointer;
                                            border: none;
                                        }
                                        .pagination-dot.active {
                                            background-color: #3b82f6;
                                            width: 24px;
                                            border-radius: 4px;
                                        }
                                        .pagination-dot.mobile-active {
                                            background-color: #3b82f6;
                                            width: 20px;
                                            border-radius: 4px;
                                        }
                                    `}</style>
                                    
                                    {/* Navigation controls above carousel */}
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Explore More Destinations</h3>
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={prevSlide}
                                                disabled={currentSlide === 0}
                                                className="bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed border border-gray-200 hover:border-gray-300"
                                                aria-label="Previous"
                                            >
                                                <ChevronLeft className="w-5 h-5 text-gray-700" />
                                            </button>
                                            
                                            <button
                                                type="button"
                                                onClick={nextSlide}
                                                disabled={currentSlide >= suggestions.length - 5}
                                                className="bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed border border-gray-200 hover:border-gray-300"
                                                aria-label="Next"
                                            >
                                                <ChevronRight className="w-5 h-5 text-gray-700" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Grid container - no transition animation, instant shift */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                        {suggestions.slice(currentSlide, currentSlide + 5).map((suggestion, index) => {
                                            // Determine if this is a new card (appearing for the first time)
                                            const isNewCard = newCardIndex === index;
                                            
                                            return (
                                                <Card
                                                    key={`${suggestion._id || suggestion.name}-${currentSlide}-${index}`}
                                                    className={`overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group ${isNewCard ? 'card-new' : ''}`}
                                                >
                                                    <Link href={`/destinations/${suggestion.slug || suggestion._id}`} className="block">
                                                        <div className="relative h-40 overflow-hidden">
                                                            {getImageUrl(suggestion.image) ? (
                                                                <Image
                                                                    src={getImageUrl(suggestion.image)!}
                                                                    alt={suggestion.name}
                                                                    width={320}
                                                                    height={160}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                    <span className="text-sm text-gray-500">No image</span>
                                                                </div>
                                                            )}
                                                            {/* Location pill top-right, like mobile layout */}
                                                            <div className="absolute top-2 right-2">
                                                                <div className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-lg font-medium">
                                                                    {suggestion.location}
                                                                </div>
                                                            </div>
                                                            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                                <span className="text-white text-xs font-semibold">{suggestion.rating || 4.5}</span>
                                                            </div>
                                                        </div>
                                                        <div className="p-3">
                                                            <h3 className="!text-base !font-bold !text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                                {formatCategoryTitle(suggestion.name || '')}
                                                            </h3>
                                                            
                                                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="h-3 w-3" />
                                                                    <span className="truncate">{suggestion.location}</span>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="text-xs text-slate-500">Starting from</div>
                                                                    <div className="text-lg font-semibold text-slate-900">
                                                                        ₹{(suggestion.price || 0).toLocaleString()}
                                                                    </div>
                                                                </div>
                                                                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs px-2 py-1 h-auto">
                                                                      Explore
                                                                    <ChevronRight className="ml-1 h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </Card>
                                            );
                                        })}
                                    </div>

                                    {/* Desktop Dot Pagination */}
                                    {totalDesktopDots > 1 && (
                                        <div className="flex justify-center items-center gap-2 mt-8">
                                            {Array.from({ length: totalDesktopDots }).map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleDesktopDotClick(index)}
                                                    className={`pagination-dot ${currentSlide === index ? 'active' : ''}`}
                                                    aria-label={`Go to page ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Mobile Filter Dialog */}
                        <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                            <DialogContent className="max-w-md max-h-[80vh] flex flex-col p-0">
                                <DialogHeader className="p-6 pb-4 flex-shrink-0 border-b">
                                    <div className="flex items-center justify-between">
                                        <DialogTitle className="flex items-center gap-2">
                                            <div className="w-1 h-6 bg-blue-600 rounded"></div>
                                            <span className='text-black'>Filters</span>
                                        </DialogTitle>
                                        <Button variant="ghost" size="sm" onClick={() => setIsFiltersOpen(false)}>
                                            <X className="h-4 w-4 text-black" />
                                        </Button>
                                    </div>
                                </DialogHeader>
                                
                                <div className="flex-1 overflow-y-auto px-6 pt-4">
                                    {/* Rating Filter */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-1 h-4 bg-blue-600 rounded"></div>
                                            <Label className="text-sm font-semibold text-slate-700">RATING</Label>
                                        </div>
                                        <RadioGroup value={ratingFilter} onValueChange={(value) => setRatingFilter(value)}>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="all" id="mobile-rating-any" />
                                                    <Label htmlFor="mobile-rating-any" className="text-sm text-slate-600 cursor-pointer">Any</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="4.5" id="mobile-rating-4.5" />
                                                    <Label htmlFor="mobile-rating-4.5" className="text-sm text-slate-600 cursor-pointer">4.5+</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="4.0" id="mobile-rating-4.0" />
                                                    <Label htmlFor="mobile-rating-4.0" className="text-sm text-slate-600 cursor-pointer">4.0+</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="3.5" id="mobile-rating-3.5" />
                                                    <Label htmlFor="mobile-rating-3.5" className="text-sm text-slate-600 cursor-pointer">3.5+</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="3.0" id="mobile-rating-3.0" />
                                                    <Label htmlFor="mobile-rating-3.0" className="text-sm text-slate-600 cursor-pointer">3.0+</Label>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {/* Duration Filter */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-1 h-4 bg-blue-600 rounded"></div>
                                            <Label className="text-sm font-semibold text-slate-700">DURATION</Label>
                                        </div>
                                        <RadioGroup value={durationFilter} onValueChange={(value) => setDurationFilter(value)}>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="all" id="mobile-duration-any" />
                                                    <Label htmlFor="mobile-duration-any" className="text-sm text-slate-600 cursor-pointer">Any</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="1-3" id="mobile-duration-1-3" />
                                                    <Label htmlFor="mobile-duration-1-3" className="text-sm text-slate-600 cursor-pointer">1-3 Days</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="4-6" id="mobile-duration-4-6" />
                                                    <Label htmlFor="mobile-duration-4-6" className="text-sm text-slate-600 cursor-pointer">4-6 Days</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="7-9" id="mobile-duration-7-9" />
                                                    <Label htmlFor="mobile-duration-7-9" className="text-sm text-slate-600 cursor-pointer">7-9 Days</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="10-12" id="mobile-duration-10-12" />
                                                    <Label htmlFor="mobile-duration-10-12" className="text-sm text-slate-600 cursor-pointer">10-12 Days</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="13+" id="mobile-duration-13+" />
                                                    <Label htmlFor="mobile-duration-13+" className="text-sm text-slate-600 cursor-pointer">13+ Days</Label>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {/* Price Filter */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-1 h-4 bg-blue-600 rounded"></div>
                                            <Label className="text-sm font-semibold text-slate-700">PRICE</Label>
                                        </div>
                                        <RadioGroup value={priceFilter} onValueChange={(value) => setPriceFilter(value)}>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="all" id="mobile-price-any" />
                                                    <Label htmlFor="mobile-price-any" className="text-sm text-slate-600 cursor-pointer">Any</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="0-1000" id="mobile-price-0-1000" />
                                                    <Label htmlFor="mobile-price-0-1000" className="text-sm text-slate-600 cursor-pointer">₹ 0 - ₹ 1,000</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="1000-2500" id="mobile-price-1000-2500" />
                                                    <Label htmlFor="mobile-price-1000-2500" className="text-sm text-slate-600 cursor-pointer">₹ 1,000 - ₹ 2,500</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="2500-5000" id="mobile-price-2500-5000" />
                                                    <Label htmlFor="mobile-price-2500-5000" className="text-sm text-slate-600 cursor-pointer">₹ 2,500 - ₹ 5,000</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="5000+" id="mobile-price-5000+" />
                                                    <Label htmlFor="mobile-price-5000+" className="text-sm text-slate-600 cursor-pointer">₹ 5,000+</Label>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {/* Destination Filter */}
                                    {destinations.length > 0 && (
                                        <div className="mb-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-1 h-4 bg-blue-600 rounded"></div>
                                                <Label className="text-sm font-semibold text-slate-700">DESTINATION</Label>
                                            </div>
                                            <RadioGroup value={destinationFilter} onValueChange={(value) => setDestinationFilter(value)}>
                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="all" id="mobile-destination-any" />
                                                        <Label htmlFor="mobile-destination-any" className="text-sm text-slate-600 cursor-pointer">Any</Label>
                                                    </div>
                                                    {destinations.map((dest) => (
                                                        <div key={dest} className="flex items-center space-x-2">
                                                            <RadioGroupItem value={dest} id={`mobile-destination-${dest}`} />
                                                            <Label htmlFor={`mobile-destination-${dest}`} className="text-sm text-slate-600 cursor-pointer">{dest}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 pt-4 flex-shrink-0 border-t border-slate-200 flex gap-3 text-black">
                                    <Button 
                                        variant="outline" 
                                        className="flex-1"
                                        onClick={() => {
                                            setSortBy('rating-desc');
                                            setPriceRange([0, 100000]);
                                            setDurationFilter('all');
                                            setDestinationFilter('all');
                                            setRatingFilter('all');
                                            setPriceFilter('all');
                                        }}
                                    >
                                        Clear All
                                    </Button>
                                    <Button 
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                                        onClick={() => setIsFiltersOpen(false)}
                                    >
                                        Apply Filters
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </Suspense>
            </div>
        </div>
    );
}
