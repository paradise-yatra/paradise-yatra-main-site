"use client";

import { Button } from "@/components/ui/button";
import {
  Menu,
  Star,
  Phone,
  ChevronDown,
  X,
  MapPin,
  Calendar,
  Search,
  Globe,
  Heart,
  Plane,
  Waves,
  Mountain as MountainIcon,
  Building,
  TreePine,
  Camera,
  Mail,
  LogOut,
  User as UserIcon,
  Ticket,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import LeadCaptureForm from "./LeadCaptureForm";
import Sidebar from "./Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

import { useNavigation } from "@/hooks/useNavigation";
import Image from "next/image";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

const Header = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showPromoBar, setShowPromoBar] = useState(true);

  const pathname = usePathname();
  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled; // Transparent on home page only at top

  // Use the custom hook for dynamic navigation
  const { navItems, loading } = useNavigation();
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (index: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  // Fetch India states and International countries from all-packages API
  const [indiaStates, setIndiaStates] = useState<string[]>([]);
  const [internationalCountries, setInternationalCountries] = useState<string[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLocationsLoading(true);

        // Fetch India states
        const indiaResponse = await fetch("/api/all-packages?tourType=india&limit=200&isActive=true", { cache: 'no-store' });
        if (indiaResponse.ok) {
          const indiaData = await indiaResponse.json();
          const packages = indiaData.packages || [];
          const uniqueStates = Array.from(new Set(
            packages
              .map((pkg: any) => pkg.state)
              .filter((state: string) => state && state.trim() !== '')
              .map((state: string) => state.trim())
          )).sort();
          setIndiaStates(uniqueStates as string[]);
        }

        // Fetch International countries
        const intlResponse = await fetch("/api/all-packages?tourType=international&limit=200&isActive=true", { cache: 'no-store' });
        if (intlResponse.ok) {
          const intlData = await intlResponse.json();
          const packages = intlData.packages || [];
          const uniqueCountries = Array.from(new Set(
            packages
              .map((pkg: any) => pkg.country)
              .filter((country: string) => country && country.trim() !== '')
              .map((country: string) => country.trim())
          )).sort();
          setInternationalCountries(uniqueCountries as string[]);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLocationsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Filter out Fixed Departure items from navigation
  const filteredNavItems = navItems.filter(item => item.name !== "Fixed Departure");

  // Function to stop navigation loading
  const stopNavigationLoading = () => {
    setIsNavigating(false);
  };

  // Expose the function globally so other components can call it
  useEffect(() => {
    (window as { stopHeaderLoading?: () => void }).stopHeaderLoading =
      stopNavigationLoading;

    // Also listen for route changes to automatically stop loading
    const handleRouteChange = () => {
      setIsNavigating(false);
    };

    // Listen for popstate (back/forward navigation)
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      delete (window as { stopHeaderLoading?: () => void }).stopHeaderLoading;
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  // Icon mapping for dynamic navigation
  const iconMap: {
    [key: string]: React.ComponentType<{ className?: string }>;
  } = {
    Globe,
    MapPin,
    Calendar,
    Search,
    Star,
    Heart,
  };

  // Function to get destination-specific icon
  const getDestinationIcon = (destination: string) => {
    const lowerDest = destination.toLowerCase();

    if (
      lowerDest.includes("beach") ||
      lowerDest.includes("coastal") ||
      lowerDest.includes("island")
    ) {
      return Waves;
    }
    if (
      lowerDest.includes("mountain") ||
      lowerDest.includes("himalaya") ||
      lowerDest.includes("trek")
    ) {
      return MountainIcon;
    }
    if (
      lowerDest.includes("city") ||
      lowerDest.includes("urban") ||
      lowerDest.includes("metropolitan")
    ) {
      return Building;
    }
    if (
      lowerDest.includes("forest") ||
      lowerDest.includes("wildlife") ||
      lowerDest.includes("jungle")
    ) {
      return TreePine;
    }
    if (
      lowerDest.includes("cultural") ||
      lowerDest.includes("heritage") ||
      lowerDest.includes("temple")
    ) {
      return Camera;
    }
    if (
      lowerDest.includes("adventure") ||
      lowerDest.includes("sport") ||
      lowerDest.includes("activity")
    ) {
      return Plane;
    }

    // Default icon
    return MapPin;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle navigation loading state
  useEffect(() => {
    if (isNavigating) {
      // Set a timeout to automatically hide loading after 5 seconds as fallback
      const timeout = setTimeout(() => {
        setIsNavigating(false);
      }, 5000);

      // Also listen for page load events
      const handlePageLoad = () => {
        // Small delay to ensure the page is fully rendered
        setTimeout(() => setIsNavigating(false), 500);
      };

      // Listen for when the page finishes loading
      if (document.readyState === "complete") {
        handlePageLoad();
      } else {
        window.addEventListener("load", handlePageLoad);
      }

      return () => {
        clearTimeout(timeout);
        window.removeEventListener("load", handlePageLoad);
      };
    }
  }, [isNavigating]);

  // Handle Sidebar scroll lock
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // Helper to get badges for destinations (matching the requirement image)
  const getBadgeForLocation = (location: string) => {
    const loc = location.toLowerCase();
    if (loc.includes('bali') || loc.includes('vietnam') || loc.includes('kerala'))
      return { text: 'TRENDING', class: 'bg-[#ffefef] text-[#d64141] border-[#ffdadb]' };
    if (loc.includes('maldives') || loc.includes('andaman') || loc.includes('mauritius'))
      return { text: 'HONEYMOON', class: 'bg-[#ffeef5] text-[#d64188] border-[#ffdae9]' };
    if (loc.includes('thailand') || loc.includes('dubai') || loc.includes('rajasthan'))
      return { text: 'BUDGET', class: 'bg-[#fdf6ec] text-[#a67c52] border-[#f5e4cc]' };
    if (loc.includes('abu dhabi') || loc.includes('singapore') || loc.includes('kashmir'))
      return { text: 'POPULAR', class: 'bg-[#eef2ff] text-[#4159d6] border-[#dadaff]' };
    return null;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[60] w-full font-plus-jakarta-sans transition-all duration-300 ${isTransparent ? 'bg-transparent border-transparent shadow-none' : 'bg-white border-b border-gray-100/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)]'}`}>


      {/* PROMO STRIP START */}
      <AnimatePresence>
        {showPromoBar && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="relative z-50 overflow-hidden"
          >
            <Link href="/package/theme/char-dham-yatra" className="block group">
              <div className="promo-strip bg-black text-white px-4 py-1.5 shadow-lg transition-all duration-500 hover:brightness-105">
                <div className="max-w-7xl mx-auto flex items-center justify-center text-center gap-3 sm:gap-6 relative">

                  {/* Icon & Main Text */}
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-wider">
                    <span className="text-orange-500 text-sm">ॐ</span>
                    <span className="drop-shadow-sm uppercase">Char Dham Yatra 2026 Registrations Open!</span>
                  </div>

                  {/* Book Now Button Only */}
                  <div className="hidden sm:flex items-center">
                    <span className="text-white text-[9px] sm:text-[11px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-300">
                      BOOK NOW <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowPromoBar(false);
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                    aria-label="Close promo"
                  >
                    <X className="w-3.5 h-3.5 text-white/80 hover:text-white" />
                  </button>

                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      {/* PROMO STRIP END */}

      {/* Main header */}
      <div className="bg-transparent">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-5">
            {/* Logo - Left side */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex items-center gap-3 group cursor-pointer "
              >
                <div className="relative h-11 w-11  overflow-hidden ">
                  <Image
                    src="/favicon.png"
                    alt="Paradise Yatra"
                    fill
                    className="object-contain p-1.5"
                  />
                </div>
                <div className="text-left">
                  <h1
                    className={`!text-xl !font-black tracking-tight ${isTransparent ? "!text-white" : "text-slate-900"
                      }`}
                  >
                    Paradise Yatra
                  </h1>
                  <p
                    className={`text-xs !font-bold -mt-1 ${isTransparent ? "!text-white/90" : "!text-blue-700"
                      }`}
                  >
                    Yatra To Paradise
                  </p>
                </div>
              </button>
            </div>

            {/* Navigation - Desktop - Centered */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
              {filteredNavItems.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <motion.button
                      className={`flex items-center gap-1 transition-all cursor-pointer ${isTransparent
                        ? "text-white opacity-80 hover:opacity-100"
                        : "text-slate-700 hover:text-slate-900"
                        }`}
                    >
                      {item.name}
                      {item.submenu && item.submenu.length > 0 && (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === index ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </motion.button>


                    <AnimatePresence>
                      {activeDropdown === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className={`absolute left-0 top-full mt-4 bg-white rounded-[6px] shadow-2xl border border-slate-200/50 z-20 overflow-hidden backdrop-blur-xl bg-white/95 ${item.name === "International Tour" || item.name === "India Tour Package"
                            ? "w-[680px] max-w-[95vw] p-5"
                            : "w-80"
                            }`}
                        >
                          {item.submenu.map((subItem, subIndex) => {
                            const DestinationIcon = getDestinationIcon(
                              subItem.name
                            );


                            // Special handling for India Tour Package - compact grid layout showing states
                            if (item.name === "India Tour Package") {
                              // Only render once to show all states in grid
                              if (subIndex === 0) {
                                return (
                                  <div key="india-states-grid">
                                    {locationsLoading ? (
                                      <div className="flex flex-col items-center justify-center py-8 space-y-3">
                                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Loading Regions</p>
                                      </div>
                                    ) : indiaStates.length > 0 ? (
                                      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                                        {indiaStates.slice(0, 14).map((state, stateIndex) => {
                                          const badge = getBadgeForLocation(state);
                                          return (
                                            <a
                                              key={stateIndex}
                                              href={`/package/india/${state.toLowerCase().replace(/\s+/g, "-")}`}
                                              onClick={() => setIsNavigating(true)}
                                              className="text-[15px] cursor-pointer text-slate-600 hover:text-blue-600 font-medium transition-all duration-200 flex items-center justify-between group"
                                              title={state}
                                            >
                                              <span className="truncate pr-2">{state}</span>
                                              {badge && (
                                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border leading-none tracking-wider ${badge.class}`}>
                                                  {badge.text}
                                                </span>
                                              )}
                                            </a>
                                          );
                                        })}
                                        <a
                                          href="/package/india"
                                          onClick={() => setIsNavigating(true)}
                                          className="text-[15px] cursor-pointer text-slate-500 hover:text-blue-600 font-semibold transition-all duration-200"
                                        >
                                          Explore 30+ States
                                        </a>
                                      </div>
                                    ) : (
                                      <div className="text-center py-6 text-sm text-slate-500">No states found</div>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            }

                            // Special handling for International Tour - compact grid layout showing countries
                            if (item.name === "International Tour") {
                              // Only render once to show all countries in grid
                              if (subIndex === 0) {
                                return (
                                  <div key="international-countries-grid">
                                    {locationsLoading ? (
                                      <div className="flex flex-col items-center justify-center py-8 space-y-3">
                                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Loading Destinations</p>
                                      </div>
                                    ) : internationalCountries.length > 0 ? (
                                      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                                        {internationalCountries.slice(0, 14).map((country, countryIndex) => {
                                          const badge = getBadgeForLocation(country);
                                          return (
                                            <a
                                              key={countryIndex}
                                              href={`/package/international/${country.toLowerCase().replace(/\s+/g, "-")}`}
                                              onClick={() => setIsNavigating(true)}
                                              className="text-[15px] cursor-pointer text-slate-600 hover:text-blue-600 font-medium transition-all duration-200 flex items-center justify-between group"
                                              title={country}
                                            >
                                              <span className="truncate pr-2">{country}</span>
                                              {badge && (
                                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border leading-none tracking-wider ${badge.class}`}>
                                                  {badge.text}
                                                </span>
                                              )}
                                            </a>
                                          );
                                        })}
                                        <a
                                          href="/destinations"
                                          onClick={() => setIsNavigating(true)}
                                          className="text-[15px] cursor-pointer text-slate-500 hover:text-blue-600 font-semibold transition-all duration-200"
                                        >
                                          Explore 40+ Destinations
                                        </a>
                                      </div>
                                    ) : (
                                      <div className="text-center py-6 text-sm text-slate-500">No countries found</div>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            }

                            // Regular submenu item (for other tour types)
                            return (
                              <div
                                key={subIndex}
                                className="border-b border-gray-100 last:border-b-0"
                              >
                                <a
                                  href={subItem.href}
                                  className="flex items-center px-5 py-3 text-sm text-slate-800 hover:text-blue-600 transition-all duration-200 group/item"
                                >
                                  <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center mr-3 transition-colors group-hover/item:bg-slate-100 shadow-sm border border-slate-100/50">
                                    <DestinationIcon className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <span className="flex-1 font-bold text-sm tracking-tight">
                                    {subItem.name}
                                  </span>
                                  {subItem.featured && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 0.1 }}
                                      className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100"
                                    >
                                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                      <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Top Pick</span>
                                    </motion.div>
                                  )}
                                </a>

                                {/* Show destinations under each state for non-India tours */}
                                {subItem.destinations &&
                                  subItem.destinations.length > 0 &&
                                  item.name !== "India Tour Package" &&
                                  item.name !== "International Tour" && (
                                    <div className="bg-slate-50/30 px-5 py-3 border-t border-slate-100/50">
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] flex items-center gap-2">
                                          <Sparkles className="w-3 h-3 text-blue-400" />
                                          Popular Destinations
                                        </div>
                                        {subItem.destinations.length > 5 && (
                                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                        )}
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {subItem.destinations
                                          .slice(0, 5)
                                          .map((dest, destIndex) => (
                                            <a
                                              key={destIndex}
                                              href={
                                                dest.type === "package"
                                                  ? `/package/${dest.id}`
                                                  : `/destinations/${dest.id}`
                                              }
                                              className="flex items-center text-xs text-slate-500 hover:text-blue-600 font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm transition-all duration-200 group/dest"
                                            >
                                              <MapPin className="w-3 h-3 mr-1.5 text-slate-300 group-hover/dest:text-blue-500" />
                                              <span className="truncate">
                                                {dest.name}
                                              </span>
                                              {dest.isTrending && (
                                                <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500 ml-1.5" />
                                              )}
                                            </a>
                                          ))}
                                        {subItem.destinations.length > 5 && (
                                          <div className="text-[10px] font-black text-blue-600/70 hover:text-blue-600 cursor-pointer py-1.5 px-2 uppercase tracking-wider">
                                            +{subItem.destinations.length - 5} More
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              <a
                href="/fixed-departures"
                className={`transition-all ${isTransparent
                  ? "text-white opacity-80 hover:opacity-100"
                  : "text-slate-700 hover:text-slate-900"
                  }`}
              >
                Fixed Departure
              </a>

            </nav>

            {/* Right side - Desktop & Mobile Book Now */}
            <div className="flex items-center gap-3">
              {/* Desktop specific buttons */}
              <div className="hidden md:flex items-center gap-3 text-sm font-semibold">
                <motion.button
                  onClick={() => router.push("/payment")}
                  className={`rounded-[6px] border cursor-pointer backdrop-blur-md px-4 py-2 transition shadow-none ${isTransparent
                    ? "border-white bg-white/10 hover:bg-white/10 text-white"
                    : "border-gray-300 hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  Payment
                </motion.button>



                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className={`flex items-center gap-2 p-1.5 rounded-full transition-all border cursor-pointer ${isTransparent
                        ? "border-white/30 bg-white/10 hover:bg-white/20 text-white"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                        }`}
                    >
                      <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 px-1 py-1"
                        >
                          <div className="px-4 py-3 border-b border-slate-100 mb-1">
                            <p className="text-sm font-black !text-slate-900 truncate">{user.name}</p>
                            <p className="text-[10px] font-medium !text-slate-500 truncate">{user.email}</p>
                          </div>
                          <button
                            onClick={() => {
                              router.push("/profile");
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                            <Ticket className="w-4 h-4 text-blue-600" />
                            <span className="font-bold">My Bookings</span>
                          </button>
                          <button
                            onClick={() => { logout(); setShowUserMenu(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="font-bold">Sign Out</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/login")}
                    className={`rounded-[6px] px-5 py-2 font-bold transition-all shadow-none flex items-center gap-2 group cursor-pointer ${isTransparent
                      ? "bg-white text-blue-900"
                      : "bg-blue-600 text-white"
                      }`}
                  >
                    Login
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>
                )}

                <button
                  className={`p-2 rounded-full cursor-pointer transition-colors ${isTransparent ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  onClick={() => setIsSidebarOpen(true)}
                  aria-label="Menu"
                >
                  <HiOutlineMenuAlt3 className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Actions - Rich Looking */}
              <div className="md:hidden flex items-center gap-2">


                {user ? (
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 cursor-pointer ${isTransparent
                      ? "border-white/40 bg-white/10 text-white"
                      : "border-gray-200 bg-gray-50 text-slate-700"
                      }`}
                  >
                    <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold capitalize">
                      {user.name.charAt(0)}
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => router.push("/login")}
                    className={`flex h-10 w-10 items-center justify-center rounded-[6px] border transition-all duration-300 cursor-pointer ${isTransparent
                      ? "border-white/40 bg-white/10 text-white"
                      : "border-gray-200 bg-gray-50 text-slate-700"
                      }`}
                    aria-label="Login"
                  >
                    <UserIcon className="h-5 w-5" />
                  </button>
                )}

                <button
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 cursor-pointer ${isTransparent
                    ? "border-white/40 bg-white/10 text-white active:bg-white/20"
                    : "border-gray-200 bg-gray-50 text-gray-700 active:bg-gray-100"
                    }`}
                  onClick={() => setIsSidebarOpen(true)}
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {user && showUserMenu && (
            <div className="md:hidden absolute right-4 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 px-1 py-1">
              <div className="px-4 py-3 border-b border-slate-100 mb-1">
                <p className="text-sm font-black !text-slate-900 truncate">{user.name}</p>
                <p className="text-[10px] font-medium !text-slate-500 truncate">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  router.push("/profile");
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Ticket className="w-4 h-4 text-blue-600" />
                <span className="font-bold">My Bookings</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-bold">Sign Out</span>
              </button>
            </div>
          )}

        </div>


      </div>

      {/* Lead Capture Form */}
      < LeadCaptureForm
        isOpen={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
      />

      {/* Navigation Loading Overlay */}
      {
        isNavigating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Loading Packages
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Please wait while we fetch the best packages for you...
              </p>

              {/* Progress indicator */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-600 h-2 rounded-full animate-pulse"
                  style={{ width: "60%" }}
                ></div>
              </div>

              <div className="text-xs text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <span>Fetching destinations</span>
                </div>
              </div>
            </div>
          </div>
        )
      }
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navItems={filteredNavItems}
        onBookNow={() => setIsLeadFormOpen(true)}
      />

    </header >
  );
};

export default Header;
