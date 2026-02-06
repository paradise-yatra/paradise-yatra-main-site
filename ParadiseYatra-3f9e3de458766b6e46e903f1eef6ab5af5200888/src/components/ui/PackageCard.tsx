"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Heart, ArrowRight } from "lucide-react";
import React from "react";

interface PackageCardProps {
    id: string | number;
    destination: string;
    duration: string;
    title: string;
    price: number;
    image: string;
    slug: string;
    hrefPrefix: string;
    themeColor: string; // e.g., "#ff1493" or "#005beb"
    priceLabel: string; // e.g., "Per Couple" or "Per Person"
    isInWishlist: boolean;
    onWishlistToggle: (e: React.MouseEvent, pkgId: string) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({
    id,
    destination,
    duration,
    title,
    price,
    image,
    slug,
    hrefPrefix,
    themeColor,
    priceLabel,
    isInWishlist,
    onWishlistToggle
}) => {
    return (
        <Link href={`${hrefPrefix}/${slug}`} className="block flex-shrink-0">
            <article
                className="group cursor-pointer bg-white rounded-lg overflow-hidden border border-gray-300 transition-all duration-300 relative w-[260px] min-w-[260px] md:w-[265px] md:min-w-[265px] max-w-[260px] md:max-w-[265px]"
                style={{ "--theme-color": themeColor } as React.CSSProperties}
            >
                {/* White hover overlay */}
                <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none"></div>

                <div className="relative h-64 w-full overflow-hidden">
                    <Image
                        src={image}
                        alt={destination}
                        fill
                        className="object-cover transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* Wishlist Button */}
                    <button
                        onClick={(e) => onWishlistToggle(e, String(id))}
                        className="absolute top-3 right-3 z-40 p-2 rounded-full bg-white border border-white/30 hover:bg-white transition-all shadow-sm group/heart"
                    >
                        <Heart
                            className="w-4 h-4 transition-colors"
                            style={{
                                color: themeColor,
                                fill: isInWishlist ? themeColor : 'none'
                            }}
                        />
                    </button>

                    {/* Content on Image */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center gap-1.5 mb-1.5 opacity-90">
                            <MapPin className="h-3.5 w-3.5" style={{ color: themeColor }} />
                            <span className="!text-xs !font-semibold tracking-wide uppercase">{destination}</span>
                        </div>
                        <h4 className="text-md !font-bold leading-snug line-clamp-2 text-shadow-sm">
                            {title}
                        </h4>
                    </div>
                </div>

                <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-800 font-black uppercase tracking-wide">Duration</span>
                            <span className="text-sm !font-bold text-slate-800 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }}></div>
                                {duration}
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-slate-800 font-black uppercase tracking-wide">Price</span>
                            <span className="!text-lg font-black" style={{ color: themeColor }}>
                                ₹{price.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-dashed border-gray-300 flex items-center justify-between">
                        <span className="text-xs text-slate-800 ">{priceLabel}</span>
                        <div className="text-sm font-semibold text-slate-900 transition-colors flex items-center gap-2 group-hover:text-[var(--theme-color)]">
                            View Details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default PackageCard;
