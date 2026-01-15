// "use client";

// import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   MapPin,
//   Clock,
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

// interface Destination {
//   _id: string;
//   name: string;
//   slug?: string;
//   description: string;
//   shortDescription: string;
//   image: string;
//   location: string;
//   price?: number;
//   duration?: string;
//   isActive: boolean;
//   isTrending: boolean;
//   visitCount: number;
// }

// const NewDestinationsGrid = () => {
//   const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isMobile, setIsMobile] = useState(false);
//   const [activeScrollIndex, setActiveScrollIndex] = useState(0);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const imageErrorsRef = useRef<Set<string>>(new Set());
//   const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

//   // Update mobile state
//   useEffect(() => {
//     const updateMobileState = () => setIsMobile(window.innerWidth < 768);
//     updateMobileState();
//     window.addEventListener("resize", updateMobileState);
//     return () => window.removeEventListener("resize", updateMobileState);
//   }, []);

//   // Debounced scroll handler for mobile
//   const handleScroll = useCallback(() => {
//     if (scrollTimeoutRef.current) {
//       clearTimeout(scrollTimeoutRef.current);
//     }

//     scrollTimeoutRef.current = setTimeout(() => {
//       const container = scrollContainerRef.current;
//       if (!container) return;

//       const scrollLeft = container.scrollLeft;
//       const containerWidth = container.offsetWidth;
//       const cardWidth = containerWidth * 0.85;
//       const gap = 16;
//       const adjustedCardWidth = cardWidth + gap;
//       const newIndex = Math.round(scrollLeft / adjustedCardWidth);
      
//       setActiveScrollIndex(prevIndex => {
//         const clampedIndex = Math.min(Math.max(0, newIndex), allDestinations.length - 1);
//         return prevIndex !== clampedIndex ? clampedIndex : prevIndex;
//       });
//     }, 50); // Debounce by 50ms
//   }, [allDestinations.length]);

//   // Handle scroll for mobile indicators with debouncing
//   useEffect(() => {
//     if (!isMobile || !scrollContainerRef.current) return;

//     const container = scrollContainerRef.current;
//     container.addEventListener("scroll", handleScroll, { passive: true });
    
//     return () => {
//       container.removeEventListener("scroll", handleScroll);
//       if (scrollTimeoutRef.current) {
//         clearTimeout(scrollTimeoutRef.current);
//       }
//     };
//   }, [isMobile, handleScroll]);

//   // Fetch destinations
//   useEffect(() => {
//     const fetchDestinations = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("/api/destinations");

//         if (!response.ok) {
//           const errorData = await response.json().catch(() => ({}));
//           throw new Error(
//             `Failed to fetch destinations: ${response.status} ${
//               errorData.message || response.statusText
//             }`
//           );
//         }

//         const data = await response.json();
//         const destinationsArray = Array.isArray(data)
//           ? data
//           : data.destinations || [];

//         setAllDestinations(destinationsArray);
//         setError(null);
//       } catch (err: unknown) {
//         console.error("Error fetching destinations:", err);
//         const errorMessage =
//           err instanceof Error ? err.message : "Failed to load destinations";
//         setError(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDestinations();
//   }, []);

//   // Memoized image error handler
//   const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>, imageId: string) => {
//     const target = e.target as HTMLImageElement;
//     if (!imageErrorsRef.current.has(imageId)) {
//       imageErrorsRef.current.add(imageId);
//       target.src = FALLBACK_IMAGE;
//     }
//   }, [FALLBACK_IMAGE]);

//   // Desktop navigation
//   const handlePrevious = useCallback(() => {
//     if (isMobile || isTransitioning || currentIndex === 0) return;
//     setIsTransitioning(true);
//     setCurrentIndex((prev) => prev - 1);
//     setTimeout(() => setIsTransitioning(false), 500);
//   }, [isMobile, isTransitioning, currentIndex]);

//   const handleNext = useCallback(() => {
//     if (isMobile || isTransitioning || currentIndex >= allDestinations.length - 3) return;
//     setIsTransitioning(true);
//     setCurrentIndex((prev) => prev + 1);
//     setTimeout(() => setIsTransitioning(false), 500);
//   }, [isMobile, isTransitioning, currentIndex, allDestinations.length]);

//   // Memoized visible destinations for desktop
//   const visibleDestinations = useMemo(
//     () => allDestinations.slice(currentIndex, currentIndex + 3),
//     [allDestinations, currentIndex]
//   );

