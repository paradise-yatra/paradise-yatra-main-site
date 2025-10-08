"use client";

import { Button } from "@/components/ui/button";
import { Search, Sparkles, Star, Youtube, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { SkeletonHero } from "@/components/ui/skeleton";
import SearchSuggestions from "./SearchSuggestions";
import { useRouter } from "next/navigation";

interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  trustBadgeText: string;
  popularDestinations: string[];
  ctaButtonText: string;
  secondaryButtonText: string;
}

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
        const response = await fetch('/api/hero');

        if (!response.ok) {
          throw new Error('Failed to fetch hero content');
        }

        const data = await response.json();
        setHeroContent(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching hero content:', err);
        setError('Failed to load hero content');
        // Set default content as fallback
        setHeroContent({
          title: "Your Next Adventure Awaits",
          subtitle: "Unforgettable journeys, handpicked for you",
          description: "Explore, dream, and discover with Paradise Yatra.",
          backgroundImage: "https://wallpapercave.com/wp/wp10918600.jpg",
          trustBadgeText: "Trusted by 5000+ travelers",
          popularDestinations: ["Himachal Pradesh", "Uttarakhand", "Bali", "Europe", "Goa"],
          ctaButtonText: "Explore Packages",
          secondaryButtonText: "Watch Video"
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

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1
      }
    }
  };

  const sparkleVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8
      }
    }
  };

  const handleSearchSelect = (suggestion: { slug: string; category?: string; type?: string }) => {
    setSearchQuery("");
    setIsSearchOpen(false);
    
    // Route based on suggestion type/category
    if (suggestion.category === 'destination' || suggestion.type === 'destination') {
      // Navigate to destinations page for destination suggestions
      router.push(`/destinations/${suggestion.slug}`);
    } else if (suggestion.category === 'holiday-type') {
      // Navigate to holiday types page
      router.push(`/holiday-types/${suggestion.slug}`);
    } else if (suggestion.category === 'fixed-departure') {
      // Navigate to fixed departures page
      router.push(`/fixed-departures/${suggestion.slug}`);
    } else {
      // Default to itinerary page for packages
      router.push(`/itinerary/${suggestion.slug}`);
    }
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  return (
    <section className="hero-section relative min-h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden pt-15 sm:pt-24 md:pt-28 lg:pt-32 pb-10 sm:pb-12 md:pb-14 lg:pb-16 px-4 sm:px-6 z-10">
      {/* Image background */}
      <motion.img
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        src={heroContent?.backgroundImage || "/banner.jpeg"}
        alt="hero"
        className="absolute inset-0 w-full h-full object-cover z-0"
        loading="eager"
        fetchPriority="high"
      />

      {/* Enhanced overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 z-10" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 text-center text-white max-w-4xl mx-auto w-full"
      >
        {/* Trust badge */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-4 sm:mb-6 mt-8"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-md px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-xl border border-white/20"
          >
            <motion.div
              variants={sparkleVariants}
              animate="visible"
              initial="hidden"
            >
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
            </motion.div>
            {heroContent?.trustBadgeText || "Trusted by 5000+ travelers"}
          </motion.span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          variants={titleVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 sm:mb-6 drop-shadow-2xl leading-tight px-2"
        >
          <motion.span
            className="inline-flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              variants={sparkleVariants}
              animate="visible"
              initial="hidden"
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-200" />
            </motion.div>
            {heroContent?.title || "Your Next Adventure Awaits"}
          </motion.span>
        </motion.h2>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 opacity-95 max-w-2xl mx-auto px-2 font-medium"
        >
          {heroContent?.description || "Unforgettable journeys, handpicked for you. Explore, dream, and discover with Paradise Yatra."}
        </motion.p>

        {/* CTA Buttons - Full width on mobile */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center mb-6 sm:mb-8 w-full max-w-2xl mx-auto px-2"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500 cursor-pointer text-white hover:brightness-110 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg transition-all"
              onClick={() => router.push('/packages/category/popular-destinations')}
            >
              {heroContent?.ctaButtonText || "Plan My Trip"}
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="bg-white/10 border border-white/30 text-white hover:bg-white/20 cursor-pointer font-medium px-6 py-3 sm:py-4 rounded-xl backdrop-blur-md transition-all"
              onClick={() => window.open('https://www.youtube.com/@ParadiseYatra', '_blank')}
            >
              <span className="border-b-2 border-white group-hover:w-full w-0 transition-all duration-300 inline-block"></span>
              <Youtube className="w-4 h-4 mr-2 text-red-500" />
              {heroContent?.secondaryButtonText || "Watch Video"}
            </Button>


          </motion.div>
        </motion.div>

        {/* Enhanced Search Bar - Mobile Optimized */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-white/15 backdrop-blur-md rounded-3xl p-3 sm:p-4 md:p-5 max-w-2xl lg:max-w-xl xl:max-w-2xl mx-auto shadow-2xl border border-white/30 relative z-[9998]"
        >
          {/* Mobile: Stacked layout, Desktop: Inline layout */}
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 w-full">
            {/* Destination input with search suggestions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              whileHover={{ scale: 1.02 }}
              className="relative flex-1"
            >
              <SearchSuggestions
                query={searchQuery}
                onQueryChange={setSearchQuery}
                onSelect={handleSearchSelect}
                isOpen={isSearchOpen}
                onClose={handleSearchClose}
                variant="hero"
              />
            </motion.div>

            {/* Search button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center lg:w-auto"
            >
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full lg:w-auto lg:px-8 h-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-4 rounded-2xl transition-all duration-200 shadow-lg text-sm flex items-center justify-center gap-2 group"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Search className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                </motion.div>
                Search
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Popular destinations */}
        <motion.div
          variants={itemVariants}
          className="mt-8 sm:mt-10 md:mt-12 mb-4 sm:mb-6 md:mb-8 w-full"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="text-center mb-4 sm:mb-5"
          >
            <span className="text-white/80 font-medium text-sm sm:text-base tracking-wide uppercase">
              Popular Destinations
            </span>
          </motion.div>
          
          <div className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center items-center gap-2 sm:gap-3 md:gap-4 px-4 sm:px-6 md:px-8 overflow-x-auto sm:overflow-x-visible scrollbar-hide">
            {(heroContent?.popularDestinations || ["Himachal Pradesh", "Uttarakhand", "Bali", "Europe", "Goa"]).map((dest, index) => (
              <motion.button
                key={dest}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                whileHover={{
                  scale: 1.08,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-white/20 backdrop-blur-md text-white px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full transition-all duration-300 text-xs font-medium cursor-pointer border border-white/30 shadow-lg hover:shadow-2xl hover:border-white/50 overflow-hidden flex-shrink-0"
                onClick={() => {
                  setSearchQuery(dest);
                  setIsSearchOpen(true);
                }}
              >
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Text with relative positioning */}
                <span className="relative z-10">{dest}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Cue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
        className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="flex flex-col items-center gap-1 cursor-pointer group pointer-events-auto"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            });
          }}
        >
          <span className="text-white/70 text-xs font-medium tracking-wide uppercase group-hover:text-white transition-colors duration-300">
            Scroll
          </span>
          <motion.div
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.2 }}
            className="w-6 h-6 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white/25 transition-colors duration-300"
          >
            <ChevronDown className="w-3 h-3 text-white group-hover:text-white/90" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;