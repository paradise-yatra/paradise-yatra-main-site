"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/Header';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import { Clock, MapPin, Star, Loader2, AlertCircle, Award, Check, Users, Calendar, Shield, ArrowRight, Plane, Utensils, Camera } from 'lucide-react';

interface DestinationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface DayItinerary {
  day: number;
  title: string;
  activities: string[];
  accommodation: string;
  meals: string[];
  image?: string;
}

interface Destination {
  _id: string;
  name: string;
  slug?: string;
  image: string;
  images?: string[];
  rating?: number;
  duration?: string;
  location?: string;
  price?: number;
  shortDescription?: string;
  description?: string;
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: DayItinerary[];
  category?: string;
  reviews?: unknown[];
}

export default function DestinationPage({ params }: DestinationPageProps) {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [otherPackages, setOtherPackages] = useState<any[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const resolvedParams = await params;
        const { slug } = resolvedParams;
        
        // Try fetching by slug endpoint first
        let response = await fetch(`/api/destinations/slug/${slug}`);
        
        // If slug endpoint fails, try fallback
        if (!response.ok) {
          // Fallback: fetch all destinations and find by slug
          try {
            response = await fetch('/api/destinations');
            
            if (!response.ok) {
              if (response.status === 404) {
                if (process.env.NODE_ENV === 'development') {
                  console.log(`Destination not found with slug: ${slug}`);
                }
              } else {
                if (process.env.NODE_ENV === 'development') {
                  console.error(`Failed to fetch destinations, Status: ${response.status}`);
                }
              }
              setError('Destination not found');
              setLoading(false);
              return;
            }

            const data = await response.json();
            
            // Handle both array and object responses
            let destinationsArray = [];
            if (Array.isArray(data)) {
              destinationsArray = data;
            } else if (data.destinations && Array.isArray(data.destinations)) {
              destinationsArray = data.destinations;
            } else if (data.data && Array.isArray(data.data)) {
              destinationsArray = data.data;
            }
            
            // Find destination by slug or _id or name
            const foundDestination = destinationsArray.find((dest: any) => {
              const destSlug = dest.slug?.toLowerCase() || dest.name?.toLowerCase().replace(/\s+/g, '-');
              const searchSlug = slug.toLowerCase();
              
              return (
                destSlug === searchSlug ||
                dest._id === slug ||
                dest.name?.toLowerCase().replace(/\s+/g, '-') === searchSlug
              );
            });
            
            if (!foundDestination) {
              if (process.env.NODE_ENV === 'development') {
                console.log(`Destination not found with slug: ${slug}`);
              }
              setError('Destination not found');
              setLoading(false);
              return;
            }
            
            setDestination(foundDestination);
          } catch (fallbackError) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Error in fallback fetch:', fallbackError);
            }
            setError('Failed to load destination');
            setLoading(false);
            return;
          }
        } else {
          const data = await response.json();
          setDestination(data);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching destination:', error);
        }
        setError('Failed to load destination');
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [params]);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
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
          
          let response = await fetch('/api/destinations');
          let data = null;
          
          if (response.ok) {
            data = await response.json();
          } else {
            response = await fetch('/api/packages');
            if (response.ok) {
              data = await response.json();
            }
          }
          
          if (data && Array.isArray(data)) {
            const filteredPackages = data
              .filter((pkg: any) => pkg._id !== destination?._id)
              .slice(0, 3);
            setOtherPackages(filteredPackages);
          } else if (data && typeof data === 'object') {
            const possibleArrayKeys = ['destinations', 'data', 'results', 'packages', 'items'];
            let foundArray = null;
            
            for (const key of possibleArrayKeys) {
              if (Array.isArray(data[key])) {
                foundArray = data[key];
                break;
              }
            }
            
            if (foundArray) {
              const filteredPackages = foundArray
                .filter((pkg: any) => pkg._id !== destination?._id)
                .slice(0, 3);
              setOtherPackages(filteredPackages);
            } else {
              setOtherPackages([]);
            }
          } else {
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
  }, [destination?._id, otherPackages.length]);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getDiscount = () => {
    return 0; // Destinations typically don't have discounts
  };

  const discount = getDiscount();

  // Get gallery images
  const galleryImages = destination?.images && destination.images.length > 0 
    ? destination.images 
    : destination?.image 
      ? [destination.image] 
      : ["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"];

  // Ensure we're using the exact database values
  const inclusions = Array.isArray(destination?.inclusions) ? destination.inclusions : [];
  const exclusions = Array.isArray(destination?.exclusions) ? destination.exclusions : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 text-lg">Loading destination details...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Destination Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The destination you're looking for doesn't exist."}</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700">Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

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
              alt={destination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className="!bg-blue-500 text-white text-sm">
                {destination.category || 'Destination'}
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
                  alt={`${destination.name} ${index + 2}`}
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
                {destination.location || 'Various Locations'}
              </div>
              <h1 className="!text-2xl sm:!text-3xl lg:!text-4xl !font-bold !text-slate-900 mb-4">{destination.name}</h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                  <span className="!font-semibold text-slate-900 text-sm sm:text-base">{destination.rating || 4.8}</span>
                  <span className="text-slate-500 text-xs sm:text-sm">({destination.reviews?.length || 0} reviews)</span>
                </div>
                <div className="flex items-center text-slate-500 text-xs sm:text-sm">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                  {destination.duration || 'Flexible'}
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
                  <h3 className="!text-2xl !font-bold text-slate-900 mb-4">Destination Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {destination.highlights && destination.highlights.length > 0 ? (
                      destination.highlights.map((highlight: string, index: number) => (
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
                  <h3 className="!text-2xl !font-bold text-slate-900 mb-4">About This Destination</h3>
                  <p className="!text-slate-600 leading-relaxed">
                    {destination.description || destination.shortDescription || 'No description available.'}
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
                  {destination?.itinerary && destination.itinerary.length > 0 ? (
                    <Accordion type="single" collapsible className="space-y-4">
                      {destination.itinerary.map((day: DayItinerary, index: number) => (
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
                      No itinerary available for this destination
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
                {exclusions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="mt-12"
                  >
                    <h3 className="!text-2xl !font-bold text-slate-900 mb-6">Not Included</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {exclusions.length <= 4 ? (
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
                  </motion.div>
                )}
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
                          key={pkg._id || index}
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
                                {pkg.destination || pkg.location || 'Various Locations'}
                              </div>
                              <h4 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{pkg.title || pkg.name}</h4>
                              <div className="flex items-center space-x-1 mb-3">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{pkg.rating || 4.8}</span>
                                <span className="text-sm text-slate-500">({pkg.reviews || 0})</span>
                              </div>
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <span className="text-lg font-bold text-slate-900">{pkg.price ? formatPrice(pkg.price) : 'Contact Us'}</span>
                                  {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                                    <span className="text-sm text-slate-500 line-through ml-2">{formatPrice(pkg.originalPrice)}</span>
                                  )}
                                </div>
                              </div>
                              <Button 
                                onClick={() => {
                                  const pkgSlug = pkg.slug || pkg.name?.toLowerCase().replace(/\s+/g, '-') || pkg._id;
                                  router.push(`/itinerary/${pkgSlug}`);
                                }}
                                size="sm" 
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                              >
                                View Details
                              </Button>
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
              <Card className="p-4 sm:p-6 shadow-lg">
                <CardContent className="p-0">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                        {destination.price ? formatPrice(destination.price) : 'Contact Us'}
                      </span>
                    </div>
                    <p className="!text-xs sm:!text-sm !text-slate-500">Starting from</p>
                    {discount > 0 && (
                      <Badge variant="destructive" className="bg-red-500 text-white mt-2 text-xs sm:text-sm">
                        Save {discount}%
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-4 mb-6">
                    <Button 
                      onClick={() => setIsLeadFormOpen(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 sm:py-6 text-base sm:text-lg"
                    >
                      Contact Us
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>

                  <div className="border-t pt-4 sm:pt-6">
                    <h4 className="font-semibold text-slate-900 mb-4 text-sm sm:text-base">Why Book With Us?</h4>
                    <ul className="space-y-3 text-xs sm:text-sm">
                      <li className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span>100% Safe & Secure</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span>Award-Winning Service</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
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
                      By booking this destination, you agree to these terms and conditions. We reserve the right to modify 
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

      <LeadCaptureForm
        isOpen={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
        packageTitle={destination.name}
        packagePrice={destination.price ? formatPrice(destination.price) : ''}
      />
    </motion.div>
  );
}
