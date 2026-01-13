// "use client";

// import { Button } from "@/components/ui/button";
// import { Search, Sparkles, Star, Youtube, ChevronDown } from "lucide-react";
// import { motion } from "framer-motion";
// import React, { useState, useEffect } from "react";
// import { SkeletonHero } from "@/components/ui/skeleton";
// import SearchSuggestions from "./SearchSuggestions";
// import { useRouter } from "next/navigation";

// interface HeroContent {
//   title: string;
//   description: string;
//   backgroundImage: string;
//   ctaButtonText: string;
//   secondaryButtonText: string;
// }

// const HeroSection = () => {
//   const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchHeroContent = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("/api/hero");

//         if (!response.ok) {
//           throw new Error("Failed to fetch hero content");
//         }

//         const data = await response.json();
//         setHeroContent(data);
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching hero content:", err);
//         setError("Failed to load hero content");
//         setHeroContent({
//           title: "Your Next Adventure Awaits",
//           description: "Explore, dream, and discover with Paradise Yatra.",
//           backgroundImage: "https://wallpapercave.com/wp/wp10918600.jpg",
//           ctaButtonText: "Explore Packages",
//           secondaryButtonText: "Watch Video",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHeroContent();
//   }, []);

//   if (loading) {
//     return <SkeletonHero />;
//   }
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2,
//         delayChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.8,
//       },
//     },
//   };

//   const titleVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 1,
//       },
//     },
//   };

//   const sparkleVariants = {
//     hidden: { opacity: 0, scale: 0, rotate: -180 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       rotate: 0,
//       transition: {
//         duration: 0.8,
//       },
//     },
//   };

//   const handleSearchSelect = (suggestion: {
//     slug: string;
//     category?: string;
//     type?: string;
//   }) => {
//     setSearchQuery("");
//     setIsSearchOpen(false);

//     // Route based on suggestion type/category
//     if (
//       suggestion.category === "destination" ||
//       suggestion.type === "destination"
//     ) {
//       // Navigate to destinations page for destination suggestions
//       router.push(`/destinations/${suggestion.slug}`);
//     } else if (suggestion.category === "holiday-type") {
//       // Navigate to holiday types page
//       router.push(`/holiday-types/${suggestion.slug}`);
//     } else if (suggestion.category === "fixed-departure") {
//       // Navigate to fixed departures page
//       router.push(`/fixed-departures/${suggestion.slug}`);
//     } else {
//       // Default to itinerary page for packages
//       router.push(`/itinerary/${suggestion.slug}`);
//     }
//   };

//   const handleSearchClose = () => {
//     setIsSearchOpen(false);
//   };

//   return (
//     <section className="hero-section relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden pt-15 sm:pt-24 md:pt-28 lg:pt-32 pb-10 sm:pb-12 md:pb-14 lg:pb-16 px-4 sm:px-6 z-10">
//       <motion.img
//         initial={{ scale: 1.1 }}
//         animate={{ scale: 1 }}
//         transition={{ duration: 1.5, ease: "easeOut" }}
//         src="/Hero_BG.png"
//         alt="hero"
//         className="absolute inset-0 w-full h-full object-cover z-0"
//         loading="eager"
//         fetchPriority="high"
//       />
//       {/* Content */}
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="relative z-20 text-center text-white max-w-4xl mx-auto w-full"
//       >


//         {/* Headline */}
//         <motion.h2
//           variants={titleVariants}
//           className="text-3xl !sm:text-4xl !md:text-5xl !text-white !lg:text-8xl font-extrabold mb-4 sm:mb-6 drop-shadow-2xl leading-tight px-2"
//         >
//           <motion.span
//             className="inline-flex items-center gap-2"
//             whileHover={{ scale: 1.02 }}
//             transition={{ duration: 0.3 }}
//           >
//             {heroContent?.title || "Your Next Adventure Awaits"}
//           </motion.span>
//         </motion.h2>

//         {/* Subheading */}
//         <motion.p
//           variants={itemVariants}
//           className="text-base sm:text-lg !text-white md:text-xl lg:text-2xl mb-4 sm:mb-6  max-w-2xl mx-auto px-2 font-medium"
//         >
//           {heroContent?.description ||
//             "Unforgettable journeys, handpicked for you. Explore, dream, and discover with Paradise Yatra."}
//         </motion.p>

