"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Star } from 'lucide-react';

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
}

const FixedDeparturesPage = () => {
  const [fixedDepartures, setFixedDepartures] = useState<FixedDeparture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFixedDepartures = async () => {
      try {
        const response = await fetch('/api/fixed-departures');
        if (response.ok) {
          const data = await response.json();
          setFixedDepartures(data.fixedDepartures || []);
        }
      } catch (error) {
        console.error('Error fetching fixed departures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFixedDepartures();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading fixed departures...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fixed Departure Tours</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our carefully curated fixed departure tours with guaranteed departure dates and exclusive experiences.
          </p>
        </div>

        {fixedDepartures.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No fixed departures available</h3>
            <p className="text-gray-600">Check back soon for upcoming tours!</p>
          </div>
        ) : (
          <div className="flex flex-nowrap md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto md:overflow-x-visible scrollbar-hide pb-4 md:pb-0">
            {fixedDepartures.map((departure) => (
              <Card key={departure._id} className="overflow-hidden hover:shadow-lg transition-shadow flex-shrink-0 w-80 md:w-auto">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                      {departure.title}
                    </h3>
                    {departure.isFeatured && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {departure.destination}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(departure.departureDate).toLocaleDateString()} - {new Date(departure.returnDate).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {departure.availableSeats}/{departure.totalSeats} seats available
                    </div>
                    <Badge className={getStatusColor(departure.status)}>
                      {departure.status}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {departure.shortDescription}
                  </p>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-2xl font-bold text-blue-600">
                      ₹{departure.price.toLocaleString()}
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedDeparturesPage;
