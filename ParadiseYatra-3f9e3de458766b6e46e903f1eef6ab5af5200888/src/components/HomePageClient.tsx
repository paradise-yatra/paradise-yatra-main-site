"use client";

import { memo, useMemo, useState } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import {
  LazyHeader,
  LazyHeroSection,
  LazyTrendingDestinations,
  LazyHolidaysSection,
  LazyDestinationsGrid,
  LazyPremiumPackages,
  LazyAdventureEscapes,
  LazyBlogSection,
  LazyTestimonialSection,
  LazyCTASection,
  LazyFooter,
} from "@/components/lazy-components";
import PerformanceMonitor from "@/components/ui/PerformanceMonitor";
import ShutdownPopup from "@/components/ShutdownPopup";
import NewsletterSubscribe from "./NewsLetter";

import HoneymoonPackages from "./HoneymoonPackages";
import TrendingPackagesSection from "./TrendingPackagesSection";
import WhyChooseParadiseYatra from "./WhyChooseParadiseYatra";
import IndiaTourPackagesSection from "./IndiaTourPackagesSection";
import InternationalTourPackagesSection from "./InternationalTourPackagesSection";
import LuxuryPackagesSection from "./LuxuryPackagesSection";
import SpiritualJourneysSection from "./SpiritualJourneysSection";
import FestivalSection from "./FestivalSection";
import TestimonialsSection from "./TestimonialsSection";
import BlogSectionNew from "./BlogSectionNew";
import RecentlyBookedItineraries from "./RecentlyBookedItineraries";
import WildlifeTourPackagesSection from "./SeasonalPackagesSection";
import SeasonalPackagesSection from "./SeasonalPackagesSection";


const HomePageClient = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  const [showShutdownPopup, setShowShutdownPopup] = useState(false);

  // Optimize animations based on user preferences
  const pageVariants = useMemo(
    () => ({
      initial: { opacity: prefersReducedMotion ? 1 : 0 },
      animate: { opacity: 1 },
      transition: {
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: "easeInOut" as const,
      } satisfies Transition,
    }),
    [prefersReducedMotion]
  );

  return (
    <motion.div
      initial={pageVariants.initial}
      animate={pageVariants.animate}
      transition={pageVariants.transition}
      className="min-h-screen bg-background overflow-x-hidden w-full"
      role="main"
      aria-label="Paradise Yatra - Travel Packages and Destinations"
    >
      <LazyHeader />
      {/* <NewHero2 /> */}
      {/* <NewHero /> */}
      {/* <div className="min-h-72 bg-gray-100 w-full"></div> */}
      <LazyHeroSection />
      {/* <LazyFixedDepartureCarousel /> */}
      <HoneymoonPackages />
      <TrendingPackagesSection />
      <WhyChooseParadiseYatra />
      <IndiaTourPackagesSection />
      <InternationalTourPackagesSection />
      <SpiritualJourneysSection />
      <LuxuryPackagesSection />

      <SeasonalPackagesSection />
      <FestivalSection />
      <TestimonialsSection />
      <BlogSectionNew />

      <NewsletterSubscribe />

      {/* Performance monitoring - only visible in development */}
      <PerformanceMonitor showInProduction={false} />

      {/* Shutdown Popup - you can control this with state */}
      <ShutdownPopup isOpen={showShutdownPopup} />
    </motion.div>
  );
});

HomePageClient.displayName = "HomePageClient";

export default HomePageClient;
