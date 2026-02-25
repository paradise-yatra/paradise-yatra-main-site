"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Calendar, DollarSign, Globe, TrendingUp, X, Star } from 'lucide-react';
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

// Featured destination cards for when there's no query
const FEATURED_DESTINATIONS = [
    { name: 'Switzerland', label: 'Alpine Views', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80&auto=format&fit=crop', size: 'tall' },
    { name: 'Japan', label: 'Land of Rising Sun', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80&auto=format&fit=crop', size: 'normal' },
    { name: 'Dubai', label: 'The City of Life', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80&auto=format&fit=crop', size: 'normal' },
    { name: 'Singapore', label: 'The Lion City', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80&auto=format&fit=crop', size: 'tall' },
    { name: 'Vietnam', label: 'Land of Ascending Dragon', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&q=80&auto=format&fit=crop', size: 'normal' },
    { name: 'Maldives', label: 'Create Minds', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80&auto=format&fit=crop', size: 'normal' },
    { name: 'Iceland', label: 'Northern Lights', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80&auto=format&fit=crop', size: 'normal' },
    { name: 'Greece', label: 'Ancient Ruins', image: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=400&q=80&auto=format&fit=crop', size: 'normal' },
];

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
            "Pick your destination...",
            "Explore Bali...",
            "Discover Europe...",
            "Visit Himachal Pradesh...",
            "Adventure in Ladakh...",
            "Relax in Goa...",
            "Experience Kerala...",
            "Journey to Kashmir...",
        ]
        : [
            "Search destinations, packages...",
            "Find your perfect trip...",
            "Discover amazing places...",
            "Plan your next adventure...",
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
            const focusTimer = setTimeout(() => {
                inputRef.current?.focus();
                setIsFocused(true);
            }, 200);
            return () => clearTimeout(focusTimer);
        }
    }, [variant, isOpen]);

    // Escape key to close hero modal
    useEffect(() => {
        if (variant !== 'hero' || !isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [variant, isOpen, onClose]);

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
            const [packagesResponse, fixedResponse] = await Promise.all([
                fetch(`/api/all-packages?q=${encodeURIComponent(searchQuery)}&limit=10`, { cache: 'no-store' }),
                fetch(`/api/fixed-departures/suggest?q=${encodeURIComponent(searchQuery)}`, { cache: 'no-store' })
            ]);
            let packages = [];
            if (packagesResponse.ok) {
                const data = await packagesResponse.json();
                packages = data.packages || [];
            }
            let fixedDepartures = [];
            if (fixedResponse.ok) {
                const data = await fixedResponse.json();
                fixedDepartures = data.suggestions || [];
            }
            const mappedPackages = packages.map((pkg: any) => ({
                id: pkg._id,
                title: pkg.name,
                destination: pkg.location || pkg.state || pkg.country || 'Multiple Locations',
                price: pkg.price || 0,
                duration: pkg.duration || 'N/A',
                category: pkg.category || 'package',
                slug: pkg.slug || pkg._id,
                image: pkg.image || (pkg.images && pkg.images.length > 0 ? pkg.images[0] : null),
                type: 'package' as const,
                tourType: pkg.tourType
            }));
            const mappedFixed = fixedDepartures.map((departure: any) => ({
                ...departure,
                type: 'fixed-departure' as const,
                category: 'fixed-departure'
            }));
            const allSuggestions = [...mappedPackages, ...mappedFixed].slice(0, 15);
            setSuggestions(allSuggestions);
        } catch (err) {
            console.error('Error fetching suggestions:', err);
            setError('Failed to load suggestions');
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (query.trim()) {
            timeoutRef.current = setTimeout(() => fetchSuggestions(query), 300);
        } else {
            setSuggestions([]);
        }
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }, [query, fetchSuggestions]);

    useEffect(() => { setSelectedIndex(-1); }, [suggestions]);

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
                setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
                break;
            case 'ArrowUp':
                if (!isFocused || suggestions.length === 0) return;
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (isMobile && query.trim()) {
                    keepFocusedRef.current = true;
                    setIsFocused(true);
                    if (inputRef.current) inputRef.current.blur();
                    if (suggestions.length === 0 && !isLoading) fetchSuggestions(query);
                    setTimeout(() => { keepFocusedRef.current = false; }, 300);
                } else if (isFocused && selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    onSelect(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsFocused(false);
                if (inputRef.current) inputRef.current.blur();
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
        const handleResize = () => { if (isFocused) calculateDropdownPosition(); };
        const handleScroll = () => {
            if (isFocused) {
                const isMobile = isMobileDevice();
                if (isMobile && variant !== 'hero') closeMobileKeyboard();
                if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
                scrollTimeoutRef.current = setTimeout(() => calculateDropdownPosition(), 16);
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
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        };
    }, [isFocused, calculateDropdownPosition]);

    const closeMobileKeyboard = () => {
        const isMobile = isMobileDevice();
        if (isMobile && inputRef.current) inputRef.current.blur();
    };

    useEffect(() => {
        const resultsContainer = resultsContainerRef.current;
        if (!resultsContainer || variant === 'hero') return;
        const handleResultsScroll = () => {
            const isMobile = isMobileDevice();
            if (isMobile && isFocused) closeMobileKeyboard();
        };
        resultsContainer.addEventListener('scroll', handleResultsScroll, { passive: true });
        resultsContainer.addEventListener('touchstart', handleResultsScroll, { passive: true });
        return () => {
            resultsContainer.removeEventListener('scroll', handleResultsScroll);
            resultsContainer.removeEventListener('touchstart', handleResultsScroll);
        };
    }, [isFocused, variant]);

    const handleSuggestionClick = (suggestion: PackageSuggestion) => {
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
        setTimeout(() => calculateDropdownPosition(), 50);
    };

    const handleInputBlur = () => {
        setTimeout(() => {
            if (keepFocusedRef.current) return;
            const isMobile = isMobileDevice();
            if (isMobile && query.trim() && suggestions.length > 0) return;
            if (!containerRef.current?.contains(document.activeElement)) {
                setIsFocused(false);
                if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
            }
        }, 150);
    };

    const getInputClasses = () => {
        if (variant === 'hero') {
            return "w-full pl-12 pr-4 py-3.5 text-base bg-white/10 backdrop-blur-sm rounded-lg border border-[#4ade80] text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#4ade80]/50 transition-all duration-200";
        }
        return "w-full pl-11 pr-4 py-3.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200";
    };

    return (
        <div ref={containerRef} className="relative w-full">
            {variant !== 'hero' && (
                <div className="relative group">
                    <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${isFocused ? 'scale-110' : 'scale-100'}`}>
                        <Search className="h-5 w-5 text-gray-400" />
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
                {/* ── HERO VARIANT: Premium fullscreen dark overlay ── */}
                {variant === 'hero' && isOpen && (
                    <>
                        {createPortal(
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="fixed inset-0 z-[99999] overflow-hidden flex flex-col"
                                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)' }}
                            >
                                {/* Subtle map/topography texture overlay */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                                    }}
                                />

                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-5 right-5 z-50 p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
                                    aria-label="Close search"
                                >
                                    <X className="w-7 h-7" />
                                </button>

                                {/* ── Main Content ── */}
                                <div className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-14 sm:pt-16 pb-4 overflow-hidden">
                                    {/* Headline */}
                                    <motion.h1
                                        initial={{ opacity: 0, y: -16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05, duration: 0.3 }}
                                        className="!text-2xl sm:!text-3xl md:!text-4xl !font-bold text-white text-center mb-6 sm:mb-8"
                                    >
                                        Your Next Adventure Awaits
                                    </motion.h1>

                                    {/* Search Input */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1, duration: 0.3 }}
                                        className="relative w-full max-w-2xl mb-6 sm:mb-8"
                                    >
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Search className="w-5 h-5 text-[#4ade80]" />
                                        </div>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            placeholder={placeholderTexts[currentPlaceholder]}
                                            value={query}
                                            onChange={(e) => onQueryChange(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            onFocus={() => setIsFocused(true)}
                                            onBlur={handleInputBlur}
                                            className={getInputClasses()}
                                        />
                                    </motion.div>

                                    {/* ── Results or Featured Grid ── */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15, duration: 0.3 }}
                                        className="w-full max-w-5xl flex-1 overflow-y-auto scrollbar-hide"
                                    >
                                        {/* Loading */}
                                        {isLoading && (
                                            <div className="flex flex-col items-center justify-center py-16">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-10 h-10 rounded-full border-4 border-white/20 border-t-[#4ade80]"
                                                />
                                                <p className="mt-4 text-sm text-white/60 font-medium">Searching amazing destinations...</p>
                                            </div>
                                        )}

                                        {/* Search Results */}
                                        {!isLoading && !error && suggestions.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-3">
                                                    Suggested Destinations
                                                </p>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                    {suggestions.map((suggestion, index) => (
                                                        <motion.div
                                                            key={suggestion.id}
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: index * 0.04 }}
                                                            className="relative rounded-xl overflow-hidden cursor-pointer group"
                                                            style={{ height: '140px' }}
                                                            onClick={() => handleSuggestionClick(suggestion)}
                                                        >
                                                            {suggestion.image ? (
                                                                <img
                                                                    src={suggestion.image}
                                                                    alt={suggestion.title}
                                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                                                                    <MapPin className="w-8 h-8 text-white/70" />
                                                                </div>
                                                            )}
                                                            {/* Dark overlay */}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                            {/* Text */}
                                                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                                                <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{suggestion.title}</p>
                                                                {suggestion.price > 0 && (
                                                                    <p className="text-[#4ade80] text-[10px] font-bold mt-0.5">{formatPrice(suggestion.price)}</p>
                                                                )}
                                                            </div>
                                                            {/* Hover border */}
                                                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#4ade80]/60 rounded-xl transition-colors duration-300" />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* No Results */}
                                        {!isLoading && !error && suggestions.length === 0 && query.trim() && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                                                <div className="w-14 h-14 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-4">
                                                    <Search className="w-7 h-7 text-white/50" />
                                                </div>
                                                <p className="text-white/80 font-semibold mb-1.5">No results for "{query}"</p>
                                                <p className="text-white/40 text-sm">Try different keywords or explore below</p>
                                            </motion.div>
                                        )}

                                        {/* Featured Destinations Grid (when no query) */}
                                        {!isLoading && !query.trim() && (
                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-4">
                                                    Popular Destinations
                                                </p>
                                                {/* Masonry-style horizontal scroll layout */}
                                                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                                                    {FEATURED_DESTINATIONS.map((dest, index) => (
                                                        <motion.div
                                                            key={dest.name}
                                                            initial={{ opacity: 0, y: 16 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group"
                                                            style={{
                                                                width: dest.size === 'tall' ? '160px' : '140px',
                                                                height: dest.size === 'tall' ? '200px' : '170px',
                                                            }}
                                                            onClick={() => {
                                                                onQueryChange(dest.name);
                                                            }}
                                                        >
                                                            <img
                                                                src={dest.image}
                                                                alt={dest.name}
                                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                            />
                                                            {/* Gradient overlay */}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                                                            {/* Label at top */}
                                                            <div className="absolute top-3 left-3 right-3">
                                                                <p className="text-white/70 text-[9px] uppercase tracking-wider font-semibold leading-tight">
                                                                    {dest.label}
                                                                </p>
                                                            </div>
                                                            {/* Name at bottom */}
                                                            <div className="absolute bottom-3 left-3 right-3">
                                                                <p className="text-white text-base font-bold leading-tight">{dest.name}</p>
                                                            </div>
                                                            {/* Hover ring */}
                                                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#4ade80]/50 rounded-2xl transition-colors duration-300" />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>

                                {/* ── Bottom Rating Bar ── */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex items-center justify-between px-5 sm:px-8 py-3 border-t border-white/10"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                                            PY
                                        </div>
                                        <p className="text-white/50 text-xs hidden sm:block">
                                            We recently completed a 7-day trip for Thailand through Paradise Yatra...
                                        </p>
                                        <p className="text-white/50 text-xs sm:hidden">Trusted by thousands of travelers</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400/40'}`} />
                                            ))}
                                        </div>
                                        <span className="text-white font-bold text-sm">4.6</span>
                                        <span className="text-white/40 text-xs">/ 5 · 8400+ reviews</span>
                                    </div>
                                </motion.div>
                            </motion.div>,
                            document.body
                        )}
                    </>
                )}

                {/* ── NON-HERO dropdown (unchanged) ── */}
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
                                onTouchStart={() => closeMobileKeyboard()}
                            >
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
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="inline-block">
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
                                    <div ref={resultsContainerRef} className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto scrollbar-hide">
                                        {suggestions.map((suggestion, index) => (
                                            <motion.div
                                                key={suggestion.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={`p-2 sm:p-2.5 border-b border-gray-100 last:border-b-0 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 ${selectedIndex === index ? 'bg-gradient-to-r from-orange-50 to-red-50' : ''}`}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                onMouseEnter={() => setSelectedIndex(index)}
                                            >
                                                <div className="flex items-start gap-2 sm:gap-2.5">
                                                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden shadow-md ring-1 ring-gray-200">
                                                        {suggestion.type === 'location' ? (
                                                            <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                                                                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                                            </div>
                                                        ) : suggestion.image ? (
                                                            <img src={suggestion.image} alt={suggestion.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center">
                                                                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-1.5 mb-0.5">
                                                            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate flex-1">{suggestion.title}</h4>
                                                            <span className={`flex-shrink-0 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] text-white rounded-full ${getCategoryColor(suggestion.type === 'location' ? 'location' : suggestion.category)} shadow-sm`}>
                                                                {suggestion.type === 'location' ? 'Location' :
                                                                    suggestion.category === 'fixed-departure' ? 'Fixed' :
                                                                        suggestion.category === 'destination' ? 'Place' :
                                                                            suggestion.category === 'holiday-type' ? 'Type' : 'Package'}
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