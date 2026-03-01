"use client";

import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  Headset,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface FooterLink {
  name: string;
  href: string;
}

interface SocialMedia {
  platform: string;
  url: string;
  isActive: boolean;
}

interface CompanyInfo {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
}

interface FooterContent {
  companyInfo: CompanyInfo;
  links: {
    international: FooterLink[];
    india: FooterLink[];
    trekking: FooterLink[];
    quickLinks: FooterLink[];
  };
  socialMedia: SocialMedia[];
}

const Footer = () => {
  const [footerData, setFooterData] = useState<FooterContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const normalizePlatform = (platform: string) => {
    const normalized = (platform || "").trim().toLowerCase();
    if (normalized === "x") return "twitter";
    if (normalized === "ig" || normalized === "insta") return "instagram";
    if (normalized === "yt") return "youtube";
    if (normalized === "fb") return "facebook";
    if (normalized === "in") return "linkedin";
    return normalized;
  };

  const cleanUrl = (url: string): { href: string } => {
    const rawUrl = (url || "").trim();
    if (!rawUrl || rawUrl === "#") {
      return { href: "#" };
    }
    const cleanedUrl = rawUrl.startsWith("#") ? rawUrl.substring(1).trim() : rawUrl;
    if (!cleanedUrl || cleanedUrl === "#") {
      return { href: "#" };
    }
    if (
      cleanedUrl.startsWith("http://") ||
      cleanedUrl.startsWith("https://") ||
      cleanedUrl.startsWith("mailto:") ||
      cleanedUrl.startsWith("tel:") ||
      cleanedUrl.startsWith("/")
    ) {
      return { href: cleanedUrl };
    }
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(cleanedUrl)) {
      return { href: `https://${cleanedUrl}` };
    }
    return { href: "#" };
  };

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch("/api/footer");
        if (response.ok) {
          const data = await response.json();
          setFooterData(data);
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFooterData();
  }, []);

  const staticQuickLinks: FooterLink[] = [
    { name: "Home", href: "/" },
    { name: "Tour Packages", href: "/packages" },
    { name: "Travel Blog", href: "/blog" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const footerLinks = {
    international: footerData?.links?.international || [
      { name: "Singapore", href: "/packages?location=singapore" },
      { name: "Thailand", href: "/packages?location=thailand" },
      { name: "Malaysia", href: "/packages?location=malaysia" },
      { name: "Vietnam", href: "/packages?location=vietnam" },
      { name: "Europe", href: "/packages?location=europe" },
      { name: "Dubai", href: "/packages?location=dubai" },
      { name: "Maldives", href: "/packages?location=maldives" },
    ],
    india: footerData?.links?.india || [
      { name: "Rajasthan", href: "/packages?india=rajasthan" },
      { name: "Kerala", href: "/packages?india=kerala" },
      { name: "Himachal", href: "/packages?india=himachal" },
      { name: "Uttarakhand", href: "/packages?india=uttarakhand" },
      { name: "Goa", href: "/packages?india=goa" },
      { name: "Kashmir", href: "/packages?india=kashmir" },
    ],
    quickLinks: staticQuickLinks,
  };

  const socialIcons: Record<string, any> = {
    facebook: Facebook,
    twitter: () => (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    instagram: Instagram,
    youtube: Youtube,
    linkedin: Linkedin,
  };

  const adminSocialLinks = (footerData?.socialMedia || [])
    .map((social) => ({
      ...social,
      platform: normalizePlatform(social.platform),
    }))
    .filter((social) => social.isActive && social.platform in socialIcons);

  const fallbackSocialLinks = [
    { platform: "facebook", url: "#", isActive: true },
    { platform: "twitter", url: "#", isActive: true },
    { platform: "instagram", url: "#", isActive: true },
    { platform: "youtube", url: "#", isActive: true },
    { platform: "linkedin", url: "#", isActive: true },
  ];

  const socialLinks = adminSocialLinks.length > 0 ? adminSocialLinks : fallbackSocialLinks;

  if (isLoading) return null;

  return (
    <footer className="footer bg-[#0f172a] text-white font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="footer-container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="footer-columns flex flex-col gap-8 md:flex-row md:flex-wrap lg:flex-nowrap lg:gap-12 lg:justify-between">

          {/* Company Info */}
          <div className="col-company flex flex-col gap-4 md:w-[48%] lg:max-w-[350px] lg:w-auto">
            <div className="company-header flex items-center gap-2">
              <div className="company-icon-box bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="company-name text-xl font-bold text-white">Paradise Yatra</h3>
                <p className="company-tagline text-sm text-slate-400">Yatra To Paradise</p>
              </div>
            </div>
            <p className="company-desc text-sm leading-relaxed text-slate-300">
              {footerData?.companyInfo?.description ||
                "Creating unforgettable travel experiences since 2015. We specialize in crafting personalized journeys that connect you with the world's most beautiful destinations."}
            </p>
            <div className="social-icons flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = socialIcons[social.platform];
                const { href } = cleanUrl(social.url);
                return (
                  <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {typeof Icon === 'function' ? <Icon /> : <Icon className="h-5 w-5" />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-links flex flex-col gap-4 md:w-[48%] lg:w-auto">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              {footerLinks.quickLinks.map((link, index) => (
                <Link key={index} href={link.href} className="text-sm text-slate-300 hover:text-blue-400 transition-colors">
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* International Tours */}
          <div className="col-links flex flex-col gap-4 md:w-[48%] lg:w-auto">
            <h4 className="text-lg font-semibold text-white">International Tours</h4>
            <nav className="flex flex-col gap-2">
              {footerLinks.international.slice(0, 9).map((link, index) => (
                <Link key={index} href={link.href} className="text-sm text-slate-300 hover:text-blue-400 transition-colors">
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* India Tours */}
          <div className="col-links flex flex-col gap-4 md:w-[48%] lg:w-auto">
            <h4 className="text-lg font-semibold text-white">India Tours</h4>
            <nav className="flex flex-col gap-2">
              {footerLinks.india.slice(0, 10).map((link, index) => (
                <Link key={index} href={link.href} className="text-sm text-slate-300 hover:text-blue-400 transition-colors">
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="col-contact flex flex-col gap-4 md:w-[48%] lg:w-auto">
            <h4 className="text-lg font-semibold text-white">Contact Info</h4>
            <div className="contact-items flex flex-col gap-3">
              <div className="contact-row flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="contact-text text-sm text-slate-300">
                  <p>{footerData?.companyInfo?.address.split(',').slice(0, 2).join(',') || "123 Travel Street"}</p>
                  <p>{footerData?.companyInfo?.address.split(',').slice(2).join(',') || "Adventure City, AC 12345"}</p>
                </div>
              </div>
              <div className="contact-row-center flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a href={`tel:${footerData?.companyInfo?.phone || "+1 (555) 123-4567"}`} className="contact-text text-sm text-slate-300">
                  {footerData?.companyInfo?.phone || "+1 (555) 123-4567"}
                </a>
              </div>
              <div className="contact-row-center flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a href={`mailto:${footerData?.companyInfo?.email || "info@wanderlust.com"}`} className="contact-text text-sm text-slate-300">
                  {footerData?.companyInfo?.email || "info@wanderlust.com"}
                </a>
              </div>
            </div>
            <div className="contact-note pt-4">
              <p className="text-xs text-slate-400 leading-tight">Available 24/7 for your travel emergencies</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom border-t border-slate-700 mt-12 pt-8">
          <div className="footer-bottom-inner flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="footer-copyright text-sm text-slate-400">© {new Date().getFullYear()} Paradise Yatra. All rights reserved.</p>
            <div className="footer-legal-links flex gap-6 text-sm">
              <Link href="/privacy-policy" className="text-slate-400 hover:text-blue-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="text-slate-400 hover:text-blue-400 transition-colors">Terms of Service</Link>
              <Link href="/refund-policy" className="text-slate-400 hover:text-blue-400 transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Talk to Agent button - Keeping the functional feature (No Scaling on Hover) */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed bottom-12 right-6 md:bottom-16 md:right-8 z-50 group"
      >
        <a
          href="https://wa.me/919873391733?text=Hi, I'm interested in your tour packages. Can you help me?"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white p-1 rounded-full shadow-2xl transition-all duration-300 active:scale-95 group border border-white/20"
          aria-label="Talk to Agent"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20 scale-75"></div>
            <div className="relative w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-inner">
              <Headset className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>
          <div className="hidden md:flex flex-col ml-2.5 pr-3">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-wider leading-none">
              Talk to Agent
            </span>
          </div>
        </a>
      </motion.div>
    </footer>
  );
};

export default Footer;
