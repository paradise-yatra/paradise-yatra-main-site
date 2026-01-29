"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface SpiritualDestination {
    id: number;
    name: string;
    price: number;
    image: string;
    href: string;
}

const SPIRITUAL_DESTINATIONS: SpiritualDestination[] = [
    {
        id: 1,
        name: "Varanasi",
        price: 9999,
        image: "https://images.unsplash.com/photo-1561359313-0639aad49ca6?q=80&w=1974&auto=format&fit=crop",
        href: "/coming-soon",
    },
    {
        id: 2,
        name: "Kedarnath",
        price: 18499,
        image: "https://images.unsplash.com/photo-1712733900711-d0b929d0d7cc?q=80&w=977&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        href: "/coming-soon",
    },
    {
        id: 3,
        name: "Rishikesh",
        price: 7999,
        image: "https://images.unsplash.com/photo-1650341259809-9314b0de9268?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        href: "/coming-soon",
    },
    {
        id: 4,
        name: "Tirupati",
        price: 8499,
        image: "https://images.unsplash.com/photo-1741003412854-bd4b264c4af3?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        href: "/coming-soon",
    },
    {
        id: 5,
        name: "Vaishno Devi",
        price: 11999,
        image: "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?q=80&w=2000&auto=format&fit=crop",
        href: "/coming-soon",
    },
    {
        id: 6,
        name: "Shirdi",
        price: 12500,
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2000&auto=format&fit=crop",
        href: "/coming-soon",
    },
];

const FILTER_OPTIONS = [
    { id: "3-5", label: "3-5 Days" },
    { id: "6-9", label: "6-9 Days" },
    { id: "10+", label: "10+ Days" },
];

const SpiritualJourneysSection = () => {
    const [activeFilter, setActiveFilter] = useState("3-5");

    return (
        <section className="bg-white py-14 px-4 text-gray-900 md:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Header Style matching India Tour Package */}
                <div className="mb-10 flex flex-col gap-2">
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

                {/* Masonry Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Column 1 */}
                    <div className="space-y-5">
                        {/* Varanasi */}
                        <Link
                            href={SPIRITUAL_DESTINATIONS[0].href}
                            className="relative group overflow-hidden rounded-lg h-[280px] cursor-pointer block"
                        >
                            {/* White hover overlay */}
                            <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>

                            <Image
                                src={SPIRITUAL_DESTINATIONS[0].image}
                                alt={SPIRITUAL_DESTINATIONS[0].name}
                                fill
                                className="object-cover transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white z-10">
                                <h3 className="!text-2xl !font-bold">
                                    {SPIRITUAL_DESTINATIONS[0].name}
                                </h3>
                            </div>
                        </Link>

                        {/* Bottom row - two cards side by side */}
                        <div className="flex gap-4 h-[250px]">
                            {/* Tirupati */}
                            <Link
                                href={SPIRITUAL_DESTINATIONS[3].href}
                                className="relative flex-1 group overflow-hidden rounded-lg cursor-pointer block"
                            >
                                {/* White hover overlay */}
                                <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>

                                <Image
                                    src={SPIRITUAL_DESTINATIONS[3].image}
                                    alt={SPIRITUAL_DESTINATIONS[3].name}
                                    fill
                                    className="object-cover transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-5 left-5 text-white z-10">
                                    <h3 className="!text-2xl !font-bold">
                                        {SPIRITUAL_DESTINATIONS[3].name}
                                    </h3>
                                </div>
                            </Link>

                            {/* Vaishno Devi */}
                            <Link
                                href={SPIRITUAL_DESTINATIONS[4].href}
                                className="relative flex-1 group overflow-hidden rounded-lg cursor-pointer block"
                            >
                                {/* White hover overlay */}
                                <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>

                                <Image
                                    src={SPIRITUAL_DESTINATIONS[4].image}
                                    alt={SPIRITUAL_DESTINATIONS[4].name}
                                    fill
                                    className="object-cover transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-5 left-5 text-white z-10">
                                    <h3 className="!text-2xl !font-bold">
                                        {SPIRITUAL_DESTINATIONS[4].name}
                                    </h3>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Column 2 - Large center card */}
                    <div className="h-[550px]">
                        {/* Kedarnath */}
                        <Link
                            href={SPIRITUAL_DESTINATIONS[1].href}
                            className="relative h-full group overflow-hidden rounded-lg cursor-pointer block"
                        >
                            {/* White hover overlay */}
                            <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>

                            <Image
                                src={SPIRITUAL_DESTINATIONS[1].image}
                                alt={SPIRITUAL_DESTINATIONS[1].name}
                                fill
                                className="object-cover transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-8 left-8 text-white z-10">
                                <h3 className="!text-2xl !font-bold">
                                    {SPIRITUAL_DESTINATIONS[1].name}
                                </h3>
                            </div>
                        </Link>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-5">
                        {/* Rishikesh */}
                        <Link
                            href={SPIRITUAL_DESTINATIONS[2].href}
                            className="relative group overflow-hidden rounded-lg h-[280px] cursor-pointer block"
                        >
                            {/* White hover overlay */}
                            <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>

                            <Image
                                src={SPIRITUAL_DESTINATIONS[2].image}
                                alt={SPIRITUAL_DESTINATIONS[2].name}
                                fill
                                className="object-cover transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white z-10">
                                <h3 className="!text-2xl !font-bold">
                                    {SPIRITUAL_DESTINATIONS[2].name}
                                </h3>
                            </div>
                        </Link>

                        {/* Shirdi */}
                        <Link
                            href={SPIRITUAL_DESTINATIONS[5].href}
                            className="relative group overflow-hidden rounded-lg h-[250px] cursor-pointer block"
                        >
                            {/* White hover overlay */}
                            <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>

                            <Image
                                src={SPIRITUAL_DESTINATIONS[5].image}
                                alt={SPIRITUAL_DESTINATIONS[5].name}
                                fill
                                className="object-cover transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white z-10">
                                <h3 className="!text-2xl !font-bold">
                                    {SPIRITUAL_DESTINATIONS[5].name}
                                </h3>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SpiritualJourneysSection;
