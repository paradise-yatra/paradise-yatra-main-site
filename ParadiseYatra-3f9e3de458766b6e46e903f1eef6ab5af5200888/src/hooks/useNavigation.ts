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
    submenu: [
      { name: "Europe", href: "/packages/international" },
      { name: "Southeast Asia", href: "/packages/international" },
      { name: "Middle East", href: "/packages/international" },
    ],
  },
  {
    name: "India Tour Package",
    icon: "MapPin",
    submenu: [
      { name: "North India", href: "/packages/india" },
      { name: "South India", href: "/packages/india" },
      { name: "East India", href: "/packages/india" },
    ],
  },
  {
    name: "Fixed Departure",
    icon: "Calendar",
    submenu: [
      { name: "Upcoming Tours", href: "/fixed-departures" },
      { name: "Featured Tours", href: "/fixed-departures" },
      { name: "Special Offers", href: "/fixed-departures" },
    ],
  },
];

export const useNavigation = () => {
  const [navItems, setNavItems] = useState<NavigationItem[]>(fallbackNavItems);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNavigationData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch tour types with state categorization
        const tourTypesResponse = await fetch('/api/tour-types');
        
        if (!tourTypesResponse.ok) {
          throw new Error('Failed to fetch tour type data');
        }

        const tourTypesData = await tourTypesResponse.json();
        
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
              href: `/packages/${tourType.tourType}/${country.name.toLowerCase().replace(/\s+/g, '-')}`,
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
              href: `/packages/${tourType.tourType}/${state.name.toLowerCase().replace(/\s+/g, '-')}`,
              destinations: state.destinations || [],
              featured: state.destinations ? state.destinations.some(dest => dest.isTrending) : false
            }));
          }

          dynamicNavItems.push({
            name,
            icon,
            submenu
          });
        });

        // Fetch fixed departure data for navigation
        const fixedDeparturesResponse = await fetch('/api/fixed-departures/navigation');
        let fixedDeparturesData = {
          upcoming: [],
          featured: [],
          specialOffers: []
        };

        if (fixedDeparturesResponse.ok) {
          fixedDeparturesData = await fixedDeparturesResponse.json();
        }

        // Add Fixed Departure section with dynamic data
        dynamicNavItems.push({
          name: "Fixed Departure",
          icon: "Calendar",
          submenu: [
            { 
              name: "Upcoming Tours", 
              href: "/fixed-departures",
              fixedDepartures: fixedDeparturesData.upcoming
            },
            { 
              name: "Featured Tours", 
              href: "/fixed-departures",
              fixedDepartures: fixedDeparturesData.featured
            },
            { 
              name: "Special Offers", 
              href: "/fixed-departures",
              fixedDepartures: fixedDeparturesData.specialOffers
            },
          ]
        });

        // If we have dynamic data, use it; otherwise keep fallback
        if (dynamicNavItems.length > 0) {
          setNavItems(dynamicNavItems);
        } else {
          setNavItems(fallbackNavItems);
        }
      } catch (err) {
        console.error('Error fetching navigation data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch navigation data');
        // Keep fallback navigation items on error
        setNavItems(fallbackNavItems);
      } finally {
        setLoading(false);
      }
    };

    fetchNavigationData();
  }, []);

  return { navItems, loading, error };
};
