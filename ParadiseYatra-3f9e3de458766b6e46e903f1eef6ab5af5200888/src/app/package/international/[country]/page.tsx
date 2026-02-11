import { Metadata } from "next";
import DedicatedPackagesPageClient from "../../StatePackagesPageClient";

interface PageProps {
    params: Promise<{
        country: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const country = decodeURIComponent(resolvedParams.country).replace(/-/g, ' ');
    const formattedCountry = country.charAt(0).toUpperCase() + country.slice(1);

    return {
        title: `${formattedCountry} International Tour Packages | Paradise Yatra`,
        description: `Explore the best international tour packages for ${formattedCountry}. Premium travel experiences curated by Paradise Yatra.`,
        keywords: [`${country} tour packages`, `${country} international tours`, `${country} holiday`, 'Paradise Yatra', country],
        openGraph: {
            title: `${formattedCountry} International Tour Packages | Paradise Yatra`,
            description: `Book your international vacation in ${formattedCountry} with Paradise Yatra.`,
            type: 'website',
        },
    };
}

export default async function InternationalCountryPage({ params }: PageProps) {
    const resolvedParams = await params;

    return (
        <DedicatedPackagesPageClient
            tourType="international"
            country={decodeURIComponent(resolvedParams.country)}
        />
    );
}
