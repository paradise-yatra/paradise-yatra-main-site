"use client";

import Image from "next/image";
import Link from "next/link";

interface FestivalDestination {
    id: number;
    name: string;
    price: number;
    image: string;
    href: string;
}

const FESTIVAL_DESTINATIONS: FestivalDestination[] = [
    {
        id: 1,
        name: "Rio Carnival",
        price: 45000,
        image: "https://images.unsplash.com/photo-1522008629172-0c17aa47d1ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        href: "/coming-soon",
    },
    {
        id: 2,
        name: "Cherry Blossom",
        price: 35000,
        image: "https://images.unsplash.com/photo-1526344966-89049886b28d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        href: "/coming-soon",
    },
    {
        id: 3,
        name: "Lantern Festival",
        price: 25000,
        image: "https://images.unsplash.com/photo-1523296066596-7ff8bb6e6d29?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        href: "/coming-soon",
    },
    {
        id: 4,
        name: "Oktoberfest",
        price: 28000,
        image: "https://images.unsplash.com/photo-1729467067923-78d629125e3e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        href: "/coming-soon",
    },
    {
        id: 5,
        name: "Day of the Dead",
        price: 32000,
        image: "https://images.unsplash.com/photo-1667090762902-bd8ee938d3d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        href: "/coming-soon",
    },
    {
        id: 6,
        name: "Loy Krathong",
        price: 18000,
        image: "https://images.unsplash.com/photo-1763818693963-bac021e7b739?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        href: "/coming-soon",
    },
];

const FestivalSection = () => {
    return (
        <section className="bg-white py-14 px-4 text-gray-900 md:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Header Style matching India Tour Package */}
                <div className="mb-10 flex flex-col gap-2">
                    <span className="text-[#005beb] !font-black uppercase tracking-wider text-xs flex items-center gap-2">
                        <span className="h-px w-8 bg-[#005beb]"></span>
                        Cultural Joy
                    </span>
                    <h2 className="!text-2xl !font-bold text-slate-900 md:text-3xl">
                        Celebrations Across the World
                    </h2>
                    <p className="!text-sm !text-slate-600 md:text-base max-w-2xl font-semibold">
                        Immerse yourself in vibrant global traditions and iconic celebrations with our curated cultural tour packages.
                    </p>
                </div>

                {/* Masonry Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Column 1 */}
                    <div className="space-y-5">
                        {/* Rio Carnival */}
                        <Link
                            href={FESTIVAL_DESTINATIONS[0].href}
                            className="relative group overflow-hidden rounded-lg h-[280px] cursor-pointer block"
                        >
                            {/* White hover overlay */}
                            <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>

                            <Image
                                src={FESTIVAL_DESTINATIONS[0].image}
                                alt={FESTIVAL_DESTINATIONS[0].name}
                                fill
                                className="object-cover transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white z-10">
                                <h3 className="!text-2xl !font-bold">
                                    {FESTIVAL_DESTINATIONS[0].name}
                                </h3>
                            </div>
                        </Link>

                        {/* Oktoberfest */}
                        <Link
                            href={FESTIVAL_DESTINATIONS[3].href}
                            className="relative group overflow-hidden rounded-lg h-[250px] cursor-pointer block"
                        >
                            {/* White hover overlay */}
                            <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>

                            <Image
                                src={FESTIVAL_DESTINATIONS[3].image}
                                alt={FESTIVAL_DESTINATIONS[3].name}
                                fill
                                className="object-cover transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white z-10">
                                <h3 className="!text-2xl !font-bold">
                                    {FESTIVAL_DESTINATIONS[3].name}
                                </h3>
                            </div>
                        </Link>
                    </div>

                    {/* Column 2 - Large center card */}
                    <div className="h-[550px]">
                        {/* Cherry Blossom */}
                        <Link
                            href={FESTIVAL_DESTINATIONS[1].href}
                            className="relative h-full group overflow-hidden rounded-lg cursor-pointer block"
                        >
                            {/* White hover overlay */}
                            <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>

                            <Image
                                src={FESTIVAL_DESTINATIONS[1].image}
                                alt={FESTIVAL_DESTINATIONS[1].name}
                                fill
                                className="object-cover transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-8 left-8 text-white z-10">
                                <h3 className="!text-2xl !font-bold">
                                    {FESTIVAL_DESTINATIONS[1].name}
                                </h3>
                            </div>
                        </Link>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-5">
                        {/* Lantern Festival */}
                        <Link
                            href={FESTIVAL_DESTINATIONS[2].href}
                            className="relative group overflow-hidden rounded-lg h-[280px] cursor-pointer block"
                        >
                            {/* White hover overlay */}
                            <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>

                            <Image
                                src={FESTIVAL_DESTINATIONS[2].image}
                                alt={FESTIVAL_DESTINATIONS[2].name}
                                fill
                                className="object-cover transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white z-10">
                                <h3 className="!text-2xl !font-bold">
                                    {FESTIVAL_DESTINATIONS[2].name}
                                </h3>
                            </div>
                        </Link>

                        {/* Bottom row - two cards side by side */}
                        <div className="flex gap-4 h-[250px]">
                            {/* Day of the Dead */}
                            <Link
                                href={FESTIVAL_DESTINATIONS[4].href}
                                className="relative flex-1 group overflow-hidden rounded-lg cursor-pointer block"
                            >
                                {/* White hover overlay */}
                                <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>

                                <Image
                                    src={FESTIVAL_DESTINATIONS[4].image}
                                    alt={FESTIVAL_DESTINATIONS[4].name}
                                    fill
                                    className="object-cover transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-5 left-5 text-white z-10">
                                    <h3 className="!text-2xl !font-bold">
                                        {FESTIVAL_DESTINATIONS[4].name}
                                    </h3>
                                </div>
                            </Link>

                            {/* Loy Krathong */}
                            <Link
                                href={FESTIVAL_DESTINATIONS[5].href}
                                className="relative flex-1 group overflow-hidden rounded-lg cursor-pointer block"
                            >
                                {/* White hover overlay */}
                                <div className="absolute inset-0 bg-white/10 opacity-10 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>

                                <Image
                                    src={FESTIVAL_DESTINATIONS[5].image}
                                    alt={FESTIVAL_DESTINATIONS[5].name}
                                    fill
                                    className="object-cover transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-5 left-5 text-white z-10">
                                    <h3 className="!text-2xl !font-bold">
                                        {FESTIVAL_DESTINATIONS[5].name}
                                    </h3>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FestivalSection;
