// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   MapPin,
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   ArrowRight,
// } from "lucide-react";
// import { SkeletonPackageCard } from "@/components/ui/skeleton";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link"; // ← Import the correct Next.js Link
// import { getImageUrl } from "@/lib/utils";

// interface HolidayType {
//   _id: string;
//   title: string;
//   slug: string;
//   description: string;
//   shortDescription: string;
//   image: string;
//   duration: string;
//   travelers: string;
//   badge: string;
//   price: string;
//   isActive: boolean;
//   isFeatured: boolean;
//   order: number;
// }

// const NewHolidaysSection = () => {
//   const router = useRouter();
//   const [categories, setCategories] = useState<HolidayType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const scrollContainerRef = useRef<HTMLDivElement>(null);

//   const FALLBACK_IMAGE =
//     "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
//   const BLUR_PLACEHOLDER =
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

//   useEffect(() => {
//     const updateMobileState = () => setIsMobile(window.innerWidth < 768);
//     updateMobileState();
//     window.addEventListener("resize", updateMobileState);
//     return () => window.removeEventListener("resize", updateMobileState);
//   }, []);

//   useEffect(() => {
//     const fetchHolidayTypes = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("/api/holiday-types");
//         if (response.ok) {
//           const data = await response.json();
//           const activeCategories = data
//             .filter((item: HolidayType) => item.isActive)
//             .sort((a: HolidayType, b: HolidayType) => a.order - b.order);
//           setCategories(activeCategories);
//         }
//       } catch (error) {
//         console.error("Error fetching holiday types:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchHolidayTypes();
//   }, []);

//   const handlePrevious = () => {
//     if (isMobile || isTransitioning || currentIndex === 0) return;
//     setIsTransitioning(true);
//     setCurrentIndex((prev) => prev - 1);
//     setTimeout(() => setIsTransitioning(false), 500);
//   };

//   const handleNext = () => {
//     if (isMobile || isTransitioning || currentIndex >= categories.length - 3) return;
//     setIsTransitioning(true);
//     setCurrentIndex((prev) => prev + 1);
//     setTimeout(() => setIsTransitioning(false), 500);
//   };

//   const navigateToDetails = (slug: string) => {
//     router.push(`/holiday-types/${slug}`);
//   };

//   if (loading) {
//     return (
//       <section className="py-20 bg-slate-50 px-4 sm:px-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {Array.from({ length: 3 }).map((_, i) => (
//               <SkeletonPackageCard key={i} />
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   const visibleCategories = categories.slice(currentIndex, currentIndex + 3);
//   const canGoPrevious = currentIndex > 0;
//   const canGoNext = currentIndex < categories.length - 3;

//   return (
//     <section className="py-20 bg-white">
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

//         .theme-btn:focus-visible {
//           outline: 2px solid #2563eb !important;
//           outline-offset: 2px;
//         }

//         .mobile-scroll-container {
//           scroll-snap-type: x mandatory;
//           scroll-padding: 0 7.5%;
//           display: flex;
//           overflow-x: auto;
//           gap: 1rem;
//           padding: 0 7.5% 1.5rem;
//           scrollbar-width: none;
//         }
//         .mobile-scroll-container::-webkit-scrollbar {
//           display: none;
//         }
//         .mobile-scroll-item {
//           scroll-snap-align: center;
//           flex-shrink: 0;
//           width: 85%;
//         }
//       `}</style>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-10">
//           <Badge className="mb-4 !bg-blue-100 !text-blue-800">Holiday Types</Badge>
//           <h2 className="!text-4xl md:text-5xl !font-bold text-slate-900 mb-4">
//             Holidays for Every Traveler
//           </h2>
//           <p className="text-xl !text-slate-600 max-w-3xl mx-auto">
//             From beach getaways to mountain adventures, find the perfect holiday type that matches
//             your travel style
//           </p>
//         </div>