//         {/* CTA Buttons - Full width on mobile */}
//         <motion.div
//           variants={itemVariants}
//           className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center mb-6 sm:mb-8 w-full max-w-2xl mx-auto px-2"
//         >
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ duration: 0.2 }}
//             className="w-full sm:w-auto"
//           >
//             <Button
//               size="lg"
//               className="bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500 cursor-pointer text-white hover:brightness-110 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg transition-all"
//               onClick={() =>
//                 router.push("/packages/category/popular-destinations")
//               }
//             >
//               {heroContent?.ctaButtonText || "Plan My Trip"}
//             </Button>
//           </motion.div>

//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ duration: 0.2 }}
//             className="w-full sm:w-auto"
//           >
//             <Button
//               size="lg"
//               className="bg-white/10 border border-white/30 text-white hover:bg-white/20 cursor-pointer font-medium px-6 py-3 sm:py-4 rounded-xl backdrop-blur-md transition-all"
//               onClick={() =>
//                 window.open("https://www.youtube.com/@ParadiseYatra", "_blank")
//               }
//             >
//               <span className="border-b-2 border-white group-hover:w-full w-0 transition-all duration-300 inline-block"></span>
//               <Youtube className="w-4 h-4 mr-2 text-red-500" />
//               {heroContent?.secondaryButtonText || "Watch Video"}
//             </Button>
//           </motion.div>
//         </motion.div>

//         {/* Enhanced Search Bar - Mobile Optimized */}
//         <motion.div
//           variants={itemVariants}
//           whileHover={{ scale: 1.02 }}
//           className="bg-white/15 backdrop-blur-md rounded-3xl p-3 sm:p-4 md:p-5 max-w-2xl lg:max-w-xl xl:max-w-2xl mx-auto shadow-2xl border border-white/30 relative z-[9998]"
//         >
//           {/* Mobile: Stacked layout, Desktop: Inline layout */}
//           <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 w-full">
//             {/* Destination input with search suggestions */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: 1.0 }}
//               whileHover={{ scale: 1.02 }}
//               className="relative flex-1"
//             >
//               <SearchSuggestions
//                 query={searchQuery}
//                 onQueryChange={setSearchQuery}
//                 onSelect={handleSearchSelect}
//                 isOpen={isSearchOpen}
//                 onClose={handleSearchClose}
//                 variant="hero"
//               />
//             </motion.div>

//             {/* Search button */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: 1.2 }}
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="flex items-center lg:w-auto"
//             >
//               <button
//                 onClick={() => setIsSearchOpen(true)}
//                 className="w-full lg:w-auto lg:px-8 h-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-4 rounded-2xl transition-all duration-200 shadow-lg text-sm flex items-center justify-center gap-2 group"
//               >
//                 <motion.div
//                   whileHover={{ rotate: 360 }}
//                   transition={{ duration: 0.6 }}
//                 >
//                   <Search className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
//                 </motion.div>
//                 Search
//               </button>
//             </motion.div>
//           </div>
//         </motion.div>

//         {/* Popular destinations */}
//         <motion.div
//           variants={itemVariants}
//           className="mt-8 sm:mt-10 md:mt-12 mb-4 sm:mb-6 md:mb-8 w-full"
//         >
//         </motion.div>
//       </motion.div>

//     </section>
//   );
// };

// export default HeroSection;


// "use client";

// import { Button } from "@/components/ui/button";
// import { Search, Sparkles, Star, Youtube, ChevronDown } from "lucide-react";
// import { motion } from "framer-motion";
// import React, { useState, useEffect } from "react";
// import { SkeletonHero } from "@/components/ui/skeleton";
// import SearchSuggestions from "./SearchSuggestions";
// import { useRouter } from "next/navigation";
// import { Permanent_Marker } from 'next/font/google';

// interface HeroContent {
//   title: string;
//   description: string;
//   backgroundImage: string;
//   ctaButtonText: string;
//   secondaryButtonText: string;
// }
// const permanentMarker = Permanent_Marker({
//   weight: '400',
//   subsets: ['latin'],
//   display: 'swap',
// });



// const HeroSection = () => {
//   const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchHeroContent = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("/api/hero");

//         if (!response.ok) {
//           throw new Error("Failed to fetch hero content");
//         }

