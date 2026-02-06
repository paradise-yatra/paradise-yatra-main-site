"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Calendar, MapPin, Users, Clock, ArrowRight, Star,
    CheckCircle2, ShieldCheck, Zap, Bell, Search, Filter,
    ChevronRight, TrendingUp, X, SlidersHorizontal, Heart
} from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import LoginAlertModal from '@/components/LoginAlertModal';

interface Departure {
    _id: string;
    title: string;
    slug: string;
    subtitle?: string;
    destination: string;
    departureDate: string;
    returnDate: string;
    duration: string;
    price: number;
    originalPrice?: number | null;
    availableSeats: number;
    totalSeats: number;
    image: string;
    tag: string;
    typeColor?: string;
    rating?: number;
    reviews?: number;
    location?: string;
    transport?: string;
    hotel?: string;
    meals?: string;
    nextDeparture?: string;
    shortDescription: string;
}

interface FixedDeparturesClientProps {
    departures: Departure[];
}

export default function FixedDeparturesClient({ departures }: FixedDeparturesClientProps) {
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('all');
    const [selectedDuration, setSelectedDuration] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Wishlist states
    const { user, toggleWishlist: contextToggleWishlist, isInWishlist } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const handleWishlistToggle = (e: React.MouseEvent, pkgId: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            setIsLoginModalOpen(true);
            return;
        }

        contextToggleWishlist(pkgId);
    };

    // Extract unique categories from departures
    // Extract unique categories from departures, excluding "Fixed Departure"
    const categories = ['All Departures', ...Array.from(new Set(departures.map(d => d.tag).filter(t => t && t !== 'Fixed Departure')))];

    // Restore filters from sessionStorage on mount
    useEffect(() => {
        const savedFilter = sessionStorage.getItem('fd_filter');
        const savedPrice = sessionStorage.getItem('fd_price');
        const savedDuration = sessionStorage.getItem('fd_duration');
        const savedSort = sessionStorage.getItem('fd_sort');
        const savedSearch = sessionStorage.getItem('fd_search');

        if (savedFilter) setFilter(savedFilter);
        if (savedPrice) setSelectedPrice(savedPrice);
        if (savedDuration) setSelectedDuration(savedDuration);
        if (savedSort) setSortBy(savedSort);
        if (savedSearch) setSearchQuery(savedSearch);

        // Robust scroll to top on mount
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
            requestAnimationFrame(() => window.scrollTo(0, 0));
        }

        setIsMounted(true);
    }, []);

    // Save filters to sessionStorage whenever they change
    useEffect(() => {
        if (!isMounted) return;
        sessionStorage.setItem('fd_filter', filter);
        sessionStorage.setItem('fd_price', selectedPrice);
        sessionStorage.setItem('fd_duration', selectedDuration);
        sessionStorage.setItem('fd_sort', sortBy);
        sessionStorage.setItem('fd_search', searchQuery);
    }, [filter, selectedPrice, selectedDuration, sortBy, searchQuery, isMounted]);

    const filteredDepartures = departures.filter(item => {
        const matchesCategory = filter === 'all' ||
            item.tag.toLowerCase() === filter.toLowerCase();

        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.destination.toLowerCase().includes(searchQuery.toLowerCase());

        // Price Filter Logic
        let matchesPrice = true;
        if (selectedPrice === 'under_15k') matchesPrice = item.price < 15000;
        else if (selectedPrice === '15k_25k') matchesPrice = item.price >= 15000 && item.price <= 25000;
        else if (selectedPrice === 'above_25k') matchesPrice = item.price > 25000;

        // Duration Filter Logic
        let matchesDuration = true;
        const days = parseInt(item.duration.split('/')[1]?.trim() || item.duration) || 0;
        if (selectedDuration === 'short') matchesDuration = days <= 5;
        else if (selectedDuration === 'medium') matchesDuration = days > 5 && days <= 10;
        else if (selectedDuration === 'long') matchesDuration = days > 10;

        return matchesCategory && matchesSearch && matchesPrice && matchesDuration;
    }).sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'duration_short') {
            const daysA = parseInt(a.duration.split('/')[1]?.trim() || a.duration) || 0;
            const daysB = parseInt(b.duration.split('/')[1]?.trim() || b.duration) || 0;
            return daysA - daysB;
        }
        return 0;
    });

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    const clearFilters = () => {
        setFilter('all');
        setSelectedPrice('all');
        setSelectedDuration('all');
        setSearchQuery('');
        setSortBy('default');

        sessionStorage.removeItem('fd_filter');
        sessionStorage.removeItem('fd_price');
        sessionStorage.removeItem('fd_duration');
        sessionStorage.removeItem('fd_sort');
        sessionStorage.removeItem('fd_search');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };


    const sidebarContent = (isMobile: boolean, hideSearch = false) => (
        <div className={`${isMobile ? 'space-y-6' : 'space-y-8'}`}>
            {/* Search Input */}
            {!hideSearch && (
                <div className="space-y-4 ">
                    <h3 className="!text-[11px] !font-black uppercase tracking-[0.2em] text-slate-400 !font-plus-jakarta-sans">Search Tours</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            (document.activeElement as HTMLElement)?.blur();
                        }}
                        className="relative group"
                    >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 !text-slate-400 group-focus-within:!text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search destination..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all !font-bold !text-slate-900 !text-sm"
                        />
                    </form>
                </div>
            )}

            {/* Reset Button */}
            {(filter !== 'all' || selectedPrice !== 'all' || selectedDuration !== 'all' || searchQuery !== '') && (
                <button
                    onClick={clearFilters}
                    className="w-full py-3 px-4 bg-red-50 !text-red-600 rounded-xl !text-[11px] !font-black uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                    <Zap className="w-3 h-3" />
                    Reset All Filters
                </button>
            )}



            {/* Price Filter */}
            <div className="space-y-4">
                <h3 className="!text-[11px] !font-black uppercase tracking-[0.2em] !text-slate-400 !font-plus-jakarta-sans">Price Range</h3>
                <div className="grid grid-cols-1 gap-2">
                    {[
                        { label: 'Any Price', val: 'all' },
                        { label: 'Under ₹15,000', val: 'under_15k' },
                        { label: '₹15,000 - ₹25,000', val: '15k_25k' },
                        { label: 'Above ₹25,000', val: 'above_25k' }
                    ].map((p) => (
                        <button
                            key={p.val}
                            onClick={() => {
                                setSelectedPrice(p.val);
                                if (isMobile) setIsMobileFilterOpen(false);
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${selectedPrice === p.val ? 'bg-blue-50 !text-blue-700 border-2 border-blue-200 shadow-sm' : 'bg-white border-2 border-slate-50 !text-slate-600 hover:border-slate-200'}`}
                        >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPrice === p.val ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                                {selectedPrice === p.val && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </div>
                            <span className="!text-[12px] !font-bold uppercase tracking-tight">{p.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Duration Filter */}
            <div className="space-y-4">
                <h3 className="!text-[11px] !font-black uppercase tracking-[0.2em] !text-slate-400 !font-plus-jakarta-sans">Duration</h3>
                <div className="grid grid-cols-1 gap-2">
                    {[
                        { label: 'Any Duration', val: 'all', icon: Clock },
                        { label: 'Short (1-5 Days)', val: 'short', icon: Zap },
                        { label: 'Medium (6-10 Days)', val: 'medium', icon: Calendar },
                        { label: 'Long (11+ Days)', val: 'long', icon: MapPin }
                    ].map((d) => (
                        <button
                            key={d.val}
                            onClick={() => {
                                setSelectedDuration(d.val);
                                if (isMobile) setIsMobileFilterOpen(false);
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${selectedDuration === d.val ? 'bg-blue-50 !text-blue-700 border-2 border-blue-200 shadow-sm' : 'bg-white border-2 border-slate-50 !text-slate-600 hover:border-slate-200'}`}
                        >
                            <d.icon className={`w-4 h-4 ${selectedDuration === d.val ? '!text-blue-600' : '!text-slate-400'}`} />
                            <span className="!text-[12px] !font-bold uppercase tracking-tight">{d.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="font-plus-jakarta-sans bg-slate-50"
        >


            {/* Header */}
            <Header />

            {/* Hero Section - Optimized Premium */}
            <section className="relative min-h-[450px] md:min-h-[500px] flex items-center bg-[#0B1120] overflow-hidden">
                {/* Dynamic Background */}
                <div className="absolute inset-0 z-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
                            alt="Mountain Landscape"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent" />

                    {/* Subtle Particles */}
                    <div className="absolute inset-0 opacity-20">
                        {isMounted && [...Array(15)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                                initial={{
                                    x: Math.random() * 100 + "%",
                                    y: Math.random() * 100 + "%",
                                    opacity: Math.random()
                                }}
                                animate={{
                                    y: [null, "-15px", "15px"],
                                    opacity: [0.1, 0.4, 0.1]
                                }}
                                transition={{
                                    duration: 4 + Math.random() * 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10 w-full py-12 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md">
                                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[11px] font-black uppercase tracking-widest text-blue-400">Live Fixed Departures 2026</span>
                            </div>

                            <div className="space-y-4">
                                <h1 className="!text-3xl md:!text-6xl font-black text-white leading-[1.05] tracking-tight">
                                    Guaranteed <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 bg-[length:200%_auto] animate-gradient-x">
                                        Memories.
                                    </span>
                                </h1>
                                <p className="text-xl !text-slate-200 font-medium leading-relaxed max-w-xl">
                                    Join our curated group journeys designed for the discerning traveler. Professional planning, premium stays, and guaranteed departures.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-6 pt-4">
                                {[
                                    { label: 'Confirmed Batches', count: '45+', icon: TrendingUp },
                                    { label: 'Happy Travelers', count: '1k+', icon: Users },
                                    { label: 'Expert Guides', count: '100%', icon: ShieldCheck },
                                ].map((stat, i) => (
                                    <div
                                        key={i}
                                        className="space-y-1"
                                    >
                                        <div className="flex items-center gap-2 text-white font-black text-xl">
                                            <stat.icon className="w-5 h-5 text-blue-500" />
                                            {stat.count}
                                        </div>
                                        <div className="text-[11px] !text-slate-300 uppercase font-black tracking-widest">{stat.label}</div>
                                    </div>
                                ))}
                            </div>


                        </motion.div>


                    </div>
                </div>

            </section>

            {/* Filter & Listing Section */}
            <main id="departures-list" className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-20">

                {/* Mobile Search & Filter Trigger */}
                <div className="lg:hidden space-y-6 mb-8 pb-6 border-b border-slate-100">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            (document.activeElement as HTMLElement)?.blur();
                        }}
                        className="relative group"
                    >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 !text-slate-400 group-focused-within:!text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search tours or destinations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all !font-bold !text-slate-900 !text-sm shadow-sm"
                        />
                    </form>

                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="!text-xl !font-black text-slate-900">Explore Tours</h2>
                            <p className="!text-[11px] !font-bold text-slate-500 uppercase tracking-widest">{filteredDepartures.length} Batches Found</p>
                        </div>
                        <button
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
                        >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Mobile Filter Modal */}
                <AnimatePresence>
                    {isMobileFilterOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden"
                            />
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed inset-x-0 bottom-0 bg-white rounded-t-[2.5rem] z-[101] lg:hidden max-h-[90vh] overflow-y-auto"
                            >
                                <div className="sticky top-0 bg-white/80 backdrop-blur-md px-6 py-5 border-b border-slate-50 flex items-center justify-between z-10">
                                    <h2 className="!text-lg !font-black text-slate-900">Filters</h2>
                                    <button
                                        onClick={() => setIsMobileFilterOpen(false)}
                                        className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    {sidebarContent(true, true)}
                                </div>
                                <div className="p-6 pt-0 sticky bottom-0 bg-white/80 backdrop-blur-md">
                                    <button
                                        onClick={() => setIsMobileFilterOpen(false)}
                                        className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20"
                                    >
                                        Show {filteredDepartures.length} Results
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Modern Sidebar and List Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block lg:col-span-1">
                        {sidebarContent(false)}
                    </aside>

                    {/* Departures List */}
                    <div className="lg:col-span-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                            <div>
                                <h2 className="!text-2xl !font-black !text-slate-900 mb-1">Available Departures</h2>
                                <p className="!text-sm !text-slate-500 !font-semibold">
                                    Total {filteredDepartures.length} confirmed batches available
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-100 rounded-xl">
                                    <Filter className="w-3.5 h-3.5 !text-slate-400" />
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="bg-transparent border-none focus:ring-0 !text-[11px] !font-black uppercase tracking-wider !text-slate-700 outline-none cursor-pointer"
                                    >
                                        <option value="default">Sort By: Default</option>
                                        <option value="price_low">Price: Low to High</option>
                                        <option value="price_high">Price: High to Low</option>
                                        <option value="duration_short">Duration: Shortest First</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-8"
                        >
                            <AnimatePresence mode='popLayout'>
                                {filteredDepartures.map((item) => {
                                    const typeColorClass = 'bg-blue-600';

                                    return (
                                        <motion.div
                                            key={item._id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                            variants={itemVariants}
                                            className="group bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 overflow-hidden"
                                        >
                                            <Link href={`/fixed-departures/${item.slug}`} className="flex flex-col md:flex-row h-full">
                                                {/* Image Area */}
                                                <div className="relative w-full md:w-72 lg:w-80 h-64 md:h-auto flex-shrink-0 overflow-hidden">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />

                                                    {/* Location Badge */}
                                                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-blue-600 flex items-center gap-1.5 shadow-sm border border-blue-50/50">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {item.destination}
                                                    </div>

                                                    {/* Wishlist Toggle Button */}
                                                    <button
                                                        onClick={(e) => handleWishlistToggle(e, item._id)}
                                                        className="absolute top-4 right-4 z-20 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all group/wishlist border border-slate-100"
                                                    >
                                                        <Heart
                                                            className={`w-4 h-4 transition-colors ${isInWishlist(item._id)
                                                                ? 'fill-red-500 text-red-500'
                                                                : 'text-slate-400 group-hover/wishlist:text-red-500'
                                                                }`}
                                                        />
                                                    </button>
                                                </div>

                                                {/* Content Area */}
                                                <div className="flex-1 p-6 md:py-8 md:px-8 flex flex-col justify-between">
                                                    <div>
                                                        {/* Duration Badge */}
                                                        <div className="flex items-center flex-wrap gap-2 text-xs font-semibold text-slate-500 mb-4">
                                                            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md text-slate-600 border border-slate-100">
                                                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                                                {item.duration}
                                                            </span>
                                                        </div>

                                                        {/* Title */}
                                                        <h3 className="!text-xl !font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors leading-tight">
                                                            {item.title}
                                                        </h3>

                                                        {/* Description */}
                                                        <p className="!text-slate-600 !font-semibold !text-sm leading-relaxed line-clamp-2 mb-6">
                                                            {item.subtitle || item.shortDescription}
                                                        </p>

                                                        {/* Info Grid */}
                                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                                                                    <Calendar className="w-4 h-4 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="!text-xs !font-bold !text-slate-500 uppercase tracking-wide">Departure</p>
                                                                    <p className="!text-sm !font-semibold !text-slate-800">{formatDate(item.departureDate)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                                                                    <Users className="w-4 h-4 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="!text-xs !font-bold !text-slate-500 uppercase tracking-wide">Seats Left</p>
                                                                    <p className={`!text-sm !font-semibold ${item.availableSeats < 10 ? '!text-red-500' : '!text-green-600'}`}>
                                                                        {item.availableSeats} Available
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Price and CTA */}
                                                    <div className="flex items-end justify-between pt-2 border-t border-dashed border-slate-200">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold !text-slate-600 uppercase tracking-wider mb-1">Starting From</span>
                                                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                                                ₹ {item.price.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:translate-x-1 transition-transform">
                                                            View Details
                                                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-full shadow-md shadow-blue-500/20">
                                                                <ArrowRight className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );

                                })}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Support Section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-slate-50 py-12 md:py-24 border-t border-slate-100"
            >
                <div className="max-w-6xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                title: "Expert Guidance",
                                desc: "Every tour is led by our gold-certified tour managers.",
                                icon: ShieldCheck
                            },
                            {
                                title: "Guaranteed Dates",
                                desc: "Once you book, we go. No last minute cancellations.",
                                icon: CheckCircle2
                            },
                            {
                                title: "Best Value",
                                desc: "Group benefits passed directly to you. Premium stays for less.",
                                icon: Star
                            }
                        ].map((feature, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 flex-shrink-0">
                                    <feature.icon className="w-7 h-7 !text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="!text-lg !font-black !text-slate-900 mb-2">{feature.title}</h4>
                                    <p className="!text-slate-500 !font-medium !text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            <LoginAlertModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} theme="blue" />
        </motion.div>
    );
}