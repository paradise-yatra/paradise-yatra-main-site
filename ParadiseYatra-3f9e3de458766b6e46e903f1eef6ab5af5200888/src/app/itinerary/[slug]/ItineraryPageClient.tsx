"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, Clock, MapPin, Star, Users, Calendar, Award, Bed, Utensils, Car, Eye, Check, ChevronDown, ChevronUp, Sparkles, Plane, Camera, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { DayItineraryCard, InclusionList, PackageHeader } from "@/components/itinerary";
import { useRouter } from "next/navigation";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import Header from "@/components/Header";

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
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  seoOgTitle?: string;
  seoOgDescription?: string;
  seoOgImage?: string;
  seoTwitterTitle?: string;
  seoTwitterDescription?: string;
  seoTwitterImage?: string;
  seoCanonicalUrl?: string;
  seoRobotsIndex?: boolean;
  seoRobotsFollow?: boolean;
  seoAuthor?: string;
  seoPublisher?: string;
}

type SectionType = 'overview' | 'itinerary' | 'included' | 'packages';

interface ItineraryPageClientProps {
  packageData: Package;
  slug: string;
}

const ItineraryPageClient = ({ packageData, slug }: ItineraryPageClientProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [otherPackages, setOtherPackages] = useState<any[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const router = useRouter();
  
  // Get gallery images or use single image
  const galleryImages = packageData?.images && packageData.images.length > 0 
    ? packageData.images 
    : packageData?.images?.[0] 
      ? [packageData.images[0]] 
      : ["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"];

  // Debug: Log inclusions and exclusions to verify data
  useEffect(() => {
    console.log('Package Data Inclusions:', packageData?.inclusions);
    console.log('Package Data Exclusions:', packageData?.exclusions);
    console.log('Full Package Data:', packageData);
  }, [packageData]);

  // Ensure we're using the exact database values
  const inclusions = Array.isArray(packageData?.inclusions) ? packageData.inclusions : [];
  const exclusions = Array.isArray(packageData?.exclusions) ? packageData.exclusions : [];

  useEffect(() => {
    // Small delay is sometimes needed after client navigation
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"   // instant = no animation
      })
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  // Fetch other packages
  useEffect(() => {
    const fetchOtherPackages = async () => {
      if (otherPackages.length === 0) {
        try {
          setPackagesLoading(true);
          
          // Try destinations API first, then fallback to packages API
          let response = await fetch('/api/destinations');
          let data = null;
          
          if (response.ok) {
            data = await response.json();
            console.log('Destinations API Response:', data);
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
          } else {
            console.log('Destinations API failed, trying packages API...');
            // Fallback to packages API
            response = await fetch('/api/packages');
            if (response.ok) {
              data = await response.json();
              console.log('Packages API Response:', data);
            }
          }
          
          if (data && Array.isArray(data)) {
            // Filter out the current package and limit to 3 packages
            const filteredPackages = data
              .filter((pkg: any) => pkg._id !== packageData?._id)
              .slice(0, 3);
            setOtherPackages(filteredPackages);
          } else if (data && typeof data === 'object') {
            // Check if data is wrapped in a property
            const possibleArrayKeys = ['destinations', 'data', 'results', 'packages', 'items'];
            let foundArray = null;
            
            for (const key of possibleArrayKeys) {
              if (Array.isArray(data[key])) {
                foundArray = data[key];
                console.log('Found array in property:', key, foundArray);
                break;
              }
            }
            
            if (foundArray) {
              const filteredPackages = foundArray
                .filter((pkg: any) => pkg._id !== packageData?._id)
                .slice(0, 3);
              setOtherPackages(filteredPackages);
            } else {
              console.error('API response structure:', data);
              console.error('No array found in response. Expected array or object with array property.');
              setOtherPackages([]);
            }
          } else {
            console.error('API response is not an array or object:', data);
            setOtherPackages([]);
          }
        } catch (error) {
          console.error('Error fetching other packages:', error);
          setOtherPackages([]);
        } finally {
          setPackagesLoading(false);
        }
      }
    };

    fetchOtherPackages();
  }, [packageData?._id, otherPackages.length]);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Calculate discount percentage if not provided or is 0
  const getDiscount = () => {
    if (
      packageData.originalPrice &&
      packageData.originalPrice > packageData.price
    ) {
      return Math.round(
        ((packageData.originalPrice - packageData.price) / packageData.originalPrice) * 100
      );
    }
    return packageData.discount || 0;
  };

  const discount = getDiscount();

  const calculateDiscountedPrice = () => {
    if (discount > 0) {
      return packageData.price;
    }
    return packageData.price;
  };

  const discountedPrice = calculateDiscountedPrice();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      className="min-h-screen bg-white"
    >
      <Header />

      {/* Image Gallery */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-60 lg:h-[350px] max-w-7xl mx-auto px-4 sm:px-6"
        >
          <div className="lg:col-span-2 relative overflow-hidden rounded-lg">
            <img 
              src={galleryImages[selectedImage]} 
              alt={packageData.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className="!bg-blue-500 text-white text-sm">
                {packageData.category}
              </Badge>
            </div>
          </div>
          <div className="hidden lg:flex flex-col gap-2">
            {galleryImages.slice(1, 3).map((image, index) => (
              <div 
                key={index + 1}
                className="flex-1 relative overflow-hidden rounded-lg cursor-pointer"
                onClick={() => setSelectedImage(index + 1)}
              >
                <img 
                  src={image} 
                  alt={`${packageData.title} ${index + 2}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
            {galleryImages.length > 3 && (
              <div className="flex-1 relative overflow-hidden rounded-lg cursor-pointer bg-slate-800 flex items-center justify-center">
                <span className="text-white font-semibold">+{galleryImages.length - 3} Photos</span>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center text-slate-500 text-xs sm:text-sm mb-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {packageData.destination}
              </div>
              <h1 className="!text-2xl sm:!text-3xl lg:!text-4xl !font-bold !text-slate-900 mb-4">{packageData.title}</h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                  <span className="!font-semibold text-slate-900 text-sm sm:text-base">{packageData.rating || 4.8}</span>
                  <span className="text-slate-500 text-xs sm:text-sm">({packageData.reviews?.length || 0} reviews)</span>
                </div>
                <div className="flex items-center text-slate-500 text-xs sm:text-sm">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                  {packageData.duration}
                </div>
                <div className="flex items-center text-slate-500 text-xs sm:text-sm">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                  2-12 People
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-0 h-auto">
                <TabsTrigger value="overview" className="text-sm sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5 whitespace-nowrap">Overview</TabsTrigger>
                <TabsTrigger value="itinerary" className="text-sm sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5 whitespace-nowrap">Itinerary</TabsTrigger>
                <TabsTrigger value="included" className="text-sm sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5 whitespace-nowrap">Included</TabsTrigger>
                <TabsTrigger value="packages" className="text-sm sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5 whitespace-nowrap">Other Packages</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="!text-2xl !font-bold text-slate-900 mb-4">Package Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {packageData.highlights && packageData.highlights.length > 0 ? (
                      packageData.highlights.map((highlight: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg"
                        >
                          <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          <span className="text-slate-700 text-base">{highlight}</span>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-slate-600">No highlights available</p>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <h3 className="!text-2xl !font-bold text-slate-900 mb-4">About This Tour</h3>
                  <p className="!text-slate-600 leading-relaxed">
                    {packageData.description || packageData.shortDescription}
                  </p>
                </motion.div>
              </TabsContent>

              <TabsContent value="itinerary" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="!text-2xl !font-bold text-slate-900 mb-6">Detailed Itinerary</h3>
                  {packageData?.itinerary && packageData.itinerary.length > 0 ? (
                    <Accordion type="single" collapsible className="space-y-4">
                      {packageData.itinerary.map((day: DayItinerary, index: number) => (
                        <AccordionItem key={index} value={`day-${day.day}`} className="border border-slate-200 rounded-lg">
                          <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 cursor-pointer">
                            <div className="flex items-center space-x-4">
                              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                Day {day.day}
                              </div>
                              <h4 className="!text-lg !font-semibold !text-left text-slate-900">{day.title}</h4>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4">
                            <ul className="space-y-3">
                              {Array.isArray(day.activities) && day.activities.length > 0 ? (
                                day.activities.map((activity, actIndex) => (
                                  <li key={actIndex} className="flex items-start space-x-3">
                                    <Clock className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                                    <span className="text-slate-600">{activity}</span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-slate-600">No activities specified</li>
                              )}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      No itinerary available for this package
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="included" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div>
                    <h3 className="!text-2xl !font-bold text-slate-900 mb-6">What's Included</h3>
                    <ul className="space-y-3">
                      {inclusions.length > 0 ? (
                        inclusions.map((item: string, index: number) => (
                          <li key={index} className="flex items-start space-x-3">
                            <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-600 text-md">{item?.trim() || item}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-slate-500 italic">No inclusions specified</li>
                      )}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="!text-2xl !font-bold text-slate-900 mb-6">What to Expect</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Plane className="h-5 w-5 text-blue-600" />
                        <span className="text-slate-600">Pick-up and drop-off included</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Utensils className="h-5 w-5 text-orange-600" />
                        <span className="text-slate-600">Local cuisine experiences</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Camera className="h-5 w-5 text-purple-600" />
                        <span className="text-slate-600">Professional photo opportunities</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Shield className="h-5 w-5 text-green-600" />
                        <span className="text-slate-600">24/7 support & safety</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Not Included Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mt-12"
                >
                  <h3 className="!text-2xl !font-bold text-slate-900 mb-6">Not Included</h3>
                  {exclusions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {exclusions.length <= 4 ? (
                        // Single column if 4 or fewer items
                        <ul className="space-y-3">
                          {exclusions.map((item: string, index: number) => (
                            <li key={index} className="flex items-start space-x-3">
                              <div className="h-5 w-5 rounded-full border-2 border-red-500 flex items-center justify-center mt-0.5 flex-shrink-0">
                                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                              </div>
                              <span className="text-slate-600 text-md">{item?.trim() || item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        // Two columns if more than 4 items
                        <>
                          <ul className="space-y-3">
                            {exclusions.slice(0, Math.ceil(exclusions.length / 2)).map((item: string, index: number) => (
                              <li key={index} className="flex items-start space-x-3">
                                <div className="h-5 w-5 rounded-full border-2 border-red-500 flex items-center justify-center mt-0.5 flex-shrink-0">
                                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                                </div>
                                <span className="text-slate-600 text-md">{item?.trim() || item}</span>
                              </li>
                            ))}
                          </ul>
                          <ul className="space-y-3">
                            {exclusions.slice(Math.ceil(exclusions.length / 2)).map((item: string, index: number) => (
                              <li key={index + Math.ceil(exclusions.length / 2)} className="flex items-start space-x-3">
                                <div className="h-5 w-5 rounded-full border-2 border-red-500 flex items-center justify-center mt-0.5 flex-shrink-0">
                                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                                </div>
                                <span className="text-slate-600 text-md">{item?.trim() || item}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No exclusions specified</p>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="packages" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="!text-2xl !font-bold text-slate-900 mb-6">Similar Packages</h3>
                  {packagesLoading ? (
                    <div className="text-center py-8 text-slate-500">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                      <p>Loading packages...</p>
                    </div>
                  ) : otherPackages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {otherPackages.map((pkg: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                            <img 
                              src={pkg.image || pkg.images?.[0] || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&q=80"} 
                              alt={pkg.title || pkg.name}
                              className="w-full h-48 object-cover"
                            />
                            <CardContent className="p-4">
                              <div className="flex items-center text-slate-500 text-sm mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                {pkg.destination || pkg.location}
                              </div>
                              <h4 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{pkg.title || pkg.name}</h4>
                              <div className="flex items-center space-x-1 mb-3">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{pkg.rating || 4.8}</span>
                                <span className="text-sm text-slate-500">({pkg.reviews || 0})</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-lg font-bold text-slate-900">{formatPrice(pkg.price)}</span>
                                  {pkg.originalPrice > pkg.price && (
                                    <span className="text-sm text-slate-500 line-through ml-2">{formatPrice(pkg.originalPrice)}</span>
                                  )}
                                </div>
                                <Button 
                                  onClick={() => router.push(`/itinerary/${pkg.slug || pkg._id}`)}
                                  size="sm" 
                                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                                >
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-600 text-center py-8">No similar packages found.</p>
                  )}
                </motion.div>
              </TabsContent>
            </Tabs>

          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="sticky top-20 sm:top-24 lg:top-28 z-10 self-start"
            >
              <Card className="p-6 shadow-lg">
                <CardContent className="p-0">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-3xl font-bold text-slate-900">{formatPrice(discountedPrice)}</span>
                      {packageData.originalPrice && packageData.originalPrice > packageData.price && (
                        <span className="text-lg text-slate-500 line-through">{formatPrice(packageData.originalPrice)}</span>
                      )}
                    </div>
                    <p className="!text-sm !text-slate-500">per person</p>
                    {discount > 0 && (
                      <Badge variant="destructive" className="bg-red-500 text-white mt-2">
                        Save {discount}%
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-4 mb-6">
                    <Button 
                      onClick={() => setIsLeadFormOpen(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-6 text-lg"
                    >
                      Book This Package
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-slate-900 mb-4">Why Book With Us?</h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span>100% Safe & Secure</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-blue-600" />
                        <span>Award-Winning Service</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-blue-600" />
                        <span>24/7 Customer Support</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Terms and Conditions Section */}
        <section className="mt-8 sm:mt-16 pt-8 sm:pt-16 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="!text-2xl sm:!text-3xl !font-bold text-slate-900 mb-4 sm:mb-8">Terms and Conditions</h2>
            
            <Accordion type="single" collapsible className="space-y-2 sm:space-y-4">
              <AccordionItem value="booking" className="border border-slate-200 rounded-lg">
                <AccordionTrigger className="px-3 sm:px-6 py-3 sm:py-4 hover:bg-slate-50">
                  <h3 className="!text-base sm:!text-xl !font-semibold text-slate-900 text-left">Booking and Payment</h3>
                </AccordionTrigger>
                <AccordionContent className="px-3 sm:px-6 pb-3 sm:pb-4">
                  <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-slate-600">
                    <li>• A deposit of 30% is required to confirm your booking</li>
                    <li>• Full payment must be completed 30 days before departure</li>
                    <li>• All prices are in INR and include taxes unless otherwise stated</li>
                    <li>• Payment can be made via credit card, bank transfer, or UPI</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cancellation" className="border border-slate-200 rounded-lg">
                <AccordionTrigger className="px-3 sm:px-6 py-3 sm:py-4 hover:bg-slate-50">
                  <h3 className="!text-base sm:!text-xl !font-semibold text-slate-900 text-left">Cancellation Policy</h3>
                </AccordionTrigger>
                <AccordionContent className="px-3 sm:px-6 pb-3 sm:pb-4">
                  <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-slate-600">
                    <li>• Cancellation 60+ days before departure: Full refund minus ₹100 processing fee</li>
                    <li>• Cancellation 30-59 days before departure: 75% refund</li>
                    <li>• Cancellation 15-29 days before departure: 50% refund</li>
                    <li>• Cancellation less than 15 days: No refund</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="documents" className="border border-slate-200 rounded-lg">
                <AccordionTrigger className="px-3 sm:px-6 py-3 sm:py-4 hover:bg-slate-50">
                  <h3 className="!text-base sm:!text-xl !font-semibold text-slate-900 text-left">Travel Documents</h3>
                </AccordionTrigger>
                <AccordionContent className="px-3 sm:px-6 pb-3 sm:pb-4">
                  <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-slate-600">
                    <li>• Valid passport required (minimum 6 months validity)</li>
                    <li>• Visa requirements vary by destination - check with embassy</li>
                    <li>• Travel insurance is strongly recommended</li>
                    <li>• All travelers must provide accurate personal information</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="health" className="border border-slate-200 rounded-lg">
                <AccordionTrigger className="px-3 sm:px-6 py-3 sm:py-4 hover:bg-slate-50">
                  <h3 className="!text-base sm:!text-xl !font-semibold text-slate-900 text-left">Health and Safety</h3>
                </AccordionTrigger>
                <AccordionContent className="px-3 sm:px-6 pb-3 sm:pb-4">
                  <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-slate-600">
                    <li>• Participants must be in good physical condition for adventure activities</li>
                    <li>• Medical conditions must be disclosed before booking</li>
                    <li>• Follow all safety instructions provided by guides</li>
                    <li>• Company is not liable for personal injury due to negligence</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="force-majeure" className="border border-slate-200 rounded-lg">
                <AccordionTrigger className="px-3 sm:px-6 py-3 sm:py-4 hover:bg-slate-50">
                  <h3 className="!text-base sm:!text-xl !font-semibold text-slate-900 text-left">Force Majeure</h3>
                </AccordionTrigger>
                <AccordionContent className="px-3 sm:px-6 pb-3 sm:pb-4">
                  <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-slate-600">
                    <li>• Tours may be modified or cancelled due to weather, natural disasters, or political unrest</li>
                    <li>• Alternative arrangements will be provided when possible</li>
                    <li>• Refunds will be processed according to circumstances</li>
                    <li>• Travel insurance is recommended to cover unforeseen events</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="important" className="border border-slate-200 rounded-lg">
                <AccordionTrigger className="px-3 sm:px-6 py-3 sm:py-4 hover:bg-slate-50">
                  <h3 className="!text-base sm:!text-xl !font-semibold text-slate-900 text-left">Important Notes</h3>
                </AccordionTrigger>
                <AccordionContent className="px-3 sm:px-6 pb-3 sm:pb-4">
                  <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      By booking this package, you agree to these terms and conditions. We reserve the right to modify 
                      itineraries due to local conditions while maintaining the quality of your experience. For any 
                      questions or clarifications, please contact our customer service team.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </div>

      {/* Lead Capture Form */}
      <LeadCaptureForm
        isOpen={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
        packageTitle={packageData?.title}
        packagePrice={packageData ? formatPrice(discountedPrice) : undefined}
      />
    </motion.div>
  );
};

export default ItineraryPageClient;
