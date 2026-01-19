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
          <p className="text-md xs:text-base sm:text-lg md:text-xl lg:text-2xl !text-white mb-8 sm:mb-10 md:mb-12 leading-relaxed max-w-3xl mx-auto px-2 font-light">
            Discover amazing destinations and create unforgettable memories.
          </p>

          {/* Search Bar - Mobile First */}
          <div className="w-full max-w-3xl mx-auto mb-8 sm:mb-10 px-2">
            <div className="transition-all duration-300 hover:shadow-yellow-400/30">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3  rounded-md">
                
                {/* Search Input - Full width mobile */}
                <div className="flex-1 min-w-0 ">
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
          <div className="flex flex-row gap-2 sm:gap-5 justify-center items-center max-w-2xl mx-auto px-2">
            
            {/* Primary Button - Explore Packages */}
            <button
              onClick={() => router.push("/packages/category/popular-destinations")}
              className="group relative overflow-hidden rounded-full flex-1 sm:flex-none sm:w-auto shadow-2xl hover:shadow-yellow-400/40 transition-all duration-300 hover:scale-105 active:scale-95 min-w-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="flex items-center justify-center bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full relative">
                <span className="text-white font-semibold text-xs sm:text-base pl-2 sm:pl-6 pr-1 sm:pr-3 py-2.5 sm:py-2.5 whitespace-nowrap truncate">
                  {heroContent?.ctaButtonText || "Explore Packages"}
                </span>
                
                <div className="bg-white rounded-full p-1.5 sm:p-2.5 m-1.5 sm:m-2 transition-all duration-300 group-hover:-rotate-45 group-hover:scale-110 shadow-lg flex-shrink-0">
                  <svg
                    className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-orange-600"
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
              className="group relative overflow-hidden rounded-2xl flex-1 sm:flex-none sm:w-auto transition-all duration-300 hover:scale-105 active:scale-95 min-w-0"
            >
              <div className="flex items-center justify-center gap-1.5 sm:gap-3 bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-2xl px-2 sm:px-6 py-2.5 sm:py-2.5 shadow-2xl transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/40">
                
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-white rounded-full p-1 sm:p-2">
                    <Youtube className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                  </div>
                </div>
                
                <span className="text-white font-semibold text-xs sm:text-base relative whitespace-nowrap truncate">
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