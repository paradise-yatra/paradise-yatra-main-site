"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { LazyHeader } from '@/components/lazy-components';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import { DayItineraryCard, PackageHeader } from '@/components/itinerary';
import { Clock, MapPin, Star, Loader2, AlertCircle, Award, Check, ChevronDown, ChevronUp, Users, Calendar, Sparkles, Car, Eye, Bed, Utensils, CheckCircle } from 'lucide-react';

interface DestinationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

type SectionType = 'overview' | 'itinerary' | 'included' | 'packages';

export default function DestinationPage({ params }: DestinationPageProps) {
  const [destination, setDestination] = useState<{
    _id: string;
    name: string;
    image: string;
    rating?: number;
    duration?: string;
    location?: string;
    price?: number;
    shortDescription?: string;
    description?: string;
    highlights?: string[];
    inclusions?: string[];
    exclusions?: string[];
    itinerary?: Array<{
      day: number;
      title: string;
      activities: string[];
      accommodation: string;
      meals: string[];
      image?: string;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionType>('overview');
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));
  const [otherPackages, setOtherPackages] = useState<any[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const resolvedParams = await params;
        const { slug } = resolvedParams;
        const response = await fetch(`/api/destinations/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/404');
            return;
          }
          throw new Error('Failed to fetch destination');
        }

        const data = await response.json();
        setDestination(data);
      } catch (error) {
        console.error('Error fetching destination:', error);
        setError('Failed to load destination');
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [params, router]);

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
            // Filter out the current destination and limit to 3 packages
            const filteredPackages = data
              .filter((pkg: any) => pkg._id !== destination?._id)
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
                .filter((pkg: any) => pkg._id !== destination?._id)
                .slice(0, 3);
              setOtherPackages(filteredPackages);
            } else {
              console.error('API response structure:', data);
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
  }, [activeSection, destination?._id, otherPackages.length]);

  const toggleDayExpansion = (day: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(day)) {
      newExpanded.delete(day);
    } else {
      newExpanded.add(day);
    }
    setExpandedDays(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 text-lg">Loading destination details...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
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

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">About This Tour</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {destination.description}
              </p>
            </div>
          </div>
        );

      case 'itinerary':
        return (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Detailed Itinerary</h3>
            <div className="space-y-3">
              {destination.itinerary && destination.itinerary.map((day: {
                day: number;
                title: string;
                activities: string[];
                accommodation: string;
                meals: string[];
                image?: string;
              }, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge className="bg-green-100 text-green-800 mr-3">Day {day.day}</Badge>
                      <span className="text-gray-700 font-medium">{day.title}</span>
                    </div>
                    <button
                      onClick={() => toggleDayExpansion(day.day)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedDays.has(day.day) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  
                  {expandedDays.has(day.day) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-gray-200"
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
                </div>
              ))}
            </div>
          </div>
        );

      case 'included':
        return (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-green-800 mb-4">✅ Included</h4>
                {Array.isArray(destination.inclusions) && destination.inclusions.length > 0 ? (
                  <ul className="space-y-3">
                    {destination.inclusions.map((inclusion: string, index: number) => (
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
                {Array.isArray(destination.exclusions) && destination.exclusions.length > 0 ? (
                  <ul className="space-y-3">
                    {destination.exclusions.map((exclusion: string, index: number) => (
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
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Other Package Suggestions</h3>
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
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
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
                          {pkg.price ? `₹${pkg.price.toLocaleString()}` : 'Contact Us'}
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          {pkg.isFeatured ? 'Featured' : 'Popular'}
                        </Badge>
                      </div>
                      
                      <Button 
                        onClick={() => router.push(`/destinations/${pkg.slug || pkg._id}`)}
                        className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 text-sm font-bold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 mt-15"
    >
      <LazyHeader />

      {/* Hero Section */}
      <PackageHeader 
        title={destination.name}
        subtitle={destination.description || "Discover this amazing destination"}
        duration={destination.duration || ""}
        location={destination.location || ""}
        rating={destination.rating?.toString() || "0"}
        totalReviews={0}
        coverImage={destination.image}
      />

      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 overflow-hidden">
            {/* Package Info Header */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8 mt-5"
            >
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                  <span className="text-gray-700 font-medium">{destination.rating || 4.8} (0 reviews)</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-700 font-medium">{destination.duration || "7 Days, 6 Nights"}</span>
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
            </motion.div>

            {/* Section Content */}
            <motion.div 
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 mb-8 overflow-hidden"
            >
              {renderSectionContent()}
            </motion.div>

            {/* Travel Icons Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
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
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="sticky top-8 pb-8"
            >
              
              {/* Highlights Section */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-amber-50 border-l-4 border-yellow-400 mb-6 mt-5">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
                    Highlights
                  </h3>
                  {destination.highlights && destination.highlights.length > 0 ? (
                    <div className="space-y-3">
                      {destination.highlights.map((highlight: string, index: number) => (
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
                    <h3 className="text-2xl font-bold mb-6 text-white">Plan your trip to {destination.name}</h3>
                    <div className="mb-8">
                      <div className="flex items-baseline mb-3">
                        <span className="text-md text-blue-100 mr-2">Starting from</span>
                        {destination.price && (
                          <span className="text-4xl font-bold text-white">₹{destination.price?.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Button 
                        onClick={() => setIsLeadFormOpen(true)}
                        className="w-full bg-blue-600 text-white hover:bg-blue-700 py-4 text-lg font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 border-0 hover:cursor-pointer"
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
      <div className="container mx-auto px-2 py-1 max-w-6xl !pb-5 ">
        <Card className="bg-white rounded-2xl p-1 shadow-lg border border-gray-100">
          <CardContent className="p-0">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowTerms(!showTerms)}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Terms and Conditions</h3>
              </div>
              {showTerms ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
            
            {showTerms && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="prose prose-xs max-w-none text-gray-600 text-sm">
                  <div className="font-medium mb-4">
                    At Paradise Yatra, we aim to provide you with a seamless and enjoyable travel experience. 
                    Please read the following Terms & Conditions carefully, as they apply to all bookings made with us.
                  </div>
                  
                  <ol className="list-decimal pl-4 space-y-4">
                    <li>
                      <span className="font-medium text-gray-800">Booking & Payment</span>
                      <ul className="list-disc pl-4 mt-1 space-y-1 text-sm">
                        <li>A booking shall be considered confirmed only upon receipt of the advance payment.</li>
                        <li>The remaining balance must be settled prior to the commencement of the trip.</li>
                        <li>Payments may be made via bank transfer, UPI, debit/credit card, or other approved methods.</li>
                      </ul>
                    </li>
                    
                    <li>
                      <span className="font-medium text-gray-800">Itinerary & Changes</span>
                      <ul className="list-disc pl-4 mt-1 space-y-1 text-sm">
                        <li>The company reserves the right to alter, amend, or cancel itineraries due to unforeseen circumstances including but not limited to weather conditions, political disturbances, natural calamities, or transportation delays.</li>
                        <li>In the event of changes, we will endeavor to provide comparable alternatives at no additional cost. However, any extra expenses incurred shall be borne solely by the traveler.</li>
                      </ul>
                    </li>
                    
                    <li>
                      <span className="font-medium text-gray-800">Travel Documents & Identification</span>
                      <ul className="list-disc pl-4 mt-1 space-y-1 text-sm">
                        <li>All travelers are required to carry valid government-issued identification and any other necessary travel documents throughout the trip.</li>
                      </ul>
                    </li>
                    
                    <li>
                      <span className="font-medium text-gray-800">Responsibility for Personal Belongings</span>
                      <ul className="list-disc pl-4 mt-1 space-y-1 text-sm">
                        <li>Travelers are responsible for the safety and security of their luggage, valuables, and personal belongings. The company shall not be liable for any loss, theft, or damage.</li>
                      </ul>
                    </li>
                    
                    <li>
                      <span className="font-medium text-gray-800">Liability & Insurance</span>
                      <ul className="list-disc pl-4 mt-1 space-y-1 text-sm">
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

      <LeadCaptureForm
        isOpen={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
        packageTitle={destination.name}
        packagePrice={destination.price ? `₹${destination.price.toLocaleString()}` : ''}
      />
    </motion.div>
  );
}
