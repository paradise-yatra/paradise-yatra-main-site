import { Metadata } from "next";
import PackagesPageClient from "./PackagesPageClient";

// Force dynamic rendering for SEO metadata
export const dynamic = 'force-dynamic';

// Function to fetch SEO data from API
async function getSEOMetadata(tourType: string, state: string): Promise<Metadata> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const decodedState = decodeURIComponent(state.replace(/-/g, ' '))
      .replace(/&/g, 'and')
      .replace(/\s+/g, ' ')
      .trim();
    
    const response = await fetch(`${API_BASE_URL}/api/seo/packages-dynamic?tourType=${tourType}&location=${encodeURIComponent(decodedState)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Disable caching for dynamic SEO updates
      cache: 'no-store'
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        const seoData = data.data;
        return {
          title: seoData.title,
          description: seoData.description,
          keywords: seoData.keywords,
          authors: [{ name: "Paradise Yatra" }],
          creator: "Paradise Yatra",
          publisher: "Paradise Yatra",
          formatDetection: {
            email: false,
            address: false,
            telephone: false,
          },
          metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://paradiseyatra.com'),
          alternates: {
            canonical: seoData.canonical,
          },
          openGraph: {
            title: seoData.title,
            description: seoData.description,
            url: seoData.canonical,
            siteName: 'Paradise Yatra',
            images: [
              {
                url: seoData.ogImage || '/hero.jpg',
                width: 1200,
                height: 630,
                alt: seoData.title,
              },
            ],
            locale: 'en_US',
            type: 'website',
          },
          twitter: {
            card: 'summary_large_image',
            title: seoData.title,
            description: seoData.description,
            images: [seoData.ogImage || '/hero.jpg'],
            creator: '@paradiseyatra',
            site: '@paradiseyatra',
          },
          robots: {
            index: seoData.robots?.includes('index') !== false,
            follow: seoData.robots?.includes('follow') !== false,
            googleBot: {
              index: seoData.robots?.includes('index') !== false,
              follow: seoData.robots?.includes('follow') !== false,
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
    }
  } catch (error) {
    console.error('Error fetching SEO metadata:', error);
  }

  // Fallback metadata if API fails
  const tourTypeLabel = tourType === 'international' ? 'International' : 'India';
  const stateLabel = decodeURIComponent(state.replace(/-/g, ' ')).replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `${stateLabel} ${tourTypeLabel} Tour Packages | Paradise Yatra`,
    description: `Discover amazing ${tourType} tour packages in ${stateLabel}. Book your dream vacation with Paradise Yatra and explore the best destinations in ${stateLabel}.`,
    keywords: [
      `${stateLabel} tour packages`,
      `${stateLabel} ${tourType} tours`,
      `${stateLabel} travel packages`,
      `${stateLabel} holiday packages`,
      `${tourType} tours ${stateLabel}`,
      `travel to ${stateLabel}`,
      `${stateLabel} vacation packages`,
      `Paradise Yatra ${stateLabel}`,
      `${stateLabel} destinations`,
      `${tourType} travel ${stateLabel}`
    ],
    authors: [{ name: "Paradise Yatra" }],
    creator: "Paradise Yatra",
    publisher: "Paradise Yatra",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://paradiseyatra.com'),
    alternates: {
      canonical: `/packages/${tourType}/${state}`,
    },
    openGraph: {
      title: `${stateLabel} ${tourTypeLabel} Tour Packages | Paradise Yatra`,
      description: `Discover amazing ${tourType} tour packages in ${stateLabel}. Book your dream vacation with Paradise Yatra and explore the best destinations in ${stateLabel}.`,
      url: `/packages/${tourType}/${state}`,
      siteName: 'Paradise Yatra',
      images: [
        {
          url: '/hero.jpg',
          width: 1200,
          height: 630,
          alt: `${stateLabel} ${tourTypeLabel} Tour Packages`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${stateLabel} ${tourTypeLabel} Tour Packages | Paradise Yatra`,
      description: `Discover amazing ${tourType} tour packages in ${stateLabel}. Book your dream vacation with Paradise Yatra and explore the best destinations in ${stateLabel}.`,
      images: ['/hero.jpg'],
      creator: '@paradiseyatra',
      site: '@paradiseyatra',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ tourType: string; state: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  return getSEOMetadata(resolvedParams.tourType, resolvedParams.state);
}

interface PackagesPageProps {
  params: Promise<{
    tourType: string;
    state: string;
  }>;
}

export default async function PackagesPage({ params }: PackagesPageProps) {
  const resolvedParams = await params;
  
  return <PackagesPageClient params={resolvedParams} />;
}
