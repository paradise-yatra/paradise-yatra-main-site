import { Metadata } from 'next';
import PackagePageClient from './PackagePageClient';

export const metadata: Metadata = {
    title: 'All Tour Packages | Paradise Yatra',
    description: 'Explore our wide range of domestic and international tour packages. Find the perfect holiday destination with Paradise Yatra.',
    keywords: 'tour packages, travel, holiday, vacation, international tours, domestic tours, Paradise Yatra',
    openGraph: {
        title: 'All Tour Packages | Paradise Yatra',
        description: 'Explore our wide range of domestic and international tour packages.',
        url: 'https://paradiseyatra.com/package',
        siteName: 'Paradise Yatra',
        images: [
            {
                url: '/hero.jpg',
                width: 1200,
                height: 630,
                alt: 'Paradise Yatra Tour Packages',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
};

export default function PackagePage() {
    return <PackagePageClient />;
}
