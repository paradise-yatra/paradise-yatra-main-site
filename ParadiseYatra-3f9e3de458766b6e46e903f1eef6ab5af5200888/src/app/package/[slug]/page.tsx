import { Metadata } from "next";
import PackageDetailClient from "@/app/package/[slug]/PackageDetailClient";

// Enable ISR with 60 second revalidation
export const revalidate = 60;

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
    description?: string;
    shortDescription?: string;
    price?: number;
    priceType?: "per_person" | "per_couple";
    originalPrice?: number;
    discount?: number;
    duration?: string;
    destination?: string; // For packages
    location?: string; // For destinations
    category?: string;
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

const stripHtmlTags = (value: string = "") =>
    value
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/\s+/g, " ")
        .trim();

// Function to fetch package or destination by slug
async function getPackage(slug: string): Promise<PackageOrDestination | null> {
    try {
        // Get the backend URL from environment variable
        let baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

        // Remove /api suffix if it exists to avoid double /api/api/ in URL
        if (baseUrl && baseUrl.endsWith('/api')) {
            baseUrl = baseUrl.replace(/\/api$/, '');
        }

        // If still no baseUrl, use empty string for relative URLs
        if (!baseUrl) {
            baseUrl = '';
        }

        console.log(`[PackageDetailPage] Fetching data for slug: ${slug}, using baseUrl: ${baseUrl}`);

        // Aggressive unwrapping logic to find the actual data object
        const unwrap = (obj: any): any => {
            if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;

            // Known keys that wrap the actual data
            const wrapperKeys = ['package', 'destination', 'data', 'result', 'item'];
            for (const key of wrapperKeys) {
                if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                    return unwrap(obj[key]);
                }
            }

            // If it's a list wrapper like { packages: [...] }
            const listKeys = ['packages', 'destinations', 'items', 'results'];
            for (const key of listKeys) {
                if (Array.isArray(obj[key]) && obj[key].length > 0) {
                    return unwrap(obj[key][0]);
                }
            }

            return obj;
        };

        // First try to fetch as package by slug
        let response = await fetch(`${baseUrl}/api/packages/slug/${slug}`, {
            next: { revalidate: 60 } // Cache for 60 seconds
        });

        let data;

        // If package fetch succeeds, process it
        if (response.ok) {
            data = await response.json();
            console.log(`[PackageDetailPage] Successfully fetched package for slug: ${slug}`);
            return unwrap(data);
        }

        // If package fetch fails with 404, try to fetch as destination by slug
        if (response.status === 404) {
            console.log(`[PackageDetailPage] Package not found for slug: ${slug}, trying destinations...`);
            response = await fetch(`${baseUrl}/api/destinations/slug/${slug}`, {
                next: { revalidate: 60 } // Cache for 60 seconds
            });

            if (response.ok) {
                data = await response.json();
                console.log(`[PackageDetailPage] Successfully fetched destination for slug: ${slug}`);
                return unwrap(data);
            }
        }

        // Try all-packages API as another fallback
        if (response.status === 404) {
            console.log(`[PackageDetailPage] Slug not found in destinations, trying all-packages...`);
            response = await fetch(`${baseUrl}/api/all-packages/${slug}`, {
                next: { revalidate: 60 }
            });

            if (response.ok) {
                data = await response.json();
                console.log(`[PackageDetailPage] Successfully fetched from all-packages for slug: ${slug}`);
                return unwrap(data);
            }
        }

        // Try one more fallback: direct ID match if it's a destination
        if (response.status === 404) {
            console.log(`[PackageDetailPage] Slug not found in all-packages, trying direct destinations/:id...`);
            response = await fetch(`${baseUrl}/api/destinations/${slug}`, {
                next: { revalidate: 60 } // Cache for 60 seconds
            });

            if (response.ok) {
                data = await response.json();
                return unwrap(data);
            }
        }

        // Final fallback
        return null;
    } catch (error) {
        console.error('[PackageDetailPage] Error fetching package/destination:', error);
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
    const fallbackDescriptionSource = stripHtmlTags(packageData.shortDescription || packageData.description || "");
    const description = packageData.seoDescription || (fallbackDescriptionSource ? `${fallbackDescriptionSource.substring(0, 160)}...` : "");
    const keywords = packageData.seoKeywords || [
        'travel package',
        'travel tour',
        displayDestination.toLowerCase(),
        packageData.category?.toLowerCase() || 'travel',
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
        publisher: packageData.seoAuthor || 'Paradise Yatra',
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
        alternates: {
            canonical: packageData.seoCanonicalUrl || `/package/${resolvedParams.slug}`,
        },
        openGraph: {
            title: packageData.seoOgTitle || displayTitle,
            description: packageData.seoOgDescription || description,
            url: packageData.seoCanonicalUrl || `/package/${resolvedParams.slug}`,
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

const PackageDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
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
        description: packageData.description || packageData.shortDescription || 'No description available.',
        shortDescription: packageData.shortDescription || packageData.description || 'Tour details coming soon.',
        destination: packageData.destination || packageData.location || 'Travel Destination',
        images: Array.isArray(packageData.images) && packageData.images.length > 0 ? packageData.images : (packageData.image ? [packageData.image] : []),
        price: packageData.price || 0,
        priceType: packageData.priceType || "per_person",
        originalPrice: packageData.originalPrice || 0,
        discount: packageData.discount || 0,
        duration: packageData.duration || 'N/A',
        category: packageData.category || 'Travel',
        highlights: Array.isArray(packageData.highlights) ? packageData.highlights : (typeof packageData.highlights === 'string' ? (packageData.highlights as string).split(',').map(h => h.trim()) : []),
        inclusions: Array.isArray(packageData.inclusions) ? packageData.inclusions : (packageData.inclusions ? [packageData.inclusions] : []),
        exclusions: Array.isArray(packageData.exclusions) ? packageData.exclusions : (packageData.exclusions ? [packageData.exclusions] : []),
        rating: packageData.rating || 0,
        reviews: packageData.reviews || [],
        isActive: packageData.isActive !== false,
        isFeatured: packageData.isFeatured || false,
        itinerary: Array.isArray(packageData.itinerary) ? packageData.itinerary : [],
    };

    return <PackageDetailClient packageData={normalizedData} slug={resolvedParams.slug} />;
};

export default PackageDetailPage;
