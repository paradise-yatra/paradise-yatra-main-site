"use client";

import { Button } from "@/components/ui/button";
import {
  Menu,
  Shield,
  Users,
  Headphones,
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import LeadCaptureForm from "./LeadCaptureForm";
import { useRouter } from "next/navigation";

import { useNavigation } from "@/hooks/useNavigation";
import Image from "next/image";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Use the custom hook for dynamic navigation
  const { navItems, loading } = useNavigation();
  const router = useRouter();

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
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const trustItems = [
    { icon: Star, text: "4.9★", color: "text-yellow-400" },
    { icon: Shield, text: "100% Safe", color: "text-blue-200" },
    { icon: Users, text: "5000+", color: "text-cyan-500" },
    { icon: Headphones, text: "24/7", color: "text-amber-500" },
  ];

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        {/* Trust indicators ribbon */}
        <motion.div
          initial={{ y: -40 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white"
        >
          <div className="container mx-auto px-2 sm:px-4 py-1 sm:py-2">
            <div className="flex items-center justify-center gap-x-2 sm:gap-x-4 lg:gap-x-8 text-xs">
              {trustItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-1"
                >
                  <motion.span
                    animate={{ opacity: [0.8, 1, 0.8], scale: [1, 1.06, 1] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: index * 0.2,
                    }}
                    className="flex items-center space-x-1"
                  >
                    <item.icon className={`w-3 h-3 ${item.color}`} />
                    <span className="font-semibold text-xs whitespace-nowrap">
                      {item.text}
                    </span>
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main header with loading state */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/95 backdrop-blur-xl border-b border-gray-100/50"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center flex-shrink-0"
              >
                <Image
                  src="/headerLogo.png"
                  alt="Paradise Yatra"
                  width={80}
                  height={80}
                  className="w-12 h-12 sm:w-16 sm:h-18 lg:w-20 lg:h-20 hover:cursor-pointer"
                  onClick={() => router.push("/")}
                />
              </motion.div>

              {/* Loading navigation */}
              <nav className="hidden lg:flex items-center justify-center flex-1 px-8">
                <div className="animate-pulse flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-36"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </nav>

              {/* Right side */}
              <div className="hidden lg:flex space-x-2 xl:space-x-4 !flex-shrink-0 ml-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="hidden xl:flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 cursor-pointer px-3 py-2 rounded-lg hover:bg-blue-50"
                >
                  <Phone />
                  <span>+91 8979396413</span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setIsLeadFormOpen(true)}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-3 xl:px-6 py-2 rounded-lg transition-all duration-300 shadow-lg"
                  >
                    Book Now
                  </Button>
                </motion.div>
              </div>

              {/* Mobile menu button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="lg:hidden mobile-menu-container ml-auto"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-full"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Lead Capture Form */}
        <LeadCaptureForm
          isOpen={isLeadFormOpen}
          onClose={() => setIsLeadFormOpen(false)}
        />
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Trust indicators ribbon */}
      <motion.div
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white"
      >
        <div className="container mx-auto px-2 sm:px-4 py-1 sm:py-2">
          <div className="flex items-center justify-center gap-x-2 sm:gap-x-4 lg:gap-x-8 text-xs">
            {trustItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-1"
              >
                <motion.span
                  animate={{ opacity: [0.8, 1, 0.8], scale: [1, 1.06, 1] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: index * 0.2,
                  }}
                  className="flex items-center space-x-1"
                >
                  <item.icon className={`w-3 h-3 ${item.color}`} />
                  <span className="font-semibold text-xs whitespace-nowrap">
                    {item.text}
                  </span>
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={`bg-white/95 backdrop-blur-xl border-b border-gray-100/50 transition-all duration-300 ${
          isScrolled ? "shadow-lg bg-white/98" : ""
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 lg:h-20">
            {/* Logo - Left side */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center flex-shrink-0 w-40 -ml-2"
            >
              <Image
                src="/headerLogo.png"
                alt="Paradise Yatra"
                width={80}
                height={80}
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 hover:cursor-pointer"
                onClick={() => router.push("/")}
              />
            </motion.div>

            {/* Navigation - Desktop - Centered */}
            <nav className="hidden lg:flex flex-1 px-8 ml-20">
              <div className="flex items-center space-x-6">
                {navItems.map((item, index) => {
                  const IconComponent =
                    iconMap[item.icon as keyof typeof iconMap];
                  return (
                    <div
                      key={index}
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(index)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <motion.button
                        whileHover={{ color: "#2563eb" }}
                        className="flex items-center px-3 py-2 text-gray-700 font-medium text-sm rounded-lg hover:bg-blue-50 transition-all duration-300 whitespace-nowrap"
                      >
                        {IconComponent && (
                          <IconComponent className="w-4 h-4 mr-2" />
                        )}
                        {item.name}
                        <ChevronDown
                          className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                            activeDropdown === index ? "rotate-180" : ""
                          }`}
                        />
                      </motion.button>

                      <AnimatePresence>
                        {activeDropdown === index && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.5 }}
                            className="absolute left-0 top-full mt-1 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                          >
                            {item.submenu.map((subItem, subIndex) => {
                              const DestinationIcon = getDestinationIcon(
                                subItem.name
                              );

                              // Check if this is a fixed departure submenu item
                              if (
                                subItem.fixedDepartures &&
                                subItem.fixedDepartures.length > 0
                              ) {
                                return (
                                  <div
                                    key={subIndex}
                                    className="border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50">
                                      <div className="flex items-center">
                                        <DestinationIcon className="w-4 h-4 mr-3 text-blue-500" />
                                        <span className="flex-1 font-medium text-blue-700">
                                          {subItem.name}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Show fixed departure packages */}
                                    <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative">
                                      {subItem.fixedDepartures.length > 4 && (
                                        <div className="absolute top-0 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                      )}
                                      {subItem.fixedDepartures
                                        .slice(0, 4)
                                        .map((departure, depIndex) => (
                                          <a
                                            key={depIndex}
                                            href={`/fixed-departures/${departure.slug}`}
                                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 border-l-4 border-transparent hover:border-blue-500"
                                          >
                                            {departure.image ? (
                                              <Image
                                                src={departure.image}
                                                alt={departure.title}
                                                width={48}
                                                height={32}
                                                className="w-12 h-8 object-cover rounded mr-3"
                                              />
                                            ) : (
                                              <div className="w-12 h-8 bg-gray-200 rounded mr-3 flex items-center justify-center">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                              </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                              <div className="font-medium text-sm truncate">
                                                {departure.title}
                                              </div>
                                              <div className="text-xs text-gray-500 truncate">
                                                {departure.destination}
                                              </div>
                                              <div className="flex items-center space-x-2 mt-1">
                                                <span className="text-xs text-blue-600 font-medium">
                                                  {departure.duration}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                  •
                                                </span>
                                                <span className="text-xs text-green-600 font-medium">
                                                  ₹
                                                  {departure.price.toLocaleString()}
                                                </span>
                                                {departure.discount > 0 && (
                                                  <>
                                                    <span className="text-xs text-gray-400">
                                                      •
                                                    </span>
                                                    <span className="text-xs text-red-600 font-medium">
                                                      {departure.discount}% OFF
                                                    </span>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                            {departure.isFeatured && (
                                              <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.1 }}
                                              >
                                                <Star className="w-3 h-3 text-yellow-500 ml-2" />
                                              </motion.div>
                                            )}
                                          </a>
                                        ))}
                                      {subItem.fixedDepartures.length > 4 && (
                                        <div className="px-4 py-2 bg-gray-50/50">
                                          <a
                                            href={subItem.href}
                                            className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
                                          >
                                            View all{" "}
                                            {subItem.fixedDepartures.length}{" "}
                                            tours →
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              }

                              // Special handling for India Tour Package - show states with packages underneath
                              if (
                                item.name === "India Tour Package" &&
                                subItem.destinations &&
                                subItem.destinations.length > 0
                              ) {
                                return (
                                  <div
                                    key={subIndex}
                                    className="border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50">
                                      <a
                                        href={`/packages/india/${subItem.name
                                          .toLowerCase()
                                          .replace(/\s+/g, "-")}`}
                                        onClick={() => setIsNavigating(true)}
                                        className="flex items-center hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 rounded-lg p-2 transition-all duration-200 relative group"
                                      >
                                        <DestinationIcon className="w-4 h-4 mr-3 text-blue-500" />
                                        <span className="flex-1 font-medium text-blue-700 hover:text-blue-800">
                                          {subItem.name}
                                        </span>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium border border-blue-200">
                                            {subItem.destinations.length}{" "}
                                            packages
                                          </span>
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                );
                              }

                              // Special handling for International Tour - match India style (countries only, no images)
                              if (
                                item.name === "International Tour" &&
                                subItem.destinations &&
                                subItem.destinations.length > 0
                              ) {
                                return (
                                  <div
                                    key={subIndex}
                                    className="border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50">
                                      <a
                                        href={`/packages/international/${subItem.name
                                          .toLowerCase()
                                          .replace(/\s+/g, "-")}`}
                                        onClick={() => setIsNavigating(true)}
                                        className="flex items-center hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 rounded-lg p-2 transition-all duration-200 relative group"
                                      >
                                        <DestinationIcon className="w-4 h-4 mr-3 text-blue-500" />
                                        <span className="flex-1 font-medium text-blue-700 hover:text-blue-800">
                                          {subItem.name}
                                        </span>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium border border-blue-200">
                                            {subItem.destinations.length}{" "}
                                            packages
                                          </span>
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                );
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
              </div>
            </nav>

            {/* Right side - Desktop */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 flex-shrink-0 ml-auto xl:ml-8 2xl:ml-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="hidden xl:flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 cursor-pointer px-2 py-2 rounded-lg hover:bg-blue-50"
              >
                <Phone className="w-4 h-4" />
                <span className="whitespace-nowrap">+91 8979396413</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => setIsLeadFormOpen(true)}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:cursor-pointer text-white font-semibold px-3 xl:px-4 py-2 rounded-lg transition-all duration-300 shadow-lg whitespace-nowrap"
                >
                  Book Now
                </Button>
              </motion.div>
            </div>

            {/* Mobile menu button - Right side */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden mobile-menu-container ml-auto flex-shrink-0 w-12"
            >
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-full"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
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
                  {navItems.map((item, index) => {
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

                            // Check if this is a fixed departure submenu item
                            if (
                              subItem.fixedDepartures &&
                              subItem.fixedDepartures.length > 0
                            ) {
                              return (
                                <div key={subIndex} className="space-y-2">
                                  <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                    <div className="flex items-center">
                                      <DestinationIcon className="w-4 h-4 mr-3 text-blue-500" />
                                      <span className="font-semibold text-blue-700">
                                        {subItem.name}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Show fixed departure packages in mobile */}
                                  <div className="ml-6 pl-3 border-l-2 border-blue-200 space-y-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative">
                                    {subItem.fixedDepartures.length > 4 && (
                                      <div className="absolute top-0 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                    )}
                                    {subItem.fixedDepartures
                                      .slice(0, 4)
                                      .map((departure, depIndex) => (
                                        <motion.a
                                          key={depIndex}
                                          href={`/fixed-departures/${departure.slug}`}
                                          whileHover={{ x: 3 }}
                                          className="block p-3 rounded-lg bg-white border border-gray-100 hover:border-blue-200 transition-all duration-200"
                                          onClick={() =>
                                            setIsMobileMenuOpen(false)
                                          }
                                        >
                                          <div className="flex items-start space-x-3">
                                            {departure.image ? (
                                              <Image
                                                src={departure.image}
                                                alt={departure.title}
                                                width={64}
                                                height={48}
                                                className="w-16 h-12 object-cover rounded"
                                              />
                                            ) : (
                                              <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-gray-400" />
                                              </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                              <div className="font-medium text-sm text-gray-800 truncate">
                                                {departure.title}
                                              </div>
                                              <div className="text-xs text-gray-500 truncate">
                                                {departure.destination}
                                              </div>
                                              <div className="flex items-center space-x-2 mt-1">
                                                <span className="text-xs text-blue-600 font-medium">
                                                  {departure.duration}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                  •
                                                </span>
                                                <span className="text-xs text-green-600 font-medium">
                                                  ₹
                                                  {departure.price.toLocaleString()}
                                                </span>
                                              </div>
                                              {departure.discount > 0 && (
                                                <div className="mt-1">
                                                  <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded">
                                                    {departure.discount}% OFF
                                                  </span>
                                                </div>
                                              )}
                                            </div>
                                            {departure.isFeatured && (
                                              <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                            )}
                                          </div>
                                        </motion.a>
                                      ))}
                                    {subItem.fixedDepartures.length > 3 && (
                                      <motion.a
                                        href={subItem.href}
                                        whileHover={{ x: 3 }}
                                        className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer font-medium block pt-2"
                                        onClick={() =>
                                          setIsMobileMenuOpen(false)
                                        }
                                      >
                                        View all{" "}
                                        {subItem.fixedDepartures.length} tours →
                                      </motion.a>
                                    )}
                                  </div>
                                </div>
                              );
                            }

                            // Special handling for India Tour Package - show states with packages underneath
                            if (
                              item.name === "India Tour Package" &&
                              subItem.destinations &&
                              subItem.destinations.length > 0
                            ) {
                              return (
                                <div key={subIndex} className="space-y-2">
                                  <motion.a
                                    href={`/packages/india/${subItem.name
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")}`}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center py-2 px-3 text-sm text-gray-600 rounded-lg hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                                    onClick={() => {
                                      setIsMobileMenuOpen(false);
                                      setIsNavigating(true);
                                    }}
                                  >
                                    <DestinationIcon className="w-4 h-4 !mt-2 mr-3 text-blue-500" />
                                    <span className="flex-1 font-medium">
                                      {subItem.name}
                                    </span>
                                    <span className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded-full ml-2 font-medium">
                                      {subItem.destinations.length}
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
                                </div>
                              );
                            }

                            // Special handling for International Tour in mobile - match India style (countries only, no images)
                            if (
                              item.name === "International Tour" &&
                              subItem.destinations &&
                              subItem.destinations.length > 0
                            ) {
                              return (
                                <div key={subIndex} className="space-y-2">
                                  <motion.a
                                    href={`/packages/international/${subItem.name
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")}`}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center py-2 px-3 text-sm text-gray-600 rounded-lg hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                                    onClick={() => {
                                      setIsMobileMenuOpen(false);
                                      setIsNavigating(true);
                                    }}
                                  >
                                    <DestinationIcon className="w-4 h-4 !mt-2 mr-3 text-blue-500" />
                                    <span className="flex-1 font-medium">
                                      {subItem.name}
                                    </span>
                                    <span className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded-full ml-2">
                                      {subItem.destinations.length}
                                    </span>
                                  </motion.a>
                                </div>
                              );
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
    </header>
  );
};

export default Header;
