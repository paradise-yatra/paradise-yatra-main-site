"use client";

import { useState, useEffect } from "react";
import { Globe, MapPin, Calendar, Star, Shield, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import Skeleton from "@/components/ui/skeleton";

interface CTAContent {
  title: string;
  description: string;
  backgroundImage: string;
}

const CTASection = () => {
  const [ctaContent, setCTAContent] = useState<CTAContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCTAContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/cta');
        
        if (!response.ok) {
          throw new Error('Failed to fetch CTA content');
        }
        
        const data = await response.json();
        setCTAContent(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching CTA content:', err);
        setError('Failed to load CTA content');
        // Set default content as fallback
        setCTAContent({
          title: "Ready for Your Next Adventure?",
          description: "Join thousands of travelers who trust Paradise Yatra for their dream vacations. Start planning your perfect journey today and create memories that last a lifetime.",
          backgroundImage: "/banner.jpeg"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCTAContent();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <div className="mb-8">
              <Skeleton height="2.5rem" width="300px" className="mx-auto mb-4 bg-white/20" />
              <Skeleton height="1.25rem" width="200px" className="mx-auto bg-white/20" />
            </div>
            <div className="max-w-3xl mx-auto mb-8">
              <Skeleton height="1.5rem" width="100%" className="mb-4 bg-white/20" />
              <Skeleton height="1.5rem" width="80%" className="mx-auto bg-white/20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="text-center">
                  <Skeleton width="60px" height="60px" className="mx-auto mb-4 rounded-full bg-white/20" />
                  <Skeleton height="1rem" width="120px" className="mx-auto mb-2 bg-white/20" />
                  <Skeleton height="0.875rem" width="100px" className="mx-auto bg-white/20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section 
      className="section-padding text-white relative overflow-hidden px-4 sm:px-6" 
      style={{
        backgroundImage: `url(${ctaContent?.backgroundImage || '/banner.jpeg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 sm:w-32 sm:h-32 border-2 border-white/20 rounded-full animate-float"></div>
        <div className="absolute top-20 right-20 w-16 h-16 sm:w-24 sm:h-24 border-2 border-white/20 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 sm:w-40 sm:h-40 border-2 border-white/20 rounded-full animate-float animation-delay-4000"></div>
        <div className="absolute bottom-10 right-10 w-12 h-12 sm:w-16 sm:h-16 border-2 border-white/20 rounded-full animate-float animation-delay-6000"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-8 sm:mb-12"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex items-center justify-center gap-2 mb-3 sm:mb-4"
            >
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-yellow-400 text-sm sm:text-base font-semibold tracking-wide">Ready to Explore?</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight px-2"
            >
              {ctaContent?.title || "Ready for Your Next Adventure?"}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed font-nunito font-light px-2"
            >
              {ctaContent?.description || "Join thousands of travelers who trust Paradise Yatra for their dream vacations. Start planning your perfect journey today and create memories that last a lifetime."}
            </motion.p>
          </motion.div>

          {/* Features */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16"
          >
            {[
              { icon: Globe, title: "Global Destinations", desc: "Explore 50+ countries worldwide", color: "text-blue-300" },
              { icon: MapPin, title: "Customized Tours", desc: "Personalized experiences for you", color: "text-green-300" },
              { icon: Calendar, title: "Flexible Booking", desc: "Book now, travel when you want", color: "text-purple-300" },
              { icon: Shield, title: "Safe Travel", desc: "Your safety is our priority", color: "text-yellow-300" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.0 + index * 0.2 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="flex flex-col items-center space-y-2 sm:space-y-3 p-4 sm:p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ${feature.color}`}
                >
                  <feature.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                </motion.div>
                <h3 className="font-semibold text-sm sm:text-lg">{feature.title}</h3>
                <p className="text-blue-100 text-xs sm:text-sm text-center">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>


          {/* Trust indicators */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 2.0 }}
            className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs sm:text-sm text-blue-200"
          >
            {[
              { icon: Users, text: "500+ Happy Travelers" },
              { icon: Star, text: "4.9/5 Rating" },
              { icon: Clock, text: "24/7 Support" },
              { icon: Shield, text: "Safe & Secure" }
            ].map((indicator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 2.2 + index * 0.1 }}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                <indicator.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium text-xs sm:text-sm">{indicator.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;