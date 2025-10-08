"use client";

import { Suspense, useState, useEffect, useRef } from 'react';
import { LazyHeader } from '@/components/lazy-components';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';
import Image from 'next/image';

// Loading skeleton component
const PackagesLoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center space-x-2 text-sm mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            {i < 4 && <span className="mx-2 text-gray-300">/</span>}
          </div>
        ))}
      </div>

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

// Components for better organization
const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h4 className="text-gray-700 font-semibold text-sm mb-3 uppercase tracking-wide flex items-center">
      <span className="w-1 h-4 bg-blue-500 mr-2 rounded-full"></span>
      {title}
    </h4>
    {children}
  </div>
);

const FilterOption = ({ value, label, name, checked, onChange }: {
  value: string;
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <label className="flex items-center cursor-pointer py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
    />
    <span className="ml-3 text-sm text-gray-700">{label}</span>
  </label>
);

const StatCard = ({ value, label, color }: { value: number; label: string; color: string }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
    <div className={`text-3xl font-bold mb-2 ${color}`}>{value}</div>
    <div className="text-sm text-gray-600 font-medium">{label}</div>
  </div>
);

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center space-x-1 sm:space-x-2 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200 text-sm font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed border-0 flex items-center"
      >
        <svg className="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">Prev</span>
      </button>
      
      <div className="flex items-center space-x-1 overflow-x-auto">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-2 sm:px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
              currentPage === page 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200 text-sm font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed border-0 flex items-center"
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">Next</span>
        <svg className="w-4 h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

interface PackagesPageClientProps {
  params: {
    tourType: string;
    state: string;
  };
}

export default function PackagesPageClient({ params }: PackagesPageClientProps) {
  const [allItems, setAllItems] = useState<Array<{
    _id: string;
    type: 'destination' | 'package';
    displayName: string;
    displayLocation: string;
    displayImage: string;
    displayCategory: string;
    displayRating: number;
    displayDuration: string;
    displayDescription: string;
    displayPrice: number;
    detailUrl: string;
  }>>([]);
  const [filteredItems, setFilteredItems] = useState<Array<{
    _id: string;
    type: 'destination' | 'package';
    displayName: string;
    displayLocation: string;
    displayImage: string;
    displayCategory: string;
    displayRating: number;
    displayDuration: string;
    displayDescription: string;
    displayPrice: number;
    detailUrl: string;
  }>>([]);
  const [allSuggestions, setAllSuggestions] = useState<Array<{
    _id: string;
    type: 'destination' | 'package';
    displayName: string;
    displayLocation: string;
    displayImage: string;
    displayCategory: string;
    displayRating: number;
    displayDuration: string;
    displayDescription: string;
    displayPrice: number;
    detailUrl: string;
  }>>([]);
  const [suggestions, setSuggestions] = useState<Array<{
    _id: string;
    type: 'destination' | 'package';
    displayName: string;
    displayLocation: string;
    displayImage: string;
    displayCategory: string;
    displayRating: number;
    displayDuration: string;
    displayDescription: string;
    displayPrice: number;
    detailUrl: string;
  }>>([]);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tourType, setTourType] = useState(params.tourType);
  const [state, setState] = useState(params.state);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  
  // Filter states
  const [selectedRating, setSelectedRating] = useState<string>('any');
  const [selectedDuration, setSelectedDuration] = useState<string>('any');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('any');
  const [selectedSort, setSelectedSort] = useState<string>('recommended');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decodedState = decodeURIComponent(state.replace(/-/g, ' '))
          .replace(/&/g, 'and') // Replace & with 'and'
          .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
          .trim(); // Remove leading/trailing spaces
        
        setState(decodedState);
        
        // Fetch both destinations and packages for this tour type and state
        const [destinationsResponse, packagesResponse] = await Promise.all([
          fetch(
            `/api/destinations?tourType=${tourType}&state=${decodedState}&limit=50`
          ),
          fetch(
            `/api/packages?tourType=${tourType}&state=${decodedState}&limit=50`
          )
        ]);
        
        let destinations = [];
        let packages = [];
        
        if (destinationsResponse.ok) {
          const destinationsData = await destinationsResponse.json();
          destinations = destinationsData.destinations || [];
        }
        
        if (packagesResponse.ok) {
          const packagesData = await packagesResponse.json();
          packages = packagesData.packages || [];
        }
        
        // Combine destinations and packages
        const combinedItems = [
          ...destinations.map((dest: {
            _id: string;
            name: string;
            slug: string;
            location: string;
            image: string;
            category: string;
            rating?: number;
            duration: string;
            shortDescription?: string;
            description?: string;
            price?: number;
          }) => ({
            ...dest,
            type: 'destination' as const,
            displayName: dest.name,
            displayLocation: dest.location,
            displayImage: dest.image,
            displayCategory: dest.category,
            displayRating: dest.rating || 4.5,
            displayDuration: dest.duration,
            displayDescription: dest.shortDescription || dest.description || 'Explore this amazing destination',
            displayPrice: dest.price || 0,
                            detailUrl: `/destinations/${dest.slug || dest._id}`
          })),
          ...packages.map((pkg: {
            _id: string;
            title: string;
            destination: string;
            images?: string[];
            category: string;
            rating?: number;
            duration: string;
            description?: string;
            shortDescription?: string;
            price?: number;
          }) => ({
            ...pkg,
            type: 'package' as const,
            displayName: pkg.title,
            displayLocation: pkg.destination,
            displayImage: pkg.images?.[0] || '/images/placeholder-travel.jpg',
            displayCategory: pkg.category,
            displayRating: pkg.rating || 4.5,
            displayDuration: pkg.duration,
            displayDescription: pkg.shortDescription || 'Experience this amazing tour package',
            displayPrice: pkg.price || 0,
            detailUrl: `/itinerary/${pkg._id}`
          }))
        ];

        // Sort items by rating (highest first) and then by price
        combinedItems.sort((a, b) => {
          if (b.displayRating !== a.displayRating) {
            return b.displayRating - a.displayRating;
          }
          return a.displayPrice - b.displayPrice;
        });

        setAllItems(combinedItems);
        setFilteredItems(combinedItems);
        
        // Fetch random suggestions from other states/countries using packages API
        try {
          // Fetch packages from other states for suggestions
          const suggestionsResponse = await fetch(`/api/packages?tourType=${tourType}&limit=20`);
          if (suggestionsResponse.ok) {
            const suggestionsData = await suggestionsResponse.json();
            const allSuggestions: any[] = [];
            
            // Filter out packages from the current state and create suggestions
            if (suggestionsData.packages) {
              suggestionsData.packages.forEach((pkg: any) => {
                if (pkg.state !== decodedState) {
                  allSuggestions.push({
                    _id: pkg._id,
                    type: 'package' as const,
                    displayName: pkg.title,
                    displayLocation: pkg.destination,
                    displayImage: pkg.images?.[0] || '/images/placeholder-travel.jpg',
                    displayCategory: pkg.category,
                    displayRating: pkg.rating || 4.5,
                    displayDuration: pkg.duration,
                    displayDescription: pkg.shortDescription || pkg.description || 'Experience this amazing tour package',
                    displayPrice: pkg.price || 0,
                    detailUrl: `/itinerary/${pkg._id}`
                  });
                }
              });
            }
            
            // Shuffle all suggestions and store them
            const shuffled = allSuggestions.sort(() => 0.5 - Math.random());
            setAllSuggestions(shuffled);
            setSuggestions(shuffled.slice(0, 3));
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching packages:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [tourType, state]);

  // Filter items based on selected filters
  useEffect(() => {
    let filtered = [...allItems];

    // Filter by rating
    if (selectedRating !== 'any') {
      const minRating = parseFloat(selectedRating);
      filtered = filtered.filter(item => item.displayRating >= minRating);
    }

    // Filter by duration
    if (selectedDuration !== 'any') {
      filtered = filtered.filter(item => {
        const duration = item.displayDuration.toLowerCase();
        switch (selectedDuration) {
          case '1-3':
            return duration.includes('1') || duration.includes('2') || duration.includes('3');
          case '4-6':
            return duration.includes('4') || duration.includes('5') || duration.includes('6');
          case '7-9':
            return duration.includes('7') || duration.includes('8') || duration.includes('9');
          case '10-12':
            return duration.includes('10') || duration.includes('11') || duration.includes('12');
          case '13+':
            return duration.includes('13') || duration.includes('14') || duration.includes('15') || 
                   duration.includes('16') || duration.includes('17') || duration.includes('18') || 
                   duration.includes('19') || duration.includes('20') || duration.includes('21') || 
                   duration.includes('22') || duration.includes('23') || duration.includes('24') || 
                   duration.includes('25') || duration.includes('26') || duration.includes('27') || 
                   duration.includes('28') || duration.includes('29') || duration.includes('30');
          default:
            return true;
        }
      });
    }

    // Filter by price range
    if (selectedPriceRange !== 'any') {
      filtered = filtered.filter(item => {
        const price = item.displayPrice;
        switch (selectedPriceRange) {
          case '0-10000':
            return price <= 10000;
          case '10000-20000':
            return price > 10000 && price <= 20000;
          case '20000-30000':
            return price > 20000 && price <= 30000;
          case '30000-50000':
            return price > 30000 && price <= 50000;
          case '50000+':
            return price > 50000;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    switch (selectedSort) {
      case 'price-asc':
        filtered.sort((a, b) => (a.displayPrice || 0) - (b.displayPrice || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.displayPrice || 0) - (a.displayPrice || 0));
        break;
      case 'rating-desc':
        filtered.sort((a, b) => (b.displayRating || 0) - (a.displayRating || 0));
        break;
      case 'recommended':
      default:
        // keep current natural order (already set during initial load)
        break;
    }

    setFilteredItems(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [allItems, selectedRating, selectedDuration, selectedPriceRange, selectedSort]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  // Hide mobile swipe hint after user scrolls or after a short delay
  useEffect(() => {
    const container = mobileScrollRef.current;
    if (!container) return;

    const onScroll = () => {
      if (container.scrollLeft > 0) {
        setShowSwipeHint(false);
      }
    };

    container.addEventListener('scroll', onScroll, { passive: true });

    const timeoutId = window.setTimeout(() => setShowSwipeHint(false), 6000);

    return () => {
      container.removeEventListener('scroll', onScroll);
      window.clearTimeout(timeoutId);
    };
  }, [allSuggestions.length]);

  // Navigation functions for suggestions
  const showNextSuggestions = () => {
    const nextIndex = currentSuggestionIndex + 3;
    if (nextIndex < allSuggestions.length) {
      setCurrentSuggestionIndex(nextIndex);
      setSuggestions(allSuggestions.slice(nextIndex, nextIndex + 3));
    }
  };

  const showPreviousSuggestions = () => {
    const prevIndex = currentSuggestionIndex - 3;
    if (prevIndex >= 0) {
      setCurrentSuggestionIndex(prevIndex);
      setSuggestions(allSuggestions.slice(prevIndex, prevIndex + 3));
    }
  };

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

  if (!tourType || !state) {
    return null;
  }

  const tourTypeLabel = tourType === 'international' ? 'International Tour' : 'India Tour Package';
  const stateLabel = state.charAt(0).toUpperCase() + state.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <LazyHeader />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined' && window.stopHeaderLoading) {
              // Stop the header loading state when page loads
              window.stopHeaderLoading();
            }
          `,
        }}
      />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <Suspense fallback={<PackagesLoadingSkeleton />}>


            {/* Header */}
            <div className="text-center mb-12 pt-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {tourTypeLabel} in <span className="text-blue-600">{stateLabel}</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Discover amazing destinations in {stateLabel} with our curated tour packages
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:mb-6 flex items-center">
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
                          { value: 'any', label: 'Any' },
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
                              checked={selectedRating === option.value}
                              onChange={(e) => setSelectedRating(e.target.value)}
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
                          { value: 'any', label: 'Any' },
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
                              checked={selectedDuration === option.value}
                              onChange={(e) => setSelectedDuration(e.target.value)}
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
                          { value: 'any', label: 'Any' },
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
                              checked={selectedPriceRange === option.value}
                              onChange={(e) => setSelectedPriceRange(e.target.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 lg:ml-3 text-xs lg:text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedRating('any');
                      setSelectedDuration('any');
                      setSelectedPriceRange('any');
                    }}
                    className="w-full bg-gray-100 text-gray-700 py-2.5 lg:py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-xs lg:text-sm font-medium flex items-center justify-center mt-4"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset Filters
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
                    Showing <span className="font-semibold">{startIndex + 1}-{Math.min(endIndex, filteredItems.length)}</span> of <span className="font-semibold">{filteredItems.length}</span> results
                  </p>
                  <div className="flex items-center text-sm text-gray-500 w-full sm:w-auto">
                    <span className="mr-2 whitespace-nowrap">Sort by:</span>
                    <select
                      value={selectedSort}
                      onChange={(e) => setSelectedSort(e.target.value)}
                      className="bg-white border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto text-sm"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating-desc">Rating</option>
                    </select>
                  </div>
                </div>

                {filteredItems.length > 0 ? (
                  <div className="space-y-6">
                    {paginatedItems.map((item: any, index: number) => (
                      <div key={item._id || index} data-item-type={item.type} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group">
                        <div className="flex flex-col md:flex-row h-full">
                          <div className="relative w-full md:w-80 overflow-hidden shadow-sm h-48 sm:h-56 md:h-auto md:aspect-[16/9] flex-shrink-0">
                            <Image
                              src={item.displayImage}
                              alt={item.displayName}
                              width={320}
                              height={180}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            
                            <div className="absolute top-3 right-3">
                              <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center shadow-sm">
                                <span className="text-amber-500 mr-1">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </span>
                                <span className="text-gray-700 text-xs font-medium">{item.displayRating}</span>
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
                                {item.displayLocation}
                              </div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.displayName}</h3>
                              <div className="flex items-center text-gray-500 text-sm mb-3">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{item.displayDuration}</span>
                              </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">{item.displayDescription}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                              <div>
                                <div className="text-[11px] uppercase tracking-wider text-gray-500">Starting from</div>
                                <div className="flex items-baseline text-gray-900">
                                  <span className="mr-1 text-sm text-gray-600">₹</span>
                                  <span className="text-xl md:text-2xl font-semibold tracking-tight tabular-nums">{(item.displayPrice ?? 0).toLocaleString()}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <a
                                  href={item.detailUrl}
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
                        setSelectedRating('any');
                        setSelectedDuration('any');
                        setSelectedPriceRange('any');
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
                    Discover amazing places beyond {stateLabel}
                  </p>
                </div>
                
                <div className="relative max-w-4xl mx-auto">
                  {/* Desktop Navigation Buttons - Hidden on mobile */}
                  <div className="hidden lg:flex justify-between items-center mb-6">
                    <button
                      onClick={showPreviousSuggestions}
                      disabled={currentSuggestionIndex === 0}
                      className={`flex items-center justify-center w-12 h-12 rounded-full font-medium transition-all duration-200 ${
                        currentSuggestionIndex === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <div className="text-sm text-gray-600">
                      {Math.floor(currentSuggestionIndex / 3) + 1} of {Math.ceil(allSuggestions.length / 3)}
                    </div>
                    
                    <button
                      onClick={showNextSuggestions}
                      disabled={currentSuggestionIndex + 3 >= allSuggestions.length}
                      className={`flex items-center justify-center w-12 h-12 rounded-full font-medium transition-all duration-200 ${
                        currentSuggestionIndex + 3 >= allSuggestions.length
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Mobile: Horizontal scrollable container */}
                  <div className="lg:hidden">
                    {showSwipeHint && (
                      <div className="flex items-center justify-center text-[11px] text-gray-600 mb-2 select-none">
                        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Swipe left to see more</span>
                        <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                    <div ref={mobileScrollRef} className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide mobile-scroll-container">
                      {allSuggestions.map((item: any, index: number) => (
                        <div key={`suggestion-${item._id || index}`} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group flex-shrink-0 w-80 flex flex-col">
                          <div className="relative overflow-hidden shadow-lg h-48 md:h-auto md:aspect-[16/9]">
                            <Image
                              src={item.displayImage}
                              alt={item.displayName}
                              width={320}
                              height={180}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            
                            <div className="absolute top-3 right-3">
                              <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center shadow-sm">
                                <span className="text-amber-500 mr-1">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </span>
                                <span className="text-gray-700 text-xs font-medium">{item.displayRating}</span>
                              </div>
                            </div>
                            
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                              <div className="text-white text-xs opacity-90 mb-1 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {item.displayLocation}
                              </div>
                              <h3 className="text-lg font-semibold text-white">{item.displayName}</h3>
                            </div>
                          </div>

                          <div className="p-4 flex-1 flex flex-col">
                            <div className="flex items-center text-gray-500 text-sm mb-3">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{item.displayDuration}</span>
                            </div>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">{item.displayDescription}</p>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                              <div>
                                <div className="text-xs text-gray-500">Starting from</div>
                                <div className="text-lg font-semibold text-gray-900">
                                  ₹{item.displayPrice?.toLocaleString()}
                                </div>
                              </div>
                              <a
                                href={item.detailUrl}
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

                  {/* Desktop: Grid layout */}
                  <div className="hidden lg:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suggestions.map((item: any, index: number) => (
                      <div key={`suggestion-${item._id || index}`} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group h-full flex flex-col">
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <Image
                            src={item.displayImage}
                            alt={item.displayName}
                            width={400}
                            height={225}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          
                          <div className="absolute top-3 right-3">
                            <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center shadow-sm">
                              <span className="text-amber-500 mr-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </span>
                              <span className="text-gray-700 text-xs font-medium">{item.displayRating}</span>
                            </div>
                          </div>
                          
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <div className="text-white text-xs opacity-90 mb-1 flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {item.displayLocation}
                            </div>
                            <h3 className="text-lg font-semibold text-white">{item.displayName}</h3>
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                          <div className="flex items-center text-gray-500 text-sm mb-3">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{item.displayDuration}</span>
                          </div>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">{item.displayDescription}</p>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                            <div>
                              <div className="text-xs text-gray-500">Starting from</div>
                              <div className="text-lg font-semibold text-gray-900">
                                ₹{item.displayPrice?.toLocaleString()}
                              </div>
                            </div>
                            <a
                              href={item.detailUrl}
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
              </div>
            )}

            {/* FAQ Section */}
            <FAQ state={state} className="mt-16 mb-8" />

          </Suspense>
        </div>
      </div>
      
      {/* Add some padding before footer to ensure proper spacing */}
      <div className="h-4 bg-gray-50"></div>
    </div>
  );
}
