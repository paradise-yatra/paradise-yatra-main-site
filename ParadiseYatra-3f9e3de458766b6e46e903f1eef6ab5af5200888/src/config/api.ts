/**
 * API Configuration
 * Centralized configuration for API endpoints and backend URLs
 */

export const API_CONFIG = {
  // Backend URL - can be overridden by environment variable
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || (typeof window !== 'undefined' ? '' : 'http://localhost:5000'),
  
  // API endpoints
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: '/api/auth/login',
      PROFILE: '/api/auth/profile',
    },
    
    // Content endpoints
    PACKAGES: {
      ALL: '/api/packages',
      BY_CATEGORY: '/api/packages/category',
      BY_SLUG: '/api/packages/slug',
      SUGGEST: '/api/packages/suggest',
      TRENDING: '/api/packages/trending',
    },
    
    DESTINATIONS: {
      ALL: '/api/destinations',
      BY_ID: '/api/destinations',
      SUGGEST: '/api/destinations/suggest',
      TRENDING: '/api/destinations/trending',
      COUNTRIES: '/api/destinations/countries',
      STATES: '/api/destinations/states',
      TOUR_TYPES: '/api/destinations/tour-types',
    },
    
    HOLIDAY_TYPES: {
      ALL: '/api/holiday-types',
      BY_SLUG: '/api/holiday-types/slug',
      SUGGEST: '/api/holiday-types/search',
      ADMIN_ALL: '/api/holiday-types/admin/all',
    },
    
    FIXED_DEPARTURES: {
      ALL: '/api/fixed-departures',
      BY_ID: '/api/fixed-departures',
      BY_SLUG: '/api/fixed-departures/slug',
      SUGGEST: '/api/fixed-departures/suggest',
      NAVIGATION: '/api/fixed-departures/navigation',
    },
    
    BLOGS: {
      ALL: '/api/blogs',
      BY_ID: '/api/blogs',
    },
    
    TESTIMONIALS: {
      ALL: '/api/testimonials',
      BY_ID: '/api/testimonials',
    },
    
    CONTENT: {
      HEADER: '/api/header',
      FOOTER: '/api/footer',
      HERO: '/api/hero',
      CTA: '/api/cta',
    },
    
    UPLOAD: {
      IMAGE: '/api/upload/image',
    },
  },
  
  // Helper function to get full URL
  getFullUrl: (endpoint: string) => {
    return `${API_CONFIG.BACKEND_URL}${endpoint}`;
  },
  
  // Helper function to get API URL for Next.js API routes
  getApiUrl: (endpoint: string) => {
    return endpoint.startsWith('/api/') ? endpoint : `/api${endpoint}`;
  },
};

export default API_CONFIG;
