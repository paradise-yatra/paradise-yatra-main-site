"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Package,
  Globe,
  Plane,
  Mountain,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";


interface DayItinerary {
  day: number;
  title: string;
  activities: string[];
  image: string;
}

interface Package {
  _id: string;
  title: string;
  slug: string;
  itinerary: DayItinerary[];
  category: string;
  duration: string;
  destination: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  terms?: string[];
}

interface HolidayType {
  _id: string;
  title: string;
  slug: string;
  itinerary: DayItinerary[];
  duration: string;
  travelers: string;
  badge: string;
  price: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  terms?: string[];
}

interface FixedDeparture {
  _id: string;
  title: string;
  slug: string;
  itinerary: DayItinerary[];
  duration: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  price: number;
  status: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  terms?: string[];
}

interface PopularDestinationPackage {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  image: string;
  location: string;
  country: string;
  state: string;
  tourType: 'international' | 'india';
  category: string;
  rating: number;
  price: number;
  duration: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  terms?: string[];
  isActive: boolean;
  isTrending: boolean;
  visitCount: number;
  itinerary: DayItinerary[];
}

interface AdventurePackage {
  _id: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  category: string;
  itinerary: DayItinerary[];
  isActive: boolean;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  terms?: string[];
}

type ItemType = 'trending' | 'premium' | 'package' | 'holiday' | 'fixed-departure' | 'popular-destination' | 'adventure';

interface SelectedItem {
  type: ItemType;
  data: Package | HolidayType | FixedDeparture | PopularDestinationPackage | AdventurePackage;
}

const AdminItinerary = () => {
  const [trendingPackages, setTrendingPackages] = useState<Package[]>([]);
  const [premiumPackages, setPremiumPackages] = useState<Package[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [holidayTypes, setHolidayTypes] = useState<HolidayType[]>([]);
  const [fixedDepartures, setFixedDepartures] = useState<FixedDeparture[]>([]);
  const [popularDestinationPackages, setPopularDestinationPackages] = useState<PopularDestinationPackage[]>([]);
  const [adventurePackages, setAdventurePackages] = useState<AdventurePackage[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDay, setEditingDay] = useState<DayItinerary | null>(null);
  const [isAddingDay, setIsAddingDay] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditingHighlights, setIsEditingHighlights] = useState(false);
  const [packageHighlights, setPackageHighlights] = useState<string[]>([]);
  const [isEditingInclusions, setIsEditingInclusions] = useState(false);
  const [packageInclusions, setPackageInclusions] = useState<string[]>([]);
  const [isEditingExclusions, setIsEditingExclusions] = useState(false);
  const [packageExclusions, setPackageExclusions] = useState<string[]>([]);
  const [isEditingTerms, setIsEditingTerms] = useState(false);
  const [packageTerms, setPackageTerms] = useState<string[]>([]);
  const [newDay, setNewDay] = useState<Partial<DayItinerary>>({
    day: 1,
    title: "",
    activities: [""],
    image: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch trending packages, premium packages, packages, holiday types, fixed departures, popular destinations, and adventure packages
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const [trendingPackagesResponse, premiumPackagesResponse, packagesResponse, holidayTypesResponse, fixedDeparturesResponse, popularDestinationsResponse, adventurePackagesResponse] = await Promise.all([
        fetch('/api/packages?category=Trending%20Destinations', { headers }),
        fetch('/api/packages?category=Premium%20Packages', { headers }),
        fetch('/api/packages', { headers }),
        fetch('/api/holiday-types'),
        fetch('/api/fixed-departures'),
        fetch('/api/destinations'),
        fetch('/api/packages?category=Adventure%20Tours')
      ]);

      if (!trendingPackagesResponse.ok) {
        throw new Error('Failed to fetch trending packages');
      }
      if (!premiumPackagesResponse.ok) {
        throw new Error('Failed to fetch premium packages');
      }
      if (!packagesResponse.ok) {
        throw new Error('Failed to fetch packages');
      }
      if (!holidayTypesResponse.ok) {
        throw new Error('Failed to fetch holiday types');
      }
      if (!fixedDeparturesResponse.ok) {
        throw new Error('Failed to fetch fixed departures');
      }
      if (!popularDestinationsResponse.ok) {
        throw new Error('Failed to fetch popular destination packages');
      }
      if (!adventurePackagesResponse.ok) {
        throw new Error('Failed to fetch adventure packages');
      }

      const trendingPackagesData = await trendingPackagesResponse.json();
      const premiumPackagesData = await premiumPackagesResponse.json();
      const packagesData = await packagesResponse.json();
      const holidayTypesData = await holidayTypesResponse.json();
      const fixedDeparturesData = await fixedDeparturesResponse.json();
      const popularDestinationsData = await popularDestinationsResponse.json();
      const adventurePackagesData = await adventurePackagesResponse.json();

      // Ensure all trending packages have itinerary arrays
      const normalizedTrendingPackages = (Array.isArray(trendingPackagesData) ? trendingPackagesData : (trendingPackagesData.packages || trendingPackagesData)).map((pkg: {
        _id: string;
        itinerary?: Array<{
          day: number;
          title: string;
          activities: string[];
          image: string;
        }>;
      }) => ({
        ...pkg,
        itinerary: Array.isArray(pkg.itinerary) ? pkg.itinerary : []
      }));
      setTrendingPackages(Array.isArray(normalizedTrendingPackages) ? normalizedTrendingPackages : []);

      // Ensure all premium packages have itinerary arrays
      const normalizedPremiumPackages = (Array.isArray(premiumPackagesData) ? premiumPackagesData : (premiumPackagesData.packages || premiumPackagesData)).map((pkg: {
        _id: string;
        itinerary?: Array<{
          day: number;
          title: string;
          activities: string[];
          image: string;
        }>;
      }) => ({
        ...pkg,
        itinerary: Array.isArray(pkg.itinerary) ? pkg.itinerary : []
      }));
      setPremiumPackages(Array.isArray(normalizedPremiumPackages) ? normalizedPremiumPackages : []);

      // Ensure all packages have itinerary arrays
      const normalizedPackages = (packagesData.packages || packagesData).map((pkg: {
        _id: string;
        itinerary?: Array<{
          day: number;
          title: string;
          activities: string[];
          image: string;
        }>;
      }) => ({
        ...pkg,
        itinerary: Array.isArray(pkg.itinerary) ? pkg.itinerary : []
      }));
      setPackages(normalizedPackages);

      // Ensure all holiday types have itinerary arrays
      const normalizedHolidayTypes = holidayTypesData.map((holiday: {
        _id: string;
        itinerary?: Array<{
          day: number;
          title: string;
          activities: string[];
          image: string;
        }>;
      }) => ({
        ...holiday,
        itinerary: Array.isArray(holiday.itinerary) ? holiday.itinerary : []
      }));
      setHolidayTypes(normalizedHolidayTypes);

      // Ensure all fixed departures have itinerary arrays
      const normalizedFixedDepartures = (fixedDeparturesData.fixedDepartures || fixedDeparturesData).map((departure: {
        _id: string;
        itinerary?: Array<{
          day: number;
          title: string;
          activities: string[];
          image: string;
        }>;
      }) => ({
        ...departure,
        itinerary: Array.isArray(departure.itinerary) ? departure.itinerary : []
      }));
      setFixedDepartures(normalizedFixedDepartures);
      // Ensure popularDestinationPackages is always an array
      const popularDestinationsArray = Array.isArray(popularDestinationsData)
        ? popularDestinationsData
        : Array.isArray(popularDestinationsData.destinations)
          ? popularDestinationsData.destinations
          : Array.isArray(popularDestinationsData.packages)
            ? popularDestinationsData.packages
            : [];
      // Ensure all popular destination packages have itinerary arrays
      const normalizedPopularDestinations = popularDestinationsArray.map((dest: {
        _id: string;
        itinerary?: Array<{
          day: number;
          title: string;
          activities: string[];
          image: string;
        }>;
      }) => ({
        ...dest,
        itinerary: Array.isArray(dest.itinerary) ? dest.itinerary : []
      }));
      setPopularDestinationPackages(normalizedPopularDestinations);

      // Ensure all adventure packages have itinerary arrays
      const adventurePackagesArray = Array.isArray(adventurePackagesData)
        ? adventurePackagesData
        : Array.isArray(adventurePackagesData.packages)
          ? adventurePackagesData.packages
          : [];
      const normalizedAdventurePackages = adventurePackagesArray.map((adv: {
        _id: string;
        itinerary?: Array<{
          day: number;
          title: string;
          activities: string[];
          image: string;
        }>;
      }) => ({
        ...adv,
        itinerary: Array.isArray(adv.itinerary) ? adv.itinerary : []
      }));
      setAdventurePackages(normalizedAdventurePackages);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // normalize item data to guarantee arrays for CRUD (prevents undefined errors)
  const normalizeItemData = (item: any) => ({
    ...item,
    itinerary: Array.isArray(item?.itinerary) ? item.itinerary : [],
    highlights: Array.isArray(item?.highlights) ? item.highlights : [],
    inclusions: Array.isArray(item?.inclusions) ? item.inclusions : [],
    exclusions: Array.isArray(item?.exclusions) ? item.exclusions : [],
    terms: Array.isArray(item?.terms) ? item.terms : [],
  });

  const handleItemSelect = (type: ItemType, itemId: string) => {
    let item: Package | HolidayType | FixedDeparture | PopularDestinationPackage | AdventurePackage | null = null;

    if (type === 'trending') {
      item = trendingPackages.find(p => p._id === itemId) || null;
    } else if (type === 'premium') {
      item = premiumPackages.find(p => p._id === itemId) || null;
    } else if (type === 'package') {
      item = packages.find(p => p._id === itemId) || null;
    } else if (type === 'holiday') {
      item = holidayTypes.find(h => h._id === itemId) || null;
    } else if (type === 'fixed-departure') {
      item = fixedDepartures.find(f => f._id === itemId) || null;
    } else if (type === 'popular-destination') {
      item = popularDestinationPackages.find(p => p._id === itemId) || null;
    } else if (type === 'adventure') {
      item = adventurePackages.find(a => a._id === itemId) || null;
    }

    setSelectedItem(item ? {
      type,
      data: normalizeItemData(item)
    } : null);
    setIsEditing(false);
    setEditingDay(null);
    setIsAddingDay(false);
    setError(null);
    setSuccess(null);
    // Reset newDay state when selecting a new item
    setNewDay({
      day: 1,
      title: "",
      activities: [""],
      image: ""
    });
  };

  const handleEditDay = (day: DayItinerary) => {
    setEditingDay({
      ...day,
      activities: Array.isArray(day.activities) ? day.activities : [""]
    });
    setIsEditing(true);
    setError(null);
  };

  const handleSaveDay = async () => {
    if (!selectedItem || !editingDay) return;

    try {
      setIsSaving(true);
      setError(null);

      const updatedItinerary = (selectedItem.data.itinerary || []).map(day =>
        day.day === editingDay.day ? editingDay : day
      );

      let endpoint = '';
      if (selectedItem.type === 'trending' || selectedItem.type === 'premium' || selectedItem.type === 'package' || selectedItem.type === 'adventure') {
        endpoint = `/api/packages/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'holiday') {
        endpoint = `/api/holiday-types/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'fixed-departure') {
        endpoint = `/api/fixed-departures/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'popular-destination') {
        endpoint = `/api/destinations/${selectedItem.data._id}`;
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          itinerary: updatedItinerary
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update day' }));
        throw new Error(errorData.message || `Failed to update day: ${response.status} ${response.statusText}`);
      }

      const updatedData = await response.json();
      console.log('Update Day Response:', updatedData);

      let updatedItem;
      if (selectedItem.type === 'trending' || selectedItem.type === 'premium' || selectedItem.type === 'package' || selectedItem.type === 'adventure') {
        updatedItem = updatedData.package || updatedData.packages?.[0] || updatedData;
      } else if (selectedItem.type === 'holiday') {
        updatedItem = updatedData.holidayType || updatedData;
      } else if (selectedItem.type === 'fixed-departure') {
        updatedItem = updatedData.fixedDeparture || updatedData;
      } else if (selectedItem.type === 'popular-destination') {
        updatedItem = updatedData.destination || updatedData;
      }

      if (!updatedItem || !updatedItem._id) {
        console.error('Invalid response structure:', updatedData);
        throw new Error('Invalid response from server');
      }

      const normalized = normalizeItemData({
        ...updatedItem,
        itinerary: Array.isArray(updatedItem.itinerary) ? updatedItem.itinerary : updatedItinerary
      });
      setSelectedItem({ type: selectedItem.type, data: normalized });
      // keep collections in sync for immediate UI feedback
      if (selectedItem.type === 'trending') {
        setTrendingPackages(prev => prev.map(p => p._id === normalized._id ? normalized : p));
      } else if (selectedItem.type === 'premium') {
        setPremiumPackages(prev => prev.map(p => p._id === normalized._id ? normalized : p));
      } else if (selectedItem.type === 'package') {
        setPackages(prev => prev.map(p => p._id === normalized._id ? normalized : p));
      } else if (selectedItem.type === 'holiday') {
        setHolidayTypes(prev => prev.map(p => p._id === normalized._id ? normalized as HolidayType : p));
      } else if (selectedItem.type === 'fixed-departure') {
        setFixedDepartures(prev => prev.map(p => p._id === normalized._id ? normalized as FixedDeparture : p));
      } else if (selectedItem.type === 'popular-destination') {
        setPopularDestinationPackages(prev => prev.map(p => p._id === normalized._id ? normalized as PopularDestinationPackage : p));
      } else if (selectedItem.type === 'adventure') {
        setAdventurePackages(prev => prev.map(p => p._id === normalized._id ? normalized as AdventurePackage : p));
      }
      setIsEditing(false);
      setEditingDay(null);
      setSuccess('Day updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating day:', error);
      setError(error instanceof Error ? error.message : 'Failed to update day');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDay = async (dayNumber: number) => {
    if (!selectedItem) return;

    if (!confirm(`Are you sure you want to delete Day ${dayNumber}?`)) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const updatedItinerary = (selectedItem.data.itinerary || [])
        .filter(day => day.day !== dayNumber)
        .map((day, index) => ({ ...day, day: index + 1 }));

      let endpoint = '';
      if (selectedItem.type === 'trending' || selectedItem.type === 'premium' || selectedItem.type === 'package' || selectedItem.type === 'adventure') {
        endpoint = `/api/packages/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'holiday') {
        endpoint = `/api/holiday-types/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'fixed-departure') {
        endpoint = `/api/fixed-departures/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'popular-destination') {
        endpoint = `/api/destinations/${selectedItem.data._id}`;
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          itinerary: updatedItinerary
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete day' }));
        throw new Error(errorData.message || `Failed to delete day: ${response.status} ${response.statusText}`);
      }

      const updatedData = await response.json();
      console.log('Delete Day Response:', updatedData);

      let updatedItem;
      if (selectedItem.type === 'trending' || selectedItem.type === 'premium' || selectedItem.type === 'package' || selectedItem.type === 'adventure') {
        updatedItem = updatedData.package || updatedData.packages?.[0] || updatedData;
      } else if (selectedItem.type === 'holiday') {
        updatedItem = updatedData.holidayType || updatedData;
      } else if (selectedItem.type === 'fixed-departure') {
        updatedItem = updatedData.fixedDeparture || updatedData;
      } else if (selectedItem.type === 'popular-destination') {
        updatedItem = updatedData.destination || updatedData;
      }

      if (!updatedItem || !updatedItem._id) {
        console.error('Invalid response structure:', updatedData);
        throw new Error('Invalid response from server');
      }

      const normalized = normalizeItemData({
        ...updatedItem,
        itinerary: Array.isArray(updatedItem.itinerary) ? updatedItem.itinerary : updatedItinerary
      });
      setSelectedItem({ type: selectedItem.type, data: normalized });
      if (selectedItem.type === 'trending') {
        setTrendingPackages(prev => prev.map(p => p._id === normalized._id ? normalized : p));
      } else if (selectedItem.type === 'premium') {
        setPremiumPackages(prev => prev.map(p => p._id === normalized._id ? normalized : p));
      } else if (selectedItem.type === 'package') {
        setPackages(prev => prev.map(p => p._id === normalized._id ? normalized : p));
      } else if (selectedItem.type === 'holiday') {
        setHolidayTypes(prev => prev.map(p => p._id === normalized._id ? normalized as HolidayType : p));
      } else if (selectedItem.type === 'fixed-departure') {
        setFixedDepartures(prev => prev.map(p => p._id === normalized._id ? normalized as FixedDeparture : p));
      } else if (selectedItem.type === 'popular-destination') {
        setPopularDestinationPackages(prev => prev.map(p => p._id === normalized._id ? normalized as PopularDestinationPackage : p));
      } else if (selectedItem.type === 'adventure') {
        setAdventurePackages(prev => prev.map(p => p._id === normalized._id ? normalized as AdventurePackage : p));
      }
      setSuccess('Day deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error deleting day:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete day');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddDay = async () => {
    if (!selectedItem) {
      setError('No package selected');
      return;
    }

    // Validate title
    if (!newDay.title || newDay.title.trim() === "") {
      setError('Please enter a day title');
      return;
    }

    // Validate activities - must have at least one non-empty activity
    const validActivities = (newDay.activities || []).filter(activity => activity && activity.trim() !== "");
    if (validActivities.length === 0) {
      setError('Please add at least one activity');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const dayToAdd: DayItinerary = {
        day: (selectedItem.data.itinerary || []).length + 1,
        title: newDay.title.trim(),
        activities: validActivities,
        image: ""
      };

      const updatedItinerary = [...(selectedItem.data.itinerary || []), dayToAdd];

      let endpoint = '';
      if (selectedItem.type === 'trending' || selectedItem.type === 'premium' || selectedItem.type === 'package' || selectedItem.type === 'adventure') {
        endpoint = `/api/packages/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'holiday') {
        endpoint = `/api/holiday-types/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'fixed-departure') {
        endpoint = `/api/fixed-departures/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'popular-destination') {
        endpoint = `/api/destinations/${selectedItem.data._id}`;
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          itinerary: updatedItinerary
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to add day' }));
        throw new Error(errorData.message || `Failed to add day: ${response.status} ${response.statusText}`);
      }

      const updatedData = await response.json();
      console.log('Add Day Response:', updatedData);

      let updatedItem;
      if (selectedItem.type === 'trending' || selectedItem.type === 'premium' || selectedItem.type === 'package' || selectedItem.type === 'adventure') {
        updatedItem = updatedData.package || updatedData.packages?.[0] || updatedData;
      } else if (selectedItem.type === 'holiday') {
        updatedItem = updatedData.holidayType || updatedData;
      } else if (selectedItem.type === 'fixed-departure') {
        updatedItem = updatedData.fixedDeparture || updatedData;
      } else if (selectedItem.type === 'popular-destination') {
        updatedItem = updatedData.destination || updatedData;
      }

      if (!updatedItem || !updatedItem._id) {
        console.error('Invalid response structure:', updatedData);
        throw new Error('Invalid response from server');
      }

      const normalized = normalizeItemData({
        ...updatedItem,
        itinerary: Array.isArray(updatedItem.itinerary) ? updatedItem.itinerary : updatedItinerary
      });
      setSelectedItem({ type: selectedItem.type, data: normalized });
      if (selectedItem.type === 'trending') {
        setTrendingPackages(prev => prev.map(p => p._id === normalized._id ? normalized : p));
      } else if (selectedItem.type === 'premium') {
        setPremiumPackages(prev => prev.map(p => p._id === normalized._id ? normalized : p));
      } else if (selectedItem.type === 'package') {
        setPackages(prev => prev.map(p => p._id === normalized._id ? normalized : p));
      } else if (selectedItem.type === 'holiday') {
        setHolidayTypes(prev => prev.map(p => p._id === normalized._id ? normalized as HolidayType : p));
      } else if (selectedItem.type === 'fixed-departure') {
        setFixedDepartures(prev => prev.map(p => p._id === normalized._id ? normalized as FixedDeparture : p));
      } else if (selectedItem.type === 'popular-destination') {
        setPopularDestinationPackages(prev => prev.map(p => p._id === normalized._id ? normalized as PopularDestinationPackage : p));
      } else if (selectedItem.type === 'adventure') {
        setAdventurePackages(prev => prev.map(p => p._id === normalized._id ? normalized as AdventurePackage : p));
      }
      setIsAddingDay(false);
      setNewDay({
        day: 1,
        title: "",
        activities: [""],
        image: ""
      });
      setSuccess('Day added successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error adding day:', error);
      setError(error instanceof Error ? error.message : 'Failed to add day');
    } finally {
      setIsSaving(false);
    }
  };

  const addActivityField = () => {
    setNewDay(prev => ({
      ...prev,
      activities: [...(prev.activities || [""]), ""]
    }));
  };

  const updateActivity = (index: number, value: string) => {
    setNewDay(prev => ({
      ...prev,
      activities: (prev.activities || [""]).map((activity, i) => i === index ? value : activity)
    }));
  };

  const removeActivity = (index: number) => {
    setNewDay(prev => ({
      ...prev,
      activities: (prev.activities || [""]).filter((_, i) => i !== index)
    }));
  };

  const addPackageHighlight = () => {
    setPackageHighlights(prev => [...prev, ""]);
  };

  const updatePackageHighlight = (index: number, value: string) => {
    setPackageHighlights(prev => prev.map((highlight, i) => i === index ? value : highlight));
  };

  const removePackageHighlight = (index: number) => {
    setPackageHighlights(prev => prev.filter((_, i) => i !== index));
  };

  const addPackageInclusion = () => {
    setPackageInclusions(prev => [...prev, ""]);
  };

  const updatePackageInclusion = (index: number, value: string) => {
    setPackageInclusions(prev => prev.map((inclusion, i) => i === index ? value : inclusion));
  };

  const removePackageInclusion = (index: number) => {
    setPackageInclusions(prev => prev.filter((_, i) => i !== index));
  };

  const addPackageExclusion = () => {
    setPackageExclusions(prev => [...prev, ""]);
  };

  const updatePackageExclusion = (index: number, value: string) => {
    setPackageExclusions(prev => prev.map((exclusion, i) => i === index ? value : exclusion));
  };

  const removePackageExclusion = (index: number) => {
    setPackageExclusions(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditHighlights = () => {
    setPackageHighlights(Array.isArray(selectedItem?.data.highlights) ? selectedItem.data.highlights : []);
    setIsEditingHighlights(true);
  };

  const handleEditInclusions = () => {
    setPackageInclusions(Array.isArray(selectedItem?.data.inclusions) ? selectedItem?.data.inclusions : []);
    setIsEditingInclusions(true);
  };

  const handleEditExclusions = () => {
    setPackageExclusions(Array.isArray(selectedItem?.data.exclusions) ? selectedItem?.data.exclusions : []);
    setIsEditingExclusions(true);
  };

  const handleSaveHighlights = async () => {
    if (!selectedItem) return;

    try {
      setIsSaving(true);
      setError(null);

      const filteredHighlights = packageHighlights.filter(highlight => highlight.trim() !== "");

      let endpoint = '';
      if (selectedItem.type === 'trending' || selectedItem.type === 'premium' || selectedItem.type === 'package' || selectedItem.type === 'adventure') {
        endpoint = `/api/packages/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'holiday') {
        endpoint = `/api/holiday-types/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'fixed-departure') {
        endpoint = `/api/fixed-departures/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'popular-destination') {
        endpoint = `/api/destinations/${selectedItem.data._id}`;
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          highlights: filteredHighlights
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update highlights' }));
        throw new Error(errorData.message || `Failed to update highlights: ${response.status} ${response.statusText}`);
      }

      const updatedData = await response.json();
      console.log('Update Highlights Response:', updatedData);

      let updatedItem;
      if (selectedItem.type === 'trending' || selectedItem.type === 'premium' || selectedItem.type === 'package' || selectedItem.type === 'adventure') {
        updatedItem = updatedData.package || updatedData.packages?.[0] || updatedData;
      } else if (selectedItem.type === 'holiday') {
        updatedItem = updatedData.holidayType || updatedData;
      } else if (selectedItem.type === 'fixed-departure') {
        updatedItem = updatedData.fixedDeparture || updatedData;
      } else if (selectedItem.type === 'popular-destination') {
        updatedItem = updatedData.destination || updatedData;
      }

      if (!updatedItem || !updatedItem._id) {
        console.error('Invalid response structure:', updatedData);
        throw new Error('Invalid response from server');
      }

      const normalized = normalizeItemData({
        ...updatedItem,
        itinerary: Array.isArray(updatedItem.itinerary) ? updatedItem.itinerary : (selectedItem.data.itinerary || [])
      });
      setSelectedItem({ type: selectedItem.type, data: normalized });
      if (selectedItem.type === 'trending') {
        setTrendingPackages(prev => prev.map(p => p._id === normalized._id ? normalized : p));
      } else if (selectedItem.type === 'premium') {
        setPremiumPackages(prev => prev.map(p => p._id === normalized._id ? normalized : p));
      } else if (selectedItem.type === 'package') {
        setPackages(prev => prev.map(p => p._id === normalized._id ? normalized : p));
      } else if (selectedItem.type === 'holiday') {
        setHolidayTypes(prev => prev.map(p => p._id === normalized._id ? normalized as HolidayType : p));
      } else if (selectedItem.type === 'fixed-departure') {
        setFixedDepartures(prev => prev.map(p => p._id === normalized._id ? normalized as FixedDeparture : p));
      } else if (selectedItem.type === 'popular-destination') {
        setPopularDestinationPackages(prev => prev.map(p => p._id === normalized._id ? normalized as PopularDestinationPackage : p));
      } else if (selectedItem.type === 'adventure') {
        setAdventurePackages(prev => prev.map(p => p._id === normalized._id ? normalized as AdventurePackage : p));
      }
      setIsEditingHighlights(false);
      setSuccess('Highlights updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating highlights:', error);
      setError(error instanceof Error ? error.message : 'Failed to update highlights');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveInclusions = async () => {
    if (!selectedItem) return;

    try {
      setIsSaving(true);
      setError(null);

      const filteredInclusions = packageInclusions.filter(inclusion => inclusion.trim() !== "");

      let endpoint = '';
      if (selectedItem.type === 'trending' || selectedItem.type === 'premium' || selectedItem.type === 'package' || selectedItem.type === 'adventure') {
        endpoint = `/api/packages/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'holiday') {
        endpoint = `/api/holiday-types/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'fixed-departure') {
        endpoint = `/api/fixed-departures/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'popular-destination') {
        endpoint = `/api/destinations/${selectedItem.data._id}`;
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          inclusions: filteredInclusions
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update inclusions' }));
        throw new Error(errorData.message || `Failed to update inclusions: ${response.status} ${response.statusText}`);
      }

      const updatedData = await response.json();
      console.log('Update Inclusions Response:', updatedData);

      let updatedItem;
      if (selectedItem.type === 'trending' || selectedItem.type === 'premium' || selectedItem.type === 'package' || selectedItem.type === 'adventure') {
        updatedItem = updatedData.package || updatedData.packages?.[0] || updatedData;
      } else if (selectedItem.type === 'holiday') {
        updatedItem = updatedData.holidayType || updatedData;
      } else if (selectedItem.type === 'fixed-departure') {
        updatedItem = updatedData.fixedDeparture || updatedData;
      } else if (selectedItem.type === 'popular-destination') {
        updatedItem = updatedData.destination || updatedData;
      }

      if (!updatedItem || !updatedItem._id) {
        console.error('Invalid response structure:', updatedData);
        throw new Error('Invalid response from server');
      }

      const normalized = normalizeItemData({
        ...updatedItem,
        itinerary: Array.isArray(updatedItem.itinerary) ? updatedItem.itinerary : (selectedItem.data.itinerary || [])
      });
      setSelectedItem({ type: selectedItem.type, data: normalized });
      if (selectedItem.type === 'trending') {
        setTrendingPackages(prev => prev.map(p => p._id === normalized._id ? normalized : p));
      } else if (selectedItem.type === 'premium') {
        setPremiumPackages(prev => prev.map(p => p._id === normalized._id ? normalized : p));
      } else if (selectedItem.type === 'package') {
        setPackages(prev => prev.map(p => p._id === normalized._id ? normalized : p));
      } else if (selectedItem.type === 'holiday') {
        setHolidayTypes(prev => prev.map(p => p._id === normalized._id ? normalized as HolidayType : p));
      } else if (selectedItem.type === 'fixed-departure') {
        setFixedDepartures(prev => prev.map(p => p._id === normalized._id ? normalized as FixedDeparture : p));
      } else if (selectedItem.type === 'popular-destination') {
        setPopularDestinationPackages(prev => prev.map(p => p._id === normalized._id ? normalized as PopularDestinationPackage : p));
      } else if (selectedItem.type === 'adventure') {
        setAdventurePackages(prev => prev.map(p => p._id === normalized._id ? normalized as AdventurePackage : p));
      }
      setIsEditingInclusions(false);
      setSuccess('Inclusions updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating inclusions:', error);
      setError(error instanceof Error ? error.message : 'Failed to update inclusions');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveExclusions = async () => {
    if (!selectedItem) return;

    try {
      setIsSaving(true);
      setError(null);

      const filteredExclusions = packageExclusions.filter(exclusion => exclusion.trim() !== "");

      let endpoint = '';
      if (selectedItem.type === 'trending' || selectedItem.type === 'premium' || selectedItem.type === 'package' || selectedItem.type === 'adventure') {
        endpoint = `/api/packages/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'holiday') {
        endpoint = `/api/holiday-types/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'fixed-departure') {
        endpoint = `/api/fixed-departures/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'popular-destination') {
        endpoint = `/api/destinations/${selectedItem.data._id}`;
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          exclusions: filteredExclusions
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update exclusions' }));
        throw new Error(errorData.message || `Failed to update exclusions: ${response.status} ${response.statusText}`);
      }

      const updatedData = await response.json();
      console.log('Update Exclusions Response:', updatedData);

      let updatedItem;
      if (selectedItem.type === 'trending' || selectedItem.type === 'premium' || selectedItem.type === 'package' || selectedItem.type === 'adventure') {
        updatedItem = updatedData.package || updatedData.packages?.[0] || updatedData;
      } else if (selectedItem.type === 'holiday') {
        updatedItem = updatedData.holidayType || updatedData;
      } else if (selectedItem.type === 'fixed-departure') {
        updatedItem = updatedData.fixedDeparture || updatedData;
      } else if (selectedItem.type === 'popular-destination') {
        updatedItem = updatedData.destination || updatedData;
      }

      if (!updatedItem || !updatedItem._id) {
        console.error('Invalid response structure:', updatedData);
        throw new Error('Invalid response from server');
      }

      const normalized = normalizeItemData({
        ...updatedItem,
        itinerary: Array.isArray(updatedItem.itinerary) ? updatedItem.itinerary : (selectedItem.data.itinerary || [])
      });
      setSelectedItem({ type: selectedItem.type, data: normalized });
      if (selectedItem.type === 'trending') {
        setTrendingPackages(prev => prev.map(p => p._id === normalized._id ? normalized : p));
      } else if (selectedItem.type === 'premium') {
        setPremiumPackages(prev => prev.map(p => p._id === normalized._id ? normalized : p));
      } else if (selectedItem.type === 'package') {
        setPackages(prev => prev.map(p => p._id === normalized._id ? normalized : p));
      } else if (selectedItem.type === 'holiday') {
        setHolidayTypes(prev => prev.map(p => p._id === normalized._id ? normalized as HolidayType : p));
      } else if (selectedItem.type === 'fixed-departure') {
        setFixedDepartures(prev => prev.map(p => p._id === normalized._id ? normalized as FixedDeparture : p));
      } else if (selectedItem.type === 'popular-destination') {
        setPopularDestinationPackages(prev => prev.map(p => p._id === normalized._id ? normalized as PopularDestinationPackage : p));
      } else if (selectedItem.type === 'adventure') {
        setAdventurePackages(prev => prev.map(p => p._id === normalized._id ? normalized as AdventurePackage : p));
      }
      setIsEditingExclusions(false);
      setSuccess('Exclusions updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating exclusions:', error);
      setError(error instanceof Error ? error.message : 'Failed to update exclusions');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditTerms = () => {
    if (!selectedItem) return;
    setPackageTerms(selectedItem.data.terms || []);
    setIsEditingTerms(true);
  };

  const handleSaveTerms = async () => {
    if (!selectedItem) return;

    try {
      setIsSaving(true);
      setError(null);

      const filteredTerms = packageTerms.filter(term => term.trim() !== "");

      let endpoint = '';
      if (selectedItem.type === 'trending' || selectedItem.type === 'premium' || selectedItem.type === 'package' || selectedItem.type === 'adventure') {
        endpoint = `/api/packages/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'holiday') {
        endpoint = `/api/holiday-types/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'fixed-departure') {
        endpoint = `/api/fixed-departures/${selectedItem.data._id}`;
      } else if (selectedItem.type === 'popular-destination') {
        endpoint = `/api/destinations/${selectedItem.data._id}`;
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          terms: filteredTerms
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update terms' }));
        throw new Error(errorData.message || `Failed to update terms: ${response.status} ${response.statusText}`);
      }

      const updatedData = await response.json();

      let updatedItem;
      if (selectedItem.type === 'trending' || selectedItem.type === 'premium' || selectedItem.type === 'package' || selectedItem.type === 'adventure') {
        updatedItem = updatedData.package || updatedData.packages?.[0] || updatedData;
      } else if (selectedItem.type === 'holiday') {
        updatedItem = updatedData.holidayType || updatedData;
      } else if (selectedItem.type === 'fixed-departure') {
        updatedItem = updatedData.fixedDeparture || updatedData;
      } else if (selectedItem.type === 'popular-destination') {
        updatedItem = updatedData.destination || updatedData;
      }

      if (!updatedItem || !updatedItem._id) {
        throw new Error('Invalid response from server');
      }

      const normalized = normalizeItemData({
        ...updatedItem,
        itinerary: Array.isArray(updatedItem.itinerary) ? updatedItem.itinerary : (selectedItem.data.itinerary || [])
      });
      setSelectedItem({ type: selectedItem.type, data: normalized });
      if (selectedItem.type === 'trending') {
        setTrendingPackages(prev => prev.map(p => p._id === normalized._id ? normalized as Package : p));
      } else if (selectedItem.type === 'premium') {
        setPremiumPackages(prev => prev.map(p => p._id === normalized._id ? normalized as Package : p));
      } else if (selectedItem.type === 'package') {
        setPackages(prev => prev.map(p => p._id === normalized._id ? normalized as Package : p));
      } else if (selectedItem.type === 'holiday') {
        setHolidayTypes(prev => prev.map(p => p._id === normalized._id ? normalized as HolidayType : p));
      } else if (selectedItem.type === 'fixed-departure') {
        setFixedDepartures(prev => prev.map(p => p._id === normalized._id ? normalized as FixedDeparture : p));
      } else if (selectedItem.type === 'popular-destination') {
        setPopularDestinationPackages(prev => prev.map(p => p._id === normalized._id ? normalized as PopularDestinationPackage : p));
      } else if (selectedItem.type === 'adventure') {
        setAdventurePackages(prev => prev.map(p => p._id === normalized._id ? normalized as AdventurePackage : p));
      }
      setIsEditingTerms(false);
      setSuccess('Terms updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating terms:', error);
      setError(error instanceof Error ? error.message : 'Failed to update terms');
    } finally {
      setIsSaving(false);
    }
  };

  const updatePackageTerm = (index: number, value: string) => {
    const newTerms = [...packageTerms];
    newTerms[index] = value;
    setPackageTerms(newTerms);
  };

  const addPackageTerm = () => {
    setPackageTerms([...packageTerms, ""]);
  };

  const removePackageTerm = (index: number) => {
    setPackageTerms(packageTerms.filter((_, i) => i !== index));
  };

  // Helper function to get display name for different item types
  const getDisplayName = (item: Package | HolidayType | FixedDeparture | PopularDestinationPackage | AdventurePackage) => {
    if ('name' in item) {
      return item.name; // PopularDestinationPackage
    }
    return item.title; // Package, HolidayType, FixedDeparture, AdventurePackage
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
    >
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Itinerary Management
                  </h1>
                  <p className="text-gray-600 text-lg mt-1">
                    Design and manage comprehensive travel itineraries
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Packages</p>
                <p className="text-2xl font-bold text-blue-600">
                  {trendingPackages.length + premiumPackages.length + holidayTypes.length + fixedDepartures.length + popularDestinationPackages.length + adventurePackages.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Error/Success Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 flex items-center space-x-3 shadow-sm"
          >
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <span className="text-red-700 font-medium">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border-l-4 border-green-400 rounded-lg p-4 flex items-center space-x-3 shadow-sm"
          >
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            <span className="text-green-700 font-medium">{success}</span>
          </motion.div>
        )}

        {/* Enhanced Item Selection */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h2 className="text-2xl font-bold text-white mb-2">Select Travel Package</h2>
            <p className="text-blue-100">Choose from different types of travel packages to manage their itineraries</p>
          </div>

          <div className="p-6">
            {/* Modern Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                { type: 'trending', label: 'Trending Packages', icon: Star, count: trendingPackages.length, color: 'orange' },
                { type: 'premium', label: 'Premium Packages', icon: Star, count: premiumPackages.length, color: 'amber' },
                { type: 'holiday', label: 'Holiday Types', icon: Globe, count: holidayTypes.length, color: 'green' },
                { type: 'fixed-departure', label: 'Fixed Departures', icon: Plane, count: fixedDepartures.length, color: 'purple' },
                { type: 'popular-destination', label: 'Popular Destinations', icon: Mountain, count: popularDestinationPackages.length, color: 'orange' },
                { type: 'adventure', label: 'Adventure Tours', icon: Star, count: adventurePackages.length, color: 'red' }
              ].map(({ type, label, icon: Icon, count, color }) => (
                <button
                  key={type}
                  onClick={() => setSelectedItem(null)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${selectedItem?.type === type
                    ? `bg-${color}-500 text-white shadow-lg transform scale-105`
                    : `bg-gray-100 text-gray-700 hover:bg-${color}-50 hover:text-${color}-700`
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${selectedItem?.type === type
                    ? 'bg-white bg-opacity-20'
                    : `bg-${color}-100 text-${color}-700`
                    }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {/* Enhanced Package Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Trending Packages */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-orange-600" />
                  <label className="text-sm font-semibold text-gray-900">Trending Packages</label>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                    {trendingPackages.length}
                  </span>
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleItemSelect('trending', e.target.value);
                    }
                  }}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-300"
                >
                  <option value="">Select a trending package...</option>
                  {trendingPackages.map((pkg) => (
                    <option key={pkg._id} value={pkg._id}>
                      {pkg.title} - {pkg.category} ({pkg.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Premium Packages */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <label className="text-sm font-semibold text-gray-900">Premium Packages</label>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                    {premiumPackages.length}
                  </span>
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleItemSelect('premium', e.target.value);
                    }
                  }}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-300"
                >
                  <option value="">Select a premium package...</option>
                  {premiumPackages.map((pkg) => (
                    <option key={pkg._id} value={pkg._id}>
                      {pkg.title} - {pkg.category} ({pkg.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Holiday Types */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  <label className="text-sm font-semibold text-gray-900">Holiday Types</label>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    {holidayTypes.length}
                  </span>
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleItemSelect('holiday', e.target.value);
                    }
                  }}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-300"
                >
                  <option value="">Select a holiday type...</option>
                  {holidayTypes.map((holiday) => (
                    <option key={holiday._id} value={holiday._id}>
                      {holiday.title} - {holiday.badge} ({holiday.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Fixed Departures */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Plane className="w-5 h-5 text-purple-600" />
                  <label className="text-sm font-semibold text-gray-900">Fixed Departures</label>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                    {fixedDepartures.length}
                  </span>
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleItemSelect('fixed-departure', e.target.value);
                    }
                  }}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-300"
                >
                  <option value="">Select a fixed departure...</option>
                  {fixedDepartures.map((departure) => (
                    <option key={departure._id} value={departure._id}>
                      {departure.title} - {departure.destination} ({departure.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Popular Destinations */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mountain className="w-5 h-5 text-orange-600" />
                  <label className="text-sm font-semibold text-gray-900">Popular Destinations</label>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                    {popularDestinationPackages.length}
                  </span>
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleItemSelect('popular-destination', e.target.value);
                    }
                  }}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-300"
                >
                  <option value="">Select a destination...</option>
                  {Array.isArray(popularDestinationPackages) && popularDestinationPackages.length > 0 ? (
                    popularDestinationPackages.map((pkg) => (
                      <option key={pkg._id} value={pkg._id}>
                        {pkg.name} - {pkg.location} ({pkg.duration})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No destinations available</option>
                  )}
                </select>
              </div>

              {/* Adventure Tours */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-red-600" />
                  <label className="text-sm font-semibold text-gray-900">Adventure Tours</label>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                    {adventurePackages.length}
                  </span>
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleItemSelect('adventure', e.target.value);
                    }
                  }}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-300"
                >
                  <option value="">Select an adventure tour...</option>
                  {Array.isArray(adventurePackages) && adventurePackages.length > 0 ? (
                    adventurePackages.map((pkg) => (
                      <option key={pkg._id} value={pkg._id}>
                        {pkg.title} - {pkg.destination} ({pkg.duration})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No adventure tours available</option>
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>

        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Ensure itinerary is always an array */}
            {(() => {
              if (!Array.isArray(selectedItem.data.itinerary)) {
                selectedItem.data.itinerary = [];
              }
              return null;
            })()}

            {/* Enhanced Item Info Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                      {selectedItem.type === 'trending' ? (
                        <Star className="w-8 h-8 text-orange-500" />
                      ) : selectedItem.type === 'premium' ? (
                        <Star className="w-8 h-8 text-amber-500" />
                      ) : selectedItem.type === 'package' ? (
                        <Package className="w-8 h-8 text-green-500" />
                      ) : selectedItem.type === 'holiday' ? (
                        <Globe className="w-8 h-8 text-purple-500" />
                      ) : selectedItem.type === 'fixed-departure' ? (
                        <Plane className="w-8 h-8 text-orange-500" />
                      ) : selectedItem.type === 'popular-destination' ? (
                        <Mountain className="w-8 h-8 text-red-500" />
                      ) : (
                        <Star className="w-8 h-8 text-700" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{getDisplayName(selectedItem.data)}</h2>
                      <p className="!text-blue-100 capitalize">
                        {selectedItem.type.replace('-', ' ')} Package
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2">
                      <p className="!text-slate-900 text-sm font-medium">Itinerary Days</p>
                      <p className="text-3xl font-bold !text-slate-900">
                        {(selectedItem.data.itinerary || []).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(selectedItem.type === 'trending' || selectedItem.type === 'premium' || selectedItem.type === 'package') ? (
                    <>
                      <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                        <MapPin className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="text-sm !text-gray-500">Destination</p>
                          <p className="!font-semibold !text-gray-900">{(selectedItem.data as Package).destination}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                        <Clock className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="!text-sm !text-gray-500">Duration</p>
                          <p className="!font-semibold !text-gray-900">{selectedItem.data.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl">
                        <Package className="w-6 h-6 text-purple-600" />
                        <div>
                          <p className="text-sm !text-gray-500">Category</p>
                          <p className="!font-semibold !text-gray-900">{(selectedItem.data as Package).category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-xl">
                        <Calendar className="w-6 h-6 text-orange-600" />
                        <div>
                          <p className="text-sm !text-gray-500">Itinerary Days</p>
                          <p className="!font-semibold !text-gray-900">{(selectedItem.data.itinerary || []).length} Days</p>
                        </div>
                      </div>
                    </>
                  ) : selectedItem.type === 'holiday' ? (
                    <>
                      <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                        <Globe className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-500">Type</p>
                          <p className="font-semibold text-gray-900">{(selectedItem.data as HolidayType).badge}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                        <Clock className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-semibold text-gray-900">{selectedItem.data.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl">
                        <Calendar className="w-6 h-6 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-500">Travelers</p>
                          <p className="font-semibold text-gray-900">{(selectedItem.data as HolidayType).travelers}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-xl">
                        <Calendar className="w-6 h-6 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-500">Itinerary Days</p>
                          <p className="font-semibold text-gray-900">{(selectedItem.data.itinerary || []).length} Days</p>
                        </div>
                      </div>
                    </>
                  ) : selectedItem.type === 'fixed-departure' ? (
                    <>
                      <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl">
                        <MapPin className="w-6 h-6 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-500">Destination</p>
                          <p className="font-semibold text-gray-900">{(selectedItem.data as FixedDeparture).destination}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                        <Clock className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-semibold text-gray-900">{selectedItem.data.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                        <Calendar className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-500">Departure</p>
                          <p className="font-semibold text-gray-900">
                            {new Date((selectedItem.data as FixedDeparture).departureDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-xl">
                        <Calendar className="w-6 h-6 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-500">Itinerary Days</p>
                          <p className="font-semibold text-gray-900">{(selectedItem.data.itinerary || []).length} Days</p>
                        </div>
                      </div>
                    </>
                  ) : selectedItem.type === 'popular-destination' ? (
                    <>
                      <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-xl">
                        <MapPin className="w-6 h-6 text-orange-600" />
                        <div>
                          <p className="!text-sm !text-gray-500">Location</p>
                          <p className="!font-semibold !text-gray-900">{(selectedItem.data as PopularDestinationPackage).location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                        <Clock className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="!text-sm !text-gray-500">Duration</p>
                          <p className="!font-semibold !text-gray-900">{(selectedItem.data as PopularDestinationPackage).duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                        <Mountain className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="!text-sm !text-gray-500">Country</p>
                          <p className="!font-semibold !text-gray-900">{(selectedItem.data as PopularDestinationPackage).country}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl">
                        <Calendar className="w-6 h-6 text-purple-600" />
                        <div>
                          <p className="!text-sm !text-gray-500">Itinerary Days</p>
                          <p className="!font-semibold !text-gray-900">{(selectedItem.data.itinerary || []).length} Days</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl">
                        <MapPin className="w-6 h-6 text-red-600" />
                        <div>
                          <p className="text-sm text-gray-500">Destination</p>
                          <p className="font-semibold text-gray-900">{(selectedItem.data as AdventurePackage).destination}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                        <Clock className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-semibold text-gray-900">{(selectedItem.data as AdventurePackage).duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                        <Star className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-semibold text-gray-900">{(selectedItem.data as AdventurePackage).category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl">
                        <Calendar className="w-6 h-6 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-500">Itinerary Days</p>
                          <p className="font-semibold text-gray-900">{(selectedItem.data.itinerary || []).length} Days</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Package Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Package Highlights */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <Star className="w-5 h-5 text-red-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Highlights</h3>
                    </div>
                    <Button
                      onClick={handleEditHighlights}
                      variant="ghost"
                      size="sm"
                      disabled={isSaving}
                      className="text-white hover:bg-white  hover:text-slate-900 hover:bg-opacity-20"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  {Array.isArray(selectedItem.data.highlights) && selectedItem.data.highlights.length > 0 ? (
                    <div className="space-y-3">
                      {selectedItem.data.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700 font-medium">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No highlights added yet</p>
                      <Button
                        onClick={handleEditHighlights}
                        variant="outline"
                        size="sm"
                        className="mt-3 text-green-600 border-green-200 hover:bg-green-500"
                      >
                        Add Highlights
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Package Inclusions */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Inclusions</h3>
                    </div>
                    <Button
                      onClick={handleEditInclusions}
                      variant="ghost"
                      size="sm"
                      disabled={isSaving}
                      className="text-white hover:bg-white hover:text-slate-900 hover:bg-opacity-20"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  {Array.isArray(selectedItem.data.inclusions) && selectedItem.data.inclusions.length > 0 ? (
                    <div className="space-y-3">
                      {selectedItem.data.inclusions.map((inclusion, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700 font-medium">{inclusion}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No inclusions added yet</p>
                      <Button
                        onClick={handleEditInclusions}
                        variant="outline"
                        size="sm"
                        className="mt-3 text-blue-600 border-blue-200 hover:bg-blue-500"
                      >
                        Add Inclusions
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Package Exclusions */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-pink-600 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <X className="w-5 h-5 text-blue-500" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Exclusions</h3>
                    </div>
                    <Button
                      onClick={handleEditExclusions}
                      variant="ghost"
                      size="sm"
                      disabled={isSaving}
                      className="text-white hover:bg-white hover:text-slate-900 hover:bg-opacity-20"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  {Array.isArray(selectedItem.data.exclusions) && selectedItem.data.exclusions.length > 0 ? (
                    <div className="space-y-3">
                      {selectedItem.data.exclusions.map((exclusion, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-3 bg-red-50 rounded-xl">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700 font-medium">{exclusion}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <X className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No exclusions added yet</p>
                      <Button
                        onClick={handleEditExclusions}
                        variant="outline"
                        size="sm"
                        className="mt-3 text-red-600 border-red-200 hover:bg-red-500"
                      >
                        Add Exclusions
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Package Terms */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-600 to-slate-700 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Terms & Conditions</h3>
                    </div>
                    <Button
                      onClick={handleEditTerms}
                      variant="ghost"
                      size="sm"
                      disabled={isSaving}
                      className="text-white hover:bg-white hover:text-slate-900 hover:bg-opacity-20"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  {Array.isArray(selectedItem.data.terms) && selectedItem.data.terms.length > 0 ? (
                    <div className="space-y-3">
                      {selectedItem.data.terms.map((term, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700 font-medium">{term}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No terms added yet</p>
                      <Button
                        onClick={handleEditTerms}
                        variant="outline"
                        size="sm"
                        className="mt-3 text-gray-600 border-gray-200 hover:bg-gray-100"
                      >
                        Add Terms
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Terms Modal */}
            {isEditingTerms && (
              <Card className="border-gray-200 bg-gray-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-gray-900">
                    <span>Edit Package Terms</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingTerms(false)}
                      disabled={isSaving}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Terms & Conditions
                    </label>
                    <div className="space-y-2">
                      {packageTerms.map((term, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={term}
                            onChange={(e) => updatePackageTerm(index, e.target.value)}
                            placeholder={`Term ${index + 1}`}
                            disabled={isSaving}
                            className="text-gray-900 bg-white"
                          />
                          {packageTerms.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePackageTerm(index)}
                              disabled={isSaving}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addPackageTerm}
                        disabled={isSaving}
                        className="text-gray-900 bg-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Term
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingTerms(false)}
                      disabled={isSaving}
                      className="text-slate-900"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveTerms}
                      className="bg-gray-700 hover:bg-gray-800"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2 text-white" />
                          <div className="text-white">Save Terms</div>
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Edit Highlights Modal */}
            {isEditingHighlights && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-gray-900">
                    <span>Edit Package Highlights</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingHighlights(false)}
                      disabled={isSaving}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Highlights
                    </label>
                    <div className="space-y-2">
                      {packageHighlights.map((highlight, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={highlight}
                            onChange={(e) => updatePackageHighlight(index, e.target.value)}
                            placeholder={`Highlight ${index + 1}`}
                            disabled={isSaving}
                            className="text-gray-900 bg-white"
                          />
                          {packageHighlights.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePackageHighlight(index)}
                              disabled={isSaving}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addPackageHighlight}
                        disabled={isSaving}
                        className="text-slate-900 border-gray-300"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Highlight
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingHighlights(false)}
                      disabled={isSaving}
                      className="text-slate-900"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveHighlights}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Highlights
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Edit Inclusions Modal */}
            {isEditingInclusions && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-gray-900">
                    <span>Edit Package Inclusions</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingInclusions(false)}
                      disabled={isSaving}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Inclusions
                    </label>
                    <div className="space-y-2">
                      {packageInclusions.map((inclusion, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={inclusion}
                            onChange={(e) => updatePackageInclusion(index, e.target.value)}
                            placeholder={`Inclusion ${index + 1}`}
                            disabled={isSaving}
                            className="text-gray-900 bg-white"
                          />
                          {packageInclusions.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePackageInclusion(index)}
                              disabled={isSaving}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addPackageInclusion}
                        disabled={isSaving}
                        className="text-gray-900 bg-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Inclusion
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingInclusions(false)}
                      disabled={isSaving}
                      className="text-slate-900"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveInclusions}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Inclusions
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Edit Exclusions Modal */}
            {isEditingExclusions && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-gray-900">
                    <span>Edit Package Exclusions</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingExclusions(false)}
                      disabled={isSaving}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Exclusions
                    </label>
                    <div className="space-y-2">
                      {packageExclusions.map((exclusion, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={exclusion}
                            onChange={(e) => updatePackageExclusion(index, e.target.value)}
                            placeholder={`Exclusion ${index + 1}`}
                            disabled={isSaving}
                            className="text-gray-900 bg-white"
                          />
                          {packageExclusions.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePackageExclusion(index)}
                              disabled={isSaving}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addPackageExclusion}
                        disabled={isSaving}
                        className="text-gray-900 bg-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Exclusion
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingExclusions(false)}
                      disabled={isSaving}
                      className="text-slate-900"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveExclusions}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Exclusions
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Add New Day Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Itinerary Management</h3>
                  <p className="!text-gray-600 mt-1">Add and manage day-wise activities for your travel package</p>
                </div>
                <Button
                  onClick={() => setIsAddingDay(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isSaving}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Day
                </Button>
              </div>
            </div>

            {/* Add New Day Form */}
            {isAddingDay && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-gray-900">
                    <span>Add New Day</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddingDay(false)}
                      disabled={isSaving}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Day Title *
                      </label>
                      <Input
                        value={newDay.title}
                        onChange={(e) => setNewDay(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Arrival in Jaipur - The Pink City"
                        disabled={isSaving}
                        className="text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Day Number
                      </label>
                      <Input
                        type="number"
                        value={newDay.day}
                        onChange={(e) => setNewDay(prev => ({ ...prev, day: parseInt(e.target.value) }))}
                        min={1}
                        disabled={isSaving}
                        className="text-gray-900 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium  mb-2">
                      Activities
                    </label>
                    <div className="space-y-2">
                      {newDay.activities && newDay.activities.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={activity}
                            onChange={(e) => updateActivity(index, e.target.value)}
                            placeholder={`Activity ${index + 1}`}
                            disabled={isSaving}
                            className="text-gray-900 bg-white"
                          />
                          {newDay.activities && newDay.activities.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeActivity(index)}
                              disabled={isSaving}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addActivityField}
                        disabled={isSaving}
                        className="text-gray-900 bg-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Activity
                      </Button>
                    </div>
                  </div>



                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingDay(false)}
                      disabled={isSaving}
                      className="text-gray-900 border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddDay}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Add Day
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Itinerary Days */}
            <div className="space-y-6">
              {(selectedItem.data.itinerary || []).length === 0 ? (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Calendar className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Itinerary Days</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      This {selectedItem.type === 'trending' ? 'trending package' : selectedItem.type === 'premium' ? 'premium package' : selectedItem.type === 'package' ? 'package' : selectedItem.type === 'holiday' ? 'holiday type' : selectedItem.type === 'fixed-departure' ? 'fixed departure' : selectedItem.type === 'popular-destination' ? 'popular destination package' : 'adventure tour'} doesn&apos;t have any itinerary days yet. Start by adding your first day!
                    </p>
                    <Button
                      onClick={() => setIsAddingDay(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add First Day
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {(selectedItem.data.itinerary || []).map((day, index) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2">
                              <span className="text-2xl font-bold text-slate-900">Day {day.day}</span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">{day.title}</h3>
                              <p className="!text-blue-100 text-sm">
                                {Array.isArray(day.activities) ? day.activities.length : 0} Activities
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditDay(day)}
                              className="text-white hover:bg-white hover:text-slate-900 hover:bg-opacity-20 rounded-lg p-2"
                              disabled={isSaving}
                            >
                              <Edit className="w-5 h-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDay(day.day)}
                              className="text-white hover:bg-red-500 hover:bg-opacity-20 rounded-lg p-2"
                              disabled={isSaving}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-5 h-5" />
                            <span className="font-medium">Activities ({Array.isArray(day.activities) ? day.activities.length : 0})</span>
                          </div>

                          {Array.isArray(day.activities) && day.activities.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {day.activities.map((activity, idx) => (
                                <div key={idx} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm text-gray-700 font-medium">{activity}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                              <p className="text-sm">No activities added for this day</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Enhanced Edit Day Modal */}
        {isEditing && editingDay && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                      <Edit className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Edit Day {editingDay.day}</h2>
                      <p className="!text-blue-100 text-sm">Modify activities and details for this day</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="text-white hover:bg-white hover:text-slate-900 hover:bg-opacity-20 rounded-lg p-2"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Day Title
                    </label>
                    <Input
                      value={editingDay.title}
                      onChange={(e) => setEditingDay(prev => prev ? { ...prev, title: e.target.value } : null)}
                      disabled={isSaving}
                      className="text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Activities
                    </label>
                    <div className="space-y-2">
                      {Array.isArray(editingDay.activities) && editingDay.activities.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={activity}
                            onChange={(e) => {
                              const newActivities = [...(Array.isArray(editingDay.activities) ? editingDay.activities : [])];
                              newActivities[index] = e.target.value;
                              setEditingDay(prev => prev ? { ...prev, activities: newActivities } : null);
                            }}
                            disabled={isSaving}
                            className="text-gray-900 bg-white"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newActivities = (Array.isArray(editingDay.activities) ? editingDay.activities : []).filter((_, i) => i !== index);
                              setEditingDay(prev => prev ? { ...prev, activities: newActivities } : null);
                            }}
                            disabled={isSaving}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingDay(prev => prev ? { ...prev, activities: [...(Array.isArray(prev.activities) ? prev.activities : []), ""] } : null);
                        }}
                        disabled={isSaving}
                      >
                        <Plus className="w-4 h-4 mr-2 text-slate-900" />
                        <div className="text-slate-900">Add Activity</div>
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 ">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      <div className="text-slate-900">Cancel</div>
                    </Button>
                    <Button
                      onClick={handleSaveDay}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminItinerary; 