"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Calendar, DollarSign, Plane, Star, Globe, TrendingUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface PackageSuggestion {
    id: string;
    title: string;
    destination: string;
    price: number;
    duration: string;
    category: string;
    slug: string;
    image: string | null;
    departureDate?: string;
    returnDate?: string;
    availableSeats?: number;
    totalSeats?: number;
    status?: string;
    description?: string;
    country?: string;
    region?: string;
    isFeatured?: boolean;
    type?: 'country' | 'package' | 'destination' | 'fixed-departure' | 'holiday-type' | 'location';
    iso2?: string;
    states?: Array<{
        id: number;
        name: string;
        state_code: string;
        latitude: number;
        longitude: number;
        type: string;
    }>;
    state?: string;
    tourType?: string;
}

interface SearchSuggestionsProps {
    query: string;
    onQueryChange: (query: string) => void;
    onSelect: (suggestion: PackageSuggestion) => void;
    isOpen: boolean;
    onClose: () => void;
    variant?: 'default' | 'hero';
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
};

const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
        'holiday': 'bg-gradient-to-r from-orange-500 to-red-500',
        'holiday-type': 'bg-gradient-to-r from-purple-500 to-pink-500',
        'fixed-departure': 'bg-gradient-to-r from-blue-500 to-cyan-500',
        'destination': 'bg-gradient-to-r from-green-500 to-emerald-500',
        'location': 'bg-gradient-to-r from-indigo-500 to-purple-500',
    };
    return colors[category] || 'bg-gradient-to-r from-gray-500 to-gray-600';
};

