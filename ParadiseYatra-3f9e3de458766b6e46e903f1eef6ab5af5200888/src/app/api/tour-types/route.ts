import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api';

export async function GET() {
  try {
    // Fetch tour types, countries, states, and fixed departures in parallel
    const [tourTypesResponse, countriesResponse, statesResponse, fixedDeparturesResponse] = await Promise.all([
      fetch(`${API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.DESTINATIONS.TOUR_TYPES)}`),
      fetch(`${API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.DESTINATIONS.COUNTRIES)}`),
      fetch(`${API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.DESTINATIONS.STATES)}`),
      fetch(`${API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.FIXED_DEPARTURES.ALL)}?limit=100`)
    ]);

    if (!tourTypesResponse.ok || !countriesResponse.ok || !statesResponse.ok || !fixedDeparturesResponse.ok) {
      throw new Error('Failed to fetch tour type data');
    }

    const tourTypesData = await tourTypesResponse.json();
    const countriesData = await countriesResponse.json();
    const statesData = await statesResponse.json();
    const fixedDeparturesData = await fixedDeparturesResponse.json();

    console.log('Backend URL:', API_CONFIG.BACKEND_URL);
    console.log('Fixed departures data:', fixedDeparturesData);
    console.log('Tour types data:', tourTypesData);

    // Ensure we have both international and india tour types
    const requiredTourTypes = ['international', 'india'];
    const availableTourTypes = tourTypesData.tourTypes || [];
    const allTourTypes = [...new Set([...availableTourTypes, ...requiredTourTypes])];

    // Fetch destinations and packages for each tour type
    const tourTypeData = await Promise.all(
      allTourTypes.map(async (tourType: string) => {
        // Fetch destinations
        const destinationsResponse = await fetch(
          `${API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.DESTINATIONS.ALL)}?tourType=${tourType}&limit=100`
        );

        // Fetch packages
        const packagesResponse = await fetch(
          `${API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.PACKAGES.ALL)}?tourType=${tourType}&limit=100`
        );

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

        // Get fixed departures for this tour type
        const fixedDepartures = fixedDeparturesData.fixedDepartures || [];
        const tourTypeFixedDepartures = fixedDepartures.filter((fd: any) =>
          fd.tourType === tourType
        );

        console.log(`Tour type: ${tourType}`);
        console.log(`Total fixed departures: ${fixedDepartures.length}`);
        console.log(`Filtered fixed departures for ${tourType}:`, tourTypeFixedDepartures);

        // Combine destinations, packages, and fixed departures
        const allItems = [
          ...destinations.map((dest: {
            _id: string;
            name: string;
            location: string;
            image: string;
            category: string;
            isTrending: boolean;
            state?: string;
          }) => ({
            id: dest._id,
            name: dest.name,
            location: dest.location,
            image: dest.image,
            category: dest.category,
            isTrending: dest.isTrending,
            type: 'destination',
            state: dest.state || 'Other'
          })),
          ...packages.map((pkg: {
            _id: string;
            title: string;
            destination: string;
            images?: string[];
            category: string;
            isFeatured: boolean;
            state?: string;
          }) => ({
            id: pkg._id,
            name: pkg.title,
            location: pkg.destination,
            image: pkg.images?.[0] || '/images/placeholder-travel.jpg',
            category: pkg.category,
            isTrending: pkg.isFeatured || false,
            type: 'package',
            state: pkg.state || 'Other'
          })),
          ...tourTypeFixedDepartures.map((fd: {
            _id: string;
            title: string;
            destination: string;
            images?: string[];
            category: string;
            isFeatured: boolean;
            state?: string;
            tourType: string;
          }) => ({
            id: fd._id,
            name: fd.title,
            location: fd.destination,
            image: fd.images?.[0] || '/images/placeholder-travel.jpg',
            category: fd.category,
            isTrending: fd.isFeatured || false,
            type: 'fixed-departure',
            state: fd.state || 'Other'
          }))
        ];

        return {
          tourType,
          items: allItems
        };
      })
    );

    console.log('Tour type data before organization:', tourTypeData);

    // Organize data by tour type and state
    const organizedData = tourTypeData.map(({ tourType, items }) => {
      // Group items by state
      const itemsByState = items.reduce((acc: {
        [key: string]: Array<{
          id: string;
          name: string;
          location: string;
          image: string;
          category: string;
          isTrending: boolean;
          type: string;
        }>
      }, item: {
        id: string;
        name: string;
        location: string;
        image: string;
        category: string;
        isTrending: boolean;
        type: string;
        state?: string;
      }) => {
        const state = item.state || 'Other';
        if (!acc[state]) {
          acc[state] = [];
        }
        acc[state].push({
          id: item.id,
          name: item.name,
          location: item.location,
          image: item.image,
          category: item.category,
          isTrending: item.isTrending,
          type: item.type
        });
        return acc;
      }, {});

      // Debug logging
      console.log(`Tour type: ${tourType}`);
      console.log(`Total items: ${items.length}`);
      console.log(`Items by state:`, itemsByState);

      // For India tours, ensure we have proper state names and organize packages better
      if (tourType === 'india') {
        // Map common state variations to standard names
        const stateMapping: { [key: string]: string } = {
          'himachal pradesh': 'Himachal Pradesh',
          'himachal': 'Himachal Pradesh',
          'hp': 'Himachal Pradesh',
          'uttarakhand': 'Uttarakhand',
          'uk': 'Uttarakhand',
          'rajasthan': 'Rajasthan',
          'raj': 'Rajasthan',
          'kerala': 'Kerala',
          'kl': 'Kerala',
          'karnataka': 'Karnataka',
          'ka': 'Karnataka',
          'tamil nadu': 'Tamil Nadu',
          'tn': 'Tamil Nadu',
          'goa': 'Goa',
          'gujarat': 'Gujarat',
          'gj': 'Gujarat',
          'maharashtra': 'Maharashtra',
          'mh': 'Maharashtra',
          'madhya pradesh': 'Madhya Pradesh',
          'mp': 'Madhya Pradesh',
          'west bengal': 'West Bengal',
          'wb': 'West Bengal',
          'odisha': 'Odisha',
          'orissa': 'Odisha',
          'or': 'Odisha',
          'bihar': 'Bihar',
          'jharkhand': 'Jharkhand',
          'jh': 'Jharkhand',
          'assam': 'Assam',
          'arunachal pradesh': 'Arunachal Pradesh',
          'ar': 'Arunachal Pradesh',
          'manipur': 'Manipur',
          'meghalaya': 'Meghalaya',
          'mizoram': 'Mizoram',
          'nagaland': 'Nagaland',
          'tripura': 'Tripura',
          'sikkim': 'Sikkim',
          'punjab': 'Punjab',
          'pb': 'Punjab',
          'haryana': 'Haryana',
          'hr': 'Haryana',
          'delhi': 'Delhi',
          'ncr': 'Delhi',
          'jammu and kashmir': 'Jammu & Kashmir',
          'jk': 'Jammu & Kashmir',
          'ladakh': 'Ladakh',
          'chandigarh': 'Chandigarh',
          'ch': 'Chandigarh'
        };

        // Normalize state names
        const normalizedItemsByState: {
          [key: string]: Array<{
            id: string;
            name: string;
            location: string;
            image: string;
            category: string;
            isTrending: boolean;
            type: string;
          }>
        } = {};

        Object.keys(itemsByState).forEach(state => {
          const normalizedState = stateMapping[state.toLowerCase()] || state;
          if (!normalizedItemsByState[normalizedState]) {
            normalizedItemsByState[normalizedState] = [];
          }
          normalizedItemsByState[normalizedState].push(...itemsByState[state]);
        });

        // Sort states by popularity (number of packages)
        const sortedStates = Object.keys(normalizedItemsByState).sort((a, b) => {
          return normalizedItemsByState[b].length - normalizedItemsByState[a].length;
        });

        console.log(`India tour normalized states:`, normalizedItemsByState);
        console.log(`India tour sorted states:`, sortedStates);

        // Return states with destinations/packages for India tours
        return {
          tourType,
          states: sortedStates.map(state => ({
            name: state,
            destinations: normalizedItemsByState[state] || []
          }))
        };
      }

      // For international tours, organize by country first, then by state
      if (tourType === 'international') {
        // For international tours, parse location to extract country and city/state
        const itemsByCountry: {
          [key: string]: {
            [key: string]: Array<{
              id: string;
              name: string;
              location: string;
              image: string;
              category: string;
              isTrending: boolean;
              type: string;
            }>
          }
        } = {};

        // Process each item directly instead of relying on state grouping
        items.forEach(item => {
          const locationParts = item.location.split(',').map((part: string) => part.trim());

          // For international tours, assume format: "City, Country" or "City, State, Country"
          let country, cityState;

          if (locationParts.length === 2) {
            // Format: "City, Country"
            cityState = locationParts[0];
            country = locationParts[1];
          } else if (locationParts.length >= 3) {
            // Format: "City, State, Country" - combine city and state
            cityState = locationParts.slice(0, -1).join(', ');
            country = locationParts[locationParts.length - 1];
          } else {
            // Fallback
            cityState = locationParts[0] || 'Other';
            country = locationParts[1] || 'Other';
          }

          // Clean up country names and handle edge cases
          if (country === 'UAE') country = 'United Arab Emirates';
          if (country === 'Other' && cityState) {
            // If country is "Other", try to extract from cityState or use a default
            if (cityState.includes('Singapore')) country = 'Singapore';
            else if (cityState.includes('Malaysia')) country = 'Malaysia';
            else if (cityState.includes('Maldives')) country = 'Maldives';
            else if (cityState.includes('Nepal')) country = 'Nepal';
            else if (cityState.includes('Switzerland')) country = 'Switzerland';
            else if (cityState.includes('Sangreti') || cityState.includes('Serengeti')) country = 'Tanzania';
            else if (cityState.includes('Bali')) country = 'Indonesia';
            else if (cityState.includes('Amazon')) country = 'Brazil';
            else country = cityState; // Use cityState as country if no match found
          }

          if (!itemsByCountry[country]) {
            itemsByCountry[country] = {};
          }
          if (!itemsByCountry[country][cityState]) {
            itemsByCountry[country][cityState] = [];
          }
          itemsByCountry[country][cityState].push(item);
        });

        // Convert to the required format: countries with states
        const countries = Object.keys(itemsByCountry).map(country => ({
          name: country,
          states: Object.keys(itemsByCountry[country]).map(state => ({
            name: state,
            destinations: itemsByCountry[country][state]
          }))
        }));

        console.log(`International tour countries:`, countries);
        console.log(`International tour itemsByCountry:`, itemsByCountry);

        return {
          tourType,
          countries
        };
      }

      // For other tour types, return the processed states
      return {
        tourType,
        states: Object.keys(itemsByState).map(state => ({
          name: state,
          destinations: itemsByState[state]
        }))
      };
    });

    console.log('Final organized data:', organizedData);

    return NextResponse.json({
      tourTypes: organizedData,
      availableCountries: countriesData.countries || [],
      availableStates: statesData.states || []
    });
  } catch (error) {
    console.error('Tour types API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
