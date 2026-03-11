import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import HomePageClient from "@/components/HomePageClient";

// Use ISR instead of force-dynamic - regenerate every 60 seconds
export const revalidate = 60;

// Function to fetch SEO data from API
async function getSEOMetadata(): Promise<Metadata> {
  const fallbackTitle =
    "Paradise Yatra - Your Trusted Travel Partner | Best Travel Agency in Dehradun";
  const fallbackDescription =
    "Discover the world with Paradise Yatra, the best travel agency in Dehradun. We offer customized international and domestic tour packages, trekking adventures, and unforgettable travel experiences. 5000+ happy travelers, 25+ countries covered.";
  const fallbackKeywords = [
    "travel agency Dehradun",
    "best travel agency Dehradun",
    "international tours",
    "India tour packages",
    "trekking adventures",
    "travel packages",
    "vacation packages",
    "Paradise Yatra",
    "travel booking",
    "adventure travel",
  ];

  try {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";
    const response = await fetch(`${API_BASE_URL}/api/seo/homepage`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Use ISR caching - revalidate every 60 seconds
      next: { revalidate: 60 },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        const seoData = data.data;
        const title = seoData.title?.trim() || fallbackTitle;
        const description = seoData.description?.trim() || fallbackDescription;
        const keywords = Array.isArray(seoData.keywords) && seoData.keywords.length > 0
          ? seoData.keywords
          : fallbackKeywords;
        return {
          title,
          description,
          keywords,
          authors: [{ name: "Paradise Yatra" }],
          creator: "Paradise Yatra",
          publisher: "Paradise Yatra",
          formatDetection: {
            email: false,
            address: false,
            telephone: false,
          },
          metadataBase: new URL(SITE_URL),
          alternates: {
            canonical: seoData.canonical || "/",
          },
          openGraph: {
            title,
            description,
            url: seoData.canonical || "/",
            siteName: "Paradise Yatra",
            images: [
              {
                url: seoData.ogImage || "/bannerCTA.jpeg",
                width: 1200,
                height: 630,
                alt: title,
              },
            ],
            locale: "en_US",
            type: "website",
          },
          twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [seoData.ogImage || "/bannerCTA.jpeg"],
            creator: "@paradiseyatra",
            site: "@paradiseyatra",
          },
          robots: {
            index: seoData.robots?.includes("index") ?? true,
            follow: seoData.robots?.includes("follow") ?? true,
            googleBot: {
              index: seoData.robots?.includes("index") ?? true,
              follow: seoData.robots?.includes("follow") ?? true,
              "max-video-preview": -1,
              "max-image-preview": "large",
              "max-snippet": -1,
            },
          },
          verification: {
            google:
              process.env.GOOGLE_SITE_VERIFICATION ||
              "BdQBvIBq9neLnNKB-UbBDMkLm47f_BupmJrmVr37QFE",
          },
        };
      }
    }
  } catch (error) {
    console.error("Error fetching SEO metadata:", error);
  }

  // Fallback metadata if API fails
  return {
    title: fallbackTitle,
    description: fallbackDescription,
    keywords: fallbackKeywords,
    authors: [{ name: "Paradise Yatra" }],
    creator: "Paradise Yatra",
    publisher: "Paradise Yatra",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title:
        "Paradise Yatra - Your Trusted Travel Partner | Best Travel Agency in Dehradun",
      description:
        "Discover the world with Paradise Yatra, the best travel agency in Dehradun. We offer customized international and domestic tour packages, trekking adventures, and unforgettable travel experiences. 5000+ happy travelers, 25+ countries covered.",
      url: "/",
      siteName: "Paradise Yatra",
      images: [
        {
          url: "/bannerCTA.jpeg",
          width: 1200,
          height: 630,
          alt: "Paradise Yatra - Your Trusted Travel Partner",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title:
        "Paradise Yatra - Your Trusted Travel Partner | Best Travel Agency in Dehradun",
      description:
        "Discover the world with Paradise Yatra, the best travel agency in Dehradun. We offer customized international and domestic tour packages, trekking adventures, and unforgettable travel experiences. 5000+ happy travelers, 25+ countries covered.",
      images: ["/bannerCTA.jpeg"],
      creator: "@paradiseyatra",
      site: "@paradiseyatra",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google:
        process.env.GOOGLE_SITE_VERIFICATION ||
        "BdQBvIBq9neLnNKB-UbBDMkLm47f_BupmJrmVr37QFE",
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
