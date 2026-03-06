import type { Metadata } from "next";
import { LazyHeader } from "@/components/lazy-components";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Cookie Policy | Paradise Yatra",
  description:
    "Read Paradise Yatra's Cookie Policy to understand what cookies we use, why we use them, and how your continued use of the site applies to cookie usage.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-white font-plus-jakarta-sans pb-6 policy-content">
      <LazyHeader />

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row w-full md:h-[496px] md:overflow-hidden items-center justify-center bg-white md:bg-transparent">
        <div className="md:hidden w-full px-4 pt-6 pb-2 bg-white text-left z-10 flex-shrink-0">
          <div className="!text-[28px] !font-black text-slate-800 font-plus-jakarta-sans tracking-tight leading-tight">
            Cookie <span className="text-[#000945]">Policy</span>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative w-full h-[230.4px] md:absolute md:inset-0 md:h-auto flex-shrink-0">
          <Image
            src="/Legal/Cookie%20Policy/Image.webp"
            alt="Paradise Yatra Cookie Policy"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Centered Hub (Hidden on mobile) */}
        <div className="hidden md:block max-w-6xl w-full mx-auto px-4 md:px-8 relative z-30">
          <div className="flex flex-col items-center max-w-5xl mx-auto w-full">
            <Card className="bg-white rounded-[6px] shadow-none border border-slate-100 overflow-hidden w-full md:h-[150px] flex items-center">
              <CardContent className="p-0 md:p-6 w-full h-full flex flex-col justify-center items-center">
                {/* Desktop Heading */}
                <h1 className="hidden md:block !text-xl md:!text-[44px] !font-black text-slate-800 mb-4 text-center font-plus-jakarta-sans tracking-tight leading-tight">
                  Cookie <span className="text-[#000945]">Policy</span>
                </h1>

                <div className="hidden md:flex flex-nowrap items-center justify-center w-full px-2 md:px-4">
                  <span className="text-slate-500 font-medium text-[15px] tracking-tight">
                    Last updated: <span className="text-[#000945] font-bold">5th March 2026</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-12 pb-4">
        <div className="relative items-start">
          <div className="w-full">
            <div className="space-y-8">
              <section id="scope" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: "#000945" }} className="!text-[24px] md:!text-[36px] tracking-tight">
                    Scope
                  </h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <p style={{ color: "#000945", fontWeight: 500 }}>
                    This Cookie Policy explains how Paradise Yatra uses cookies and similar technologies on our website.
                    It should be read together with our Privacy Policy.
                  </p>
                </div>
              </section>

              <section id="what-are-cookies" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: "#000945" }} className="!text-[24px] md:!text-[36px] tracking-tight">
                    What Are Cookies?
                  </h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <p style={{ color: "#000945", fontWeight: 500 }}>
                    Cookies are small text files stored on your device when you visit a website. They help websites
                    remember your actions and preferences, improve functionality, and understand how users interact
                    with pages.
                  </p>
                </div>
              </section>

              <section id="types" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: "#000945" }} className="!text-[24px] md:!text-[36px] tracking-tight">
                    Types of Cookies We Use
                  </h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <ul className="list-disc pl-6 space-y-2" style={{ color: "#000945", fontWeight: 500 }}>
                    <li>
                      <p style={{ color: "#000945", fontWeight: 500 }}>
                        <span style={{ fontWeight: 700 }}>Essential cookies:</span> Needed for security, navigation, and core site functionality.
                      </p>
                    </li>
                    <li>
                      <p style={{ color: "#000945", fontWeight: 500 }}>
                        <span style={{ fontWeight: 700 }}>Analytics cookies:</span> Help us measure traffic, understand usage patterns, and improve user experience.
                      </p>
                    </li>
                    <li>
                      <p style={{ color: "#000945", fontWeight: 500 }}>
                        <span style={{ fontWeight: 700 }}>Third-party cookies:</span> May be set by external providers such as analytics, social media, and embedded content services.
                      </p>
                    </li>
                  </ul>
                </div>
              </section>

              <section id="consent" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: "#000945" }} className="!text-[24px] md:!text-[36px] tracking-tight">
                    Consent and Choices
                  </h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <p style={{ color: "#000945", fontWeight: 500 }}>
                    By continuing to use our website, you acknowledge and accept the use of cookies as described in this
                    policy. Our cookie notice is informational and reminds users that browsing the site means accepting
                    these cookie terms.
                  </p>
                </div>
              </section>

              <section id="manage" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: "#000945" }} className="!text-[24px] md:!text-[36px] tracking-tight">
                    Managing Cookies
                  </h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <ul className="list-disc pl-6 space-y-2" style={{ color: "#000945", fontWeight: 500 }}>
                    <li><p style={{ color: "#000945", fontWeight: 500 }}>You can clear or block cookies from your browser settings at any time.</p></li>
                    <li><p style={{ color: "#000945", fontWeight: 500 }}>Some site features, analytics, or embedded services may not function properly if cookies are blocked.</p></li>
                    <li><p style={{ color: "#000945", fontWeight: 500 }}>Continued use of this website indicates acceptance of the cookie practices outlined here.</p></li>
                  </ul>
                </div>
              </section>

              <section id="updates" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: "#000945" }} className="!text-[24px] md:!text-[36px] tracking-tight">
                    Changes to This Policy
                  </h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <p style={{ color: "#000945", fontWeight: 500 }}>
                    We may update this Cookie Policy from time to time to reflect legal, technical, or operational changes.
                    We will update the date shown above when changes are made.
                  </p>
                </div>
              </section>

              <section id="contact" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: "#000945" }} className="!text-[24px] md:!text-[36px] tracking-tight">
                    Contact Us
                  </h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <p style={{ color: "#000945", fontWeight: 500 }}>
                    For questions about this Cookie Policy, contact us at{" "}
                    <a
                      className="text-[#000945] underline hover:text-[#155dfc] font-semibold transition-colors duration-200"
                      href="mailto:info@paradiseyatra.com"
                    >
                      info@paradiseyatra.com
                    </a>.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