//         {/* Desktop Navigation Arrows */}
//         {!isMobile && categories.length > 3 && (
//           <div className="flex justify-between items-center mb-8">
//             <button
//               onClick={handlePrevious}
//               disabled={!canGoPrevious || isTransitioning}
//               className={`w-12 h-12 border-2 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer theme-btn ${
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
//               className={`w-12 h-12 border-2 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer theme-btn ${
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
//           <div className="md:hidden -mx-4">
//             <div className="mobile-scroll-container">
//               {categories.map((category) => (
//                 <div key={category._id} className="mobile-scroll-item">
//                   <Card className="overflow-hidden border-0 shadow-md h-full bg-white cursor-default">
//                     <div
//                       className="relative aspect-[16/10] cursor-pointer"
//                       onClick={() => navigateToDetails(category.slug)}
//                     >
//                       <Image
//                         src={getImageUrl(category.image) || FALLBACK_IMAGE}
//                         alt={category.title}
//                         fill
//                         className="object-cover"
//                         placeholder="blur"
//                         blurDataURL={BLUR_PLACEHOLDER}
//                       />
//                       <div className="absolute top-3 left-3">
//                         <Badge className="!bg-blue-600 text-white">{category.badge}</Badge>
//                       </div>
//                     </div>
//                     <CardContent className="p-5">
//                       <div className="flex items-center text-slate-500 text-xs mb-1">
//                         <MapPin className="h-3.5 w-3.5 mr-1" /> {category.duration}
//                       </div>
//                       <h3
//                         className="text-xl font-bold text-slate-900 mb-1 truncate cursor-pointer hover:text-blue-600 transition-colors"
//                         onClick={() => navigateToDetails(category.slug)}
//                       >
//                         {category.title}
//                       </h3>
//                       <div className="flex items-center text-slate-500 text-xs mb-4">
//                         <Calendar className="h-3.5 w-3.5 mr-1" /> {category.travelers}
//                       </div>