//   const canGoPrevious = currentIndex > 0;
//   const canGoNext = currentIndex < allDestinations.length - 3;

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

//   if (allDestinations.length === 0) {
//     return (
//       <section className="section-padding bg-white px-4 sm:px-6">
//         <div className="container mx-auto text-center">
//           <div className="animate-bounce flex items-center justify-center mb-4">
//             <MapPin className="w-8 h-8 text-blue-600" />
//           </div>
//           <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-3">
//             No Destinations Available
//           </h2>
//           <p className="text-gray-600 mb-4">
//             We&apos;re currently setting up our destination database.
//           </p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-20 bg-slate-50">
//       <style jsx global>{`
//         @keyframes fadeInUp { 
//           from { opacity: 0; transform: translateY(30px); } 
//           to { opacity: 1; transform: translateY(0); } 
//         }
//         .card-enter { 
//           animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
//         }
//         .mobile-scroll-container {
//           scroll-snap-type: x mandatory;
//           display: flex;
//           overflow-x: auto;
//           gap: 1rem;
//           padding: 0 7.5% 1.5rem;
//           scrollbar-width: none;
//           -webkit-overflow-scrolling: touch;
//           will-change: scroll-position;
//         }
//         .mobile-scroll-container::-webkit-scrollbar { 
//           display: none; 
//         }
//         .mobile-scroll-item { 
//           scroll-snap-align: center; 
//           flex-shrink: 0; 
//           width: 85%; 
//         }
//         .mobile-scroll-item img {
//           will-change: auto;
//           transform: translateZ(0);
//         }
//       `}</style>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-10">
//           <Badge className="mb-4 !bg-blue-100 !font-regular !text-blue-800 !rounded-md hover:bg-blue-100 !px-1 !py-1">
//             Destinations
//           </Badge>
//           <h2 className="!text-4xl md:!text-5xl !font-bold text-slate-900 mb-4">
//             Popular Destinations
//           </h2>
//           <p className="!text-xl !text-slate-600 max-w-3xl mx-auto">
//             Discover our most sought-after destinations, each offering unique
//             experiences and unforgettable memories
//           </p>
//         </div>

//         {/* Desktop Navigation */}
//         {!isMobile && (
//           <div className="flex justify-between items-center mb-8">
//             <button
//               onClick={handlePrevious}
//               disabled={!canGoPrevious || isTransitioning}
//               className={`w-12 h-12 border-2 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
//                 !canGoPrevious
//                   ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
//                   : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:scale-110 cursor-pointer"
//               }`}
//             >
//               <ChevronLeft className="w-6 h-6" />
//             </button>
//             <button
//               onClick={handleNext}
//               disabled={!canGoNext || isTransitioning}
//               className={`w-12 h-12 border-2 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
//                 !canGoNext
//                   ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
//                   : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:shadow-xl hover:scale-110 cursor-pointer"
//               }`}
//             >
//               <ChevronRight className="w-6 h-6" />
//             </button>
//           </div>
//         )}

//         {/* Mobile Scroll View */}
//         {isMobile ? (
//           <div className="md:hidden -mx-4">
//             <div ref={scrollContainerRef} className="mobile-scroll-container">
//               {allDestinations.map((destination) => {
//                 const imageUrl = getImageUrl(destination.image) || FALLBACK_IMAGE;
                
//                 return (
//                   <div key={destination._id} className="mobile-scroll-item">
//                     <Link
//                       href={`/destinations/${destination.slug || destination.name}`}
//                       className="block w-full"
//                     >
//                       <Card className="overflow-hidden border-0 shadow-md h-full group bg-white">
//                         <div className="relative w-full h-48">
//                           <Image
//                             src={imageUrl}
//                             alt={destination.name}
//                             fill
//                             sizes="85vw"
//                             className="object-cover"
//                             priority={false}
//                             loading="lazy"
//                             quality={75}
//                             onError={(e) => handleImageError(e, destination._id)}
//                           />
//                           <div className="absolute top-3 left-3">
//                             <Badge className="!bg-[#3B82F6] text-white">
//                               {destination.isTrending ? "Trending" : "Popular"}
//                             </Badge>
//                           </div>
//                         </div>

//                         <CardContent className="p-5">
//                           <div className="flex items-center text-slate-500 text-xs mb-1">
//                             <MapPin className="h-3.5 w-3.5 mr-1" />
//                             {destination.location}
//                           </div>
//                           <h3 className="text-xl font-bold text-slate-900 mb-1 truncate">
//                             {destination.name}
//                           </h3>
//                           <div className="flex items-center text-slate-500 text-xs mb-4">
//                             <Clock className="h-3.5 w-3.5 mr-1" />
//                             {destination.duration}
//                           </div>

//                           <div className="flex flex-col gap-3">
//                             <div className="flex items-baseline gap-2">
//                               <span className="text-2xl font-bold text-slate-900">
//                                 ₹{destination.price?.toLocaleString() || "Contact Us"}
//                               </span>
//                             </div>
//                             <Button
//                               variant="outline"
//                               className="w-full border-blue-600 text-blue-600 h-12 font-semibold hover:bg-blue-50 cursor-pointer"
//                             >
//                               View Details <ArrowRight className="ml-2 h-4 w-4" />
//                             </Button>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </Link>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ) : (
//           /* Desktop Grid View */
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {visibleDestinations.map((destination, index) => (
//               <div key={destination._id} className="card-enter opacity-0" style={{ animationDelay: `${index * 0.1}s` }}>
//                 <Link
//                   href={`/destinations/${destination.slug || destination._id}`}
//                   className="block h-full"
//                 >
//                   <Card className="overflow-hidden border-0 shadow-lg group h-full bg-white">
//                     <div className="relative h-64 overflow-hidden">
//                       <Image
//                         src={getImageUrl(destination.image) || FALLBACK_IMAGE}
//                         alt={destination.name}
//                         fill
//                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                         className="object-cover transition-transform duration-700 group-hover:scale-110"
//                         priority={index === 0 && currentIndex === 0}
//                         loading={index === 0 && currentIndex === 0 ? "eager" : "lazy"}
//                         onError={(e) => handleImageError(e, destination._id)}
//                       />
//                       <div className="absolute top-4 left-4">
//                         <Badge className="!bg-[#3B82F6] text-white">
//                           {destination.isTrending ? "Trending" : "Popular"}
//                         </Badge>
//                       </div>
//                     </div>

//                     <CardContent className="p-6">
//                       <div className="flex items-center text-slate-500 text-sm mb-2">
//                         <MapPin className="h-4 w-4 mr-1" />
//                         {destination.location}
//                       </div>
//                       <h3 className="text-xl font-bold text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
//                         {destination.name}
//                       </h3>
//                       <div className="flex items-center text-slate-500 text-sm mb-4">
//                         <Clock className="h-4 w-4 mr-1" />
//                         {destination.duration}
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <div className="flex flex-col">
//                           <span className="text-2xl font-bold text-slate-900">
//                             ₹{destination.price?.toLocaleString() || "Contact Us"}
//                           </span>
//                         </div>
//                         <Button
//                           variant="outline"
//                           className="border-blue-600 text-blue-600 hover:bg-blue-100 hover:text-black cursor-pointer font-semibold px-6"
//                         >
//                           View Details
//                           <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* View All Button */}
//         <div className="text-center mt-12">
//           <Link href={getCategoryPageUrl("Popular Destinations")}>
//             <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 rounded-xl hover:scale-105 transition-all shadow-lg">
//               View All Destinations
//               <ArrowRight className="ml-2 h-5 w-5" />
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewDestinationsGrid;

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [newCardIndex, setNewCardIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = useRef(false);

  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  // Update mobile state
  useEffect(() => {
    const updateMobileState = () => setIsMobile(window.innerWidth < 768);
    updateMobileState();
    window.addEventListener("resize", updateMobileState);
    return () => window.removeEventListener("resize", updateMobileState);
  }, []);

  // Fetch destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/destinations?limit=10");

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `Failed to fetch destinations: ${response.status} ${
              errorData.message || response.statusText
            }`
          );
        }

        const data = await response.json();
        const destinationsArray = Array.isArray(data)
          ? data
          : data.destinations || [];

        setAllDestinations(destinationsArray);
        setError(null);
      } catch (err: unknown) {
        console.error("Error fetching destinations:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load destinations";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Mobile Scroll Handler with debouncing
  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (isScrollingProgrammatically.current) return;

      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const scrollLeft = container.scrollLeft;
        const itemElement = container.firstElementChild as HTMLElement;

        if (itemElement) {
          const itemWidth = itemElement.offsetWidth + 20;
          const newIndex = Math.round(scrollLeft / itemWidth);

          if (newIndex !== currentIndex && newIndex >= 0 && newIndex < allDestinations.length) {
            setCurrentIndex(newIndex);
          }
        }
      }, 50);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isMobile, currentIndex, allDestinations.length]);

  const handlePrevious = () => {
    if (isMobile || isTransitioning || currentIndex === 0) return;
    setIsTransitioning(true);
    setNewCardIndex(0);
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => {
      setIsTransitioning(false);
      setNewCardIndex(null);
    }, 400);
  };

  const handleNext = () => {
    if (isMobile || isTransitioning || currentIndex >= allDestinations.length - 3) return;
    setIsTransitioning(true);
    setNewCardIndex(2);
    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleDotClick = (index: number) => {
    if (isTransitioning) return;

    if (isMobile && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemElement = container.firstElementChild as HTMLElement;
      if (itemElement) {
        const itemWidth = itemElement.offsetWidth + 20;
        isScrollingProgrammatically.current = true;

        container.scrollTo({
          left: index * itemWidth,
          behavior: 'smooth'
        });

        setCurrentIndex(index);

        setTimeout(() => {
          isScrollingProgrammatically.current = false;
        }, 500);
      }
    } else {
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const formatDuration = (duration: string | undefined) => {
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

  if (allDestinations.length === 0) {
    return (
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-bounce flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-3">
            No Destinations Available
          </h2>
          <p className="text-gray-600 mb-4">
            We&apos;re currently setting up our destination database.
          </p>
        </div>
      </section>
    );
  }

  const visibleDestinations = allDestinations.slice(currentIndex, currentIndex + 3);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < allDestinations.length - 3;
  const totalDesktopDots = Math.max(0, allDestinations.length - 2);
  const totalMobileDots = allDestinations.length;

  return (
    <section className="py-16 bg-slate-50">
      <style jsx global>{`
        @keyframes fadeInSoft {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-new {
          animation: fadeInSoft 0.4s ease-out;
        }
        @media (min-width: 768px) {
          .desktop-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .desktop-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          }
          .desktop-card-image {
            overflow: hidden;
          }
          .desktop-card-button {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .desktop-card:hover .desktop-card-button {
            transform: translateX(4px);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
          }
        }
        .mobile-scroll-container {
          scroll-snap-type: x mandatory;
          display: flex;
          overflow-x: auto;
          gap: 0.75rem;
          padding: 0 0.5rem 1.5rem !important;
          scrollbar-width: none;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scroll-padding-left: 0.5rem;
          scroll-padding-right: 0.5rem;
        }
        .mobile-scroll-container::-webkit-scrollbar { 
          display: none; 
        }
        .mobile-scroll-item { 
          scroll-snap-align: center;
          scroll-snap-stop: always;
          flex-shrink: 0; 
          width: 88vw !important; 
          max-width: 340px !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mobile-scroll-item .card-wrapper {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform: scale(0.95);
          opacity: 0.9;
        }
        .mobile-scroll-item .card-image-wrapper {
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .mobile-scroll-item .card-image-wrapper img {
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mobile-scroll-item:hover .card-wrapper,
        .mobile-scroll-item:active .card-wrapper {
          transform: scale(1.02) translateY(-4px);
          opacity: 1;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        .mobile-scroll-item:hover .card-image-wrapper img,
        .mobile-scroll-item:active .card-image-wrapper img {
          transform: scale(1.1);
        }
        .mobile-scroll-item:hover .view-button,
        .mobile-scroll-item:active .view-button {
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        
        .pagination-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #cbd5e1;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          border: none;
        }
        
        .pagination-dot.active {
          background-color: #3b82f6;
          width: 24px;
          border-radius: 4px;
        }
        
        .pagination-dot.mobile-active {
          background-color: #3b82f6;
          width: 20px;
          border-radius: 4px;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header with gradient design */}
        <div className="text-center mb-4 relative">
          <div className="absolute left-1/2 -top-10 -translate-x-1/2 w-32 h-32 bg-blue-100/40 blur-3xl rounded-full -z-10" />

          <div className="flex flex-col items-center gap-2 mb-4">

            <h2 className="!text-3xl md:!text-5xl !font-extrabold text-slate-900 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Popular
              </span>{" "}
              Destinations
            </h2>

            <div className="flex items-center gap-2 mt-1">
              <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
              <div className="h-[2px] w-8 bg-gradient-to-l from-transparent to-blue-500 rounded-full" />
            </div>
          </div>

          <p className="!text-sm md:!text-lg !text-slate-500 max-w-2xl mx-auto leading-relaxed px-4">
            Discover our most sought-after destinations, each offering unique experiences and unforgettable memories
          </p>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious || isTransitioning}
              className={`w-8 h-10 border border-gray-200 rounded-sm flex items-center justify-center shadow-sm duration-300 cursor-pointer ${
                !canGoPrevious
                  ? "bg-gray-100 border-gray-200 text-gray-400"
                  : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:scale-110"
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              disabled={!canGoNext || isTransitioning}
              className={`w-8 h-10 border border-gray-200 rounded-sm flex items-center justify-center shadow-sm cursor-pointer ${
                !canGoNext
                  ? "bg-gray-100 border-gray-200 text-gray-400"
                  : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:shadow-xl hover:scale-110"
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Mobile Scroll View */}
        {isMobile ? (
          <div className="md:hidden w-full overflow-x-hidden">
            <div className="mobile-scroll-container" ref={scrollContainerRef} style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              {allDestinations.map((destination) => (
                <div key={destination._id} className="mobile-scroll-item">
                  <Card className="overflow-hidden border border-gray-200 h-full bg-white flex flex-col shadow-md">
                    <div className="relative h-52 w-full overflow-hidden">
                      <Image
                        src={getImageUrl(destination.image) || FALLBACK_IMAGE}
                        alt={destination.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="flex flex-col flex-grow p-4">
                      <div className="flex items-center text-slate-500 text-xs mb-1">
                        <MapPin className="h-3 w-3 mr-1" /> {destination.location}
                      </div>
                      <h3 className="!text-lg !font-bold text-slate-900 mb-2 truncate">
                        {destination.name}
                      </h3>
                      <div className="flex items-center text-slate-500 !text-xs mb-1">
                        <Clock className="h-3 w-3 mr-1" /> {formatDuration(destination.duration)}
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-slate-900">
                            ₹{destination.price?.toLocaleString() || "Contact"}
                          </span>
                        </div>
                        <Link href={`/destinations/${destination.slug || destination._id}`}>
                          <Button
                            variant="outline"
                            className="border-slate-900 border text-slate-900 bg-transparent hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 cursor-pointer px-4 h-9"
                          >
                            View <ArrowRight className="ml-1 h-3 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {totalMobileDots > 1 && (
              <div className="flex justify-center items-center gap-2 mt-3">
                {allDestinations.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`pagination-dot ${currentIndex === index ? 'mobile-active' : ''}`}
                    aria-label={`Go to destination ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleDestinations.map((destination, index) => (
                <div key={destination._id} className={newCardIndex === index ? 'card-new' : ''}>
                  <Card className="desktop-card overflow-hidden border border-gray-200 group h-full bg-white">
                    <div className="desktop-card-image relative h-64 overflow-hidden">
                      <Image
                        src={getImageUrl(destination.image) || FALLBACK_IMAGE}
                        alt={destination.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center text-slate-500 text-sm mb-2">
                        <MapPin className="h-4 w-4 mr-1" /> {destination.location}
                      </div>
                      <h3 className="!text-xl !font-bold text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors duration-300">
                        {destination.name}
                      </h3>
                      <div className="flex items-center text-slate-500 text-sm mb-4">
                        <Clock className="h-4 w-4 mr-1" /> {formatDuration(destination.duration)}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold text-slate-900">
                            ₹{destination.price?.toLocaleString() || "Contact"}
                          </span>
                        </div>
                        <Link href={`/destinations/${destination.slug || destination._id}`}>
                          <Button
                            variant="outline"
                            className="desktop-card-button border border-slate-900 text-slate-900 bg-transparent hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 cursor-pointer px-6"
                          >
                            View Details <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {totalDesktopDots > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                {Array.from({ length: totalDesktopDots }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    disabled={isTransitioning}
                    className={`pagination-dot ${currentIndex === index ? 'active' : ''}`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* View All Button */}
        <div className="text-center mt-12 px-2">
          <Link href={getCategoryPageUrl("Popular Destinations")} className="inline-block group">
            <button
              className="relative overflow-hidden rounded-full w-full sm:w-auto shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-md pl-8 pr-4 whitespace-nowrap">
                  View All Destinations
                </span>
                <div className="bg-white rounded-full p-2 m-1.5 transition-all duration-300 group-hover:-rotate-45 group-hover:scale-110 shadow-md">
                  <ArrowRight className="w-4 h-4 text-indigo-600" strokeWidth={2.5} />
                </div>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewDestinationsGrid;