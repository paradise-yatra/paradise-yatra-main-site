import type { Metadata } from "next";

export type SitemapChangeFrequency = "daily" | "weekly" | "monthly" | "yearly";

type StaticSeoEntry = {
  title: string;
  description: string;
  keywords: string[];
  index?: boolean;
  follow?: boolean;
  includeInSitemap?: boolean;
  changeFrequency?: SitemapChangeFrequency;
  priority?: number;
  image?: string;
};

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  index?: boolean;
  follow?: boolean;
  image?: string;
};

export const SITE_NAME = "Paradise Yatra";

const normalizeSiteUrl = (value: string): string => {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/+$/, "");
  }
  return `https://${trimmed.replace(/\/+$/, "")}`;
};

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || "https://paradiseyatra.com"
);
export const DEFAULT_OG_IMAGE = "/bannerCTA.jpeg";

export const STATIC_PAGE_SEO: Record<string, StaticSeoEntry> = {
  "/about": {
    title: "About Paradise Yatra | Trusted Travel Company in Dehradun",
    description:
      "Learn about Paradise Yatra, a Dehradun-based travel company creating personalized India and international holidays, fixed departures, and experience-led itineraries.",
    keywords: [
      "about Paradise Yatra",
      "Paradise Yatra Dehradun",
      "travel company in Dehradun",
      "custom travel planning",
      "India and international tours",
      "trusted travel agency",
    ],
    changeFrequency: "monthly",
    priority: 0.8,
  },
  "/admin": {
    title: "Admin Dashboard | Paradise Yatra",
    description: "Private dashboard for managing Paradise Yatra website content and operations.",
    keywords: ["Paradise Yatra admin", "admin dashboard"],
    index: false,
    follow: false,
    includeInSitemap: false,
  },
  "/admin/login": {
    title: "Admin Login | Paradise Yatra",
    description: "Secure login page for Paradise Yatra administrators.",
    keywords: ["Paradise Yatra admin login"],
    index: false,
    follow: false,
    includeInSitemap: false,
  },
  "/blog": {
    title: "Paradise Yatra Travel Blog | Guides, Tips and Inspiration",
    description:
      "Read destination guides, travel tips, itinerary ideas, and holiday inspiration from Paradise Yatra for India and international trips.",
    keywords: [
      "travel blog",
      "Paradise Yatra blog",
      "destination guides",
      "travel tips",
      "holiday inspiration",
      "trip planning ideas",
    ],
    changeFrequency: "weekly",
    priority: 0.8,
  },
  "/checkout": {
    title: "Checkout | Paradise Yatra",
    description: "Secure checkout for completing your Paradise Yatra booking.",
    keywords: ["checkout", "booking checkout"],
    index: false,
    follow: false,
    includeInSitemap: false,
  },
  "/coming-soon": {
    title: "Festival Tour Packages Coming Soon | Paradise Yatra",
    description:
      "New cultural journeys are on the way, including Rio Carnival, Cherry Blossom, Lantern Festival, Oktoberfest, Day of the Dead, and Loy Krathong travel experiences.",
    keywords: [
      "festival tour packages",
      "Rio Carnival tour",
      "Cherry Blossom tour",
      "Lantern Festival package",
      "Oktoberfest trip",
      "Day of the Dead travel",
      "Loy Krathong package",
    ],
    index: false,
    follow: true,
    includeInSitemap: false,
  },
  "/contact": {
    title: "Contact Paradise Yatra | Plan Your Next Trip With Experts",
    description:
      "Contact Paradise Yatra for custom tour packages, destination planning, fixed departures, and holiday support from our travel experts.",
    keywords: [
      "contact Paradise Yatra",
      "travel expert contact",
      "tour package enquiry",
      "holiday planning support",
      "travel agency contact",
    ],
    changeFrequency: "monthly",
    priority: 0.6,
  },
  "/cookie-policy": {
    title: "Cookie Policy | Paradise Yatra",
    description:
      "Read the Paradise Yatra cookie policy to understand how cookies and similar technologies are used across our website.",
    keywords: ["cookie policy", "website cookies", "Paradise Yatra cookie policy"],
    changeFrequency: "yearly",
    priority: 0.2,
  },
  "/destinations": {
    title: "Travel Destinations | India and International Holidays",
    description:
      "Explore curated travel destinations across India and abroad with Paradise Yatra, from mountains and beaches to culture-rich cities and escapes.",
    keywords: [
      "travel destinations",
      "India destinations",
      "international destinations",
      "holiday destinations",
      "Paradise Yatra destinations",
      "best places to travel",
    ],
    changeFrequency: "weekly",
    priority: 0.9,
  },
  "/fixed-departures": {
    title: "Fixed Departure Tours | Group Trips by Paradise Yatra",
    description:
      "Book scheduled fixed departure tours with curated itineraries, confirmed dates, and smooth group travel experiences from Paradise Yatra.",
    keywords: [
      "fixed departure tours",
      "group tours",
      "scheduled trips",
      "fixed departure packages",
      "Paradise Yatra group travel",
    ],
    changeFrequency: "weekly",
    priority: 0.8,
  },
  "/holiday-types": {
    title: "Holiday Types | Beach, Adventure, Family and Honeymoon Tours",
    description:
      "Discover holiday types for every travel style, including beach escapes, adventure tours, family vacations, luxury trips, and honeymoon packages.",
    keywords: [
      "holiday types",
      "beach holidays",
      "adventure tours",
      "family vacations",
      "honeymoon packages",
      "luxury holidays",
    ],
    changeFrequency: "weekly",
    priority: 0.7,
  },
  "/itinerary": {
    title: "Tour Itinerary | Paradise Yatra",
    description: "Tour itinerary pages for Paradise Yatra packages and travel plans.",
    keywords: ["tour itinerary", "travel itinerary"],
    index: false,
    follow: true,
    includeInSitemap: false,
  },
  "/login": {
    title: "Login | Paradise Yatra",
    description: "Login page for Paradise Yatra customers.",
    keywords: ["Paradise Yatra login"],
    index: false,
    follow: false,
    includeInSitemap: false,
  },
  "/package": {
    title: "Tour Packages | India and International Holiday Packages",
    description:
      "Browse Paradise Yatra tour packages for India and international holidays, curated by destination, travel style, and budget.",
    keywords: [
      "tour packages",
      "India tour packages",
      "international holiday packages",
      "travel packages",
      "Paradise Yatra packages",
      "vacation deals",
    ],
    changeFrequency: "weekly",
    priority: 0.9,
  },
  "/payment": {
    title: "Payment | Paradise Yatra",
    description: "Secure payment page for Paradise Yatra bookings.",
    keywords: ["payment", "booking payment"],
    index: false,
    follow: false,
    includeInSitemap: false,
  },
  "/privacy-policy": {
    title: "Privacy Policy | Paradise Yatra",
    description:
      "Read the Paradise Yatra privacy policy to understand how personal information is collected, used, stored, and protected.",
    keywords: ["privacy policy", "data privacy", "Paradise Yatra privacy policy"],
    changeFrequency: "yearly",
    priority: 0.2,
  },
  "/profile": {
    title: "My Profile | Paradise Yatra",
    description: "Manage your Paradise Yatra profile, bookings, and account details.",
    keywords: ["profile", "customer account", "my bookings"],
    index: false,
    follow: false,
    includeInSitemap: false,
  },
  "/refund-policy": {
    title: "Refund Policy | Paradise Yatra",
    description:
      "Read the Paradise Yatra refund policy for cancellation, refund processing, booking terms, and payment conditions.",
    keywords: ["refund policy", "cancellation refunds", "Paradise Yatra refund policy"],
    changeFrequency: "yearly",
    priority: 0.2,
  },
  "/signup": {
    title: "Sign Up | Paradise Yatra",
    description: "Create your Paradise Yatra account to save bookings and manage your travel plans.",
    keywords: ["sign up", "create account", "Paradise Yatra signup"],
    index: false,
    follow: false,
    includeInSitemap: false,
  },
  "/terms-and-conditions": {
    title: "Terms and Conditions | Paradise Yatra",
    description:
      "Review the Paradise Yatra terms and conditions covering bookings, payments, usage policies, responsibilities, and cancellations.",
    keywords: ["terms and conditions", "booking terms", "Paradise Yatra terms"],
    changeFrequency: "yearly",
    priority: 0.2,
  },
  "/terms-of-service": {
    title: "Terms of Service | Paradise Yatra",
    description: "Terms of service for using Paradise Yatra digital products and services.",
    keywords: ["terms of service", "service terms"],
    index: false,
    follow: true,
    includeInSitemap: false,
  },
  "/why-choose-us": {
    title: "Why Choose Paradise Yatra | Personalized Travel Experts",
    description:
      "See why travelers choose Paradise Yatra for transparent planning, personalized itineraries, reliable support, and authentic travel experiences.",
    keywords: [
      "why choose Paradise Yatra",
      "trusted travel experts",
      "personalized itineraries",
      "travel planning support",
      "custom holiday company",
    ],
    changeFrequency: "monthly",
    priority: 0.7,
  },
  "/wishlist": {
    title: "Wishlist | Paradise Yatra",
    description: "View and manage your saved Paradise Yatra trips and favorite packages.",
    keywords: ["wishlist", "saved trips", "favorite packages"],
    index: false,
    follow: false,
    includeInSitemap: false,
  },
};

