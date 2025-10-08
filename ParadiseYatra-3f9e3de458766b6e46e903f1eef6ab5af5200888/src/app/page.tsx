import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";

// Force dynamic rendering for SEO metadata
export const dynamic = 'force-dynamic';

// Function to fetch SEO data from API
async function getSEOMetadata(): Promise<Metadata> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE_URL}/api/seo/homepage`, {
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
            canonical: seoData.canonical || '/',
          },
          openGraph: {
            title: seoData.title,
            description: seoData.description,
            url: seoData.canonical || '/',
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
            creator: "@paradiseyatra",
            site: "@paradiseyatra",
          },
          robots: {
            index: seoData.robots?.includes('index') ?? true,
            follow: seoData.robots?.includes('follow') ?? true,
            googleBot: {
              index: seoData.robots?.includes('index') ?? true,
              follow: seoData.robots?.includes('follow') ?? true,
              'max-video-preview': -1,
              'max-image-preview': 'large',
              'max-snippet': -1,
            },
          },
          verification: {
            google: process.env.GOOGLE_SITE_VERIFICATION || "BdQBvIBq9neLnNKB-UbBDMkLm47f_BupmJrmVr37QFE",
          },
        };
      }
    }
  } catch (error) {
    console.error('Error fetching SEO metadata:', error);
  }

  // Fallback metadata if API fails
  return {
    title: "Paradise Yatra - Your Trusted Travel Partner | Best Travel Agency in Dehradun",
    description: "Discover the world with Paradise Yatra, the best travel agency in Dehradun. We offer customized international and domestic tour packages, trekking adventures, and unforgettable travel experiences. 5000+ happy travelers, 25+ countries covered.",
    keywords: [
      "travel agency Dehradun",
      "best travel agency Dehradun", 
      "international tours",
      "India tour packages",
      "trekking adventures",
      "travel packages",
      "vacation packages",
      "Paradise Yatra",
      "travel booking",
      "adventure travel"
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
      canonical: '/',
    },
    openGraph: {
      title: "Paradise Yatra - Your Trusted Travel Partner | Best Travel Agency in Dehradun",
      description: "Discover the world with Paradise Yatra, the best travel agency in Dehradun. We offer customized international and domestic tour packages, trekking adventures, and unforgettable travel experiences. 5000+ happy travelers, 25+ countries covered.",
      url: '/',
      siteName: 'Paradise Yatra',
      images: [
        {
          url: '/hero.jpg',
          width: 1200,
          height: 630,
          alt: 'Paradise Yatra - Your Trusted Travel Partner',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Paradise Yatra - Your Trusted Travel Partner | Best Travel Agency in Dehradun",
      description: "Discover the world with Paradise Yatra, the best travel agency in Dehradun. We offer customized international and domestic tour packages, trekking adventures, and unforgettable travel experiences. 5000+ happy travelers, 25+ countries covered.",
      images: ['/hero.jpg'],
      creator: "@paradiseyatra",
      site: "@paradiseyatra",
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
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || "BdQBvIBq9neLnNKB-UbBDMkLm47f_BupmJrmVr37QFE",
    },
  };
}

// Generate metadata dynamically
export async function generateMetadata(): Promise<Metadata> {
  return await getSEOMetadata();
}

export default function HomePage() {
  return <HomePageClient />;
}