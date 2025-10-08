"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Star, Clock, CheckCircle, XCircle, Award, Loader2, AlertCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { DayItineraryCard } from '@/components/itinerary';
import { LazyHeader } from '@/components/lazy-components';
import { getImageUrl } from '@/lib/utils';

interface FixedDeparture {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  destination: string;
  departureDate: string;
  returnDate: string;
  availableSeats: number;
  totalSeats: number;
  isFeatured: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  images?: string[];
  highlights?: string[];
  itinerary?: Array<{
    day: number;
    title: string;
    activities: string[];
    accommodation: string;
    meals: string;
    image?: string;
  }>;
  inclusions?: string[];
  exclusions?: string[];
  rating?: number;
  reviews?: Array<{
    _id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

type SectionType = 'overview' | 'itinerary' | 'included';

const FixedDepartureDetailPage = () => {
  const params = useParams();
  const [fixedDeparture, setFixedDeparture] = useState<FixedDeparture | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [expandedDays, setExpandedDays] = useState<number[]>([0, 1]); // Start with first two days expanded
  const [activeSection, setActiveSection] = useState<SectionType>('overview');
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    const fetchFixedDeparture = async () => {
      try {
        const response = await fetch(`/api/fixed-departures/slug/${params.slug}`);
        if (response.ok) {
          const data = await response.json();
          setFixedDeparture(data);
        }
      } catch (error) {
        console.error('Error fetching fixed departure:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchFixedDeparture();
    }
  }, [params.slug]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return Clock;
      case 'ongoing': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const calculateDuration = (departureDate: string, returnDate: string) => {
    const start = new Date(departureDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} Days`;
  };

  const toggleDayExpansion = (dayNumber: number) => {
    setExpandedDays(prev => 
      prev.includes(dayNumber) 
        ? prev.filter(d => d !== dayNumber)
        : [...prev, dayNumber]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 text-lg">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (!fixedDeparture) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Tour Not Found</h2>
          <p className="text-gray-600 mb-4">The tour you're looking for doesn't exist.</p>
          <Button 
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(fixedDeparture.status);
  const bookingPercentage = ((fixedDeparture.totalSeats - fixedDeparture.availableSeats) / fixedDeparture.totalSeats) * 100;
  const duration = calculateDuration(fixedDeparture.departureDate, fixedDeparture.returnDate);

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Tour Overview</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {fixedDeparture.description}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Award className="w-5 h-5 text-blue-600 mr-2" />
                  Tour Details
                </h3>
                <div className="space-y-4 flex-1">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Destination</div>
                      <div className="font-medium">{fixedDeparture.destination}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Departure</div>
                      <div className="font-medium">
                        {new Date(fixedDeparture.departureDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Return</div>
                      <div className="font-medium">
                        {new Date(fixedDeparture.returnDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="font-medium">{duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Users className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Group Size</div>
                      <div className="font-medium">{fixedDeparture.totalSeats} travelers</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Star className="w-5 h-5 text-amber-600 mr-2" />
                  Booking Progress
                </h3>
                <div className="space-y-5 flex-1">
                  <div className="flex items-center text-gray-700">
                    <Users className="w-5 h-5 mr-3 text-amber-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Booked Seats</div>
                      <div className="font-medium">
                        {fixedDeparture.totalSeats - fixedDeparture.availableSeats} / {fixedDeparture.totalSeats}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Progress</span>
                      <span className="text-sm font-bold text-amber-600">
                        {bookingPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-300 shadow-sm"
                        style={{ width: `${bookingPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 mr-3 text-amber-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Available Seats</div>
                      <div className="font-medium text-amber-600">
                        {fixedDeparture.availableSeats} seats left
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-100 rounded-lg p-3 text-center">
                    <div className="text-xs text-amber-700 font-medium">
                      {fixedDeparture.availableSeats > 10 ? 'Hurry! Limited seats available' : 'Almost full! Book now'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info moved here */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Clock className="w-5 h-5 text-green-600 mr-2" />
                  Quick Info
                </h3>
                <div className="space-y-4 flex-1">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Destination</div>
                      <div className="font-medium">{fixedDeparture.destination}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Departure Date</div>
                      <div className="font-medium">{new Date(fixedDeparture.departureDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="font-medium">{duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Users className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Available Seats</div>
                      <div className="font-medium text-green-600">{fixedDeparture.availableSeats} seats left</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        );
      case 'itinerary':
        return (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detailed Itinerary</h3>
            {fixedDeparture.itinerary && fixedDeparture.itinerary.length > 0 ? (
              <div className="space-y-3">
                {fixedDeparture.itinerary.map((day, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge className="bg-green-100 text-green-800 mr-3">Day {day.day || index + 1}</Badge>
                        <span className="text-gray-700 font-medium">{day.title || `Day ${day.day || index + 1}`}</span>
                      </div>
                      <button
                        onClick={() => toggleDayExpansion(index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {expandedDays.includes(index) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    {expandedDays.includes(index) && (
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
            ) : (
              <div className="text-center py-8 text-gray-500">
                No itinerary available for this package
              </div>
            )}
          </div>
        );
      case 'included':
        return (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">What's Included & Excluded</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {fixedDeparture.inclusions && fixedDeparture.inclusions.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Award className="w-5 h-5 text-blue-600 mr-2" />
                    What's Included
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    {fixedDeparture.inclusions.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {fixedDeparture.exclusions && fixedDeparture.exclusions.length > 0 && (
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    What's Excluded
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    {fixedDeparture.exclusions.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <XCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.section>
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
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50"
    >
      {/* Header Navbar */}
      <LazyHeader />

      {/* Hero Section */}
      <section className="relative h-[60vh] sm:h-[70vh] md:h-96 overflow-hidden">
        {/* Background Image */}
        <OptimizedImage 
          src={fixedDeparture.images && fixedDeparture.images.length > 0 ? fixedDeparture.images[0] : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
          alt={fixedDeparture.title}
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 "></div>
        
        {/* Content */}
        <div className="absolute inset-0 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-4xl w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
            >
              <Badge className={`${getStatusColor(fixedDeparture.status)} text-white border-0 text-xs sm:text-sm`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {fixedDeparture.status.charAt(0).toUpperCase() + fixedDeparture.status.slice(1)}
              </Badge>
              {fixedDeparture.isFeatured && (
                <Badge className="bg-yellow-400 text-yellow-900 border-0 text-xs sm:text-sm">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight"
            >
              {fixedDeparture.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 leading-relaxed"
            >
              {fixedDeparture.shortDescription}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm"
            >
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                <Clock className="w-4 h-4 mr-2" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{fixedDeparture.destination}</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(fixedDeparture.departureDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                <Users className="w-4 h-4 mr-2" />
                <span>{fixedDeparture.availableSeats} seats left</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 order-2 lg:order-1 space-y-8">
            {/* Tabs */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 mt-10"
            >
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-0.5">
                {(['overview', 'itinerary', 'included'] as SectionType[]).map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize ${
                      activeSection === section
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {section}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Section Content */}
            {renderSectionContent()}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2 space-y-8">
            {/* Highlights Section */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-amber-50 border-l-4 border-yellow-400 mt-10">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
                  Highlights
                </h3>
                {fixedDeparture.highlights && fixedDeparture.highlights.length > 0 ? (
                  <div className="space-y-3">
                    {fixedDeparture.highlights.map((highlight: string, index: number) => (
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

            {/* Pricing Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="sticky top-8" 
            >
              <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-400 to-indigo-700 text-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-white">Tour Price</h3>
                  <div className="mb-6">
                    <div className="text-4xl font-bold mb-2">{formatPrice(fixedDeparture.price)}</div>
                    <div className="text-blue-200">per person</div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-200">Available Seats:</span>
                      <span className="font-medium">{fixedDeparture.availableSeats}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-200">Status:</span>
                      <Badge className={`${getStatusColor(fixedDeparture.status)} text-white border-0`}>
                        {fixedDeparture.status.charAt(0).toUpperCase() + fixedDeparture.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setIsLeadFormOpen(true)}
                    className="w-full text-blue-600 hover:bg-gray-100 py-4 text-lg font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 mb-3"
                  >
                    Book This Tour
                  </Button>
                  
                  <p className="text-sm text-white mt-4 text-center">
                    Secure your spot with instant confirmation
                  </p>
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Terms and Conditions Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 !pt-10 !pb-10">
        <Card className="bg-white rounded-xl shadow-lg border border-gray-100">
          <CardContent className="p-4 sm:p-6">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowTerms(!showTerms)}
            >
              <div className="flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Terms and Conditions</h3>
              </div>
              {showTerms ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
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
                <div className="prose prose-xs max-w-none text-gray-600 text-xs sm:text-sm">
                  <div className="font-medium mb-3 sm:mb-4">
                    At Paradise Yatra, we aim to provide you with a seamless and enjoyable travel experience. 
                    Please read the following Terms & Conditions carefully, as they apply to all bookings made with us.
                  </div>
                  
                  <ol className="list-decimal pl-3 sm:pl-4 space-y-3 sm:space-y-4">
                    <li>
                      <span className="font-medium text-gray-800">Booking & Payment</span>
                      <ul className="list-disc pl-3 sm:pl-4 mt-1 space-y-1 text-xs sm:text-sm">
                        <li>A booking shall be considered confirmed only upon receipt of the advance payment.</li>
                        <li>The remaining balance must be settled prior to the commencement of the trip.</li>
                        <li>Payments may be made via bank transfer, UPI, debit/credit card, or other approved methods.</li>
                      </ul>
                    </li>
                    
                    <li>
                      <span className="font-medium text-gray-800">Itinerary & Changes</span>
                      <ul className="list-disc pl-3 sm:pl-4 mt-1 space-y-1 text-xs sm:text-sm">
                        <li>The company reserves the right to alter, amend, or cancel itineraries due to unforeseen circumstances including but not limited to weather conditions, political disturbances, natural calamities, or transportation delays.</li>
                        <li>In the event of changes, we will endeavor to provide comparable alternatives at no additional cost. However, any extra expenses incurred shall be borne solely by the traveler.</li>
                      </ul>
                    </li>
                    
                    <li>
                      <span className="font-medium text-gray-800">Travel Documents & Identification</span>
                      <ul className="list-disc pl-3 sm:pl-4 mt-1 space-y-1 text-xs sm:text-sm">
                        <li>All travelers are required to carry valid government-issued identification and any other necessary travel documents throughout the trip.</li>
                      </ul>
                    </li>
                    
                    <li>
                      <span className="font-medium text-gray-800">Responsibility for Personal Belongings</span>
                      <ul className="list-disc pl-3 sm:pl-4 mt-1 space-y-1 text-xs sm:text-sm">
                        <li>Travelers are responsible for the safety and security of their luggage, valuables, and personal belongings. The company shall not be liable for any loss, theft, or damage.</li>
                      </ul>
                    </li>
                    
                    <li>
                      <span className="font-medium text-gray-800">Liability & Insurance</span>
                      <ul className="list-disc pl-3 sm:pl-4 mt-1 space-y-1 text-xs sm:text-sm">
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
        packageTitle={fixedDeparture.title}
        packagePrice={formatPrice(fixedDeparture.price)}
      />
    </motion.div>
  );
};

export default FixedDepartureDetailPage;
