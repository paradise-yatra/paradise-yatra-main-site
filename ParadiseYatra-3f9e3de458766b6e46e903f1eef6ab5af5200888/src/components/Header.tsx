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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import LeadCaptureForm from "./LeadCaptureForm";
import Sidebar from "./Sidebar";
import { usePathname, useRouter } from "next/navigation";

import { useNavigation } from "@/hooks/useNavigation";
import Image from "next/image";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".mobile-menu-container")) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    const bodyStyle = document.body.style;

    if (isMobileMenuOpen) {
      bodyStyle.overflowY = "hidden";
    } else {
      bodyStyle.overflowY = "";
    }

    // Always keep horizontal overflow hidden to prevent stray scroll on mobile
    bodyStyle.overflowX = "hidden";

    return () => {
      bodyStyle.overflowY = "";
      bodyStyle.overflowX = "hidden";
    };
  }, [isMobileMenuOpen]);



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
          : "bg-white border-gray-100/50 shadow-lg"
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
                <div className="relative h-11 w-11 rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-shadow bg-white">
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

            {/* Right side - Desktop */}
            <div className="hidden md:flex items-center gap-3 text-sm font-semibold">
              <motion.button
                onClick={() => setIsLeadFormOpen(true)}
                className={`rounded-lg border cursor-pointer backdrop-blur-md px-4 py-2 backdrop-blur-sm transition ${isTransparent
                  ? "border-white  bg-white/10 hover:bg-white/10 text-white "
                  : "border-gray-300 hover:bg-gray-100 text-gray-700"
                  }`}
              >
                Book Now
              </motion.button>
              <button
                className={`p-2 rounded-full cursor-pointer transition-colors ${isTransparent ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"
                  }`}
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Menu"
              >
                <HiOutlineMenuAlt3 className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile menu button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden mobile-menu-container"
            >
              <button
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${isTransparent
                  ? "border-white/40 hover:bg-white/10 text-white"
                  : "border-gray-300 hover:bg-gray-100 text-gray-700"
                  }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                )}
              </button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-white/98 backdrop-blur-xl border-t border-gray-200"
            >
              <div className="container !mt-4 px-4 sm:px-6 py-6 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {/* Mobile Navigation Items */}
                <nav className="space-y-4 mb-6">
                  {filteredNavItems.map((item, index) => {
                    const IconComponent =
                      iconMap[item.icon as keyof typeof iconMap];
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="border border-gray-100 rounded-lg p-4  bg-gradient-to-r from-gray-50 to-blue-50"
                      >
                        <div className="flex items-center mb-3">
                          {IconComponent && (
                            <IconComponent className="w-5 h-5 text-blue-600 mr-3" />
                          )}
                          <div className="font-semibold text-gray-800">
                            {item.name}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {item.submenu.map((subItem, subIndex) => {
                            const DestinationIcon = getDestinationIcon(
                              subItem.name
                            );


                            // Special handling for India Tour Package - compact grid layout showing states in mobile
                            if (
                              item.name === "India Tour Package" &&
                              subItem.destinations &&
                              subItem.destinations.length > 0
                            ) {
                              // Only render once to show all states in grid
                              if (subIndex === 0) {
                                return (
                                  <div key="india-states-grid-mobile" className="space-y-2">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-1">
                                      {item.submenu.map((stateItem, stateIndex) => (
                                        <motion.a
                                          key={stateIndex}
                                          href={`/packages/india/${stateItem.name
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")}`}
                                          whileHover={{ x: 2 }}
                                          className="text-xs cursor-pointer text-slate-600 hover:text-blue-600 font-medium py-1 px-1.5 rounded-sm hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 transition-all duration-200 truncate whitespace-nowrap border border-transparent hover:border-blue-100"
                                          title={stateItem.name}
                                          onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setIsNavigating(true);
                                          }}
                                        >
                                          {stateItem.name}
                                        </motion.a>
                                      ))}
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }

                            // Special handling for International Tour in mobile - compact grid layout showing countries
                            if (
                              item.name === "International Tour" &&
                              subItem.destinations &&
                              subItem.destinations.length > 0
                            ) {
                              // Only render once to show all countries in grid
                              if (subIndex === 0) {
                                return (
                                  <div key="international-countries-grid-mobile" className="space-y-2">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-1">
                                      {item.submenu.map((countryItem, countryIndex) => (
                                        <motion.a
                                          key={countryIndex}
                                          href={`/packages/international/${countryItem.name
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")}`}
                                          whileHover={{ x: 2 }}
                                          className="text-xs cursor-pointer text-slate-600 hover:text-blue-600 font-medium py-1 px-1.5 rounded-sm hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 transition-all duration-200 truncate whitespace-nowrap border border-transparent hover:border-blue-100"
                                          title={countryItem.name}
                                          onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setIsNavigating(true);
                                          }}
                                        >
                                          {countryItem.name}
                                        </motion.a>
                                      ))}
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }

                            // Regular submenu item (for other tour types)
                            return (
                              <div key={subIndex} className="space-y-2">
                                <motion.a
                                  href={subItem.href}
                                  whileHover={{ x: 5 }}
                                  className="flex items-center py-2 px-3 text-sm text-gray-600 rounded-lg hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  <DestinationIcon className="w-4 h-4 !mt-2 mr-3 text-blue-500" />
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
                                </motion.a>

                                {/* Show destinations under each state in mobile for non-India tours */}
                                {subItem.destinations &&
                                  subItem.destinations.length > 0 &&
                                  item.name !== "India Tour Package" &&
                                  item.name !== "International Tour" && (
                                    <div className="ml-6 pl-3 border-l-2 border-blue-200 space-y-1 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative">
                                      {subItem.destinations.length > 4 && (
                                        <div className="absolute top-0 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                      )}
                                      <div className="text-xs text-gray-500 font-medium mb-1">
                                        Popular Destinations:
                                      </div>
                                      {subItem.destinations
                                        .slice(0, 4)
                                        .map((dest, destIndex) => (
                                          <motion.a
                                            key={destIndex}
                                            href={
                                              dest.type === "package"
                                                ? `/itinerary/${dest.id}`
                                                : `/destinations/${dest.id}`
                                            }
                                            whileHover={{ x: 3 }}
                                            className="flex items-center text-xs text-gray-500 hover:text-blue-600 transition-colors duration-200 py-1"
                                            onClick={() =>
                                              setIsMobileMenuOpen(false)
                                            }
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
                                          </motion.a>
                                        ))}
                                      {subItem.destinations.length > 4 && (
                                        <div className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer pt-1">
                                          +{subItem.destinations.length - 4}{" "}
                                          more
                                        </div>
                                      )}
                                    </div>
                                  )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Mobile Contact Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100"
                  >
                    <Phone className="w-4 h-4 text-blue-600 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">
                        Call us anytime
                      </div>
                      <div className="font-semibold text-gray-800">
                        +91 8979396413
                      </div>
                    </div>
                  </motion.div>

                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mt-4 mb-4 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsLeadFormOpen(true);
                    }}
                  >
                    Book Your Adventure
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
      />

    </header>
  );
};

export default Header;