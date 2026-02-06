"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    Calendar, MapPin, Users, Clock, Check, X,
    ArrowRight, Shield, Award,
    ChevronRight, ChevronDown, Phone, MessageCircle, Gem, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LeadCaptureForm from "@/components/LeadCaptureForm";
import Header from '@/components/Header';

interface ItineraryItem {
    day: number;
    title: string;
    description: string;
    meals?: string;
    hotel?: string;
    distance?: string;
}

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
    nextDeparture?: string;
    shortDescription: string;
    longDescription: string;
    highlights: string[];
    suitableFor: string[];
    notSuitableFor: string[];
    itinerary: ItineraryItem[];
    inclusions: string[];
    exclusions: string[];
    accommodationSummary?: { destination: string; nights: string; hotel: string }[];
    hotels?: string[];
    paymentPolicy?: string[];
    cancellationPolicy?: string[];
    departures?: { date: string; price: number; seats: number; status: string }[];
}

interface FixedDepartureDetailClientProps {
    departure: Departure;
}

export default function FixedDepartureDetailClient({ departure }: FixedDepartureDetailClientProps) {
    const [openDay, setOpenDay] = useState<number>(1);
    const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState<number>(departure.price);
    const [openTermsSection, setOpenTermsSection] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Immediate scroll
            window.scrollTo({ top: 0, behavior: 'instant' });

            // Secondary scroll after frame
            requestAnimationFrame(() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
            });

            // Tertiary scroll after small delay for Next.js hydration/routing
            const timeout = setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
            }, 100);

            return () => clearTimeout(timeout);
        }
    }, [departure?.slug]);


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const typeColorClass = 'bg-blue-600';
    const typeColorText = 'text-blue-600';
    const typeColorBorder = 'border-blue-100';
    const typeColorBg = 'bg-blue-50';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-slate-50 !font-plus-jakarta-sans pb-20"
        >
            <Header />

            {/* Compact Header Support */}
            {/* <div className="bg-white border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className={`${typeColorClass} w-2 h-8 rounded-full`}></span>
                        <div>
                            <h2 className="!text-[13px] !font-black text-slate-900 !font-plus-jakarta-sans truncate max-w-[200px] md:max-w-md">{departure.title}</h2>
                            <p className="!text-[9px] !font-black text-slate-400 uppercase tracking-widest !font-plus-jakarta-sans">{departure.duration} Journey</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                            <p className="!text-[8px] !font-black text-slate-400 uppercase tracking-widest mb-0.5 !font-plus-jakarta-sans">Starts At</p>
                            <p className="!text-[14px] !font-black text-slate-900 !font-plus-jakarta-sans">₹{departure.price.toLocaleString()}</p>
                        </div>
                        <button 
                            onClick={() => setIsLeadFormOpen(true)}
                            className={`${typeColorClass} text-white !text-[10px] !font-black uppercase tracking-widest px-6 py-3 rounded-lg shadow-lg hover:brightness-110 transition-all !font-plus-jakarta-sans`}>
                            Book Now
                        </button>
                    </div>
                </div>
            </div> */}

            {/* Clean Hero Section */}
            <section className="relative h-[55vh] min-h-[440px] w-full overflow-hidden">
                <Image
                    src={departure.image}
                    alt={departure.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                <div className="absolute inset-0 flex items-end pb-12">
                    <div className="max-w-6xl mx-auto px-4 md:px-8 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-3xl"
                        >
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className={`${typeColorClass} text-white !text-[9px] !font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg shadow-lg !font-plus-jakarta-sans`}>
                                    {departure.tag}
                                </span>
                                <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 !text-[9px] !font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg !font-plus-jakarta-sans">
                                    {departure.destination}
                                </span>
                            </div>

                            <h1 className="!text-3xl md:!text-5xl !font-black text-white leading-tight mb-8 !font-plus-jakarta-sans">
                                {departure.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                        <Clock className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="!text-[8px] !font-black !text-white uppercase tracking-widest !font-plus-jakarta-sans">Duration</p>
                                        <p className="!text-[11px] !font-black !text-white !font-plus-jakarta-sans">{departure.duration}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                        <Calendar className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="!text-[8px] !font-black !text-white uppercase tracking-widest !font-plus-jakarta-sans">Next Departure</p>
                                        <p className="!text-[11px] !font-black !text-white !font-plus-jakarta-sans">{formatDate(departure.departureDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                        <Users className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="!text-[8px] !font-black !text-white uppercase tracking-widest !font-plus-jakarta-sans">Availability</p>
                                        <p className="!text-[11px] !font-black !text-white !font-plus-jakarta-sans">{departure.availableSeats} / {departure.totalSeats} Total Seats</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <main className="max-w-6xl mx-auto px-4 md:px-8 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Trip Overview */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-lg border border-slate-200 p-5 md:p-8 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="!text-sm !font-bold !text-slate-700 uppercase tracking-wider !font-plus-jakarta-sans flex items-center gap-2">
                                    <div className="w-1 h-4 bg-blue-600 rounded"></div>
                                    Trip Overview
                                </h3>
                            </div>

                            <div className="prose prose-slate max-w-none">
                                <p className="!text-sm !text-slate-600 leading-relaxed !font-semibold !font-plus-jakarta-sans">
                                    {departure.longDescription}
                                </p>
                            </div>
                        </motion.section>

                        {/* Summary Highlights */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-white rounded-lg border border-slate-200 p-5 md:p-8 shadow-sm"
                        >
                            <h3 className="!text-sm !font-bold !text-slate-700 uppercase tracking-wider mb-6 !font-plus-jakarta-sans flex items-center gap-2">
                                <div className="w-1 h-4 bg-blue-600 rounded"></div>
                                Key Experience Highlights
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                {departure.highlights.map((h, i) => (
                                    <div key={i} className="flex items-start gap-3 group">
                                        <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center !text-blue-600 group-hover:bg-blue-600 group-hover:!text-white transition-all shrink-0">
                                            <Check className="w-3 h-3" strokeWidth={3} />
                                        </div>
                                        <p className="!text-sm !font-semibold !text-slate-600 !font-plus-jakarta-sans group-hover:!text-blue-600 transition-colors leading-relaxed">{h}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.section>


                        {/* Detailed Trip Itinerary */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <h3 className="!text-sm !font-bold !text-slate-700 uppercase tracking-wider !font-plus-jakarta-sans flex items-center gap-2 mb-6">
                                <div className="w-1 h-4 bg-blue-600 rounded"></div>
                                Detailed Trip Itinerary
                            </h3>

                            <div className="relative space-y-4 before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
                                {departure.itinerary.map((item) => (
                                    <div key={item.day} className="relative pl-12">
                                        {/* Day Indicator Dot */}
                                        <div className={`absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-slate-50 flex items-center justify-center !font-black !text-[11px] z-10 transition-all duration-300 ${openDay === item.day ? 'bg-blue-600 text-white border-blue-100 shadow-lg shadow-blue-200' : 'bg-white text-slate-500 border-white shadow-sm'}`}>
                                            D{item.day}
                                        </div>

                                        <div className={`bg-white border rounded-lg overflow-hidden transition-all duration-300 ${openDay === item.day ? 'border-blue-200 shadow-md' : 'border-slate-100 shadow-sm'}`}>
                                            <button
                                                onClick={() => setOpenDay(openDay === item.day ? 0 : item.day)}
                                                className="w-full flex items-center justify-between p-4.5 text-left"
                                            >
                                                <h4 className={`!text-sm !font-semibold !font-plus-jakarta-sans transition-colors ${openDay === item.day ? '!text-blue-600' : '!text-slate-800'}`}>
                                                    {item.title}
                                                </h4>
                                                <div className={`p-1 rounded-full transition-all duration-300 ${openDay === item.day ? 'bg-blue-50 text-blue-600 rotate-90' : 'text-slate-300'}`}>
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </button>

                                            <AnimatePresence>
                                                {openDay === item.day && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <div className="px-5 pb-6 pt-0">
                                                            <div className="h-px bg-slate-50 w-full mb-5" />
                                                            <div className="space-y-3.5">
                                                                {item.description.split('.').filter(p => p.trim()).map((point, idx) => (
                                                                    <div key={idx} className="flex gap-3 group/item">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover/item:bg-blue-600 mt-2 transition-colors shrink-0" />
                                                                        <p className="!text-sm !text-slate-600 !font-semibold leading-relaxed !font-plus-jakarta-sans">
                                                                            {point.trim()}.
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>


                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Inclusions / Exclusions Clean Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            <section className="bg-white rounded-lg border border-slate-200 p-5 md:p-8 shadow-sm">
                                <h3 className="!text-sm !font-bold !text-emerald-600 uppercase tracking-wider mb-6 !font-plus-jakarta-sans flex items-center gap-2">
                                    <div className="w-1 h-4 bg-emerald-500 rounded"></div>
                                    Inclusions
                                </h3>
                                <ul className="space-y-3">
                                    {departure.inclusions.map((item, i) => (
                                        <li key={i} className="flex gap-3 !text-sm !text-slate-600 !font-semibold !font-plus-jakarta-sans group">
                                            <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500 group-hover:!text-white transition-all">
                                                <Check className="w-3 h-3" strokeWidth={3} />
                                            </div>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                            <section className="bg-white rounded-lg border border-slate-200 p-5 md:p-8 shadow-sm">
                                <h3 className="!text-sm !font-bold !text-rose-600 uppercase tracking-wider mb-6 !font-plus-jakarta-sans flex items-center gap-2">
                                    <div className="w-1 h-4 bg-rose-500 rounded"></div>
                                    Exclusions
                                </h3>
                                <ul className="space-y-3">
                                    {departure.exclusions.map((item, i) => (
                                        <li key={i} className="flex gap-3 !text-sm !text-slate-600 !font-semibold !font-plus-jakarta-sans group">
                                            <div className="w-5 h-5 rounded-full bg-rose-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-rose-500 group-hover:!text-white transition-all">
                                                <X className="w-3 h-3" strokeWidth={3} />
                                            </div>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </motion.div>

                        {/* Available Departure Dates Table */}
                        {departure.departures && departure.departures.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="bg-white rounded-lg border border-slate-200 p-5 md:p-8 shadow-sm overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                    <h3 className="!text-sm !font-bold !text-slate-700 uppercase tracking-wider !font-plus-jakarta-sans flex items-center gap-2">
                                        <div className="w-1 h-4 bg-blue-600 rounded"></div>
                                        Available Group Departure Dates
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            <span className="!text-xs !font-bold !text-slate-500 uppercase tracking-wide">Available</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                            <span className="!text-xs !font-bold !text-slate-500 uppercase tracking-wide">Sold Out</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden md:block border border-slate-100 rounded-lg overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                                <th className="px-6 py-4 !text-xs !font-bold !text-slate-500 uppercase tracking-wide !font-plus-jakarta-sans whitespace-nowrap">Departure Date</th>
                                                <th className="px-6 py-4 !text-xs !font-bold !text-slate-500 uppercase tracking-wide !font-plus-jakarta-sans whitespace-nowrap">Total Price</th>
                                                <th className="px-6 py-4 !text-xs !font-bold !text-slate-500 uppercase tracking-wide !font-plus-jakarta-sans whitespace-nowrap text-center">Seats Status</th>
                                                <th className="px-6 py-4 !text-xs !font-bold !text-slate-500 uppercase tracking-wide !font-plus-jakarta-sans whitespace-nowrap text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {(departure.departures || []).map((d, i) => (
                                                <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-white transition-colors">
                                                                <Calendar className="w-4 h-4 text-blue-500" />
                                                            </div>
                                                            <div>
                                                                <p className="!text-xs !font-semibold !text-slate-800 !font-plus-jakarta-sans">{formatDate(d.date)}</p>
                                                                <p className="!text-xs !font-bold !text-slate-500 uppercase tracking-wide !font-plus-jakarta-sans">Group Journey</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div>
                                                            <p className="!text-xs !font-semibold !text-slate-800 !font-plus-jakarta-sans">₹{d.price.toLocaleString()}</p>
                                                            <p className="!text-xs !font-bold !text-slate-500 uppercase tracking-wide !font-plus-jakarta-sans">Per Person</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex justify-center">
                                                            {d.status === 'soldout' ? (
                                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full border border-rose-100">
                                                                    <X className="w-3 h-3" />
                                                                    <span className="!text-[9px] !font-black uppercase tracking-widest !font-plus-jakarta-sans">Sold Out</span>
                                                                </div>
                                                            ) : d.seats < 10 ? (
                                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full border border-orange-100">
                                                                    <Users className="w-3 h-3" />
                                                                    <span className="!text-[9px] !font-black uppercase tracking-widest !font-plus-jakarta-sans">{d.seats} Seats Left</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                                                                    <Check className="w-3 h-3" />
                                                                    <span className="!text-[9px] !font-black uppercase tracking-widest !font-plus-jakarta-sans">Available</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-1 text-right">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedPrice(d.price);
                                                                setIsLeadFormOpen(true);
                                                            }}
                                                            disabled={d.status === 'soldout'}
                                                            className={`!text-[9px] !font-black uppercase tracking-widest px-5 py-2.5 rounded-lg border transition-all !font-plus-jakarta-sans shadow-sm ${d.status === 'soldout' ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' : 'bg-blue-600 text-white border-blue-600 hover:brightness-110 active:scale-95'}`}
                                                        >
                                                            {d.status === 'soldout' ? 'Waitlist' : 'Select Batch'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="md:hidden space-y-4">
                                    {(departure.departures || []).map((d, i) => (
                                        <div key={i} className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                                                        <Calendar className="w-4 h-4 text-blue-500" />
                                                    </div>
                                                    <div>
                                                        <p className="!text-[13px] !font-black !text-slate-900 !font-plus-jakarta-sans">{formatDate(d.date)}</p>
                                                        <p className="!text-[9px] !font-bold !text-slate-500 uppercase tracking-widest !font-plus-jakarta-sans">Departure Date</p>
                                                    </div>
                                                </div>
                                                {d.status === 'soldout' ? (
                                                    <span className="px-2 py-1 bg-rose-50 text-rose-600 !text-[8px] !font-black uppercase tracking-widest rounded-md border border-rose-100">Sold Out</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 !text-[8px] !font-black uppercase tracking-widest rounded-md border border-emerald-100">Available</span>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center py-3 border-y border-slate-100/50">
                                                <div>
                                                    <p className="!text-[14px] !font-black !text-slate-900 !font-plus-jakarta-sans">₹{d.price.toLocaleString()}</p>
                                                    <p className="!text-[9px] !font-bold !text-slate-500 uppercase tracking-widest !font-plus-jakarta-sans">Price Per Person</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="!text-[11px] !font-bold !text-slate-600 !font-plus-jakarta-sans">{d.seats} Seats</p>
                                                    <p className="!text-[9px] !font-bold !text-slate-500 uppercase tracking-widest !font-plus-jakarta-sans">Capacity</p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setSelectedPrice(d.price);
                                                    setIsLeadFormOpen(true);
                                                }}
                                                disabled={d.status === 'soldout'}
                                                className={`w-full !text-[10px] !font-black uppercase tracking-[0.1em] py-3 rounded-lg border transition-all !font-plus-jakarta-sans ${d.status === 'soldout' ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed' : 'bg-blue-600 text-white border-blue-600 shadow-md'}`}
                                            >
                                                {d.status === 'soldout' ? 'Batch Sold Out' : 'Book This Batch'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                    </div>

                    {/* Right Column Booking Widget */}
                    <aside className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="sticky top-24 space-y-6"
                        >
                            <div className="bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden">
                                <div className={`${typeColorClass} h-1 w-full`} />

                                <div className="p-6 md:p-8 space-y-8">
                                    <div className="text-center">
                                        <p className="!text-xs !font-bold !text-slate-600 uppercase tracking-wider mb-2 !font-plus-jakarta-sans">Starting from only</p>
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="!text-4xl !font-black !text-slate-900 !font-plus-jakarta-sans">₹{departure.price.toLocaleString()}</span>
                                                <span className="!text-xs !font-bold !text-slate-600 uppercase tracking-wide !font-plus-jakarta-sans">/ Person</span>
                                            </div>
                                            {departure.originalPrice && (
                                                <span className="!text-sm !text-slate-400 line-through !font-semibold mt-1 !font-plus-jakarta-sans">₹{departure.originalPrice.toLocaleString()}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-slate-50">
                                        <div className="flex items-center justify-between !text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 !text-slate-500" />
                                                <span className="!text-xs uppercase tracking-wide !font-bold !font-plus-jakarta-sans !text-slate-600">Duration</span>
                                            </div>
                                            <span className="!text-sm !font-semibold !text-slate-800 !font-plus-jakarta-sans">{departure.duration}</span>
                                        </div>
                                        <div className="flex items-center justify-between !text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 !text-slate-500" />
                                                <span className="!text-xs uppercase tracking-wide !font-bold !font-plus-jakarta-sans !text-slate-600">Starts</span>
                                            </div>
                                            <span className="!text-sm !font-semibold !text-slate-800 !font-plus-jakarta-sans">{formatDate(departure.departureDate)}</span>
                                        </div>
                                        <div className="flex items-center justify-between !text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 !text-slate-500" />
                                                <span className="!text-xs uppercase tracking-wide !font-bold !font-plus-jakarta-sans !text-slate-600">Status</span>
                                            </div>
                                            <span className="!text-sm !font-semibold !text-slate-800 !font-plus-jakarta-sans">{departure.availableSeats} / {departure.totalSeats} Left</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {departure.departures && departure.departures.some(d => d.status !== 'soldout') && (
                                            <div className="space-y-2">
                                                <label className="!text-xs !font-bold !text-slate-600 uppercase tracking-wide ml-1 !font-plus-jakarta-sans">Select Group Batch</label>
                                                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 !text-sm !font-semibold !text-slate-800 focus:border-blue-500 focus:outline-none appearance-none !font-plus-jakarta-sans cursor-pointer">
                                                    {departure.departures.filter(d => d.status !== 'soldout').map((d, i) => (
                                                        <option key={i}>{d.date} — ₹{d.price.toLocaleString()}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => {
                                                setSelectedPrice(departure.price);
                                                setIsLeadFormOpen(true);
                                            }}
                                            className={`${typeColorClass} w-full text-white !font-bold py-4 rounded-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all !text-xs uppercase tracking-wider !font-plus-jakarta-sans flex items-center justify-center gap-2`}>
                                            Reserve My Spot
                                            <ArrowRight className="w-4 h-4" />
                                        </button>

                                        <a href="https://wa.me/919873391733" className="flex items-center justify-center gap-2 border border-slate-200 py-3 rounded-lg !font-bold !text-xs !text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-wide !font-plus-jakarta-sans shadow-sm w-full">
                                            <MessageCircle className="w-4 h-4" />
                                            WhatsApp
                                        </a>
                                    </div>

                                    <div className="pt-2 text-center">
                                        <div className="flex items-center justify-center gap-2 !text-emerald-600 !font-bold !text-xs uppercase tracking-wide !font-plus-jakarta-sans">
                                            <Shield className="w-4 h-4" />
                                            100% Secure Booking
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </motion.div>
                    </aside>
                </div>
            </main>

            {/* Terms and Conditions Section */}
            <section className="bg-slate-50 py-12 md:py-16 border-t border-slate-100">
                <div className="max-w-6xl mx-auto px-4 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="!text-2xl !font-black !text-slate-900 mb-8 !font-plus-jakarta-sans">Terms and Conditions</h2>

                        <div className="space-y-4">
                            {[
                                {
                                    id: "booking",
                                    title: "Booking and Payment",
                                    content: [
                                        "A deposit of 30% is required to confirm your booking",
                                        "Full payment must be completed 30 days before departure",
                                        "All prices are in INR and include taxes",
                                        "Payment via credit card, bank transfer, or UPI"
                                    ]
                                },
                                {
                                    id: "cancellation",
                                    title: "Cancellation Policy",
                                    content: [
                                        "Cancellation 60+ days: Full refund minus processing fee",
                                        "Cancellation 30-59 days: 75% refund",
                                        "Cancellation 15-29 days: 50% refund",
                                        "Less than 15 days: No refund"
                                    ]
                                },
                                {
                                    id: "documents",
                                    title: "Travel Documents",
                                    content: [
                                        "Valid passport required (minimum 6 months validity)",
                                        "Visa requirements vary by destination",
                                        "Travel insurance strongly recommended",
                                        "Accurate personal details required for bookings"
                                    ]
                                }
                            ].map((item) => (
                                <div key={item.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setOpenTermsSection(openTermsSection === item.id ? null : item.id)}
                                        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                                    >
                                        <h3 className="!text-base !font-bold !text-slate-900 !font-plus-jakarta-sans">{item.title}</h3>
                                        <ChevronDown
                                            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openTermsSection === item.id ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {openTermsSection === item.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="px-6 pb-5 pt-0">
                                                    <div className="h-px bg-slate-100 w-full mb-4" />
                                                    <ul className="space-y-2.5">
                                                        {item.content.map((point, pIdx) => (
                                                            <li key={pIdx} className="flex gap-3 !text-sm !text-slate-600 !font-semibold !font-plus-jakarta-sans">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                                                                <span className="leading-relaxed">{point}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}

                            {/* Important Notes */}
                            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                <button
                                    onClick={() => setOpenTermsSection(openTermsSection === 'important' ? null : 'important')}
                                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                                >
                                    <h3 className="!text-base !font-bold !text-slate-900 !font-plus-jakarta-sans">Important Notes</h3>
                                    <ChevronDown
                                        className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openTermsSection === 'important' ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openTermsSection === 'important' && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="px-6 pb-5 pt-0">
                                                <div className="h-px bg-slate-100 w-full mb-4" />
                                                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                                                    <p className="!text-sm !text-slate-600 leading-relaxed !font-semibold !font-plus-jakarta-sans">
                                                        By booking this package, you agree to these terms and conditions. We reserve the right to modify itineraries due to unforeseen circumstances or local conditions while maintaining the quality and value of your experience.
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <LeadCaptureForm
                isOpen={isLeadFormOpen}
                onClose={() => setIsLeadFormOpen(false)}
                packageTitle={departure.title}
                packagePrice={`₹${selectedPrice.toLocaleString('en-IN')}`}
            />
        </motion.div>
    );
}
