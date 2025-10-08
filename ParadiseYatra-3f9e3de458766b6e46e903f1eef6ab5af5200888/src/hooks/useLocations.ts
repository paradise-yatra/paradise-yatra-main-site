import { useState, useEffect, useCallback } from 'react';

interface Country {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  phone_code: string;
  capital: string;
  currency: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  subregion: string;
  timezones: Array<{
    zoneName: string;
    gmtOffset: number;
    gmtOffsetName: string;
    abbreviation: string;
    tzName: string;
  }>;
  latitude: string;
  longitude: string;
  emoji: string;
  emojiU: string;
}

interface State {
  id: number;
  name: string;
  state_code?: string;
  latitude?: string;
  longitude?: string;
  type?: string;
}

interface UseLocationsReturn {
  countries: Country[];
  states: State[];
  loading: boolean;
  error: string | null;
  fetchCountries: () => Promise<void>;
  fetchStates: (countryIso2: string) => Promise<void>;
  clearStates: () => void;
  getCountryByIso2: (iso2: string) => Country | undefined;
  getStateById: (stateId: string) => State | undefined;
}

export const useLocations = (): UseLocationsReturn => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCountries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/locations/countries');
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }
      
      const data = await response.json();
      setCountries(data.countries || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch countries');
      console.error('Error fetching countries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStates = useCallback(async (countryIso2: string) => {
    if (!countryIso2) {
      setStates([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/locations/states/${countryIso2}`);
      if (!response.ok) {
        throw new Error('Failed to fetch states');
      }
      
      const data = await response.json();
      setStates(data.states || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch states');
      console.error('Error fetching states:', err);
      setStates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearStates = useCallback(() => {
    setStates([]);
  }, []);

  const getCountryByIso2 = useCallback((iso2: string): Country | undefined => {
    return countries.find(country => country.iso2 === iso2);
  }, [countries]);

  const getStateById = useCallback((stateId: string): State | undefined => {
    return states.find(state => state.id.toString() === stateId);
  }, [states]);

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  return {
    countries,
    states,
    loading,
    error,
    fetchCountries,
    fetchStates,
    clearStates,
    getCountryByIso2,
    getStateById
  };
};
