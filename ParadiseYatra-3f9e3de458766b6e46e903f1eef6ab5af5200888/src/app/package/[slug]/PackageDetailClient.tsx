"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Clock, MapPin, Users, Calendar, Award, Shield, ArrowRight, Plane, Utensils, Camera, Sparkles, Check, AlertCircle, ChevronDown, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import Header from "@/components/Header";
import LoginAlertModal from "@/components/LoginAlertModal";
import PackageCard from "@/components/ui/PackageCard";
import { getImageUrl, getPackagePriceLabel, getPackagePriceSubLabel } from "@/lib/utils";
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
  highlights: string[];
  itinerary: DayItinerary[];
  inclusions: string[];
  exclusions: string[];
  rating: number;
  reviews: unknown[];
  isActive: boolean;
  isFeatured: boolean;
}

interface ItineraryPageClientProps {
  packageData: Package;
  slug: string;
}

const stripHtmlTags = (value: string = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const containsHtml = (value: string = ""): boolean => /<\/?[a-z][\s\S]*>/i.test(value);

const ItineraryPageClient = ({ packageData, slug }: ItineraryPageClientProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [openDay, setOpenDay] = useState<number | null>(0);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [otherPackages, setOtherPackages] = useState<any[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const galleryImages = packageData?.images && packageData.images.length > 0
    ? packageData.images
    : ["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"];

  const inclusions = Array.isArray(packageData?.inclusions) ? packageData.inclusions : [];
  const exclusions = Array.isArray(packageData?.exclusions) ? packageData.exclusions : [];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      className="min-h-screen bg-white"
    >
      <Header />

      {/* Image Gallery */}
      <section className="relative pt-6 sm:pt-8 bg-slate-50/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto px-4 md:px-8"
        >
          <div className="relative group overflow-hidden rounded-lg shadow-xl h-[350px] sm:h-[400px] lg:h-[480px]">
            <img
              src={galleryImages[selectedImage]}
              alt={packageData.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
          </div>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100 mb-2">
                <MapPin className="h-3.5 w-3.5 mr-2" />
                {packageData.destination}
              </div>

              <div className="space-y-4">
                <h1 className="!text-xl sm:!text-2xl font-black text-slate-900 leading-[1.1] tracking-tight">
                  {packageData.title}
                </h1>
                {packageData.shortDescription ? (
                  <div
                    className="!text-md !text-slate-500 font-medium max-w-2xl leading-relaxed [&_p]:!mb-2 [&_p]:!text-slate-500 [&_h1]:!text-lg [&_h1]:!font-bold [&_h2]:!text-base [&_h2]:!font-bold [&_h3]:!text-sm [&_h3]:!font-semibold [&_ul]:!list-disc [&_ul]:!pl-5 [&_ol]:!list-decimal [&_ol]:!pl-5 [&_li]:!mb-1 [&_ul_li::marker]:!text-blue-500 [&_ol_li::marker]:!text-blue-500 [&_a]:!text-blue-600 [&_a]:!underline"
                    dangerouslySetInnerHTML={{ __html: packageData.shortDescription }}
                  />
                ) : (
                  <p className="!text-md !text-slate-500 font-medium max-w-2xl leading-relaxed">
                    {shortDescriptionPreview}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-8 py-6 border-y border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold !text-slate-700 uppercase tracking-tighter">Duration</p>
                    <p className="!text-slate-900 font-bold">{packageData.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100">
                    <Users className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold !text-slate-700 uppercase tracking-tighter">Group Size</p>
                    <p className="!text-slate-900 font-bold">2-12 Explorer</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Overview Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-32"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="!text-2xl !font-bold text-slate-900">Experience Highlights</h2>
              </div>

              <div
                className="!text-slate-700 !leading-relaxed mb-8 overflow-x-auto [&_h1]:!text-2xl [&_h1]:!font-extrabold [&_h1]:!text-slate-900 [&_h1]:!mt-8 [&_h1]:!mb-4 [&_h2]:!text-xl [&_h2]:!font-bold [&_h2]:!text-slate-900 [&_h2]:!mt-8 [&_h2]:!mb-4 [&_h3]:!text-lg [&_h3]:!font-bold [&_h3]:!text-slate-900 [&_h3]:!mt-6 [&_h3]:!mb-3 [&_h4]:!text-base [&_h4]:!font-semibold [&_h4]:!text-slate-900 [&_h4]:!mt-5 [&_h4]:!mb-2 [&_p]:!mb-4 [&_p]:!text-base [&_p]:!text-slate-600 [&_ul]:!list-disc [&_ul]:!pl-6 [&_ul]:!space-y-2 [&_ol]:!list-decimal [&_ol]:!pl-6 [&_ol]:!space-y-2 [&_li]:!mb-2 [&_li]:!text-slate-600 [&_ul_li::marker]:!text-blue-500 [&_ol_li::marker]:!text-blue-500 [&_a]:!text-blue-600 [&_a]:!underline [&_blockquote]:!border-l-4 [&_blockquote]:!border-blue-600 [&_blockquote]:!pl-4 [&_blockquote]:!italic [&_blockquote]:!text-slate-600 [&_blockquote]:!my-6 [&_img]:!rounded-lg [&_img]:!my-6 [&_table]:!w-full [&_table]:!my-6 [&_table]:!border [&_table]:!border-slate-200 [&_table]:!border-separate [&_table]:!border-spacing-0 [&_table]:!rounded-lg [&_table]:!overflow-hidden [&_th]:!bg-slate-100 [&_th]:!text-slate-900 [&_th]:!font-semibold [&_th]:!text-sm [&_th]:!px-4 [&_th]:!py-3 [&_th]:!text-left [&_th]:!border-b [&_th]:!border-r [&_th]:!border-slate-200 [&_td]:!text-slate-700 [&_td]:!text-sm [&_td]:!px-4 [&_td]:!py-3 [&_td]:!align-top [&_td]:!border-b [&_td]:!border-r [&_td]:!border-slate-200 [&_tr:last-child_td]:!border-b-0 [&_tr_th:last-child]:!border-r-0 [&_tr_td:last-child]:!border-r-0"
                dangerouslySetInnerHTML={{ __html: packageData.description || "" }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packageData.highlights?.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-blue-50/50 border border-blue-100/50 rounded-lg group hover:bg-blue-50 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <Check className="h-5 w-5 text-blue-600 group-hover:text-white" />
                    </div>
                    <span className="!text-md text-slate-700 font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Itinerary Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-32"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="!text-2xl !font-bold text-slate-900">Detailed Itinerary</h2>
              </div>

              <div className="space-y-4">
                {packageData.itinerary?.map((day, index) => (
                  <div key={index} className="border border-slate-100 rounded-xl overflow-hidden bg-white  transition-all duration-300">
                    <button
                      onClick={() => setOpenDay(openDay === index ? null : index)}
                      className="w-full flex items-center gap-4 p-3 sm:p-4 text-left bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold !text-sm sm:!text-lg transition-colors border ${openDay === index ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' : 'bg-white border-slate-200 text-slate-500'}`}>
                        D{day.day}
                      </div>
                      <div className="flex-grow">
                        <h3 className={`!text-base sm:!text-lg !font-semibold transition-colors ${openDay === index ? 'text-blue-700' : 'text-slate-800'}`}>{day.title}</h3>
                      </div>
                      <div className={`flex-shrink-0 transition-transform duration-300 ${openDay === index ? 'rotate-180' : ''}`}>
                        <ChevronDown className={`w-5 h-5 ${openDay === index ? 'text-blue-600' : 'text-slate-400'}`} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {openDay === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="p-4 sm:p-5 pt-0 border-t border-slate-100">
                            <div className="pt-4 space-y-4">
                              <ul className="space-y-3">
                                {day.activities?.map((activity, actIndex) => (
                                  containsHtml(activity) ? (
                                    <li key={actIndex} className="list-none">
                                      <div
                                        className="overflow-x-auto [&_h1]:!text-xl [&_h1]:!font-bold [&_h1]:!text-slate-900 [&_h1]:!mb-3 [&_h2]:!text-lg [&_h2]:!font-bold [&_h2]:!text-slate-900 [&_h2]:!mb-3 [&_h3]:!text-base [&_h3]:!font-semibold [&_h3]:!text-slate-900 [&_h3]:!mb-2 [&_p]:!text-sm [&_p]:!text-slate-700 [&_p]:!mb-3 [&_ul]:!list-disc [&_ul]:!pl-5 [&_ul]:!space-y-2 [&_ol]:!list-decimal [&_ol]:!pl-5 [&_ol]:!space-y-2 [&_li]:!text-sm [&_li]:!text-slate-700 [&_ul_li::marker]:!text-blue-500 [&_ol_li::marker]:!text-blue-500 [&_a]:!text-blue-600 [&_a]:!underline [&_table]:!w-full [&_table]:!border [&_table]:!border-slate-200 [&_th]:!bg-slate-100 [&_th]:!px-3 [&_th]:!py-2 [&_th]:!text-left [&_th]:!text-sm [&_th]:!font-semibold [&_td]:!px-3 [&_td]:!py-2 [&_td]:!text-sm [&_td]:!text-slate-700 [&_td]:!border-t [&_td]:!border-slate-200"
                                        dangerouslySetInnerHTML={{ __html: activity }}
                                      />
                                    </li>
                                  ) : (
                                    <li key={actIndex} className="flex gap-3 text-slate-600">
                                      <div className="mt-2 min-w-[6px] h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                                      <span className="leading-relaxed text-[15px]">{activity}</span>
                                    </li>
                                  )
                                ))}
                              </ul>

                              {(day.meals || day.accommodation) && (
                                <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-dashed border-slate-100">
                                  {day.meals && (
                                    <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 bg-orange-50 px-3 py-1.5 rounded-full">
                                      <Utensils className="w-3.5 h-3.5 text-orange-500" />
                                      <span>{day.meals}</span>
                                    </div>
                                  )}
                                  {day.accommodation && (
                                    <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 bg-emerald-50 px-3 py-1.5 rounded-full">
                                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                      <span>{day.accommodation}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Inclusions & Exclusions */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-32"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50/50 rounded-lg p-6 border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="!text-2xl !font-bold text-slate-900">What's Included</h3>
                  </div>
                  <ul className="space-y-4">
                    {inclusions.map((item, index) => (
                      <li key={index} className="flex items-start space-x-3 group">
                        <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 group-hover:bg-green-600 transition-colors">
                          <Check className="h-3 w-3 text-green-600 group-hover:text-white" />
                        </div>
                        {containsHtml(item) ? (
                          <div
                            className="text-slate-600 !text-md [&_p]:!mb-1 [&_p]:!text-slate-600 [&_a]:!text-blue-600 [&_a]:!underline [&_strong]:!font-semibold"
                            dangerouslySetInnerHTML={{ __html: item }}
                          />
                        ) : (
                          <span className="text-slate-600 !text-md">{item}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50/50 rounded-lg p-6 border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="!text-2xl !font-bold text-slate-900">What's Excluded</h3>
                  </div>
                  <ul className="space-y-4">
                    {exclusions.map((item, index) => (
                      <li key={index} className="flex items-start space-x-3 group">
                        <div className="mt-1 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 group-hover:bg-red-600 transition-colors">
                          <div className="h-1 w-2.5 bg-red-600 group-hover:bg-white rounded-full"></div>
                        </div>
                        {containsHtml(item) ? (
                          <div
                            className="text-slate-600 !text-md [&_p]:!mb-1 [&_p]:!text-slate-600 [&_a]:!text-blue-600 [&_a]:!underline [&_strong]:!font-semibold"
                            dangerouslySetInnerHTML={{ __html: item }}
                          />
                        ) : (
                          <span className="text-slate-600 !text-md">{item}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Plane, label: "All Transfers", color: "text-blue-600", bg: "bg-blue-50" },
                  { icon: Utensils, label: "Local Meals", color: "text-orange-600", bg: "bg-orange-50" },
                  { icon: Camera, label: "Photo Stops", color: "text-purple-600", bg: "bg-purple-50" },
                  { icon: Shield, label: "24/7 Support", color: "text-emerald-600", bg: "bg-emerald-50" }
                ].map((amenity, idx) => (
                  <div key={idx} className={`${amenity.bg} p-4 rounded-lg flex flex-col items-center gap-2 border border-black/5`}>
                    <amenity.icon className={`h-6 w-6 ${amenity.color}`} />
                    <span className="!text-md font-semibold text-slate-700">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Why Choose Paradise Yatra */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-32"
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="!text-2xl !font-bold text-slate-900">Why Choose Paradise Yatra</h2>
                </div>
                <p className="!text-slate-600 !font-medium mb-7 leading-relaxed">
                  We design practical, well-paced tours with transparent pricing and on-ground support, so your journey stays smooth from booking to return.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      icon: Shield,
                      title: "Trusted & Transparent",
                      text: "Clear inclusions, no hidden surprises, and reliable pre-trip guidance.",
                      color: "blue",
                    },
                    {
                      icon: Calendar,
                      title: "Well-Planned Itineraries",
                      text: "Balanced sightseeing plans with proper travel time and comfort in mind.",
                      color: "emerald",
                    },
                    {
                      icon: MapPin,
                      title: "Local Travel Expertise",
                      text: "Destination-aware planning based on route, season, and travel conditions.",
                      color: "amber",
                    },
                    {
                      icon: Users,
                      title: "Responsive Support Team",
                      text: "Quick assistance before and during your trip for stress-free travel.",
                      color: "purple",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition-all hover:bg-white hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 h-9 w-9 rounded-lg flex items-center justify-center ${item.color === "blue"
                          ? "bg-blue-100 text-blue-600"
                          : item.color === "emerald"
                            ? "bg-emerald-100 text-emerald-600"
                            : item.color === "amber"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-purple-100 text-purple-600"
                          }`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="!text-base !font-bold text-slate-900 mb-1">{item.title}</h3>
                          <p className="!text-sm !text-slate-600 leading-relaxed">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="sticky top-28">
              <Card className="p-0 border-none shadow-[0_32px_64px_-16px_rgba(37,99,235,0.2)] rounded-lg overflow-hidden bg-white">
                <div className="bg-blue-600 p-8 text-white text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <p className="!text-blue-100 !font-bold uppercase tracking-widest text-xs mb-2">Exclusive Offer</p>
                  <div className="text-4xl font-black mb-1">{formatPrice(packageData.price)}</div>
                  <p className="!text-blue-100/80 !text-sm !font-medium">{getPackagePriceSubLabel(packageData.priceType)}</p>
                  {discount > 0 && <div className="mt-4 bg-white/20 backdrop-blur-md rounded-full py-1 px-4 inline-block text-xs font-bold">Special {discount}% Off</div>}
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><Clock className="w-5 h-5 text-blue-600" /></div>
                      <div>
                        <p className="!text-xs !font-bold !text-slate-700 uppercase tracking-tighter">Duration</p>
                        <p className="!text-slate-900 !font-bold">{packageData.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><Users className="w-5 h-5 text-blue-600" /></div>
                      <div>
                        <p className="!text-xs !font-bold !text-slate-700 uppercase tracking-tighter">Group Size</p>
                        <p className="!text-slate-900 !font-bold">2-12 Explorer</p>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => setIsLeadFormOpen(true)} className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-lg !text-lg !font-black transition-all hover:-translate-y-1">
                    Enquiry <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                  <Button
                    onClick={() => {
                      if (!user) {
                        setIsLoginModalOpen(true);
                        return;
                      }
                      router.push(`/checkout?type=package&slug=${encodeURIComponent(packageData.slug || slug)}`);
                    }}
                    className="w-full h-16 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white rounded-lg !text-lg !font-black transition-all hover:-translate-y-1 shadow-lg shadow-emerald-500/30"
                  >
                    Book Now <CreditCard className="ml-2 h-6 w-6" />
                  </Button>
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    {[{ icon: Shield, text: "Secure Booking Guarantee", sub: "100% encrypted" }, { icon: Award, text: "Best Price Guaranteed", sub: "Verified quotes" }].map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        <item.icon className="w-5 h-5 text-blue-600 shrink-0" />
                        <div>
                          <p className="!text-sm !font-bold !text-slate-900 leading-tight">{item.text}</p>
                          <p className="!text-xs !text-slate-500">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Other Packages Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="!bg-white px-4 py-10 text-gray-900 md:px-8 rounded-lg mt-16"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-6">
            <div className="flex flex-col gap-1">
              <h3 className="!text-2xl md:!text-3xl !font-bold !text-slate-900 !leading-tight flex items-center gap-3 flex-wrap">
                You Might Also Like
              </h3>
              <p className="!text-sm !text-slate-600 md:!text-base !max-w-2xl !font-semibold">
                Explore our popular packages and create unforgettable memories
              </p>
            </div>
          </div>

          {packagesLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" /></div>
          ) : (
            <div className="flex gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-hide px-2">
              {otherPackages.map((pkg, index) => (
                <PackageCard
                  key={`${pkg._id}-${index}`}
                  id={pkg._id}
                  title={pkg.title || pkg.name}
                  destination={pkg.destination || pkg.location}
                  image={getImageUrl(pkg.images?.[0] || pkg.image) || `https://picsum.photos/800/500?random=${index + 80}`}
                  duration={pkg.duration}
                  price={pkg.price || 0}
                  slug={pkg.slug || pkg._id}
                  hrefPrefix="/package"
                  themeColor="#005beb"
                  priceLabel={getPackagePriceLabel(pkg.priceType)}
                  isInWishlist={false}
                  onWishlistToggle={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
              ))}
            </div>
          )}
        </motion.section>

        {/* Terms and Conditions Section */}
        <section className="mt-16 pt-16 border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <h2 className="!text-2xl !font-bold text-slate-900 mb-8">Terms and Conditions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {[
                { title: "Booking and Payment", content: ["A deposit of 30% is required to confirm your booking", "Full payment must be completed 30 days before departure", "All prices are in INR and include taxes", "Payment via credit card, bank transfer, or UPI"] },
                { title: "Cancellation Policy", content: ["Cancellation 60+ days: Full refund minus fee", "Cancellation 30-59 days: 75% refund", "Cancellation 15-29 days: 50% refund", "Less than 15 days: No refund"] },
                { title: "Travel Documents", content: ["Valid passport required (min 6 months)", "Visa requirements vary by destination", "Travel insurance strongly recommended", "Accurate personal details required"] }
              ].map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border border-slate-200 rounded-lg">
                  <AccordionTrigger className="!px-4 !py-3 hover:bg-slate-50">
                    <h3 className="!text-lg !font-bold text-slate-900 text-left">{item.title}</h3>
                  </AccordionTrigger>
                  <AccordionContent className="!px-4 !pb-4">
                    <ul className="space-y-2 !text-sm text-slate-600">
                      {item.content.map((point, pIdx) => <li key={pIdx}>• {point}</li>)}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
              <AccordionItem value="important" className="border border-slate-200 rounded-lg">
                <AccordionTrigger className="!px-4 !py-3 hover:bg-slate-50">
                  <h3 className="!text-lg !font-bold text-slate-900 text-left">Important Notes</h3>
                </AccordionTrigger>
                <AccordionContent className="!px-4 !pb-4">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <p className="!text-sm text-slate-600 leading-relaxed">
                      By booking this package, you agree to these terms. We reserve the right to modify itineraries due to local conditions while maintaining quality.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </div>

      <LeadCaptureForm isOpen={isLeadFormOpen} onClose={() => setIsLeadFormOpen(false)} packageTitle={packageData?.title} packagePrice={formatPrice(packageData.price)} />
      <LoginAlertModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} theme="blue" />
    </motion.div>
  );
};

export default ItineraryPageClient;
