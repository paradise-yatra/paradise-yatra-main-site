"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  Calendar,
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

interface Package {
  _id: string;
  title: string;
  duration: string;
  destination: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  shortDescription: string;
  slug: string;
  rating?: number;
}

//

const NewTrendingDestinations = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allPackages, setAllPackages] = useState<Package[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [activeScrollIndex, setActiveScrollIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Update mobile state based on screen size
  useEffect(() => {
    const updateMobileState = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateMobileState();
    window.addEventListener("resize", updateMobileState);
    return () => window.removeEventListener("resize", updateMobileState);
  }, []);

  // Handle scroll position for mobile indicators
  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current) return;

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth * 0.85; // 85vw
      const gap = 16; // 4 * 4px gap
      const adjustedCardWidth = cardWidth + gap;
      const newIndex = Math.round(scrollLeft / adjustedCardWidth);
      setActiveScrollIndex(
        Math.min(Math.max(0, newIndex), allPackages.length - 1)
      );
    };

    const container = scrollContainerRef.current;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isMobile, allPackages.length]);

  useEffect(() => {
    const fetchTrendingPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "/api/packages?category=Trending%20Destinations"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch trending packages");
        }

        const data = await response.json();

        // Ensure data is an array before calling slice
        if (Array.isArray(data)) {
          setAllPackages(data);
          setPackages(data.slice(0, 3)); // Show only first 3 packages initially
          setError(null);
        } else if (data.packages && Array.isArray(data.packages)) {
          setAllPackages(data.packages);
          setPackages(data.packages.slice(0, 3));
          setError(null);
        } else {
          console.error("Unexpected data structure:", data);
          setPackages([]);
          setAllPackages([]);
          setError("Invalid data format received");
        }
      } catch (err) {
        console.error("Error fetching trending packages:", err);
        setError("Failed to load trending packages");
        setPackages([]); // Don't show static data, show empty state
        setAllPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPackages();
  }, []);

  // Desktop pagination
  const totalGroups = Math.ceil(allPackages.length / 3);

  const handlePrevious = () => {
    if (isMobile) return;
    const newIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(newIndex);

    const startIndex = newIndex * 3;
    const endIndex = startIndex + 3;
    const newPackages = allPackages.slice(startIndex, endIndex);
    setPackages(newPackages);
  };

  const handleNext = () => {
    if (isMobile) return;
    const newIndex = Math.min(totalGroups - 1, currentIndex + 1);
    setCurrentIndex(newIndex);

    const startIndex = newIndex * 3;
    const endIndex = startIndex + 3;
    const newPackages = allPackages.slice(startIndex, endIndex);
    setPackages(newPackages);
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

  if (packages.length === 0) {
    return (
      <section className="section-padding bg-white px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <p className="text-gray-500">
            {error
              ? "Failed to load trending packages."
              : "No trending packages available."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <Badge className="mb-4 !bg-blue-100 !font-regular !text-blue-800 !rounded-md hover:bg-blue-100 !px-1 !py-1">
            Featured Tours
          </Badge>
          <h2
            className="text-slate-900 mb-4"
            style={{
              fontSize: "48px",
              fontWeight: 700,
              lineHeight: "48px",
            }}
          >
            Trending Packages
          </h2>
          <p className="text-[20px] text-slate-600 max-w-3xl mx-auto">
            Discover our most popular travel packages, carefully curated for
            unforgettable experiences
          </p>
        </div>

        {!isMobile && (
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`w-10 h-10 border rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                currentIndex === 0
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === totalGroups - 1}
              className={`w-10 h-10 border rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                currentIndex === totalGroups - 1
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {isMobile ? (
          <div className="md:hidden">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-0 pb-4 w-full scrollbar-hide"
              style={{
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {allPackages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="pl-4 flex-shrink-0 snap-start h-full basis-[80%] sm:basis-[85%]"
                  style={{ maxWidth: "85%" }}
                >
                  <Link
                    href={`/itinerary/${pkg.slug || pkg._id}`}
                    className="block w-full"
                  >
                    <Card className="overflow-hidden hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 border-0">
                      <div className="relative overflow-hidden">
                        <Image
                          src={
                            getImageUrl(pkg.images?.[0]) ||
                            "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                          }
                          alt={pkg.title}
                          width={800}
                          height={400}
                          className="w-full h-64 object-cover"
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              pkg.images?.[0]
                            );
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                        <div className="absolute top-4 left-4 mt-1">
                          <Badge className=" !bg-[#3B82F6] text-white">
                            {pkg.category === "trending"
                              ? "Trending"
                              : pkg.category.charAt(0).toUpperCase() +
                                pkg.category.slice(1)}
                          </Badge>
                        </div>
                        {typeof pkg.rating === "number" && (
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">
                                {pkg.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        )}
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
                          {pkg.destination}
                        </div>
                        <h3
                          className="text-slate-900 mb-2 truncate"
                          style={{
                            fontSize: "20px",
                            fontWeight: 700,
                            lineHeight: "28px",
                            fontFamily:
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                          }}
                        >
                          {pkg.title}
                        </h3>
                        <div className="flex items-center text-slate-500 text-sm mb-4">
                          <Calendar className="h-4 w-4 mr-1" />
                          {pkg.duration}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-[#0F172A]">
                              ₹{pkg.price.toLocaleString()}
                            </span>
                            {pkg.originalPrice && (
                              <span className="text- text-slate-500 line-through">
                                ₹{pkg.originalPrice.toLocaleString()}
                              </span>
                            )}
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

            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {allPackages.map((_, index) => (
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
          <div className="hidden md:block">
            <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div key={pkg._id} className="h-full flex flex-col">
                  <Link
                    href={`/itinerary/${pkg.slug || pkg._id}`}
                    className="block h-full"
                  >
                    <Card className="overflow-hidden border-[1px] border-[#E5E5E5] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 transform hover:-translate-y-1 group h-full">
                      <div className="relative overflow-hidden">
                        <Image
                          src={
                            getImageUrl(pkg.images?.[0]) ||
                            "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                          }
                          alt={pkg.title}
                          width={800}
                          height={400}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              pkg.images?.[0]
                            );
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes("unsplash.com")) {
                              target.src =
                                "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                            }
                          }}
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="!bg-blue-500 text-white rounded-md">
                            {pkg.category === "trending"
                              ? "Trending"
                              : pkg.category.charAt(0).toUpperCase() +
                                pkg.category.slice(1)}
                          </Badge>
                        </div>
                        {typeof pkg.rating === "number" && (
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">
                                {pkg.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <CardContent
                        className="p-6"
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
                          {pkg.destination}
                        </div>
                        <h3
                          className="text-slate-900 mb-2 group-hover:!text-[#2563EB] transition-colors truncate"
                          style={{
                            fontSize: "20px",
                            fontWeight: 700,
                            lineHeight: "28px",
                            fontFamily:
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                          }}
                        >
                          {pkg.title}
                        </h3>
                        <div className="flex items-center text-slate-500 text-sm mb-4">
                          <Calendar className="h-4 w-4 mr-1" />
                          {pkg.duration}
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[24px] font-bold text-[#0F172A]">
                              ₹{pkg.price.toLocaleString()}
                            </span>
                            {pkg.price && (
                              <span
                                className=" text-[#64748B] line-through"
                                style={{
                                  fontSize: "14px",
                                  lineHeight: "20px",
                                  fontFamily:
                                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                }}
                              >
                                ₹{Math.round(pkg.price * 1.2).toLocaleString()}
                              </span>
                            )}
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
          <Link href={getCategoryPageUrl("Trending Destinations")}>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8">
              View All Packages
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewTrendingDestinations;
