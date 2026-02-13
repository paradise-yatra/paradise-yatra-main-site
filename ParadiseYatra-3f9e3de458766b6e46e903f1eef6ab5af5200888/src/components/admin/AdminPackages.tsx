"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Star, Clock, Edit, Trash2, Plus, Eye, Loader2, Upload, Image as ImageIcon, IndianRupee, Tag, X } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { Country, State } from "country-state-city";
import type { ICountry, IState } from "country-state-city";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface Package {
    _id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    image: string;
    location: string;
    country: string;
    state?: string;
    tourType: string;
    priceType?: "per_person" | "per_couple";
    price: number;
    originalPrice?: number;
    discount?: number;
    duration: string;
    isActive: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

const AdminPackages = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);
    const [previewPackage, setPreviewPackage] = useState<Package | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [allTags, setAllTags] = useState<any[]>([]);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTagStatus, setFilterTagStatus] = useState<"all" | "with-tags" | "without-tags" | string>("all");
    const [filterCountry, setFilterCountry] = useState<string>("all");
    const [filterState, setFilterState] = useState<string>("all");
    const [filterTourType, setFilterTourType] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    // Country and state management
    const [selectedCountryIso2, setSelectedCountryIso2] = useState<string>("");
    const [states, setStates] = useState<Array<{ name: string; state_code: string }>>([]);
    const [selectedState, setSelectedState] = useState<string>("");

    // Image handling
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');

    // Track if slug has been manually edited
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        shortDescription: "",
        location: "",
        country: "",
        state: "",
        tourType: "india",
        priceType: "per_person" as "per_person" | "per_couple",
        price: "",
        originalPrice: "",
        discount: "",
        duration: "",
        isActive: true,
        tags: [] as string[]
    });

    // Get all countries
    const countries = React.useMemo(() => {
        return Country.getAllCountries().map((c: ICountry) => ({
            iso2: c.isoCode,
            name: c.name,
        }));
    }, []);

    const countryOptions = countries.map(country => ({
        value: country.iso2,
        label: country.name
    }));

    // Handle country change
    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const countryIso2 = e.target.value;
        setSelectedCountryIso2(countryIso2);
        setSelectedState("");

        const selectedCountry = countries.find(c => c.iso2 === countryIso2);
        setFormData(prev => ({
            ...prev,
            country: selectedCountry ? selectedCountry.name : "",
            state: ""
        }));

        if (countryIso2) {
            const countryStates = State.getStatesOfCountry(countryIso2);
            setStates(countryStates.map((s: IState) => ({
                name: s.name,
                state_code: s.isoCode || '',
            })));
        } else {
            setStates([]);
        }
    };

    // Helper function to generate slug from text
    const generateSlugFromText = (text: string): string => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim();
    };

    const getPriceTypeLabel = (priceType?: string) =>
        priceType === "per_couple" ? "Per Couple" : "Per Person";

    // Handle title change with auto-slug generation
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setFormData(prev => {
            const updates: any = { ...prev, name: newTitle };

            // Auto-generate slug only if it hasn't been manually edited
            if (!isSlugManuallyEdited) {
                updates.slug = generateSlugFromText(newTitle);
            }

            return updates;
        });
    };

    // Handle slug change
    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSlug = e.target.value;
        setFormData(prev => ({ ...prev, slug: newSlug }));

        // Mark as manually edited if user types anything
        if (!isSlugManuallyEdited) {
            setIsSlugManuallyEdited(true);
        }
    };

    // Image handling functions
    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setImageFile(file);
        setImageUrl("");

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setImageUrl(url);
        setImageFile(null);

        if (url) {
            setImagePreview(url);
        } else {
            setImagePreview("");
        }
    };

    const clearImageSelection = () => {
        setImageFile(null);
        setImageUrl("");
        setImagePreview("");
    };

    const fetchPackages = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('adminToken');
            const headers: HeadersInit = {};

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('/api/all-packages?limit=100', {
                headers,
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch packages');
            }

            const data = await response.json();

            let packagesArray: Package[] = [];

            if (Array.isArray(data)) {
                packagesArray = data;
            } else if (data.packages && Array.isArray(data.packages)) {
                packagesArray = data.packages;
            } else {
                packagesArray = [];
            }

            setPackages(packagesArray);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching packages';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await fetch('/api/tags');
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setAllTags(result.data);
                }
            }
        } catch (err) {
            console.error('Failed to fetch tags:', err);
        }
    };

    useEffect(() => {
        fetchPackages();
        fetchTags();
    }, []);

    // Sync tags with package - bidirectional relationship
    const syncTagsWithPackage = async (packageId: string, newTagIds: string[], oldTagIds: string[] = []) => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) return;

            // Find tags to add (in new but not in old)
            const tagsToAdd = newTagIds.filter(id => !oldTagIds.includes(id));

            // Find tags to remove (in old but not in new)
            const tagsToRemove = oldTagIds.filter(id => !newTagIds.includes(id));

            // Update each tag that needs to add this package
            for (const tagId of tagsToAdd) {
                const tag = allTags.find(t => t._id === tagId);
                if (!tag) continue;

                const updatedPackages = [...(tag.packages || []), packageId];

                await fetch(`/api/tags/${tagId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: tag.name,
                        description: tag.description,
                        packages: updatedPackages
                    }),
                });
            }

            // Update each tag that needs to remove this package
            for (const tagId of tagsToRemove) {
                const tag = allTags.find(t => t._id === tagId);
                if (!tag) continue;

                const updatedPackages = (tag.packages || []).filter((id: string) => id !== packageId);

                await fetch(`/api/tags/${tagId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: tag.name,
                        description: tag.description,
                        packages: updatedPackages
                    }),
                });
            }

            // Refresh tags to show updated counts
            await fetchTags();
        } catch (err) {
            console.error('Failed to sync tags:', err);
            // Don't show error to user as this is a background sync
        }
    };

    const handleCreatePackage = async () => {
        try {
            // Validation
            if (!formData.name?.trim()) {
                toast.error('Title is required');
                return;
            }
            if (!formData.slug?.trim()) {
                // Assume slug is optional or generated on backend if empty, 
                // but user asked for slug input, so let's validate or let backend handle
                // Backend generates slug if not unique but base slug comes from name.
                // Let's enforce slug required or auto-generatable.
            }
            if (!formData.description?.trim()) {
                toast.error('Description is required');
                return;
            }
            if (!formData.shortDescription?.trim()) {
                toast.error('Short description is required');
                return;
            }
            if (!formData.location?.trim()) {
                toast.error('Destination is required');
                return;
            }
            if (!formData.country?.trim()) {
                toast.error('Country is required');
                return;
            }
            if (!formData.tourType) {
                toast.error('Tour type is required');
                return;
            }
            if (!formData.price) {
                toast.error('Price is required');
                return;
            }
            if (!formData.duration?.trim()) {
                toast.error('Duration is required');
                return;
            }
            if (!imagePreview && !imageFile) {
                toast.error('Please select an image');
                return;
            }

            setSubmitting(true);

            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error('Authentication required. Please login again.');
                setSubmitting(false);
                return;
            }

            // If using URL method
            if (uploadMethod === 'url') {
                if (!imageUrl) {
                    toast.error('Please provide an image URL');
                    setSubmitting(false);
                    return;
                }

                const packageData = {
                    name: formData.name.trim(),
                    slug: formData.slug.trim(),
                    description: formData.description.trim(),
                    shortDescription: formData.shortDescription.trim(),
                    image: imageUrl,
                    location: formData.location.trim(),
                    country: formData.country.trim(),
                    state: formData.state?.trim() || '',
                    tourType: formData.tourType,
                    priceType: formData.priceType,
                    price: parseFloat(formData.price),
                    originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
                    discount: formData.discount ? parseFloat(formData.discount) : undefined,
                    duration: formData.duration.trim(),
                    isActive: formData.isActive,
                    tags: formData.tags
                };

                const response = await fetch('/api/all-packages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(packageData),
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || 'Failed to create package');
                }
                const newPackage = result.package || result;

                // Sync tags bidirectionally
                if (formData.tags.length > 0 && newPackage._id) {
                    await syncTagsWithPackage(newPackage._id, formData.tags);
                }

                setPackages(prev => [newPackage, ...prev]);
                setCurrentPage(1);
                resetForm();
                toast.success('Package created successfully!');
                return;
            }

            // If using file upload
            if (uploadMethod === 'file') {
                if (!imageFile) {
                    toast.error('Please select an image file');
                    setSubmitting(false);
                    return;
                }

                const uploadFormData = new FormData();
                uploadFormData.append('image', imageFile);
                uploadFormData.append('name', formData.name.trim());
                if (formData.slug.trim()) uploadFormData.append('slug', formData.slug.trim());
                uploadFormData.append('description', formData.description.trim());
                uploadFormData.append('shortDescription', formData.shortDescription.trim());
                uploadFormData.append('location', formData.location.trim());
                uploadFormData.append('country', formData.country.trim());
                if (formData.state?.trim()) uploadFormData.append('state', formData.state.trim());
                uploadFormData.append('tourType', formData.tourType);
                uploadFormData.append('priceType', formData.priceType);
                uploadFormData.append('price', formData.price);
                if (formData.originalPrice) uploadFormData.append('originalPrice', formData.originalPrice);
                if (formData.discount) uploadFormData.append('discount', formData.discount);
                uploadFormData.append('duration', formData.duration.trim());
                uploadFormData.append('isActive', String(formData.isActive));
                uploadFormData.append('tags', JSON.stringify(formData.tags));

                const response = await fetch('/api/all-packages', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: uploadFormData,
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || 'Failed to create package');
                }
                const newPackage = result.package || result;

                // Sync tags bidirectionally
                if (formData.tags.length > 0 && newPackage._id) {
                    await syncTagsWithPackage(newPackage._id, formData.tags);
                }

                setPackages(prev => [newPackage, ...prev]);
                setCurrentPage(1);
                resetForm();
                toast.success('Package created successfully!');
            } else {
                toast.error('Please select an image');
                setSubmitting(false);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create package';
            console.error('Create package error:', err);
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdatePackage = async () => {
        if (!editingPackage) return;

        try {
            // Validation (same as create)
            if (!formData.name?.trim()) {
                toast.error('Title is required');
                return;
            }

            setSubmitting(true);

            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error('Authentication required. Please login again.');
                setSubmitting(false);
                return;
            }

            // If using URL method
            if (uploadMethod === 'url') {
                const packageData = {
                    name: formData.name.trim(),
                    slug: formData.slug.trim(),
                    description: formData.description.trim(),
                    shortDescription: formData.shortDescription.trim(),
                    image: imageUrl,
                    location: formData.location.trim(),
                    country: formData.country.trim(),
                    state: formData.state?.trim() || '',
                    tourType: formData.tourType,
                    priceType: formData.priceType,
                    price: parseFloat(formData.price),
                    originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
                    discount: formData.discount ? parseFloat(formData.discount) : undefined,
                    duration: formData.duration.trim(),
                    isActive: formData.isActive,
                    tags: formData.tags
                };

                const response = await fetch(`/api/all-packages/${editingPackage._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(packageData),
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || 'Failed to update package');
                }
                const updatedPackage = result.package || result;

                // Sync tags bidirectionally (compare old and new tags)
                await syncTagsWithPackage(editingPackage._id, formData.tags, editingPackage.tags || []);

                setPackages(prev => prev.map(p => p._id === updatedPackage._id ? updatedPackage : p));
                setEditingPackage(null);
                resetForm();
                toast.success('Package updated successfully!');
                return;
            }

            // If using file upload
            const uploadFormData = new FormData();

            if (imageFile) {
                uploadFormData.append('image', imageFile);
            }

            uploadFormData.append('name', formData.name.trim());
            if (formData.slug.trim()) uploadFormData.append('slug', formData.slug.trim());
            uploadFormData.append('description', formData.description.trim());
            uploadFormData.append('shortDescription', formData.shortDescription.trim());
            uploadFormData.append('location', formData.location.trim());
            uploadFormData.append('country', formData.country.trim());
            if (formData.state?.trim()) uploadFormData.append('state', formData.state.trim());
            uploadFormData.append('tourType', formData.tourType);
            uploadFormData.append('priceType', formData.priceType);
            uploadFormData.append('price', formData.price);
            if (formData.originalPrice) uploadFormData.append('originalPrice', formData.originalPrice);
            if (formData.discount) uploadFormData.append('discount', formData.discount);
            uploadFormData.append('duration', formData.duration.trim());
            uploadFormData.append('isActive', String(formData.isActive));
            uploadFormData.append('tags', JSON.stringify(formData.tags));

            const response = await fetch(`/api/all-packages/${editingPackage._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: uploadFormData,
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to update package');
            }
            const updatedPackage = result.package || result;

            // Sync tags bidirectionally (compare old and new tags)
            await syncTagsWithPackage(editingPackage._id, formData.tags, editingPackage.tags || []);

            setPackages(prev => prev.map(p => p._id === updatedPackage._id ? updatedPackage : p));
            setEditingPackage(null);
            resetForm();
            toast.success('Package updated successfully!');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update package';
            console.error('Update package error:', err);
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditPackage = (pkg: Package) => {
        setEditingPackage(pkg);

        const country = countries.find(c => c.name === pkg.country);
        setSelectedCountryIso2(country?.iso2 || '');
        setSelectedState(pkg.state || '');

        if (country?.iso2) {
            const countryStates = State.getStatesOfCountry(country.iso2);
            setStates(countryStates.map((s: IState) => ({
                name: s.name,
                state_code: s.isoCode || '',
            })));
        }

        // Set existing image
        const existingImage = pkg.image || '';
        setImagePreview(existingImage);
        setImageUrl(existingImage);
        setUploadMethod('url');
        setImageFile(null);

        // Merge tags from the package and tags that link to this package from Tag Management
        const linkedTags = allTags
            .filter(tag => tag.packages && tag.packages.includes(pkg._id))
            .map(tag => tag._id);
        const mergedTags = Array.from(new Set([...(pkg.tags || []), ...linkedTags]));

        setFormData({
            name: pkg.name,
            slug: pkg.slug,
            description: pkg.description,
            shortDescription: pkg.shortDescription,
            location: pkg.location,
            country: pkg.country,
            state: pkg.state || "",
            tourType: pkg.tourType,
            priceType: pkg.priceType || "per_person",
            price: pkg.price.toString(),
            originalPrice: pkg.originalPrice?.toString() || "",
            discount: pkg.discount?.toString() || "",
            duration: pkg.duration,
            isActive: pkg.isActive,
            tags: mergedTags
        });
        setShowAddForm(true);
        setIsSlugManuallyEdited(true); // Mark as manually edited when editing existing package
    };

    const handleDeletePackage = async (id: string) => {
        try {
            setDeletingId(id);

            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error('Authentication required. Please login again.');
                return;
            }

            const response = await fetch(`/api/all-packages/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete package');
            }

            // Find the package to get its tags before deleting
            const packageToDelete = packages.find(p => p._id === id);

            // Remove this package from all tags
            if (packageToDelete && packageToDelete.tags && packageToDelete.tags.length > 0) {
                await syncTagsWithPackage(id, [], packageToDelete.tags);
            }

            setPackages(prev => {
                const updatedPackages = prev.filter(p => p._id !== id);
                const newTotalPages = Math.ceil(updatedPackages.length / itemsPerPage);
                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(newTotalPages);
                }
                return updatedPackages;
            });
            toast.success('Package deleted successfully!');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete package';
            console.error('Delete package error:', err);
            toast.error(errorMessage);
        } finally {
            setDeletingId(null);
        }
    };

    const togglePackageStatus = async (pkg: Package) => {
        try {
            setSubmitting(true);

            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error('Authentication required. Please login again.');
                return;
            }

            const response = await fetch(`/api/all-packages/${pkg._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    isActive: !pkg.isActive
                }),
            });

            if (!response.ok) {
                throw new Error('Status update failed');
            }

            setPackages(prev => prev.map(p => p._id === pkg._id ? { ...p, isActive: !pkg.isActive } : p));
            toast.success('Status updated successfully!');
        } catch (err) {
            console.error('Toggle status error:', err);
            toast.error('Failed to update package status');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            slug: "",
            description: "",
            shortDescription: "",
            location: "",
            country: "",
            state: "",
            tourType: "india",
            priceType: "per_person",
            price: "",
            originalPrice: "",
            discount: "",
            duration: "",
            isActive: true,
            tags: []
        });
        clearImageSelection();
        setShowAddForm(false);
        setEditingPackage(null);
        setSelectedCountryIso2("");
        setStates([]);
        setSelectedState("");
        setIsSlugManuallyEdited(false);
    };

    // Get unique values for filters
    const uniqueCountries = React.useMemo(() => {
        const countries = [...new Set(packages.map(p => p.country).filter(Boolean))];
        return countries.sort();
    }, [packages]);

    const uniqueStates = React.useMemo(() => {
        const states = [...new Set(packages.map(p => p.state).filter(Boolean))];
        return states.sort();
    }, [packages]);

    // Filter packages based on all filter criteria
    const filteredPackages = React.useMemo(() => {
        return packages.filter(pkg => {
            // Search filter
            if (searchTerm) {
                const search = searchTerm.toLowerCase();
                const matchesSearch =
                    pkg.name.toLowerCase().includes(search) ||
                    pkg.location?.toLowerCase().includes(search) ||
                    pkg.country?.toLowerCase().includes(search) ||
                    pkg.state?.toLowerCase().includes(search) ||
                    pkg.description?.toLowerCase().includes(search);
                if (!matchesSearch) return false;
            }

            // Tag filter - check BOTH directions for bidirectional sync
            if (filterTagStatus !== "all") {
                if (filterTagStatus === "with-tags") {
                    // Check if package has any tags OR if any tag references this package
                    const hasTagsInPackage = pkg.tags && pkg.tags.length > 0;
                    const isReferencedByAnyTag = allTags.some(tag =>
                        tag.packages && tag.packages.includes(pkg._id)
                    );
                    if (!hasTagsInPackage && !isReferencedByAnyTag) return false;
                } else if (filterTagStatus === "without-tags") {
                    // Check if package has no tags AND no tag references this package
                    const hasTagsInPackage = pkg.tags && pkg.tags.length > 0;
                    const isReferencedByAnyTag = allTags.some(tag =>
                        tag.packages && tag.packages.includes(pkg._id)
                    );
                    if (hasTagsInPackage || isReferencedByAnyTag) return false;
                } else {
                    // Specific tag selected - check BOTH directions
                    const packageHasTag = pkg.tags && pkg.tags.includes(filterTagStatus);
                    const selectedTag = allTags.find(t => t._id === filterTagStatus);
                    const tagHasPackage = selectedTag && selectedTag.packages && selectedTag.packages.includes(pkg._id);

                    if (!packageHasTag && !tagHasPackage) return false;
                }
            }

            // Country filter
            if (filterCountry !== "all" && pkg.country !== filterCountry) {
                return false;
            }

            // State filter
            if (filterState !== "all" && pkg.state !== filterState) {
                return false;
            }

            // Tour type filter
            if (filterTourType !== "all" && pkg.tourType !== filterTourType) {
                return false;
            }

            // Status filter
            if (filterStatus !== "all") {
                if (filterStatus === "active" && !pkg.isActive) return false;
                if (filterStatus === "inactive" && pkg.isActive) return false;
            }

            return true;
        });
    }, [packages, searchTerm, filterTagStatus, filterCountry, filterState, filterTourType, filterStatus]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPackages = filteredPackages.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="!text-3xl font-bold text-gray-800">All Packages</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setShowAddForm(!showAddForm);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                >
                    {showAddForm ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Plus size={20} /> Add New Package
                        </>
                    )}
                </button>
            </div>

            {/* Filters Section */}
            {!showAddForm && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filters
                        </h3>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setFilterTagStatus("all");
                                setFilterCountry("all");
                                setFilterState("all");
                                setFilterTourType("all");
                                setFilterStatus("all");
                                setCurrentPage(1);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                            <X size={14} />
                            Clear All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        {/* Search */}
                        <div className="xl:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Search</label>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    placeholder="Search by name, location, country..."
                                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Tag Filter */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Tags</label>
                            <select
                                value={filterTagStatus}
                                onChange={(e) => {
                                    setFilterTagStatus(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="all">All Packages</option>
                                <option value="with-tags">With Tags</option>
                                <option value="without-tags">Without Tags</option>
                                {allTags.map((tag) => (
                                    <option key={tag._id} value={tag._id}>
                                        {tag.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Country Filter */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Country</label>
                            <select
                                value={filterCountry}
                                onChange={(e) => {
                                    setFilterCountry(e.target.value);
                                    setFilterState("all");
                                    setCurrentPage(1);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="all">All Countries</option>
                                {uniqueCountries.map((country) => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* State Filter */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">State</label>
                            <select
                                value={filterState}
                                onChange={(e) => {
                                    setFilterState(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                disabled={uniqueStates.length === 0}
                            >
                                <option value="all">All States</option>
                                {uniqueStates.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tour Type Filter */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Tour Type</label>
                            <select
                                value={filterTourType}
                                onChange={(e) => {
                                    setFilterTourType(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="all">All Types</option>
                                <option value="india">India</option>
                                <option value="international">International</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-semibold text-blue-600">{filteredPackages.length}</span> of <span className="font-semibold">{packages.length}</span> packages
                        </p>
                        {(searchTerm || filterTagStatus !== "all" || filterCountry !== "all" || filterState !== "all" || filterTourType !== "all" || filterStatus !== "all") && (
                            <div className="flex flex-wrap gap-2">
                                {searchTerm && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                                        Search: "{searchTerm}"
                                        <button onClick={() => setSearchTerm("")} className="hover:text-blue-900">
                                            <X size={12} />
                                        </button>
                                    </span>
                                )}
                                {filterTagStatus !== "all" && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                                        Tag: {filterTagStatus === "with-tags" ? "With Tags" : filterTagStatus === "without-tags" ? "Without Tags" : allTags.find(t => t._id === filterTagStatus)?.name}
                                        <button onClick={() => setFilterTagStatus("all")} className="hover:text-purple-900">
                                            <X size={12} />
                                        </button>
                                    </span>
                                )}
                                {filterCountry !== "all" && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium">
                                        Country: {filterCountry}
                                        <button onClick={() => setFilterCountry("all")} className="hover:text-green-900">
                                            <X size={12} />
                                        </button>
                                    </span>
                                )}
                                {filterState !== "all" && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded-md text-xs font-medium">
                                        State: {filterState}
                                        <button onClick={() => setFilterState("all")} className="hover:text-yellow-900">
                                            <X size={12} />
                                        </button>
                                    </span>
                                )}
                                {filterTourType !== "all" && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium">
                                        Type: {filterTourType}
                                        <button onClick={() => setFilterTourType("all")} className="hover:text-indigo-900">
                                            <X size={12} />
                                        </button>
                                    </span>
                                )}
                                {filterStatus !== "all" && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs font-medium">
                                        Status: {filterStatus}
                                        <button onClick={() => setFilterStatus("all")} className="hover:text-red-900">
                                            <X size={12} />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showAddForm && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        {editingPackage ? 'Edit Package' : 'Add New Package'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.name || ""}
                                    onChange={handleTitleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Majestic Shimla Tour"
                                />
                            </div>



                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                                    {isSlugManuallyEdited && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsSlugManuallyEdited(false);
                                                setFormData(prev => ({ ...prev, slug: generateSlugFromText(prev.name) }));
                                            }}
                                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                                        >
                                            Reset to auto-generate
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={formData.slug || ""}
                                    onChange={handleSlugChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. majestic-shimla-tour"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {isSlugManuallyEdited
                                        ? '✏️ Custom slug (click "Reset to auto-generate" to sync with title)'
                                        : '🔄 Auto-generating from title'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                                <RichTextEditor
                                    value={formData.shortDescription || ""}
                                    onChange={(value) => setFormData({ ...formData, shortDescription: value })}
                                    contentType="packages"
                                    className="min-h-[170px]"
                                    editorViewportClassName="max-h-[260px]"
                                    placeholder="Brief summary for cards..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                    <div className="relative">
                                        <IndianRupee size={16} className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="number"
                                            value={formData.price || ""}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Type</label>
                                    <select
                                        value={formData.priceType}
                                        onChange={(e) => setFormData({ ...formData, priceType: e.target.value as "per_person" | "per_couple" })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="per_person">Per Person</option>
                                        <option value="per_couple">Per Couple</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (Optional)</label>
                                    <div className="relative">
                                        <IndianRupee size={16} className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="number"
                                            value={formData.originalPrice || ""}
                                            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                                    <div className="relative">
                                        <Tag size={16} className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="number"
                                            value={formData.discount || ""}
                                            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="0"
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                    <div className="relative">
                                        <Clock size={16} className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.duration || ""}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="e.g. 5N/4D"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center space-x-2 cursor-pointer text-slate-600">
                                        <input
                                            type="radio"
                                            checked={formData.isActive}
                                            onChange={() => setFormData({ ...formData, isActive: true })}
                                            className="form-radio text-blue-600"
                                        />
                                        <span>Active</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer text-slate-600">
                                        <input
                                            type="radio"
                                            checked={!formData.isActive}
                                            onChange={() => setFormData({ ...formData, isActive: false })}
                                            className="form-radio text-gray-600"
                                        />
                                        <span>Inactive</span>
                                    </label>
                                </div>
                            </div>

                            {/* Tags Selection */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                <p className="text-xs text-gray-500 mb-3">
                                    💡 <span className="font-medium">Blue</span> = Selected here | <span className="font-medium text-purple-600">Purple</span> = Linked from Tag Management
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {allTags.map((tag) => {
                                        const isSelectedHere = formData.tags.includes(tag._id);
                                        const isLinkedFromTagMgmt = editingPackage && tag.packages && tag.packages.includes(editingPackage._id);
                                        const isBothWays = isSelectedHere && isLinkedFromTagMgmt;

                                        return (
                                            <button
                                                key={tag._id}
                                                type="button"
                                                onClick={() => {
                                                    const newTags = formData.tags.includes(tag._id)
                                                        ? formData.tags.filter((id: string) => id !== tag._id)
                                                        : [...formData.tags, tag._id];
                                                    setFormData({ ...formData, tags: newTags });
                                                }}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all relative ${isBothWays
                                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                                                    : isSelectedHere
                                                        ? "bg-blue-600 text-white"
                                                        : isLinkedFromTagMgmt
                                                            ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    }`}
                                                title={
                                                    isBothWays
                                                        ? "Synced both ways ✓"
                                                        : isLinkedFromTagMgmt
                                                            ? "Linked from Tag Management (click to also select here)"
                                                            : isSelectedHere
                                                                ? "Selected here (will sync to Tag Management)"
                                                                : "Click to select"
                                                }
                                            >
                                                {tag.name}
                                                {isLinkedFromTagMgmt && !isSelectedHere && (
                                                    <span className="ml-1 text-purple-500">🔗</span>
                                                )}
                                                {isBothWays && (
                                                    <span className="ml-1">✓</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                    {allTags.length === 0 && (
                                        <p className="text-xs text-gray-500 italic">No tags available</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
                                <RichTextEditor
                                    value={formData.description || ""}
                                    onChange={(value) => setFormData({ ...formData, description: value })}
                                    contentType="packages"
                                    className="min-h-[240px]"
                                    editorViewportClassName="max-h-[320px]"
                                    placeholder="Full details about the package..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.location || ""}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="e.g. Shimla, Himachal Pradesh"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <select
                                        value={selectedCountryIso2}
                                        onChange={handleCountryChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Select Country</option>
                                        {countryOptions.map((country) => (
                                            <option key={country.value} value={country.value}>
                                                {country.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State (Optional)</label>
                                    <select
                                        value={selectedState}
                                        onChange={(e) => {
                                            setSelectedState(e.target.value);
                                            setFormData({ ...formData, state: e.target.value });
                                        }}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        disabled={!selectedCountryIso2 || states.length === 0}
                                    >
                                        <option value="">Select State</option>
                                        {states.map((state) => (
                                            <option key={state.name} value={state.name}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tour Type</label>
                                <select
                                    value={formData.tourType}
                                    onChange={(e) => setFormData({ ...formData, tourType: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="india">India</option>
                                    <option value="international">International</option>
                                </select>
                            </div>

                            {/* Image Upload Section */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Package Image</label>

                                <div className="flex space-x-4 mb-4">
                                    <button
                                        type="button"
                                        onClick={() => setUploadMethod('file')}
                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${uploadMethod === 'file'
                                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Upload size={16} className="inline mr-2" />
                                        Upload File
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUploadMethod('url')}
                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${uploadMethod === 'url'
                                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                            }`}
                                    >
                                        <ImageIcon size={16} className="inline mr-2" />
                                        Image URL
                                    </button>
                                </div>

                                {uploadMethod === 'file' ? (
                                    <div key="file-upload-container" className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                        <input
                                            key="file-input"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageFileChange}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label htmlFor="image-upload" className="cursor-pointer block">
                                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-500">Click to upload image</span>
                                            <p className="text-xs text-gray-400 mt-1">MAX. 5MB</p>
                                        </label>
                                    </div>
                                ) : (
                                    <div key="url-upload-container">
                                        <input
                                            key="url-input"
                                            type="text"
                                            value={imageUrl || ""}
                                            onChange={handleImageUrlChange}
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        />
                                    </div>
                                )}

                                {imagePreview && (() => {
                                    const isValidUrl = (url: string) => {
                                        if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/')) return true;
                                        try {
                                            new URL(url);
                                            return true;
                                        } catch {
                                            return false;
                                        }
                                    };

                                    if (!isValidUrl(imagePreview)) {
                                        return (
                                            <div className="mt-4 flex flex-col items-center justify-center h-44 w-full rounded-xl border-2 border-dashed border-red-200 bg-red-50 text-red-400 p-4 transition-all animate-in fade-in zoom-in duration-300">
                                                <div className="bg-red-100 p-2 rounded-full mb-2">
                                                    <ImageIcon size={24} className="text-red-500 opacity-80" />
                                                </div>
                                                <p className="text-xs font-bold text-red-600">Invalid Image URL</p>
                                                <p className="text-[10px] text-red-400 mt-1 mb-3 text-center">The URL you entered is not a valid web address.</p>
                                                <button
                                                    onClick={clearImageSelection}
                                                    className="px-4 py-1.5 bg-white border border-red-200 rounded-lg text-[10px] font-bold text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
                                                >
                                                    Clear and Try Again
                                                </button>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="mt-4 relative h-40 w-full rounded-lg overflow-hidden border border-gray-200 group">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    // Handle broken images
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    onClick={clearImageSelection}
                                                    className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 shadow-lg transform hover:scale-110 transition-all"
                                                    title="Remove image"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => {
                                resetForm();
                                setShowAddForm(false);
                            }}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={editingPackage ? handleUpdatePackage : handleCreatePackage}
                            disabled={submitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    {editingPackage ? 'Updating...' : 'Saving...'}
                                </>
                            ) : (
                                <>{editingPackage ? 'Update Package' : 'Create Package'}</>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Packages List */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Loader2 size={32} className="mx-auto animate-spin text-blue-500" />
                                        <p className="mt-2 text-gray-500">Loading packages...</p>
                                    </td>
                                </tr>
                            ) : currentPackages.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No packages found. Add your first package to get started.
                                    </td>
                                </tr>
                            ) : (
                                currentPackages.map((pkg) => (
                                    <tr key={pkg._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 relative rounded-lg overflow-hidden bg-gray-100">
                                                    {pkg.image ? (
                                                        <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <ImageIcon size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 line-clamp-1">{pkg.name}</div>
                                                    <div className="text-xs text-gray-500">{pkg.tourType}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {pkg.duration}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ₹{pkg.price.toLocaleString()}
                                            <span className="ml-2 text-[10px] uppercase tracking-wide text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                                                {getPriceTypeLabel(pkg.priceType)}
                                            </span>
                                            {pkg.originalPrice && (
                                                <span className="text-xs text-gray-400 line-through ml-2">₹{pkg.originalPrice.toLocaleString()}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {pkg.location}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                onClick={() => togglePackageStatus(pkg)}
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer select-none ${pkg.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {pkg.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => setPreviewPackage(pkg)}
                                                    className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-lg transition disabled:opacity-50"
                                                    title="Preview"
                                                    disabled={submitting}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditPackage(pkg)}
                                                    className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg transition disabled:opacity-50"
                                                    disabled={submitting}
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDeleteId(pkg._id)}
                                                    className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition disabled:opacity-50"
                                                    disabled={submitting || deletingId === pkg._id}
                                                >
                                                    {deletingId === pkg._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className=" px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPackages.length)} of {filteredPackages.length} results
                        </span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-200 cursor-pointer text-slate-700 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => paginate(idx + 1)}
                                    className={`px-4 py-2 border rounded-xl text-sm font-bold cursor-pointer transition-all shadow-sm ${currentPage === idx + 1
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-blue-100 shadow-lg'
                                        : 'border-gray-200 text-slate-600 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-slate-700 cursor-pointer border border-gray-200 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {/* Preview Modal */}
            {previewPackage && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl max-w-xl w-full max-h-[88vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col">
                        <div className="relative h-52 w-full shrink-0">
                            {previewPackage.image ? (
                                <img
                                    src={previewPackage.image}
                                    alt={previewPackage.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    <ImageIcon size={64} />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={() => setPreviewPackage(null)}
                                    className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg text-gray-800 hover:bg-white transition"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {previewPackage.tourType}
                                </span>
                                <h3 className="text-2xl font-bold text-white mt-2 leading-tight line-clamp-2">
                                    {previewPackage.name}
                                </h3>
                            </div>
                        </div>

                        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                            <div className="flex flex-wrap items-center gap-6 text-sm">
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                                    <Clock className="text-blue-500" size={18} />
                                    <span className="font-semibold text-gray-700">{previewPackage.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                                    <MapPin className="text-red-500" size={18} />
                                    <span className="font-semibold text-gray-700">{previewPackage.location}</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-2xl border border-green-100">
                                    <IndianRupee className="text-green-600" size={18} />
                                    <div className="flex items-baseline gap-1">
                                        <span className="font-bold text-green-700 text-lg">₹{previewPackage.price.toLocaleString()}</span>
                                        <span className="text-[10px] uppercase tracking-wide text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                                            {getPriceTypeLabel(previewPackage.priceType)}
                                        </span>
                                        {previewPackage.originalPrice && (
                                            <span className="text-xs text-gray-400 line-through">₹{previewPackage.originalPrice.toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Short Description</h4>
                                    <div className="text-gray-600 leading-relaxed font-medium max-h-28 overflow-y-auto custom-scrollbar pr-2">
                                        {previewPackage.shortDescription}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Full Details</h4>
                                    <div className="text-gray-600 leading-relaxed whitespace-pre-line custom-scrollbar max-h-40 overflow-y-auto pr-2">
                                        {previewPackage.description}
                                    </div>
                                </div>
                                {(() => {
                                    const linkedTags = allTags
                                        .filter(tag => tag.packages && tag.packages.includes(previewPackage._id))
                                        .map(tag => tag._id);
                                    const allMergedTags = Array.from(new Set([...(previewPackage.tags || []), ...linkedTags]));

                                    if (allMergedTags.length === 0) return null;

                                    return (
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Tags</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {allMergedTags.map((tagId, idx) => {
                                                    const tag = allTags.find(t => t._id === tagId);
                                                    if (!tag) return null;
                                                    return (
                                                        <span key={idx} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-xl text-xs font-bold border border-blue-100">
                                                            #{tag.name}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className={`h-3 w-3 rounded-full ${previewPackage.isActive ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_8px_rgba(34,197,94,0.4)]`}></span>
                                    <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                                        {previewPackage.isActive ? 'Active' : 'Inactive'} Status
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        setPreviewPackage(null);
                                        handleEditPackage(previewPackage);
                                    }}
                                    className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                                >
                                    Edit This Package
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={confirmDeleteId !== null}
                onClose={() => setConfirmDeleteId(null)}
                onConfirm={() => {
                    if (confirmDeleteId) {
                        handleDeletePackage(confirmDeleteId);
                    }
                }}
                title="Delete Package"
                message={`Are you sure you want to delete this package? This will permanently remove all package data and unlink it from all associated tags.`}
            />
        </div>
    );
};

export default AdminPackages;
