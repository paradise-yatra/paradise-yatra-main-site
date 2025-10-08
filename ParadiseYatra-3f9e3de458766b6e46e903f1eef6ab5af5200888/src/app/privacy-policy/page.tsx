import type { Metadata } from "next";
import { LazyHeader, LazyFooter } from "@/components/lazy-components";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Privacy Policy | Paradise Yatra",
  description:
    "Read Paradise Yatra's Privacy Policy. Learn how we collect, use, share, and protect your data in compliance with India's IT Act (SPDI Rules, 2011) and the DPDP Act, 2023.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main className={`${roboto.className} min-h-screen bg-background w-full`}>
      <LazyHeader />


      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 pt-28 lg:pt-32 pb-8 lg:pb-10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h2 className="text-xl md:text-5xl font-bold text-gray-900">Privacy Policy</h2>
          <p className="mt-4 text-gray-700 max-w-3xl">
            This Privacy Policy explains how Paradise Yatra ("we", "us", "our") collects, uses,
            discloses, and protects your information when you use our website, products, and
            services. It complies with the Information Technology Act, 2000 and the Information Technology
            (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 ("SPDI Rules"),
            and is aligned with the Digital Personal Data Protection Act, 2023 ("DPDP Act").
          </p>
          <p className="mt-2 text-gray-600">Effective Date: 01 September 2025 • Last Updated: 01 September 2025</p>
        </div>
      </section>

      {/* Table of contents */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-8 !pb-5">
          <h2 className="text-xl font-semibold text-gray-900 pt-5">Contents</h2>
          <ul className="mt-4 grid md:grid-cols-2 gap-2 text-blue-700">
            <li><a href="#scope" className=" hover:underline ">Scope</a></li>
            <li><a href="#definitions" className="hover:underline">Key Definitions</a></li>
            <li><a href="#collection" className="hover:underline pt-2">Information We Collect</a></li>
            <li><a href="#use" className="hover:underline pt-2">How We Use Your Information</a></li>
            <li><a href="#cookies" className="hover:underline pt-2">Cookies and Tracking</a></li>
            <li><a href="#sharing" className="hover:underline">Sharing and Disclosure</a></li>
            <li><a href="#transfer" className="hover:underline">International Transfers</a></li>
            <li><a href="#security" className="hover:underline">Security Practices</a></li>
            <li><a href="#retention" className="hover:underline">Data Retention</a></li>
            <li><a href="#rights" className="hover:underline">Your Rights and Choices</a></li>
            <li><a href="#children" className="hover:underline">Children&apos;s Privacy</a></li>
            <li><a href="#grievance" className="hover:underline">Grievance Redressal</a></li>
            <li><a href="#changes" className="hover:underline">Changes to this Policy</a></li>
            <li><a href="#contact" className="hover:underline">Contact Us</a></li>
          </ul>
        </div>
      </section>

      <section className="bg-white">
        <div className="container mx-auto px-4 py-10 space-y-10 text-gray-800">
          <section id="scope" aria-labelledby="scope-heading" className="space-y-3">
            <h2 id="scope-heading" className="text-2xl font-bold">Scope</h2>
            <p>
              This policy applies to personal data collected through our website, contact forms, bookings,
              customer support, marketing communications, and related online services. It does not apply to
              third-party websites or services that we do not control.
            </p>
          </section>

          <section id="definitions" aria-labelledby="definitions-heading" className="space-y-3">
            <h2 id="definitions-heading" className="text-2xl font-bold">Key Definitions</h2>
            <p>
              "Personal data" means any data about an individual who is identifiable by or in relation to
              such data. "Sensitive personal data or information" (SPDI) under the SPDI Rules includes
              passwords, financial information (such as bank account or card details), physical, physiological
              and mental health condition, sexual orientation, medical records and history, and biometric
              information.
            </p>
          </section>

          <section id="collection" aria-labelledby="collection-heading" className="space-y-3">
            <h2 id="collection-heading" className="text-2xl font-bold">Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Account and contact details: name, email address, phone number, and communication
                preferences.
              </li>
              <li>
                Booking and travel details: destination, dates, traveler details (including for co-travelers
                you share with us), special requests, and service history.
              </li>
              <li>
                Payment information: collected via our payment providers. We do not store full card data on
                our servers. Limited references/tokens may be stored for refunds and reconciliation.
              </li>
              <li>
                Optional SPDI: only where necessary and with explicit consent, such as health information
                relevant to travel (e.g., accessibility needs), government ID for bookings (as legally
                required), and limited biometric data only if mandated by a carrier or authority.
              </li>
              <li>
                Device and usage data: IP address, device identifiers, browser type, pages visited, and
                interactions collected via analytics and cookies.
              </li>
              <li>
                Communications: queries, feedback, and support interactions.
              </li>
              <li>
                Marketing preferences: opt-ins, unsubscribe choices, and campaign engagement.
              </li>
            </ul>
            <p className="text-sm text-gray-600">
              Note: Please avoid sharing SPDI unless specifically requested for a lawful booking purpose. If
              you share SPDI inadvertently, you may request deletion using the process below.
            </p>
          </section>

          <section id="use" aria-labelledby="use-heading" className="space-y-3">
            <h2 id="use-heading" className="text-2xl font-bold">How we use your information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, personalize, and manage bookings, itineraries, and related services.</li>
              <li>Communicate about inquiries, confirmations, updates, and support.</li>
              <li>Process payments, refunds, and prevent fraud or misuse.</li>
              <li>Comply with legal obligations, including KYC/ID requirements of partners or authorities.</li>
              <li>Improve site performance, user experience, and service quality.</li>
              <li>Send marketing communications with your consent; you can opt out anytime.</li>
            </ul>
            <p>
              Legal grounds include consent (particularly for SPDI and marketing), performance of a contract,
              compliance with law, and legitimate interests such as improving services and ensuring security.
            </p>
          </section>

          <section id="cookies" aria-labelledby="cookies-heading" className="space-y-3">
            <h2 id="cookies-heading" className="text-2xl font-bold">Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies for essential site functions, analytics, and to
              remember your preferences. Where required, we seek your consent. You can manage cookies in your
              browser settings. Disabling certain cookies may impact site functionality.
            </p>
          </section>

          <section id="sharing" aria-labelledby="sharing-heading" className="space-y-3">
            <h2 id="sharing-heading" className="text-2xl font-bold">Sharing and Disclosure</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Service providers and partners: hotels, airlines, local operators, payment gateways, CRM and
                analytics providers who process data under appropriate safeguards.
              </li>
              <li>
                Legal and compliance: to law enforcement, regulators, or courts when legally required or to
                protect our rights, users, or the public.
              </li>
              <li>
                Business transfers: in connection with mergers, acquisitions, or restructuring, subject to
                this policy or equivalent safeguards.
              </li>
            </ul>
            <p>
              We do not sell personal data. We share SPDI only with consent or as required for a lawful
              purpose and on a need-to-know basis per the SPDI Rules.
            </p>
          </section>

          <section id="transfer" aria-labelledby="transfer-heading" className="space-y-3">
            <h2 id="transfer-heading" className="text-2xl font-bold">International Transfers</h2>
            <p>
              Your data may be transferred to and processed in countries outside India where our partners or
              service providers operate. Such transfers are made with your consent where required and with
              reasonable security practices and contractual safeguards to protect your information.
            </p>
          </section>

          <section id="security" aria-labelledby="security-heading" className="space-y-3">
            <h2 id="security-heading" className="text-2xl font-bold">Security Practices</h2>
            <p>
              We implement reasonable security practices and procedures as required under Rule 8 of the SPDI
              Rules, including organizational, technical, and physical measures to protect data against
              unauthorized access, alteration, disclosure, or destruction. We follow industry-standard
              controls, encryption in transit, access controls, and regular reviews of security measures.
            </p>
          </section>

          <section id="retention" aria-labelledby="retention-heading" className="space-y-3">
            <h2 id="retention-heading" className="text-2xl font-bold">Data Retention</h2>
            <p>
              We retain personal data for as long as needed to fulfill the purposes outlined in this policy,
              comply with legal, accounting, or reporting requirements, resolve disputes, and enforce
              agreements. When no longer needed, data is deleted or de-identified per our retention schedule.
            </p>
          </section>

          <section id="rights" aria-labelledby="rights-heading" className="space-y-3">
            <h2 id="rights-heading" className="text-2xl font-bold">Your Rights & Choices</h2>
            <p>
              Subject to applicable law, including the DPDP Act, you may have the right to access, correct,
              update, or delete your data; withdraw consent; and register a grievance. To exercise these
              rights, please contact us using the details below. We will verify your request and respond within
              reasonable timelines. You may also opt out of marketing communications using the unsubscribe
              option in our emails.
            </p>
          </section>

          <section id="children" aria-labelledby="children-heading" className="space-y-3">
            <h2 id="children-heading" className="text-2xl font-bold">Children&apos;s Privacy</h2>
            <p>
              Our services are not directed to children under 18. We do not knowingly collect personal data
              from children without appropriate consent from a parent or guardian where required by law. If you
              believe a child has provided us data without consent, please contact us to request deletion.
            </p>
          </section>

          <section id="grievance" aria-labelledby="grievance-heading" className="space-y-3">
            <h2 id="grievance-heading" className="text-2xl font-bold">Grievance Redressal</h2>
            <p>
              In accordance with Rule 5(9) of the SPDI Rules, you may contact our Grievance Officer for any
              questions or complaints regarding the processing of your personal data or this policy.
            </p>
            <address className="not-italic text-gray-700">
              <div className="font-semibold">Grievance Officer</div>
              <div>Paradise Yatra</div>
              <div>Dehradun, Uttarakhand, India</div>
              <div>Phone: <a className="text-blue-700 hover:underline" href="tel:+918979396413">+91 8979396413</a></div>
              <div>Email: <a className="text-blue-700 hover:underline" href="mailto:info@paradiseyatra.com">info@paradiseyatra.com</a></div>
            </address>
          </section>

          <section id="changes" aria-labelledby="changes-heading" className="space-y-3">
            <h2 id="changes-heading" className="text-2xl font-bold">Changes to this Policy</h2>
            <p>
              We may update this policy to reflect changes in legal requirements or our practices. Material
              changes will be notified by updating the effective date above and, where appropriate, through
              website notices or direct communication.
            </p>
          </section>

          <section id="contact" aria-labelledby="contact-heading" className="space-y-3 pb-10">
            <h2 id="contact-heading" className="text-2xl font-bold">Contact Us</h2>
            <p>
              For privacy-related queries, rights requests, or concerns, contact us at
              <a className="text-blue-700 hover:underline ml-1" href="mailto:info@paradiseyatra.com">info@paradiseyatra.com</a>
              {" "}or call <a className="text-blue-700 hover:underline" href="tel:+918979396413">+91 8979396413</a>.
            </p>
          </section>
        </div>
      </section>

      <LazyFooter />
    </main>
  );
}


