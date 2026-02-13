import { Metadata } from "next";
import BlogDetailClient from "./BlogDetailClient";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  image: string;
  category: string;
  readTime: number;
  views: number;
  likes: number;
  isPublished: boolean;
  isFeatured: boolean;
  seoKeywords?: string[];
  seoTitle?: string;
  seoDescription?: string;
  imageAlt?: string;
  createdAt: string;
  updatedAt: string;
}

// Function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

// Function to strip HTML tags for meta description
const stripHtml = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

// Function to fetch blog post by slug with timeout
// IMPORTANT: This must call the *Next.js app* (not the backend) because `/api/blogs/[id]`
// is a Next route that proxies to the backend.
const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  try {
    // For server-side rendering, we need to construct the full URL to THIS Next app.
    // Never use NEXT_PUBLIC_BACKEND_URL here.
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
      (process.env.NODE_ENV === "production"
        ? "https://paradiseyatra.com"
        : "http://localhost:3000");

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    let response;
    try {
      response = await fetch(`${baseUrl}/api/blogs/${slug}`, {
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error("Blog fetch timed out");
        return null;
      }
      throw fetchError;
    }

    if (!response.ok) {
      return null;
    }

    const blog = await response.json();
    return blog;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
};

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  if (!post) {
    return {
      title: "Blog Post Not Found | Paradise Yatra",
      description: "The requested blog post could not be found.",
    };
  }

  const cleanContent = stripHtml(post.content);
  const description =
    post.seoDescription ||
    post.excerpt ||
    cleanContent.substring(0, 160) + "...";
  const publishedDate = new Date(post.createdAt).toISOString();
  const modifiedDate = new Date(post.updatedAt || post.createdAt).toISOString();
  const seoTitle = post.seoTitle || post.title;

  return {
    title: `${seoTitle} | Paradise Yatra Travel Blog`,
    description: description,
    keywords:
      post.seoKeywords && post.seoKeywords.length > 0
        ? post.seoKeywords
        : [
          "travel blog",
          "travel tips",
          post.category.toLowerCase(),
          "adventure travel",
          "destination guide",
          "travel experience",
          "Paradise Yatra",
        ],
    authors: [{ name: post.author }],
    creator: post.author,
    publisher: "Paradise Yatra",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ),
    alternates: {
      canonical: `/blog/${resolvedParams.slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: description,
      url: `/blog/${resolvedParams.slug}`,
      siteName: "Paradise Yatra",
      images: [
        {
          url: post.image || "/banner.jpeg",
          width: 1200,
          height: 630,
          alt: post.imageAlt || seoTitle,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: publishedDate,
      modifiedTime: modifiedDate,
      authors: [post.author],
      section: post.category,
      tags:
        post.seoKeywords && post.seoKeywords.length > 0
          ? post.seoKeywords
          : [post.category, "Travel", "Adventure"],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: description,
      images: [post.image || "/banner.jpeg"],
      creator: "@paradiseyatra",
      site: "@paradiseyatra",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

const BlogDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Blog post not found.</p>
        </div>
      </div>
    );
  }

  return <BlogDetailClient post={post} slug={resolvedParams.slug} />;
};

export default BlogDetailPage;
