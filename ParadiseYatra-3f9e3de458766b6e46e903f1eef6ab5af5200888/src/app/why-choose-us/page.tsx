import Header from "@/components/Header";
import CertificationsSection from "@/components/why-choose-use/CertificationsSection";

import CultureSection from "@/components/why-choose-use/CultureSection";
import { HeroSection } from "@/components/why-choose-use/HeroSection";
import { InstagramFeed } from "@/components/why-choose-use/InstagramFeed";
import { LatestReviews } from "@/components/why-choose-use/LatestReviews";
import { StatsDashboard } from "@/components/why-choose-use/StatsDashboard";
import SupportAndFAQ from "@/components/why-choose-use/SupportAndFAQ";
import { TestimonialsGrid } from "@/components/why-choose-use/TestimonialsGrid";
import YouTubeSection from "@/components/why-choose-use/YouTubeSection";



export default function WhyChooseUs() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 text-slate-900 font-sans pt-16">
        {/* pt-16 adds padding-top equal to header height (h-16) */}
        <main className="w-full flex-grow">
      <HeroSection/>
          <StatsDashboard/>
          <TestimonialsGrid/>
          <CertificationsSection/>
          <LatestReviews/>
           <CultureSection/>
          <InstagramFeed/>
          <YouTubeSection/>
          <SupportAndFAQ/>
        

         
        </main>
      </div>
    </>
  );
}