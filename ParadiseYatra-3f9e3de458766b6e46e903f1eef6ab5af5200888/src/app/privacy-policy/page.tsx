import type { Metadata } from "next";
import { LazyHeader, LazyFooter } from "@/components/lazy-components";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy | Paradise Yatra",
  description:
    "Read Paradise Yatra's Privacy Policy. Learn how we collect, use, share, and protect your data in compliance with India's IT Act (SPDI Rules, 2011) and the DPDP Act, 2023.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white font-plus-jakarta-sans pb-6 policy-content">
      <LazyHeader />

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row w-full md:h-[496px] md:overflow-hidden items-center justify-center bg-white md:bg-transparent">
        <div className="md:hidden w-full px-4 pt-6 pb-2 bg-white text-left z-10 flex-shrink-0">
          <div className="!text-[28px] !font-black text-slate-800 font-plus-jakarta-sans tracking-tight leading-tight">
            Privacy <span className="text-[#000945]">Policy</span>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative w-full h-[230.4px] md:absolute md:inset-0 md:h-auto flex-shrink-0">
          <Image
            src="/Legal/Privacy%20Policy/Hero%20Image.jpg"
            alt="Paradise Yatra Privacy Policy"
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
                  Privacy <span className="text-[#000945]">Policy</span>
                </h1>

                <div className="hidden md:flex flex-nowrap items-center justify-center w-full px-2 md:px-4">
                  <span className="text-slate-500 font-medium text-[15px] tracking-tight">
                    Last updated: <span className="text-[#000945] font-bold">2nd March 2026</span>
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
                  <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Scope</h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <p style={{ color: '#000945', fontWeight: 500 }}>
                    This policy applies to personal data collected through our website, contact forms, bookings, customer support, marketing communications, and related online services. It does not apply to third-party websites or services that we do not control.
                  </p>
                </div>
              </section>

              <section id="definitions" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Key Definitions</h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <p style={{ color: '#000945', fontWeight: 500 }}>
                    "Personal data" means any data about an individual who is identifiable by or in relation to such data. "Sensitive personal data or information" (SPDI) under the SPDI Rules includes passwords, financial information (such as bank account or card details), physical, physiological and mental health condition, sexual orientation, medical records and history, and biometric information.
                  </p>
                </div>
              </section>

              <section id="collection" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Information We Collect</h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <ul className="list-disc pl-6 space-y-2" style={{ color: '#000945', fontWeight: 500 }}>
                    <li><p style={{ color: '#000945', fontWeight: 500 }}>Account and contact details: name, email address, phone number, and communication preferences.</p></li>
                    <li><p style={{ color: '#000945', fontWeight: 500 }}>Booking and travel details: destination, dates, traveler details (including for co-travelers you share with us), special requests, and service history.</p></li>
                    <li><p style={{ color: '#000945', fontWeight: 500 }}>Payment information: collected via our payment providers. We do not store full card data on our servers. Limited references/tokens may be stored for refunds and reconciliation.</p></li>
                    <li><p style={{ color: '#000945', fontWeight: 500 }}>Optional SPDI: only where necessary and with explicit consent, such as health information relevant to travel (e.g., accessibility needs), government ID for bookings (as legally required), and limited biometric data only if mandated by a carrier or authority.</p></li>
                    <li><p style={{ color: '#000945', fontWeight: 500 }}>Device and usage data: IP address, device identifiers, browser type, pages visited, and interactions collected via analytics and cookies.</p></li>
                    <li><p style={{ color: '#000945', fontWeight: 500 }}>Communications: queries, feedback, and support interactions.</p></li>
                    <li><p style={{ color: '#000945', fontWeight: 500 }}>Marketing preferences: opt-ins, unsubscribe choices, and campaign engagement.</p></li>
                  </ul>
                  <p className="text-sm italic" style={{ color: '#000945', fontWeight: 500 }}>
                    Note: Please avoid sharing SPDI unless specifically requested for a lawful booking purpose. If you share SPDI inadvertently, you may request deletion using the process below.
                  </p>
                </div>
              </section>

              <section id="use" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">How we use your information</h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <ul className="list-disc pl-6 space-y-2" style={{ color: '#000945', fontWeight: 500 }}>
                    <li><p style={{ color: '#000945', fontWeight: 500 }}>Provide, personalize, and manage bookings, itineraries, and related services.</p></li>
                    <li><p style={{ color: '#000945', fontWeight: 500 }}>Communicate about inquiries, confirmations, updates, and support.</p></li>
                    <li><p style={{ color: '#000945', fontWeight: 500 }}>Process payments, refunds, and prevent fraud or misuse.</p></li>
                    <li><p style={{ color: '#000945', fontWeight: 500 }}>Comply with legal obligations, including KYC/ID requirements of partners or authorities.</p></li>
                    <li><p style={{ color: '#000945', fontWeight: 500 }}>Improve site performance, user experience, and service quality.</p></li>
                    <li><p style={{ color: '#000945', fontWeight: 500 }}>Send marketing communications with your consent; you can opt out anytime.</p></li>
                  </ul>
                  <p style={{ color: '#000945', fontWeight: 500 }}>
                    Legal grounds include consent (particularly for SPDI and marketing), performance of a contract, compliance with law, and legitimate interests such as improving services and ensuring security.
                  </p>
                </div>
              </section>

              <section id="cookies" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Cookies and Tracking</h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <p style={{ color: '#000945', fontWeight: 500 }}>
                    We use cookies and similar technologies for essential site functions, analytics, and to remember your preferences. Where required, we seek your consent. You can manage cookies in your browser settings. Disabling certain cookies may impact site functionality.
                  </p>
                </div>
              </section>

              <section id="sharing" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Sharing and Disclosure</h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <ul className="list-disc pl-6 space-y-2" style={{ color: '#000945', fontWeight: 500 }}>
                    <li><p style={{ color: '#000945', fontWeight: 500 }}>Service providers and partners: hotels, airlines, local operators, payment gateways, CRM and analytics providers who process data under appropriate safeguards.</p></li>
                    <li><p style={{ color: '#000945', fontWeight: 500 }}>Legal and compliance: to law enforcement, regulators, or courts when legally required or to protect our rights, users, or the public.</p></li>
                    <li><p style={{ color: '#000945', fontWeight: 500 }}>Business transfers: in connection with mergers, acquisitions, or restructuring, subject to this policy or equivalent safeguards.</p></li>
                  </ul>
                  <p style={{ color: '#000945', fontWeight: 500 }}>
                    We do not sell personal data. We share SPDI only with consent or as required for a lawful purpose and on a need-to-know basis per the SPDI Rules.
                  </p>
                </div>
              </section>

              <section id="transfer" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">International Transfers</h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <p style={{ color: '#000945', fontWeight: 500 }}>
                    Your data may be transferred to and processed in countries outside India where our partners or service providers operate. Such transfers are made with your consent where required and with reasonable security practices and contractual safeguards to protect your information.
                  </p>
                </div>
              </section>

              <section id="security" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Security Practices</h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <p style={{ color: '#000945', fontWeight: 500 }}>
                    We implement reasonable security practices and procedures as required under Rule 8 of the SPDI Rules, including organizational, technical, and physical measures to protect data against unauthorized access, alteration, disclosure, or destruction. We follow industry-standard controls, encryption in transit, access controls, and regular reviews of security measures.
                  </p>
                </div>
              </section>

              <section id="retention" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Data Retention</h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <p style={{ color: '#000945', fontWeight: 500 }}>
                    We retain personal data for as long as needed to fulfill the purposes outlined in this policy, comply with legal, accounting, or reporting requirements, resolve disputes, and enforce agreements. When no longer needed, data is deleted or de-identified per our retention schedule.
                  </p>
                </div>
              </section>

              <section id="rights" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Your Rights & Choices</h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <p style={{ color: '#000945', fontWeight: 500 }}>
                    Subject to applicable law, including the DPDP Act, you may have the right to access, correct, update, or delete your data; withdraw consent; and register a grievance. To exercise these rights, please contact us using the details below. We will verify your request and respond within reasonable timelines. You may also opt out of marketing communications using the unsubscribe option in our emails.
                  </p>
                </div>
              </section>

              <section id="children" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Children&apos;s Privacy</h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <p style={{ color: '#000945', fontWeight: 500 }}>
                    Our services are not directed to children under 18. We do not knowingly collect personal data from children without appropriate consent from a parent or guardian where required by law. If you believe a child has provided us data without consent, please contact us to request deletion.
                  </p>
                </div>
              </section>

              <section id="grievance" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Grievance Redressal</h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <p style={{ color: '#000945', fontWeight: 500 }}>
                    In accordance with Rule 5(9) of the SPDI Rules, you may contact our Grievance Officer for any questions or complaints regarding the processing of your personal data or this policy.
                  </p>
                  <address className="not-italic" style={{ color: '#000945', fontWeight: 500 }}>
                    <div style={{ fontWeight: 700 }}>Grievance Officer</div>
                    <div>Paradise Yatra</div>
                    <div>Dehradun, Uttarakhand, India</div>
                    <div>Phone: <a className="text-[#000945] underline hover:text-[#155dfc] font-semibold transition-colors duration-200" href="tel:+918979396413">+91 8979396413</a></div>
                    <div>Email: <a className="text-[#000945] underline hover:text-[#155dfc] font-semibold transition-colors duration-200" href="mailto:info@paradiseyatra.com">info@paradiseyatra.com</a></div>
                  </address>
                </div>
              </section>

              <section id="changes" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Changes to this Policy</h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <p style={{ color: '#000945', fontWeight: 500 }}>
                    We may update this policy to reflect changes in legal requirements or our practices. Material changes will be notified by updating the effective date above and, where appropriate, through website notices or direct communication.
                  </p>
                </div>
              </section>

              <section id="contact" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Contact Us</h2>
                </div>
                <div className="space-y-4 leading-relaxed text-[15px]">
                  <p style={{ color: '#000945', fontWeight: 500 }}>
                    For privacy-related queries, rights requests, or concerns, contact us at
                    {" "}<a className="text-[#000945] underline hover:text-[#155dfc] font-semibold transition-colors duration-200" href="mailto:info@paradiseyatra.com">info@paradiseyatra.com</a>
                    {" "}or call <a className="text-[#000945] underline hover:text-[#155dfc] font-semibold transition-colors duration-200" href="tel:+918979396413">+91 8979396413</a>.
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





