"use client";

import { createLazyComponent } from "./ui/lazy-wrapper";
import { SkeletonHero, SkeletonPackageCard } from "./ui/skeleton";
import Skeleton from "./ui/skeleton";

// Lazy load all components with consistent loading states and optimized intersection observer settings
export const LazyHeader = createLazyComponent(
  () => import("./Header"),
  <div className="min-h-[80px] bg-white flex items-center justify-center">
    <Skeleton height="40px" width="200px" />
  </div>,
  { threshold: 0.1, rootMargin: "100px" }
);

export const LazyHeroSection = createLazyComponent(
  () => import("./HeroSection"),
  <SkeletonHero />,
  { threshold: 0.1, rootMargin: "200px" }
);

export const LazyTrendingDestinations = createLazyComponent(
  () => import("./TrendingDestinations"),
  <div className="section-padding bg-white px-4 sm:px-6">
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <Skeleton height="2.5rem" width="300px" className="mx-auto mb-4" />
        <Skeleton height="1.25rem" width="200px" className="mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonPackageCard key={index} />
        ))}
      </div>
    </div>
  </div>,
  { threshold: 0.1, rootMargin: "150px" }
);

export const LazyFixedDepartureCarousel = createLazyComponent(
  () => import("./FixedDepartureCarousel"),
  <div className="section-padding bg-white px-4 sm:px-6">
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <Skeleton height="2.5rem" width="300px" className="mx-auto mb-4" />
        <Skeleton height="1.25rem" width="200px" className="mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonPackageCard key={index} />
        ))}
      </div>
    </div>
  </div>,
  { threshold: 0.1, rootMargin: "150px" }
);

export const LazyRecentlyBooked = createLazyComponent(
  () => import("./RecentlyBooked"),
  <div className="section-padding bg-white px-4 sm:px-6">
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <Skeleton height="2.5rem" width="300px" className="mx-auto mb-4" />
        <Skeleton height="1.25rem" width="200px" className="mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonPackageCard key={index} />
        ))}
      </div>
    </div>
  </div>,
  { threshold: 0.1, rootMargin: "100px" }
);

export const LazyHolidaysSection = createLazyComponent(
  () => import("./HolidaysSection"),
  <div className="section-padding bg-white px-4 sm:px-6">
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <Skeleton height="2.5rem" width="300px" className="mx-auto mb-4" />
        <Skeleton height="1.25rem" width="200px" className="mx-auto" />
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex-shrink-0 w-80">
            <SkeletonPackageCard />
          </div>
        ))}
      </div>
    </div>
  </div>,
  { threshold: 0.1, rootMargin: "150px" }
);

export const LazyDestinationsGrid = createLazyComponent(
  () => import("./DestinationsGrid"),
  <div className="section-padding bg-white px-4 sm:px-6">
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <Skeleton height="2.5rem" width="300px" className="mx-auto mb-4" />
        <Skeleton height="1.25rem" width="200px" className="mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonPackageCard key={index} />
        ))}
      </div>
    </div>
  </div>,
  { threshold: 0.1, rootMargin: "200px" }
);

export const LazyPremiumPackages = createLazyComponent(
  () => import("./PremiumPackages"),
  <div className="section-padding bg-white px-4 sm:px-6">
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <Skeleton height="2.5rem" width="300px" className="mx-auto mb-4" />
        <Skeleton height="1.25rem" width="200px" className="mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonPackageCard key={index} />
        ))}
      </div>
    </div>
  </div>,
  { threshold: 0.1, rootMargin: "150px" }
);

export const LazyAdventureEscapes = createLazyComponent(
  () => import("./AdventureEscapes"),
  <div className="section-padding bg-white px-4 sm:px-6">
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <Skeleton height="2.5rem" width="300px" className="mx-auto mb-4" />
        <Skeleton height="1.25rem" width="200px" className="mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonPackageCard key={index} />
        ))}
      </div>
    </div>
  </div>,
  { threshold: 0.1, rootMargin: "150px" }
);

export const LazyBlogSection = createLazyComponent(
  () => import("./BlogSection"),
  <div className="section-padding bg-white px-4 sm:px-6">
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <Skeleton height="2.5rem" width="300px" className="mx-auto mb-4" />
        <Skeleton height="1.25rem" width="200px" className="mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonPackageCard key={index} />
        ))}
      </div>
    </div>
  </div>,
  { threshold: 0.1, rootMargin: "150px" }
);

export const LazyTestimonialSection = createLazyComponent(
  () => import("./TestimonialSection"),
  <div className="section-padding bg-white px-4 sm:px-6">
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <Skeleton height="2.5rem" width="300px" className="mx-auto mb-4" />
        <Skeleton height="1.25rem" width="200px" className="mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonPackageCard key={index} />
        ))}
      </div>
    </div>
  </div>,
  { threshold: 0.1, rootMargin: "100px" }
);

export const LazyCTASection = createLazyComponent(
  () => import("./CTASection"),
  <div className="section-padding bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
    <div className="container mx-auto px-4">
      <div className="text-center text-white">
        <div className="mb-8">
          <Skeleton height="2.5rem" width="300px" className="mx-auto mb-4 bg-white/20" />
          <Skeleton height="1.25rem" width="200px" className="mx-auto bg-white/20" />
        </div>
        <div className="max-w-3xl mx-auto mb-8">
          <Skeleton height="1.5rem" width="100%" className="mb-4 bg-white/20" />
          <Skeleton height="1.5rem" width="80%" className="mx-auto bg-white/20" />
        </div>
      </div>
    </div>
  </div>,
  { threshold: 0.1, rootMargin: "100px" }
);

export const LazyFooter = createLazyComponent(
  () => import("./Footer"),
  <div className="min-h-[300px] bg-gray-900 flex items-center justify-center">
    <Skeleton height="40px" width="200px" className="bg-white/20" />
  </div>,
  { threshold: 0.1, rootMargin: "100px" }
); 