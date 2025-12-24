"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { SkeletonPackageCard } from "@/components/ui/skeleton";
import Skeleton from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { getCategoryPageUrl } from "@/lib/categoryUtils";

interface Destination {
  _id: string;
  name: string;
  slug?: string;
  description: string;
  shortDescription: string;
  image: string;
  location: string;
  price?: number;
  duration?: string;
  isActive: boolean;
  isTrending: boolean;
  visitCount: number;
}

const NewDestinationsGrid = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [activeScrollIndex, setActiveScrollIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset to first page
  const resetToFirstPage = () => {
    if (!isMobile && allDestinations.length > 0) {
      const initialDestinations = allDestinations.slice(0, 3);
      setDestinations(initialDestinations);
      setCurrentIndex(0);
    }
  };

  // Update mobile state based on screen size
  useEffect(() => {
    const updateMobileState = () => {
      const wasMobile = isMobile;
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);

      // If switching from mobile to desktop, reset to first page
      if (wasMobile && !newIsMobile) {
        resetToFirstPage();
      }
    };

    updateMobileState();
    window.addEventListener("resize", updateMobileState);
    return () => window.removeEventListener("resize", updateMobileState);
  }, [isMobile]);

  // Ensure initial state shows only 3 destinations for desktop view
  useEffect(() => {
    if (!isMobile && allDestinations.length > 0) {
      resetToFirstPage();
    }
  }, [allDestinations, isMobile]);

  // Set initial state when component mounts
  useEffect(() => {
    if (allDestinations.length > 0 && !isMobile) {
      resetToFirstPage();
    }
  }, []); // Empty dependency array means this runs once on mount

  // Handle scroll position for mobile indicators
  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current) return;

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollLeft = container.scrollLeft;
      // Use flex-based calculation instead of fixed values
      const containerWidth = container.offsetWidth;
      const cardWidth = containerWidth * 0.85; // 85% of container width
      const gap = 16; // gap between cards (matches the gap-4 class)
      const adjustedCardWidth = cardWidth + gap;
      const newIndex = Math.round(scrollLeft / adjustedCardWidth);
      setActiveScrollIndex(
        Math.min(Math.max(0, newIndex), allDestinations.length - 1)
      );
    };

    const container = scrollContainerRef.current;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isMobile, allDestinations.length]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/destinations");

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `Failed to fetch destinations: ${response.status} ${
              errorData.message || response.statusText
            }`
          );
        }

        const data = await response.json();
        console.log("API Response:", data); // Debug log

        // Handle both direct array response and wrapped response
        const destinationsArray = Array.isArray(data)
          ? data
          : data.destinations || [];

        if (destinationsArray.length > 0) {
          setAllDestinations(destinationsArray);
          // Set initial destinations to first 3 for desktop view
          const initialDestinations = destinationsArray.slice(0, 3);
          setDestinations(initialDestinations);
        } else {
          console.log("No destinations in array:", destinationsArray);
          console.log("Full API response:", data);
          // Don't throw error, just set empty arrays and let the UI handle it
          setAllDestinations([]);
          setDestinations([]);
        }

        setError(null);
      } catch (err: unknown) {
        console.error("Error fetching destinations:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load destinations";
        setError(errorMessage);
        // Don't set any fallback data - let the error state handle it
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Calculate total groups for desktop navigation
  const totalGroups = Math.ceil(allDestinations.length / 3);

  // Handle desktop navigation
  const handlePrevious = () => {
    if (isMobile) return;
    const newIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(newIndex);

    const startIndex = newIndex * 3;
    const endIndex = startIndex + 3;
    const newDestinations = allDestinations.slice(startIndex, endIndex);
    setDestinations(newDestinations);
  };

  const handleNext = () => {
    if (isMobile) return;
    const newIndex = Math.min(totalGroups - 1, currentIndex + 1);
    setCurrentIndex(newIndex);

    const startIndex = newIndex * 3;
    const endIndex = startIndex + 3;
    const newDestinations = allDestinations.slice(startIndex, endIndex);
    setDestinations(newDestinations);
  };

  if (loading) {
    return (
      <section className="section-padding bg-white px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <Skeleton height="2.5rem" width="300px" className="mx-auto mb-4" />
            <Skeleton height="1.25rem" width="200px" className="mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonPackageCard key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (destinations.length === 0) {
    return (
      <section className="section-padding bg-white px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <div className="animate-bounce flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-3">
            No Destinations Available
          </h2>
          <p className="text-gray-600 mb-4">
            We&apos;re currently setting up our destination database. Please
            check back later or contact our team.
          </p>
          <div className="text-sm text-gray-500">
            <p>
              If you&apos;re an admin, you can add destinations through the
              admin panel.
            </p>
            <p>
              If you&apos;re a developer, check that the backend database has
              destination data.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-50 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <Badge className="mb-4 !bg-blue-100 !font-regular !text-blue-800 !rounded-md hover:bg-blue-100 !px-1 !py-1">
            Destinations
          </Badge>
          <h2
            className="text-slate-900 mb-4"
            style={{
              fontSize: "48px",
              fontWeight: 700,
              lineHeight: "48px",
            }}
          >
            Popular Destinations
          </h2>
          <p className="text-[20px] text-slate-600 max-w-3xl mx-auto">
            Discover our most sought-after destinations, each offering unique
            experiences and unforgettable memories
          </p>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <motion.button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              whileHover={{ scale: currentIndex === 0 ? 1 : 1.1 }}
              whileTap={{ scale: currentIndex === 0 ? 1 : 0.9 }}
              className={`w-8 h-8 sm:w-10 sm:h-10 border rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                currentIndex === 0
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            {/* <div className="text-sm text-gray-500 font-medium">
              {currentIndex + 1} of {totalGroups}
            </div> */}

            <motion.button
              onClick={handleNext}
              disabled={currentIndex === totalGroups - 1}
              whileHover={{ scale: currentIndex === totalGroups - 1 ? 1 : 1.1 }}
              whileTap={{ scale: currentIndex === totalGroups - 1 ? 1 : 0.9 }}
              className={`w-8 h-8 sm:w-10 sm:h-10 border rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                currentIndex === totalGroups - 1
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>
        )}

        {/* Destinations Container */}
        {isMobile ? (
          // Mobile: Snap-scroll flex layout
          <div className="md:hidden w-full">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-0 pb-4 w-full scrollbar-hide flex-nowrap items-stretch"
              style={{
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
                display: "flex",
                flexDirection: "row",
                alignItems: "stretch",
              }}
            >
              {allDestinations.map((destination, index) => (
                <motion.div
                  key={destination._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.03 }}
                  className="flex-shrink-0 snap-start flex-1 min-w-0 w-full px-4"
                  style={{
                    flex: "0 0 100%",
                    maxWidth: "100%",
                    minWidth: "100%",
                    width: "100%",
                    flexShrink: 0,
                  }}
                >
                  <Link
                    href={`/destinations/${
                      destination.slug || destination.name
                    }`}
                    className="block w-full"
                  >
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 h-full group">
                      <div className="relative overflow-hidden">
                        <Image
                          src={
                            getImageUrl(destination.image) ||
                            "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                          }
                          alt={destination.name}
                          width={800}
                          height={400}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                        <div className="absolute top-4 left-4 mt-1">
                          <Badge className="!bg-[#3B82F6] text-white">
                            {destination.isTrending ? "Trending" : "Popular"}
                          </Badge>
                        </div>
                      </div>

                      <CardContent
                        className="!p-[22px]"
                        style={{
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        }}
                      >
                        <div
                          className="flex items-center text-slate-500 mb-2"
                          style={{ fontSize: "14px", lineHeight: "20px" }}
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          {destination.location}
                        </div>
                        <h3
                          className="text-slate-900 mb-2 truncate group-hover:!text-[#2563EB] transition-colors"
                          style={{
                            fontSize: "20px",
                            fontWeight: 700,
                            lineHeight: "28px",
                            fontFamily:
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                          }}
                        >
                          {destination.name}
                        </h3>
                        <div
                          className="flex items-center text-slate-500 mb-4"
                          style={{ fontSize: "14px", lineHeight: "20px" }}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          {destination.duration}
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[24px] font-bold text-[#0F172A]">
                              ₹
                              {destination.price?.toLocaleString() ||
                                "Contact Us"}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            className="hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
                            style={{
                              fontSize: "14px",
                              fontWeight: 500,
                              lineHeight: "20px",
                              height: "36px",
                              width: "144px",
                              padding: "8px 16px",
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile scroll indicators */}
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {allDestinations.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ease-in-out ${
                      index === activeScrollIndex
                        ? "bg-blue-600 w-8"
                        : "bg-gray-300 w-2 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
              <div className="ml-4 text-xs text-gray-500 flex items-center">
                <span>Swipe to explore more</span>
              </div>
            </div>
          </div>
        ) : (
          // Desktop: CSS Grid layout
          <div className="hidden md:block">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
              {destinations.map((destination, index) => (
                <div key={destination._id} className="h-full flex flex-col">
                  <Link
                    href={`/destinations/${
                      destination.slug || destination._id
                    }`}
                    className="block h-full"
                  >
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group h-full border-0">
                      <div className="relative overflow-hidden">
                        <Image
                          src={
                            getImageUrl(destination.image) ||
                            "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                          }
                          alt={destination.name}
                          width={800}
                          height={400}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes("unsplash.com")) {
                              target.src =
                                "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                            }
                          }}
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="!bg-[#3B82F6] text-white">
                            {destination.isTrending ? "Trending" : "Popular"}
                          </Badge>
                        </div>
                      </div>

                      <CardContent
                        className="!p-[22px]"
                        style={{
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        }}
                      >
                        <div
                          className="flex items-center text-slate-500 mb-2"
                          style={{ fontSize: "14px", lineHeight: "20px" }}
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          {destination.location}
                        </div>
                        <h3
                          className="text-slate-900 mb-2 truncate group-hover:!text-[#2563EB] transition-colors"
                          style={{
                            fontSize: "20px",
                            fontWeight: 700,
                            lineHeight: "28px",
                            fontFamily:
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                          }}
                        >
                          {destination.name}
                        </h3>
                        <div
                          className="flex items-center text-slate-500 mb-4"
                          style={{ fontSize: "14px", lineHeight: "20px" }}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          {destination.duration}
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[24px] font-bold text-[#0F172A]">
                              ₹
                              {destination.price?.toLocaleString() ||
                                "Contact Us"}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            className="hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
                            style={{
                              fontSize: "14px",
                              fontWeight: 500,
                              lineHeight: "20px",
                              height: "36px",
                              width: "144px",
                              padding: "8px 16px",
                            }}
                          >
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Link href={getCategoryPageUrl("Popular Destinations")}>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8">
              View All Destinations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewDestinationsGrid;
