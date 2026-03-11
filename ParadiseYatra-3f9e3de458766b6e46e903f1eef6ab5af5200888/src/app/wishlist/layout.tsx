import { buildStaticMetadata } from "@/lib/seo";

export const metadata = buildStaticMetadata("/wishlist");

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
