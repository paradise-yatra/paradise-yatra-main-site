"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Heart, MapPin, ArrowRight, Loader2, Frown, Compass } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import LoginAlertModal from "@/components/LoginAlertModal";
import Header from "@/components/Header";

// Define a common package interface for display
interface WishlistPackage {
    _id?: string;
    id?: string | number;
    title: string;
    destination: string;
    duration: string;
    price: number;
    images?: string[];
    image?: string;
    slug: string;
    type?: string;
}

export default function WishlistPage() {
    const { user, wishlist, toggleWishlist, isLoading: authLoading } = useAuth();
    const [packages, setPackages] = useState<WishlistPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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

    useEffect(() => {
        // If auth is done loading and no user, showing empty state or redirect could be handled here or in UI
        // For now, if no user, we just won't have a wishlist to fetch
        if (!authLoading && !user) {
            setLoading(false);
            return;
        }

        const fetchWishlistPackages = async () => {
            console.log("Current Wishlist IDs:", wishlist);

            if (wishlist.length === 0) {
                setPackages([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // Fetch from all possible sources to ensure we find the wishlisted items
                const [packagesRes, holidayRes, destinationsRes, fixedRes, adventureRes] = await Promise.all([
                    fetch("/api/packages?limit=100"),
                    fetch("/api/holiday-types"),
                    fetch("/api/destinations"),
                    fetch("/api/fixed-departures"),
                    fetch("/api/adventure-packages")
                ]);

                const [packagesData, holidayData, destinationsData, fixedData, adventureData] = await Promise.all([
                    packagesRes.json().catch(() => ({})),
                    holidayRes.json().catch(() => ([])),
                    destinationsRes.json().catch(() => ({})),
                    fixedRes.json().catch(() => ({})),
                    adventureRes.json().catch(() => ({}))
                ]);

                const normalize = (data: any) => {
                    if (!data) return [];
                    if (Array.isArray(data)) return data;
                    if (data.data && Array.isArray(data.data)) return data.data;
                    if (data.packages) return data.packages;
                    if (data.destinations) return data.destinations;
                    if (data.fixedDepartures) return data.fixedDepartures;
                    if (data.holidayTypes) return data.holidayTypes;
                    if (data.adventurePackages) return data.adventurePackages;
                    return [];
                };

                const allPackages = [
                    ...normalize(packagesData).map((p: any) => ({ ...p, wishType: 'package' })),
                    ...normalize(holidayData).map((p: any) => ({ ...p, wishType: 'holiday' })),
                    ...normalize(destinationsData).map((p: any) => ({ ...p, wishType: 'destination' })),
                    ...normalize(fixedData).map((p: any) => ({ ...p, wishType: 'fixed-departure' })),
                    ...normalize(adventureData).map((p: any) => ({ ...p, wishType: 'adventure' }))
                ];

                console.log("Fetched All Packages Count:", allPackages.length);

                const wishlistItems = allPackages.filter(pkg => {
                    const pkgId = getPackageId(pkg);
                    return wishlist.includes(pkgId);
                });

                console.log("Filtered Wishlist Items:", wishlistItems);

                // Remove duplicates using the robust ID
                const uniqueItems = Array.from(new Map(wishlistItems.map(item => [getPackageId(item), item])).values());

                // Mapping and normalising items to ensure consistent display across different package types
                const mappedItems: WishlistPackage[] = uniqueItems.map((pkg: any) => {
                    const price = typeof pkg.price === 'string'
                        ? parseInt(pkg.price.replace(/[^\d]/g, ''))
                        : (pkg.price || 0);

                    return {
                        _id: pkg._id,
                        id: pkg.id,
                        title: pkg.title || pkg.name || "Romantic Getaway",
                        destination: pkg.destination || pkg.location || pkg.state || pkg.title || "India",
                        duration: pkg.duration || "5N/6D",
                        price: price,
                        images: pkg.images,
                        image: pkg.image || pkg.thumbnail,
                        slug: pkg.slug || getPackageId(pkg),
                        type: pkg.wishType
                    };
                });

                setPackages(mappedItems);
            } catch (error) {
                console.error("Error fetching wishlist packages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistPackages();
    }, [wishlist, user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Header />
                <div className="min-h-[60vh] flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Header />
                <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                    <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-slate-100">
                        <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="h-10 w-10 text-blue-500 fill-blue-500/20" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Login to View Wishlist</h2>
                        <p className="text-slate-500 mb-8">
                            Sign in to see your saved packages, create your dream collection, and access them from anywhere.
                        </p>
                        <Link href="/login" className="block w-full">
                            <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20">
                                Login Now
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (packages.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Header />
                <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
                    <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                        <Frown className="h-12 w-12 text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Your wishlist is empty</h2>
                    <p className="text-slate-500 mb-8 max-w-sm text-center">
                        Explore our destinations and save your favorite packages to create your dream itinerary.
                    </p>
                    <Link href="/">
                        <button className="px-8 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-full transition-all flex items-center gap-2">
                            <Compass className="h-5 w-5" />
                            Explore Packages
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">My Wishlist</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Your collection of dream destinations and packages.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {packages.map((pkg) => {
                        const pkgId = getPackageId(pkg);
                        let href = `/itinerary/${pkg.slug || pkgId}`;
                        if (pkg.type === 'destination') href = `/destinations/${pkg.slug || pkgId}`;
                        if (pkg.type === 'fixed-departure') href = `/fixed-departures/${pkg.slug || pkgId}`;
                        if (pkg.type === 'holiday') href = `/holiday-types/${pkg.slug || pkgId}`;

                        return (
                            <Link href={href} key={pkgId} className="block">
                                <article
                                    className="group cursor-pointer bg-white rounded-lg overflow-hidden border border-gray-300 transition-all duration-300 relative flex flex-col h-full"
                                >
                                    {/* White hover overlay */}
                                    <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none"></div>

                                    <div className="relative h-64 w-full overflow-hidden">
                                        <Image
                                            src={getImageUrl(pkg.images?.[0] || pkg.image || "") || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                                            alt={pkg.title || "Package Image"}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                        {/* Wishlist Button */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleWishlist(pkgId);
                                            }}
                                            className="absolute top-3 right-3 z-40 p-2 rounded-full bg-white border border-white/30 hover:bg-white transition-all shadow-sm group/heart"
                                        >
                                            <Heart className="w-4 h-4 fill-[#005beb] text-[#005beb]" />
                                        </button>

                                        {/* Content on Image */}
                                        <div className="absolute bottom-4 left-4 right-4 text-white">
                                            <div className="flex items-center gap-1.5 mb-1.5 opacity-90">
                                                <MapPin className="h-3.5 w-3.5 text-[#005beb]" />
                                                <span className="!text-xs !font-semibold tracking-wide uppercase">{pkg.destination}</span>
                                            </div>
                                            <h4 className="text-md !font-bold leading-snug line-clamp-2 text-shadow-sm">
                                                {pkg.title}
                                            </h4>
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-500 font-black uppercase tracking-wide">Duration</span>
                                                <span className="text-sm !font-bold text-slate-800 flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#005beb]"></div>
                                                    {pkg.duration}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-slate-500 font-black uppercase tracking-wide">Price</span>
                                                <span className="!text-lg font-black text-[#005beb]">
                                                    ₹{pkg.price?.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-dashed border-gray-300 flex items-center justify-between mt-auto">
                                            <span className="text-xs text-slate-500 font-medium">Per Couple</span>
                                            <div className="text-sm font-semibold text-slate-900 group-hover:text-[#005beb] transition-colors flex items-center gap-2">
                                                View Details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        );
                    })}
                </div>
            </div>
            <LoginAlertModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} theme="blue" />
        </div>
    );
}
