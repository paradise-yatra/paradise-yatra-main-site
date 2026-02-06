"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown,
    X,
    Phone,
    Globe,
    Calendar,
    Mail,
    Star,
    ChevronRight,
    Search,
    Heart
} from "lucide-react";
import { FaYoutube, FaFacebook, FaInstagram } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User as UserIcon, LogIn, UserPlus } from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    navItems: any[];
    onBookNow?: () => void;
}

const Sidebar = ({ isOpen, onClose, navItems, onBookNow }: SidebarProps) => {
    const { user, logout } = useAuth();
    const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
    const router = useRouter();

    const toggleSubmenu = (index: number) => {
        setOpenSubmenu(openSubmenu === index ? null : index);
    };

    const menuItems = [
        { name: "Fixed Departures", href: "/fixed-departures", icon: Calendar, highlight: true },
        { name: "Why Choose Us", href: "/why-choose-us", icon: Star },
        { name: "About Paradise Yatra", href: "/about", icon: Globe },
        { name: "Travel Blog", href: "/blog", icon: Mail },
        { name: "Contact us", href: "/contact", icon: Phone },
    ];

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex flex-col">
                                <span className="text-[11px] text-blue-600 font-black uppercase tracking-[0.15em] mb-1">Welcome to</span>
                                <h3 className="!text-xl !font-black text-slate-900 tracking-tight">Paradise Yatra</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="group p-2 hover:bg-slate-100 rounded-full transition-all duration-300"
                                aria-label="Close sidebar"
                            >
                                <X className="w-5 h-5 text-slate-400 group-hover:text-slate-900 group-hover:rotate-90 transition-all" />
                            </button>
                        </div>

                        {/* User Profile Section in Sidebar */}
                        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
                            {user ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-200">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">{user.name}</span>
                                            <span className="text-[10px] text-slate-500 truncate max-w-[150px]">{user.email}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { logout(); onClose(); }}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        title="Sign Out"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => { router.push("/login"); onClose(); }}
                                        className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                                    >
                                        <LogIn className="w-4 h-4 text-blue-600" />
                                        Login
                                    </button>
                                    <button
                                        onClick={() => { router.push("/signup"); onClose(); }}
                                        className="flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Sign Up
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Specific Action - Book Now */}
                        {onBookNow && (
                            <div className="px-6 py-4 border-b border-slate-100 lg:hidden">
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        onBookNow();
                                        onClose();
                                    }}
                                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-blue-200 flex items-center justify-center gap-3 group"
                                >
                                    <Star className="w-4 h-4 fill-white" />
                                    Book Your Dream Yatra
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                            {/* Navigation Sections */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Explore Destinations</h4>
                                    <div className="space-y-1">
                                        {navItems.map((item, index) => (
                                            <div key={index} className="rounded-xl overflow-hidden">
                                                <button
                                                    onClick={() => toggleSubmenu(index)}
                                                    className={`w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 ${openSubmenu === index
                                                        ? "bg-blue-50 text-blue-700 font-bold"
                                                        : "hover:bg-slate-50 text-slate-700 font-medium"
                                                        }`}
                                                >
                                                    <span className="text-sm">{item.name}</span>
                                                    <ChevronDown
                                                        className={`w-4 h-4 transition-transform duration-300 ${openSubmenu === index ? "rotate-180 text-blue-600" : "text-slate-300"
                                                            }`}
                                                    />
                                                </button>
                                                <AnimatePresence>
                                                    {openSubmenu === index && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden bg-slate-50/50"
                                                        >
                                                            <div className="grid grid-cols-1 gap-1 p-2">
                                                                {item.submenu.map((subItem: any, subIndex: number) => (
                                                                    <a
                                                                        key={subIndex}
                                                                        href={subItem.href}
                                                                        className="flex items-center px-4 py-2.5 text-xs text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all duration-200"
                                                                        onClick={onClose}
                                                                    >
                                                                        <div className="w-1 h-1 rounded-full bg-blue-200 mr-3 shrink-0" />
                                                                        <span className="truncate font-medium">{subItem.name}</span>
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Quick Links</h4>
                                    <div className="space-y-1">
                                        {[
                                            { name: "Wishlist", href: "/wishlist", icon: Heart },
                                            ...menuItems
                                        ].map((item, index) => (
                                            <a
                                                key={index}
                                                href={item.href}
                                                className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 ${item.highlight
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:translate-y-[-2px]"
                                                    : "hover:bg-slate-50 text-slate-700 font-medium"
                                                    }`}
                                                onClick={onClose}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className={`w-4 h-4 ${item.highlight ? "text-white" : "text-blue-600"}`} />
                                                    <span className="text-sm">{item.name}</span>
                                                    {item.highlight && (
                                                        <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Hot</span>
                                                    )}
                                                </div>
                                                <ChevronRight className={`w-3.5 h-3.5 ${item.highlight ? "text-white/60" : "text-slate-300"}`} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Box */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white overflow-hidden relative group">
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 block">Need Help?</span>
                                <h5 className="font-bold text-lg mb-1">Talk to Travel Experts</h5>
                                <p className="text-xs text-slate-400 mb-4">We're available 24/7 for you</p>
                                <a
                                    href="tel:+918979396413"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors"
                                >
                                    <Phone className="w-4 h-4" />
                                    +91 8979396413
                                </a>
                            </div>

                            {/* Follow Us Section */}
                            <div className="pt-4 pb-24">
                                <div className="flex flex-col gap-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Follow Us On Socials</h4>
                                    <div className="flex items-center gap-3">
                                        {[
                                            { icon: FaYoutube, href: "https://www.youtube.com/@ParadiseYatra", label: "YouTube", color: "text-[#FF0000]" },
                                            { icon: FaFacebook, href: "https://facebook.com/paradiseyatra", label: "Facebook", color: "text-[#1877F2]" },
                                            { icon: FaInstagram, href: "https://instagram.com/paradiseyatra", label: "Instagram", color: "text-[#E4405F]" }
                                        ].map((social, i) => (
                                            <a
                                                key={i}
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md"
                                            >
                                                <social.icon className={`w-5 h-5 ${social.color}`} />
                                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{social.label}</span>
                                            </a>
                                        ))}
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
