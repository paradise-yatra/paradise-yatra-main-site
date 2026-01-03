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
// import Link from "next/link";
// import { SkeletonPackageCard } from "@/components/ui/skeleton";
// import Skeleton from "@/components/ui/skeleton";
// import Image from "next/image";
// import { getImageUrl } from "@/lib/utils";
// import { getCategoryPageUrl } from "@/lib/categoryUtils";

// interface AdventurePackage {
//   _id: string;
//   title: string;
//   duration: string;
//   destination: string;
//   price: number;
//   originalPrice?: number;
//   images: string[];
//   category: string;
//   description: string;
//   shortDescription: string;
//   highlights: string[];
//   isActive: boolean;
//   isFeatured: boolean;
//   slug: string;
//   rating?: number;
// }

// const NewAdventureEscapes = () => {
//   const [adventurePackages, setAdventurePackages] = useState<
//     AdventurePackage[]
//   >([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [allPackages, setAllPackages] = useState<AdventurePackage[]>([]);
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
//       const cardWidth = container.offsetWidth * 0.85; // 85vw
//       const gap = 16; // 4 * 4px gap
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
//     const fetchAdventurePackages = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           "/api/packages?category=Adventure%20Tours"
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch adventure packages");
//         }

//         const data = await response.json();

//         // Handle both direct array and object with packages array
//         if (Array.isArray(data)) {
//           setAllPackages(data);
//           setAdventurePackages(data.slice(0, 3)); // Show only first 3 packages initially
//           setError(null);
//         } else if (data.packages && Array.isArray(data.packages)) {
//           setAllPackages(data.packages);
//           setAdventurePackages(data.packages.slice(0, 3));
//           setError(null);
//         } else {
//           console.error("Unexpected data structure:", data);
//           setAdventurePackages([]);
//           setAllPackages([]);
//           setError("Invalid data format received");
//         }
//       } catch (err) {
//         console.error("Error fetching adventure packages:", err);
//         setError("Failed to load adventure packages");
//         setAdventurePackages([]);
//         setAllPackages([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAdventurePackages();
//   }, []);

//   // Calculate total groups for desktop navigation
//   const totalGroups = Math.ceil(allPackages.length / 3);

//   // Handle desktop navigation
//   const handlePrevious = () => {
//     if (isMobile) return;
//     const newIndex = Math.max(0, currentIndex - 1);
//     setCurrentIndex(newIndex);

//     const startIndex = newIndex * 3;
//     const endIndex = startIndex + 3;
//     const newPackages = allPackages.slice(startIndex, endIndex);
//     setAdventurePackages(newPackages);
//   };

//   const handleNext = () => {
//     if (isMobile) return;
//     const newIndex = Math.min(totalGroups - 1, currentIndex + 1);
//     setCurrentIndex(newIndex);

//     const startIndex = newIndex * 3;
//     const endIndex = startIndex + 3;
//     const newPackages = allPackages.slice(startIndex, endIndex);
//     setAdventurePackages(newPackages);
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

//   if (adventurePackages.length === 0) {
//     return (
//       <section className="section-padding bg-white px-4 sm:px-6">
//         <div className="container mx-auto text-center">
//           <p className="text-gray-500">
//             {error
//               ? "Failed to load adventure packages."
//               : "No adventure packages available."}
//           </p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-20 bg-slate-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-4">
//           <Badge className="mb-4 !bg-blue-100 !text-blue-800 !rounded-md hover:bg-blue-100 !px-1 !py-1">
//             Adventure Escapes
//           </Badge>
//           <h2
//             className="text-slate-900 mb-4"
//             style={{
//               fontSize: "48px",
//               fontWeight: 700,
//               lineHeight: "48px",
//             }}
//           >
//             Adventure Escapes
//           </h2>
//           <p className="text-[20px] text-slate-600 max-w-3xl mx-auto">
//             Push your limits with our adrenaline-pumping adventure packages
//             designed for thrill-seekers and nature enthusiasts
//           </p>
//         </div>

//         {/* Desktop Pagination */}
//         {!isMobile && (
//           <div className="flex justify-between items-center mb-8">
//             <button
//               onClick={handlePrevious}
//               disabled={currentIndex === 0}
//               className={`w-10 h-10 border rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
//                 currentIndex === 0
//                   ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
//                   : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
//               }`}
//             >
//               <ChevronLeft className="w-5 h-5" />
//             </button>

//             {/* <div className="text-sm text-gray-500 font-medium">
//               {currentIndex + 1} of {totalGroups}
//             </div> */}

