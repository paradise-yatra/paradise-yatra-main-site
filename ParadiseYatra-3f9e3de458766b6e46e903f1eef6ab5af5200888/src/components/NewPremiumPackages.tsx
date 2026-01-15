

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
// import Image from "next/image";
// import { getCategoryPageUrl } from "@/lib/categoryUtils";
// import { SkeletonPackageCard } from "@/components/ui/skeleton";

// interface PremiumPackage {
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

// const FALLBACK_IMAGE =
//   "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80";

// const cleanTitle = (title: string): string => {
//   return title
//     .replace(/\s*[-–—]\s*/g, " ")
//     .replace(/\s+/g, " ")
//     .trim();
// };

// const NewPremiumPackages = () => {
//   const [allPackages, setAllPackages] = useState<PremiumPackage[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

//   // Mobile detection
//   useEffect(() => {
//     const updateMobileState = () => setIsMobile(window.innerWidth < 768);
//     updateMobileState();
//     window.addEventListener("resize", updateMobileState);
//     return () => window.removeEventListener("resize", updateMobileState);
//   }, []);

//   // Fetch premium packages
//   useEffect(() => {
//     const fetchPremiumPackages = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("/api/packages?category=Premium%20Packages");

//         if (!response.ok) {
//           throw new Error("Failed to fetch premium packages");
//         }

//         const data = await response.json();
//         const packagesArray = Array.isArray(data) ? data : data.packages || [];
//         setAllPackages(packagesArray);
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching premium packages:", err);
//         setError("Failed to load premium packages");
//         setAllPackages([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPremiumPackages();
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

//   const getSafeImage = (pkg: PremiumPackage) => {
//     if (imageErrors[pkg._id]) return FALLBACK_IMAGE;

//     const firstImage = pkg.images?.[0];
//     if (!firstImage || firstImage.trim() === "" || firstImage === "null") {
//       return FALLBACK_IMAGE;
//     }

//     return firstImage;
//   };

//   const handleImageError = (packageId: string) => {
//     setImageErrors((prev) => ({ ...prev, [packageId]: true }));
//   };

//   const formatDuration = (duration: string) => {
//     if (!duration) return "Contact for details";
//     const match = duration.match(/^(\d+)N\/(\d+)D$/i);
//     if (match) return `${match[2]} Days, ${match[1]} Nights`;
//     return duration;
//   };

//   const visiblePackages = allPackages.slice(currentIndex, currentIndex + 3);
//   const canGoPrevious = currentIndex > 0;
//   const canGoNext = currentIndex < allPackages.length - 3;

