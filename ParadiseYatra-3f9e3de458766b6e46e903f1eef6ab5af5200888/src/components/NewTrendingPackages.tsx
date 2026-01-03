// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Star,
//   MapPin,
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   ArrowRight,
// } from "lucide-react";
// import { SkeletonPackageCard } from "@/components/ui/skeleton";
// import Skeleton from "@/components/ui/skeleton";
// import Link from "next/link";
// import Image from "next/image";
// import { getImageUrl } from "@/lib/utils";
// import { getCategoryPageUrl } from "@/lib/categoryUtils";

// interface Package {
//   _id: string;
//   title: string;
//   duration: string;
//   destination: string;
//   price: number;
//   originalPrice?: number;
//   images: string[];
//   category: string;
//   shortDescription: string;
//   slug: string;
//   rating?: number;
// }

// // Helper function to clean titles (removes dashes used as separators)
// const cleanTitle = (title: string): string => {
//   return title
//     .replace(/\s*[-–—]\s*/g, " ")
//     .replace(/\s+/g, " ")
//     .trim();
// };

// const NewTrendingDestinations = () => {
//   const [allPackages, setAllPackages] = useState<Package[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isMobile, setIsMobile] = useState(false);
//   const [activeScrollIndex, setActiveScrollIndex] = useState(0);
//   const scrollContainerRef = useRef<HTMLDivElement>(null);

//   // Update mobile state based on screen size
//   useEffect(() => {
//     const updateMobileState = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     updateMobileState();
//     window.addEventListener("resize", updateMobileState);
//     return () => window.removeEventListener("resize", updateMobileState);
//   }, []);

//   // Handle scroll position for mobile indicators
//   useEffect(() => {
//     if (!isMobile || !scrollContainerRef.current) return;

//     const handleScroll = () => {
//       const container = scrollContainerRef.current;
//       if (!container) return;

//       const scrollLeft = container.scrollLeft;
//       const cardWidth = container.offsetWidth * 0.85;
//       const gap = 16;
//       const adjustedCardWidth = cardWidth + gap;
//       const newIndex = Math.round(scrollLeft / adjustedCardWidth);
//       setActiveScrollIndex(
//         Math.min(Math.max(0, newIndex), allPackages.length - 1)
//       );
//     };

//     const container = scrollContainerRef.current;
//     container.addEventListener("scroll", handleScroll);
//     return () => container.removeEventListener("scroll", handleScroll);
//   }, [isMobile, allPackages.length]);

//   useEffect(() => {
//     const fetchTrendingPackages = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           "/api/packages?category=Trending%20Destinations"
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch trending packages");
//         }

//         const data = await response.json();

//         if (Array.isArray(data)) {
//           setAllPackages(data);
//           setError(null);
//         } else if (data.packages && Array.isArray(data.packages)) {
//           setAllPackages(data.packages);
//           setError(null);
//         } else {
//           console.error("Unexpected data structure:", data);
//           setAllPackages([]);
//           setError("Invalid data format received");
//         }
//       } catch (err) {
//         console.error("Error fetching trending packages:", err);
//         setError("Failed to load trending packages");
//         setAllPackages([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTrendingPackages();
//   }, []);

//   useEffect(() => {
//     if (!loading && allPackages.length > 0) {
//       console.table(
//         allPackages.map((p) => ({
//           _id: p._id.substring(0, 8) + "...",
//           title: p.title.substring(0, 40) + (p.title.length > 40 ? "..." : ""),
//           duration: p.duration,
//           dest: p.destination,
//           price: "₹" + p.price.toLocaleString(),
//           orig: p.originalPrice ? "₹" + p.originalPrice.toLocaleString() : "",
//           rating: p.rating ?? "",
//           slug: p.slug,
//         }))
//       );
//     }
//   }, [allPackages, loading]);

//   // Get visible packages for desktop (3 cards at a time, shifting by 1)
//   const getVisiblePackages = () => {
//     return allPackages.slice(currentIndex, currentIndex + 3);
//   };

//   const handlePrevious = () => {
//     if (isMobile) return;
//     setCurrentIndex((prev) => Math.max(0, prev - 1));
//   };

//   const handleNext = () => {
//     if (isMobile) return;
//     // Maximum index is length - 3 to always show 3 cards
//     setCurrentIndex((prev) => Math.min(allPackages.length - 3, prev + 1));
//   };

//   const formatDuration = (duration: string) => {
//     if (!duration) return "Contact for details";

//     const match = duration.match(/^(\d+)N\/(\d+)D$/i);
//     if (match) {
//       const nights = parseInt(match[1]);
//       const days = parseInt(match[2]);
//       return `${days} Days, ${nights} Nights`;
//     }

//     return duration;
//   };

//   if (loading) {
//     return (
//       <section className="section-padding bg-white px-4 sm:px-6">
//         <div className="container mx-auto">
//           <div className="text-center mb-8">
//             <Skeleton height="2.5rem" width="300px" className="mx-auto mb-4" />
//             <Skeleton height="1.25rem" width="200px" className="mx-auto" />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {Array.from({ length: 3 }).map((_, index) => (
//               <SkeletonPackageCard key={index} />
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (allPackages.length === 0) {
//     return (
//       <section className="section-padding bg-white px-4 sm:px-6">
//         <div className="container mx-auto text-center">
//           <p className="text-gray-500">
//             {error
//               ? "Failed to load trending packages."
//               : "No trending packages available."}
//           </p>
//         </div>
//       </section>
//     );
//   }

//   const visiblePackages = getVisiblePackages();
//   const canGoPrevious = currentIndex > 0;
//   const canGoNext = currentIndex < allPackages.length - 3;

//   return (
//     <section className="py-20 bg-slate-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-4">
//           <Badge className="mb-4 !bg-blue-100 !text-blue-800 hover:bg-blue-100">
//             Featured Tours
//           </Badge>
//           <h2
//             className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
//             style={{
//               fontSize: "36px",
//               fontWeight: 700,
//               lineHeight: "40px",
//             }}
//           >
//             Trending Packages
//           </h2>
//           <p className="text-xl !text-slate-600 !max-w-3xl mx-auto">
//             Discover our most popular travel packages, carefully curated for
//             unforgettable experiences
//           </p>
//         </div>

//         {!isMobile && (
//           <div className="flex justify-between items-center mb-8">
//             <button
//               onClick={handlePrevious}
//               disabled={!canGoPrevious}
//               className={`w-10 h-10 border rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
//                 !canGoPrevious
//                   ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
//                   : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
//               }`}
//             >
//               <ChevronLeft className="w-5 h-5" />
//             </button>

//             <button
//               onClick={handleNext}
//               disabled={!canGoNext}
//               className={`w-10 h-10 border rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
//                 !canGoNext
//                   ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
//                   : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
//               }`}
//             >
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//         )}

//         {isMobile ? (
//           <div className="md:hidden">
//             <div
//               ref={scrollContainerRef}
//               className="flex overflow-x-auto gap-0 pb-4 w-full scrollbar-hide"
//               style={{
//                 scrollSnapType: "x mandatory",
//                 scrollBehavior: "smooth",
//                 WebkitOverflowScrolling: "touch",
//                 msOverflowStyle: "none",
//                 scrollbarWidth: "none",
//               }}
//             >
//               {allPackages.map((pkg) => (
//                 <div
//                   key={pkg._id}
//                   className="pl-4 flex-shrink-0 snap-start h-full basis-[80%] sm:basis-[85%]"
//                   style={{ maxWidth: "85%" }}
//                 >
//                   <Link
//                     href={`/itinerary/${pkg.slug || pkg._id}`}
//                     className="block w-full"
//                   >
//                     <Card className="overflow-hidden hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 border-0">
//                       <div className="relative overflow-hidden">
//                         <Image
//                           src={
//                             getImageUrl(pkg.images?.[0]) ||
//                             "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
//                           }
//                           alt={pkg.title}
//                           width={800}
//                           height={400}
//                           className="w-full h-64 object-cover"
//                           onError={(e) => {
//                             console.error(
//                               "Image failed to load:",
//                               pkg.images?.[0]
//                             );
//                             const target = e.target as HTMLImageElement;
//                             target.src =
//                               "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
//                           }}
//                         />
//                         {typeof pkg.rating === "number" && (
//                           <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
//                             <div className="flex items-center space-x-1">
//                               <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                               <span className="text-sm font-medium">
//                                 {pkg.rating.toFixed(1)}
//                               </span>
//                             </div>
//                           </div>
//                         )}
//                       </div>

//                       <CardContent
//                         className="!p-[22px]"
//                         style={{
//                           fontFamily:
//                             '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
//                         }}
//                       >
//                         <div
//                           className="flex items-center text-slate-500 mb-2"
//                           style={{ fontSize: "14px", lineHeight: "20px" }}
//                         >
//                           <MapPin className="h-4 w-4 mr-1" />
//                           {pkg.destination}
//                         </div>
//                         <h3
//                           className="text-slate-900 mb-2 truncate"
//                           style={{
//                             fontSize: "20px",
//                             fontWeight: 700,
//                             lineHeight: "28px",
//                             fontFamily:
//                               '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
//                           }}
//                         >
//                           {cleanTitle(pkg.title)}
//                         </h3>
//                         <div className="flex items-center text-slate-500 text-sm mb-4">
//                           <Calendar className="h-4 w-4 mr-1" />
//                           {formatDuration(pkg.duration)}
//                         </div>

//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center space-x-2">
//                             <span className="text-2xl font-bold text-slate-900">
//                               ₹{pkg.price.toLocaleString()}
//                             </span>
//                             {pkg.originalPrice && (
//                               <span className="text-sm text-slate-500 line-through">
//                                 ₹{pkg.originalPrice.toLocaleString()}
//                               </span>
//                             )}
//                           </div>
//                           <Button
//                             variant="outline"
//                             className="hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
//                             style={{
//                               fontSize: "14px",
//                               fontWeight: 500,
//                               lineHeight: "20px",
//                               height: "36px",
//                               width: "144px",
//                               padding: "8px 16px",
//                             }}
//                           >
//                             View Details
//                             <ArrowRight className="ml-2 h-4 w-4" />
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </Link>
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-center mt-4">
//               <div className="flex space-x-2">
//                 {allPackages.map((_, index) => (
//                   <div
//                     key={index}
//                     className={`h-2 rounded-full transition-all duration-300 ease-in-out ${
//                       index === activeScrollIndex
//                         ? "bg-blue-600 w-8"
//                         : "bg-gray-300 w-2 hover:bg-gray-400"
//                     }`}
//                   />
//                 ))}
//               </div>
//               <div className="ml-4 text-xs text-gray-500 flex items-center">
//                 <span>Swipe to explore more</span>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="hidden md:block">
//             <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500">
//               {visiblePackages.map((pkg) => (
//                 <div key={pkg._id} className="h-full flex flex-col">
//                   <Link
//                     href={`/itinerary/${pkg.slug || pkg._id}`}
//                     className="block h-full"
//                   >
//                     <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
//                       <div className="relative overflow-hidden">
//                         <Image
//                           src={
//                             getImageUrl(pkg.images?.[0]) ||
//                             "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
//                           }
//                           alt={pkg.title}
//                           width={800}
//                           height={400}
//                           className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
//                           onError={(e) => {
//                             console.error(
//                               "Image failed to load:",
//                               pkg.images?.[0]
//                             );
//                             const target = e.target as HTMLImageElement;
//                             if (!target.src.includes("unsplash.com")) {
//                               target.src =
//                                 "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
//                             }
//                           }}
//                         />
//                         {typeof pkg.rating === "number" && (
//                           <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
//                             <div className="flex items-center space-x-1">
//                               <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                               <span className="text-sm font-medium">
//                                 {pkg.rating.toFixed(1)}
//                               </span>
//                             </div>
//                           </div>
//                         )}
//                       </div>

//                       <CardContent
//                         className="p-6"
//                         style={{
//                           fontFamily:
//                             '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
//                         }}
//                       >
//                         <div
//                           className="flex items-center text-slate-500 text-sm mb-2"
//                           style={{ fontSize: "14px", lineHeight: "20px" }}
//                         >
//                           <MapPin className="h-4 w-4 mr-1" />
//                           {pkg.destination}
//                         </div>
//                         <h3
//                           className="text-slate-900 mb-2 group-hover:!text-[#2563EB] transition-colors truncate"
//                           style={{
//                             fontSize: "20px",
//                             fontWeight: 700,
//                             lineHeight: "28px",
//                             fontFamily:
//                               '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
//                           }}
//                         >
//                           {cleanTitle(pkg.title)}
//                         </h3>
//                         <div className="flex items-center text-slate-500 text-sm mb-4">
//                           <Calendar className="h-4 w-4 mr-1" />
//                           {formatDuration(pkg.duration)}
//                         </div>

//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center space-x-2">
//                             <span className="text-2xl font-bold text-slate-900">
//                               ₹{pkg.price.toLocaleString()}
//                             </span>
//                             {pkg.price && (
//                               <span
//                                 className=" text-[#64748B] line-through"
//                                 style={{
//                                   fontSize: "14px",
//                                   lineHeight: "20px",
//                                   fontFamily:
//                                     '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
//                                 }}
//                               >
//                                 ₹{Math.round(pkg.price * 1.2).toLocaleString()}
//                               </span>
//                             )}
//                           </div>
//                           <Button
//                             variant="outline"
//                             className="hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
//                             style={{
//                               fontSize: "14px",
//                               fontWeight: 500,
//                               lineHeight: "20px",
//                               height: "36px",
//                               width: "144px",
//                               padding: "8px 16px",
//                             }}
//                           >
//                             View Details
//                             <ArrowRight className="ml-2 h-4 w-4" />
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="text-center mt-12">
//           <Link href={getCategoryPageUrl("Trending Destinations")}>
//             <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8">
//               View All Packages
//               <ArrowRight className="ml-2 h-4 w-4" />
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewTrendingDestinations;


// "use client"

// import { useState, useEffect, useRef } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Star,
//   MapPin,
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   ArrowRight,
// } from "lucide-react";
// import { SkeletonPackageCard } from "@/components/ui/skeleton";
// import Skeleton from "@/components/ui/skeleton";
// import Link from "next/link";
// import Image from "next/image";
// import { getImageUrl } from "@/lib/utils";
// import { getCategoryPageUrl } from "@/lib/categoryUtils";

// interface Package {
//   _id: string;
//   title: string;
//   duration: string;
//   destination: string;
//   price: number;
//   originalPrice?: number;
//   images: string[];
//   category: string;
//   shortDescription: string;
//   slug: string;
//   rating?: number;
// }

// const cleanTitle = (title: string): string => {
//   return title
//     .replace(/\s*[-–—]\s*/g, " ")
//     .replace(/\s+/g, " ")
//     .trim();
// };

// const NewTrendingDestinations = () => {
//   const [allPackages, setAllPackages] = useState<Package[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isMobile, setIsMobile] = useState(false);
//   const [activeScrollIndex, setActiveScrollIndex] = useState(0);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const touchStartX = useRef<number>(0);
//   const touchEndX = useRef<number>(0);

//   // Common fallback image
//   const FALLBACK_IMAGE =
//     "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

//   // Tiny blur placeholder (improves perceived performance)
//   const BLUR_PLACEHOLDER =
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

//   useEffect(() => {
//     const updateMobileState = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     updateMobileState();
//     window.addEventListener("resize", updateMobileState);
//     return () => window.removeEventListener("resize", updateMobileState);
//   }, []);

//   useEffect(() => {
//     if (!isMobile || !scrollContainerRef.current) return;

//     let scrollTimeout: NodeJS.Timeout;

//     const handleScroll = () => {
//       const container = scrollContainerRef.current;
//       if (!container) return;

//       clearTimeout(scrollTimeout);

//       scrollTimeout = setTimeout(() => {
//         const scrollLeft = container.scrollLeft;
//         const containerWidth = container.offsetWidth;
//         const cardWidth = containerWidth * 0.85;
//         const gap = 16;
//         const newIndex = Math.round(scrollLeft / (cardWidth + gap));
//         setActiveScrollIndex(
//           Math.min(Math.max(0, newIndex), allPackages.length - 1)
//         );
//       }, 50);
//     };


//     const container = scrollContainerRef.current;
//     container.addEventListener("scroll", handleScroll, { passive: true });
//     return () => {
//       container.removeEventListener("scroll", handleScroll);
//       clearTimeout(scrollTimeout);
//     };
//   }, [isMobile, allPackages.length]);

//   const handleTouchStart = (e: React.TouchEvent) => {
//     touchStartX.current = e.touches[0].clientX;
//   };

//   const handleTouchMove = (e: React.TouchEvent) => {
//     touchEndX.current = e.touches[0].clientX;
//   };

//   const handleTouchEnd = () => {
//     if (!scrollContainerRef.current) return;

//     const swipeDistance = touchStartX.current - touchEndX.current;
//     const minSwipeDistance = 50;

//     if (Math.abs(swipeDistance) > minSwipeDistance) {
//       if (swipeDistance > 0 && activeScrollIndex < allPackages.length - 1) {
//         scrollToIndex(activeScrollIndex + 1);
//       } else if (swipeDistance < 0 && activeScrollIndex > 0) {
//         scrollToIndex(activeScrollIndex - 1);
//       }
//     }
//   };


//   const scrollToIndex = (index: number) => {
//     if (!scrollContainerRef.current) return;

//     const container = scrollContainerRef.current;
//     const containerWidth = container.offsetWidth;
//     const cardWidth = containerWidth * 0.85;
//     const gap = 16;
//     const targetScroll = index * (cardWidth + gap);

//     container.scrollTo({
//       left: targetScroll,
//       behavior: "smooth",
//     });

//     setActiveScrollIndex(index);
//   };

//   useEffect(() => {
//     const fetchTrendingPackages = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("/api/packages?category=Trending%20Destinations");

//         if (!response.ok) {
//           throw new Error("Failed to fetch trending packages");
//         }

//         const data = await response.json();

//         // --- CONSOLE LOG START ---
//         console.log("--- Trending Destinations Data ---");
//         console.log("Raw API Response:", data);

//         const packagesToSet = Array.isArray(data) ? data : (data.packages || []);

//         if (packagesToSet.length > 0) {
//           console.log("First Package Sample:", {
//             ...packagesToSet[0],
//             _computedTitle: cleanTitle(packagesToSet[0].title),
//             _computedDuration: formatDuration(packagesToSet[0].duration)
//           });
//         }
//         // --- CONSOLE LOG END ---

//         setAllPackages(packagesToSet);

//         if (!Array.isArray(data) && !data.packages) {
//           setError("Invalid data format received");
//         }
//       } catch (err) {
//         console.error("Error fetching trending packages:", err);
//         setError("Failed to load trending packages");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTrendingPackages();
//   }, []);

//   // useEffect(() => {
//   //   const fetchTrendingPackages = async () => {
//   //     try {
//   //       setLoading(true);
//   //       // const response = await fetch("/api/packages?category=Trending%20Destinations");
//   //       const response = await fetch("/api/packages?category=Popular%20Packages");

//   //       if (!response.ok) {
//   //         throw new Error("Failed to fetch trending packages");
//   //       }

//   //       const data = await response.json();

//   //       if (Array.isArray(data)) {
//   //         setAllPackages(data);
//   //       } else if (data.packages && Array.isArray(data.packages)) {
//   //         setAllPackages(data.packages);
//   //       } else {
//   //         console.error("Unexpected data structure:", data);
//   //         setAllPackages([]);
//   //         setError("Invalid data format received");
//   //       }
//   //     } catch (err) {
//   //       console.error("Error fetching trending packages:", err);
//   //       setError("Failed to load trending packages");
//   //       setAllPackages([]);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchTrendingPackages();
//   // }, []);




//   const getVisiblePackages = () => {
//     return allPackages.slice(currentIndex, currentIndex + 3);
//   };

//   const handlePrevious = () => {
//     if (isMobile || isTransitioning) return;
//     if (currentIndex > 0) {
//       setIsTransitioning(true);
//       setCurrentIndex((prev) => prev - 1);
//       setTimeout(() => setIsTransitioning(false), 500);
//     }
//   };

//   const handleNext = () => {
//     if (isMobile || isTransitioning) return;
//     if (currentIndex < allPackages.length - 3) {
//       setIsTransitioning(true);
//       setCurrentIndex((prev) => prev + 1);
//       setTimeout(() => setIsTransitioning(false), 500);
//     }
//   };

//   const formatDuration = (duration: string) => {
//     if (!duration) return "Contact for details";

//     const match = duration.match(/^(\d+)N\/(\d+)D$/i);
//     if (match) {
//       const nights = parseInt(match[1]);
//       const days = parseInt(match[2]);
//       return `${days} Days, ${nights} Nights`;
//     }

//     return duration;
//   };

//   if (loading) {
//     return (
//       <section className="section-padding bg-white px-4 sm:px-6">
//         <div className="container mx-auto">
//           <div className="text-center mb-8">
//             <Skeleton height="2.5rem" width="300px" className="mx-auto mb-4" />
//             <Skeleton height="1.25rem" width="200px" className="mx-auto" />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {Array.from({ length: 3 }).map((_, index) => (
//               <SkeletonPackageCard key={index} />
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (allPackages.length === 0) {
//     return (
//       <section className="section-padding bg-white px-4 sm:px-6">
//         <div className="container mx-auto text-center">
//           <p className="text-gray-500">
//             {error ? "Failed to load trending packages." : "No trending packages available."}
//           </p>
//         </div>
//       </section>
//     );
//   }

//   const visiblePackages = getVisiblePackages();
//   const canGoPrevious = currentIndex > 0;
//   const canGoNext = currentIndex < allPackages.length - 3;



//   return (
//     <section className="py-20 bg-slate-50">
//       {/* Your global styles remain unchanged */}
//       <style jsx global>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .card-enter {
//           animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
//         }

//         .card-enter:nth-child(1) { animation-delay: 0.1s; }
//         .card-enter:nth-child(2) { animation-delay: 0.2s; }
//         .card-enter:nth-child(3) { animation-delay: 0.3s; }

//         .mobile-scroll-container {
//           scroll-snap-type: x mandatory;
//           scroll-padding: 0 7.5%;
//           -webkit-overflow-scrolling: touch;
//           scrollbar-width: none;
//           -ms-overflow-style: none;
//           padding: 0 7.5%;
//         }

//         .mobile-scroll-container::-webkit-scrollbar { display: none; }

//         .mobile-scroll-item {
//           scroll-snap-align: center;
//           scroll-snap-stop: always;
//           transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
//                       opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//         }

//         .desktop-card {
//           transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
//         }

//         .desktop-card:hover { transform: translateY(-8px); }

//         .image-container { overflow: hidden; }

//         .image-container img {
//           transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
//         }

//         .desktop-card:hover .image-container img { transform: scale(1.1); }

//         .animated-button {
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           position: relative;
//           overflow: hidden;
//         }

//         .animated-button::before {
//           content: '';
//           position: absolute;
//           top: 50%;
//           left: 50%;
//           width: 0;
//           height: 0;
//           border-radius: 50%;
//           background: rgba(37, 99, 235, 0.1);
//           transform: translate(-50%, -50%);
//           transition: width 0.6s, height 0.6s;
//         }

//         .animated-button:hover::before {
//           width: 300px;
//           height: 300px;
//         }

//         .dot-indicator {
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//         }

//         .dot-indicator:hover { transform: scale(1.2); }

//         .mobile-card {
//           transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
//                       opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//         }
//       `}</style>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-4">
//           <Badge className="mb-4 !bg-blue-100 !text-blue-800 hover:bg-blue-100 transition-all duration-300">
//             Featured Tours
//           </Badge>
//           <h2
//             className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
//             style={{ fontSize: "36px", fontWeight: 700, lineHeight: "40px" }}
//           >
//             Trending Packages
//           </h2>
//           <p className="text-xl !text-slate-600 !max-w-3xl mx-auto">
//             Discover our most popular travel packages, carefully curated for unforgettable experiences
//           </p>
//         </div>

//         {!isMobile && (
//           <div className="flex justify-between items-center mb-8">
//             <button
//               onClick={handlePrevious}
//               disabled={!canGoPrevious || isTransitioning}
//               className={`w-12 h-12 border-2 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
//                 !canGoPrevious || isTransitioning
//                   ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
//                   : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:shadow-xl hover:scale-110"
//               }`}
//             >
//               <ChevronLeft className="w-6 h-6" />
//             </button>

//             <button
//               onClick={handleNext}
//               disabled={!canGoNext || isTransitioning}
//               className={`w-12 h-12 border-2 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
//                 !canGoNext || isTransitioning
//                   ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
//                   : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:shadow-xl hover:scale-110"
//               }`}
//             >
//               <ChevronRight className="w-6 h-6" />
//             </button>
//           </div>
//         )}

//         {isMobile ? (
//           <div className="md:hidden -mx-4 sm:-mx-6">
//             <div
//               ref={scrollContainerRef}
//               onTouchStart={handleTouchStart}
//               onTouchMove={handleTouchMove}
//               onTouchEnd={handleTouchEnd}
//               className="mobile-scroll-container flex overflow-x-auto gap-4 pb-4"
//             >
//               {allPackages.map((pkg) => (
//                 <div
//                   key={pkg._id}
//                   className="mobile-scroll-item mobile-card flex-shrink-0 h-full"
//                   style={{ width: "85%" }}
//                 >
//                   <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full border-0">
//                     <div className="relative overflow-hidden image-container">
//                       <Image
//                         src={getImageUrl(pkg.images[0]) || FALLBACK_IMAGE}
//                         alt={pkg.title}
//                         width={800}
//                         height={400}
//                         className="w-full h-64 object-cover"
//                         placeholder="blur"
//                         blurDataURL={BLUR_PLACEHOLDER}
//                       />
//                       {typeof pkg.rating === "number" && (
//                         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 transition-all duration-300 hover:scale-105">
//                           <div className="flex items-center space-x-1">
//                             <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                             <span className="text-sm font-medium">{pkg.rating.toFixed(1)}</span>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     <CardContent className="!p-[22px]">
//                       {/* ... rest of card content remains unchanged ... */}
//                       <div className="flex items-center text-slate-500 mb-2" style={{ fontSize: "14px", lineHeight: "20px" }}>
//                         <MapPin className="h-4 w-4 mr-1" />
//                         {pkg.destination}
//                       </div>
//                       <h3 className="text-slate-900 mb-2 truncate" style={{ fontSize: "20px", fontWeight: 700, lineHeight: "28px" }}>
//                         {cleanTitle(pkg.title)}
//                       </h3>
//                       <div className="flex items-center text-slate-500 text-sm mb-4">
//                         <Calendar className="h-4 w-4 mr-1" />
//                         {formatDuration(pkg.duration)}
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                           <span className="text-2xl font-bold text-slate-900">
//                             ₹{pkg.price.toLocaleString()}
//                           </span>
//                           {pkg.originalPrice && (
//                             <span className="text-sm text-slate-500 line-through">
//                               ₹{pkg.originalPrice.toLocaleString()}
//                             </span>
//                           )}
//                         </div>
//                         <Link href={`/itinerary/${pkg.slug || pkg._id}`}>
//                           <Button
//                             variant="outline"
//                             className="animated-button hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
//                             style={{
//                               fontSize: "14px",
//                               fontWeight: 500,
//                               lineHeight: "20px",
//                               height: "36px",
//                               width: "144px",
//                               padding: "8px 16px",
//                             }}
//                           >
//                             <span className="relative z-10">View Details</span>
//                             <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
//                           </Button>
//                         </Link>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               ))}
//             </div>

//             <div className="flex flex-col items-center mt-6 gap-3">
//               <div className="flex space-x-2">
//                 {allPackages.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => scrollToIndex(index)}
//                     className={`dot-indicator h-2 rounded-full transition-all duration-300 ${
//                       index === activeScrollIndex ? "bg-blue-600 w-8" : "bg-gray-300 w-2"
//                     }`}
//                     aria-label={`Go to slide ${index + 1}`}
//                   />
//                 ))}
//               </div>
//               <div className="text-sm text-gray-500 animate-pulse">Swipe to explore more</div>
//             </div>
//           </div>
//         ) : (
//           <div className="hidden md:block">
//             <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {visiblePackages.map((pkg) => (
//                 <div
//                   key={pkg._id}
//                   className="h-full flex flex-col card-enter"
//                   style={{ opacity: 0 }}
//                 >
//                   <Card className="overflow-hidden hover:shadow-2xl group h-full desktop-card">
//                     <div className="relative overflow-hidden image-container">
//                       <Image
//                         src={getImageUrl(pkg.images[0]) || FALLBACK_IMAGE}
//                         alt={pkg.title}
//                         width={800}
//                         height={400}
//                         className="w-full h-64 object-cover"
//                         placeholder="blur"
//                         blurDataURL={BLUR_PLACEHOLDER}
//                       />
//                       {typeof pkg.rating === "number" && (
//                         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 transition-all duration-300 hover:scale-105">
//                           <div className="flex items-center space-x-1">
//                             <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                             <span className="text-sm font-medium">{pkg.rating.toFixed(1)}</span>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     <CardContent className="p-6">
//                       {/* ... rest of card content remains unchanged ... */}
//                       <div className="flex items-center text-slate-500 text-sm mb-2" style={{ fontSize: "14px", lineHeight: "20px" }}>
//                         <MapPin className="h-4 w-4 mr-1" />
//                         {pkg.destination}
//                       </div>
//                       <h3
//                         className="text-slate-900 mb-2 group-hover:!text-[#2563EB] truncate transition-colors duration-300"
//                         style={{ fontSize: "20px", fontWeight: 700, lineHeight: "28px" }}
//                       >
//                         {cleanTitle(pkg.title)}
//                       </h3>
//                       <div className="flex items-center text-slate-500 text-sm mb-4">
//                         <Calendar className="h-4 w-4 mr-1" />
//                         {formatDuration(pkg.duration)}
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                           <span className="text-2xl font-bold text-slate-900">
//                             ₹{pkg.price.toLocaleString()}
//                           </span>
//                           {pkg.originalPrice && (
//                             <span
//                               className="text-[#64748B] line-through"
//                               style={{ fontSize: "14px", lineHeight: "20px" }}
//                             >
//                               ₹{Math.round(pkg.price * 1.2).toLocaleString()}
//                             </span>
//                           )}
//                         </div>
//                         <Link href={`/itinerary/${pkg.slug || pkg._id}`}>
//                           <Button
//                             variant="outline"
//                             className="animated-button hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
//                             style={{
//                               fontSize: "14px",
//                               fontWeight: 500,
//                               lineHeight: "20px",
//                               height: "36px",
//                               width: "144px",
//                               padding: "8px 16px",
//                             }}
//                           >
//                             <span className="relative z-10">View Details</span>
//                             <ArrowRight className="ml-2 h-4 w-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
//                           </Button>
//                         </Link>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-center mt-8">
//               <div className="flex space-x-2">
//                 {Array.from({ length: allPackages.length - 2 }).map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => {
//                       if (!isTransitioning) {
//                         setIsTransitioning(true);
//                         setCurrentIndex(index);
//                         setTimeout(() => setIsTransitioning(false), 500);
//                       }
//                     }}
//                     className={`dot-indicator h-2 rounded-full transition-all duration-300 ${
//                       index === currentIndex ? "bg-blue-600 w-8" : "bg-gray-300 w-2 hover:bg-gray-400"
//                     }`}
//                     aria-label={`Go to slide ${index + 1}`}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="text-center mt-12">
//           <Link href={getCategoryPageUrl("Trending Destinations")}>
//             <Button className="animated-button bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg">
//               <span className="relative z-10">View All Packages</span>
//               <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewTrendingDestinations;


"use client"

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

const cleanTitle = (title: string): string => {
  return title
    .replace(/\s*[-–—]\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const NewTrendingDestinations = () => {
  const [allPackages, setAllPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeScrollIndex, setActiveScrollIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  const BLUR_PLACEHOLDER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  useEffect(() => {
    const updateMobileState = () => setIsMobile(window.innerWidth < 768);
    updateMobileState();
    window.addEventListener("resize", updateMobileState);
    return () => window.removeEventListener("resize", updateMobileState);
  }, []);

  useEffect(() => {
    const fetchTrendingPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/packages?category=Trending%20Destinations&limit=10");
        if (!response.ok) throw new Error("Failed to fetch trending packages");
        const data = await response.json();
        let packagesToSet = Array.isArray(data) ? data : (data.packages || []);
        setAllPackages(packagesToSet);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingPackages();
  }, []);

  const handlePrevious = () => {
    if (isMobile || isTransitioning || currentIndex === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleNext = () => {
    if (isMobile || isTransitioning || currentIndex >= allPackages.length - 3) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const formatDuration = (duration: string) => {
    if (!duration) return "Contact for details";
    const match = duration.match(/^(\d+)N\/(\d+)D$/i);
    if (match) return `${match[2]} Days, ${match[1]} Nights`;
    return duration;
  };

  if (loading) {
    return (
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonPackageCard key={i} />)}
        </div>
      </section>
    );
  }

  const visiblePackages = allPackages.slice(currentIndex, currentIndex + 3);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < allPackages.length - 3;

  return (
    <section className="py-20 bg-slate-50">
      <style jsx global>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .card-enter { animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .mobile-scroll-container {
          scroll-snap-type: x mandatory;
          display: flex;
          overflow-x: auto;
          gap: 1rem;
          padding: 0 7.5% 1.5rem;
          scrollbar-width: none;
        }
        .mobile-scroll-container::-webkit-scrollbar { display: none; }
        .mobile-scroll-item { scroll-snap-align: center; flex-shrink: 0; width: 85%; }
        .theme-btn:focus-visible { outline: 2px solid #2563eb !important; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge className="mb-4 !bg-blue-100 !text-blue-800">Featured Tours</Badge>
          <h2 className="!text-4xl md:!text-5xl !font-bold text-slate-900 mb-4">Trending Packages</h2>
          <p className="!text-xl !text-slate-600 max-w-3xl mx-auto">Discover our most popular travel packages, carefully curated for unforgettable experiences</p>
        </div>

        {!isMobile && (
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious || isTransitioning}
              className={`w-12 h-12 border-2 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer ${!canGoPrevious ? "bg-gray-100 border-gray-200 text-gray-400" : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:scale-110"
                }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              disabled={!canGoNext || isTransitioning}
              className={`w-12 h-12 border-2 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer ${!canGoNext ? "bg-gray-100 border-gray-200 text-gray-400" : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:shadow-xl hover:scale-110"
                }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {isMobile ? (
          <div className="md:hidden -mx-4">
            <div className="mobile-scroll-container">
              {allPackages.map((pkg) => (
                <div key={pkg._id} className="mobile-scroll-item">
                  <Card className="overflow-hidden border-0 shadow-md h-full bg-white">
                    <div className="relative w-full h-48">
                      <Image
                        src={getImageUrl(pkg.images[0]) || FALLBACK_IMAGE}
                        alt={pkg.title}
                        fill
                        className="object-cover"
                      />

                      {pkg.rating && (
                        <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-bold">{pkg.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center text-slate-500 text-xs mb-1">
                        <MapPin className="h-3.5 w-3.5 mr-1" /> {pkg.destination}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1 truncate">{cleanTitle(pkg.title)}</h3>
                      <div className="flex items-center text-slate-500 text-xs mb-4">
                        <Calendar className="h-3.5 w-3.5 mr-1" /> {formatDuration(pkg.duration)}
                      </div>

                      {/* MOBILE BOTTOM STACKED LAYOUT */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-slate-900">₹{pkg.price.toLocaleString()}</span>
                          {pkg.originalPrice && <span className="text-sm text-slate-400 line-through">₹{pkg.originalPrice.toLocaleString()}</span>}
                        </div>
                        <Link href={`/itinerary/${pkg.slug || pkg._id}`} className="w-full">
                          <Button variant="outline" className="w-full border-blue-600 text-blue-600 h-12 font-semibold hover:bg-blue-50  cursor-pointer">
                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visiblePackages.map((pkg) => (
              <div key={pkg._id} className="card-enter opacity-0">
                <Card className="overflow-hidden border-0 shadow-lg group h-full bg-white">
                  <div className="relative h-64 overflow-hidden">
                    <Image src={getImageUrl(pkg.images[0]) || FALLBACK_IMAGE} alt={pkg.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    {pkg.rating && (
                      <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold">{pkg.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center text-slate-500 text-sm mb-2"><MapPin className="h-4 w-4 mr-1" /> {pkg.destination}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{cleanTitle(pkg.title)}</h3>
                    <div className="flex items-center text-slate-500 text-sm mb-4"><Calendar className="h-4 w-4 mr-1" /> {formatDuration(pkg.duration)}</div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-slate-900">₹{pkg.price.toLocaleString()}</span>
                        {pkg.originalPrice && <span className="text-xs text-slate-400 line-through">₹{pkg.originalPrice.toLocaleString()}</span>}
                      </div>
                      <Link href={`/itinerary/${pkg.slug || pkg._id}`}>
                        <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-100 hover:text-black cursor-pointer font-semibold px-6">
                          View Details <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href={getCategoryPageUrl("Trending Destinations")}>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 rounded-xl hover:scale-105 transition-all shadow-lg">
              View All Packages <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewTrendingDestinations;