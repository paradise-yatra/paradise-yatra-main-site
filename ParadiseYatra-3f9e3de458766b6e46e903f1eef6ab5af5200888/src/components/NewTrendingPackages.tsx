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
//   const [isTransitioning, setIsTransitioning] = useState(false);

//   const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

//   useEffect(() => {
//     const updateMobileState = () => setIsMobile(window.innerWidth < 768);
//     updateMobileState();
//     window.addEventListener("resize", updateMobileState);
//     return () => window.removeEventListener("resize", updateMobileState);
//   }, []);

//   useEffect(() => {
//     const fetchTrendingPackages = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("/api/packages?category=Trending%20Destinations&limit=10");
//         if (!response.ok) throw new Error("Failed to fetch trending packages");
//         const data = await response.json();
//         let packagesToSet = Array.isArray(data) ? data : (data.packages || []);
//         setAllPackages(packagesToSet);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to load");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTrendingPackages();
//   }, []);

//   const handlePrevious = () => {
//     if (isMobile || isTransitioning || currentIndex === 0) return;
//     setIsTransitioning(true);
//     setCurrentIndex((prev) => prev - 1);
//     setTimeout(() => setIsTransitioning(false), 500);
//   };

//   const handleNext = () => {
//     if (isMobile || isTransitioning || currentIndex >= allPackages.length - 3) return;
//     setIsTransitioning(true);
//     setCurrentIndex((prev) => prev + 1);
//     setTimeout(() => setIsTransitioning(false), 500);
//   };

//   const formatDuration = (duration: string) => {
//     if (!duration) return "Contact for details";
//     const match = duration.match(/^(\d+)N\/(\d+)D$/i);
//     if (match) return `${match[2]} Days, ${match[1]} Nights`;
//     return duration;
//   };

//   if (loading) {
//     return (
//       <section className="py-20 bg-white px-4">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
//           {Array.from({ length: 3 }).map((_, i) => <SkeletonPackageCard key={i} />)}
//         </div>
//       </section>
//     );
//   }

//   const visiblePackages = allPackages.slice(currentIndex, currentIndex + 3);
//   const canGoPrevious = currentIndex > 0;
//   const canGoNext = currentIndex < allPackages.length - 3;

//   return (
//     <section className="py-20 bg-slate-50">
//       <style jsx global>{`
//         @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
//         .card-enter { animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
//         .mobile-scroll-container {
//           scroll-snap-type: x mandatory;
//           display: flex;
//           overflow-x: auto;
//           gap: 1.25rem;
//           padding: 0 1rem 1.5rem;
//           scrollbar-width: none;
//         }
//         .mobile-scroll-container::-webkit-scrollbar { display: none; }
//         .mobile-scroll-item { scroll-snap-align: start; flex-shrink: 0; width: 85vw; max-width: 320px; }
//       `}</style>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-4">
//           <Badge className="mb-8 md:4 !bg-blue-100 !text-blue-800">Featured Tours</Badge>
//           <h2 className="!text-3xl md:!text-5xl !font-bold text-slate-900 mb-4">Trending Packages</h2>
//           <p className="!text-sm md:!text-xl !text-slate-600 max-w-3xl mx-auto">Discover our most popular travel packages, carefully curated for unforgettable experiences</p>
//         </div>

//         {!isMobile && (
//           <div className="flex justify-between items-center mb-8">
//             <button
//               onClick={handlePrevious}
//               disabled={!canGoPrevious || isTransitioning}
//               className={`w-8 h-10 border border-gray-200 rounded-sm flex items-center justify-center shadow-sm duration-300 cursor-pointer ${!canGoPrevious ? "bg-gray-100 border-gray-200 text-gray-400" : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:scale-110"
//                 }`}
//             >
//               <ChevronLeft className="w-6 h-6" />
//             </button>
//             <button
//               onClick={handleNext}
//               disabled={!canGoNext || isTransitioning}
//               className={`w-8 h-10 border border-gray-200 rounded-sm flex items-center justify-center shadow-sm  cursor-pointer ${!canGoNext ? "bg-gray-100 border-gray-200 text-gray-400" : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:shadow-xl hover:scale-110"
//                 }`}
//             >
//               <ChevronRight className="w-6 h-6" />
//             </button>
//           </div>
//         )}

