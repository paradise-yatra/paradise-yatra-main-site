"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, Clock, MapPin, Star, Users, Calendar, Award, Bed, Utensils, Car, Eye, Check, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { DayItineraryCard, InclusionList, PackageHeader } from "@/components/itinerary";
import { useRouter } from "next/navigation";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { LazyHeader } from "@/components/lazy-components";

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
  const [expandedDays, setExpandedDays] = useState<number[]>([0, 1]);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionType>('itinerary');
  const [otherPackages, setOtherPackages] = useState<any[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const router = useRouter();
  const [showTerms, setShowTerms] = useState(false);

  // Fetch other packages when packages section is active
  useEffect(() => {
    const fetchOtherPackages = async () => {
      if (activeSection === 'packages' && otherPackages.length === 0) {
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
  }, [activeSection, packageData?._id, otherPackages.length]);

  const toggleDay = (dayIndex: number) => {
    setExpandedDays(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">About This Tour</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {packageData?.description}
              </p>
            </div>
          </div>
        );

      case 'itinerary':
        return (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detailed Itinerary</h3>
            {packageData?.itinerary && packageData.itinerary.length > 0 ? (
              <div className="space-y-3">
                {packageData.itinerary.map((day: DayItinerary, index: number) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleDay(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-nowrap overflow-hidden min-w-0">
                        <Badge className="bg-green-100 text-green-800 mr-3 whitespace-nowrap flex-shrink-0">Day {day.day}</Badge>
                        <span className="text-gray-700 font-medium truncate">{day.title}</span>
                      </div>
                      <div className="text-gray-500">
                        {expandedDays.includes(index) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedDays.includes(index) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 16, paddingTop: 16 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0 }}
                          transition={{ 
                            duration: 0.3, 
                            ease: [0.4, 0.0, 0.2, 1],
                            opacity: { duration: 0.2 },
                            height: { duration: 0.3 }
                          }}
                          className="border-t border-gray-200 overflow-hidden"
                        >
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Activities:</h4>
                            {Array.isArray(day.activities) && day.activities.length > 0 ? (
                              <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {day.activities.map((activity, actIndex) => (
                                  <li key={actIndex}>{activity}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-600">No activities specified</p>
                            )}
                          </div>
                        </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No itinerary available for this package
              </div>
            )}
          </div>
        );

      case 'included':
        return (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">What's Included</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-green-800 mb-4">✅ Included</h4>
                {Array.isArray(packageData?.inclusions) && packageData.inclusions.length > 0 ? (
                  <ul className="space-y-3">
                    {packageData.inclusions.map((inclusion: string, index: number) => (
                      <li key={index} className="flex items-center text-green-700">
                        <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                        {inclusion}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No inclusions specified</p>
                )}
              </div>
              
              <div className="bg-red-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-red-800 mb-4">❌ Not Included</h4>
                {Array.isArray(packageData?.exclusions) && packageData.exclusions.length > 0 ? (
                  <ul className="space-y-3">
                    {packageData.exclusions.map((exclusion: string, index: number) => (
                      <li key={index} className="flex items-center text-red-700">
                        <span className="w-4 h-4 mr-2 flex-shrink-0">•</span>
                        {exclusion}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No exclusions specified</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'packages':
        return (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Other Package Suggestions</h3>
            {packagesLoading ? (
              <div className="text-center py-8 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p>Loading other packages...</p>
              </div>
            ) : otherPackages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-full overflow-hidden">
                {otherPackages.map((pkg: any, index: number) => (
                  <Card key={index} className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow duration-300 overflow-hidden w-full max-w-full">
                    {/* Package Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={pkg.image || pkg.images?.[0] || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} 
                        alt={pkg.title || pkg.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                      />
                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-semibold text-gray-800">{pkg.rating || 4.8}</span>
                      </div>
                    </div>
                    
                    <CardContent className="p-4 sm:p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 break-words">{pkg.title || pkg.name}</h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 break-words">{pkg.shortDescription || pkg.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-700 text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="truncate">{pkg.destination || pkg.location}</span>
                        </div>
                        <div className="flex items-center text-gray-700 text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-green-500" />
                          <span>{pkg.duration}</span>
                        </div>
                        <div className="flex items-center text-gray-700 text-sm">
                          <Users className="w-4 h-4 mr-2 text-purple-500" />
                          <span>{pkg.minPeople || 2}-{pkg.maxPeople || 12} People</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatPrice(pkg.price)}
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          {pkg.isFeatured ? 'Featured' : 'Popular'}
                        </Badge>
                      </div>
                      
                      <Button 
                        onClick={() => router.push(`/destinations/${pkg.slug || pkg._id}`)}
                        className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 text-sm font-bold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No other packages found for this destination.
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

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
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 mt-15"
    >
      <LazyHeader />

      {/* Hero Section */}
      <PackageHeader 
        title={packageData.title}
        subtitle={packageData.shortDescription}
        duration={packageData.duration}
        location={packageData.destination}
        rating={packageData.rating.toString()}
        totalReviews={packageData.reviews.length}
        coverImage={packageData.images && packageData.images.length > 0 ? packageData.images[0] : ""}
      />

      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 overflow-hidden">
            {/* Package Info Header */}
            <div
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8 mt-5"
            >
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                  <span className="text-gray-700 font-medium">{packageData.rating || 4.8} ({packageData.reviews?.length || 0} reviews)</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-700 font-medium">{packageData.duration || "7 Days, 6 Nights"}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-700 font-medium">2-12 People</span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-0.5">
                {(['overview', 'itinerary', 'included', 'packages'] as SectionType[]).map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`flex-1 px-2 py-1 rounded-md text-sm font-medium transition-all duration-200 capitalize ${
                      activeSection === section
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {section === 'packages' ? 'Other Packages' : section}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Content */}
            <motion.div 
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 mb-8 overflow-hidden"
            >
              {renderSectionContent()}
            </motion.div>

            {/* Travel Icons Section */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="mt-8 mb-8 bg-white rounded-lg p-4"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">What's Included in Your Journey</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Car className="w-8 h-8 text-blue-600 mb-3" />
                  <span className="text-sm font-medium text-gray-700">Transfers</span>
                  <span className="text-xs text-gray-500 mt-1">Airport & Local</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <Eye className="w-8 h-8 text-green-600 mb-3" />
                  <span className="text-sm font-medium text-gray-700">Sightseeing</span>
                  <span className="text-xs text-gray-500 mt-1">Guided Tours</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <Bed className="w-8 h-8 text-purple-600 mb-3" />
                  <span className="text-sm font-medium text-gray-700">Accommodation</span>
                  <span className="text-xs text-gray-500 mt-1">Quality Hotels</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                  <Utensils className="w-8 h-8 text-amber-600 mb-3" />
                  <span className="text-sm font-medium text-gray-700">Meals</span>
                  <span className="text-xs text-gray-500 mt-1">Quality Food</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="sticky top-8 pb-8"
            >
              
              {/* Highlights Section */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-amber-50 border-l-4 border-yellow-400 mb-6 mt-5">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
                    Highlights
                  </h3>
                  {packageData.highlights && packageData.highlights.length > 0 ? (
                    <div className="space-y-3">
                      {packageData.highlights.map((highlight: string, index: number) => (
                        <div key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm leading-relaxed">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm">No highlights specified</p>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mb-8 overflow-hidden">
                <CardContent className="p-6 relative">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-700/20"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-6 text-white">Plan your trip to {packageData.destination}</h3>
                    <div className="mb-8">
                      <div className="flex items-baseline mb-3">
                        <span className="text-md text-blue-100 mr-2">Starting from</span>
                        <span className="text-4xl font-bold text-white">{formatPrice(discountedPrice)}</span>
                        {packageData.originalPrice && (
                          <span className="text-xl text-blue-100 line-through ml-4">{formatPrice(packageData.originalPrice)}</span>
                        )}
                      </div>
                      {discount > 0 && (
                        <Badge className="bg-yellow-400 text-yellow-900 text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                          Save {discount}%
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <Button 
                        onClick={() => setIsLeadFormOpen(true)}
                        className="w-full bg-blue-600 text-white hover:bg-blue-700 py-4 text-lg font-bold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 border-0 hover:cursor-pointer"
                      >
                        Contact Us
                      </Button>
                    </div>
                    
                    <p className="text-sm text-blue-100 mt-6 text-center font-medium">
                      Contact our travel experts to plan your perfect journey
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Terms and Conditions Section */}
      <div className="container mx-auto px-2 py-0 max-w-6xl !pb-5 ">
        <Card className="bg-white rounded-2xl p-0.5 shadow-lg border border-gray-100">
          <CardContent className="p-0">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowTerms(!showTerms)}
            >
              <div className="flex items-center">
                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-xs font-bold text-gray-900">Terms and Conditions</h3>
              </div>
              {showTerms ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
            
            {showTerms && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="mt-2 pt-3 border-t border-gray-200"
              >
                <div className="prose prose-xs max-w-none text-gray-600 text-xs">
                  <div className="font-medium mb-2">
                    At Paradise Yatra, we aim to provide you with a seamless and enjoyable travel experience. 
                    Please read the following Terms & Conditions carefully, as they apply to all bookings made with us.
                  </div>
                  
                  <ol className="list-decimal pl-3 space-y-2">
                    <li>
                      <span className="font-medium text-gray-800">Booking & Payment</span>
                      <ul className="list-disc pl-3 mt-1 space-y-1 text-xs">
                        <li>A booking shall be considered confirmed only upon receipt of the advance payment.</li>
                        <li>The remaining balance must be settled prior to the commencement of the trip.</li>
                        <li>Payments may be made via bank transfer, UPI, debit/credit card, or other approved methods.</li>
                      </ul>
                    </li>
                    
                    <li>
                      <span className="font-medium text-gray-800">Itinerary & Changes</span>
                      <ul className="list-disc pl-3 mt-1 space-y-1 text-xs">
                        <li>The company reserves the right to alter, amend, or cancel itineraries due to unforeseen circumstances including but not limited to weather conditions, political disturbances, natural calamities, or transportation delays.</li>
                        <li>In the event of changes, we will endeavor to provide comparable alternatives at no additional cost. However, any extra expenses incurred shall be borne solely by the traveler.</li>
                      </ul>
                    </li>
                    
                    <li>
                      <span className="font-medium text-gray-800">Travel Documents & Identification</span>
                      <ul className="list-disc pl-3 mt-1 space-y-1 text-xs">
                        <li>All travelers are required to carry valid government-issued identification and any other necessary travel documents throughout the trip.</li>
                      </ul>
                    </li>
                    
                    <li>
                      <span className="font-medium text-gray-800">Responsibility for Personal Belongings</span>
                      <ul className="list-disc pl-3 mt-1 space-y-1 text-xs">
                        <li>Travelers are responsible for the safety and security of their luggage, valuables, and personal belongings. The company shall not be liable for any loss, theft, or damage.</li>
                      </ul>
                    </li>
                    
                    <li>
                      <span className="font-medium text-gray-800">Liability & Insurance</span>
                      <ul className="list-disc pl-3 mt-1 space-y-1 text-xs">
                        <li>The company shall not be held responsible for any medical expenses, accidents, injuries, loss of life, or property damage occurring during the trip.</li>
                        <li>Travelers are strongly advised to secure comprehensive travel and medical insurance prior to departure.</li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
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
