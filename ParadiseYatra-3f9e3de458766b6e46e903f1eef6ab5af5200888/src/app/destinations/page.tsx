"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { getImageUrl } from "@/lib/utils";

interface Destination {
    _id: string;
    name: string;
    slug?: string;
    description: string;
    shortDescription: string;
    image: string;
    location: string;
    price?: number;
    duration?: string;
    rating?: number;
}

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await fetch("/api/destinations");
                if (!response.ok) throw new Error("Failed to fetch destinations");
                const data = await response.json();
                // Unwrap the destinations array
                setDestinations(data.destinations || (Array.isArray(data) ? data : []));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80";

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="!text-3xl md:!text-5xl !font-extrabold text-slate-900 mb-4">
                        Explore All <span className="text-blue-600">Destinations</span>
                    </h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Discover breathtaking places around the world. From serene beaches to majestic mountains,
                        your dream journey starts here.
                    </p>
                </div>

                {error ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-red-100">
                        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                        <p className="text-red-600 font-medium">{error}</p>
                        <Button onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
                    </div>
                ) : destinations.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-500">No destinations found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destinations.map((dest) => (
                            <motion.div
                                key={dest._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group h-full flex flex-col">
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={getImageUrl(dest.image) || FALLBACK_IMAGE}
                                            alt={dest.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <CardContent className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center text-slate-500 text-sm mb-2">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {dest.location}
                                        </div>
                                        <h2 className="!text-xl !font-bold text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                                            {dest.name}
                                        </h2>
                                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                            {dest.shortDescription || dest.description}
                                        </p>

                                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                                            <div>
                                                <span className="text-2xl font-bold text-slate-900">
                                                    {dest.price ? `₹${dest.price.toLocaleString('en-IN')}` : "Contact Us"}
                                                </span>
                                                {dest.duration && (
                                                    <div className="flex items-center text-xs text-slate-500 mt-1">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {dest.duration}
                                                    </div>
                                                )}
                                            </div>
                                            <Link href={`/destinations/${dest.slug || dest._id}`}>
                                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                                    Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
