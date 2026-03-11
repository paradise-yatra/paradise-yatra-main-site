// app/refund-policy/page.tsx
import CancellationRefundContent from '@/components/CancellationRefundContent';
import { LazyHeader } from '@/components/lazy-components';
import { buildStaticMetadata } from "@/lib/seo";

export const metadata = buildStaticMetadata("/refund-policy");

export default function CancellationRefundPage() {
  return (
    <>
      <LazyHeader />
      <CancellationRefundContent />
    </>
  );
}
