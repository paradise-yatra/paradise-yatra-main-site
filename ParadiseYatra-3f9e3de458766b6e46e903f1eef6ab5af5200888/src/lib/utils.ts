import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_CONFIG } from "@/config/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the proper image URL for display
 * @param imageUrl - The image URL from the API
 * @returns The processed image URL
 */
export function getImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) return null;

  // Check if the URL contains only emoji or invalid characters
  if (imageUrl.length <= 2 && /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(imageUrl)) {
    return null;
  }

  // If it's already a full URL, return it directly (no proxy needed)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a relative URL, construct the full production URL
  if (imageUrl.startsWith('/uploads/')) {
    return `${API_CONFIG.BACKEND_URL}${imageUrl}`;
  }

  return imageUrl;
}

/**
 * Get the proper image URL for multiple images
 * @param imageUrls - Array of image URLs
 * @returns Array of processed image URLs
 */
export function getImageUrls(imageUrls: (string | null)[]): (string | null)[] {
  if (!Array.isArray(imageUrls)) return [];
  return imageUrls.map(url => getImageUrl(url));
}

// Format price in Indian Rupees
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Get category color classes
export function getCategoryColor(category: string): string {
  const colors = {
    premium: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    adventure: 'bg-gradient-to-r from-green-400 to-emerald-500',
    holiday: 'bg-gradient-to-r from-blue-400 to-purple-500',
    trending: 'bg-gradient-to-r from-pink-400 to-rose-500',
    'fixed-departure': 'bg-gradient-to-r from-red-400 to-pink-500',
    destination: 'bg-gradient-to-r from-indigo-400 to-blue-500',
    'holiday-type': 'bg-gradient-to-r from-teal-400 to-cyan-500'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-400';
} 