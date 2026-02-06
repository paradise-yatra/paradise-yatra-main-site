"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Heart, ArrowRight } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import React from "react";

interface HorizontalPackageCardProps {
    id: string;
    title: string;
    destination: string;
    duration: string;
    description: string;
    price: number;
    priceLabel?: string;
    image: string;
    detailUrl: string;
    isInWishlist: boolean;
    onWishlistToggle: (e: React.MouseEvent, pkgId: string) => void;
}

const formatDurationDisplay = (duration: string) => {
    if (!duration) return "";
    const nightsDaysMatch = duration.match(/^\s*(\d+)\s*N\s*\/\s*(\d+)\s*D\s*$/i);
    if (nightsDaysMatch) {
        const nights = nightsDaysMatch[1];
        const days = nightsDaysMatch[2];
        return `${nights}N/${days}D`;
    }
    return duration;
};

const HorizontalPackageCard: React.FC<HorizontalPackageCardProps> = ({
    id,
    title,
    destination,
    duration,
    description,
    price,
    priceLabel = "Starting From",
    image,
    detailUrl,
    isInWishlist,
    onWishlistToggle,
}) => {
    return (
        <div className="group relative bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 overflow-hidden">
            <Link href={detailUrl} className="flex flex-col md:flex-row h-full">
                {/* Image Section */}
                <div className="relative w-full md:w-72 lg:w-80 h-64 md:h-auto flex-shrink-0 overflow-hidden">
                    {getImageUrl(image) ? (
                        <Image
                            src={getImageUrl(image)!}
                            alt={title || `Travel package to ${destination || "destination"}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                            <div className="text-slate-400 flex flex-col items-center">
                                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="!text-xs !font-medium">Image unavailable</span>
                            </div>
                        </div>
                    )}

                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full !text-xs !font-bold !text-blue-600 flex items-center gap-1.5 shadow-sm border border-blue-50/50 !uppercase">
                        <MapPin className="w-3.5 h-3.5" />
                        {destination}
                    </div>

                    {/* Wishlist Button */}
                    <button
                        onClick={(e) => onWishlistToggle(e, id)}
                        className="absolute top-4 right-4 z-40 p-2 rounded-full bg-white border border-white/30 hover:bg-white transition-all shadow-sm group/heart"
                    >
                        <Heart
                            className="w-4 h-4 transition-colors"
                            style={{
                                color: "#005beb",
                                fill: isInWishlist ? "#005beb" : "none",
                            }}
                        />
                    </button>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 md:py-8 md:px-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center flex-wrap gap-2 !text-xs !font-semibold !text-slate-500 mb-4">
                            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md text-slate-600 border border-slate-100">
                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                {formatDurationDisplay(duration)}
                            </span>
                        </div>

                        <h3 className="!text-xl !font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors leading-tight">
                            {title}
                        </h3>

                        <p className="!text-slate-600 !font-semibold !text-sm leading-relaxed line-clamp-2 mb-6">
                            {description}
                        </p>
                    </div>

                    <div className="flex items-end justify-between pt-2 border-t border-dashed border-slate-200">
                        <div className="flex flex-col">
                            <span className="!text-xs !font-bold !text-slate-600 !uppercase !tracking-wider mb-1">{priceLabel}</span>
                            <span className="!text-2xl !font-black !text-transparent !bg-clip-text !bg-gradient-to-r !from-blue-600 !to-indigo-600">
                                ₹ {(price || 0).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 !text-sm !font-bold !text-slate-900 group-hover:translate-x-1 transition-transform">
                            View Itinerary
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-full shadow-md shadow-blue-500/20">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default HorizontalPackageCard;