const SearchSuggestions = ({
    query,
    onQueryChange,
    onSelect,
    isOpen,
    onClose,
    variant = 'default'
}: SearchSuggestionsProps) => {
    const [suggestions, setSuggestions] = useState<PackageSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [error, setError] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const keepFocusedRef = useRef(false);
    const resultsContainerRef = useRef<HTMLDivElement>(null);

    const placeholderTexts = variant === 'hero'
        ? [
            "Where do you want to go?",
            "Explore Bali...",
            "Discover Europe...",
            "Visit Himachal Pradesh...",
            "Adventure in Ladakh...",
            "Relax in Goa...",
            "Experience Kerala...",
            "Journey to Kashmir..."
        ]
        : [
            "Search destinations, packages...",
            "Find your perfect trip...",
            "Discover amazing places...",
            "Plan your next adventure..."
        ];

    // Rotating placeholder effect
    useEffect(() => {
        if (!isFocused && !query.trim()) {
            const interval = setInterval(() => {
                setCurrentPlaceholder((prev) => (prev + 1) % placeholderTexts.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isFocused, query, placeholderTexts.length]);

    // Focus input when hero modal opens
    useEffect(() => {
        if (variant === 'hero' && isOpen && inputRef.current) {
            // Use a longer delay for mobile to ensure the modal is fully rendered
            const focusTimer = setTimeout(() => {
                inputRef.current?.focus();
                setIsFocused(true);
            }, 300);

            return () => clearTimeout(focusTimer);
        }
    }, [variant, isOpen]);

    const calculateDropdownPosition = useCallback(() => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY;

        const dropdownHeight = 400;
        const spaceBelow = viewportHeight - rect.bottom;

        let top = rect.bottom + scrollY + 12;
        let left = rect.left;
        const width = rect.width;

        if (spaceBelow < 100) {
            top = rect.top + scrollY - dropdownHeight - 12;
        }

        setDropdownPosition({ top, left, width });
    }, []);

    const fetchSuggestions = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const [packagesResponse, fixedDeparturesResponse, destinationsResponse, holidayTypesResponse] = await Promise.all([
                fetch(`/api/packages/suggest?q=${encodeURIComponent(searchQuery)}`, { cache: 'no-store' }),
                fetch(`/api/fixed-departures/suggest?q=${encodeURIComponent(searchQuery)}`, { cache: 'no-store' }),
                fetch(`/api/destinations/suggest?q=${encodeURIComponent(searchQuery)}`, { cache: 'no-store' }),
                fetch(`/api/holiday-types/suggest?q=${encodeURIComponent(searchQuery)}`, { cache: 'no-store' })
            ]);

            const results = await Promise.all([
                packagesResponse.ok ? packagesResponse.json() : { suggestions: [] },
                fixedDeparturesResponse.ok ? fixedDeparturesResponse.json() : { suggestions: [] },
                destinationsResponse.ok ? destinationsResponse.json() : { suggestions: [] },
                holidayTypesResponse.ok ? holidayTypesResponse.json() : { suggestions: [] }
            ]);

            const allSuggestions = [
                ...(results[0].suggestions || []),
                ...(results[1].suggestions || []),
                ...(results[2].suggestions || []),
                ...(results[3].suggestions || [])
            ];

            const uniqueSuggestions = allSuggestions.reduce((acc: PackageSuggestion[], current: PackageSuggestion) => {
                const existingIndex = acc.findIndex(item => item.id === current.id);
                if (existingIndex === -1) {
                    acc.push(current);
                } else {
                    acc[existingIndex] = { ...acc[existingIndex], ...current };
                }
                return acc;
            }, []);

            const sortedSuggestions = uniqueSuggestions.sort((a: PackageSuggestion, b: PackageSuggestion) => {
                const categoryOrder = { 'holiday': 0, 'holiday-type': 1, 'fixed-departure': 2, 'destination': 3 };
                const aOrder = categoryOrder[a.category as keyof typeof categoryOrder] || 4;
                const bOrder = categoryOrder[b.category as keyof typeof categoryOrder] || 4;

                if (aOrder !== bOrder) {
                    return aOrder - bOrder;
                }

                return (a.price || 0) - (b.price || 0);
            });

            setSuggestions(sortedSuggestions.slice(0, 15));
        } catch (err) {
            console.error('Error fetching suggestions:', err);
            setError('Failed to load suggestions');
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (query.trim()) {
            timeoutRef.current = setTimeout(() => {
                fetchSuggestions(query);
            }, 300);
        } else {
            setSuggestions([]);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [query, fetchSuggestions]);

    useEffect(() => {
        setSelectedIndex(-1);
    }, [suggestions]);

    const isMobileDevice = () => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth < 640 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const isMobile = isMobileDevice();

        switch (e.key) {
            case 'ArrowDown':
                if (!isFocused || suggestions.length === 0) return;
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                if (!isFocused || suggestions.length === 0) return;
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (isMobile && query.trim()) {
                    // On mobile: close keyboard but keep results visible
                    keepFocusedRef.current = true; // Flag to keep results visible
                    setIsFocused(true); // Ensure results stay visible
                    if (inputRef.current) {
                        inputRef.current.blur();
                    }
                    // Fetch suggestions if not already loaded
                    if (suggestions.length === 0 && !isLoading) {
                        fetchSuggestions(query);
                    }
                    // Reset flag after a delay to allow normal blur behavior later
                    setTimeout(() => {
                        keepFocusedRef.current = false;
                    }, 300);
                } else if (isFocused && selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    // Desktop: select the highlighted suggestion
                    onSelect(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsFocused(false);
                if (inputRef.current) {
                    inputRef.current.blur();
                }
                onClose();
                break;
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };

        const handleResize = () => {
            if (isFocused) {
                calculateDropdownPosition();
            }
        };

        const handleScroll = () => {
            if (isFocused) {
                // Only close keyboard on scroll for non-hero variant
                const isMobile = isMobileDevice();
                if (isMobile && variant !== 'hero') {
                    closeMobileKeyboard();
                }

                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
                scrollTimeoutRef.current = setTimeout(() => {
                    calculateDropdownPosition();
                }, 16);
            }
        };

        if (isFocused) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('resize', handleResize);
            window.addEventListener('scroll', handleScroll, true);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll, true);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [isFocused, calculateDropdownPosition]);

    const closeMobileKeyboard = () => {
        const isMobile = isMobileDevice();
        if (isMobile && inputRef.current) {
            inputRef.current.blur();
        }
    };

    // Handle scroll on results container to close keyboard on mobile
    useEffect(() => {
        const resultsContainer = resultsContainerRef.current;
        if (!resultsContainer || variant === 'hero') return; // Don't attach these handlers for hero variant

        const handleResultsScroll = () => {
            const isMobile = isMobileDevice();
            if (isMobile && isFocused) {
                closeMobileKeyboard();
            }
        };

        resultsContainer.addEventListener('scroll', handleResultsScroll, { passive: true });
        resultsContainer.addEventListener('touchstart', handleResultsScroll, { passive: true });

        return () => {
            resultsContainer.removeEventListener('scroll', handleResultsScroll);
            resultsContainer.removeEventListener('touchstart', handleResultsScroll);
        };
    }, [isFocused, variant]);

    const handleSuggestionClick = (suggestion: PackageSuggestion) => {
        // Close keyboard on mobile when clicking a suggestion
        closeMobileKeyboard();

        if (suggestion.type === 'location' && suggestion.iso2) {
            window.location.href = `/packages?country=${encodeURIComponent(suggestion.destination)}`;
            return;
        }
        onSelect(suggestion);
    };

    const handleInputFocus = () => {
        setIsFocused(true);
        calculateDropdownPosition();
        setTimeout(() => {
            calculateDropdownPosition();
        }, 50);
    };

    const handleInputBlur = () => {
        setTimeout(() => {
            // Don't hide results if we're keeping focus (e.g., after pressing Enter on mobile)
            if (keepFocusedRef.current) {
                return;
            }
            // On mobile, if there are results and query, keep results visible even after blur
            const isMobile = isMobileDevice();
            if (isMobile && query.trim() && suggestions.length > 0) {
                // Keep results visible on mobile after blur
                return;
            }
            if (!containerRef.current?.contains(document.activeElement)) {
                setIsFocused(false);
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
            }
        }, 150);
    };

    const getInputClasses = () => {
        if (variant === 'hero') {
            return "w-full pl-12 sm:pl-12 pr-4 sm:pr-4 py-3.5 sm:py-2.5 text-base sm:text-sm bg-white rounded-md border border-gray-300 text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200";
        }
        return "w-full pl-11 pr-4 py-3.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200";
    };

    return (
        <div ref={containerRef} className="relative w-full ">
            {/* Only show search input in normal position for non-hero variant, or when hero is open */}
            {variant !== 'hero' && (
                <div className="relative group">
                    <div className={`absolute left-4 sm:left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${isFocused ? 'scale-110' : 'scale-100'}`}>
                        <Search className={`h-5 w-5 sm:h-5 sm:w-5 text-gray-400 transition-colors duration-300`} />
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={!isFocused && !query.trim() ? placeholderTexts[currentPlaceholder] : "Search destinations..."}
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className={getInputClasses()}
                    />
                </div>
            )}

            <AnimatePresence>
                {variant === 'hero' && isOpen && (
                    <>
                        {createPortal(
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="fixed inset-0 bg-white z-[99999] overflow-hidden"
                                onClick={(e) => {
                                    if (e.target === e.currentTarget) {
                                        onClose();
                                    }
                                }}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="fixed top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-50 text-slate-700 hover:text-slate-900 transition-all hover:rotate-90 duration-300 p-2"
                                    aria-label="Close search"
                                >
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Main Content */}
                                <main className="h-screen flex flex-col items-center justify-start pt-16 sm:pt-20 md:pt-24 lg:pt-[15vh] px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1, duration: 0.4 }}
                                        className="w-full max-w-2xl flex flex-col h-full"
                                    >
                                        {/* Heading */}
                                        <h1 className="!text-2xl sm:!text-3xl md:!text-4xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-slate-800 px-2 flex-shrink-0">
                                            Where is your next adventure?
                                        </h1>

                                        {/* Search Input */}
                                        <div className="relative mb-4 sm:mb-6 flex-shrink-0">
                                            <div className="absolute inset-y-0 left-3 sm:left-4 md:left-5 flex items-center pointer-events-none z-10">
                                                <Search className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                            </div>
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                placeholder="Search destinations..."
                                                value={query}
                                                onChange={(e) => onQueryChange(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                onFocus={() => setIsFocused(true)}
                                                onBlur={handleInputBlur}
                                                className="w-full pl-10 sm:pl-12 md:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 md:py-5 bg-white border-2 border-blue-600 rounded-xl sm:rounded-2xl text-base sm:text-lg md:text-xl shadow-lg shadow-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all placeholder:text-slate-400"
                                            />
                                        </div>

                                        {/* Results - Scrollable Container */}
                                        <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
                                            <div className="space-y-1 sm:space-y-1.5 pb-4">
                                                {/* Loading State */}
                                                {isLoading && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="flex flex-col items-center justify-center py-8 sm:py-12"
                                                    >
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-4 border-blue-200 border-t-blue-600"
                                                        />
                                                        <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-slate-600 font-medium">Searching amazing destinations...</p>
                                                    </motion.div>
                                                )}

                                                {/* Error State */}
                                                {error && (
                                                    <div className="text-center py-6 sm:py-8">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                                                            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                                                        </div>
                                                        <p className="text-xs sm:text-sm text-red-600 font-medium">{error}</p>
                                                    </div>
                                                )}

                                                {/* Suggested Destinations Header */}
                                                {!isLoading && !error && suggestions.length > 0 && (
                                                    <>
                                                        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1 sm:ml-2 mb-2 sm:mb-3 sticky top-0 bg-white py-2 z-10">
                                                            Suggested Destinations
                                                        </p>

                                                        {suggestions.map((suggestion, index) => (
                                                            <motion.div
                                                                key={suggestion.id}
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: index * 0.05 }}
                                                                className={`group flex items-center justify-between p-2.5 sm:p-3 md:p-4 bg-white hover:bg-blue-50 rounded-lg sm:rounded-xl cursor-pointer transition-all border-2 border-gray-100 hover:border-blue-200 ${selectedIndex === index ? 'bg-blue-50 border-blue-200' : ''
                                                                    }`}
                                                                onClick={() => handleSuggestionClick(suggestion)}
                                                                onMouseEnter={() => setSelectedIndex(index)}
                                                            >
                                                                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                                                                    {/* Image/Icon */}
                                                                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg overflow-hidden shadow-md ring-1 ring-gray-200">
                                                                        {suggestion.type === 'location' ? (
                                                                            <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                                                                                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                                            </div>
                                                                        ) : suggestion.image ? (
                                                                            <img
                                                                                src={suggestion.image}
                                                                                alt={suggestion.title}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center">
                                                                                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex-1 min-w-0">
                                                                        <span className="text-sm sm:text-base md:text-lg font-medium text-slate-800 truncate block">
                                                                            {suggestion.title}
                                                                        </span>
                                                                        {suggestion.type !== 'location' && (
                                                                            <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                                                                                <span className="text-[10px] sm:text-xs text-slate-500">{suggestion.duration}</span>
                                                                                <span className="text-[10px] sm:text-xs text-green-600 font-semibold">
                                                                                    {formatPrice(suggestion.price)}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {index === 0 && (
                                                                    <span className="text-[10px] sm:text-xs text-slate-400 group-hover:text-blue-600 transition-colors hidden sm:block whitespace-nowrap">
                                                                        Popular choice
                                                                    </span>
                                                                )}
                                                            </motion.div>
                                                        ))}
                                                    </>
                                                )}

                                                {/* No Results */}
                                                {!isLoading && !error && suggestions.length === 0 && query.trim() && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="text-center py-8 sm:py-12"
                                                    >
                                                        <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                                                            <Search className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                                                        </div>
                                                        <p className="text-sm sm:text-base font-semibold text-slate-700 mb-1 sm:mb-1.5 px-4">
                                                            No results found for "{query}"
                                                        </p>
                                                        <p className="text-xs sm:text-sm text-slate-500 px-4">
                                                            Try different keywords or explore our destinations
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                </main>

                                {/* Bottom Gradient Fade */}
                                <div className="fixed bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                            </motion.div>,
                            document.body
                        )}
                    </>
                )}

                {/* Non-hero variant dropdown */}
                {variant !== 'hero' && isFocused && (query.trim() || isLoading) && (
                    <>
                        {createPortal(
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 bg-black/10 z-[99999]"
                                onClick={() => setIsFocused(false)}
                            />,
                            document.body
                        )}

                        {createPortal(
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200 z-[999999] overflow-hidden"
                                style={{
                                    position: 'absolute',
                                    top: dropdownPosition.top,
                                    left: dropdownPosition.left,
                                    width: dropdownPosition.width,
                                    maxWidth: '100vw',
                                    zIndex: 999999
                                }}
                                onTouchStart={() => {
                                    // Close keyboard when touching the results dropdown on mobile
                                    closeMobileKeyboard();
                                }}
                            >
                                {/* Premium Header */}
                                {suggestions.length > 0 && !isLoading && (
                                    <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 border-b border-gray-200/50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <TrendingUp className="w-3 h-3 text-orange-600" />
                                                <span className="text-xs font-semibold text-gray-700">Top Results</span>
                                            </div>
                                            <span className="text-xs text-gray-500">{suggestions.length} found</span>
                                        </div>
                                    </div>
                                )}

                                {isLoading && (
                                    <div className="p-6 sm:p-8 text-center">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="inline-block"
                                        >
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 border-orange-200 border-t-orange-600"></div>
                                        </motion.div>
                                        <p className="mt-3 text-xs sm:text-sm text-gray-600 font-medium">Searching amazing destinations...</p>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-6 sm:p-8 text-center">
                                        <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-3">
                                            <Search className="w-6 h-6 text-red-500" />
                                        </div>
                                        <p className="text-xs sm:text-sm text-red-600 font-medium">{error}</p>
                                    </div>
                                )}

                                {!isLoading && !error && suggestions.length > 0 && (
                                    <div
                                        ref={resultsContainerRef}
                                        className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto scrollbar-hide"
                                    >
                                        {suggestions.map((suggestion, index) => (
                                            <motion.div
                                                key={suggestion.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={`p-2 sm:p-2.5 border-b border-gray-100 last:border-b-0 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 ${selectedIndex === index ? 'bg-gradient-to-r from-orange-50 to-red-50' : ''
                                                    }`}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                onMouseEnter={() => setSelectedIndex(index)}
                                            >
                                                <div className="flex items-start gap-2 sm:gap-2.5">
                                                    {/* Premium Image */}
                                                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden shadow-md ring-1 ring-gray-200">
                                                        {suggestion.type === 'location' ? (
                                                            <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                                                                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                                            </div>
                                                        ) : suggestion.image ? (
                                                            <img
                                                                src={suggestion.image}
                                                                alt={suggestion.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center">
                                                                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-1.5 mb-0.5">
                                                            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate flex-1">
                                                                {suggestion.title}
                                                            </h4>
                                                            <span className={`flex-shrink-0 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] text-white rounded-full ${getCategoryColor(suggestion.type === 'location' ? 'location' : suggestion.category)} shadow-sm`}>
                                                                {suggestion.type === 'location' ? 'Location' :
                                                                    suggestion.category === 'fixed-departure' ? 'Fixed' :
                                                                        suggestion.category === 'destination' ? 'Place' :
                                                                            suggestion.category === 'holiday-type' ? 'Type' :
                                                                                'Package'}
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600 mb-0.5">
                                                            <div className="flex items-center gap-0.5">
                                                                <MapPin className="w-2.5 h-2.5 text-orange-500" />
                                                                <span className="font-medium truncate max-w-[100px] sm:max-w-none">{suggestion.destination}</span>
                                                            </div>

                                                            {suggestion.type !== 'location' && (
                                                                <>
                                                                    <div className="hidden sm:flex items-center gap-0.5">
                                                                        <Calendar className="w-2.5 h-2.5 text-blue-500" />
                                                                        <span>{suggestion.duration}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-0.5 font-semibold text-green-600">
                                                                        <DollarSign className="w-2.5 h-2.5" />
                                                                        <span>{formatPrice(suggestion.price)}</span>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>

                                                        {/* Mobile duration */}
                                                        {suggestion.type !== 'location' && (
                                                            <div className="flex sm:hidden items-center gap-0.5 text-[10px] text-gray-600 mb-0.5">
                                                                <Calendar className="w-2.5 h-2.5 text-blue-500" />
                                                                <span>{suggestion.duration}</span>
                                                            </div>
                                                        )}

                                                        {/* States for locations */}
                                                        {suggestion.type === 'location' && suggestion.states && suggestion.states.length > 0 && (
                                                            <div className="mt-0.5">
                                                                <div className="flex flex-wrap gap-1">
                                                                    {suggestion.states.slice(0, 3).map((state, idx) => (
                                                                        <span
                                                                            key={idx}
                                                                            className="inline-block px-1.5 py-0.5 text-[9px] bg-blue-50 text-blue-700 rounded-full border border-blue-200"
                                                                        >
                                                                            {state.name}
                                                                        </span>
                                                                    ))}
                                                                    {suggestion.states.length > 3 && (
                                                                        <span className="inline-block px-1.5 py-0.5 text-[9px] bg-gray-100 text-gray-600 rounded-full">
                                                                            +{suggestion.states.length - 3}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {!isLoading && !error && suggestions.length === 0 && query.trim() && (
                                    <div className="p-6 sm:p-8 text-center">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mb-3">
                                            <Search className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-700 font-semibold mb-1.5">No results found for "{query}"</p>
                                        <p className="text-[10px] sm:text-xs text-gray-500">Try different keywords or explore our destinations</p>
                                    </div>
                                )}
                            </motion.div>,
                            document.body
                        )}
                    </>
                )}
            </AnimatePresence>


        </div>
    );
};

export default SearchSuggestions;