//         {isMobile ? (
//           <div className="md:hidden -mx-4">
//             <div className="mobile-scroll-container">
//               {allPackages.map((pkg) => (
//                 <div key={pkg._id} className="mobile-scroll-item">
//                   <Card className="overflow-hidden border border-gray-200 h-full bg-white flex flex-col">
//                     <div className="relative h-56 w-full overflow-hidden">
//                       <Image
//                         src={getImageUrl(pkg.images[0]) || FALLBACK_IMAGE}
//                         alt={pkg.title}
//                         fill
//                         className="object-cover"
//                       />
//                       {pkg.rating && (
//                         <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-1">
//                           <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                           <span className="text-sm font-base">{pkg.rating.toFixed(1)}</span>
//                         </div>
//                       )}
//                     </div>
//                     <CardContent className="p-6 flex flex-col flex-grow">
//                       <div className="flex items-center text-slate-500 text-sm mb-2">
//                         <MapPin className="h-4 w-4 mr-1" /> {pkg.destination}
//                       </div>
//                       <h3 className="!text-xl !font-bold text-slate-900 mb-2 truncate">{cleanTitle(pkg.title)}</h3>
//                       <div className="flex items-center text-slate-500 text-sm mb-6">
//                         <Calendar className="h-4 w-4 mr-1" /> {formatDuration(pkg.duration)}
//                       </div>

//                       <div className="mt-auto flex items-center justify-between">
//                         <div className="flex flex-col">
//                           <span className="text-2xl font-bold text-slate-900">₹{pkg.price.toLocaleString()}</span>
//                           {pkg.originalPrice && (
//                             <span className="text-xs text-slate-400 line-through">₹{pkg.originalPrice.toLocaleString()}</span>
//                           )}
//                         </div>
//                         <Link href={`/itinerary/${pkg.slug || pkg._id}`}>
//                           <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-500 cursor-pointer px-4">
//                             View <ArrowRight className="ml-1 h-4 w-4" />
//                           </Button>
//                         </Link>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {visiblePackages.map((pkg) => (
//               <div key={pkg._id} className="card-enter opacity-0">
//                 <Card className="overflow-hidden border border-gray-200 group h-full bg-white">
//                   <div className="relative h-64 overflow-hidden">
//                     <Image src={getImageUrl(pkg.images[0]) || FALLBACK_IMAGE} alt={pkg.title} fill className="object-cover " />
//                     {pkg.rating && (
//                       <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-1">
//                         <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                         <span className="text-sm font-base">{pkg.rating.toFixed(1)}</span>
//                       </div>
//                     )}
//                   </div>
//                   <CardContent className="p-6">
//                     <div className="flex items-center text-slate-500 text-sm mb-2"><MapPin className="h-4 w-4 mr-1" /> {pkg.destination}</div>
//                     <h3 className="!text-xl !font-bold text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{cleanTitle(pkg.title)}</h3>
//                     <div className="flex items-center text-slate-500 text-sm mb-4"><Calendar className="h-4 w-4 mr-1" /> {formatDuration(pkg.duration)}</div>

//                     <div className="flex items-center justify-between">
//                       <div className="flex flex-col">
//                         <span className="text-2xl font-bold text-slate-900">₹{pkg.price.toLocaleString()}</span>
//                         {pkg.originalPrice && <span className="text-xs text-slate-400 line-through">₹{pkg.originalPrice.toLocaleString()}</span>}
//                       </div>
//                       <Link href={`/itinerary/${pkg.slug || pkg._id}`}>
//                         <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-500 hover:border hover:text-blue-600 cursor-pointer px-6">
//                           View Details <ArrowRight className="ml-2 h-4 w-4 " />
//                         </Button>
//                       </Link>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="text-center mt-12">
//           <Link href={getCategoryPageUrl("Trending Destinations")}>
//             <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 rounded-xl hover:scale-105 transition-all shadow-lg">
//               View All Packages <ArrowRight className="ml-2 h-5 w-5" />
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
import {
  Star,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { SkeletonPackageCard } from "@/components/ui/skeleton";
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = useRef(false);
  const prevIndexRef = useRef(0);

  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

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

  // FIXED: Mobile Scroll Handler with debouncing
  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Don't update index if we're scrolling programmatically (from dot click)
      if (isScrollingProgrammatically.current) return;

      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const scrollLeft = container.scrollLeft;
        const itemElement = container.firstElementChild as HTMLElement;

        if (itemElement) {
          const itemWidth = itemElement.offsetWidth + 20; // 20px gap
          const newIndex = Math.round(scrollLeft / itemWidth);

          if (newIndex !== currentIndex && newIndex >= 0 && newIndex < allPackages.length) {
            setCurrentIndex(newIndex);
          }
        }
      }, 50); // Debounce for 50ms
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isMobile, currentIndex, allPackages.length]);

  const handlePrevious = () => {
    if (isMobile || isTransitioning || currentIndex === 0) return;
    setIsTransitioning(true);
    prevIndexRef.current = currentIndex;
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleNext = () => {
    if (isMobile || isTransitioning || currentIndex >= allPackages.length - 3) return;
    setIsTransitioning(true);
    prevIndexRef.current = currentIndex;
    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleDotClick = (index: number) => {
    if (isTransitioning) return;

    if (isMobile && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemElement = container.firstElementChild as HTMLElement;
      if (itemElement) {
        const itemWidth = itemElement.offsetWidth + 20; // 20px gap
        isScrollingProgrammatically.current = true;

        container.scrollTo({
          left: index * itemWidth,
          behavior: 'smooth'
        });

        setCurrentIndex(index);

        // Reset the flag after scroll animation completes
        setTimeout(() => {
          isScrollingProgrammatically.current = false;
        }, 500);
      }
    } else {
      setIsTransitioning(true);
      prevIndexRef.current = currentIndex;
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    }
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

  const totalDesktopDots = Math.max(0, allPackages.length - 2);
  const totalMobileDots = allPackages.length;

  return (
    <section className="py-16 bg-slate-50">
      <style jsx global>{`
        @keyframes fadeInNew {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-new {
          animation: fadeInNew 0.4s ease-out forwards;
        }
        .cards-grid {
          transition: opacity 0.3s ease-out;
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
        {/* <div className="text-center mb-4">
          <h2 className="!text-3xl md:!text-5xl !font-bold text-slate-900 mb-4">Trending Packages</h2>
          <p className="!text-sm md:!text-xl !text-slate-600 max-w-3xl mx-auto">
            Discover our most popular travel packages, carefully curated for unforgettable experiences
          </p>
        </div> */}
        <div className="text-center mb-4 relative">
          {/* Decorative Background Element (Optional subtle glow) */}
          <div className="absolute left-1/2 -top-10 -translate-x-1/2 w-32 h-32 bg-blue-100/40 blur-3xl rounded-full -z-10" />

          <div className="flex flex-col items-center gap-2 mb-4">

            <h2 className="!text-3xl md:!text-5xl !font-extrabold text-slate-900 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Trending
              </span>{" "}
              Packages
            </h2>

            {/* Rich accent line */}
            <div className="flex items-center gap-2 mt-1">
              <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
              <div className="h-[2px] w-8 bg-gradient-to-l from-transparent to-blue-500 rounded-full" />
            </div>
          </div>

          <p className="!text-sm md:!text-lg !text-slate-500 max-w-2xl mx-auto leading-relaxed px-4">
            Discover our most popular travel packages, carefully curated for unforgettable experiences
          </p>
        </div>

        {!isMobile && (
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious || isTransitioning}
              className={`w-8 h-10 border border-gray-200 rounded-sm flex items-center justify-center shadow-sm duration-300 cursor-pointer ${!canGoPrevious
                ? "bg-gray-100 border-gray-200 text-gray-400"
                : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:scale-110"
                }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              disabled={!canGoNext || isTransitioning}
              className={`w-8 h-10 border border-gray-200 rounded-sm flex items-center justify-center shadow-sm cursor-pointer ${!canGoNext
                ? "bg-gray-100 border-gray-200 text-gray-400"
                : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:shadow-xl hover:scale-110"
                }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {isMobile ? (
          <div className="md:hidden w-full overflow-x-hidden">
            <div className="mobile-scroll-container" ref={scrollContainerRef} style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              {allPackages.map((pkg) => (
                <div key={pkg._id} className="mobile-scroll-item">
                  <Card className="overflow-hidden border border-gray-200 h-full bg-white flex flex-col shadow-md">
                    <div className="relative h-52 w-full overflow-hidden">
                      <Image
                        src={getImageUrl(pkg.images[0]) || FALLBACK_IMAGE}
                        alt={pkg.title}
                        fill
                        className="object-cover"
                      />
                      {pkg.rating && (
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">{pkg.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="flex flex-col flex-grow p-4">
                      <div className="flex items-center text-slate-500 text-xs mb-1">
                        <MapPin className="h-3 w-3 mr-1" /> {pkg.destination}
                      </div>
                      <h3 className="!text-lg !font-bold text-slate-900 mb-2 truncate">
                        {cleanTitle(pkg.title)}
                      </h3>
                      <div className="flex items-center text-slate-500 !text-xs mb-1">
                        <Calendar className="h-3 w-3 mr-1" /> {formatDuration(pkg.duration)}
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-slate-900">
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
                {allPackages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`pagination-dot ${currentIndex === index ? 'mobile-active' : ''}`}
                    aria-label={`Go to package ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visiblePackages.map((pkg, index) => {
                const prevIndex = prevIndexRef.current;
                const isGoingNext = currentIndex > prevIndex;
                const isGoingPrev = currentIndex < prevIndex;
                const isNewCard = (isGoingNext && index === 2) || (isGoingPrev && index === 0);
                return (
                <div key={`${pkg._id}-${currentIndex}`} className={isNewCard ? "card-new" : ""}>
                  <Card className="desktop-card overflow-hidden border border-gray-200 group h-full bg-white">
                    <div className="desktop-card-image relative h-64 overflow-hidden">
                      <Image
                        src={getImageUrl(pkg.images[0]) || FALLBACK_IMAGE}
                        alt={pkg.title}
                        fill
                        className="object-cover"
                      />
                      {pkg.rating && (
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">{pkg.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center text-slate-500 text-sm mb-2">
                        <MapPin className="h-4 w-4 mr-1" /> {pkg.destination}
                      </div>
                      <h3 className="!text-xl !font-bold text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors duration-300">
                        {cleanTitle(pkg.title)}
                      </h3>
                      <div className="flex items-center text-slate-500 text-sm mb-4">
                        <Calendar className="h-4 w-4 mr-1" /> {formatDuration(pkg.duration)}
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
                            className="desktop-card-button border border-slate-900 text-slate-900 bg-transparent hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 cursor-pointer px-6"
                          >
                            View Details <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                );
              })}
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

        <div className="text-center mt-12 px-2">
          <Link href={getCategoryPageUrl("Trending Destinations")} className="inline-block group">
            <button
              className="relative overflow-hidden rounded-full w-full sm:w-auto shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-md pl-8 pr-4 whitespace-nowrap">
                  View All Packages
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

export default NewTrendingDestinations;