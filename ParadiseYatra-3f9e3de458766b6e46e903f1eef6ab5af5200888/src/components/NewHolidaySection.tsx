// "use client";

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ArrowRight, MapPin, Calendar } from "lucide-react";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { getImageUrl } from "@/lib/utils";
// import { SkeletonPackageCard } from "@/components/ui/skeleton";
// import Skeleton from "@/components/ui/skeleton";

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
//   const [categories, setCategories] = useState<HolidayType[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchHolidayTypes = async () => {
//       try {
//         const response = await fetch("/api/holiday-types");
//         if (response.ok) {
//           const data = await response.json();
//           // Filter only active holiday types and sort by order
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

//   if (loading) {
//     return (
//       <section className="section-padding bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <Skeleton height="2.5rem" width="300px" className="mx-auto mb-4" />
//             <Skeleton height="1.25rem" width="200px" className="mx-auto" />
//           </div>
//           <div className="flex gap-4 overflow-x-auto scrollbar-hide">
//             {Array.from({ length: 4 }).map((_, index) => (
//               <div key={index} className="flex-shrink-0 w-80">
//                 <SkeletonPackageCard />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-20 bg-slate-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <Badge className="mb-4 !bg-blue-100 !font-regular !text-blue-800 !rounded-md hover:bg-blue-100 !px-1 !py-1">
//             Holiday Types
//           </Badge>
//           <h2
//             className=" text-slate-900 mb-4"
//             style={{
//               fontSize: "48px",
//               fontWeight: 700,
//               lineHeight: "48px",
//             }}
//           >
//             Holidays for Every Traveler
//           </h2>
//           <p className="text-[20px] text-slate-600 max-w-3xl mx-auto">
//             From beach getaways to mountain adventures, find the perfect holiday
//             type that matches your travel style
//           </p>
//         </div>

//         <div className="md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {categories.map((category) => (
//             <div key={category._id} className="h-full flex flex-col">
//               <Link
//                 href={`/holiday-types/${category.slug}`}
//                 className="block h-full"
//               >
//                 <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group h-full border-0">
//                   <div className="relative overflow-hidden">
//                     <Image
//                       src={
//                         getImageUrl(category.image) ||
//                         "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
//                       }
//                       alt={category.title}
//                       width={800}
//                       height={400}
//                       className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
//                       onError={(e) => {
//                         const target = e.target as HTMLImageElement;
//                         target.src =
//                           "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
//                       }}
//                     />
//                     <div className="absolute top-4 left-4 mt-1">
//                       <Badge className="!bg-[#3B82F6] text-white">
//                         {category.badge}
//                       </Badge>
//                     </div>
//                   </div>

//                   <CardContent
//                     className="!p-[22px]"
//                     style={{
//                       fontFamily:
//                         '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
//                     }}
//                   >
//                     <div
//                       className="flex items-center text-slate-500 mb-2"
//                       style={{ fontSize: "14px", lineHeight: "20px" }}
//                     >
//                       <MapPin className="h-4 w-4 mr-1" />
//                       {category.duration}
//                     </div>
//                     <h3
//                       className="text-slate-900 mb-2 truncate group-hover:!text-[#2563EB] transition-colors"
//                       style={{
//                         fontSize: "20px",
//                         fontWeight: 700,
//                         lineHeight: "28px",
//                         fontFamily:
//                           '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
//                       }}
//                     >
//                       {category.title}
//                     </h3>
//                     <div
//                       className="flex items-center text-slate-500 mb-4"
//                       style={{ fontSize: "14px", lineHeight: "20px" }}
//                     >
//                       <Calendar className="h-4 w-4 mr-1" />
//                       {category.travelers}
//                     </div>

//                     <div className="flex items-center justify-between mt-1">
//                       <div className="flex items-center space-x-2">
//                         <span className="text-[24px] font-bold text-[#0F172A]">
//                           ₹{category.price}
//                         </span>
//                       </div>
//                       <Button
//                         variant="outline"
//                         className="hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
//                         style={{
//                           fontSize: "14px",
//                           fontWeight: 500,
//                           lineHeight: "20px",
//                           height: "36px",
//                           width: "144px",
//                           padding: "8px 16px",
//                         }}
//                       >
//                         View Details
//                         <ArrowRight className="ml-2 h-4 w-4" />
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </Link>
//             </div>
//           ))}
//         </div>

