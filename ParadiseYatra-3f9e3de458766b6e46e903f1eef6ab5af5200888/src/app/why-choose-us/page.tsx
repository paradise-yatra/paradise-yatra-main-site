import Header from "@/components/Header";
import CertificationsSection from "@/components/why-choose-us/CertificationsSection";

import CultureSection from "@/components/why-choose-us/CultureSection";
import { HeroSection } from "@/components/why-choose-us/HeroSection";
import { LatestReviews } from "@/components/why-choose-us/LatestReviews";
import SupportAndFAQ from "@/components/why-choose-us/SupportAndFAQ";
import SocialJourneySection from "@/components/SocialJourneySection";
import { buildStaticMetadata } from "@/lib/seo";

export const metadata = buildStaticMetadata("/why-choose-us");

export default function WhyChooseUs() {
  return (
    <>
      <Header disableOffset={true} />
      <div className="min-h-screen bg-white text-slate-900 font-sans">
        {/* pt-16 adds padding-top equal to header height (h-16) */}
        <main className="w-full flex-grow">
          <HeroSection />
          <CertificationsSection />
          <LatestReviews />
          <CultureSection />
          <SocialJourneySection />
          <SupportAndFAQ />
        </main>
      </div>
    </>
  );
}
