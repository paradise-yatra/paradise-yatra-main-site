import { useState, useEffect } from 'react';

interface Destination {
  id: string;
  name: string;
  location: string;
  image: string;
  category: string;
  isTrending: boolean;
  type: 'destination' | 'package';
}

interface StateGroup {
  name: string;
  destinations: Destination[];
}

interface CountryGroup {
  name: string;
  states: StateGroup[];
}

interface TourType {
  tourType: string;
  states?: StateGroup[];
  countries?: CountryGroup[];
}

interface FixedDeparture {
  id: string;
  title: string;
  destination: string;
  price: number;
  originalPrice?: number;
  discount: number;
  duration: string;
  departureDate: string;
  returnDate: string;
  availableSeats: number;
  totalSeats: number;
  image: string | null;
  slug: string;
  status: string;
  isFeatured: boolean;
}

interface NavigationItem {
  name: string;
  icon: string;
  href?: string;
  submenu: Array<{
    name: string;
    href: string;
    featured?: boolean;
    destinations?: Destination[];
    fixedDepartures?: FixedDeparture[];
    states?: Array<{ name: string; destinations: Destination[] }>;
  }>;
}

// Fallback navigation items
const fallbackNavItems: NavigationItem[] = [
  {
    name: "International Tour",
    icon: "Globe",
    href: "/package",
    submenu: [
      { name: "Europe", href: "/package" },
      { name: "Southeast Asia", href: "/package" },
      { name: "Middle East", href: "/package" },
    ],
  },
  {
    name: "India Tour Package",
    icon: "MapPin",
    href: "/package",
    submenu: [
      { name: "North India", href: "/package" },
      { name: "South India", href: "/package" },
      { name: "East India", href: "/package" },
    ],
  },
];

export const useNavigation = () => {
  const [navItems, setNavItems] = useState<NavigationItem[]>(fallbackNavItems);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Reduced to 8 seconds for faster fallback

    const fetchNavigationData = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        setError(null);

        // Fetch tour types with state categorization (with timeout)

        let tourTypesResponse;
        try {
          tourTypesResponse = await fetch('/api/tour-types', {
            cache: 'force-cache', // Use cache for better performance
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
        } catch (fetchError) {
          clearTimeout(timeoutId);
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            console.warn('Navigation API request timed out - using fallback navigation');
            // Don't throw, just use fallback
            if (isMounted) {
              setNavItems(fallbackNavItems);
              setLoading(false);
            }
            return;
          }
          // For other errors, also use fallback instead of throwing
          console.warn('Navigation API request failed - using fallback navigation:', fetchError);
          if (isMounted) {
            setNavItems(fallbackNavItems);
            setLoading(false);
          }
          return;
        }

        if (!tourTypesResponse.ok) {
          // Don't throw error, use fallback instead
          console.warn('Using fallback navigation items due to API error');
          if (isMounted) {
            setNavItems(fallbackNavItems);
            setLoading(false);
          }
          return;
        }

        const tourTypesData = await tourTypesResponse.json();

        // Validate response data
        if (!tourTypesData || !tourTypesData.tourTypes || !Array.isArray(tourTypesData.tourTypes)) {
          console.error('Invalid navigation data structure:', tourTypesData);
          throw new Error('Invalid navigation data structure');
        }

        console.log('Navigation data fetched successfully:', {
          tourTypesCount: tourTypesData.tourTypes.length,
          tourTypes: tourTypesData.tourTypes.map((t: TourType) => t.tourType),
        });

        // Create navigation items from tour types
        const dynamicNavItems: NavigationItem[] = [];

        // Sort tour types to ensure International comes first, then India
        const sortedTourTypes = tourTypesData.tourTypes.sort((a: TourType, b: TourType) => {
          if (a.tourType === 'international') return -1;
          if (b.tourType === 'international') return 1;
          if (a.tourType === 'india') return -1;
          if (b.tourType === 'india') return 1;
          return 0;
        });

        // Add tour type sections in the correct order
        sortedTourTypes.forEach((tourType: TourType) => {
          const icon = tourType.tourType === 'international' ? 'Globe' : 'MapPin';
          const name = tourType.tourType === 'international' ? 'International Tour' : 'India Tour Package';

          let submenu: Array<{
            name: string;
            href: string;
            destinations?: Destination[];
            featured?: boolean;
            states?: Array<{ name: string; destinations: Destination[] }>;
          }> = [];

          if (tourType.tourType === 'international' && tourType.countries) {
            // For international tours, create submenu from countries
            submenu = tourType.countries.map(country => ({
              name: country.name,
              href: `/package/${tourType.tourType}/${country.name.toLowerCase().replace(/\s+/g, '-')}`,
              destinations: country.states.flatMap(state => state.destinations),
              featured: country.states.some(state =>
                state.destinations.some(dest => dest.isTrending)
              ),
              // Add states information for display in header
              states: country.states.map(state => ({
                name: state.name,
                destinations: state.destinations
              }))
            }));
          } else if (tourType.states) {
            // For India tours, create submenu from states
            submenu = tourType.states.map(state => ({
              name: state.name,
              href: `/package/${tourType.tourType}/${state.name.toLowerCase().replace(/\s+/g, '-')}`,
              destinations: state.destinations || [],
              featured: state.destinations ? state.destinations.some(dest => dest.isTrending) : false
            }));
          }

          dynamicNavItems.push({
            name,
            icon,
            href: `/package`,
            submenu
          });
        });


        // If we have dynamic data, use it; otherwise keep fallback
        if (isMounted) {
          if (dynamicNavItems.length > 0) {
            setNavItems(dynamicNavItems);
          } else {
            setNavItems(fallbackNavItems);
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching navigation data:', err);
          setError(err instanceof Error ? err.message : 'Failed to fetch navigation data');
          // Keep fallback navigation items on error
          setNavItems(fallbackNavItems);
          setLoading(false);
        }
      }
    };

    fetchNavigationData();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  return { navItems, loading, error };
};
