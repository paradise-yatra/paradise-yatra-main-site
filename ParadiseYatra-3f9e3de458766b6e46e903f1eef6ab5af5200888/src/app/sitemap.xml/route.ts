import { NextResponse } from "next/server";
import { API_CONFIG } from "@/config/api";
import { SITE_URL, getPublicStaticSitemapEntries } from "@/lib/seo";

type SitemapEntry = {
  url: string;
  lastModified?: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
};

type ContentRecord = {
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  publishDate?: string;
  isActive?: boolean;
  isPublished?: boolean;
};

function toAbsoluteUrl(path: string): string {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

function normalizeDate(value: unknown): string | undefined {
  if (!value || typeof value !== "string") {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function extractArray(payload: unknown, keys: string[] = []): ContentRecord[] {
  if (Array.isArray(payload)) {
    return payload as ContentRecord[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;
  for (const key of ["data", "results", "items", ...keys]) {
    if (Array.isArray(record[key])) {
      return record[key] as ContentRecord[];
    }
  }

  return [];
}

async function fetchJson(path: string): Promise<unknown> {
  const response = await fetch(`${API_CONFIG.BACKEND_URL}${path}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }

  return response.json();
}

function makeEntry(
  url: string,
  lastModified: string | undefined,
  changeFrequency: SitemapEntry["changeFrequency"],
  priority: number
): SitemapEntry {
  return {
    url,
    lastModified,
    changeFrequency,
    priority,
  };
}

function uniqueEntries(entries: SitemapEntry[]): SitemapEntry[] {
  const map = new Map<string, SitemapEntry>();
  for (const entry of entries) {
    map.set(entry.url, entry);
  }

  return Array.from(map.values()).sort((a, b) => a.url.localeCompare(b.url));
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function GET() {
  const staticEntries = getPublicStaticSitemapEntries().map((entry) =>
    makeEntry(toAbsoluteUrl(entry.path), undefined, entry.changeFrequency, entry.priority)
  );

  const dynamicEntries: SitemapEntry[] = [];

  try {
    const [
      packagesPayload,
      tagsPayload,
      destinationsPayload,
      blogsPayload,
      departuresPayload,
      holidayTypesPayload,
    ] = await Promise.all([
      fetchJson("/api/all-packages?limit=2000&isActive=true"),
      fetchJson("/api/tags"),
      fetchJson("/api/destinations"),
      fetchJson("/api/blogs?published=true&limit=2000"),
      fetchJson("/api/fixed-departures?limit=2000"),
      fetchJson("/api/holiday-types"),
    ]);

    const packages = extractArray(packagesPayload, ["packages"]).filter(
      (item) => item.slug && item.isActive !== false
    );
    dynamicEntries.push(
      ...packages.map((item) =>
        makeEntry(
          toAbsoluteUrl(`/package/${item.slug}`),
          normalizeDate(item.updatedAt || item.createdAt),
          "weekly",
          0.8
        )
      )
    );

    const tags = extractArray(tagsPayload, ["tags"]).filter((item) => item.slug);
    dynamicEntries.push(
      ...tags.map((item) =>
        makeEntry(
          toAbsoluteUrl(`/package/theme/${item.slug}`),
          normalizeDate(item.updatedAt || item.createdAt),
          "weekly",
          0.6
        )
      )
    );

    const destinations = extractArray(destinationsPayload, ["destinations"]).filter(
      (item) => item.slug && item.isActive !== false
    );
    dynamicEntries.push(
      ...destinations.map((item) =>
        makeEntry(
          toAbsoluteUrl(`/destinations/${item.slug}`),
          normalizeDate(item.updatedAt || item.createdAt),
          "weekly",
          0.8
        )
      )
    );

    const blogs = extractArray(blogsPayload, ["blogs"]).filter(
      (item) => item.slug && item.isPublished !== false
    );
    dynamicEntries.push(
      ...blogs.map((item) =>
        makeEntry(
          toAbsoluteUrl(`/blog/${item.slug}`),
          normalizeDate(item.publishDate || item.updatedAt || item.createdAt),
          "weekly",
          0.7
        )
      )
    );

    const departures = extractArray(departuresPayload, ["fixedDepartures"]).filter(
      (item) => item.slug && item.isActive !== false
    );
    dynamicEntries.push(
      ...departures.map((item) =>
        makeEntry(
          toAbsoluteUrl(`/fixed-departures/${item.slug}`),
          normalizeDate(item.updatedAt || item.createdAt),
          "weekly",
          0.7
        )
      )
    );

    const holidayTypes = extractArray(holidayTypesPayload, ["holidayTypes"]).filter(
      (item) => item.slug && item.isActive !== false
    );
    dynamicEntries.push(
      ...holidayTypes.map((item) =>
        makeEntry(
          toAbsoluteUrl(`/holiday-types/${item.slug}`),
          normalizeDate(item.updatedAt || item.createdAt),
          "monthly",
          0.6
        )
      )
    );
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  const sitemapEntries = uniqueEntries([...staticEntries, ...dynamicEntries]);
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries
    .map((entry) => {
      const lastmodTag = entry.lastModified ? `\n    <lastmod>${escapeXml(entry.lastModified)}</lastmod>` : "";
      return `  <url>\n    <loc>${escapeXml(entry.url)}</loc>${lastmodTag}\n    <changefreq>${entry.changeFrequency}</changefreq>\n    <priority>${entry.priority.toFixed(1)}</priority>\n  </url>`;
    })
    .join("\n")}\n</urlset>`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