//         <div className="text-center mt-12">
//           <Link href="/holiday-types">
//             <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8">
//               View All Holiday Types
//               <ArrowRight className="ml-2 h-4 w-4" />
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
import { Badge } from "@/components/ui/badge";
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
import Link from "next/link"; // ← Import the correct Next.js Link
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

  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  const BLUR_PLACEHOLDER =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

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

  const navigateToDetails = (slug: string) => {
    router.push(`/holiday-types/${slug}`);
  };

  if (loading) {
    return (
      <section className="py-20 bg-slate-50 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonPackageCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const visibleCategories = categories.slice(currentIndex, currentIndex + 3);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < categories.length - 3;

  return (
    <section className="py-20 bg-white">
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .card-enter {
          animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .theme-btn:focus-visible {
          outline: 2px solid #2563eb !important;
          outline-offset: 2px;
        }

        .mobile-scroll-container {
          scroll-snap-type: x mandatory;
          scroll-padding: 0 7.5%;
          display: flex;
          overflow-x: auto;
          gap: 1rem;
          padding: 0 7.5% 1.5rem;
          scrollbar-width: none;
        }
        .mobile-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .mobile-scroll-item {
          scroll-snap-align: center;
          flex-shrink: 0;
          width: 85%;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge className="mb-4 !bg-blue-100 !text-blue-800">Holiday Types</Badge>
          <h2 className="!text-4xl md:text-5xl !font-bold text-slate-900 mb-4">
            Holidays for Every Traveler
          </h2>
          <p className="text-xl !text-slate-600 max-w-3xl mx-auto">
            From beach getaways to mountain adventures, find the perfect holiday type that matches
            your travel style
          </p>
        </div>

        {/* Desktop Navigation Arrows */}
        {!isMobile && categories.length > 3 && (
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious || isTransitioning}
              className={`w-12 h-12 border-2 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer theme-btn ${
                !canGoPrevious || isTransitioning
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:shadow-xl hover:scale-110"
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              disabled={!canGoNext || isTransitioning}
              className={`w-12 h-12 border-2 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer theme-btn ${
                !canGoNext || isTransitioning
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:shadow-xl hover:scale-110"
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {isMobile ? (
          <div className="md:hidden -mx-4">
            <div className="mobile-scroll-container">
              {categories.map((category) => (
                <div key={category._id} className="mobile-scroll-item">
                  <Card className="overflow-hidden border-0 shadow-md h-full bg-white cursor-default">
                    <div
                      className="relative aspect-[16/10] cursor-pointer"
                      onClick={() => navigateToDetails(category.slug)}
                    >
                      <Image
                        src={getImageUrl(category.image) || FALLBACK_IMAGE}
                        alt={category.title}
                        fill
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="!bg-blue-600 text-white">{category.badge}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center text-slate-500 text-xs mb-1">
                        <MapPin className="h-3.5 w-3.5 mr-1" /> {category.duration}
                      </div>
                      <h3
                        className="text-xl font-bold text-slate-900 mb-1 truncate cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => navigateToDetails(category.slug)}
                      >
                        {category.title}
                      </h3>
                      <div className="flex items-center text-slate-500 text-xs mb-4">
                        <Calendar className="h-3.5 w-3.5 mr-1" /> {category.travelers}
                      </div>

                      <div className="flex flex-col gap-3">
                        <span className="text-2xl font-bold text-slate-900">
                          ₹{category.price}
                        </span>
                        <Button
                          variant="outline"
                          onClick={() => navigateToDetails(category.slug)}
                          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 h-12 cursor-pointer theme-btn font-semibold transition-all"
                        >
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleCategories.map((category) => (
              <div key={category._id} className="card-enter">
                <Card className="overflow-hidden border-0 shadow-lg group transition-all bg-white cursor-default hover:shadow-xl">
                  <div
                    className="relative h-64 overflow-hidden cursor-pointer"
                    onClick={() => navigateToDetails(category.slug)}
                  >
                    <Image
                      src={getImageUrl(category.image) || FALLBACK_IMAGE}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDER}
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center text-slate-500 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" /> {category.duration}
                    </div>
                    <h3
                      className="text-xl font-bold text-slate-900 mb-2 truncate cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => navigateToDetails(category.slug)}
                    >
                      {category.title}
                    </h3>
                    <div className="flex items-center text-slate-500 text-sm mb-4">
                      <Calendar className="h-4 w-4 mr-1" /> {category.travelers}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-slate-900">
                        ₹{category.price}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => navigateToDetails(category.slug)}
                        className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer theme-btn transition-all px-6 font-semibold"
                      >
                        View Details{" "}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* View All Button - always visible */}
        <div className="text-center mt-12">
          <Link href="/holiday-types">
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 text-lg">
              View All Holiday Types
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewHolidaysSection;