import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://paradiseyatra.com';

  // Static pages
  const staticPages = [
    {
      url: '',
      priority: '1.0',
      changefreq: 'daily',
      lastmod: new Date().toISOString()
    },
    {
      url: '/about',
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: new Date().toISOString()
    },
    {
      url: '/contact',
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: new Date().toISOString()
    },
    {
      url: '/privacy-policy',
      priority: '0.3',
      changefreq: 'yearly',
      lastmod: new Date().toISOString()
    },
    {
      url: '/terms-and-conditions',
      priority: '0.3',
      changefreq: 'yearly',
      lastmod: new Date().toISOString()
    },
    {
      url: '/package',
      priority: '0.9',
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    },
    {
      url: '/package/india',
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    },
    {
      url: '/package/international',
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    },
    {
      url: '/package/theme',
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    },
    {
      url: '/destinations',
      priority: '0.9',
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    },
    {
      url: '/blog',
      priority: '0.8',
      changefreq: 'daily',
      lastmod: new Date().toISOString()
    },
    {
      url: '/fixed-departures',
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    },
    {
      url: '/holiday-types',
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: new Date().toISOString()
    },
    // /itinerary now redirects to /package and should not be indexed separately
  ];

  // Fetch dynamic content from your API
  let dynamicPages = [];

  try {
    const API_BASE_URL = API_CONFIG.BACKEND_URL;

    // Fetch packages from canonical all-packages source
    const packagesResponse = await fetch(`${API_BASE_URL}/api/all-packages?limit=2000&isActive=true`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (packagesResponse.ok) {
      const packagesData = await packagesResponse.json();
      const packages = Array.isArray(packagesData)
        ? packagesData
        : (Array.isArray(packagesData?.packages) ? packagesData.packages : []);
      if (Array.isArray(packages)) {
        dynamicPages.push(...packages.map((pkg: any) => ({
          url: `/package/${pkg.slug || pkg._id || pkg.id}`,
          priority: '0.8',
          changefreq: 'weekly',
          lastmod: pkg.updatedAt || pkg.createdAt || new Date().toISOString()
        })));
      }
    }

    // Fetch package themes/tags
    const tagsResponse = await fetch(`${API_BASE_URL}/api/tags`, {
      next: { revalidate: 3600 }
    });
    if (tagsResponse.ok) {
      const tagsData = await tagsResponse.json();
      const tags = Array.isArray(tagsData)
        ? tagsData
        : (Array.isArray(tagsData?.tags) ? tagsData.tags : []);

      if (Array.isArray(tags)) {
        dynamicPages.push(...tags
          .filter((tag: any) => tag?.slug || tag?.name)
          .map((tag: any) => ({
            url: `/package/theme/${tag.slug || String(tag.name).toLowerCase().replace(/\s+/g, '-')}`,
            priority: '0.6',
            changefreq: 'weekly',
            lastmod: tag.updatedAt || tag.createdAt || new Date().toISOString()
          })));
      }
    }

    // Fetch destinations
    const destinationsResponse = await fetch(`${API_BASE_URL}/api/destinations`, {
      next: { revalidate: 3600 }
    });
    if (destinationsResponse.ok) {
      const destinationsData = await destinationsResponse.json();
      const destinations = destinationsData.success ? destinationsData.data : destinationsData;
      if (Array.isArray(destinations)) {
        dynamicPages.push(...destinations.map((dest: any) => ({
          url: `/destinations/${dest.slug || dest.id}`,
          priority: '0.8',
          changefreq: 'weekly',
          lastmod: dest.updatedAt || dest.createdAt || new Date().toISOString()
        })));
      }
    }

    // Fetch blog posts
    const blogsResponse = await fetch(`${API_BASE_URL}/api/blogs`, {
      next: { revalidate: 1800 } // Cache for 30 minutes
    });
    if (blogsResponse.ok) {
      const blogsData = await blogsResponse.json();
      const blogs = blogsData.success ? blogsData.data : blogsData;
      if (Array.isArray(blogs)) {
        dynamicPages.push(...blogs.map((blog: any) => ({
          url: `/blog/${blog.slug || blog.id}`,
          priority: '0.7',
          changefreq: 'monthly',
          lastmod: blog.publishDate || blog.updatedAt || blog.createdAt || new Date().toISOString()
        })));
      }
    }

    // Fetch fixed departures
    const departuresResponse = await fetch(`${API_BASE_URL}/api/fixed-departures`, {
      next: { revalidate: 3600 }
    });
    if (departuresResponse.ok) {
      const departuresData = await departuresResponse.json();
      const departures = departuresData.success ? departuresData.data : departuresData;
      if (Array.isArray(departures)) {
        dynamicPages.push(...departures.map((dep: any) => ({
          url: `/fixed-departures/${dep.slug || dep.id}`,
          priority: '0.7',
          changefreq: 'weekly',
          lastmod: dep.updatedAt || dep.createdAt || new Date().toISOString()
        })));
      }
    }

    // Fetch holiday types
    const holidayTypesResponse = await fetch(`${API_BASE_URL}/api/holiday-types`, {
      next: { revalidate: 3600 }
    });
    if (holidayTypesResponse.ok) {
      const holidayTypesData = await holidayTypesResponse.json();
      const holidayTypes = holidayTypesData.success ? holidayTypesData.data : holidayTypesData;
      if (Array.isArray(holidayTypes)) {
        dynamicPages.push(...holidayTypes.map((type: any) => ({
          url: `/holiday-types/${type.slug || type.id}`,
          priority: '0.6',
          changefreq: 'monthly',
          lastmod: type.updatedAt || type.createdAt || new Date().toISOString()
        })));
      }
    }

  } catch (error) {
    console.error('Error fetching dynamic content for sitemap:', error);
  }

  // De-duplicate URLs to keep sitemap clean for crawlers
  const uniquePagesMap = new Map<string, any>();
  [...staticPages, ...dynamicPages].forEach((page) => {
    uniquePagesMap.set(page.url, page);
  });
  const allPages = Array.from(uniquePagesMap.values());

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