//             <button
//               onClick={handleNext}
//               disabled={currentIndex === totalGroups - 1}
//               className={`w-10 h-10 border rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
//                 currentIndex === totalGroups - 1
//                   ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
//                   : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
//               }`}
//             >
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//         )}

//         {/* Packages Container */}
//         {isMobile ? (
//           // Mobile: Snap-scroll flex layout (match Trending)
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
//                         <div className="absolute top-4 left-4">
//                           <Badge className=" !bg-[#3B82F6] text-white">
//                             {pkg.category === "adventure"
//                               ? "Adventure"
//                               : pkg.category.charAt(0).toUpperCase() +
//                                 pkg.category.slice(1)}
//                           </Badge>
//                         </div>
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
//                           {pkg.title}
//                         </h3>
//                         <div className="flex items-center text-slate-500 text-sm mb-4">
//                           <Calendar className="h-4 w-4 mr-1" />
//                           {pkg.duration}
//                         </div>

//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center space-x-2">
//                             <span className="text-2xl font-bold text-[#0F172A]">
//                               ₹{pkg.price.toLocaleString()}
//                             </span>
//                             {pkg.originalPrice && (
//                               <span className="text- text-slate-500 line-through">
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

//             {/* Mobile scroll indicators */}
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
//           // Desktop: grid layout
//           <div className="hidden md:block">
//             <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {adventurePackages.map((pkg) => (
//                 <div key={pkg._id} className="h-full flex flex-col">
//                   <Link
//                     href={`/itinerary/${pkg.slug || pkg._id}`}
//                     className="block h-full"
//                   >
//                     <Card className="overflow-hidden hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 transform hover:-translate-y-1 group h-full border-[1px] border-[#E5E5E5]">
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
//                         <div className="absolute top-4 left-4">
//                           <Badge className="!bg-blue-500 text-white rounded-md">
//                             {pkg.category === "adventure"
//                               ? "Adventure"
//                               : pkg.category.charAt(0).toUpperCase() +
//                                 pkg.category.slice(1)}
//                           </Badge>
//                         </div>
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
//                           className="flex items-center text-slate-500 mb-2"
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
//                           {pkg.title}
//                         </h3>
//                         <div className="flex items-center text-slate-500 text-sm mb-4">
//                           <Calendar className="h-4 w-4 mr-1" />
//                           {pkg.duration}
//                         </div>

//                         <div className="flex items-center justify-between mt-1">
//                           <div className="flex items-center space-x-2">
//                             <span className="text-[24px] font-bold text-[#0F172A]">
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
//           <Link href={getCategoryPageUrl("Adventure Tours")}>
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

// export default NewAdventureEscapes;


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
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { getCategoryPageUrl } from "@/lib/categoryUtils";
import { SkeletonPackageCard } from "@/components/ui/skeleton";

