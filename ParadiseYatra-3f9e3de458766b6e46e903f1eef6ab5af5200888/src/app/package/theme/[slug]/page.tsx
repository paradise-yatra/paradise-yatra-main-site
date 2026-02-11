import { Metadata } from "next";
import ThemePackagesPageClient from "./ThemePackagesPageClient";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getThemeData(slug: string) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/tags/slug/${slug}`, { cache: 'no-store' });
        if (!response.ok) return null;
        const json = await response.json();
        return json.success ? json.data : null;
    } catch (err) {
        console.error('Error fetching theme for metadata:', err);
        return null;
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const theme = await getThemeData(resolvedParams.slug);

    if (!theme) {
        return {
            title: 'Theme Packages | Paradise Yatra',
            description: 'Explore our special tour packages by theme.',
        };
    }

    const capitalize = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
    const title = `${capitalize(theme.name)} Tour Packages | Paradise Yatra`;
    const description = theme.description || `Discover the best ${capitalize(theme.name)} tour packages with Paradise Yatra. Handpicked experiences for your perfect trip.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        }
    };
}

export default async function ThemePage({ params }: PageProps) {
    const resolvedParams = await params;
    return <ThemePackagesPageClient slug={resolvedParams.slug} />;
}
