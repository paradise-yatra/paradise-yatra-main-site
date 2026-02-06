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
  Settings,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import LeadCaptureForm from "./LeadCaptureForm";
import Sidebar from "./Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

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

  const pathname = usePathname();
  const isHome = pathname === "/";
  const isTransparent = isHome; // Always transparent on home page

  // Use the custom hook for dynamic navigation
  const { navItems, loading } = useNavigation();
  const router = useRouter();

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



  return (
    <header className={`${isHome ? "absolute" : "relative"} z-50 w-full top-0 left-0 right-0 font-plus-jakarta-sans`}>

      {/* <div className="pointer-events-none absolute top-0 left-0 w-full h-22 bg-gradient-to-b from-black/60 via-black/20 to-transparent z-[-1]" /> */}

      <div className="pointer-events-none absolute top-0 left-0 w-full h-22 bg-gradient-to-b from-black/65 from-0% via-black/25 via-40% via-black/8 via-70% to-transparent to-100% z-[-1]" />
      {/* Main header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={`transition-all duration-300 ${isTransparent
          ? "bg-transparent border-transparent"
          : "bg-white border-gray-100/50 shadow-sm"
          }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-5">
            {/* Logo - Left side */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
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
            </motion.div>

            {/* Navigation - Desktop - Centered */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
              {filteredNavItems.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(index)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <motion.button
                      className={`flex items-center gap-1 transition-colors ${isTransparent
                        ? "text-white"
                        : "text-gray-700 hover:text-[#FDA800]"
                        }`}
                    >
                      {item.name}
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === index ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.button>


                    <AnimatePresence>
                      {activeDropdown === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className={`absolute left-0 top-full mt-6 bg-white rounded-lg shadow-xl border border-slate-200/60 z-20 overflow-hidden backdrop-blur-xl bg-white/99 ${item.name === "International Tour" || item.name === "India Tour Package"
                            ? "w-[500px] max-w-[90vw]"
                            : "w-96"
                            }`}
                        >
                          {item.submenu.map((subItem, subIndex) => {
                            const DestinationIcon = getDestinationIcon(
                              subItem.name
                            );


                            // Special handling for India Tour Package - compact grid layout showing states
                            if (
                              item.name === "India Tour Package" &&
                              subItem.destinations &&
                              subItem.destinations.length > 0
                            ) {
                              // Only render once to show all states in grid
                              if (subIndex === 0) {
                                return (
                                  <div key="india-states-grid" className="p-2.5">
                                    <div className="grid grid-cols-3 gap-x-2.5 gap-y-1">
                                      {item.submenu.map((stateItem, stateIndex) => (
                                        <a
                                          key={stateIndex}
                                          href={`/packages/india/${stateItem.name
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")}`}
                                          onClick={() => setIsNavigating(true)}
                                          className="text-sm cursor-pointer text-slate-900 hover:text-blue-600 font-bold py-1 px-1.5 rounded-sm hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 transition-all duration-200 truncate whitespace-nowrap border border-transparent hover:border-blue-100"
                                          title={stateItem.name}
                                        >
                                          {stateItem.name}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }

                            // Special handling for International Tour - compact grid layout showing countries
                            if (
                              item.name === "International Tour" &&
                              subItem.destinations &&
                              subItem.destinations.length > 0
                            ) {
                              // Only render once to show all countries in grid
                              if (subIndex === 0) {
                                return (
                                  <div key="international-countries-grid" className="p-2.5">
                                    <div className="grid grid-cols-3 gap-x-2.5 gap-y-1">
                                      {item.submenu.map((countryItem, countryIndex) => (
                                        <a
                                          key={countryIndex}
                                          href={`/packages/international/${countryItem.name
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")}`}
                                          onClick={() => setIsNavigating(true)}
                                          className="text-sm cursor-pointer text-slate-900 hover:text-blue-600 font-bold py-1 px-1.5 rounded-sm hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 transition-all duration-200 truncate whitespace-nowrap border border-transparent hover:border-blue-100"
                                          title={countryItem.name}
                                        >
                                          {countryItem.name}
                                        </a>
                                      ))}
                                    </div>
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
                                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 border-l-4 border-transparent hover:border-blue-500"
                                >
                                  <DestinationIcon className="w-4 h-4 mr-3 text-blue-500" />
                                  <span className="flex-1 font-medium">
                                    {subItem.name}
                                  </span>
                                  {subItem.featured && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 0.1 }}
                                    >
                                      <Star className="w-3 h-3 text-yellow-500 ml-2" />
                                    </motion.div>
                                  )}
                                </a>

                                {/* Show destinations under each state for non-India tours */}
                                {subItem.destinations &&
                                  subItem.destinations.length > 0 &&
                                  item.name !== "India Tour Package" &&
                                  item.name !== "International Tour" && (
                                    <div className="bg-gray-50/50 px-4 py-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative">
                                      {subItem.destinations.length > 5 && (
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                      )}
                                      <div className="text-xs text-gray-500 mb-2 font-medium">
                                        Popular Destinations:
                                      </div>
                                      <div className="space-y-1">
                                        {subItem.destinations
                                          .slice(0, 5)
                                          .map((dest, destIndex) => (
                                            <a
                                              key={destIndex}
                                              href={
                                                dest.type === "package"
                                                  ? `/itinerary/${dest.id}`
                                                  : `/destinations/${dest.id}`
                                              }
                                              className="flex items-center text-xs text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                            >
                                              <MapPin className="w-3 h-3 mr-2 text-blue-400" />
                                              <span className="truncate">
                                                {dest.name}
                                              </span>
                                              {dest.isTrending && (
                                                <motion.div
                                                  initial={{ scale: 0 }}
                                                  animate={{ scale: 1 }}
                                                  transition={{ delay: 0.1 }}
                                                >
                                                  <Star className="w-2 h-4 text-yellow-500 ml-1" />
                                                </motion.div>
                                              )}
                                            </a>
                                          ))}
                                        {subItem.destinations.length > 5 && (
                                          <div className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer pt-1">
                                            +{subItem.destinations.length - 5}{" "}
                                            more
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
                className={`transition-colors ${isTransparent
                  ? "text-white hover:text-[#FDA800]"
                  : "text-gray-700 hover:text-[#FDA800]"
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
                  onClick={() => setIsLeadFormOpen(true)}
                  className={`rounded-lg border cursor-pointer backdrop-blur-md px-4 py-2 transition ${isTransparent
                    ? "border-white bg-white/10 hover:bg-white/10 text-white"
                    : "border-gray-300 hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  Book Now
                </motion.button>



                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className={`flex items-center gap-2 p-1.5 rounded-full transition-all border ${isTransparent
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
                            <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                            <p className="text-[10px] font-medium text-slate-500 truncate">{user.email}</p>
                          </div>
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
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/login")}
                    className={`rounded-lg px-5 py-2 font-bold transition-all shadow-sm flex items-center gap-2 group ${isTransparent
                      ? "bg-white text-blue-900 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
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
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 ${isTransparent
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
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 ${isTransparent
                      ? "border-white/40 bg-white/10 text-white"
                      : "border-gray-200 bg-gray-50 text-slate-700"
                      }`}
                    aria-label="Login"
                  >
                    <UserIcon className="h-5 w-5" />
                  </button>
                )}

                <button
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 ${isTransparent
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

        </div>


      </motion.div>

      {/* Lead Capture Form */}
      <LeadCaptureForm
        isOpen={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
      />

      {/* Navigation Loading Overlay */}
      {isNavigating && (
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
      )}
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navItems={filteredNavItems}
        onBookNow={() => setIsLeadFormOpen(true)}
      />

    </header>
  );
};

export default Header;