interface AdventurePackage {
  _id: string;
  title: string;
  duration: string;
  destination: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  description: string;
  shortDescription: string;
  highlights: string[];
  isActive: boolean;
  isFeatured: boolean;
  slug: string;
  rating?: number;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

const cleanTitle = (title: string): string => {
  return title
    .replace(/\s*[-–—]\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const NewAdventureEscapes = () => {
  const [allPackages, setAllPackages] = useState<AdventurePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Mobile detection
  useEffect(() => {
    const updateMobileState = () => setIsMobile(window.innerWidth < 768);
    updateMobileState();
    window.addEventListener("resize", updateMobileState);
    return () => window.removeEventListener("resize", updateMobileState);
  }, []);

  // Fetch packages
  useEffect(() => {
    const fetchAdventurePackages = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/packages?category=Adventure%20Tours");
        if (!response.ok) throw new Error("Failed to fetch adventure packages");

        const data = await response.json();
        const packagesArray = Array.isArray(data) ? data : data.packages || [];
        setAllPackages(packagesArray);
        setError(null);
      } catch (err) {
        console.error("Error fetching adventure packages:", err);
        setError("Failed to load adventure packages");
        setAllPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdventurePackages();
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

  // Get safe image URL with fallback priority
  const getSafeImage = (pkg: AdventurePackage) => {
    // If already marked as error → show fallback
    if (imageErrors[pkg._id]) return FALLBACK_IMAGE;

    // Get first image if exists and is not empty string
    const firstImage = pkg.images?.[0];
    if (!firstImage || firstImage.trim() === "" || firstImage === "null") {
      return FALLBACK_IMAGE;
    }

    // Try to process through getImageUrl
    const processedUrl = getImageUrl(firstImage);
    return processedUrl || FALLBACK_IMAGE;
  };

  const handleImageError = (packageId: string) => {
    setImageErrors((prev) => ({ ...prev, [packageId]: true }));
  };

  const formatDuration = (duration: string) => {
    if (!duration) return "Contact for details";
    const match = duration.match(/^(\d+)N\/(\d+)D$/i);
    if (match) return `${match[2]} Days, ${match[1]} Nights`;
    return duration;
  };

  const visiblePackages = allPackages.slice(currentIndex, currentIndex + 3);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < allPackages.length - 3;

  if (loading) {
    return (
      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4" />
            <div className="h-12 w-80 bg-gray-200 rounded mx-auto mb-3" />
            <div className="h-6 w-96 bg-gray-200 rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, i) => (
              <SkeletonPackageCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (allPackages.length === 0) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-lg">
            {error ? "Failed to load adventure packages." : "No adventure packages available at the moment."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-50">
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-enter { 
          animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
        }
        .mobile-scroll-container {
          scroll-snap-type: x mandatory;
          display: flex;
          overflow-x: auto;
          gap: 1rem;
          padding: 0 7.5% 1.5rem;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .mobile-scroll-container::-webkit-scrollbar { display: none; }
        .mobile-scroll-item { 
          scroll-snap-align: center; 
          flex-shrink: 0; 
          width: 85%; 
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge className="mb-4 !bg-blue-100 !text-blue-800 px-4 py-1.5 text-sm font-medium">
            Adventure Escapes
          </Badge>
          <h2 className="!text-4xl md:!text-5xl !font-bold text-slate-900 mb-4">
            Adventure Escapes
          </h2>
          <p className="!text-xl !text-slate-600 max-w-3xl mx-auto">
            Push your limits with our adrenaline-pumping adventure packages
            designed for thrill-seekers and nature enthusiasts
          </p>
        </div>

        {/* Navigation arrows - Desktop only */}
        {!isMobile && allPackages.length > 3 && (
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious || isTransitioning}
              className={`w-12 h-12 border-2 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer ${
                !canGoPrevious || isTransitioning
                  ? "bg-gray-100 border-gray-200 text-gray-400"
                  : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:scale-110"
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              disabled={!canGoNext || isTransitioning}
              className={`w-12 h-12 border-2 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer ${
                !canGoNext || isTransitioning
                  ? "bg-gray-100 border-gray-200 text-gray-400"
                  : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:scale-110"
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Content */}
        {isMobile ? (
          <div className="md:hidden -mx-4">
            <div ref={scrollContainerRef} className="mobile-scroll-container">
              {allPackages.map((pkg) => (
                <div key={pkg._id} className="mobile-scroll-item">
                  <Card className="overflow-hidden border-0 shadow-md h-full bg-white">
                    <div className="relative w-full h-48">
                      <Image
                        src={getSafeImage(pkg)}
                        alt={pkg.title}
                        fill
                        className="object-cover"
                        sizes="85vw"
                        onError={() => handleImageError(pkg._id)}
                        priority={false}
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
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {pkg.destination}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1 truncate">
                        {cleanTitle(pkg.title)}
                      </h3>
                      <div className="flex items-center text-slate-500 text-xs mb-4">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDuration(pkg.duration)}
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-slate-900">
                            ₹{pkg.price.toLocaleString()}
                          </span>
                          {pkg.originalPrice && (
                            <span className="text-sm text-slate-400 line-through">
                              ₹{pkg.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <Link href={`/itinerary/${pkg.slug || pkg._id}`} className="w-full">
                          <Button
                            variant="outline"
                            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 h-12 font-semibold cursor-pointer"
                          >
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
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
              <div key={pkg._id} className="card-enter">
                <Card className="overflow-hidden border-0 shadow-lg group h-full bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={getSafeImage(pkg)}
                      alt={pkg.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      onError={() => handleImageError(pkg._id)}
                    />
                    {pkg.rating && (
                      <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold">{pkg.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center text-slate-500 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {pkg.destination}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                      {cleanTitle(pkg.title)}
                    </h3>
                    <div className="flex items-center text-slate-500 text-sm mb-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDuration(pkg.duration)}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-slate-900">
                          ₹{pkg.price.toLocaleString()}
                        </span>
                        {pkg.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{pkg.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <Link href={`/itinerary/${pkg.slug || pkg._id}`}>
                        <Button
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-100 hover:text-black cursor-pointer font-semibold px-6 group-hover:border-blue-700 group-hover:text-blue-700 transition-colors"
                        >
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
          <Link href={getCategoryPageUrl("Adventure Tours")}>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 text-lg font-medium rounded-xl shadow-lg hover:scale-105 transition-all">
              View All Packages
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewAdventureEscapes;