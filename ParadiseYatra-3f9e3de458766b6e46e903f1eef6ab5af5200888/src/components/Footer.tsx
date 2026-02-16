"use client";

import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
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
  const [expandedSections, setExpandedSections] = useState({
    international: false,
    india: false,
    quickLinks: false,
  });
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

  // Helper function to clean up malformed URLs
  const cleanUrl = (url: string): { href: string } => {
    const rawUrl = (url || "").trim();
    if (!rawUrl || rawUrl === "#") {
      return { href: "#" };
    }

    // Remove leading # if present
    const cleanedUrl = rawUrl.startsWith("#") ? rawUrl.substring(1).trim() : rawUrl;

    // If it's still just # or empty, return default
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

    // If protocol is missing but domain looks valid, prefix https://
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(cleanedUrl)) {
      return { href: `https://${cleanedUrl}` };
    }

    return { href: "#" };
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
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

  // Static Quick Links - These will always be the same
  const staticQuickLinks: FooterLink[] = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    { name: "Cancellation & Refund Policy", href: "/cancellation-and-refund-policy" },
  ];

  // Use dynamic data for tours, but static for quick links
  const footerLinks = {
    international: footerData?.links?.international || [
      { name: "Singapore", href: "#" },
      { name: "Thailand", href: "#" },
      { name: "Malaysia", href: "#" },
      { name: "Vietnam", href: "#" },
      { name: "Europe", href: "#" },
      { name: "Dubai", href: "#" },
      { name: "Maldives", href: "#" },
    ],
    india: footerData?.links?.india || [
      { name: "Rajasthan", href: "#" },
      { name: "Kerala", href: "#" },
      { name: "Himachal", href: "#" },
      { name: "Uttarakhand", href: "#" },
      { name: "Goa", href: "#" },
      { name: "Kashmir", href: "#" },
    ],
    trekking: footerData?.links?.trekking || [
      { name: "Kedarnath", href: "#" },
      { name: "Badrinath", href: "#" },
      { name: "Valley of Flowers", href: "#" },
      { name: "Roopkund", href: "#" },
      { name: "Har Ki Dun", href: "#" },
    ],
    quickLinks: staticQuickLinks, // Always use static links
  };

  const socialIcons = {
    facebook: Facebook,
    twitter: () => (
      <Image
        src="/icons8-x-50.png"
        alt="X (Twitter)"
        width={16}
        height={16}
        className="w-4 h-4"
      />
    ),
    instagram: Instagram,
    youtube: Youtube,
    linkedin: Linkedin,
  };

  const socialColors = {
    facebook: "bg-blue-600 hover:bg-blue-700",
    twitter: "bg-sky-500 hover:bg-sky-600",
    instagram:
      "bg-gradient-to-tr from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
    youtube: "bg-red-600 hover:bg-red-700",
    linkedin: "bg-blue-700 hover:bg-blue-800",
  };

  // Prefer admin-configured social links and normalize platform naming.
  const adminSocialLinks = (footerData?.socialMedia || [])
    .map((social) => ({
      ...social,
      platform: normalizePlatform(social.platform),
    }))
    .filter((social) => social.isActive && social.platform in socialIcons);

  const fallbackSocialLinks =
    !footerData || adminSocialLinks.length === 0
      ? [
          { platform: "facebook", url: "#", isActive: true },
          { platform: "instagram", url: "#", isActive: true },
          { platform: "youtube", url: "#", isActive: true },
        ]
      : [];

  const socialLinks =
    adminSocialLinks.length > 0 ? adminSocialLinks : fallbackSocialLinks;

  if (isLoading) {
    return (
      <footer className="bg-gray-900 text-white relative pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500"></div>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white relative pt-16 pb-12 md:pt-24 md:pb-16">

      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12 md:mb-16"
        >
          {/* Company info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-4 md:mb-6"
            >
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200">
                <Link href="/">
                  <Image
                    src="/footerLogo.png"
                    alt="logo"
                    width={112}
                    height={112}
                    className="h-28 w-28 md:h-35 md:w-35"
                  />
                </Link>
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="!text-gray-300 font-bold mb-4 md:mb-6 leading-relaxed !text-sm md:!text-base font-bold"
            >
              {footerData?.companyInfo?.description ||
                "Your trusted partner for unforgettable travel experiences. We specialize in creating personalized journeys that combine adventure, culture, and luxury."}
            </motion.p>
            <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-300 font-bold">
              <div className="flex items-start space-x-2 md:space-x-3 hover:text-white transition-colors">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    footerData?.companyInfo?.address ||
                    "48, General Mahadev Singh Rd, Dehradun, Uttarakhand 248001"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs md:text-sm hover:text-blue-300 transition-colors cursor-pointer font-bold"
                  title="View location on map"
                >
                  {footerData?.companyInfo?.address ||
                    "48, General Mahadev Singh Rd, Dehradun, Uttarakhand 248001"}
                </a>
              </div>
              <div className="flex items-center space-x-2 md:space-x-3 hover:text-white transition-colors">
                <Phone className="w-3 h-3 md:w-4 md:h-4 text-blue-400 flex-shrink-0" />
                <a
                  href={`tel:${footerData?.companyInfo?.phone?.replace(/\s/g, "") ||
                    "+918979396413"
                    }`}
                  className="text-xs md:text-sm hover:text-blue-300 transition-colors cursor-pointer font-bold"
                  title="Call us"
                >
                  {footerData?.companyInfo?.phone || "+91 8979396413"}
                </a>
              </div>
              <div className="flex items-center space-x-2 md:space-x-3 hover:text-white transition-colors">
                <Mail className="w-3 h-3 md:w-4 md:h-4 text-blue-400 flex-shrink-0" />
                <a
                  href={`mailto:${footerData?.companyInfo?.email || "info@paradiseyatra.com"
                    }`}
                  className="text-xs md:text-sm hover:text-blue-300 transition-colors cursor-pointer font-bold"
                  title="Send us an email"
                >
                  {footerData?.companyInfo?.email || "info@paradiseyatra.com"}
                </a>
              </div>
            </div>
          </div>

          {/* International Tours */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button
              onClick={() => toggleSection("international")}
              className="md:hidden w-full flex items-center justify-between !text-lg !font-semibold mb-4 text-white relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-blue-200"
            >
              International Tours
              {expandedSections.international ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            <h3 className="hidden md:block !text-lg !font-bold mb-4 md:mb-6 text-white relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-blue-200">
              International Tours
            </h3>
            <ul
              className={`space-y-2 md:space-y-3 ${expandedSections.international ? "block" : "hidden md:block"
                }`}
            >
              {footerLinks.international.map((link, index) => {
                const { href } = cleanUrl(link.href);
                return (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-xs md:text-sm flex items-center group font-bold"
                    >
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full mr-2 md:mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      {link.name}
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          {/* India Tours */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button
              onClick={() => toggleSection("india")}
              className="md:hidden w-full flex items-center justify-between text-lg font-semibold mb-4 text-white relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-blue-200"
            >
              India Tours
              {expandedSections.india ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            <h3 className="hidden md:block !text-lg !font-bold mb-4 md:mb-6 text-white relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-blue-200">
              India Tours
            </h3>
            <ul
              className={`space-y-2 md:space-y-3 ${expandedSections.india ? "block" : "hidden md:block"
                }`}
            >
              {footerLinks.india.map((link, index) => {
                const { href } = cleanUrl(link.href);
                return (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                  >
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-xs md:text-sm flex items-center group font-bold"
                    >
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full mr-2 md:mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      {link.name}
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          {/* Quick Links - Now using static links and proper Link component */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <button
              onClick={() => toggleSection("quickLinks")}
              className="md:hidden w-full flex items-center justify-between text-lg font-semibold mb-4 text-white relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-blue-200"
            >
              Quick Links
              {expandedSections.quickLinks ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            <h3 className="hidden md:block !text-lg !font-bold mb-4 md:mb-6 text-white relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-blue-200">
              Quick Links
            </h3>
            <ul
              className={`space-y-2 md:space-y-3 ${expandedSections.quickLinks ? "block" : "hidden md:block"
                }`}
            >
              {footerLinks.quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-xs md:text-sm flex items-center group font-bold"
                  >
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full mr-2 md:mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="border-t border-gray-800 pt-4 md:pt-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            {/* Copyright */}
            <div>
              <p className="text-xs md:text-sm text-gray-400 text-center md:text-left font-bold">
                &copy; {new Date().getFullYear()} Paradise Yatra. All rights
                reserved.
              </p>
            </div>

            {/* Social media */}
            <div className="flex space-x-3 md:space-x-4">
              {socialLinks.map((social, index) => {
                const Icon =
                  socialIcons[social.platform as keyof typeof socialIcons];
                const bgColor =
                  socialColors[social.platform as keyof typeof socialColors];
                const { href } = cleanUrl(social.url);
                return (
                  <motion.a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-8 h-8 md:w-10 md:h-10 ${bgColor} rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow hover:shadow-lg`}
                    aria-label={`Follow us on ${social.platform}`}
                  >
                    {social.platform === "twitter" ? (
                      <Icon />
                    ) : (
                      <Icon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    )}
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Talk to Agent button */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 group"
      >
        <a
          href="https://wa.me/919873391733?text=Hi, I'm interested in your tour packages. Can you help me?"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white p-1.5 md:pl-1.5 md:pr-6 md:py-2 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group border border-white/20"
          aria-label="Talk to Agent"
        >
          {/* Icon Container with Rings */}
          <div className="relative flex items-center justify-center">
            {/* Animated Background Rings */}
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20 scale-75"></div>

            <div className="relative w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-inner">
              <Headset className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" />

              {/* Status Indicator */}
              <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>

          {/* Text Content - Hidden on Mobile */}
          <div className="hidden md:flex flex-col ml-3 md:ml-4">
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider leading-none">
              Talk to Agent
            </span>
            <span className="text-[10px] md:text-xs opacity-80 font-medium">
              We're Online
            </span>
          </div>
        </a>
      </motion.div>
    </footer>
  );
};

export default Footer;
