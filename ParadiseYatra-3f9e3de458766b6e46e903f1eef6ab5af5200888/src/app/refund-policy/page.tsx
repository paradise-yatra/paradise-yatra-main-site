// app/refund-policy/page.tsx

import { Metadata } from 'next';
import CancellationRefundContent from '@/components/CancellationRefundContent';
import { LazyHeader, LazyFooter } from '@/components/lazy-components';

export const metadata: Metadata = {
  title: 'Refund Policy | Paradise Yatra',
  description: 'Read Paradise Yatra\'s refund policy. Learn about our liberal cancellation terms, refund processing timelines, and policies for damaged or defective items.',
  keywords: [
    'Paradise Yatra refund policy',
    'travel cancellation policy',
    'refund terms',
    'booking cancellation',
    'travel refund process',
    'Paradise Yatra cancellation',
    'travel service refund',
    'tourist booking cancellation',
    'India travel refund',
    'Uttarakhand tourism refund'
  ],
  authors: [{ name: 'Paradise Yatra' }],
  creator: 'Paradise Yatra',
  publisher: 'Paradise Yatra',
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
  openGraph: {
    title: 'Refund Policy | Paradise Yatra',
    description: 'Our liberal cancellation and refund policy ensures customer satisfaction. Learn about timelines, terms, and procedures.',
    url: 'https://paradiseyatra.com/refund-policy',
    siteName: 'Paradise Yatra',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Refund Policy | Paradise Yatra',
    description: 'Learn about our fair and transparent refund policy for travel bookings.',
    creator: '@paradiseyatra',
  },
  alternates: {
    canonical: 'https://paradiseyatra.com/refund-policy',
  },
  other: {
    'last-modified': '2026-03-02',
    'contact-email': 'support@paradiseyatra.com',
    'contact-phone': '+91-8979269388',
    'refund-timeline': '16-30 Days',
    'reporting-period': '30+ Days',
  },
};

export default function CancellationRefundPage() {
  return (
    <>
      <LazyHeader />
      <CancellationRefundContent />
    </>
  );
}