//                       <div className="flex flex-col gap-3">
//                         <span className="text-2xl font-bold text-slate-900">
//                           ₹{category.price}
//                         </span>
//                         <Button
//                           variant="outline"
//                           onClick={() => navigateToDetails(category.slug)}
//                           className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 h-12 cursor-pointer theme-btn font-semibold transition-all"
//                         >
//                           View Details <ArrowRight className="ml-2 h-4 w-4" />
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {visibleCategories.map((category) => (
//               <div key={category._id} className="card-enter">
//                 <Card className="overflow-hidden border-0 shadow-lg group transition-all bg-white cursor-default hover:shadow-xl">
//                   <div
//                     className="relative h-64 overflow-hidden cursor-pointer"
//                     onClick={() => navigateToDetails(category.slug)}
//                   >
//                     <Image
//                       src={getImageUrl(category.image) || FALLBACK_IMAGE}
//                       alt={category.title}
//                       fill
//                       className="object-cover transition-transform duration-700 group-hover:scale-105"
//                       placeholder="blur"
//                       blurDataURL={BLUR_PLACEHOLDER}
//                     />
//                   </div>
//                   <CardContent className="p-6">
//                     <div className="flex items-center text-slate-500 text-sm mb-2">
//                       <MapPin className="h-4 w-4 mr-1" /> {category.duration}
//                     </div>
//                     <h3
//                       className="text-xl font-bold text-slate-900 mb-2 truncate cursor-pointer hover:text-blue-600 transition-colors"
//                       onClick={() => navigateToDetails(category.slug)}
//                     >
//                       {category.title}
//                     </h3>
//                     <div className="flex items-center text-slate-500 text-sm mb-4">
//                       <Calendar className="h-4 w-4 mr-1" /> {category.travelers}
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-2xl font-bold text-slate-900">
//                         ₹{category.price}
//                       </span>
//                       <Button
//                         variant="outline"
//                         onClick={() => navigateToDetails(category.slug)}
//                         className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer theme-btn transition-all px-6 font-semibold"
//                       >
//                         View Details{" "}
//                         <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* View All Button - always visible */}
//         <div className="text-center mt-12">
//           <Link href="/holiday-types">
//             <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 text-lg">
//               View All Holiday Types
//               <ArrowRight className="ml-2 h-5 w-5" />
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewHolidaysSection;


"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { SkeletonPackageCard } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";

interface HolidayType {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  duration: string;
  travelers: string;
  badge: string;
  price: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

const NewHolidaysSection = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<HolidayType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = useRef(false);

  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  useEffect(() => {
    const updateMobileState = () => setIsMobile(window.innerWidth < 768);
    updateMobileState();
    window.addEventListener("resize", updateMobileState);
    return () => window.removeEventListener("resize", updateMobileState);
  }, []);

  useEffect(() => {
    const fetchHolidayTypes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/holiday-types");
        if (response.ok) {
          const data = await response.json();
          const activeCategories = data
            .filter((item: HolidayType) => item.isActive)
            .sort((a: HolidayType, b: HolidayType) => a.order - b.order);
          setCategories(activeCategories);
        }
      } catch (error) {
        console.error("Error fetching holiday types:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHolidayTypes();
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
          const itemWidth = itemElement.offsetWidth + 20; // 20px gap
          const newIndex = Math.round(scrollLeft / itemWidth);

          if (newIndex !== currentIndex && newIndex >= 0 && newIndex < categories.length) {
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
  }, [isMobile, currentIndex, categories.length]);

  const handlePrevious = () => {
    if (isMobile || isTransitioning || currentIndex === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleNext = () => {
    if (isMobile || isTransitioning || currentIndex >= categories.length - 3) return;
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
        const itemWidth = itemElement.offsetWidth + 20; // 20px gap
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

  const navigateToDetails = (slug: string) => {
    router.push(`/holiday-types/${slug}`);
  };

  if (loading) {
    return (
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonPackageCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  const visibleCategories = categories.slice(currentIndex, currentIndex + 3);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < categories.length - 3;

  const totalDesktopDots = Math.max(0, categories.length - 2);
  const totalMobileDots = categories.length;

  return (
    <section className="py-16 bg-white">
      <style jsx global>{`
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translateY(30px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .card-enter { 
          animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
        }
        .mobile-scroll-container {
          scroll-snap-type: x mandatory;
          display: flex;
          overflow-x: auto;
          gap: 1.25rem;
          padding: 0 1rem 1.5rem;
          scrollbar-width: none;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        .mobile-scroll-container::-webkit-scrollbar { 
          display: none; 
        }
        .mobile-scroll-item { 
          scroll-snap-align: start;
          scroll-snap-stop: always;
          flex-shrink: 0; 
          width: 85vw; 
          max-width: 320px; 
        }
        
        .pagination-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
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
        <div className="text-center mb-4 relative">
          {/* Decorative Background Element */}
          <div className="absolute left-1/2 -top-10 -translate-x-1/2 w-32 h-32 bg-blue-100/40 blur-3xl rounded-full -z-10" />

          <div className="flex flex-col items-center gap-2 mb-4">
            <h2 className="!text-3xl md:!text-5xl !font-extrabold text-slate-900 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Holiday
              </span>{" "}
              Types
            </h2>

            {/* Rich accent line */}
            <div className="flex items-center gap-2 mt-1">
              <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
              <div className="h-[2px] w-8 bg-gradient-to-l from-transparent to-blue-500 rounded-full" />
            </div>
          </div>

          <p className="!text-sm md:!text-lg !text-slate-500 max-w-2xl mx-auto leading-relaxed px-4">
            From beach getaways to mountain adventures, find the perfect holiday type that matches your travel style
          </p>
        </div>

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

        {isMobile ? (
          <div className="md:hidden -mx-4">
            <div className="mobile-scroll-container" ref={scrollContainerRef}>
              {categories.map((category) => (
                <div key={category._id} className="mobile-scroll-item">
                  <Card className="overflow-hidden border border-gray-200 h-full bg-white flex flex-col">
                    <div className="relative h-52 w-full overflow-hidden">
                      <Image
                        src={getImageUrl(category.image) || FALLBACK_IMAGE}
                        alt={category.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="flex flex-col flex-grow p-4">
                      <div className="flex items-center text-slate-500 text-xs mb-1">
                        <MapPin className="h-3 w-3 mr-1" /> {category.duration}
                      </div>
                      <h3 className="!text-lg !font-bold text-slate-900 mb-2 truncate">
                        {category.title}
                      </h3>
                      <div className="flex items-center text-slate-500 !text-xs mb-1">
                        <Calendar className="h-3 w-3 mr-1" /> {category.travelers}
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-slate-900">
                            ₹{category.price}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => navigateToDetails(category.slug)}
                          className="border-slate-900 border text-slate-900 bg-transparent hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 cursor-pointer px-4 h-9"
                        >
                          View <ArrowRight className="ml-1 h-3 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {totalMobileDots > 1 && (
              <div className="flex justify-center items-center gap-2 mt-3">
                {categories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`pagination-dot ${currentIndex === index ? 'mobile-active' : ''}`}
                    aria-label={`Go to holiday type ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleCategories.map((category) => (
                <div key={category._id} className="card-enter opacity-0">
                  <Card className="overflow-hidden border border-gray-200 group h-full bg-white">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={getImageUrl(category.image) || FALLBACK_IMAGE}
                        alt={category.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center text-slate-500 text-sm mb-2">
                        <MapPin className="h-4 w-4 mr-1" /> {category.duration}
                      </div>
                      <h3 className="!text-xl !font-bold text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                        {category.title}
                      </h3>
                      <div className="flex items-center text-slate-500 text-sm mb-4">
                        <Calendar className="h-4 w-4 mr-1" /> {category.travelers}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold text-slate-900">
                            ₹{category.price}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => navigateToDetails(category.slug)}
                          className="border border-slate-900 text-slate-900 bg-transparent hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 cursor-pointer px-6"
                        >
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
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

        <div className="text-center mt-12 px-2">
          <Link href="/holiday-types" className="inline-block group">
            <button
              className="relative overflow-hidden rounded-full w-full sm:w-auto shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-md pl-8 pr-4 whitespace-nowrap">
                  View All Holiday Types
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

export default NewHolidaysSection;