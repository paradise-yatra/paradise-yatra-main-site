"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { SkeletonPackageCard } from "@/components/ui/skeleton";
import Skeleton from "@/components/ui/skeleton";

interface HolidayType {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  duration: string;
  travelers: string;
  badge: string;
  price: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

const NewHolidaysSection = () => {
  const [categories, setCategories] = useState<HolidayType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHolidayTypes = async () => {
      try {
        const response = await fetch("/api/holiday-types");
        if (response.ok) {
          const data = await response.json();
          // Filter only active holiday types and sort by order
          const activeCategories = data
            .filter((item: HolidayType) => item.isActive)
            .sort((a: HolidayType, b: HolidayType) => a.order - b.order);
          setCategories(activeCategories);
        }
      } catch (error) {
        console.error("Error fetching holiday types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidayTypes();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton height="2.5rem" width="300px" className="mx-auto mb-4" />
            <Skeleton height="1.25rem" width="200px" className="mx-auto" />
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-80">
                <SkeletonPackageCard />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 !bg-blue-100 !font-regular !text-blue-800 !rounded-md hover:bg-blue-100 !px-1 !py-1">
            Holiday Types
          </Badge>
          <h2
            className=" text-slate-900 mb-4"
            style={{
              fontSize: "48px",
              fontWeight: 700,
              lineHeight: "48px",
            }}
          >
            Holidays for Every Traveler
          </h2>
          <p className="text-[20px] text-slate-600 max-w-3xl mx-auto">
            From beach getaways to mountain adventures, find the perfect holiday
            type that matches your travel style
          </p>
        </div>

        <div className="md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div key={category._id} className="h-full flex flex-col">
              <Link
                href={`/holiday-types/${category.slug}`}
                className="block h-full"
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group h-full border-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={
                        getImageUrl(category.image) ||
                        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      }
                      alt={category.title}
                      width={800}
                      height={400}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute top-4 left-4 mt-1">
                      <Badge className="!bg-[#3B82F6] text-white">
                        {category.badge}
                      </Badge>
                    </div>
                  </div>

                  <CardContent
                    className="!p-[22px]"
                    style={{
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    }}
                  >
                    <div
                      className="flex items-center text-slate-500 mb-2"
                      style={{ fontSize: "14px", lineHeight: "20px" }}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      {category.duration}
                    </div>
                    <h3
                      className="text-slate-900 mb-2 truncate group-hover:!text-[#2563EB] transition-colors"
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        lineHeight: "28px",
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                      }}
                    >
                      {category.title}
                    </h3>
                    <div
                      className="flex items-center text-slate-500 mb-4"
                      style={{ fontSize: "14px", lineHeight: "20px" }}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      {category.travelers}
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[24px] font-bold text-[#0F172A]">
                          ₹{category.price}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        className="hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          lineHeight: "20px",
                          height: "36px",
                          width: "144px",
                          padding: "8px 16px",
                        }}
                      >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/holiday-types">
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8">
              View All Holiday Types
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewHolidaysSection;
