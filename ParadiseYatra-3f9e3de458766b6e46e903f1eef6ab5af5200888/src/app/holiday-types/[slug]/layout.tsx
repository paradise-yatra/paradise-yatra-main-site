import type { Metadata } from "next";
import { buildMetadata, stripHtml, truncateText } from "@/lib/seo";

type HolidayTypeRecord = {
  title?: string;
  shortDescription?: string;
  description?: string;
  image?: string;
  badge?: string;
  category?: string;
};

function backendBaseUrl() {
  return process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";
}

async function getHolidayType(slug: string): Promise<HolidayTypeRecord | null> {
  try {
    const response = await fetch(`${backendBaseUrl()}/api/holiday-types/slug/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return (data?.data || data) as HolidayTypeRecord;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const holidayType = await getHolidayType(slug);
  const path = `/holiday-types/${slug}`;

  if (!holidayType) {
    return buildMetadata({
      title: "Holiday Packages | Paradise Yatra",
      description:
        "Discover curated holiday styles and travel experiences from Paradise Yatra.",
      path,
      keywords: ["holiday packages", "travel styles", "Paradise Yatra"],
      index: false,
      follow: true,
    });
  }

  const title = holidayType.title || "Holiday Type";
  const description = truncateText(
    stripHtml(holidayType.shortDescription || holidayType.description || "") ||
      `Discover curated ${title.toLowerCase()} travel experiences with Paradise Yatra.`,
    155
  );

  return buildMetadata({
    title: `${title} Packages | Paradise Yatra`,
    description,
    path,
    image: holidayType.image || "/bannerCTA.jpeg",
    keywords: [
      `${title} packages`,
      `${title} holidays`,
      holidayType.badge || `${title} travel`,
      holidayType.category || title,
      "Paradise Yatra",
    ].filter(Boolean),
  });
}

export default function HolidayTypeDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