export function stripHtml(value: string = ""): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  const sliced = value.slice(0, maxLength).trim();
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced).trim()}...`;
}

function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path === "/" ? "" : path;
  return `${SITE_URL}${normalizedPath}`;
}

export function buildMetadata(input: MetadataInput): Metadata {
  const index = input.index ?? true;
  const follow = input.follow ?? true;
  const image = input.image || DEFAULT_OG_IMAGE;

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords || [],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical: input.path,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: input.path,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: absoluteUrl(image),
          width: 1200,
          height: 630,
          alt: input.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [absoluteUrl(image)],
      creator: "@paradiseyatra",
      site: "@paradiseyatra",
    },
    robots: {
      index,
      follow,
      googleBot: {
        index,
        follow,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function buildStaticMetadata(path: string): Metadata {
  const entry = STATIC_PAGE_SEO[path];

  if (!entry) {
    throw new Error(`Missing SEO configuration for static path: ${path}`);
  }

  return buildMetadata({
    ...entry,
    path,
  });
}

export function getPublicStaticSitemapEntries(): Array<{
  path: string;
  changeFrequency: SitemapChangeFrequency;
  priority: number;
}> {
  const entries = Object.entries(STATIC_PAGE_SEO)
    .filter(([, entry]) => entry.index !== false && entry.includeInSitemap !== false)
    .map(([path, entry]) => ({
      path,
      changeFrequency: entry.changeFrequency || "monthly",
      priority: entry.priority ?? 0.5,
    }));

  return [
    {
      path: "/",
      changeFrequency: "daily",
      priority: 1,
    },
    ...entries,
  ];
}