//         const data = await response.json();
//         setHeroContent(data);
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching hero content:", err);
//         setError("Failed to load hero content");
//         setHeroContent({
//           title: "Your Next Adventure Awaits",
//           description: "Explore, dream, and discover with Paradise Yatra.",
//           backgroundImage: "https://wallpapercave.com/wp/wp10918600.jpg",
//           ctaButtonText: "Explore Packages",
//           secondaryButtonText: "Watch Video",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHeroContent();
//   }, []);

//   if (loading) {
//     return <SkeletonHero />;
//   }
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2,
//         delayChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.8,
//       },
//     },
//   };

//   const titleVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 1,
//       },
//     },
//   };

//   const sparkleVariants = {
//     hidden: { opacity: 0, scale: 0, rotate: -180 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       rotate: 0,
//       transition: {
//         duration: 0.8,
//       },
//     },
//   };

//   const handleSearch = () => {
//     if (searchQuery.trim()) {
//       window.location.href = `/packages?search=${encodeURIComponent(searchQuery)}`;
//     }
//   };

//   const handleSearchSelect = (suggestion: {
//     slug: string;
//     category?: string;
//     type?: string;
//   }) => {
//     setSearchQuery("");
//     setIsSearchOpen(false);

//     // Route based on suggestion type/category
//     if (
//       suggestion.category === "destination" ||
//       suggestion.type === "destination"
//     ) {
//       // Navigate to destinations page for destination suggestions
//       router.push(`/destinations/${suggestion.slug}`);
//     } else if (suggestion.category === "holiday-type") {
//       // Navigate to holiday types page
//       router.push(`/holiday-types/${suggestion.slug}`);
//     } else if (suggestion.category === "fixed-departure") {
//       // Navigate to fixed departures page
//       router.push(`/fixed-departures/${suggestion.slug}`);
//     } else {
//       // Default to itinerary page for packages
//       router.push(`/itinerary/${suggestion.slug}`);
//     }
//   };

//   const handleSearchClose = () => {
//     setIsSearchOpen(false);
//   };

//   return (
//     <section className="hero-section relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden pt-15 sm:pt-24 md:pt-28 lg:pt-32 pb-10 sm:pb-12 md:pb-14 lg:pb-16 px-4 sm:px-6 z-10">
//       <motion.img
//         initial={{ scale: 1.1 }}
//         animate={{ scale: 1 }}
//         transition={{ duration: 1.5, ease: "easeOut" }}
//         src="/Hero_BG.png"
//         alt="hero"
//         className="absolute inset-0 w-full h-full object-cover z-0"
//         loading="eager"
//         fetchPriority="high"
//       />
//       <div className="absolute inset-0 bg-black/20"></div>
//       {/* Content */}
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="relative z-20 text-center text-white max-w-4xl mx-auto w-full"
//       >


//         {/* Headline */}
//         <h1
//           className={`${permanentMarker.className} mb-4 sm:mb-6 !text-7xl leading-tight sm:leading-none`}
//         >
//           Because Travel Should Feel Effortless
//         </h1>

//         {/* Subheading */}
//         <p className="!text-white sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed max-w-2xl sm:max-w-3xl mx-auto px-2">
//           Discover amazing destinations and create unforgettable memories.
//         </p>

//         {/* CTA Buttons - Full width on mobile */}
//         {/* <motion.div
//           variants={itemVariants}
//           className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center mb-6 sm:mb-8 w-full max-w-2xl mx-auto px-2"
//         >
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ duration: 0.2 }}
//             className="w-full sm:w-auto"
//           >
//             <Button
//               size="lg"
//               className="bg-yellow-500 cursor-pointer text-white hover:brightness-110 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg transition-all"
//               onClick={() =>
//                 router.push("/packages/category/popular-destinations")
//               }
//             >
//               {heroContent?.ctaButtonText || "Plan My Trip"}
//             </Button>
//           </motion.div>