//   if (loading) {
//     return (
//       <section className="py-20 bg-white px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-10">
//             <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4" />
//             <div className="h-12 w-80 bg-gray-200 rounded mx-auto mb-3" />
//             <div className="h-6 w-96 bg-gray-200 rounded mx-auto" />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {Array(3).fill(0).map((_, i) => (
//               <SkeletonPackageCard key={i} />
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (allPackages.length === 0) {
//     return (
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <p className="text-gray-500 text-lg">
//             {error ? "Failed to load premium packages." : "No premium packages available at the moment."}
//           </p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-20 bg-white">
//       <style jsx global>{`
//         @keyframes fadeInUp {
//           from { opacity: 0; transform: translateY(30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .card-enter {
//           animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
//           opacity: 0;
//         }
//         .mobile-scroll-container {
//           scroll-snap-type: x mandatory;
//           display: flex;
//           overflow-x: auto;
//           gap: 1rem;
//           padding: 0 7.5% 1.5rem;
//           scrollbar-width: none;
//           -webkit-overflow-scrolling: touch;
//         }
//         .mobile-scroll-container::-webkit-scrollbar { display: none; }
//         .mobile-scroll-item {
//           scroll-snap-align: center;
//           flex-shrink: 0;
//           width: 85%;
//         }
//       `}</style>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-10">
//           <Badge className="mb-4 !bg-blue-100 !text-blue-800 px-4 py-1.5 text-sm font-medium">
//             Premium Experience
//           </Badge>
//           <h2 className="!text-4xl md:!text-5xl !font-bold text-slate-900 mb-4">
//             Premium Packages
//           </h2>
//           <p className="!text-xl !text-slate-600 max-w-3xl mx-auto">
//             Indulge in luxury travel experiences, handpicked for unforgettable journeys
//           </p>
//         </div>

//         {/* Navigation arrows - Desktop only */}
//         {!isMobile && allPackages.length > 3 && (
//           <div className="flex justify-between items-center mb-8">
//             <button
//               onClick={handlePrevious}
//               disabled={!canGoPrevious || isTransitioning}
//               className={`w-12 h-12 border-2 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer ${
//                 !canGoPrevious || isTransitioning
//                   ? "bg-gray-100 border-gray-200 text-gray-400"
//                   : "bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:scale-110"
//               }`}
//             >
//               <ChevronLeft className="w-6 h-6" />
//             </button>

//             <button
//               onClick={handleNext}
//               disabled={!canGoNext || isTransitioning}
//               className={`w-12 h-12 border-2 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer ${
//                 !canGoNext || isTransitioning
//                   ? "bg-gray-100 border-gray-200 text-gray-400"
//                   : "bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:scale-110"
//               }`}
//             >
//               <ChevronRight className="w-6 h-6" />
//             </button>
//           </div>
//         )}

//         {/* Content */}
//         {isMobile ? (
//           <div className="md:hidden -mx-4">
//             <div ref={scrollContainerRef} className="mobile-scroll-container">
//               {allPackages.map((pkg) => (
//                 <div key={pkg._id} className="mobile-scroll-item">
//                   <Card className="overflow-hidden border-0 shadow-md h-full bg-white">
//                     <div className="relative w-full h-48">
//                       <Image
//                         src={getSafeImage(pkg)}
//                         alt={pkg.title}
//                         fill
//                         className="object-cover"
//                         sizes="85vw"
//                         onError={() => handleImageError(pkg._id)}
//                       />
//                       {pkg.rating && (
//                         <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
//                           <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
//                           <span className="text-xs font-bold">{pkg.rating.toFixed(1)}</span>
//                         </div>
//                       )}
//                     </div>

//                     <CardContent className="p-5">
//                       <div className="flex items-center text-slate-500 text-xs mb-1">
//                         <MapPin className="h-3.5 w-3.5 mr-1" />
//                         {pkg.destination}
//                       </div>
//                       <h3 className="text-xl font-bold text-slate-900 mb-1 truncate">
//                         {cleanTitle(pkg.title)}
//                       </h3>
//                       <div className="flex items-center text-slate-500 text-xs mb-4">
//                         <Calendar className="h-3.5 w-3.5 mr-1" />
//                         {formatDuration(pkg.duration)}
//                       </div>

//                       <div className="flex flex-col gap-3">
//                         <div className="flex items-baseline gap-2">
//                           <span className="text-2xl font-bold text-slate-900">
//                             ₹{pkg.price.toLocaleString()}
//                           </span>
//                           {pkg.originalPrice && (
//                             <span className="text-sm text-slate-400 line-through">
//                               ₹{pkg.originalPrice.toLocaleString()}
//                             </span>
//                           )}
//                         </div>

//                         <Link href={`/itinerary/${pkg.slug || pkg._id}`} className="w-full">
//                           <Button
//                             variant="outline"
//                             className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 h-12 font-semibold"
//                           >
//                             View Details
//                             <ArrowRight className="ml-2 h-4 w-4" />
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
//               <div key={pkg._id} className="card-enter">
//                 <Card className="overflow-hidden border-0 shadow-lg group h-full bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
//                   <div className="relative h-64 overflow-hidden">
//                     <Image
//                       src={getSafeImage(pkg)}
//                       alt={pkg.title}
//                       fill
//                       className="object-cover transition-transform duration-700 group-hover:scale-110"
//                       sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
//                       onError={() => handleImageError(pkg._id)}
//                     />
//                     {pkg.rating && (
//                       <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-1">
//                         <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                         <span className="text-sm font-bold">{pkg.rating.toFixed(1)}</span>
//                       </div>
//                     )}
//                   </div>

//                   <CardContent className="p-6">
//                     <div className="flex items-center text-slate-500 text-sm mb-2">
//                       <MapPin className="h-4 w-4 mr-1" />
//                       {pkg.destination}
//                     </div>
//                     <h3 className="text-xl font-bold text-slate-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">
//                       {cleanTitle(pkg.title)}
//                     </h3>
//                     <div className="flex items-center text-slate-500 text-sm mb-4">
//                       <Calendar className="h-4 w-4 mr-1" />
//                       {formatDuration(pkg.duration)}
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div className="flex flex-col">
//                         <span className="text-2xl font-bold text-slate-900">
//                           ₹{pkg.price.toLocaleString()}
//                         </span>
//                         {pkg.originalPrice && (
//                           <span className="text-xs text-slate-400 line-through">
//                             ₹{pkg.originalPrice.toLocaleString()}
//                           </span>
//                         )}
//                       </div>

//                       <Link href={`/itinerary/${pkg.slug || pkg._id}`}>
//                         <Button
//                           variant="outline"
//                           className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-700 hover:text-indigo-700 transition-colors font-semibold px-6 group-hover:border-indigo-700 group-hover:text-indigo-700"
//                         >
//                           View Details
//                           <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
//           <Link href={getCategoryPageUrl("Premium Packages")}>
//             <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-6 text-lg font-medium rounded-xl shadow-lg hover:scale-105 transition-all">
//               View All Premium Packages
//               <ArrowRight className="ml-2 h-5 w-5" />
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewPremiumPackages;

"use client";

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
import { getCategoryPageUrl } from "@/lib/categoryUtils";

interface PremiumPackage {
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

const NewPremiumPackages = () => {
  const [allPackages, setAllPackages] = useState<PremiumPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = useRef(false);

  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80";

  useEffect(() => {
    const updateMobileState = () => setIsMobile(window.innerWidth < 768);
    updateMobileState();
    window.addEventListener("resize", updateMobileState);
    return () => window.removeEventListener("resize", updateMobileState);
  }, []);

  useEffect(() => {
    const fetchPremiumPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/packages?category=Premium%20Packages&limit=10");
        if (!response.ok) throw new Error("Failed to fetch premium packages");
        const data = await response.json();
        let packagesToSet = Array.isArray(data) ? data : (data.packages || []);
        setAllPackages(packagesToSet);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchPremiumPackages();
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

          if (newIndex !== currentIndex && newIndex >= 0 && newIndex < allPackages.length) {
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
  }, [isMobile, currentIndex, allPackages.length]);

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

  const SafeImage = ({ src, alt, fallback }: { src: string; alt: string; fallback: string }) => {
    const [imgSrc, setImgSrc] = useState(src);

    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className="object-cover"
        // This triggers if the URL is invalid or returns a 404
        onError={() => setImgSrc(fallback)}
      />
    );
  };

  const visiblePackages = allPackages.slice(currentIndex, currentIndex + 3);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < allPackages.length - 3;

  const totalDesktopDots = Math.max(0, allPackages.length - 2);
  const totalMobileDots = allPackages.length;

  return (
    <section 
      className="py-16 bg-cover bg-center bg-no-repeat relative"
      style={{ 
        backgroundImage: "url('https://res.cloudinary.com/dwuwpxu0y/image/upload/v1768219728/Abstract_background_of_weathered_wood_in_blue_and_red_tones_1_gmdgpd.jpg')"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-black/5 to-black/10 pointer-events-none z-0" />
      <style jsx global>{`
        @keyframes fadeInSoft { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .card-enter { 
          animation: fadeInSoft 0.35s ease-out forwards; 
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

        .premium-pagination-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #ffff;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          border: none;
        }
        
        .premium-pagination-dot.active {
          background-color: #6366f1;
          width: 24px;
          border-radius: 4px;
        }
        
        .premium-pagination-dot.mobile-active {
          background-color: #6366f1;
          width: 20px;
          border-radius: 4px;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4 relative">
          {/* Decorative Background Element */}
          <div className="absolute left-1/2 -top-10 -translate-x-1/2 w-32 h-32 bg-gray-900/40 blur-3xl rounded-full -z-10" />


          <div className="flex flex-col items-center gap-2 mb-4">
            <h2 className="!text-3xl md:!text-5xl !font-extrabold text-slate-900 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Premium
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
            Indulge in luxury travel experiences, handpicked for unforgettable journeys
          </p>
        </div>

        {!isMobile && (
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious || isTransitioning}
              className={`w-8 h-10 border border-gray-200 rounded-sm flex items-center justify-center shadow-sm duration-300 cursor-pointer ${!canGoPrevious
                ? "bg-white border-gray-200 text-gray-400"
                : "bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:scale-110"
                }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              disabled={!canGoNext || isTransitioning}
              className={`w-8 h-10 border border-gray-200 rounded-sm flex items-center justify-center shadow-sm cursor-pointer ${!canGoNext
                ? "bg-gray-100 border-gray-200 text-gray-400"
                : "bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-xl hover:scale-110"
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
                      <SafeImage
                        src={pkg.images[0] || FALLBACK_IMAGE}
                        alt={pkg.title}
                        fallback={FALLBACK_IMAGE}
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
                            className="border-slate-900 border text-slate-900 bg-transparent hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 cursor-pointer px-4 h-9"
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
                    className={`premium-pagination-dot ${currentIndex === index ? 'mobile-active' : ''}`}
                    aria-label={`Go to package ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visiblePackages.map((pkg, index) => (
                <div key={pkg._id} className="card-enter opacity-0">
                  <Card className="desktop-card overflow-hidden border border-gray-200 group h-full bg-white">
                    <div className="desktop-card-image relative h-64 overflow-hidden">
                      <SafeImage
                        src={pkg.images[0] || FALLBACK_IMAGE}
                        alt={pkg.title}
                        fallback={FALLBACK_IMAGE}
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
                      <h3 className="!text-xl !font-bold text-slate-900 mb-2 truncate group-hover:text-indigo-600 transition-colors duration-300">
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
                            className="desktop-card-button border border-slate-900 text-slate-900 bg-transparent hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 cursor-pointer px-6"
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
                    className={`premium-pagination-dot ${currentIndex === index ? 'active' : ''}`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <div className="text-center mt-12 px-2">
          <Link href={getCategoryPageUrl("Premium Packages")} className="inline-block group">
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

export default NewPremiumPackages;