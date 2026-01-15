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
        fetch(`/api/packages/suggest?q=${encodeURIComponent(searchQuery)}`),
        fetch(`/api/fixed-departures/suggest?q=${encodeURIComponent(searchQuery)}`),
        fetch(`/api/destinations/suggest?q=${encodeURIComponent(searchQuery)}`),
        fetch(`/api/holiday-types/suggest?q=${encodeURIComponent(searchQuery)}`)
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
        // Close keyboard on mobile when scrolling
        const isMobile = isMobileDevice();
        if (isMobile) {
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
    if (!resultsContainer) return;

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
  }, [isFocused]);

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
      <div className="relative group">
        <div className={`absolute left-4 sm:left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${isFocused ? 'scale-110' : 'scale-100'}`}>
          <Search className={`h-5 w-5 sm:h-5 sm:w-5 ${variant === 'hero' ? 'text-gray-400' : 'text-gray-400'} transition-colors duration-300`} />
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
        
          {variant === 'hero' && !query.trim() && !isFocused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute right-4 sm:right-4 top-1/2 transform -translate-y-1/2"
            >
              <Sparkles className="h-5 w-5 sm:h-5 sm:w-5 text-gray-400" />
            </motion.div>
          )}
      </div>

      <AnimatePresence>
        {isFocused && (query.trim() || isLoading) && (
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
                className={`absolute bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 ${variant === 'hero' ? 'border-white/40' : 'border-gray-200'} z-[999999] overflow-hidden`}
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
                    className="max-h-[70vh] sm:max-h-[500px] overflow-y-auto custom-scrollbar"
                  >
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-2 sm:p-2.5 border-b border-gray-100 last:border-b-0 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 ${
                          selectedIndex === index ? 'bg-gradient-to-r from-orange-50 to-red-50' : ''
                        }`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <div className="flex items-start gap-2 sm:gap-2.5">
                          {/* Premium Image */}
                          <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shadow-md ring-1 ring-gray-200">
                            {suggestion.type === 'location' ? (
                              <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </div>
                            ) : suggestion.image ? (
                              <img
                                src={suggestion.image}
                                alt={suggestion.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1.5 mb-1">
                              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate flex-1">
                                {suggestion.title}
                              </h4>
                              <span className={`flex-shrink-0 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs text-white rounded-full ${getCategoryColor(suggestion.type === 'location' ? 'location' : suggestion.category)} shadow-sm`}>
                                {suggestion.type === 'location' ? 'Location' :
                                  suggestion.category === 'fixed-departure' ? 'Fixed' :
                                    suggestion.category === 'destination' ? 'Place' :
                                      suggestion.category === 'holiday-type' ? 'Type' :
                                        'Package'}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600 mb-1">
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
                              <div className="flex sm:hidden items-center gap-0.5 text-[10px] text-gray-600 mb-1">
                                <Calendar className="w-2.5 h-2.5 text-blue-500" />
                                <span>{suggestion.duration}</span>
                              </div>
                            )}

                            {/* States for locations */}
                            {suggestion.type === 'location' && suggestion.states && suggestion.states.length > 0 && (
                              <div className="mt-1">
                                <div className="flex flex-wrap gap-1">
                                  {suggestion.states.slice(0, 3).map((state, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-block px-1.5 py-0.5 text-[10px] bg-blue-50 text-blue-700 rounded-full border border-blue-200"
                                    >
                                      {state.name}
                                    </span>
                                  ))}
                                  {suggestion.states.length > 3 && (
                                    <span className="inline-block px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded-full">
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

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #dc2626);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #b91c1c);
        }
      `}</style>
    </div>
  );
};

export default SearchSuggestions;