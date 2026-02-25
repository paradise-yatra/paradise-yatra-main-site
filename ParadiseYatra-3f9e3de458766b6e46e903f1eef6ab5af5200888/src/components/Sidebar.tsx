"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown,
    ChevronRight,
    X,
    Phone,
    Globe,
    Calendar,
    Mail,
    Star,
    Heart,
    CreditCard,
    LogIn,
    UserPlus,
    LogOut,
    Headset
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    navItems: any[];
    onBookNow?: () => void;
}

const Sidebar = ({ isOpen, onClose, navItems, onBookNow }: SidebarProps) => {
    const { user, logout, isLoading } = useAuth();
    const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
    const router = useRouter();

    const toggleSubmenu = (index: number) => {
        setOpenSubmenu(openSubmenu === index ? null : index);
    };

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const discoverLinks = [
        { name: "Wishlist", href: "/wishlist", icon: Heart },
        { name: "Payment", href: "/payment", icon: CreditCard },
        { name: "Fixed Departures", href: "/fixed-departures", icon: Calendar, highlight: true },
        { name: "Why Choose Us", href: "/why-choose-us", icon: Star },
        { name: "About Us", href: "/about", icon: Globe },
        { name: "Travel Blog", href: "/blog", icon: Mail },
        { name: "Contact", href: "/contact", icon: Phone },
    ];

    const getFirstName = (fullName: string) => {
        return fullName.split(' ')[0];
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 z-[90] transform-gpu cursor-pointer"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 32, stiffness: 350, mass: 0.8 }}
                        className="fixed top-0 right-0 h-full w-[310px] bg-white z-[100] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transform-gpu will-change-transform border-l border-slate-100"
                    >
                        {/* Header - Fixed Greeting */}
                        <div className="flex items-center justify-between px-6 pt-8 pb-6 shrink-0 bg-white sticky top-0 z-10 border-b border-slate-50">
                            <div className="flex flex-col">
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                                    Hi {!isLoading && user ? getFirstName(user.name) : 'Guest'}!
                                </h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-slate-900 transition-colors active:scale-95 cursor-pointer rounded-full hover:bg-slate-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrolling Content Container */}
                        <div className="flex-1 overflow-y-auto overscroll-contain touch-pan-y scroll-smooth scrollbar-hide py-2">
                            {/* Auth Section - Only show buttons if NOT logged in and NOT loading */}
                            {!isLoading && (
                                <div className="px-6 pb-8 pt-4">
                                    {user ? (
                                        <div className="p-3 bg-slate-50 rounded-[6px] flex items-center justify-between border border-slate-100 shadow-none">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-xs font-bold text-slate-900 truncate">{user.name}</span>
                                                    <span className="text-[10px] text-slate-500 truncate">{user.email}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => { logout(); onClose(); }}
                                                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors active:scale-90 cursor-pointer"
                                            >
                                                <LogOut className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => { router.push("/login"); onClose(); }}
                                                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-[6px] text-[13px] font-bold hover:bg-slate-50 active:bg-slate-100 transition-all cursor-pointer shadow-none"
                                            >
                                                <LogIn className="w-3.5 h-3.5 text-blue-600" />
                                                Login
                                            </button>
                                            <button
                                                onClick={() => { router.push("/signup"); onClose(); }}
                                                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 text-white rounded-[6px] text-[13px] font-bold hover:bg-blue-700 active:bg-blue-800 transition-all cursor-pointer shadow-none"
                                            >
                                                <UserPlus className="w-3.5 h-3.5" />
                                                Sign Up
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="px-6 space-y-8 pb-10 transform-gpu">

                                {/* Explore Section */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-0.5">Experience The World</h4>
                                    <div className="space-y-1">
                                        {navItems.map((item: any, index: number) => {
                                            const hasSub = item.submenu && item.submenu.length > 0;
                                            return (
                                                <div key={index} className="space-y-1">
                                                    <button
                                                        onClick={() => hasSub ? toggleSubmenu(index) : router.push(item.href || '#')}
                                                        className="w-full flex items-center justify-between py-2.5 text-slate-700 hover:text-blue-600 transition-all cursor-pointer group"
                                                    >
                                                        <div className="flex items-center gap-3.5">
                                                            <div className="w-5 h-5 flex items-center justify-center">
                                                                {item.name.toLowerCase().includes('international') ?
                                                                    <span className="text-[16px] leading-none">🌍</span> :
                                                                    <div className="w-[16px] h-[11px] relative overflow-hidden rounded-[1px] border border-slate-100">
                                                                        <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" alt="India" className="w-full h-full object-cover" />
                                                                    </div>
                                                                }
                                                            </div>
                                                            <span className="text-[14px] font-semibold text-slate-800 tracking-tight group-hover:text-blue-600">{item.name}</span>
                                                        </div>
                                                        {hasSub && (
                                                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${openSubmenu === index ? "rotate-180" : ""}`} />
                                                        )}
                                                    </button>

                                                    <AnimatePresence>
                                                        {hasSub && openSubmenu === index && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden pl-9 pr-2 space-y-2 pt-1 pb-3"
                                                            >
                                                                {item.submenu.map((subItem: any, subIndex: number) => (
                                                                    <a
                                                                        key={subIndex}
                                                                        href={subItem.href}
                                                                        onClick={onClose}
                                                                        className="block text-[13px] text-slate-500 hover:text-blue-600 transition-colors font-medium py-1 cursor-pointer"
                                                                    >
                                                                        {subItem.name}
                                                                    </a>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Discover More Section */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-0.5">Discover More</h4>
                                    <div className="space-y-0.5">
                                        {discoverLinks.map((item, index) => (
                                            <div key={index}>
                                                <a
                                                    href={item.href}
                                                    onClick={onClose}
                                                    className="flex items-center justify-between py-2.5 px-3 -mx-3 rounded-[6px] text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all cursor-pointer group shadow-none"
                                                >
                                                    <div className="flex items-center gap-3.5">
                                                        <item.icon className="w-[18px] h-[18px] text-slate-400 group-hover:text-blue-600 transition-colors" />
                                                        <span className="text-[14px] font-semibold tracking-tight text-slate-800 group-hover:text-blue-600 transition-colors">{item.name}</span>
                                                        {item.highlight && (
                                                            <span className="text-[9px] font-black bg-red-50 text-red-600 px-1.5 py-0.5 rounded-[2px] leading-none ml-1 uppercase">HOT</span>
                                                        )}
                                                    </div>
                                                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Support Card - High End Style */}
                                <div className="pt-2">
                                    <div className="relative overflow-hidden rounded-xl bg-slate-900 p-6 text-white group">
                                        <div className="absolute top-0 right-0 -mr-4 -mt-4 p-8 opacity-10 rotate-12 transition-transform group-hover:scale-110">
                                            <Headset className="w-20 h-20" />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Online Support</span>
                                            </div>
                                            <h5 className="text-[16px] font-extrabold mb-1 tracking-tight">Need Expert Advice?</h5>
                                            <p className="text-[11px] text-slate-400 mb-5 leading-relaxed font-medium">Talk to our travel curators for a personalized holiday plan.</p>

                                            <a
                                                href="tel:+918979396413"
                                                className="flex items-center justify-center gap-2.5 w-full py-2.5 bg-blue-600 text-white rounded-[6px] font-bold text-[12px] hover:bg-blue-700 transition-all cursor-pointer shadow-none active:scale-95"
                                            >
                                                <Phone className="w-4 h-4" />
                                                Connect Now
                                            </a>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
