"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { toast } from "react-toastify";
import {
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    Tag as TagIcon,
    Search,
    ChevronRight,
    Package,
    Star,
    Globe,
    Plane,
    Mountain,
    CheckCircle2,
    LayoutGrid,
    ListFilter
} from "lucide-react";

interface Tag {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    packages: string[]; // Array of package IDs
    createdAt: string;
}

interface PackageItem {
    _id?: string;
    id?: string;
    title?: string;
    name?: string;
    category?: string;
    duration?: string;
    location?: string;
}

interface PackageCategory {
    id: string;
    label: string;
    icon: any;
    packages: PackageItem[];
    color: string;
}

const AdminTags = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);

    // Robust helper to extract ID from any format
    const getPackageId = (item: any): string => {
        if (!item) return "";
        if (typeof item === 'string') return item;
        if (typeof item === 'object') {
            const id = item._id || item.id;
            if (id && typeof id === 'object' && id.$oid) return id.$oid;
            if (id) return String(id);
        }
        return "";
    };
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTag, setActiveTag] = useState<Tag | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Categories state
    const [categories, setCategories] = useState<PackageCategory[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<string>("trending");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        packages: [] as string[]
    });

    const fetchTags = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/tags");
            if (!response.ok) throw new Error("Failed to fetch tags");
            const result = await response.json();
            if (result.success) {
                setTags(result.data);
            } else {
                throw new Error(result.message || "Failed to fetch tags");
            }
        } catch (err) {
            toast.error("Failed to load tags");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllPackages = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            };

            const [trending, premium, adventure, holiday, fixed, destinations, popularPkgs] = await Promise.all([
                fetch('/api/packages?category=Trending%20Destinations&limit=100', { headers }).then(res => res.json()),
                fetch('/api/packages?category=Premium%20Packages&limit=100', { headers }).then(res => res.json()),
                fetch('/api/packages?category=Adventure%20Tours&limit=100', { headers }).then(res => res.json()),
                fetch('/api/holiday-types?limit=100', { headers }).then(res => res.json()),
                fetch('/api/fixed-departures?limit=100', { headers }).then(res => res.json()),
                fetch('/api/destinations?limit=100', { headers }).then(res => res.json()),
                fetch('/api/packages?category=Popular%20Packages&limit=100', { headers }).then(res => res.json())
            ]);

            const normalize = (data: any) => {
                if (!data) return [];
                if (Array.isArray(data)) return data;
                if (data.packages) return data.packages;
                if (data.destinations) return data.destinations;
                if (data.data && Array.isArray(data.data)) return data.data;
                if (data.fixedDepartures) return data.fixedDepartures;
                if (data.holidayTypes) return data.holidayTypes;
                return [];
            };

            setCategories([
                { id: "trending", label: "Trending", icon: Star, color: "orange", packages: normalize(trending) },
                { id: "premium", label: "Premium", icon: Star, color: "amber", packages: normalize(premium) },
                { id: "adventure", label: "Adventure", icon: Mountain, color: "red", packages: normalize(adventure) },
                { id: "holiday", label: "Holiday Types", icon: Globe, color: "green", packages: normalize(holiday) },
                { id: "fixed", label: "Fixed Departures", icon: Plane, color: "purple", packages: normalize(fixed) },
                {
                    id: "destinations",
                    label: "Popular Dest.",
                    icon: LayoutGrid,
                    color: "blue",
                    packages: [
                        ...normalize(destinations),
                        ...normalize(popularPkgs)
                    ].filter((v, i, a) => a.findIndex(t => getPackageId(t) === getPackageId(v)) === i)
                }
            ]);
        } catch (err) {
            console.error("Failed to fetch packages", err);
            toast.error("Failed to load package categories");
        }
    };

    useEffect(() => {
        fetchTags();
        fetchAllPackages();
    }, []);

    const handleCreate = async () => {
        if (!formData.name.trim()) {
            toast.error("Tag name is required");
            return;
        }

        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch("/api/tags", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to create tag");

            toast.success("Tag created successfully!");
            setShowCreateForm(false);
            resetForm();
            fetchTags();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "An error occurred");
        }
    };

    const handleUpdate = async () => {
        if (!activeTag || !formData.name.trim()) return;

        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(`/api/tags/${activeTag._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to update tag");

            toast.success("Tag updated successfully!");
            setIsEditing(false);
            fetchTags();
            // Update local active tag
            setActiveTag({ ...activeTag, ...formData });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "An error occurred");
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(`/api/tags/${deleteId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to delete tag");

            toast.success("Tag deleted successfully");
            setDeleteId(null);
            if (activeTag?._id === deleteId) setActiveTag(null);
            fetchTags();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "An error occurred");
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            packages: []
        });
    };

    const handleTagSelect = (tag: Tag) => {
        setActiveTag(tag);
        // Ensure packages are normalized to string IDs for consistent tracking
        const normalizedPackages = (tag.packages || [])
            .map(p => getPackageId(p))
            .filter(id => id !== "");

        setFormData({
            name: tag.name,
            description: tag.description || "",
            packages: normalizedPackages
        });
        setIsEditing(false);
        setShowCreateForm(false);
    };

    const togglePackage = (pkg: any) => {
        const itemId = getPackageId(pkg);
        if (!itemId) return;

        setFormData(prev => {
            const isSelected = prev.packages.includes(itemId);

            if (isSelected) {
                return {
                    ...prev,
                    packages: prev.packages.filter(id => id !== itemId)
                };
            } else {
                return { ...prev, packages: [...prev.packages, itemId] };
            }
        });
    };

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-gray-50 rounded-xl overflow-hidden shadow-inner">
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Tag List */}
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-100 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Tags</h2>
                            <Button
                                size="sm"
                                onClick={() => {
                                    setShowCreateForm(true);
                                    setActiveTag(null);
                                    resetForm();
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-2 h-8"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                New
                            </Button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1CustomScrollbar">
                        {loading && tags.length === 0 ? (
                            <div className="flex justify-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : filteredTags.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <TagIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p>No tags found</p>
                            </div>
                        ) : (
                            filteredTags.map((tag) => (
                                <button
                                    key={tag._id}
                                    onClick={() => handleTagSelect(tag)}
                                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${activeTag?._id === tag._id
                                        ? "bg-blue-50 text-blue-700 shadow-sm border-blue-100"
                                        : "hover:bg-gray-50 text-gray-700"
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-lg ${activeTag?._id === tag._id ? "bg-white" : "bg-blue-50"
                                                }`}>
                                                <TagIcon className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="!font-semibold !text-lg truncate w-40">{tag.name}</h3>
                                                <p className="text-xs !text-slate-700">/{tag.slug}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className={`w-4 h-4 transition-transform ${activeTag?._id === tag._id ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                                            }`} />
                                    </div>
                                    <div className="mt-2 flex items-center space-x-2">
                                        <Badge variant="outline" className="text-[10px] text-slate-900 py-0 px-1.5 border-blue-100 bg-blue-50/50">
                                            {tag.packages?.length || 0} Packages
                                        </Badge>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Content - Tag Details & Package Linking */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-8 CustomScrollbar">
                    <AnimatePresence mode="wait">
                        {showCreateForm || (activeTag && isEditing) ? (
                            <motion.div
                                key="edit-form"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-4xl mx-auto space-y-8"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        {showCreateForm ? "Create New Tag" : `Edit Tag: ${activeTag?.name}`}
                                    </h2>
                                    <div className="flex space-x-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowCreateForm(false);
                                                setIsEditing(false);
                                            }}
                                            className="rounded-xl text-slate-900"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={showCreateForm ? handleCreate : handleUpdate}
                                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Tag
                                        </Button>
                                    </div>
                                </div>

                                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                                    <CardHeader className="bg-white border-b border-gray-100">
                                        <CardTitle className="text-lg font-semibold flex items-center">
                                            <ListFilter className="w-5 h-5 mr-2 text-blue-600" />
                                            Basic Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Tag Name <span className="text-red-500">*</span></label>
                                                <Input
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="e.g., Honeymoon, Adventure, Luxury"
                                                    className="bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 rounded-xl py-6"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Description</label>
                                                <Textarea
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    placeholder="What packages should have this tag?"
                                                    rows={4}
                                                    className="bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                                    <CardHeader className="bg-white border-b border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="!text-lg !font-semibold flex items-center">
                                                <Package className="w-5 h-5 mr-2 text-blue-600" />
                                                Link Packages
                                            </CardTitle>
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                                {formData.packages.length} selected
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="flex h-[500px]">
                                            {/* Categories Sidebar */}
                                            <div className="w-48 bg-gray-50 border-r border-gray-100 p-2 space-y-1">
                                                {categories.map((cat) => (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => setActiveCategoryId(cat.id)}
                                                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeCategoryId === cat.id
                                                            ? "bg-white text-blue-600 shadow-sm border-gray-100"
                                                            : "text-gray-500 hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <cat.icon className={`w-4 h-4 ${activeCategoryId === cat.id ? `text-${cat.color}-500` : ""}`} />
                                                            <span>{cat.label}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Package List */}
                                            <div className="flex-1 p-6 overflow-y-auto CustomScrollbar">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {categories.find(c => c.id === activeCategoryId)?.packages.map((pkg) => {
                                                        const pkgId = getPackageId(pkg);
                                                        if (!pkgId) return null;
                                                        const isSelected = formData.packages.includes(pkgId);
                                                        return (
                                                            <button
                                                                key={pkgId}
                                                                onClick={() => togglePackage(pkg)}
                                                                className={`flex items-center text-left p-3 rounded-xl border transition-all ${isSelected
                                                                    ? "bg-blue-50 border-blue-200 ring-1 ring-blue-100"
                                                                    : "bg-white border-gray-100 hover:border-blue-100"
                                                                    }`}
                                                            >
                                                                <div className={`p-2 rounded-lg mr-3 ${isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                                                                    <CheckCircle2 className={`w-4 h-4 ${isSelected ? "opacity-100" : "opacity-30"}`} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={`font-medium truncate ${isSelected ? "!text-blue-900" : "!text-gray-700"}`}>
                                                                        {pkg.title || pkg.name}
                                                                    </p>
                                                                    <p className="text-[10px] text-gray-500 truncate">
                                                                        {pkg.category || pkg.location || "Package"}
                                                                    </p>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : activeTag ? (
                            <motion.div
                                key="tag-view"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="max-w-4xl mx-auto space-y-8"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-4 bg-white rounded-2xl shadow-sm">
                                            <TagIcon className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 className="!text-xl !font-bold text-gray-900">{activeTag.name}</h2>
                                            <p className="text-gray-500 font-medium">/{activeTag.slug}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsEditing(true)}
                                            className="rounded-xl bg-white text-slate-900"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Tag
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => setDeleteId(activeTag._id)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Card className="md:col-span-2 border-none shadow-sm rounded-2xl">
                                        <CardHeader>
                                            <CardTitle className="!text-lg !font-bold">Description</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="!text-gray-600 leading-relaxed">
                                                {activeTag.description || "No description provided."}
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-none shadow-sm rounded-2xl">
                                        <CardHeader>
                                            <CardTitle className="!text-lg !font-bold">Stats</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">Packages</span>
                                                <Badge className="bg-blue-600 font-bold">{activeTag.packages?.length || 0}</Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">Created</span>
                                                <span className="text-sm font-medium">{new Date(activeTag.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="!text-xl !font-bold text-gray-900 flex items-center">
                                        <Package className="w-6 h-6 mr-2 text-blue-600" />
                                        Linked Packages
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {activeTag.packages && activeTag.packages.length > 0 ? (
                                            activeTag.packages.map((item: any, index: number) => {
                                                const pkgId = getPackageId(item);
                                                // Combine with index to ensure uniqueness even if IDs repeat
                                                const uniqueKey = pkgId ? `${pkgId}-${index}` : `pkg-${index}`;

                                                // Find package info in categorized state if not already populated
                                                let pkgInfo = typeof item === 'object' && (item.title || item.name) ? { ...item } : null;

                                                if (!pkgInfo && pkgId) {
                                                    for (const cat of categories) {
                                                        const found = cat.packages.find(p => getPackageId(p) === pkgId);
                                                        if (found) {
                                                            pkgInfo = { ...found, category: cat.label };
                                                            break;
                                                        }
                                                    }
                                                }

                                                return (
                                                    <div key={uniqueKey} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 group hover:border-blue-200 transition-colors">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="!font-semibold !text-gray-900 truncate">
                                                                    {pkgInfo?.title || pkgInfo?.name || "Unknown Package"}
                                                                </p>
                                                                <p className="!text-xs !text-gray-500 mt-1">
                                                                    {pkgInfo?.category || "Loading..."}
                                                                </p>
                                                            </div>
                                                            <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="col-span-full py-12 text-center bg-gray-100 rounded-3xl border-2 border-dashed border-gray-200">
                                                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500">No packages linked to this tag yet.</p>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setIsEditing(true)}
                                                    className="!text-blue-600 font-bold hover:bg-transparent"
                                                >
                                                    Link Packages Now
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center space-y-4"
                            >
                                <div className="p-8 bg-blue-50 rounded-full">
                                    <TagIcon className="w-16 h-16 text-blue-200" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Select a Tag</h2>
                                    <p className="text-gray-500">Choose a tag from the sidebar to view details and link packages.</p>
                                </div>
                                <Button
                                    onClick={() => setShowCreateForm(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create New Tag
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <ConfirmationDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Tag"
                message="Are you sure you want to delete this tag? This action cannot be undone."
            />

            <style jsx global>{`
                .CustomScrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .CustomScrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .CustomScrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .CustomScrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
};

export default AdminTags;
