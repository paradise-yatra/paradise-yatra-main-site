"use client";

import { Facebook, Instagram, Youtube, Linkedin, Phone, Mail, MapPin, ChevronDown, ChevronUp } from "lucide-react";
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
    quickLinks: false
  });
  const [footerData, setFooterData] = useState<FooterContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to clean up malformed URLs
  const cleanUrl = (url: string): { href: string } => {
    if (!url || url === '#') {
      return { href: '#' };
    }
    
    // Remove leading # if present
    const cleanedUrl = url.startsWith('#') ? url.substring(1) : url;
    
    // If it's still just # or empty, return default
    if (!cleanedUrl || cleanedUrl === '#') {
      return { href: '#' };
    }
    
    return { href: cleanedUrl };
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch('/api/footer');
        if (response.ok) {
          const data = await response.json();
          setFooterData(data);
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  // Use dynamic data if available, otherwise use fallback
  const footerLinks = footerData?.links || {
    international: [
      { name: "Singapore", href: "#" },
      { name: "Thailand", href: "#" },
      { name: "Malaysia", href: "#" },
      { name: "Vietnam", href: "#" },
      { name: "Europe", href: "#" },
      { name: "Dubai", href: "#" },
      { name: "Maldives", href: "#" }
    ],
    india: [
      { name: "Rajasthan", href: "#" },
      { name: "Kerala", href: "#" },
      { name: "Himachal", href: "#" },
      { name: "Uttarakhand", href: "#" },
      { name: "Goa", href: "#" },
      { name: "Kashmir", href: "#" }
    ],
    trekking: [
      { name: "Kedarnath", href: "#" },
      { name: "Badrinath", href: "#" },
      { name: "Valley of Flowers", href: "#" },
      { name: "Roopkund", href: "#" },
      { name: "Har Ki Dun", href: "#" }
    ],
    quickLinks: [
      { name: "Home", href: "/" },
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Blog", href: "/blog" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms & Conditions", href: "#" }
    ]
  };

  const socialIcons = {
    facebook: Facebook,
    twitter: () => <Image src="/icons8-x-50.png" alt="X (Twitter)" width={16} height={16} className="w-4 h-4" />,
    instagram: Instagram,
    youtube: Youtube,
    linkedin: Linkedin
  };

  const socialColors = {
    facebook: "bg-blue-600 hover:bg-blue-700",
    twitter: "bg-sky-500 hover:bg-sky-600",
    instagram: "bg-gradient-to-tr from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
    youtube: "bg-red-600 hover:bg-red-700",
    linkedin: "bg-blue-700 hover:bg-blue-800"
  };

  // Use dynamic social media data if available, otherwise use fallback
  const socialLinks = footerData?.socialMedia?.filter(social => social.isActive) || [
    { platform: "facebook", url: "#", isActive: true },
    { platform: "twitter", url: "#", isActive: true },
    { platform: "instagram", url: "#", isActive: true },
    { platform: "youtube", url: "#", isActive: true },
    { platform: "linkedin", url: "#", isActive: true }
  ];

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
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500"></div>
      
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
                  <Image src="/footerLogo.png" alt="logo" width={112} height={112} className="h-28 w-28 md:h-35 md:w-35" />
                </Link>
              </span>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-gray-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base"
            >
              {footerData?.companyInfo?.description || "Your trusted partner for unforgettable travel experiences. We specialize in creating personalized journeys that combine adventure, culture, and luxury."}
            </motion.p>
            <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-300">
              <div className="flex items-start space-x-2 md:space-x-3 hover:text-white transition-colors">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(footerData?.companyInfo?.address || "48, General Mahadev Singh Rd, Dehradun, Uttarakhand 248001")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs md:text-sm hover:text-blue-300 transition-colors cursor-pointer"
                  title="View location on map"
                >
                  {footerData?.companyInfo?.address || "48, General Mahadev Singh Rd, Dehradun, Uttarakhand 248001"}
                </a>
              </div>
              <div className="flex items-center space-x-2 md:space-x-3 hover:text-white transition-colors">
                <Phone className="w-3 h-3 md:w-4 md:h-4 text-blue-400 flex-shrink-0" />
                <a 
                  href={`tel:${footerData?.companyInfo?.phone?.replace(/\s/g, '') || "+918979396413"}`}
                  className="text-xs md:text-sm hover:text-blue-300 transition-colors cursor-pointer"
                  title="Call us"
                >
                  {footerData?.companyInfo?.phone || "+91 8979396413"}
                </a>
              </div>
              <div className="flex items-center space-x-2 md:space-x-3 hover:text-white transition-colors">
                <Mail className="w-3 h-3 md:w-4 md:h-4 text-blue-400 flex-shrink-0" />
                <a 
                  href={`mailto:${footerData?.companyInfo?.email || "info@paradiseyatra.com"}`}
                  className="text-xs md:text-sm hover:text-blue-300 transition-colors cursor-pointer"
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
              onClick={() => toggleSection('international')}
              className="md:hidden w-full flex items-center justify-between text-lg font-semibold mb-4 text-white relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-blue-200"
            >
              International Tours
              {expandedSections.international ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <h3 className="hidden md:block text-lg font-semibold mb-4 md:mb-6 text-white relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-blue-200">
              International Tours
            </h3>
            <ul className={`space-y-2 md:space-y-3 ${expandedSections.international ? 'block' : 'hidden md:block'}`}>
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
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-xs md:text-sm flex items-center group"
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
              onClick={() => toggleSection('india')}
              className="md:hidden w-full flex items-center justify-between text-lg font-semibold mb-4 text-white relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-blue-200"
            >
              India Tours
              {expandedSections.india ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <h3 className="hidden md:block text-lg font-semibold mb-4 md:mb-6 text-white relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-blue-200">
              India Tours
            </h3>
            <ul className={`space-y-2 md:space-y-3 ${expandedSections.india ? 'block' : 'hidden md:block'}`}>
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
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-xs md:text-sm flex items-center group"
                      onClick={(e) => {
                        if (href === '/') {
                          e.preventDefault();
                          window.open(href, '_blank');
                        }
                      }}
                    >
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full mr-2 md:mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      {link.name}
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <button 
              onClick={() => toggleSection('quickLinks')}
              className="md:hidden w-full flex items-center justify-between text-lg font-semibold mb-4 text-white relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-blue-200"
            >
              Quick Links
              {expandedSections.quickLinks ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <h3 className="hidden md:block text-lg font-semibold mb-4 md:mb-6 text-white relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-blue-200">
              Quick Links
            </h3>
            <ul className={`space-y-2 md:space-y-3 ${expandedSections.quickLinks ? 'block' : 'hidden md:block'}`}>
              {footerLinks.quickLinks.map((link, index) => {
                const { href } = cleanUrl(link.href);
                return (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  >
                    <a 
                      href={href} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-xs md:text-sm flex items-center group"
                      onClick={(e) => {
                        if (href === '/') {
                          e.preventDefault();
                          window.open(href, '_blank');
                        }
                      }}
                    >
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full mr-2 md:mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      {link.name}
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="border-t border-gray-800 pt-8 md:pt-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            {/* Copyright */}
            <div>
              <p className="text-xs md:text-sm text-gray-400 text-center md:text-left">
                &copy; {new Date().getFullYear()} Paradise Yatra. All rights reserved.
              </p>
            </div>

            {/* Social media */}
            <div className="flex space-x-3 md:space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = socialIcons[social.platform as keyof typeof socialIcons];
                const bgColor = socialColors[social.platform as keyof typeof socialColors];
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
                    {social.platform === 'twitter' ? (
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

      {/* Floating WhatsApp button */}
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 2.0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50"
      >
        <a 
          href={`https://wa.me/${footerData?.companyInfo?.whatsapp?.replace(/\D/g, '') || '918979269388'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 md:w-14 md:h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 group relative"
          aria-label="Chat with us on WhatsApp"
        >
          <svg 
            className="w-5 h-5 md:w-6 md:h-6 text-white" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
          <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-xs text-white font-bold">1</span>
          </div>
        </a>
      </motion.div>
    </footer>
  );
};

export default Footer;