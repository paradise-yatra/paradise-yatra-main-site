"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface SpiritualDestination {
    id: string;
    name: string;
    image: string;
    href: string;
    slug?: string;
}

const SpiritualJourneysSection = () => {
    const [destinations, setDestinations] = useState<SpiritualDestination[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpiritualData = async () => {
            try {
                setLoading(true);

                // 1. Fetch the spiritual tag directly by slug for maximum reliability
                // 2. Fetch all tags to find potential children/sub-tags
                const [tagRes, allTagsRes] = await Promise.all([
                    fetch("/api/tags/slug/spiritual", { cache: 'no-store' }),
                    fetch("/api/tags", { cache: 'no-store' })
                ]);

                const tagResult = await tagRes.json();
                const allTagsResult = await allTagsRes.json();

                let spiritualTag = tagResult.success ? tagResult.data : null;
                const allTags = allTagsResult.success ? allTagsResult.data : [];

                // If not found by slug, search the allTags list for any match
                if (!spiritualTag) {
                    spiritualTag = allTags.find((t: any) => {
                        const slug = t.slug?.toLowerCase() || "";
                        const name = t.name?.toLowerCase() || "";
                        return slug.includes("spiritual") || name.includes("spiritual");
                    });
                }

                if (spiritualTag) {
                    // console.log("Spiritual Tag found:", spiritualTag);

                    // 1. Get sub-tags (children of this tag)
                    const subTags = allTags.filter((t: any) => {
                        const parent = t.parent;
                        if (!parent) return false;
                        const parentId = typeof parent === 'string' ? parent : parent._id;
                        return String(parentId) === String(spiritualTag._id);
                    });

                    let finalItems: SpiritualDestination[] = [];

                    // Map sub-tags
                    if (subTags.length > 0) {
                        finalItems = subTags.map((t: any) => ({
                            id: t._id,
                            name: t.name,
                            image: getImageUrl(t.image) || (t.packages?.[0]?.image ? getImageUrl(t.packages[0].image) : "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?q=80&w=2000&auto=format&fit=crop"),
                            href: `/package/theme/${t.slug}`,
                            slug: t.slug
                        }));
                    }

                    // Map direct packages (combine with sub-tags if any)
                    if (spiritualTag.packages && spiritualTag.packages.length > 0) {
                        const packageItems = spiritualTag.packages.map((pkg: any) => ({
                            id: pkg._id || pkg.id,
                            name: pkg.name || pkg.title || "Spiritual Package",
                            image: getImageUrl(pkg.image) || (pkg.images?.[0] ? getImageUrl(pkg.images[0]) : "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?q=80&w=2000&auto=format&fit=crop"),
                            href: `/package/${pkg.slug || pkg._id || pkg.id}`,
                            slug: pkg.slug
                        }));

                        // Prevent duplicates if a package is also in a sub-tag (though unlikely to matter for display)
                        const existingIds = new Set(finalItems.map((item: any) => item.id));
                        packageItems.forEach((item: any) => {
                            if (!existingIds.has(item.id)) {
                                finalItems.push(item);
                            }
                        });
                    }

                    setDestinations(finalItems);
                } else {
                    setDestinations([]);
                }
            } catch (error) {
                console.error("Error fetching spiritual data:", error);
                setDestinations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSpiritualData();
    }, []);

    return (
        <section className="bg-white py-14 px-4 text-gray-900 md:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Header Style matching India Tour Package */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <span className="text-[#005beb] !font-black uppercase tracking-wider text-xs flex items-center gap-2">
                            <span className="h-px w-8 bg-[#005beb]"></span>
                            Divine India
                        </span>
                        <h2 className="!text-2xl !font-bold text-slate-900 md:text-3xl">
                            A Journey Through Sacred India
                        </h2>
                        <p className="!text-sm !text-slate-600 md:text-base max-w-2xl font-semibold">
                            Find peace and divine connection with our handpicked pilgrimage packages across India's most revered temples and sacred cities.
                        </p>
                    </div>

                    <Link
                        href="/package/theme/spiritual"
                        className="group flex items-center gap-2 text-[#005beb] font-bold text-sm bg-blue-50 hover:bg-[#005beb] hover:text-white px-6 py-3 rounded-xl transition-all duration-300 w-fit shrink-0 border border-blue-100/50"
                    >
                        View All Packages
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Masonry Grid Layout */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-pulse">
                        <div className="space-y-5">
                            <div className="bg-gray-200 h-[280px] rounded-lg"></div>
                            <div className="flex gap-4 h-[250px]">
                                <div className="flex-1 bg-gray-200 rounded-lg"></div>
                                <div className="flex-1 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                        <div className="bg-gray-200 h-[550px] rounded-lg"></div>
                        <div className="space-y-5">
                            <div className="bg-gray-200 h-[280px] rounded-lg"></div>
                            <div className="bg-gray-200 h-[250px] rounded-lg"></div>
                        </div>
                    </div>
                ) : destinations.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        No spiritual journeys available at the moment.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Column 1 */}
                        <div className="space-y-5">
                            {/* Slot 1: Varanasi equivalents */}
                            {destinations[0] && (
                                <Link
                                    href={destinations[0].href}
                                    className="relative group overflow-hidden rounded-lg h-[280px] cursor-pointer block"
                                >
                                    <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>
                                    <Image
                                        src={destinations[0].image}
                                        alt={destinations[0].name}
                                        fill
                                        className="object-cover transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 text-white z-10">
                                        <h3 className="!text-2xl !font-bold">
                                            {destinations[0].name}
                                        </h3>
                                    </div>
                                </Link>
                            )}

                            {/* Bottom row - two cards side by side */}
                            {(destinations[3] || destinations[4]) && (
                                <div className="flex gap-4 h-[250px]">
                                    {/* Slot 4 */}
                                    {destinations[3] && (
                                        <Link
                                            href={destinations[3].href}
                                            className="relative flex-1 group overflow-hidden rounded-lg cursor-pointer block"
                                        >
                                            <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>
                                            <Image
                                                src={destinations[3].image}
                                                alt={destinations[3].name}
                                                fill
                                                className="object-cover transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                            <div className="absolute bottom-5 left-5 text-white z-10">
                                                <h3 className="!text-xl md:!text-2xl !font-bold">
                                                    {destinations[3].name}
                                                </h3>
                                            </div>
                                        </Link>
                                    )}

                                    {/* Slot 5 */}
                                    {destinations[4] && (
                                        <Link
                                            href={destinations[4].href}
                                            className="relative flex-1 group overflow-hidden rounded-lg cursor-pointer block"
                                        >
                                            <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>
                                            <Image
                                                src={destinations[4].image}
                                                alt={destinations[4].name}
                                                fill
                                                className="object-cover transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                            <div className="absolute bottom-5 left-5 text-white z-10">
                                                <h3 className="!text-xl md:!text-2xl !font-bold">
                                                    {destinations[4].name}
                                                </h3>
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Column 2 - Large center card */}
                        <div className="h-[550px]">
                            {/* Slot 2 */}
                            {destinations[1] && (
                                <Link
                                    href={destinations[1].href}
                                    className="relative h-full group overflow-hidden rounded-lg cursor-pointer block"
                                >
                                    <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>
                                    <Image
                                        src={destinations[1].image}
                                        alt={destinations[1].name}
                                        fill
                                        className="object-cover transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                    <div className="absolute bottom-8 left-8 text-white z-10">
                                        <h3 className="!text-2xl !font-bold">
                                            {destinations[1].name}
                                        </h3>
                                    </div>
                                </Link>
                            )}
                        </div>

                        {/* Column 3 */}
                        <div className="space-y-5">
                            {/* Slot 3 */}
                            {destinations[2] && (
                                <Link
                                    href={destinations[2].href}
                                    className="relative group overflow-hidden rounded-lg h-[280px] cursor-pointer block"
                                >
                                    <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>
                                    <Image
                                        src={destinations[2].image}
                                        alt={destinations[2].name}
                                        fill
                                        className="object-cover transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 text-white z-10">
                                        <h3 className="!text-2xl !font-bold">
                                            {destinations[2].name}
                                        </h3>
                                    </div>
                                </Link>
                            )}

                            {/* Slot 6 */}
                            {destinations[5] && (
                                <Link
                                    href={destinations[5].href}
                                    className="relative group overflow-hidden rounded-lg h-[250px] cursor-pointer block"
                                >
                                    <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>
                                    <Image
                                        src={destinations[5].image}
                                        alt={destinations[5].name}
                                        fill
                                        className="object-cover transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 text-white z-10">
                                        <h3 className="!text-2xl !font-bold">
                                            {destinations[5].name}
                                        </h3>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SpiritualJourneysSection;
