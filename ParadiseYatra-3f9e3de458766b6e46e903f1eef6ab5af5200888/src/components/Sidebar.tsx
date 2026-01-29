"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Link } from "lucide-react";
import { ChevronDown, X, Phone, Youtube, Facebook, Twitter, Instagram, Linkedin, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    navItems: any[];
}

const Sidebar = ({ isOpen, onClose, navItems }: SidebarProps) => {
    const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
    const router = useRouter();

    const toggleSubmenu = (index: number) => {
        setOpenSubmenu(openSubmenu === index ? null : index);
    };

    const menuItems = [
        { name: "Why Choose Us", href: "/why-choose-us" },
        { name: "Contact us", href: "/contact" },
        { name: "Blog", href: "/blog" },
        { name: "About us", href: "/about" },

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
                        className="fixed inset-0 bg-black/50 z-[60]"
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
                        className="fixed top-0 right-0 h-full w-[350px] bg-white z-[70] shadow-2xl overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <span className="text-gray-500 text-sm">Welcome to</span>
                                <span className="text-blue-600 font-semibold ml-1">Paradise Yatra</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Close sidebar"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            {/* Dynamic Package Categories */}
                            {navItems.map((item, index) => (
                                <div key={index} className="border-b border-gray-50">
                                    <button
                                        onClick={() => toggleSubmenu(index)}
                                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-gray-700 font-medium text-sm">{item.name}</span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openSubmenu === index ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {openSubmenu === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden bg-gray-50/50"
                                            >
                                                <div className="py-2 px-6 space-y-2">
                                                    {item.submenu.map((subItem: any, subIndex: number) => (
                                                        <a
                                                            key={subIndex}
                                                            href={subItem.href}
                                                            className="block py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                                                            onClick={onClose}
                                                        >
                                                            {subItem.name}
                                                        </a>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}

                            {/* Static Links */}
                            {menuItems.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.href}
                                    className="block px-6 py-4 text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors border-b border-gray-50"
                                    onClick={onClose}
                                >
                                    {item.name}
                                </a>
                            ))}


                        </div>

                        {/* Footer Information */}
                        <div className="mt-auto p-6 pb-20">
                            <div className="flex items-center gap-2 mb-6 text-gray-700">
                                <span className="font-medium">+91 8979396413</span>
                            </div>

                            <div className="flex items-center gap-4 text-gray-400">
                                <a href="https://www.youtube.com/@ParadiseYatra" className="hover:text-blue-600 transition-colors"><Youtube className="w-5 h-5" /></a>
                                <a href="facebook.com/paradiseyatra" className="hover:text-blue-600 transition-colors"><Facebook className="w-5 h-5" /></a>

                                <a href="https://www.instagram.com/paradiseyatra?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="hover:text-blue-600 transition-colors"><Instagram className="w-5 h-5" /></a>

                            </div>
                        </div>

                        {/* Bottom Image Overlay */}
                        <div className="absolute bottom-0 left-0 w-full h-32 opacity-10 pointer-events-none z-[-1]">
                            <div className="w-full h-full bg-gradient-to-t from-blue-900 to-transparent" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
