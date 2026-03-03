"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Heart, ArrowRight, Hotel, Utensils, Car, Camera } from "lucide-react";
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

const stripHtmlTags = (value: string = "") =>
    value
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, "\"")
        .replace(/&#39;/gi, "'")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/\s+/g, " ")
        .trim();

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
    const plainDescription = stripHtmlTags(description);
    const unitLabel = /couple/i.test(priceLabel) ? "per couple" : "per person";
    const optimizedImageUrl = getImageUrl(image, {
        width: "auto",
        height: 640,
        crop: "fill",
        gravity: "auto",
        quality: "good",
    });

    return (
        <div className="group relative bg-white rounded-[6px] border border-[#dfe1df] transition-all duration-300 overflow-hidden h-auto sm:h-64 flex flex-col sm:flex-row">
            {/* Image Placeholder or Optimized Image */}
            <div className="relative w-full h-48 sm:w-2/5 sm:h-full overflow-hidden shrink-0">
                {optimizedImageUrl ? (
                    <Image
                        src={optimizedImageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        unoptimized={true}
                    />
                ) : (
                    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-slate-200" />
                    </div>
                )}


                {/* Wishlist Button */}
                <button
                    onClick={(e) => onWishlistToggle(e, id)}
                    className="absolute top-3 right-3 z-40 p-2 rounded-full bg-white/90 backdrop-blur-md border border-white/50 hover:bg-white transition-all shadow-sm cursor-pointer"
                >
                    <Heart
                        className="w-3.5 h-3.5 transition-all duration-300"
                        strokeWidth={2.5}
                        style={{
                            color: "#005beb",
                            fill: isInWishlist ? "#005beb" : "none",
                        }}
                    />
                </button>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-5 sm:pb-5 flex flex-col justify-between min-w-0">
                <div className="block">
                    <div className="inline-flex items-center bg-[#EFF6FF] text-[#314594] text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-1.5">
                        {formatDurationDisplay(duration)}
                    </div>

                    <Link href={detailUrl} className="block group/title">
                        <h3 className="!text-lg sm:!text-[20px] !font-bold text-[#000945] leading-tight mb-1 transition-colors line-clamp-1 group-hover/title:underline">
                            {title}
                        </h3>
                    </Link>

                    <p className="!text-[14px] !text-[#000945] font-normal leading-snug line-clamp-2 mb-3">
                        {plainDescription}
                    </p>

                    <div className="flex items-center space-x-4 mb-3 sm:mb-1">
                        <div className="flex items-center text-[#000945] transition-colors" title="Hotel Included">
                            <Hotel className="w-4 h-4" />
                        </div>
                        <div className="flex items-center text-[#000945] transition-colors" title="Meals Included">
                            <Utensils className="w-4 h-4" />
                        </div>
                        <div className="flex items-center text-[#000945] transition-colors" title="Transfers Included">
                            <Car className="w-4 h-4" />
                        </div>
                        <div className="flex items-center text-[#000945] transition-colors" title="Sightseeing Included">
                            <Camera className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] text-[#000945] font-medium border-l border-slate-200 pl-3">+2 more</span>
                    </div>
                </div>

                <div className="flex items-end justify-between pt-4 border-t border-dashed border-slate-200">
                    <div>
                        <p className="text-[12px] text-[#000945] mb-0.5">from</p>
                        <div className="flex items-baseline">
                            <span className="text-xl font-bold text-[#155dfc]">₹ {(price || 0).toLocaleString()}</span>
                            <span className="text-[10px] text-[#000945] ml-1 font-medium italic">{unitLabel}</span>
                        </div>
                    </div>

                    <Link
                        href={detailUrl}
                        className="bg-[#314594] hover:bg-[#253675] text-white text-[11px] font-bold py-2 px-4 rounded-[6px] transition-all duration-300 flex items-center gap-2 group/btn shadow-md shadow-slate-200/50"
                    >
                        View Details
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HorizontalPackageCard;
