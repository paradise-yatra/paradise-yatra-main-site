import { Metadata } from "next";
import DedicatedPackagesPageClient from "../../StatePackagesPageClient";

interface PageProps {
    params: Promise<{
        state: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const state = decodeURIComponent(resolvedParams.state).replace(/-/g, ' ');
    const formattedState = state.charAt(0).toUpperCase() + state.slice(1);

    return {
        title: `${formattedState} Tour Packages | Paradise Yatra`,
        description: `Explore the best tour packages for ${formattedState}. Handpicked premium collections for an unforgettable travel experience in ${formattedState}.`,
        keywords: [`${state} tour packages`, `${state} travel`, `${state} holiday packages`, 'Paradise Yatra', state],
        openGraph: {
            title: `${formattedState} Tour Packages | Paradise Yatra`,
            description: `Book your dream vacation in ${formattedState} with Paradise Yatra.`,
            type: 'website',
        },
    };
}

export default async function IndiaStatePage({ params }: PageProps) {
    const resolvedParams = await params;

    return (
        <DedicatedPackagesPageClient
            tourType="india"
            state={decodeURIComponent(resolvedParams.state)}
        />
    );
}
