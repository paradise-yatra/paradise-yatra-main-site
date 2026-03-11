"use client";

import { Loader2, Clock, MapPin, Users, Calendar, Award, Shield, ArrowRight, ChevronDown, User, Phone, Mail, MessageSquare, Plus, Minus, Check, X, Plane, Utensils, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import Header from "@/components/Header";
import CarouselArrows from "@/components/ui/CarouselArrows";
import { getImageUrl, getPackagePriceLabel, cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/context/AuthContext";

interface DayItinerary {
  day: number;
  title: string;
  activities: string[];
  accommodation: string;
  meals: string;
  image: string;
}

interface Package {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  priceType?: "per_person" | "per_couple";
  originalPrice?: number;
  discount: number;
  duration: string;
  destination: string;
  category: string;
  images: string[];
  imageAlt?: string;
  highlights: string[];
  itinerary: DayItinerary[];
  inclusions: string[];
  exclusions: string[];
  rating: number;
  reviews: unknown[];
  isActive: boolean;
  isFeatured: boolean;
  holidayType?: string | {
    _id?: string;
    title?: string;
    slug?: string;
  };
  tags?: Array<string | {
    _id?: string;
    name?: string;
    slug?: string;
  }>;
  tourType?: "international" | "india";
  country?: string;
  state?: string;
  location?: string;
}

interface ItineraryPageClientProps {
  packageData: Package;
  slug: string;
}

const LeadCaptureForm = dynamic(() => import("@/components/LeadCaptureForm"), { ssr: false });
const LoginAlertModal = dynamic(() => import("@/components/LoginAlertModal"), { ssr: false });
const PackageCard = dynamic(() => import("@/components/ui/PackageCard"), { ssr: false });
const WhyParadiseDifference = dynamic(() => import("@/components/WhyParadiseDifference"), { ssr: false });

const stripHtmlTags = (value: string = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const containsHtml = (value: string = ""): boolean => /<\/?[a-z][\s\S]*>/i.test(value);

interface BreadcrumbSource {
  label: string;
  href: string;
}

const toSlug = (value: string = "") =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const getDestinationBreadcrumb = (pkg: Package): BreadcrumbSource => {
  const locationValue = pkg.destination || pkg.location || pkg.state || pkg.country || "";
  const primaryLocation = locationValue.split(",")[0].trim();

  if (!primaryLocation) {
    return {
      label: "Packages",
      href: "/package",
    };
  }

  const areaSlug = toSlug(primaryLocation);
  const areaType = pkg.tourType === "international" ? "international" : "india";

  return {
    label: primaryLocation,
    href: `/package/${areaType}/${areaSlug}`,
  };
};

const getFallbackBreadcrumb = (pkg: Package): BreadcrumbSource => {
  if (pkg.category) {
    return {
      label: pkg.category,
      href: "/package",
    };
  }

  return getDestinationBreadcrumb(pkg);
};

const ItineraryPageClient = ({ packageData, slug }: ItineraryPageClientProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [openDay, setOpenDay] = useState<number | null>(0);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [otherPackages, setOtherPackages] = useState<any[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [message, setMessage] = useState('');
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [isHighlightsExpanded, setIsHighlightsExpanded] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [breadcrumbSource, setBreadcrumbSource] = useState<BreadcrumbSource>(() => getFallbackBreadcrumb(packageData));
  const router = useRouter();
  const { user, toggleWishlist, isInWishlist } = useAuth();
  const isPackageSaved = isInWishlist(packageData._id);

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (!shareUrl) {
      setActionMessage({ type: "error", text: "Unable to copy the link right now." });
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const tempInput = document.createElement("input");
        tempInput.value = shareUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }
      setActionMessage({ type: "success", text: "Link copied. You can now share this package with ease." });
    } catch {
      setActionMessage({ type: "error", text: "Could not copy the link right now. Please try again in a moment." });
    }
  };

  const handleSave = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    toggleWishlist(packageData._id);
    setActionMessage({
      type: "success",
      text: isPackageSaved ? "Removed from your saved packages." : "Saved to your wishlist.",
    });
  };

  useEffect(() => {
    if (!actionMessage) return;
    const timeout = setTimeout(() => setActionMessage(null), 2600);
    return () => clearTimeout(timeout);
  }, [actionMessage]);

  const handleSubmitEnquiry = async () => {
    if (!fullName || !email || !phoneNumber || !message) {
      toast.error('Please fill in your name, email, phone number, and message.');
      return;
    }

    setIsSubmittingEnquiry(true);

    const travelDateStr = date ? format(date, "MMM dd, yyyy") : "Not specified";
    const enhancedMessage = `Travel Date: ${travelDateStr}\nTravelers: ${adults} Adults, ${children} Children\n\nMessage:\n${message}`;

    try {
      const response = await fetch("/api/lead-capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          phone: phoneNumber,
          destination: packageData.destination?.split(',')[0].trim() || "Not specified",
          budget: packageData.price ? formatPrice(packageData.price) : "Not specified",
          message: enhancedMessage,
          packageTitle: packageData.title || "",
          packagePrice: packageData.price ? formatPrice(packageData.price) : "",
          newsletterConsent: false,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        toast.success("Enquiry sent successfully! We'll contact you soon.");
        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setMessage('');
        setDate(undefined);
        setAdults(2);
        setChildren(0);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to send enquiry. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while sending your enquiry.");
    } finally {
      setIsSubmittingEnquiry(false);
    }
  };

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const heroImageOptions = {
    width: 1400,
    height: 788,
    crop: "fill",
    gravity: "auto",
    quality: "good",
  } as const;

  const galleryImages = packageData?.images && packageData.images.length > 0
    ? packageData.images.map((img: string) => getImageUrl(img, heroImageOptions) || img)
    : ["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"];

  const inclusions = Array.isArray(packageData?.inclusions) ? packageData.inclusions : [];
  const exclusions = Array.isArray(packageData?.exclusions) ? packageData.exclusions : [];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const resolveBreadcrumbSource = async () => {
      const fallback = getFallbackBreadcrumb(packageData);

      const firstTag = Array.isArray(packageData.tags) ? packageData.tags[0] : null;
      if (firstTag) {
        if (typeof firstTag === "object" && firstTag.name && firstTag.slug) {
          if (isMounted) {
            setBreadcrumbSource({
              label: firstTag.name,
              href: `/package/theme/${firstTag.slug}`,
            });
          }
          return;
        }

        if (typeof firstTag === "string") {
          try {
            const response = await fetch(`/api/tags/${firstTag}`, { cache: "no-store" });
            if (response.ok) {
              const data = await response.json();
              const tag = data?.data;
              if (tag?.name && tag?.slug && isMounted) {
                setBreadcrumbSource({
                  label: tag.name,
                  href: `/package/theme/${tag.slug}`,
                });
                return;
              }
            }
          } catch (error) {
            console.error("Error fetching tag for breadcrumb:", error);
          }
        }
      }

      const holidayType = packageData.holidayType;
      if (holidayType) {
        if (typeof holidayType === "object" && holidayType.title && holidayType.slug) {
          if (isMounted) {
            setBreadcrumbSource({
              label: holidayType.title,
              href: `/holiday-types/${holidayType.slug}`,
            });
          }
          return;
        }

        if (typeof holidayType === "string") {
          try {
            const response = await fetch(`/api/holiday-types/${holidayType}`, { cache: "no-store" });
            if (response.ok) {
              const data = await response.json();
              if (data?.title && data?.slug && isMounted) {
                setBreadcrumbSource({
                  label: data.title,
                  href: `/holiday-types/${data.slug}`,
                });
                return;
              }
            }
          } catch (error) {
            console.error("Error fetching holiday type for breadcrumb:", error);
          }
        }
      }

      if (isMounted) {
        setBreadcrumbSource(fallback);
      }
    };

    resolveBreadcrumbSource();

    return () => {
      isMounted = false;
    };
  }, [packageData]);

  useEffect(() => {
    const fetchOtherPackages = async () => {
      try {
        setPackagesLoading(true);
        const response = await fetch('/api/all-packages?limit=12&isActive=true', { cache: 'no-store' });
        const data = await response.json();

        // Extract array from possible response formats
        let packagesArray = [];
        if (Array.isArray(data)) packagesArray = data;
        else if (data.data && Array.isArray(data.data)) packagesArray = data.data;
        else if (data.packages && Array.isArray(data.packages)) packagesArray = data.packages;

        setOtherPackages(
          packagesArray
            .filter((pkg: any) => pkg?._id !== packageData._id && (pkg?.isActive ?? true))
            .slice(0, 9)
        );
      } catch (error) {
        console.error('Error fetching other packages:', error);
      } finally {
        setPackagesLoading(false);
      }
    };
    fetchOtherPackages();
  }, [packageData._id]);

  const updateScrollState = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", updateScrollState);
      window.addEventListener("resize", updateScrollState);
      setTimeout(updateScrollState, 500);
      return () => {
        carousel.removeEventListener("scroll", updateScrollState);
        window.removeEventListener("resize", updateScrollState);
      };
    }
  }, [otherPackages]);

  const scrollByStep = (direction: number) => {
    if (carouselRef.current) {
      const card = carouselRef.current.querySelector("article");
      const gap = 24;
      const cardWidth = card ? card.getBoundingClientRect().width : 290;
      const step = cardWidth + gap;
      carouselRef.current.scrollBy({ left: direction * step, behavior: "smooth" });
    }
  };

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;
  const discount = packageData.originalPrice && packageData.originalPrice > packageData.price
    ? Math.round(((packageData.originalPrice - packageData.price) / packageData.originalPrice) * 100)
    : packageData.discount || 0;
  const shortDescriptionText = stripHtmlTags(
    packageData.shortDescription || packageData.description || ""
  );
  const shortDescriptionPreview = shortDescriptionText
    ? shortDescriptionText.length > 180
      ? `${shortDescriptionText.slice(0, 180)}...`
      : shortDescriptionText
    : "Tour details coming soon.";

  return (
    <div className="min-h-screen bg-white [&_button]:cursor-pointer [&_a]:cursor-pointer [&_select]:cursor-pointer [&_[role=button]]:cursor-pointer [&_label]:cursor-pointer [&_input:not([type='checkbox']):not([type='radio'])]:cursor-text [&_textarea]:cursor-text">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 md:px-6 pt-4 md:pt-6 lg:pt-10 pb-28 lg:pb-10">
        {/* Breadcrumbs */}
        <div className="mb-4 flex flex-wrap items-center gap-1.5 text-[12px] text-[#000945]">
          <Link href="/" className="hover:underline transition-all">Home</Link>
          <ChevronDown className="h-3 w-3 -rotate-90" />
          <Link
            href={breadcrumbSource.href}
            className="hover:underline transition-all"
          >
            {breadcrumbSource.label}
          </Link>
          <ChevronDown className="h-3 w-3 -rotate-90" />
          <span className="truncate max-w-[200px] md:max-w-none">{packageData.title}</span>
        </div>

        {/* Header Section */}
        <div className="mb-4 md:mb-8">
          <div className="flex flex-col gap-4">
            <h1 style={{ fontWeight: 800 }} className="text-3xl tracking-tight text-[#000945] md:text-4xl lg:!text-[44px] leading-tight">
              {packageData.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-base font-medium flex flex-wrap items-center gap-1.5">
                <span className="text-[#000945]">{packageData.duration}</span>
                <span className="text-[#000945] font-normal">|</span>
                <span className="flex items-center gap-1 text-[#000945]">
                  <MapPin className="h-[18px] w-[18px] text-[#000945]" />
                  {packageData.destination?.split(',')[0].trim()}
                </span>
              </p>
              <div className="flex flex-col items-start sm:items-end gap-1.5">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="flex items-center gap-2 !rounded-[6px] border !border-[#dfe1df] !shadow-none bg-white px-4 py-2 text-sm font-semibold text-[#000945] hover:bg-slate-50 hover:text-[#000945]"
                  >
                    <ArrowRight className="h-5 w-5 rotate-45" />
                    Share
                  </Button>
                  <Button
                    onClick={handleSave}
                    variant="outline"
                    className="flex items-center gap-2 !rounded-[6px] border !border-[#dfe1df] !shadow-none bg-white px-4 py-2 text-sm font-semibold text-[#000945] hover:bg-slate-50 hover:text-[#000945]"
                  >
                    <Shield className="h-5 w-5" />
                    {isPackageSaved ? "Saved" : "Save"}
                  </Button>
                </div>
                <div
                  className={`min-h-[18px] text-[12px] font-medium transition-all duration-300 ${
                    actionMessage
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-1 pointer-events-none"
                  } text-[#16a34a]`}
                  style={{ color: "#16a34a", fontWeight: 500 }}
                >
                  {actionMessage?.text || ""}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-12">
          {/* Left Column (Content) */}
          <div className="flex flex-col gap-10 lg:col-span-8">
            {/* Hero Image Gallery */}
            <div className="relative overflow-hidden rounded-[6px] shadow-none">
              <div className="relative aspect-video w-full overflow-hidden rounded-[6px] bg-slate-200">
                <Image
                  src={galleryImages[selectedImage]}
                  alt={packageData.imageAlt || packageData.title || packageData.destination || "Package image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority={selectedImage === 0}
                  fetchPriority={selectedImage === 0 ? "high" : "auto"}
                  quality={70}
                />
              </div>
              {galleryImages.length > 1 && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % galleryImages.length)}
                    className="flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-sm font-bold text-slate-900 backdrop-blur-sm transition hover:bg-white"
                  >
                    View Next Photo
                  </Button>
                </div>
              )}
            </div>

            {/* Experience Highlights */}
            <section>
              <div className="mb-6">
                <h3 style={{ fontWeight: 700 }} className="!text-[24px] md:!text-[36px] text-[#000945]">Experience Highlights</h3>
              </div>

              <div
                className={cn(
                  "relative overflow-hidden transition-all duration-500 ease-in-out",
                  !isHighlightsExpanded && (packageData.highlights?.length || 0) > 5 ? "max-h-[140px] md:max-h-none" : "max-h-[1500px]"
                )}
              >
                <div className="flex flex-wrap gap-2.5 mb-8">
                  {packageData.highlights?.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 rounded-full border border-[#dfe1df] bg-slate-50 px-3.5 py-1.5 shadow-none">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#000945]">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="text-[14px] font-medium text-[#000945]">{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Mobile Expand Gradient Overlay */}
                {!isHighlightsExpanded && (packageData.highlights?.length || 0) > 5 && (
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/90 to-transparent md:hidden flex items-end justify-center pb-2">
                    <button
                      onClick={() => setIsHighlightsExpanded(true)}
                      className="text-[#000945] font-bold text-[13px] bg-white px-5 py-2 rounded-full border border-[#dfe1df] shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex items-center gap-1.5 z-10 transition-colors hover:bg-slate-50"
                    >
                      See More
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Collapse Button */}
              {isHighlightsExpanded && (packageData.highlights?.length || 0) > 5 && (
                <div className="md:hidden flex justify-center -mt-4 mb-8">
                  <button
                    onClick={() => setIsHighlightsExpanded(false)}
                    className="text-[#000945] font-bold text-[13px] bg-white px-5 py-2 rounded-full border border-[#dfe1df] shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex items-center gap-1.5 z-10 transition-colors hover:bg-slate-50"
                  >
                    Show Less
                    <ChevronDown className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              )}

              {packageData.description && (
                <div
                  className="mt-6 text-base leading-relaxed text-[#000945] overflow-x-auto [&_h1]:!text-2xl [&_h1]:!font-extrabold [&_h1]:!text-[#000945] [&_h1]:!mt-8 [&_h1]:!mb-4 [&_h2]:!text-xl [&_h2]:!font-bold [&_h2]:!text-[#000945] [&_h2]:!mt-8 [&_h2]:!mb-4 [&_h3]:!text-lg [&_h3]:!font-bold [&_h3]:!text-[#000945] [&_h3]:!mt-6 [&_h3]:!mb-3 [&_p]:!mb-4 [&_p]:!text-base [&_p]:!text-[#000945] [&_ul]:!list-disc [&_ul]:!pl-6 [&_ul]:!space-y-2 [&_ol]:!list-decimal [&_ol]:!pl-6 [&_ol]:!space-y-2 [&_li]:!mb-2 [&_li]:!text-[#000945] [&_ul_li::marker]:!text-blue-500 [&_ol_li::marker]:!text-blue-500 [&_a]:!text-blue-600 [&_a]:!underline"
                  dangerouslySetInnerHTML={{ __html: packageData.description }}
                />
              )}
            </section>

            {/* Itinerary */}
            <section>
              <div className="flex flex-wrap items-center justify-between gap-6 md:gap-8 mb-10 pb-8 border-b border-[#dfe1df]">
                {[
                  { icon: Plane, title: "All Transfers" },
                  { icon: Utensils, title: "Local Meals" },
                  { icon: Camera, title: "Photo Stops" },
                  { icon: Shield, title: "24/7 Support" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center justify-center gap-3 min-w-[120px]">
                    <item.icon className="h-7 w-7 text-[#000945]" strokeWidth={1.5} />
                    <span className="text-[15px] font-bold text-[#000945]">{item.title}</span>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <h3 style={{ fontWeight: 700 }} className="!text-[24px] md:!text-[36px] text-[#000945]">Detailed Itinerary</h3>
              </div>

              <Accordion type="multiple" defaultValue={["day-0"]} className="space-y-3">
                {packageData.itinerary?.map((day, index) => (
                  <AccordionItem key={index} value={`day-${index}`} className="!border border-[#dfe1df] rounded-[6px] bg-white overflow-hidden shadow-none focus-within:ring-0 focus-within:outline-none">
                    <AccordionTrigger className="!p-5 !bg-white hover:!bg-slate-50 transition-colors !no-underline focus:!outline-none focus-visible:!outline-none focus:!ring-0">
                      <div className="flex items-center gap-3 overflow-hidden text-left">
                        <span
                          style={{ fontWeight: 700 }}
                          className="text-[11px] md:text-xs shrink-0 text-white bg-[#000945] px-2.5 md:px-3 py-1 rounded-[4px] uppercase tracking-wider"
                        >
                          Day {day.day}
                        </span>
                        <span style={{ fontWeight: 600 }} className="text-[16px] md:text-[18px] text-[#000945] truncate">
                          {day.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="!px-5 !pb-5 !pt-0">
                      <div className="space-y-3">
                        {day.activities?.map((activity, actIndex) => (
                          containsHtml(activity) ? (
                            <div
                              key={actIndex}
                              className="!text-[#000945] text-sm [&_p]:!mb-1 [&_*]:!text-[#000945] [&_p]:!text-[#000945]"
                              dangerouslySetInnerHTML={{ __html: activity }}
                            />
                          ) : (
                            <p key={actIndex} className="!text-[#000945] text-[15px] leading-relaxed">
                              {activity}
                            </p>
                          )
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <section>
              <h3 style={{ fontWeight: 700 }} className="mb-8 !text-[24px] md:!text-[36px] text-[#000945]">Inclusions & Exclusions</h3>
              <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                {/* Inclusions */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600 border border-green-100">
                      <Check className="h-5 w-5" />
                    </div>
                    <h4 className="text-[22px] font-bold text-[#000945]">What's Included</h4>
                  </div>
                  <ul className="flex flex-col gap-4">
                    {inclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-4 text-[#000945]">
                        <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Exclusions */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 border border-red-100">
                      <X className="h-5 w-5" />
                    </div>
                    <h4 className="text-[22px] font-bold text-[#000945]">What's Excluded</h4>
                  </div>
                  <ul className="flex flex-col gap-4">
                    {exclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-4 text-[#000945]">
                        <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                          <X className="h-3.5 w-3.5 text-red-500" />
                        </div>
                        <span className="text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Terms and Conditions */}
            <section className="scroll-mt-32">
              <h3 style={{ fontWeight: 700 }} className="!text-[24px] md:!text-[36px] text-[#000945] mb-6">Booking Information</h3>
              <Accordion type="single" collapsible className="space-y-0">
                {[
                  { title: "Booking and Payment", content: ["A deposit of 30% is required to confirm your booking", "Full payment must be completed 30 days before departure", "All prices are in INR and include taxes", "Payment via credit card, bank transfer, or UPI"] },
                  { title: "Cancellation Policy", content: ["Cancellation 60+ days: Full refund minus fee", "Cancellation 30-59 days: 75% refund", "Cancellation 15-29 days: 50% refund", "Less than 15 days: No refund"] },
                  { title: "Travel Documents", content: ["Valid passport required (min 6 months)", "Visa requirements vary by destination", "Travel insurance strongly recommended", "Accurate personal details required"] }
                ].map((item, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`} className="!border-b !border-[#dfe1df] !border-x-0 !border-t-0 !bg-transparent !shadow-none !rounded-none focus-within:ring-0 focus-within:outline-none">
                    <AccordionTrigger
                      id={`package-terms-item-${idx}-trigger`}
                      className="!py-4 hover:!bg-transparent transition-colors !no-underline focus:!outline-none focus-visible:!outline-none focus:!ring-0"
                    >
                      <h3 style={{ fontSize: '18px', fontWeight: 700 }} className="text-[#000945] text-left !m-0">{item.title}</h3>
                    </AccordionTrigger>
                    <AccordionContent className="!pb-4 !pt-0">
                      <ul className="flex flex-col gap-1.5 text-[15px] text-[#000945] !mb-0">
                        {item.content.map((point, pIdx) => <li key={pIdx} className="flex gap-2 leading-snug"><span className="text-[#000945] shrink-0 font-bold">•</span> <span className="text-[#000945]">{point}</span></li>)}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>

          {/* Right Column (Sticky Sidebar) */}
          <div className="lg:col-span-4">
            <div className="sticky top-[140px] flex flex-col gap-6">
              {/* Pricing Card */}
              <div id="booking-sidebar" className="overflow-hidden scroll-mt-[100px] rounded-[6px] border border-[#dfe1df] bg-white shadow-none">
                <div className="bg-[#000945] p-4 text-center">
                  <span className="text-sm font-medium text-white">Package Starting From</span>
                </div>
                <div className="p-6">
                  <div className="mb-6 flex flex-col items-center justify-center gap-1 border-b border-slate-100 pb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-semibold tracking-tight text-[#155dfc]">{formatPrice(packageData.price)}</span>
                      <span className="text-sm font-medium text-slate-500">per {packageData.priceType === 'per_couple' ? 'couple' : 'person'}</span>
                    </div>
                    {discount > 0 && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        {discount}% OFF Early Bird
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-[6px] border border-slate-100">
                        <User className="h-5 w-5 text-blue-600 shrink-0" />
                        <div className="flex-1">
                          <p className="text-[14px] font-bold !text-[#000945] tracking-wider mb-1">Full Name</p>
                          <input
                            type="text"
                            placeholder="Enter your name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-white border border-[#dfe1df] rounded-[6px] h-8 px-2 py-1 text-sm text-[#000945] shadow-none outline-none focus:ring-1 focus:ring-[#155dfc] placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-[6px] border border-slate-100">
                        <Mail className="h-5 w-5 text-blue-600 shrink-0" />
                        <div className="flex-1">
                          <p className="text-[14px] font-bold !text-[#000945] tracking-wider mb-1">Email</p>
                          <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-[#dfe1df] rounded-[6px] h-8 px-2 py-1 text-sm text-[#000945] shadow-none outline-none focus:ring-1 focus:ring-[#155dfc] placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-[6px] border border-slate-100">
                        <Phone className="h-5 w-5 text-blue-600 shrink-0" />
                        <div className="flex-1">
                          <p className="text-[14px] font-bold !text-[#000945] tracking-wider mb-1">Phone Number</p>
                          <input
                            type="tel"
                            placeholder="+91 Enter your number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9+\s-]/g, ''))}
                            maxLength={15}
                            className="w-full bg-white border border-[#dfe1df] rounded-[6px] h-8 px-2 py-1 text-sm text-[#000945] shadow-none outline-none focus:ring-1 focus:ring-[#155dfc] placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-[6px] border border-slate-100">
                        <Calendar className="h-5 w-5 text-blue-600 shrink-0" />
                        <div className="flex-1">
                          <p className="text-[14px] font-bold !text-[#000945] tracking-wider mb-1">Travel Date</p>
                          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal bg-white !border-[#dfe1df] !rounded-[6px] h-8 px-2 py-1 text-sm text-[#000945] !shadow-none hover:bg-slate-100 hover:text-[#000945]",
                                  !date && "!text-slate-500"
                                )}
                              >
                                {date ? format(date, "MMM dd, yyyy") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 !border-[#dfe1df] !rounded-[6px] z-[9999]" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={date}
                                onSelect={(d) => { setDate(d); setTimeout(() => setCalendarOpen(false), 150); }}
                                disabled={{ before: new Date() }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-[6px] border border-slate-100">
                        <Users className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="flex-1 flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[14px] font-bold !text-[#000945] tracking-wider">Adults</p>
                            <div className="flex items-center bg-white border border-[#dfe1df] rounded-[6px] overflow-hidden">
                              <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-7 h-7 flex items-center justify-center text-[#000945] hover:bg-slate-100 transition"><Minus className="w-3 h-3" /></button>
                              <span className="text-[13px] font-semibold text-[#000945] w-6 flex items-center justify-center border-x border-[#dfe1df] h-7">{adults}</span>
                              <button onClick={() => setAdults(adults + 1)} className="w-7 h-7 flex items-center justify-center text-[#000945] hover:bg-slate-100 transition"><Plus className="w-3 h-3" /></button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-[14px] font-bold !text-[#000945] tracking-wider">Children</p>
                            <div className="flex items-center bg-white border border-[#dfe1df] rounded-[6px] overflow-hidden">
                              <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-7 h-7 flex items-center justify-center text-[#000945] hover:bg-slate-100 transition"><Minus className="w-3 h-3" /></button>
                              <span className="text-[13px] font-semibold text-[#000945] w-6 flex items-center justify-center border-x border-[#dfe1df] h-7">{children}</span>
                              <button onClick={() => setChildren(children + 1)} className="w-7 h-7 flex items-center justify-center text-[#000945] hover:bg-slate-100 transition"><Plus className="w-3 h-3" /></button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-[6px] border border-slate-100">
                        <MessageSquare className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-[14px] font-bold !text-[#000945] tracking-wider mb-1">Message</p>
                          <textarea
                            placeholder="Any special requests?"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full bg-white border border-[#dfe1df] rounded-[6px] px-2 py-2 text-sm text-[#000945] shadow-none outline-none focus:ring-1 focus:ring-[#155dfc] placeholder:text-slate-400 min-h-[60px] resize-none leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex gap-3">
                      <Button
                        onClick={() => {
                          if (!user) {
                            setIsLoginModalOpen(true);
                            return;
                          }
                          router.push(`/checkout?type=package&slug=${encodeURIComponent(packageData.slug || slug)}`);
                        }}
                        className="flex-1 flex h-10 items-center justify-center rounded-[6px] bg-[#000945] text-sm font-semibold text-white shadow-none transition-all hover:bg-[#000945]/90"
                      >
                        Book Now
                      </Button>
                      <Button
                        onClick={handleSubmitEnquiry}
                        disabled={isSubmittingEnquiry}
                        variant="outline"
                        className="flex-1 flex h-10 items-center justify-center rounded-[6px] border border-[#dfe1df] bg-white text-sm font-semibold text-[#000945] shadow-none transition-colors hover:bg-slate-50 disabled:opacity-70"
                      >
                        {isSubmittingEnquiry ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {isSubmittingEnquiry ? 'Sending...' : 'Send Enquiry'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="rounded-[6px] border border-[#dfe1df] bg-white p-6 shadow-none">
                <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#000945]">Best Price Guaranteed</span>
                      <span className="text-xs text-slate-500">Unbeatable value for your journey.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#000945]">24/7 Expert Support</span>
                      <span className="text-xs text-slate-500">Live assistance during your trip.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#000945]">Verified Reviews</span>
                      <span className="text-xs text-slate-500">4.4/5 based on 160+ reviews.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-8">
          <WhyParadiseDifference />
        </div>

        {/* Other Packages Section */}
        {otherPackages.length > 0 && (
          <section className="!bg-white py-12 text-gray-900 relative z-20">
            <div className="mx-auto flex flex-col gap-6 relative z-10">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-2">
                <div className="flex flex-col gap-1">
                  <h3 className="!text-[24px] md:!text-[36px] !font-bold !text-[#000945] !leading-tight tracking-tight">
                    You Might Also Like
                  </h3>
                  <p className="!text-sm !text-slate-500 md:!text-base !max-w-2xl !font-medium">
                    Explore more amazing packages and create unforgettable memories
                  </p>
                </div>
              </div>

              <div className="relative -mx-4 px-4 md:mx-0 md:px-0 group/carousel">
                <CarouselArrows
                  onPrevious={() => scrollByStep(-1)}
                  onNext={() => scrollByStep(1)}
                  canScrollLeft={canScrollLeft}
                  canScrollRight={canScrollRight}
                />
                <div
                  ref={carouselRef}
                  className="flex gap-6 overflow-x-auto scroll-smooth pb-8 pt-2 scrollbar-hide px-2"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    scrollSnapType: "x mandatory",
                  }}
                >
                  {otherPackages.map((pkg, index) => (
                    <PackageCard
                      key={`${pkg._id}-${index}`}
                      id={pkg._id}
                      destination={pkg.location || pkg.destination}
                      duration={pkg.duration}
                      title={pkg.name || pkg.title}
                      price={pkg.price || 0}
                      image={getImageUrl(pkg.image || pkg.images?.[0]) || `https://picsum.photos/800/500?random=${index + 50}`}
                      imageAlt={pkg.imageAlt || pkg.name || pkg.title}
                      slug={pkg.slug || pkg._id}
                      hrefPrefix="/package"
                      themeColor="#005beb"
                      priceLabel={getPackagePriceLabel(pkg.priceType)}
                      isInWishlist={isInWishlist(pkg._id)}
                      // Handle wishlist toggle gracefully
                      onWishlistToggle={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!user) {
                          setIsLoginModalOpen(true);
                          return;
                        }
                        toggleWishlist(pkg._id);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#dfe1df] p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] lg:hidden flex items-center justify-between gap-3">
        <div className="flex flex-col flex-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Starting From</span>
          <div className="flex items-baseline gap-1">
            <span className="text-[20px] font-bold text-[#155dfc] leading-none">{formatPrice(packageData.price)}</span>
            <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">per {packageData.priceType === 'per_couple' ? 'couple' : 'person'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end max-w-[220px]">
          <Button
            onClick={() => {
              const element = document.getElementById('booking-sidebar');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            variant="outline"
            className="flex-1 h-10 px-0 items-center justify-center rounded-[6px] border border-[#dfe1df] bg-white text-[13px] font-bold text-[#000945] shadow-none hover:bg-slate-50"
          >
            Enquire
          </Button>
          <Button
            onClick={() => {
              if (!user) {
                setIsLoginModalOpen(true);
                return;
              }
              router.push(`/checkout?type=package&slug=${encodeURIComponent(packageData.slug || slug)}`);
            }}
            className="flex-1 h-10 px-0 items-center justify-center rounded-[6px] bg-[#000945] text-[13px] font-bold text-white shadow-none hover:bg-[#000945]/90"
          >
            Book Now
          </Button>
        </div>
      </div>

      {isLeadFormOpen && (
        <LeadCaptureForm
          isOpen={isLeadFormOpen}
          onClose={() => setIsLeadFormOpen(false)}
          packageTitle={packageData?.title}
          packagePrice={formatPrice(packageData.price)}
        />
      )}
      {isLoginModalOpen && (
        <LoginAlertModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          theme="blue"
        />
      )}
    </div>
  );
};

export default ItineraryPageClient;
