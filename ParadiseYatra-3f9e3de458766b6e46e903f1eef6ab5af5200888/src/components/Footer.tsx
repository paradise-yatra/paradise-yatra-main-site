"use client";

import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Phone,
  Mail,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

interface CompanyInfo {
  name: string;
  phone: string;
  email: string;
  whatsapp: string;
}

interface FooterContent {
  companyInfo: CompanyInfo;
}

interface FooterNavLink {
  name: string;
  href: string;
}

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const fallbackInternationalCountries = [
  "Australia",
  "Bali",
  "New Zealand",
  "Sri Lanka",
  "Saudi Arabia",
  "UK",
  "Dubai",
  "Maldives",
  "Japan",
  "France",
  "Italy",
  "Greece",
  "Singapore",
  "Malaysia",
];

const fallbackIndiaStates = [
  "Jammu and Kashmir",
  "Himachal Pradesh",
  "Uttarakhand",
  "Rajasthan",
  "Kerala",
  "Goa",
  "Sikkim",
  "Andaman and Nicobar Island",
  "Ladakh",
  "Tamil Nadu",
  "Karnataka",
  "Meghalaya",
  "West Bengal",
  "Punjab",
];

const themedDestinations: FooterNavLink[][] = [
  [
    { name: "Trending Packages", href: "/package/theme/trending" },
    { name: "Where Love Takes You", href: "/package/theme/honeymoon" },
    { name: "Char Dham Yatra", href: "/package/theme/char-dham-yatra" }
  ],
  [
    { name: "Family Packages", href: "/package/theme/family" },
    { name: "Luxury Packages", href: "/package/theme/luxury" },
    { name: "Adventure Packages", href: "/package/theme/adventure" }
  ],
  [
    { name: "Fixed Departure Packages", href: "/fixed-departures" },
    { name: "Spiritual Packages", href: "/package/theme/spiritual" },
    { name: "Weekend Getaways", href: "/package/theme/weekend-getaways" }
  ],
  [
    { name: "Wildlife Packages", href: "/package/theme/wildlife" },
    { name: "Summer Packages", href: "/package/theme/summer" },
    { name: "Beach Packages", href: "/package/theme/beach" }
  ]
];

