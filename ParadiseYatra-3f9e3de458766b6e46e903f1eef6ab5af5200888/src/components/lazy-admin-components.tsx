"use client";

import { createLazyComponent } from "./ui/lazy-wrapper";
import Loading from "./ui/loading";

// Lazy load all admin components with consistent loading states and error handling
export const LazyAdminSidebar = createLazyComponent(
  () => import("./admin/AdminSidebar").catch(err => {
    console.error("Failed to load AdminSidebar:", err);
    return Promise.reject(err);
  }),
  <Loading size="lg" className="min-h-[100vh]" />
);

export const LazyAdminDashboard = createLazyComponent(
  () => import("./admin/AdminDashboard").catch(err => {
    console.error("Failed to load AdminDashboard:", err);
    return Promise.reject(err);
  }),
  <Loading size="lg" className="min-h-[400px]" />
);



export const LazyAdminBlogs = createLazyComponent(
  () => import("./admin/AdminBlogs").catch(err => {
    console.error("Failed to load AdminBlogs:", err);
    return Promise.reject(err);
  }),
  <Loading size="lg" className="min-h-[400px]" />
);

export const LazyAdminSEO = createLazyComponent(
  () => import("./admin/AdminSEO").catch(err => {
    console.error("Failed to load AdminSEO:", err);
    return Promise.reject(err);
  }),
  <Loading size="lg" className="min-h-[400px]" />
);


export const LazyAdminMenu = createLazyComponent(
  () => import("./admin/AdminMenu").catch(err => {
    console.error("Failed to load AdminMenu:", err);
    return Promise.reject(err);
  }),
  <Loading size="lg" className="min-h-[400px]" />
);

export const LazyAdminTrendingDestinations = createLazyComponent(
  () => import("./admin/AdminTrendingDestinations").catch(err => {
    console.error("Failed to load AdminTrendingDestinations:", err);
    return Promise.reject(err);
  }),
  <Loading size="lg" className="min-h-[400px]" />
);

export const LazyAdminRecentlyBooked = createLazyComponent(
  () => import("./admin/AdminRecentlyBooked").catch(err => {
    console.error("Failed to load AdminRecentlyBooked:", err);
    return Promise.reject(err);
  }),
  <Loading size="lg" className="min-h-[400px]" />
);

export const LazyAdminPremiumPackages = createLazyComponent(
  () => import("./admin/AdminPremiumPackages").catch(err => {
    console.error("Failed to load AdminPremiumPackages:", err);
    return Promise.reject(err);
  }),
  <Loading size="lg" className="min-h-[400px]" />
);

export const LazyAdminAdventurePackages = createLazyComponent(
  () => import("./admin/AdminAdventurePackages").catch(err => {
    console.error("Failed to load AdminAdventurePackages:", err);
    return Promise.reject(err);
  }),
  <Loading size="lg" className="min-h-[400px]" />
);

export const LazyAdminHeroSection = createLazyComponent(
  () => import("./admin/AdminHeroSection").catch(err => {
    console.error("Failed to load AdminHeroSection:", err);
    return Promise.reject(err);
  }),
  <Loading size="lg" className="min-h-[400px]" />
);



export const LazyAdminTestimonials = createLazyComponent(
  () => import("./admin/AdminTestimonials").catch(err => {
    console.error("Failed to load AdminTestimonials:", err);
    return Promise.reject(err);
  }),
  <Loading size="lg" className="min-h-[400px]" />
);

export const LazyAdminCTASection = createLazyComponent(
  () => import("./admin/AdminCTASection").catch(err => {
    console.error("Failed to load AdminCTASection:", err);
    return Promise.reject(err);
  }),
  <Loading size="lg" className="min-h-[400px]" />
);

export const LazyAdminStats = createLazyComponent(
  () => import("./admin/AdminStats").catch(err => {
    console.error("Failed to load AdminStats:", err);
    return Promise.reject(err);
  }),
  <Loading size="lg" className="min-h-[400px]" />
);

export const LazyAdminItinerary = createLazyComponent(
  () => import("./admin/AdminItinerary").catch(err => {
    console.error("Failed to load AdminItinerary:", err);
    return Promise.reject(err);
  }),
  <Loading size="lg" className="min-h-[400px]" />
);

export const LazyAdminPopularDestinations = createLazyComponent(
  () => import("./admin/AdminPopularDestinations").catch(err => {
    console.error("Failed to load AdminPopularDestinations:", err);
    return Promise.reject(err);
  }),
  <Loading size="lg" className="min-h-[400px]" />
);

export const LazyAdminHolidayTypes = createLazyComponent(
  () => import("./admin/AdminHolidayTypes").catch(err => {
    console.error("Failed to load AdminHolidayTypes:", err);
    return Promise.reject(err);
  }),
  <Loading size="lg" className="min-h-[400px]" />
);

export const LazyAdminFixedDepartures = createLazyComponent(
  () => import("./admin/AdminFixedDepartures").catch(err => {
    console.error("Failed to load AdminFixedDepartures:", err);
    return Promise.reject(err);
  }),
  <Loading size="lg" className="min-h-[400px]" />
);

export const LazyAdminFooter = createLazyComponent(
  () => import("./admin/AdminFooter").catch(err => {
    console.error("Failed to load AdminFooter:", err);
    return Promise.reject(err);
  }),
  <Loading size="lg" className="min-h-[400px]" />
);