//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ duration: 0.2 }}
//             className="w-full sm:w-auto"
//           >
//             <Button
//               size="lg"
//               className="bg-white/10 border border-white/30 text-white hover:bg-white/20 cursor-pointer font-medium px-6 py-3 sm:py-4 rounded-xl backdrop-blur-md transition-all"
//               onClick={() =>
//                 window.open("https://www.youtube.com/@ParadiseYatra", "_blank")
//               }
//             >
//               <span className="border-b-2 border-white group-hover:w-full w-0 transition-all duration-300 inline-block"></span>
//               <Youtube className="w-4 h-4 mr-2 text-red-500" />
//               {heroContent?.secondaryButtonText || "Watch Video"}
//             </Button>
//           </motion.div>
//         </motion.div> */}
//         <motion.div
//   variants={itemVariants}
//   className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center mb-6 sm:mb-8 w-full max-w-2xl mx-auto px-2"
// >
//   {/* Primary CTA - Explore Packages */}
//   <motion.div
//     whileHover={{ scale: 1.04 }}
//     whileTap={{ scale: 0.95 }}
//     transition={{ duration: 0.2 }}
//     className="w-full sm:w-auto"
//   >
//     <button
//       onClick={() => router.push("/packages/category/popular-destinations")}
//       className="group relative overflow-hidden rounded-full w-full shadow-xl hover:shadow-2xl hover:shadow-yellow-500/20 transition-shadow duration-300"
//     >
//       {/* Gradient shimmer effect */}
//       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
//       {/* The pill container */}
//       <div className="flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg relative">
//         {/* Pill text */}
//         <span className="text-white font-bold text-base sm:text-lg pl-6 sm:pl-8 pr-3 sm:pr-4 py-3 sm:py-4 tracking-wide">
//           {heroContent?.ctaButtonText || "Explore Packages"}
//         </span>
        
//         {/* Arrow bubble */}
//         <div className="bg-white rounded-full p-3 sm:p-4 m-1.5 sm:m-2 transition-all duration-300 group-hover:-rotate-45 group-hover:scale-110 shadow-lg">
//           <svg
//             width="20"
//             height="20"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2.5"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className="text-orange-500"
//           >
//             <path d="M5 12h14M12 5l7 7-7 7" />
//           </svg>
//         </div>
//       </div>
//     </button>
//   </motion.div>

//   {/* Secondary CTA - Watch Video */}
//   <motion.div
//     whileHover={{ scale: 1.05 }}
//     whileTap={{ scale: 0.95 }}
//     transition={{ duration: 0.2 }}
//     className="w-full sm:w-auto"
//   >
//     <button
//       onClick={() => window.open("https://www.youtube.com/@ParadiseYatra", "_blank")}
//       className="group relative overflow-hidden w-full rounded-2xl transition-all duration-300"
//     >
//       {/* Glassmorphic background */}
//       <div className="flex items-center justify-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl px-6 sm:px-8 py-3 sm:py-4 shadow-xl transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/30 group-hover:shadow-2xl group-hover:shadow-red-500/10">
        
//         {/* YouTube icon with pulse effect */}
//         <div className="relative">
//           <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity animate-pulse"></div>
//           <div className="relative bg-white rounded-full p-1.5 sm:p-2">
//             <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
//           </div>
//         </div>
        
//         {/* Button text */}
//         <span className="text-white font-semibold text-base sm:text-lg relative">
//           {heroContent?.secondaryButtonText || "Watch Video"}
//           {/* Underline animation */}
//           <span className="absolute bottom-0 left-0 h-0.5 bg-white w-0 group-hover:w-full transition-all duration-300"></span>
//         </span>
        
//         {/* Play indicator */}
//         <div className="w-2 h-2 bg-red-500 rounded-full group-hover:animate-ping"></div>
//       </div>

//       {/* Shimmer effect */}
//       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
//     </button>
//   </motion.div>
// </motion.div>

//         {/* Enhanced Search Bar - Mobile Optimized */}
//         <motion.div
//           variants={itemVariants}
//           className="w-full sm:max-w-md sm:mx-auto px-4 relative z-[9998] mt-6 sm:mt-8"
//         >
//           <SearchSuggestions
//             query={searchQuery}
//             onQueryChange={setSearchQuery}
//             onSelect={handleSearchSelect}
//             isOpen={isSearchOpen}
//             onClose={handleSearchClose}
//             variant="hero"
//           />
//         </motion.div>

//         {/* Popular destinations */}
//         <motion.div
//           variants={itemVariants}
//           className="mt-8 sm:mt-10 md:mt-12 mb-4 sm:mb-6 md:mb-8 w-full"
//         >
//         </motion.div>
//       </motion.div>

//     </section>
//   );
// };

// export default HeroSection;


"use client";