const companyLinks: FooterNavLink[] = [
  { name: "About Us", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Why Choose Us", href: "/why-choose-us" },
  { name: "Contact Us", href: "/contact" }
];

const policyLinks: FooterNavLink[] = [
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
  { name: "Privacy", href: "/privacy-policy" },
  { name: "Cookie Policy", href: "/cookie-policy" },
  { name: "Refund Policy", href: "/refund-policy" }
];

const Footer = () => {
  const [footerData, setFooterData] = useState<FooterContent | null>(null);
  const [indiaStates, setIndiaStates] = useState<string[]>([]);
  const [internationalCountries, setInternationalCountries] = useState<string[]>([]);
  const [shouldLoad, setShouldLoad] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (shouldLoad) return;
    if (typeof window === "undefined") {
      setShouldLoad(true);
      return;
    }

    const target = footerRef.current;
    if (!target) return;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad) return;
    const fetchFooterData = async () => {
      try {
        const response = await fetch("/api/footer");
        if (response.ok) {
          const data = await response.json();
          setFooterData(data);
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };

    fetchFooterData();
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad) return;
    const fetchLocations = async () => {
      try {
        const indiaResponse = await fetch("/api/all-packages?tourType=india&limit=200&isActive=true", { cache: "no-store" });
        if (indiaResponse.ok) {
          const indiaData = await indiaResponse.json();
          const packages = indiaData.packages || [];
          const uniqueStates = Array.from(
            new Set(
              packages
                .map((pkg: any) => pkg.state)
                .filter((state: string) => state && state.trim() !== "")
                .map((state: string) => state.trim())
            )
          ).sort();
          setIndiaStates(uniqueStates as string[]);
        }

        const intlResponse = await fetch("/api/all-packages?tourType=international&limit=200&isActive=true", { cache: "no-store" });
        if (intlResponse.ok) {
          const intlData = await intlResponse.json();
          const packages = intlData.packages || [];
          const uniqueCountries = Array.from(
            new Set(
              packages
                .map((pkg: any) => pkg.country)
                .filter((country: string) => country && country.trim() !== "")
                .map((country: string) => country.trim())
            )
          ).sort();
          setInternationalCountries(uniqueCountries as string[]);
        }
      } catch (error) {
        console.error("Error fetching footer destinations:", error);
      }
    };

    fetchLocations();
  }, [shouldLoad]);

  const slugify = (value: string) => value.toLowerCase().trim().replace(/\s+/g, "-");

  const toColumns = (items: FooterNavLink[], columnCount = 3): FooterNavLink[][] => {
    const cols: FooterNavLink[][] = Array.from({ length: columnCount }, () => []);
    items.forEach((item, index) => {
      cols[index % columnCount].push(item);
    });
    return cols.filter((col) => col.length > 0);
  };

  const internationalDestinations = useMemo(() => {
    const countries = (internationalCountries.length > 0 ? internationalCountries : fallbackInternationalCountries).slice(0, 14);
    const links = countries.map((country) => ({
      name: `${country} Tour Packages`,
      href: `/package/international/${slugify(country)}`,
    }));
    return toColumns(links, 3);
  }, [internationalCountries]);

  const domesticDestinations = useMemo(() => {
    const states = (indiaStates.length > 0 ? indiaStates : fallbackIndiaStates).slice(0, 14);
    const links = states.map((state) => ({
      name: `${state} Tour Packages`,
      href: `/package/india/${slugify(state)}`,
    }));
    return toColumns(links, 3);
  }, [indiaStates]);

  const companyInfo = {
    name: footerData?.companyInfo?.name || "Paradise Yatra",
    phone: footerData?.companyInfo?.phone || "+91 8031274154",
    email: footerData?.companyInfo?.email || "planners@paradiseyatra.com",
    whatsapp: footerData?.companyInfo?.whatsapp || "+91 6383822508",
  };

  const phoneHref = `tel:${companyInfo.phone.replace(/[^+\d]/g, "")}`;
  const whatsappCallHref = `tel:${companyInfo.whatsapp.replace(/[^+\d]/g, "")}`;

  return (
    <footer ref={footerRef} className="bg-black text-white font-['Plus_Jakarta_Sans',sans-serif] pt-10 pb-10 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">

        {/* Partner Logos + Registrations */}
        <div className="mb-10 grid gap-6 md:grid-cols-2 md:items-center">
          <div className="flex items-center justify-center md:justify-start">
            <div
              className="footer-partner-logo"
              role="img"
              aria-label="Uttarakhand Tourism"
            />
          </div>
          <div className="footer-registration space-y-[10px] text-left md:text-right text-white">
            <span className="block text-[14px] text-white font-normal">GSTIN: 05IYCPS1101L2ZG</span>
            <span className="block text-[14px] text-white font-normal">Udhyam: UDYAM-UK-05-0046271</span>
            <span className="block text-[14px] text-white font-normal">Uttarakhand Tourism: UTTR/DEHRADUN/08-2021/004728</span>
          </div>
        </div>

        {/* Section 1 */}
        <div className="mb-7">
          <div className="space-y-7">
            <div>
              <h3 className="text-[#a1a1aa] !text-[25px] !font-semibold mb-3 tracking-wide" style={{ fontSize: "25px", fontWeight: 600 }}>International Destinations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-6">
                {internationalDestinations.map((col, idx) => (
                  <div key={idx} className="flex flex-col space-y-[10px]">
                    {col.map((link) => (
                      <Link key={link.name} href={link.href} className="text-[14px] text-white hover:text-[#60a5fa] transition-colors">{link.name}</Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[#a1a1aa] !text-[25px] !font-semibold mb-3 tracking-wide" style={{ fontSize: "25px", fontWeight: 600 }}>Domestic Destinations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-6">
                {domesticDestinations.map((col, idx) => (
                  <div key={idx} className="flex flex-col space-y-[10px]">
                    {col.map((link) => (
                      <Link key={link.name} href={link.href} className="text-[14px] text-white hover:text-[#60a5fa] transition-colors">{link.name}</Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 my-7"></div>

        {/* Section 2 */}
        <div className="mb-7">
          <h3 className="text-[#a1a1aa] !text-[25px] !font-semibold mb-4 tracking-wide" style={{ fontSize: "25px", fontWeight: 600 }}>Themed Destinations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-7">
            {themedDestinations.map((col, idx) => (
              <div key={idx} className="flex flex-col space-y-[10px]">
                {col.map((link) => (
                  <Link key={link.name} href={link.href} className="text-[14px] text-white hover:text-[#60a5fa] transition-colors">{link.name}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 my-7"></div>

        {/* Section 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">

          {/* Col 1 */}
          <div>
            <h3 className="text-[#a1a1aa] !text-[25px] !font-semibold mb-4 tracking-wide" style={{ fontSize: "25px", fontWeight: 600 }}>{companyInfo.name}</h3>
            <div className="flex flex-col space-y-[10px]">
              {companyLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-[14px] text-white hover:text-[#60a5fa] transition-colors">{link.name}</Link>
              ))}
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="text-[#a1a1aa] !text-[25px] !font-semibold mb-4 tracking-wide" style={{ fontSize: "25px", fontWeight: 600 }}>Policy</h3>
            <div className="flex flex-col space-y-[10px]">
              {policyLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-[14px] text-white hover:text-[#60a5fa] transition-colors">{link.name}</Link>
              ))}
            </div>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="text-[#a1a1aa] !text-[25px] !font-semibold mb-4 tracking-wide" style={{ fontSize: "25px", fontWeight: 600 }}>Talk to us</h3>
            <div className="flex flex-col space-y-3">
              <a href={`mailto:${companyInfo.email}`} className="flex items-center text-[14px] text-white hover:text-[#60a5fa] transition-colors group">
                <Mail className="w-5 h-5 mr-3 text-white group-hover:text-[#60a5fa]" strokeWidth={1.5} /> {companyInfo.email}
              </a>
              <a href={phoneHref} className="flex items-center text-[14px] text-white hover:text-[#60a5fa] transition-colors group">
                <Phone className="w-5 h-5 mr-3 text-white group-hover:text-[#60a5fa]" strokeWidth={1.5} />
                <span>{companyInfo.phone}</span>
                <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#cbd5e1] border border-white/15 uppercase tracking-[0.12em]">International</span>
              </a>
              <a href={whatsappCallHref} className="flex items-center text-[14px] text-white hover:text-[#60a5fa] transition-colors group">
                <Phone className="w-5 h-5 mr-3 text-white group-hover:text-[#60a5fa]" strokeWidth={1.5} />
                <span>{companyInfo.whatsapp}</span>
                <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#cbd5e1] border border-white/15 uppercase tracking-[0.12em]">Domestic</span>
              </a>
              <a href={`mailto:sales@paradiseyatra.com`} className="flex items-center text-[14px] text-white hover:text-[#60a5fa] transition-colors group">
                <Mail className="w-5 h-5 mr-3 text-white group-hover:text-[#60a5fa]" strokeWidth={1.5} /> sales@paradiseyatra.com
              </a>
            </div>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <h3 className="text-[#a1a1aa] !text-[25px] !font-semibold mb-4 tracking-wide" style={{ fontSize: "25px", fontWeight: 600 }}>Social</h3>
              <div className="flex flex-col space-y-[10px]">
                <a href="https://www.facebook.com/paradiseyatra/" target="_blank" rel="noopener noreferrer" className="flex items-center text-[14px] text-white hover:text-[#60a5fa] transition-colors group">
                  <Facebook className="w-5 h-5 mr-3 text-white group-hover:text-[#60a5fa]" strokeWidth={1.5} /> Facebook
                </a>
                <a href="https://x.com/ParadiseYatra" target="_blank" rel="noopener noreferrer" className="flex items-center text-[14px] text-white hover:text-[#60a5fa] transition-colors group">
                  <XIcon className="w-5 h-5 mr-3 text-white group-hover:text-[#60a5fa]" /> X
                </a>
                <a href="https://www.instagram.com/paradiseyatra/" target="_blank" rel="noopener noreferrer" className="flex items-center text-[14px] text-white hover:text-[#60a5fa] transition-colors group">
                  <Instagram className="w-5 h-5 mr-3 text-white group-hover:text-[#60a5fa]" strokeWidth={1.5} /> Instagram
                </a>
                <a href="https://www.linkedin.com/company/paradise-yatra" target="_blank" rel="noopener noreferrer" className="flex items-center text-[14px] text-white hover:text-[#60a5fa] transition-colors group">
                  <Linkedin className="w-5 h-5 mr-3 text-white group-hover:text-[#60a5fa]" strokeWidth={1.5} /> LinkedIn
                </a>
                <a href="https://www.youtube.com/@ParadiseYatra" target="_blank" rel="noopener noreferrer" className="flex items-center text-[14px] text-white hover:text-[#60a5fa] transition-colors group">
                  <Youtube className="w-5 h-5 mr-3 text-white group-hover:text-[#60a5fa]" strokeWidth={1.5} /> Youtube
                </a>
              </div>
            </div></div>

        </div>

        <div className="border-t border-white/10 my-7"></div>

        {/* Section 4: Map & Address */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
          <div>
            <h3 className="text-[#a1a1aa] !text-[25px] !font-semibold mb-4 tracking-wide" style={{ fontSize: "25px", fontWeight: 600 }}>
              Find Us
            </h3>
            <div className="rounded-[6px] overflow-hidden border border-white/15">
              <iframe
                title="Paradise Yatra Office Location"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1388.6582464962262!2d78.03477118988253!3d30.327473883386677!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39092a19318db8c3%3A0xd8c55020cab7d0c4!2sParadise%20Yatra!5e0!3m2!1sen!2sin!4v1772634410746!5m2!1sen!2sin"
                className="w-full h-[250px]"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div>
            <h3 className="text-[#a1a1aa] !text-[25px] !font-semibold mb-4 tracking-wide" style={{ fontSize: "25px", fontWeight: 600 }}>
              Address
            </h3>
            <p className="text-[14px] text-white leading-relaxed">
              108, Tagore Villa, Near Natraj Cinema, Chakrata Road, Dehradun, Uttarakhand - 248001.
            </p>
            <a
              href="https://maps.app.goo.gl/UKUXKaedF9Naf4i28"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-[14px] text-white hover:text-[#60a5fa] transition-colors"
            >
              View on Google Maps
            </a>

            <div className="mt-5">
              <h4 className="text-[14px] font-semibold text-[#a1a1aa] mb-2">Grievance Officer</h4>
              <p className="text-[14px] text-white">Dikshant Sharma</p>
              <a href="tel:+919873391733" className="block text-[14px] text-white hover:text-[#60a5fa] transition-colors">
                +91 9873391733
              </a>
              <a href="mailto:dikshant@paradiseyatra.com" className="block text-[14px] text-white hover:text-[#60a5fa] transition-colors">
                dikshant@paradiseyatra.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 text-[13px] text-[#a1a1aa] leading-relaxed text-center">
          Paradise Yatra Private Ltd. © 2026 all rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

