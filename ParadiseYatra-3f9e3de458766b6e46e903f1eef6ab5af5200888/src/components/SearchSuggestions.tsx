"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Calendar, DollarSign, Plane, Star, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

import { OptimizedImage } from '@/components/ui/optimized-image';
import { formatPrice, getCategoryColor } from '@/lib/utils';
import { useTypingEffect } from '@/hooks/useTypingEffect';

interface PackageSuggestion {
  id: string;
  title: string;
  destination: string;
  price: number;
  duration: string;
  category: string;
  slug: string;
  image: string | null;
  // Additional fields for different types
  departureDate?: string;
  returnDate?: string;
  availableSeats?: number;
  totalSeats?: number;
  status?: string;
  description?: string;
  country?: string;
  region?: string;
  isFeatured?: boolean;
  // New fields for location-based suggestions
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Typing effect for placeholder text
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

  const typingText = useTypingEffect({
    texts: placeholderTexts,
    speed: 80,
    pauseTime: 2000,
    loop: true
  });

  // Helper function to calculate dropdown position
  const calculateDropdownPosition = useCallback(() => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const scrollY = window.scrollY;
    
    const dropdownHeight = 384;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    // Calculate absolute position relative to the document
    let top = rect.bottom + scrollY + 8;
    let left = rect.left;
    const width = rect.width;
    
    // Always position below the input field for consistent behavior
    // Only move above if there's absolutely no space below
    if (spaceBelow < 100 && spaceAbove > dropdownHeight + 100) {
      top = rect.top + scrollY - dropdownHeight - 8;
    }
    
    if (left + width > viewportWidth) {
      left = Math.max(0, viewportWidth - width - 16);
    }
    
    setDropdownPosition({ top, left, width });
  }, []);

  // Debounced API call
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch suggestions from multiple sources
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

      // Combine all suggestions
      const allSuggestions = [
        ...(results[0].suggestions || []),
        ...(results[1].suggestions || []),
        ...(results[2].suggestions || []),
        ...(results[3].suggestions || [])
      ];

      // Remove duplicates based on ID and combine similar results
      const uniqueSuggestions = allSuggestions.reduce((acc: PackageSuggestion[], current: PackageSuggestion) => {
        const existingIndex = acc.findIndex(item => item.id === current.id);
        if (existingIndex === -1) {
          acc.push(current);
        } else {
          // If it's the same item from different sources, merge the data
          acc[existingIndex] = { ...acc[existingIndex], ...current };
        }
        return acc;
      }, []);

      // Sort by relevance (packages first, then holiday types, then fixed departures, then destinations)
      const sortedSuggestions = uniqueSuggestions.sort((a: PackageSuggestion, b: PackageSuggestion) => {
        const categoryOrder = { 'holiday': 0, 'holiday-type': 1, 'fixed-departure': 2, 'destination': 3 };
        const aOrder = categoryOrder[a.category as keyof typeof categoryOrder] || 4;
        const bOrder = categoryOrder[b.category as keyof typeof categoryOrder] || 4;
        
        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }
        
        // Within same category, sort by price (ascending)
        return (a.price || 0) - (b.price || 0);
      });

      setSuggestions(sortedSuggestions.slice(0, 10)); // Limit to 10 total suggestions
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError('Failed to load suggestions');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search
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

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFocused || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          onSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsFocused(false);
        onClose();
        break;
    }
  };

  // Handle click outside and window resize
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        // Don't call onClose here to preserve the query
      }
    };

    const handleResize = () => {
      if (isFocused) {
        calculateDropdownPosition();
      }
    };

    const handleScroll = () => {
      if (isFocused) {
        // Throttle scroll updates to improve performance
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          calculateDropdownPosition();
        }, 16); // ~60fps
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleSuggestionClick = (suggestion: PackageSuggestion) => {
    // Handle location-based suggestions
    if (suggestion.type === 'location' && suggestion.iso2) {
      // Navigate to country page or search results
      window.location.href = `/packages?country=${encodeURIComponent(suggestion.destination)}`;
      return;
    }
    
    // Handle regular package suggestions
    onSelect(suggestion);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    // Update dropdown position immediately and then again after a small delay
    calculateDropdownPosition();
    setTimeout(() => {
      calculateDropdownPosition();
    }, 50);
  };

  const handleInputBlur = () => {
    // Add a small delay to allow for suggestion clicks
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setIsFocused(false);
        // Clean up scroll timeout when losing focus
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      }
    }, 150);
  };



  const getInputClasses = () => {
    if (variant === 'hero') {
      return "w-full h-10 pl-10 pr-3 !bg-gray-50 backdrop-blur-sm border-0 rounded-2xl !text-gray-900 placeholder-gray-500 text-sm font-medium focus:outline-none focus:ring-0 focus:border-0 transition-all duration-200 shadow-inner";
    }
    return "w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300";
  };

  const getPlaceholder = () => {
    // Use typing effect when input is not focused and has no query
    if (!isFocused && !query.trim()) {
      return typingText;
    }
    
    // Use static placeholder when focused or has query
    if (variant === 'hero') {
      return "Where do you want to go?";
    }
    return "Search destinations, packages...";
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder={!isFocused && !query.trim() ? "" : getPlaceholder()}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className={getInputClasses()}
        />
        {/* Typing cursor effect */}
        {!isFocused && !query.trim() && (
          <div className="absolute left-10 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <div className="flex items-center">
              <span className="text-gray-400 text-sm font-medium">
                {typingText}
              </span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="ml-1 w-0.5 h-4 bg-gray-400"
              />
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isFocused && (query.trim() || isLoading) && (
          <>
            {/* Backdrop overlay */}
            {createPortal(
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/20 z-[99999]"
                onClick={() => {
                  setIsFocused(false);
                  // Don't call onClose to preserve the query
                }}
              />,
              document.body
            )}
            {createPortal(
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`absolute bg-white rounded-xl shadow-2xl border border-gray-100 z-[999999] max-h-96 overflow-hidden ${
                  variant === 'hero' ? 'backdrop-blur-md bg-white/95' : ''
                }`}
                style={{
                  position: 'absolute',
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  width: Math.max(dropdownPosition.width, 300), // Ensure minimum width
                  zIndex: 999999
                }}
              >
            {isLoading && (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm">Searching...</p>
              </div>
            )}

            {error && (
              <div className="p-4 text-center text-red-500">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {!isLoading && !error && suggestions.length > 0 && (
              <div className="max-h-96 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 border-b border-gray-100 last:border-b-0 cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                      selectedIndex === index ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Image or Location Icon */}
                      <div className="flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                        {suggestion.type === 'location' ? (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <Globe className="w-6 h-6 text-blue-500" />
                          </div>
                        ) : suggestion.image ? (
                          <OptimizedImage
                            src={suggestion.image}
                            alt={suggestion.title}
                            width={64}
                            height={48}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to placeholder on error
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        {suggestion.image && (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center hidden">
                            <MapPin className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {suggestion.title}
                          </h4>
                          <span className={`px-2 py-1 text-xs text-white rounded-full ${
                            suggestion.type === 'location' 
                              ? 'bg-blue-500' 
                              : getCategoryColor(suggestion.category)
                          }`}>
                            {suggestion.type === 'location' ? 'Location' :
                             suggestion.category === 'fixed-departure' ? 'Fixed Departure' : 
                             suggestion.category === 'destination' ? 'Destination' : 
                             suggestion.category === 'holiday-type' ? 'Holiday Type' :
                             suggestion.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{suggestion.destination}</span>
                          </div>
                          
                          {suggestion.type !== 'location' && (
                            <>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{suggestion.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-3 h-3" />
                                <span className="font-semibold text-green-600">
                                  {formatPrice(suggestion.price)}
                                </span>
                              </div>
                            </>
                          )}
                          
                          {/* Show additional info for fixed departures */}
                          {suggestion.category === 'fixed-departure' && suggestion.departureDate && (
                            <div className="flex items-center space-x-1">
                              <Plane className="w-3 h-3" />
                              <span>{new Date(suggestion.departureDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          
                          {/* Show additional info for destinations */}
                          {suggestion.category === 'destination' && suggestion.country && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{suggestion.country}</span>
                            </div>
                          )}
                          
                          {/* Show additional info for holiday types */}
                          {suggestion.category === 'holiday-type' && suggestion.isFeatured && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3" />
                              <span>Featured</span>
                            </div>
                          )}
                          
                          {/* Show country and state info for packages */}
                          {suggestion.type !== 'location' && suggestion.country && (
                            <div className="flex items-center space-x-1">
                              <Globe className="w-3 h-3" />
                              <span>{suggestion.country}</span>
                              {suggestion.state && (
                                <span className="text-gray-400">• {suggestion.state}</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Show states for location suggestions */}
                        {suggestion.type === 'location' && suggestion.states && suggestion.states.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="text-xs text-gray-500 mb-1">Popular States:</div>
                            <div className="flex flex-wrap gap-1">
                              {suggestion.states.slice(0, 4).map((state, stateIndex) => (
                                <span 
                                  key={stateIndex}
                                  className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200"
                                >
                                  {state.name}
                                </span>
                              ))}
                              {suggestion.states.length > 4 && (
                                <span className="inline-block px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded-full">
                                  +{suggestion.states.length - 4} more
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
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">No packages found for &quot;{query}&quot;</p>
                <p className="text-xs mt-1">Try different keywords</p>
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