import { Button } from "@/components/ui/button";
import { Search, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { SkeletonHero } from "@/components/ui/skeleton";
import SearchSuggestions from "./SearchSuggestions";
import { useRouter } from "next/navigation";
import { Permanent_Marker } from 'next/font/google';

interface HeroContent {
  title: string;
  description: string;
  backgroundImage: string;
  ctaButtonText: string;
  secondaryButtonText: string;
}

const permanentMarker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const HeroSection = () => {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/hero");

        if (!response.ok) {
          throw new Error("Failed to fetch hero content");
        }

        const data = await response.json();
        setHeroContent(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching hero content:", err);
        setError("Failed to load hero content");
        setHeroContent({
          title: "Your Next Adventure Awaits",
          description: "Explore, dream, and discover with Paradise Yatra.",
          backgroundImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
          ctaButtonText: "Explore Packages",
          secondaryButtonText: "Watch Video",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

  if (loading) {
    return <SkeletonHero />;
  }

  const handleSearchSelect = (suggestion: {
    slug: string;
    category?: string;
    type?: string;
  }) => {
    setSearchQuery("");
    setIsSearchOpen(false);

    if (
      suggestion.category === "destination" ||
      suggestion.type === "destination"
    ) {
      router.push(`/destinations/${suggestion.slug}`);
    } else if (suggestion.category === "holiday-type") {
      router.push(`/holiday-types/${suggestion.slug}`);
    } else if (suggestion.category === "fixed-departure") {
      router.push(`/fixed-departures/${suggestion.slug}`);
    } else {
      router.push(`/itinerary/${suggestion.slug}`);
    }
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20">
      
      {/* Background Image - Travel themed */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
          alt="Travel Background"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80"></div>
      </motion.div>

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          
          {/* Title - Fully Responsive */}
          <h1 className={`${permanentMarker.className} text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.1] sm:leading-[1.1] mb-4 sm:mb-6 drop-shadow-2xl px-2`}>
            Because Travel Should Feel Effortless
          </h1>

          {/* Subtitle - Fully Responsive */}
          <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl !text-white mb-8 sm:mb-10 md:mb-12 leading-relaxed max-w-3xl mx-auto px-2 font-light">
            Discover amazing destinations and create unforgettable memories.
          </p>

          {/* Search Bar - Mobile First */}
          <div className="w-full max-w-3xl mx-auto mb-8 sm:mb-10 px-2">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30 p-3 sm:p-4 transition-all duration-300 hover:shadow-yellow-400/30">
              <div className="flex flex-col sm:flex-row gap-3">
                
                {/* Search Input - Full width mobile */}
                <div className="flex-1 min-w-0">
                  <SearchSuggestions
                    query={searchQuery}
                    onQueryChange={setSearchQuery}
                    onSelect={handleSearchSelect}
                    isOpen={isSearchOpen}
                    onClose={handleSearchClose}
                    variant="hero"
                  />
                </div>
                
         
              </div>
            </div>
          </div>

          {/* CTA Buttons - Perfectly Centered & Responsive */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center max-w-2xl mx-auto px-2">
            
            {/* Primary Button - Explore Packages */}
            <button
              onClick={() => router.push("/packages/category/popular-destinations")}
              className="group relative overflow-hidden rounded-full w-full sm:w-auto shadow-2xl hover:shadow-yellow-400/40 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="flex items-center justify-center bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full relative">
                <span className="text-white font-bold text-base sm:text-lg pl-6 sm:pl-8 pr-3 sm:pr-4 py-3.5 sm:py-4 whitespace-nowrap">
                  {heroContent?.ctaButtonText || "Explore Packages"}
                </span>
                
                <div className="bg-white rounded-full p-3 sm:p-3.5 m-2 transition-all duration-300 group-hover:-rotate-45 group-hover:scale-110 shadow-lg">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>

            {/* Secondary Button - Watch Video */}
            <button
              onClick={() => window.open("https://www.youtube.com/@ParadiseYatra", "_blank")}
              className="group relative overflow-hidden rounded-2xl w-full sm:w-auto transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-2xl px-6 sm:px-8 py-3.5 sm:py-4 shadow-2xl transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/40">
                
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-white rounded-full p-2">
                    <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  </div>
                </div>
                
                <span className="text-white font-bold text-base sm:text-lg relative whitespace-nowrap">
                  {heroContent?.secondaryButtonText || "Watch Video"}
                  <span className="absolute bottom-0 left-0 h-0.5 bg-white w-0 group-hover:w-full transition-all duration-300"></span>
                </span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;