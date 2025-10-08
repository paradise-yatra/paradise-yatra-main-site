"use client";

import React, { useState, useEffect } from "react";
import { Crown, Star, MapPin, Clock, Edit, Trash2, Plus, Eye, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import ImageUpload from "@/components/ui/image-upload";
import { getImageUrl } from "@/lib/utils";
import { PACKAGE_CATEGORIES, TOUR_TYPES } from "@/config/categories";
import { useLocations } from "@/hooks/useLocations";

interface TrendingDestination {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  destination: string;
  country: string;
  state?: string;
  tourType: string;
  category: string;
  rating: number;
  price: number;
  duration: string;
  highlights: string[];
  isActive: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminTrendingDestinations = () => {
  const [trendingDestinations, setTrendingDestinations] = useState<TrendingDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDestination, setEditingDestination] = useState<TrendingDestination | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<TrendingDestination | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Use locations hook for dynamic data
  const { countries, loading: locationsLoading } = useLocations();
  
  // Add state for storing country ISO2
  const [selectedCountryIso2, setSelectedCountryIso2] = useState<string>("");
  // Add state for storing states
  const [states, setStates] = useState<Array<{ name: string; state_code: string }>>([]);
  const [selectedState, setSelectedState] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    shortDescription: "",
    image: "",
    destination: "",
    country: "",
    state: "",
    tourType: "",
    category: "",
    rating: "",
    price: "",
    duration: "",
    highlights: "",
    isActive: true,
    isFeatured: true
  });

  // Transform countries for dropdown
  const countryOptions = countries.map(country => ({
    value: country.iso2,
    label: `${country.emoji} ${country.name}`
  }));

  // Handle country change
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryIso2 = e.target.value;
    setSelectedCountryIso2(countryIso2);
    setSelectedState(''); // Reset state when country changes
    setFormData(prev => ({ ...prev, country: countryIso2, state: '' }));
    
    // Fetch states for the selected country
    if (countryIso2) {
      fetchStates(countryIso2);
    } else {
      setStates([]);
    }
  };

  // Fetch states for a country
  const fetchStates = async (countryIso2: string) => {
    try {
      const response = await fetch(`/api/locations/states/${countryIso2}`);
      if (response.ok) {
        const data = await response.json();
        setStates(data.states || []);
      } else {
        setStates([]);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
    }
  };


  // Fetch trending destinations
  const fetchTrendingDestinations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('adminToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/packages?category=Trending%20Destinations&limit=100', {
        headers
      });
      if (!response.ok) {
        throw new Error('Failed to fetch trending destinations');
      }
      
      const data = await response.json();
      // Handle both array response and object with packages property
      const destinationsArray = Array.isArray(data) ? data : (data.packages || []);
      console.log('Fetched trending destinations:', destinationsArray.length, destinationsArray);
      setTrendingDestinations(destinationsArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingDestinations();
  }, []);


  const handleAddDestination = async () => {
    try {
      setSubmitting(true);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Authentication required. Please login again.');
        return;
      }
      
      // Check if we need to upload a file
      const hasFileUpload = formData.image && (formData.image.startsWith('blob:') || formData.image.startsWith('data:'));
      
      // Convert ISO codes to actual names for submission
      let countryName = formData.country;
      let stateName = formData.state;
      
      if (selectedCountryIso2) {
        const selectedCountry = countries.find(c => c.iso2 === selectedCountryIso2);
        countryName = selectedCountry ? selectedCountry.name : selectedCountryIso2;
      }
      if (selectedState) {
        const selectedStateObj = states.find(s => s.name === selectedState);
        stateName = selectedStateObj ? selectedStateObj.name : selectedState;
      }

      const destinationData = {
        ...formData,
        country: countryName,
        state: stateName,
        price: parseFloat(formData.price),
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        highlights: formData.highlights ? formData.highlights.split(',').map(h => h.trim()) : [],
        isFeatured: true
      };

      let response;
      if (hasFileUpload) {
        // Handle file upload
        const uploadFormData = new FormData();
        
        // Add all form fields
        Object.keys(destinationData).forEach(key => {
          const value = (destinationData as unknown as Record<string, unknown>)[key];
          if (key === 'image' && typeof value === 'string' && value.startsWith('blob:')) {
            // Convert blob URL to file and upload
            fetch(value)
              .then(res => res.blob())
              .then(blob => {
                const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                uploadFormData.append('image', file);
              });
          } else if (key === 'image' && typeof value === 'string' && value.startsWith('data:')) {
            // Convert data URL to file and upload
            const response = fetch(value);
            response.then(res => res.blob())
              .then(blob => {
                const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                uploadFormData.append('image', file);
              });
          } else if (Array.isArray(value)) {
            uploadFormData.append(key, JSON.stringify(value));
          } else {
            uploadFormData.append(key, String(value));
          }
        });

        response = await fetch('/api/packages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: uploadFormData,
        });
      } else {
        // Handle regular JSON data
        response = await fetch('/api/packages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(destinationData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create destination');
      }

      await fetchTrendingDestinations();
      resetForm();
      toast.success('Trending destination added successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create destination';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditDestination = (dest: TrendingDestination) => {
    setEditingDestination(dest);
    
    // Find country ISO2 from name
    const country = countries.find(c => c.name === dest.country);
    setSelectedCountryIso2(country?.iso2 || '');
    
    // Set selected state if destination has state
    setSelectedState(dest.state || '');
    
    // Fetch states for the country if it exists
    if (country?.iso2) {
      fetchStates(country.iso2);
    }
    
    setFormData({
      title: dest.title,
      slug: dest.slug,
      description: dest.description,
      shortDescription: dest.shortDescription,
      image: dest.images && dest.images.length > 0 ? dest.images[0] : '',
      destination: dest.destination,
      country: dest.country,
      state: dest.state || '',
      tourType: dest.tourType,
      category: dest.category,
      rating: dest.rating.toString(),
      price: dest.price.toString(),
      duration: dest.duration,
      highlights: dest.highlights.join(', '),
      isActive: dest.isActive,
      isFeatured: dest.isFeatured || false
    });
    setShowAddForm(true);
  };

  const handleUpdateDestination = async () => {
    if (!editingDestination) return;

    try {
      setSubmitting(true);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Authentication required. Please login again.');
        return;
      }
      
      // Check if we need to upload a file
      const hasFileUpload = formData.image && (formData.image.startsWith('blob:') || formData.image.startsWith('data:'));
      
      // Convert ISO codes to actual names for submission
      let countryName = formData.country;
      let stateName = formData.state;
      
      if (selectedCountryIso2) {
        const selectedCountry = countries.find(c => c.iso2 === selectedCountryIso2);
        countryName = selectedCountry ? selectedCountry.name : selectedCountryIso2;
      }
      if (selectedState) {
        const selectedStateObj = states.find(s => s.name === selectedState);
        stateName = selectedStateObj ? selectedStateObj.name : selectedState;
      }

      const destinationData = {
        ...formData,
        country: countryName,
        state: stateName,
        price: parseFloat(formData.price),
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        highlights: formData.highlights ? formData.highlights.split(',').map(h => h.trim()) : []
      };

      let response;
      if (hasFileUpload) {
        // Handle file upload
        const uploadFormData = new FormData();
        
        // Add all form fields
        Object.keys(destinationData).forEach(key => {
          const value = (destinationData as unknown as Record<string, unknown>)[key];
          if (key === 'image' && typeof value === 'string' && value.startsWith('blob:')) {
            // Convert blob URL to file and upload
            fetch(value)
              .then(res => res.blob())
              .then(blob => {
                const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                uploadFormData.append('image', file);
              });
          } else if (key === 'image' && typeof value === 'string' && value.startsWith('data:')) {
            // Convert data URL to file and upload
            const response = fetch(value);
            response.then(res => res.blob())
              .then(blob => {
                const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                uploadFormData.append('image', file);
              });
          } else if (Array.isArray(value)) {
            uploadFormData.append(key, JSON.stringify(value));
          } else {
            uploadFormData.append(key, String(value));
          }
        });

        response = await fetch(`/api/packages/${editingDestination._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: uploadFormData,
        });
      } else {
        // Handle regular JSON data
        response = await fetch(`/api/packages/${editingDestination._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(destinationData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update destination');
      }

      await fetchTrendingDestinations();
      setEditingDestination(null);
      resetForm();
      toast.success('Trending destination updated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update destination';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDestination = async (id: string) => {
    if (!confirm('Are you sure you want to delete this destination?')) return;

    try {
      setSubmitting(true);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }
      
      const response = await fetch(`/api/packages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete destination');
      }

      await fetchTrendingDestinations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete destination');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDestinationStatus = async (dest: TrendingDestination) => {
    try {
      setSubmitting(true);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }
      
      const response = await fetch(`/api/packages/${dest._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          isActive: !dest.isActive
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update destination status');
      }

      await fetchTrendingDestinations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update destination status');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      shortDescription: "",
      image: "",
      destination: "",
      country: "",
      state: "",
      tourType: "",
      category: "",
      rating: "",
      price: "",
      duration: "",
      highlights: "",
      isActive: true,
      isFeatured: true
    });
    setSelectedCountryIso2("");
    setSelectedState("");
    setStates([]);
    setShowAddForm(false);
    setEditingDestination(null);
  };

  // Pagination calculations
  const totalPages = Math.ceil(trendingDestinations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDestinations = trendingDestinations.slice(startIndex, endIndex);
  
  // Debug pagination
  console.log('Pagination Debug:', {
    totalDestinations: trendingDestinations.length,
    itemsPerPage,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    paginatedCount: paginatedDestinations.length
  });

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">Loading trending destinations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Crown className="w-8 h-8 text-purple-600" />
            Trending Destinations
          </h1>
          <p className="text-gray-600">Manage your trending travel destinations and popular places.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Trending Destination
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-purple-600" />
            {editingDestination ? "Edit Trending Destination" : "Add New Trending Destination"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Sikkim Highlands with Kalimpong"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., manali"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination *</label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Sikkim, India"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
              <select
                value={selectedCountryIso2}
                onChange={handleCountryChange}
                className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                disabled={locationsLoading}
              >
                <option value="">{locationsLoading ? 'Loading countries...' : 'Select country'}</option>
                {countryOptions.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setFormData(prev => ({ ...prev, state: e.target.value }));
                }}
                className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={!selectedCountryIso2 || states.length === 0}
              >
                <option value="">{!selectedCountryIso2 ? 'Select country first' : states.length === 0 ? 'No states available' : 'Select state'}</option>
                {states.map((state) => (
                  <option key={state.name} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tour Type *</label>
              <select
                value={formData.tourType}
                onChange={(e) => setFormData({ ...formData, tourType: e.target.value })}
                className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Tour Type</option>
                {TOUR_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Category</option>
                {PACKAGE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 3 Days"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 15000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 4.8"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.isActive ? "active" : "inactive"}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
                className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured</label>
              <select
                value={formData.isFeatured ? "true" : "false"}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.value === "true" })}
                className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <ImageUpload
                value={formData.image}
                onChange={(value) => setFormData({ ...formData, image: value })}
                label="Destination Image"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Brief description of the destination..."
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="Enter detailed destination description..."
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Highlights (comma-separated)</label>
              <input
                type="text"
                value={formData.highlights}
                onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Solang Valley, Hadimba Temple, Rohtang Pass"
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              onClick={editingDestination ? handleUpdateDestination : handleAddDestination}
              disabled={submitting}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingDestination ? "Update Destination" : "Add Destination"}
            </button>
            <button
              onClick={resetForm}
              disabled={submitting}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Destinations</p>
              <p className="text-2xl font-bold">{trendingDestinations.length}</p>
            </div>
            <Crown className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Active Destinations</p>
              <p className="text-2xl font-bold">{trendingDestinations.filter(d => d.isActive).length}</p>
            </div>
            <Star className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Featured Destinations</p>
              <p className="text-2xl font-bold">{trendingDestinations.filter(d => d.isFeatured || d.category === "Trending Destinations").length}</p>
            </div>
            <Star className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Avg Rating</p>
              <p className="text-2xl font-bold">
                {trendingDestinations.length > 0 
                  ? (trendingDestinations.reduce((sum, d) => sum + d.rating, 0) / trendingDestinations.length).toFixed(1)
                  : "0.0"
                }
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
      </div>

      {/* Destinations List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Trending Destinations</h2>
        </div>
        {trendingDestinations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Crown className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No trending destinations found. Add your first trending destination to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedDestinations.map((dest) => (
                  <tr key={dest._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded overflow-hidden relative">
                          <Image 
                            src={getImageUrl(dest.images && dest.images.length > 0 ? dest.images[0] : '') || "https://via.placeholder.com/48x48?text=No+Image"} 
                            alt={dest.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{dest.title}</div>
                          <div className="text-xs text-gray-500">{dest.isFeatured || dest.category === "Trending Destinations" ? "Featured" : "Popular"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        {dest.destination}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        {dest.country}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        {dest.state}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-1" />
                        {dest.tourType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        {dest.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-1" />
                        {dest.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-semibold text-purple-600">₹{dest.price.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{dest.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleDestinationStatus(dest)}
                        disabled={submitting}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          dest.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        } disabled:opacity-50`}
                      >
                        {dest.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedDestination(dest)}
                          className="text-blue-600 hover:text-blue-900 hover:cursor-pointer hover:scale-105 transition-transform"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditDestination(dest)}
                          disabled={submitting}
                          className="text-purple-600 hover:text-purple-900 hover:cursor-pointer hover:scale-105 transition-transform disabled:opacity-50"
                          title="Edit Destination"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDestination(dest._id)}
                          disabled={submitting}
                          className="text-red-600 hover:text-red-900 hover:cursor-pointer hover:scale-105 transition-transform disabled:opacity-50"
                          title="Delete Destination"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Pagination Controls */}
      {trendingDestinations.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Showing {startIndex + 1} to {Math.min(endIndex, trendingDestinations.length)} of {trendingDestinations.length} destinations
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {totalPages > 1 && (
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === page
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
              
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Destination Details Modal */}
      {selectedDestination && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Destination Details</h3>
              <button
                onClick={() => setSelectedDestination(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="w-full h-48 rounded-lg overflow-hidden relative">
                <Image 
                  src={getImageUrl(selectedDestination.images && selectedDestination.images.length > 0 ? selectedDestination.images[0] : '') || "https://via.placeholder.com/400x200?text=No+Image"} 
                  alt={selectedDestination.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{selectedDestination.title}</h4>
                <p className="text-gray-600 mt-2">{selectedDestination.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Destination:</span>
                  <p className="text-gray-900">{selectedDestination.destination}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Duration:</span>
                  <p className="text-gray-900">{selectedDestination.duration}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Country:</span>
                  <p className="text-gray-900">{selectedDestination.country}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">State:</span>
                  <p className="text-gray-900">{selectedDestination.state || "Not specified"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Tour Type:</span>
                  <p className="text-gray-900">{selectedDestination.tourType}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Category:</span>
                  <p className="text-gray-900">{selectedDestination.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Price:</span>
                  <p className="text-gray-900">₹{selectedDestination.price.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Rating:</span>
                  <p className="text-gray-900">{selectedDestination.rating.toFixed(1)}</p>
                </div>
              </div>
              {selectedDestination.highlights.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Highlights:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDestination.highlights.map((highlight, index) => (
                      <span key={`highlight-${index}-${highlight}`} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrendingDestinations; 