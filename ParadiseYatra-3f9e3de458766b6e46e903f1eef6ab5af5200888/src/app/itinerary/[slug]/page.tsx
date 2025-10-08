import { Metadata } from "next";
import ItineraryPageClient from "./ItineraryPageClient";

interface DayItinerary {
  day: number;
  title: string;
  activities: string[];
  accommodation: string;
  meals: string;
  image: string;
}

// Unified interface that can handle both packages and destinations
interface PackageOrDestination {
  _id: string;
  // Common fields - handle both package and destination naming
  title?: string;
  name?: string; // For destinations
  slug: string;
  description: string;
  shortDescription?: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  duration?: string;
  destination?: string; // For packages
  location?: string; // For destinations
  category: string;
  images?: string[];
  image?: string; // For destinations (single image)
  highlights?: string[];
  itinerary: DayItinerary[];
  inclusions?: string[];
  exclusions?: string[];
  rating?: number;
  reviews?: unknown[];
  isActive?: boolean;
  isFeatured?: boolean;
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  seoOgTitle?: string;
  seoOgDescription?: string;
  seoOgImage?: string;
  seoTwitterTitle?: string;
  seoTwitterDescription?: string;
  seoTwitterImage?: string;
  seoCanonicalUrl?: string;
  seoRobotsIndex?: boolean;
  seoRobotsFollow?: boolean;
  seoAuthor?: string;
  seoPublisher?: string;
}

// Function to fetch package or destination by slug
async function getPackage(slug: string): Promise<PackageOrDestination | null> {
  try {
    // For server-side rendering, we need to construct the full URL
    let baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
    
    // If no environment variable is set, construct the URL based on environment
    if (!baseUrl) {
      if (typeof window === 'undefined') {
        // Server-side rendering - use the production domain or localhost
        baseUrl = process.env.NODE_ENV === 'production' 
          ? 'https://paradiseyatra.com' 
          : 'http://localhost:3000';
      } else {
        // Client-side - use relative URL
        baseUrl = '';
      }
    }
    
    // First try to fetch as package by slug
    let response = await fetch(`${baseUrl}/api/packages/slug/${slug}`, {
      cache: 'no-store' // Ensure fresh data for SEO
    });
    
    // If package fetch fails, try to fetch as destination by slug
    if (!response.ok && response.status === 404) {
      console.log(`Package not found, trying destination for slug: ${slug}`);
      response = await fetch(`${baseUrl}/api/destinations/slug/${slug}`, {
        cache: 'no-store'
      });
    }
    
    // If both package and destination fetch fail, try to fetch package by ID (assuming the slug might be an ID)
    if (!response.ok && response.status === 404) {
      // Check if the slug looks like a MongoDB ObjectId (24 hex characters)
      if (/^[0-9a-fA-F]{24}$/.test(slug)) {
        console.log(`Trying package by ID for slug: ${slug}`);
        response = await fetch(`${baseUrl}/api/packages/${slug}`, {
          cache: 'no-store'
        });
      }
    }
    
    if (!response.ok) {
      console.error(`Failed to fetch package/destination with slug: ${slug}, Status: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    console.log(`Successfully fetched package/destination: ${slug}`, data);
    return data;
  } catch (error) {
    console.error('Error fetching package/destination:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const packageData = await getPackage(resolvedParams.slug);
  
  if (!packageData) {
    return {
      title: 'Package Not Found | Paradise Yatra',
      description: 'The requested travel package could not be found.',
    };
  }

  const displayTitle = packageData.title || packageData.name || 'Travel Package';
  const displayDestination = packageData.destination || packageData.location || 'Travel Destination';
  const title = packageData.seoTitle || `${displayTitle} | Paradise Yatra Travel Package`;
  const description = packageData.seoDescription || packageData.shortDescription || packageData.description.substring(0, 160) + '...';
  const keywords = packageData.seoKeywords || [
    'travel package',
    'travel tour',
    displayDestination.toLowerCase(),
    packageData.category.toLowerCase(),
    'adventure travel',
    'vacation package',
    'Paradise Yatra'
  ];

  return {
    title: title,
    description: description,
    keywords: keywords,
    authors: [{ name: packageData.seoAuthor || 'Paradise Yatra' }],
    creator: packageData.seoAuthor || 'Paradise Yatra',
    publisher: packageData.seoPublisher || 'Paradise Yatra',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    alternates: {
      canonical: packageData.seoCanonicalUrl || `/itinerary/${resolvedParams.slug}`,
    },
    openGraph: {
      title: packageData.seoOgTitle || displayTitle,
      description: packageData.seoOgDescription || description,
      url: packageData.seoCanonicalUrl || `/itinerary/${resolvedParams.slug}`,
      siteName: 'Paradise Yatra',
      images: [
        {
          url: packageData.seoOgImage || packageData.images?.[0] || packageData.image || '/banner.jpeg',
          width: 1200,
          height: 630,
          alt: displayTitle,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: packageData.seoTwitterTitle || displayTitle,
      description: packageData.seoTwitterDescription || description,
      images: [packageData.seoTwitterImage || packageData.images?.[0] || packageData.image || '/banner.jpeg'],
      creator: '@paradiseyatra',
      site: '@paradiseyatra',
    },
    robots: {
      index: packageData.seoRobotsIndex !== false,
      follow: packageData.seoRobotsFollow !== false,
      googleBot: {
        index: packageData.seoRobotsIndex !== false,
        follow: packageData.seoRobotsFollow !== false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

const ItineraryPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const resolvedParams = await params;
  const packageData = await getPackage(resolvedParams.slug);
  
  if (!packageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Package Not Found</h2>
          <p className="text-gray-600 mb-4">The package you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  // Normalize the data structure for the client component
  const normalizedData = {
    ...packageData,
    title: packageData.title || packageData.name || 'Travel Package',
    shortDescription: packageData.shortDescription || packageData.description.substring(0, 200) + '...',
    destination: packageData.destination || packageData.location || 'Travel Destination',
    images: packageData.images || (packageData.image ? [packageData.image] : []),
    price: packageData.price || 0,
    originalPrice: packageData.originalPrice || 0,
    discount: packageData.discount || 0,
    duration: packageData.duration || 'N/A',
    category: packageData.category || 'Travel',
    highlights: packageData.highlights || [],
    inclusions: packageData.inclusions || [],
    exclusions: packageData.exclusions || [],
    rating: packageData.rating || 0,
    reviews: packageData.reviews || [],
    isActive: packageData.isActive !== false,
    isFeatured: packageData.isFeatured || false,
  };

  return <ItineraryPageClient packageData={normalizedData} slug={resolvedParams.slug} />;
};

export default ItineraryPage;